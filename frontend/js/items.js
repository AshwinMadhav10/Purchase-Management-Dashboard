// ============================================================
// items.js — Item Master page logic
// ============================================================

let allItems  = [];
let editingId = null;

async function loadItems(q = '') {
  const res = await Api.getItems(q);
  if (!res.success) { Toast.error(res.message); return; }
  allItems = res.data;
  document.getElementById('item-count').textContent = `(${allItems.length})`;
  renderItems(allItems);
}

function renderItems(list) {
  const tbody = document.getElementById('items-tbody');
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">
      <div class="empty-state" style="padding:40px 20px;">
        <div class="empty-state-icon">📦</div>
        <h3>No items found</h3>
        <p>Add your first item to get started.</p>
      </div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(i => `
    <tr>
      <td><span class="fw-600">${i.id}</span></td>
      <td><code style="background:var(--warning-bg);color:#92400e;padding:2px 7px;border-radius:4px;font-size:12px;">${i.code}</code></td>
      <td class="fw-600">${i.name}</td>
      <td>${i.category || '—'}</td>
      <td>${i.unit}</td>
      <td class="number-cell fw-600">${formatCurrency(i.purchase_price)}</td>
      <td class="number-cell">${i.tax}%</td>
      <td>${statusBadge(i.status)}</td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-xs" onclick="openEditItem('${i.id}')" id="edit-item-${i.id}">✏️ Edit</button>
        <button class="btn btn-danger btn-xs" onclick="deleteItem('${i.id}','${i.name.replace(/'/g, "\\'")}')" id="del-item-${i.id}" style="margin-left:6px;">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function openAddItem() {
  editingId = null;
  document.getElementById('item-modal-title').textContent = 'Add Item';
  document.getElementById('item-form').reset();
  clearFormErrors(document.getElementById('item-form'));
  Modal.open('item-modal');
}

function openEditItem(id) {
  const item = allItems.find(x => x.id === id);
  if (!item) return;
  editingId = id;
  document.getElementById('item-modal-title').textContent = 'Edit Item';
  clearFormErrors(document.getElementById('item-form'));
  setFormData(document.getElementById('item-form'), item);
  Modal.open('item-modal');
}

async function saveItem() {
  const form = document.getElementById('item-form');
  const btn  = document.getElementById('btn-save-item');
  const data = getFormData(form);
  clearFormErrors(form);

  const errs = [];
  if (!data.name)           errs.push("Field 'name' is required.");
  if (!data.unit)           errs.push("Field 'unit' is required.");
  if (!data.purchase_price) errs.push("Field 'purchase_price' is required.");
  if (isNaN(parseFloat(data.purchase_price)) || parseFloat(data.purchase_price) < 0) {
    errs.push("Purchase price must be a non-negative number.");
  }
  if (errs.length) { showFormErrors(form, errs); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving…';

  const res = editingId
    ? await Api.updateItem(editingId, data)
    : await Api.createItem(data);

  btn.disabled = false;
  btn.textContent = 'Save Item';

  if (!res.success) {
    showFormErrors(form, res.errors || [res.message]);
    Toast.error(res.message);
    return;
  }

  Toast.success(res.message);
  Modal.close('item-modal');
  loadItems();
}

async function deleteItem(id, name) {
  showConfirm({
    title:       'Delete Item?',
    message:     `"${name}" will be permanently removed.`,
    confirmText: 'Delete',
    icon:        '🗑️',
    onConfirm:   async () => {
      const res = await Api.deleteItem(id);
      if (!res.success) { Toast.error(res.message); return; }
      Toast.success(res.message);
      loadItems();
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadItems();

  document.getElementById('btn-add-item').addEventListener('click', openAddItem);
  document.getElementById('btn-save-item').addEventListener('click', saveItem);

  let searchTimer;
  document.getElementById('item-search').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadItems(e.target.value.trim()), 350);
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => Modal.close(btn.dataset.close));
  });
});
