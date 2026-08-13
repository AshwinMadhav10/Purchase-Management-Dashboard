<?php
// ============================================================
// purchase-orders.php — Purchase Order CRUD API
// ============================================================
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// ---- Helper: generate PO number ---------------------------
function generate_po_number($records) {
    $year = date('Y');
    $max  = 0;
    foreach ($records as $r) {
        if (preg_match('/PO-' . $year . '-(\d+)/', $r['po_number'] ?? '', $m)) {
            $num = (int)$m[1];
            if ($num > $max) $max = $num;
        }
    }
    return 'PO-' . $year . '-' . str_pad($max + 1, 4, '0', STR_PAD_LEFT);
}

// ---- Helper: recalculate totals ---------------------------
function recalculate_totals(&$po) {
    $subtotal        = 0;
    $total_discount  = 0;
    $total_tax       = 0;
    foreach ($po['items'] as &$item) {
        $qty      = (float)($item['quantity']   ?? 0);
        $price    = (float)($item['unit_price'] ?? 0);
        $disc     = (float)($item['discount']   ?? 0);  // percentage
        $tax      = (float)($item['tax']        ?? 0);  // percentage

        $line_base      = $qty * $price;
        $line_disc      = $line_base * ($disc / 100);
        $line_after_disc= $line_base - $line_disc;
        $line_tax       = $line_after_disc * ($tax / 100);
        $line_total     = $line_after_disc + $line_tax;

        $item['line_total'] = round($line_total, 2);
        $subtotal       += $line_base;
        $total_discount += $line_disc;
        $total_tax      += $line_tax;
    }
    $additional = (float)($po['additional_charges'] ?? 0);
    $po['subtotal']          = round($subtotal, 2);
    $po['total_discount']    = round($total_discount, 2);
    $po['total_tax']         = round($total_tax, 2);
    $po['additional_charges']= round($additional, 2);
    $po['grand_total']       = round($subtotal - $total_discount + $total_tax + $additional, 2);
}

// ---- Helper: validate PO ----------------------------------
function validate_po($data) {
    $errors = [];
    $req = validate_required($data, ['po_date', 'supplier_id', 'supplier_name']);
    $errors = array_merge($errors, $req);

    if (empty($data['items']) || !is_array($data['items'])) {
        $errors[] = "At least one item is required.";
    } else {
        foreach ($data['items'] as $idx => $item) {
            $row = $idx + 1;
            if (empty($item['item_id'])) $errors[] = "Row $row: Item is required.";
            if (!validate_numeric($item['quantity'] ?? 0, 0.001)) $errors[] = "Row $row: Quantity must be greater than 0.";
            if (!validate_numeric($item['unit_price'] ?? 0, 0))   $errors[] = "Row $row: Unit price must be a non-negative number.";
            if (!validate_numeric($item['discount'] ?? 0, 0))     $errors[] = "Row $row: Discount must be non-negative.";
            if (!validate_numeric($item['tax'] ?? 0, 0))          $errors[] = "Row $row: Tax must be non-negative.";
        }
    }
    if (!empty($data['po_date']) && !validate_date($data['po_date'])) {
        $errors[] = "PO Date is invalid.";
    }
    if (!empty($data['expected_delivery_date']) && !validate_date($data['expected_delivery_date'])) {
        $errors[] = "Expected Delivery Date is invalid.";
    }
    if (!validate_numeric($data['additional_charges'] ?? 0, 0)) {
        $errors[] = "Additional charges must be non-negative.";
    }
    return $errors;
}

