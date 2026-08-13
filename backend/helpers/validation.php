<?php
// ============================================================
// validation.php — Reusable validation functions
// ============================================================

function validate_required($data, array $fields) {
    $errors = [];
    foreach ($fields as $f) {
        if (!isset($data[$f]) || trim((string)$data[$f]) === '') {
            $errors[] = "Field '$f' is required.";
        }
    }
    return $errors;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validate_numeric($value, $min = 0) {
    if (!is_numeric($value)) return false;
    return (float)$value >= $min;
}

function validate_date($date_str) {
    if (empty($date_str)) return false;
    $d = DateTime::createFromFormat('Y-m-d', $date_str);
    return $d && $d->format('Y-m-d') === $date_str;
}

function sanitize_string($val) {
    return htmlspecialchars(trim((string)$val), ENT_QUOTES, 'UTF-8');
}

function sanitize_float($val) {
    return round((float)$val, 2);
}

function sanitize_int($val) {
    return (int)$val;
}
