// ============================================================
// purchase-orders.js — Purchase Orders list page logic
// ============================================================

let allOrders   = [];
let activeStatus = '';
let viewingId    = null;

async function loadOrders(status = '', q = '') {
  const params = {};
  if (status) params.status = status;
  if (q)      params.q = q;

  const res = await Api.getPurchaseOrders(params);
  if (!res.success) { Toast.error(res.message); return; }

  allOrders = res.data;
  document.getElementById('po-count').textContent = `(${allOrders.length})`;
  renderOrders(allOrders);
}

function renderOrders(list) {
  const tbody = document.getElementById('po-tbody');
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">
      <div class="empty-state" style="padding:40px 20px;">
        <div class="empty-state-icon">📋</div>
        <h3>No purchase orders found</h3>
        <p>Create your first purchase order to get started.</p>
        <a href="create-purchase-order.html" class="btn btn-primary btn-sm" style="margin-top:12px;">＋ Create PO</a>
      </div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(o => `
    <tr>
      <td>
        <span class="fw-600" style="color:var(--primary);cursor:pointer;" onclick="viewOrder('${o.id}')">${o.po_number}</span>
      </td>
      <td>${formatDate(o.po_date)}</td>
      <td class="fw-600">${o.supplier_name}</td>
      <td>${o.expected_delivery_date ? formatDate(o.expected_delivery_date) : '—'}</td>
      <td class="number-cell fw-600">${formatCurrency(o.grand_total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${o.created_by || 'Admin'}</td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-xs" onclick="viewOrder('${o.id}')" id="view-po-${o.id}" title="View">👁️</button>
        <a href="create-purchase-order.html?id=${o.id}" class="btn btn-outline btn-xs" id="edit-po-${o.id}" style="margin-left:4px;" title="Edit">✏️</a>
        <button class="btn btn-danger btn-xs" onclick="deleteOrder('${o.id}','${o.po_number}')" id="del-po-${o.id}" style="margin-left:4px;" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

async function viewOrder(id) {
  viewingId = id;
  const res = await Api.getPurchaseOrder(id);
  if (!res.success) { Toast.error(res.message); return; }

  const o = res.data;
  document.getElementById('view-po-title').textContent = `${o.po_number} — ${o.supplier_name}`;
  document.getElementById('btn-edit-from-view').onclick = () => {
    window.location.href = `create-purchase-order.html?id=${id}`;
  };

  document.getElementById('view-po-body').innerHTML = `
    <div class="form-row cols-3" style="margin-bottom:18px;">
      <div><div class="form-label">PO Number</div><div class="fw-600">${o.po_number}</div></div>
      <div><div class="form-label">PO Date</div><div>${formatDate(o.po_date)}</div></div>
      <div><div class="form-label">Status</div><div>${statusBadge(o.status)}</div></div>
      <div><div class="form-label">Supplier</div><div class="fw-600">${o.supplier_name}</div></div>
      <div><div class="form-label">Delivery Date</div><div>${o.expected_delivery_date ? formatDate(o.expected_delivery_date) : '—'}</div></div>
      <div><div class="form-label">Payment Terms</div><div>${o.payment_terms || '—'}</div></div>
      <div><div class="form-label">Reference No.</div><div>${o.reference_number || '—'}</div></div>
      <div><div class="form-label">Delivery Location</div><div>${o.delivery_location || '—'}</div></div>
      <div><div class="form-label">Created By</div><div>${o.created_by || 'Admin'}</div></div>
    </div>
    ${o.notes ? `<div style="margin-bottom:18px;"><div class="form-label">Notes</div><div style="color:var(--text-secondary);">${o.notes}</div></div>` : ''}
    <hr class="form-divider" />
    <div class="form-label" style="margin-bottom:10px;">Items</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>#</th><th>Item Code</th><th>Name</th><th>Description</th>
            <th class="number-cell">Qty</th><th>Unit</th>
            <th class="number-cell">Unit Price</th>
            <th class="number-cell">Disc %</th>
            <th class="number-cell">Tax %</th>
            <th class="number-cell">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${(o.items || []).map((item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><code style="font-size:12px;">${item.item_code}</code></td>
              <td class="fw-600">${item.item_name}</td>
              <td style="color:var(--text-secondary);">${item.description || '—'}</td>
              <td class="number-cell">${item.quantity}</td>
              <td>${item.unit}</td>
              <td class="number-cell">${formatCurrency(item.unit_price)}</td>
              <td class="number-cell">${item.discount}%</td>
              <td class="number-cell">${item.tax}%</td>
              <td class="number-cell fw-600">${formatCurrency(item.line_total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="po-summary" style="margin-top:16px;">
      <div class="po-summary-row"><span>Subtotal</span><span>${formatCurrency(o.subtotal)}</span></div>
      <div class="po-summary-row"><span>Total Discount</span><span style="color:var(--danger);">- ${formatCurrency(o.total_discount)}</span></div>
      <div class="po-summary-row"><span>Total Tax</span><span>${formatCurrency(o.total_tax)}</span></div>
      <div class="po-summary-row"><span>Additional Charges</span><span>${formatCurrency(o.additional_charges)}</span></div>
      <div class="po-summary-row grand"><span>Grand Total</span><span>${formatCurrency(o.grand_total)}</span></div>
    </div>
  `;
  Modal.open('view-po-modal');
}

async function deleteOrder(id, poNumber) {
  showConfirm({
    title:       'Delete Purchase Order?',
    message:     `"${poNumber}" will be permanently deleted.`,
    confirmText: 'Delete',
    icon:        '🗑️',
    onConfirm:   async () => {
      const res = await Api.deletePurchaseOrder(id);
      if (!res.success) { Toast.error(res.message); return; }
      Toast.success(res.message);
      loadOrders(activeStatus);
    },
  });
}

// Status filter tabs
document.addEventListener('DOMContentLoaded', () => {
  loadOrders();

  document.querySelectorAll('[data-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-status]').forEach(b => {
        b.className = 'btn btn-sm btn-outline';
      });
      btn.className = 'btn btn-sm btn-primary';
      activeStatus = btn.dataset.status;
      loadOrders(activeStatus, document.getElementById('po-search').value.trim());
    });
  });

  let searchTimer;
  document.getElementById('po-search').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadOrders(activeStatus, e.target.value.trim()), 350);
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => Modal.close(btn.dataset.close));
  });
});