switch ($method) {
    case 'GET':
        $orders = read_json(FILE_PO);
        // filter by status
        $status = trim($_GET['status'] ?? '');
        if ($status !== '') {
            $orders = array_filter($orders, fn($o) => strtolower($o['status'] ?? '') === strtolower($status));
        }
        // search
        $q = strtolower(trim($_GET['q'] ?? ''));
        if ($q !== '') {
            $orders = array_filter($orders, function($o) use ($q) {
                return str_contains(strtolower($o['po_number'] ?? ''), $q)
                    || str_contains(strtolower($o['supplier_name'] ?? ''), $q);
            });
        }
        // single record
        if ($id) {
            $orders = array_values($orders);
            $found  = array_filter($orders, fn($o) => $o['id'] === $id);
            if (empty($found)) send_error('Purchase Order not found.', [], 404);
            send_success(array_values($found)[0]);
        }
        send_success(array_values($orders));

    case 'POST':
        $data   = get_request_body();
        $errors = validate_po($data);
        if ($errors) send_error('Validation failed.', $errors);

        $orders = read_json(FILE_PO);
        $po = [
            'id'                      => generate_id('PO', $orders),
            'po_number'               => generate_po_number($orders),
            'po_date'                 => sanitize_string($data['po_date']),
            'supplier_id'             => sanitize_string($data['supplier_id']),
            'supplier_name'           => sanitize_string($data['supplier_name']),
            'expected_delivery_date'  => sanitize_string($data['expected_delivery_date'] ?? ''),
            'reference_number'        => sanitize_string($data['reference_number'] ?? ''),
            'payment_terms'           => sanitize_string($data['payment_terms'] ?? ''),
            'delivery_location'       => sanitize_string($data['delivery_location'] ?? ''),
            'notes'                   => sanitize_string($data['notes'] ?? ''),
            'additional_charges'      => sanitize_float($data['additional_charges'] ?? 0),
            'status'                  => in_array($data['status'] ?? '', ['Draft','Pending','Completed','Cancelled']) ? $data['status'] : 'Draft',
            'created_by'              => sanitize_string($data['created_by'] ?? 'Admin'),
            'items'                   => [],
            'created_at'              => date('Y-m-d H:i:s'),
        ];
        // Process items
        foreach ($data['items'] as $item) {
            $po['items'][] = [
                'item_id'     => sanitize_string($item['item_id']),
                'item_code'   => sanitize_string($item['item_code'] ?? ''),
                'item_name'   => sanitize_string($item['item_name'] ?? ''),
                'description' => sanitize_string($item['description'] ?? ''),
                'quantity'    => sanitize_float($item['quantity']),
                'unit'        => sanitize_string($item['unit'] ?? ''),
                'unit_price'  => sanitize_float($item['unit_price']),
                'discount'    => sanitize_float($item['discount'] ?? 0),
                'tax'         => sanitize_float($item['tax'] ?? 0),
                'line_total'  => 0,
            ];
        }
        recalculate_totals($po);
        $orders[] = $po;
        write_json(FILE_PO, $orders);
        send_success($po, 'Purchase Order created successfully.', 201);

    case 'PUT':
        if (!$id) send_error('Purchase Order ID required.', [], 400);
        $data   = get_request_body();
        $errors = validate_po($data);
        if ($errors) send_error('Validation failed.', $errors);

        $orders = read_json(FILE_PO);
        $found  = false;
        foreach ($orders as &$po) {
            if ($po['id'] === $id) {
                $po['po_date']                = sanitize_string($data['po_date']);
                $po['supplier_id']            = sanitize_string($data['supplier_id']);
                $po['supplier_name']          = sanitize_string($data['supplier_name']);
                $po['expected_delivery_date'] = sanitize_string($data['expected_delivery_date'] ?? '');
                $po['reference_number']       = sanitize_string($data['reference_number'] ?? '');
                $po['payment_terms']          = sanitize_string($data['payment_terms'] ?? '');
                $po['delivery_location']      = sanitize_string($data['delivery_location'] ?? '');
                $po['notes']                  = sanitize_string($data['notes'] ?? '');
                $po['additional_charges']     = sanitize_float($data['additional_charges'] ?? 0);
                $po['status']                 = in_array($data['status'] ?? '', ['Draft','Pending','Completed','Cancelled']) ? $data['status'] : $po['status'];
                $po['items'] = [];
                foreach ($data['items'] as $item) {
                    $po['items'][] = [
                        'item_id'     => sanitize_string($item['item_id']),
                        'item_code'   => sanitize_string($item['item_code'] ?? ''),
                        'item_name'   => sanitize_string($item['item_name'] ?? ''),
                        'description' => sanitize_string($item['description'] ?? ''),
                        'quantity'    => sanitize_float($item['quantity']),
                        'unit'        => sanitize_string($item['unit'] ?? ''),
                        'unit_price'  => sanitize_float($item['unit_price']),
                        'discount'    => sanitize_float($item['discount'] ?? 0),
                        'tax'         => sanitize_float($item['tax'] ?? 0),
                        'line_total'  => 0,
                    ];
                }
                recalculate_totals($po);
                $po['updated_at'] = date('Y-m-d H:i:s');
                $found   = true;
                $updated = $po;
                break;
            }
        }
        if (!$found) send_error('Purchase Order not found.', [], 404);
        write_json(FILE_PO, $orders);
        send_success($updated, 'Purchase Order updated successfully.');

    case 'DELETE':
        if (!$id) send_error('Purchase Order ID required.', [], 400);
        $orders   = read_json(FILE_PO);
        $filtered = array_filter($orders, fn($o) => $o['id'] !== $id);
        if (count($filtered) === count($orders)) send_error('Purchase Order not found.', [], 404);
        write_json(FILE_PO, $filtered);
        send_success([], 'Purchase Order deleted successfully.');

    default:
        send_error('Method not allowed.', [], 405);
}
