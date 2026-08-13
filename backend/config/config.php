<?php
// ============================================================
// config.php — Central configuration for the Purchase Management Dashboard
// ============================================================

// Suppress HTML error output — errors must never corrupt JSON responses
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);

define('DATA_DIR', __DIR__ . '/../data/');

define('FILE_SUPPLIERS',  DATA_DIR . 'suppliers.json');
define('FILE_ITEMS',      DATA_DIR . 'items.json');
define('FILE_PO',         DATA_DIR . 'purchase_orders.json');

// Allow cross-origin requests (needed for frontend served separately)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Handle pre-flight OPTIONS requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
