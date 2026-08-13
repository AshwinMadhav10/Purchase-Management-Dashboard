<?php
// ============================================================
// response.php — Common API response helpers
// ============================================================

function send_success($data = [], $message = 'Success', $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data,
    ]);
    exit;
}

function send_error($message = 'Error', $errors = [], $code = 400) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors'  => $errors,
    ]);
    exit;
}

function get_request_body() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        send_error('Invalid JSON in request body.', [], 400);
    }
    return $data;
}

function read_json($file) {
    if (!file_exists($file)) return [];
    $content = file_get_contents($file);
    if (empty($content)) return [];
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function write_json($file, $data) {
    $dir = dirname($file);
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    return file_put_contents($file, json_encode(array_values($data), JSON_PRETTY_PRINT));
}

function generate_id($prefix, $records, $field = 'id') {
    $max = 0;
    foreach ($records as $r) {
        $num = (int) preg_replace('/\D/', '', $r[$field] ?? '');
        if ($num > $max) $max = $num;
    }
    return $prefix . str_pad($max + 1, 4, '0', STR_PAD_LEFT);
}
