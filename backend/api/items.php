<?php
// ============================================================
// items.php — Item Master CRUD API
// ============================================================
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        $items = read_json(FILE_ITEMS);
        $q = strtolower(trim($_GET['q'] ?? ''));
        if ($q !== '') {
            $items = array_filter($items, function($i) use ($q) {
                return str_contains(strtolower($i['name'] ?? ''), $q)
                    || str_contains(strtolower($i['code'] ?? ''), $q)
                    || str_contains(strtolower($i['category'] ?? ''), $q);
            });
        }
        send_success(array_values($items));

    case 'POST':
        $data   = get_request_body();
        $errors = validate_required($data, ['name', 'unit', 'purchase_price']);
        if (!empty($data['purchase_price']) && !validate_numeric($data['purchase_price'], 0)) {
            $errors[] = "Purchase price must be a non-negative number.";
        }
        if ($errors) send_error('Validation failed.', $errors);

        $items = read_json(FILE_ITEMS);
        $item  = [
            'id'             => generate_id('ITM', $items),
            'code'           => generate_id('IC', $items, 'code'),
            'name'           => sanitize_string($data['name']),
            'description'    => sanitize_string($data['description'] ?? ''),
            'category'       => sanitize_string($data['category'] ?? ''),
            'unit'           => sanitize_string($data['unit']),
            'purchase_price' => sanitize_float($data['purchase_price']),
            'tax'            => sanitize_float($data['tax'] ?? 0),
            'status'         => in_array($data['status'] ?? '', ['Active','Inactive']) ? $data['status'] : 'Active',
            'created_at'     => date('Y-m-d H:i:s'),
        ];
        $items[] = $item;
        write_json(FILE_ITEMS, $items);
        send_success($item, 'Item created successfully.', 201);

    case 'PUT':
        if (!$id) send_error('Item ID required.', [], 400);
        $data   = get_request_body();
        $errors = validate_required($data, ['name', 'unit', 'purchase_price']);
        if (!empty($data['purchase_price']) && !validate_numeric($data['purchase_price'], 0)) {
            $errors[] = "Purchase price must be a non-negative number.";
        }
        if ($errors) send_error('Validation failed.', $errors);

        $items = read_json(FILE_ITEMS);
        $found = false;
        foreach ($items as &$i) {
            if ($i['id'] === $id) {
                $i['name']           = sanitize_string($data['name']);
                $i['description']    = sanitize_string($data['description'] ?? '');
                $i['category']       = sanitize_string($data['category'] ?? '');
                $i['unit']           = sanitize_string($data['unit']);
                $i['purchase_price'] = sanitize_float($data['purchase_price']);
                $i['tax']            = sanitize_float($data['tax'] ?? 0);
                $i['status']         = in_array($data['status'] ?? '', ['Active','Inactive']) ? $data['status'] : $i['status'];
                $i['updated_at']     = date('Y-m-d H:i:s');
                $found   = true;
                $updated = $i;
                break;
            }
        }
        if (!$found) send_error('Item not found.', [], 404);
        write_json(FILE_ITEMS, $items);
        send_success($updated, 'Item updated successfully.');

    case 'DELETE':
        if (!$id) send_error('Item ID required.', [], 400);
        $items    = read_json(FILE_ITEMS);
        $filtered = array_filter($items, fn($i) => $i['id'] !== $id);
        if (count($filtered) === count($items)) send_error('Item not found.', [], 404);
        write_json(FILE_ITEMS, $filtered);
        send_success([], 'Item deleted successfully.');

    default:
        send_error('Method not allowed.', [], 405);
}
