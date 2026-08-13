<?php
// ============================================================
// suppliers.php — Supplier Master CRUD API
// ============================================================
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        $suppliers = read_json(FILE_SUPPLIERS);
        $q = strtolower(trim($_GET['q'] ?? ''));
        if ($q !== '') {
            $suppliers = array_filter($suppliers, function($s) use ($q) {
                return str_contains(strtolower($s['name'] ?? ''), $q)
                    || str_contains(strtolower($s['code'] ?? ''), $q)
                    || str_contains(strtolower($s['email'] ?? ''), $q);
            });
        }
        send_success(array_values($suppliers));

    case 'POST':
        $data   = get_request_body();
        $errors = validate_required($data, ['name', 'contact_person', 'phone', 'email']);

        if (!empty($data['email']) && !validate_email($data['email'])) {
            $errors[] = "Invalid email address.";
        }

        if ($errors) send_error('Validation failed.', $errors);

        $suppliers = read_json(FILE_SUPPLIERS);
        $supplier  = [
            'id'            => generate_id('SUP', $suppliers),
            'code'          => generate_id('SC', $suppliers, 'code'),
            'name'          => sanitize_string($data['name']),
            'contact_person'=> sanitize_string($data['contact_person']),
            'phone'         => sanitize_string($data['phone']),
            'email'         => sanitize_string($data['email']),
            'address'       => sanitize_string($data['address'] ?? ''),
            'tax_number'    => sanitize_string($data['tax_number'] ?? ''),
            'payment_terms' => sanitize_string($data['payment_terms'] ?? ''),
            'status'        => in_array($data['status'] ?? '', ['Active','Inactive']) ? $data['status'] : 'Active',
            'created_at'    => date('Y-m-d H:i:s'),
        ];
        $suppliers[] = $supplier;
        write_json(FILE_SUPPLIERS, $suppliers);
        send_success($supplier, 'Supplier created successfully.', 201);

    case 'PUT':
        if (!$id) send_error('Supplier ID required.', [], 400);
        $data      = get_request_body();
        $errors    = validate_required($data, ['name', 'contact_person', 'phone', 'email']);
        if (!empty($data['email']) && !validate_email($data['email'])) {
            $errors[] = "Invalid email address.";
        }
        if ($errors) send_error('Validation failed.', $errors);

        $suppliers = read_json(FILE_SUPPLIERS);
        $found     = false;
        foreach ($suppliers as &$s) {
            if ($s['id'] === $id) {
                $s['name']          = sanitize_string($data['name']);
                $s['contact_person']= sanitize_string($data['contact_person']);
                $s['phone']         = sanitize_string($data['phone']);
                $s['email']         = sanitize_string($data['email']);
                $s['address']       = sanitize_string($data['address'] ?? '');
                $s['tax_number']    = sanitize_string($data['tax_number'] ?? '');
                $s['payment_terms'] = sanitize_string($data['payment_terms'] ?? '');
                $s['status']        = in_array($data['status'] ?? '', ['Active','Inactive']) ? $data['status'] : $s['status'];
                $s['updated_at']    = date('Y-m-d H:i:s');
                $found = true;
                $updated = $s;
                break;
            }
        }
        if (!$found) send_error('Supplier not found.', [], 404);
        write_json(FILE_SUPPLIERS, $suppliers);
        send_success($updated, 'Supplier updated successfully.');

    case 'DELETE':
        if (!$id) send_error('Supplier ID required.', [], 400);
        $suppliers = read_json(FILE_SUPPLIERS);
        $filtered  = array_filter($suppliers, fn($s) => $s['id'] !== $id);
        if (count($filtered) === count($suppliers)) send_error('Supplier not found.', [], 404);
        write_json(FILE_SUPPLIERS, $filtered);
        send_success([], 'Supplier deleted successfully.');

    default:
        send_error('Method not allowed.', [], 405);
}
