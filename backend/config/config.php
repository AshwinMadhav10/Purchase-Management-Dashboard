<?php
// ============================================================
// config.php — Central configuration for the Purchase Management Dashboard
// ============================================================

define('DATA_DIR', __DIR__ . '/../data/');

define('FILE_SUPPLIERS',  DATA_DIR . 'suppliers.json');
define('FILE_ITEMS',      DATA_DIR . 'items.json');
define('FILE_PO',         DATA_DIR . 'purchase_orders.json');

// Allow cross-origin requests (needed for frontend served separately)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Handle pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
