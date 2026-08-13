<?php
// ============================================================
// dashboard.php — Dashboard Statistics API
// ============================================================
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_error('Method not allowed.', [], 405);
}

$orders    = read_json(FILE_PO);
$suppliers = read_json(FILE_SUPPLIERS);

$total     = count($orders);
$draft     = 0;
$pending   = 0;
$completed = 0;
$cancelled = 0;
$grand_total_sum = 0;

// Status breakdown
$status_map = [];
foreach ($orders as $o) {
    $s = strtolower($o['status'] ?? 'draft');
    if ($s === 'draft')     $draft++;
    if ($s === 'pending')   $pending++;
    if ($s === 'completed') $completed++;
    if ($s === 'cancelled') $cancelled++;
    $grand_total_sum += (float)($o['grand_total'] ?? 0);
    $status_map[$s] = ($status_map[$s] ?? 0) + 1;
}

// Recent 5 POs (newest first)
$recent = array_reverse($orders);
$recent = array_slice($recent, 0, 5);
$recent = array_map(fn($o) => [
    'id'            => $o['id'],
    'po_number'     => $o['po_number'],
    'supplier_name' => $o['supplier_name'],
    'po_date'       => $o['po_date'],
    'grand_total'   => $o['grand_total'],
    'status'        => $o['status'],
], $recent);

send_success([
    'total_po'        => $total,
    'draft_po'        => $draft,
    'pending_po'      => $pending,
    'completed_po'    => $completed,
    'cancelled_po'    => $cancelled,
    'total_value'     => round($grand_total_sum, 2),
    'total_suppliers' => count($suppliers),
    'total_items'     => count(read_json(FILE_ITEMS)),
    'status_chart'    => [
        ['label' => 'Draft',     'value' => $draft,     'color' => '#6366f1'],
        ['label' => 'Pending',   'value' => $pending,   'color' => '#f59e0b'],
        ['label' => 'Completed', 'value' => $completed, 'color' => '#10b981'],
        ['label' => 'Cancelled', 'value' => $cancelled, 'color' => '#ef4444'],
    ],
    'recent_orders'   => $recent,
]);
