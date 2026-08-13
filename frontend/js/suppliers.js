// ============================================================
// suppliers.js — Supplier Master page logic
// ============================================================

let allSuppliers = [];
let editingId    = null;

async function loadSuppliers(q = '') {
  const tbody = document.getElementById('suppliers-tbody');
  showLoading({ innerHTML: '' }); // silent
  const res = await Api.getSuppliers(q);
  if (!res.success) { Toast.error(res.message); return; }

  allSuppliers = res.data;
  document.getElementById('supplier-count').textContent = `(${allSuppliers.length})`;
  renderSuppliers(allSuppliers);
}

function renderSuppliers(list) {
  const tbody = document.getElementById('suppliers-tbody');
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">
      <div class="empty-state" style="padding:40px 20px;">
        <div class="empty-state-icon">🏢</div>
        <h3>No suppliers found</h3>
        <p>Add your first supplier to get started.</p>
      </div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(s => `
    <tr>
      <td><span class="fw-600">${s.id}</span></td>
      <td><code style="background:var(--primary-light);color:var(--primary);padding:2px 7px;border-radius:4px;font-size:12px;">${s.code}</code></td>
      <td class="fw-600">${s.name}</td>
      <td>${s.contact_person}</td>
      <td>${s.phone}</td>
      <td>${s.email}</td>
      <td>${s.payment_terms || '—'}</td>
      <td>${statusBadge(s.status)}</td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-xs" onclick="openEditSupplier('${s.id}')" id="edit-sup-${s.id}">✏️ Edit</button>
        <button class="btn btn-danger btn-xs" onclick="deleteSupplier('${s.id}','${s.name.replace(/'/g, "\\'")}')" id="del-sup-${s.id}" style="margin-left:6px;">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function openAddSupplier() {
  editingId = null;
  document.getElementById('supplier-modal-title').textContent = 'Add Supplier';
  document.getElementById('supplier-form').reset();
  document.getElementById('supplier-id').value = '';
  clearFormErrors(document.getElementById('supplier-form'));
  Modal.open('supplier-modal');
}

function openEditSupplier(id) {
  const s = allSuppliers.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('supplier-modal-title').textContent = 'Edit Supplier';
  clearFormErrors(document.getElementById('supplier-form'));
  const form = document.getElementById('supplier-form');
  setFormData(form, s);
  Modal.open('supplier-modal');
}

async function saveSupplier() {
  const form   = document.getElementById('supplier-form');
  const btn    = document.getElementById('btn-save-supplier');
  const data   = getFormData(form);
  clearFormErrors(form);

  // Frontend validation
  const errs = [];
  if (!data.name)           errs.push("Field 'name' is required.");
  if (!data.contact_person) errs.push("Field 'contact_person' is required.");
  if (!data.phone)          errs.push("Field 'phone' is required.");
  if (!data.email)          errs.push("Field 'email' is required.");
  if (errs.length) { showFormErrors(form, errs); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving…';

  let res;
  if (editingId) {
    res = await Api.updateSupplier(editingId, data);
  } else {
    res = await Api.createSupplier(data);
  }

  btn.disabled = false;
  btn.textContent = 'Save Supplier';

  if (!res.success) {
    showFormErrors(form, res.errors || [res.message]);
    Toast.error(res.message);
    return;
  }

  Toast.success(res.message);
  Modal.close('supplier-modal');
  loadSuppliers();
}

async function deleteSupplier(id, name) {
  showConfirm({
    title:       'Delete Supplier?',
    message:     `"${name}" will be permanently removed.`,
    confirmText: 'Delete',
    icon:        '🗑️',
    onConfirm:   async () => {
      const res = await Api.deleteSupplier(id);
      if (!res.success) { Toast.error(res.message); return; }
      Toast.success(res.message);
      loadSuppliers();
    },
  });
}

// Events
document.addEventListener('DOMContentLoaded', () => {
  loadSuppliers();

  document.getElementById('btn-add-supplier').addEventListener('click', openAddSupplier);
  document.getElementById('btn-save-supplier').addEventListener('click', saveSupplier);

  // Search
  let searchTimer;
  document.getElementById('supplier-search').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadSuppliers(e.target.value.trim()), 350);
  });

  // Close modal buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => Modal.close(btn.dataset.close));
  });
});
