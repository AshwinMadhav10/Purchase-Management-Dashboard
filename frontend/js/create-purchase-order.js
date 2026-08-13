// ============================================================
// create-purchase-order.js — Logic for creating/editing PO
// ============================================================

let allSuppliers = [];
let allItems = [];
let poId = null;
let itemRowCounter = 0;

// Initialize Page
async function initPage() {
  // Set default PO Date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('po-date').value = today;

  // Load masters data
  await Promise.all([loadSuppliersList(), loadItemsList()]);

  // Check if we are editing an existing PO
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (id) {
    poId = id;
    document.getElementById('page-title').textContent = 'Edit Purchase Order';
    document.getElementById('page-subtitle').textContent = `Editing Order ID: ${id}`;
    await loadExistingPO(id);
  } else {
    // Add one default item row
    addItemRow();
  }
}

// Load Suppliers to populate dropdown
async function loadSuppliersList() {
  const res = await Api.getSuppliers();
  if (res.success) {
    allSuppliers = res.data.filter(s => s.status === 'Active');
    const select = document.getElementById('po-supplier');
    select.innerHTML = '<option value="">— Select Supplier —</option>' + 
      allSuppliers.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('');
  } else {
    Toast.error('Failed to load suppliers.');
  }
}

// Load Items for selection
async function loadItemsList() {
  const res = await Api.getItems();
  if (res.success) {
    allItems = res.data.filter(i => i.status === 'Active');
  } else {
    Toast.error('Failed to load items.');
  }
}

// Load existing PO details for edit mode
async function loadExistingPO(id) {
  const res = await Api.getPurchaseOrder(id);
  if (!res.success) {
    Toast.error(res.message);
    return;
  }
  const po = res.data;
  document.getElementById('po-number').value = po.po_number || '';
  document.getElementById('po-date').value = po.po_date || '';
  document.getElementById('po-status').value = po.status || 'Draft';
  document.getElementById('po-supplier').value = po.supplier_id || '';
  document.getElementById('po-delivery-date').value = po.expected_delivery_date || '';
  document.getElementById('po-ref').value = po.reference_number || '';
  document.getElementById('po-payment-terms').value = po.payment_terms || '';
  document.getElementById('po-location').value = po.delivery_location || '';
  document.getElementById('po-notes').value = po.notes || '';
  document.getElementById('po-additional').value = po.additional_charges || 0;

  // Clear automatic/default rows if any
  document.getElementById('po-items-body').innerHTML = '';
  
  if (po.items && po.items.length > 0) {
    po.items.forEach(item => {
      addItemRow(item);
    });
  } else {
    addItemRow();
  }
  calculateTotals();
}

// Add dynamic item row
function addItemRow(data = null) {
  itemRowCounter++;
  const tbody = document.getElementById('po-items-body');
  const tr = document.createElement('tr');
  tr.id = `po-row-${itemRowCounter}`;
  tr.className = 'po-item-row';
  
  tr.innerHTML = `
    <td class="row-num" style="vertical-align: middle; font-weight: 600;"></td>
    <td>
      <div class="item-select-popup">
        <input type="text" class="form-control item-name-input" placeholder="Search item..." value="${data ? data.item_name : ''}" required />
        <input type="hidden" class="item-id-hidden" value="${data ? data.item_id : ''}" />
        <div class="item-dropdown"></div>
      </div>
    </td>
    <td>
      <input type="text" class="form-control item-code-input" value="${data ? data.item_code : ''}" readonly />
    </td>
    <td>
      <input type="text" class="form-control item-desc-input" value="${data ? data.description : ''}" />
    </td>
    <td>
      <input type="number" class="form-control item-qty-input" min="0.001" step="any" value="${data ? data.quantity : '1'}" required />
    </td>
    <td>
      <input type="text" class="form-control item-unit-input" value="${data ? data.unit : ''}" readonly />
    </td>
    <td>
      <input type="number" class="form-control item-price-input" min="0" step="0.01" value="${data ? data.unit_price : '0.00'}" required />
    </td>
    <td>
      <input type="number" class="form-control item-disc-input" min="0" max="100" step="any" value="${data ? data.discount : '0'}" />
    </td>
    <td>
      <input type="number" class="form-control item-tax-input" min="0" max="100" step="any" value="${data ? data.tax : '0'}" />
    </td>
    <td class="number-cell line-total-cell fw-600" style="vertical-align: middle;">
      ${formatCurrency(data ? data.line_total : 0)}
    </td>
    <td>
      <button type="button" class="remove-row-btn" onclick="removeItemRow('${tr.id}')">✕</button>
    </td>
  `;
  
  tbody.appendChild(tr);
  initRowEvents(tr);
  updateRowNumbers();
  calculateTotals();
}

// Remove item row
window.removeItemRow = function(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    updateRowNumbers();
    calculateTotals();
  }
};

// Update table row numbering
function updateRowNumbers() {
  const rows = document.querySelectorAll('#po-items-body tr');
  rows.forEach((row, idx) => {
    row.querySelector('.row-num').textContent = idx + 1;
  });
  
  const noItems = document.getElementById('no-items-msg');
  if (rows.length === 0) {
    noItems.style.display = 'block';
  } else {
    noItems.style.display = 'none';
  }
}

// Bind row events for autocomplete and live calculations
function initRowEvents(row) {
  const nameInput = row.querySelector('.item-name-input');
  const dropdown = row.querySelector('.item-dropdown');
  const idHidden = row.querySelector('.item-id-hidden');
  const codeInput = row.querySelector('.item-code-input');
  const descInput = row.querySelector('.item-desc-input');
  const qtyInput = row.querySelector('.item-qty-input');
  const unitInput = row.querySelector('.item-unit-input');
  const priceInput = row.querySelector('.item-price-input');
  const discInput = row.querySelector('.item-disc-input');
  const taxInput = row.querySelector('.item-tax-input');

  const showDropdown = () => {
    const q = nameInput.value.trim().toLowerCase();
    const filtered = allItems.filter(i => 
      !q || 
      i.name.toLowerCase().includes(q) || 
      i.code.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      dropdown.innerHTML = '<div class="item-option">No matching items</div>';
    } else {
      dropdown.innerHTML = filtered.map(i => `
        <div class="item-option" data-id="${i.id}" data-code="${i.code}" data-name="${i.name}" data-price="${i.purchase_price}" data-unit="${i.unit}" data-tax="${i.tax || 0}" data-desc="${i.description || ''}">
          <span class="fw-600">${i.name}</span> <span class="item-option-code">(${i.code})</span>
        </div>
      `).join('');
    }
    dropdown.classList.add('show');
  };

  // Show dropdown on focus and click
  nameInput.addEventListener('focus', showDropdown);
  nameInput.addEventListener('click', showDropdown);

  // Input event for searching items
  nameInput.addEventListener('input', showDropdown);

  // Auto-populate if the input exactly matches an item name or code
  const checkExactMatch = () => {
    const val = nameInput.value.trim().toLowerCase();
    if (!val) {
      idHidden.value = '';
      codeInput.value = '';
      unitInput.value = '';
      return;
    }
    const match = allItems.find(i => i.name.toLowerCase() === val || i.code.toLowerCase() === val);
    if (match) {
      idHidden.value = match.id;
      nameInput.value = match.name;
      codeInput.value = match.code;
      if (!descInput.value) descInput.value = match.description || '';
      unitInput.value = match.unit;
      if (parseFloat(priceInput.value) === 0 || !priceInput.value) {
        priceInput.value = parseFloat(match.purchase_price).toFixed(2);
      }
      if (parseFloat(taxInput.value) === 0 || !taxInput.value) {
        taxInput.value = parseFloat(match.tax || 0).toFixed(2);
      }
      calculateRowTotal(row);
      calculateTotals();
    }
  };
  nameInput.addEventListener('change', checkExactMatch);
  nameInput.addEventListener('blur', () => {
    // Delay slightly to let dropdown click register first
    setTimeout(checkExactMatch, 200);
  });

  // Handle item selection from dropdown
  dropdown.addEventListener('click', (e) => {
    const option = e.target.closest('.item-option');
    if (!option || !option.dataset.id) return;

    idHidden.value = option.dataset.id;
    nameInput.value = option.dataset.name;
    codeInput.value = option.dataset.code;
    descInput.value = option.dataset.desc;
    unitInput.value = option.dataset.unit;
    priceInput.value = parseFloat(option.dataset.price).toFixed(2);
    taxInput.value = parseFloat(option.dataset.tax).toFixed(2);
    
    dropdown.classList.remove('show');
    calculateRowTotal(row);
    calculateTotals();
  });

  // Hide dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!row.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // Recalculations on value changes
  [qtyInput, priceInput, discInput, taxInput].forEach(input => {
    input.addEventListener('input', () => {
      calculateRowTotal(row);
      calculateTotals();
    });
  });
}

// Calculate single row line total
function calculateRowTotal(row) {
  const qty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
  const price = parseFloat(row.querySelector('.item-price-input').value) || 0;
  const discPct = parseFloat(row.querySelector('.item-disc-input').value) || 0;
  const taxPct = parseFloat(row.querySelector('.item-tax-input').value) || 0;

  const lineBase = qty * price;
  const lineDiscount = lineBase * (discPct / 100);
  const lineAfterDiscount = lineBase - lineDiscount;
  const lineTax = lineAfterDiscount * (taxPct / 100);
  const lineTotal = lineAfterDiscount + lineTax;

  row.querySelector('.line-total-cell').textContent = formatCurrency(lineTotal);
  return {
    base: lineBase,
    discount: lineDiscount,
    tax: lineTax,
    total: lineTotal
  };
}

// Calculate PO summary totals
function calculateTotals() {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  const rows = document.querySelectorAll('#po-items-body tr');
  rows.forEach(row => {
    const totals = calculateRowTotal(row);
    subtotal += totals.base;
    totalDiscount += totals.discount;
    totalTax += totals.tax;
  });

  const additionalCharges = parseFloat(document.getElementById('po-additional').value) || 0;
  const grandTotal = subtotal - totalDiscount + totalTax + additionalCharges;

  document.getElementById('sum-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('sum-discount').textContent = `- ${formatCurrency(totalDiscount)}`;
  document.getElementById('sum-tax').textContent = formatCurrency(totalTax);
  document.getElementById('sum-additional').textContent = formatCurrency(additionalCharges);
  document.getElementById('sum-grand').textContent = formatCurrency(grandTotal);
}

// Collect data from form to send to API
function collectPOData(status) {
  const supplierSelect = document.getElementById('po-supplier');
  const supplierId = supplierSelect.value;
  const supplierName = supplierSelect.options[supplierSelect.selectedIndex]?.text.split(' (')[0] || '';

  const poData = {
    po_date: document.getElementById('po-date').value,
    status: status || document.getElementById('po-status').value,
    supplier_id: supplierId,
    supplier_name: supplierName,
    expected_delivery_date: document.getElementById('po-delivery-date').value,
    reference_number: document.getElementById('po-ref').value,
    payment_terms: document.getElementById('po-payment-terms').value,
    delivery_location: document.getElementById('po-location').value,
    notes: document.getElementById('po-notes').value,
    additional_charges: parseFloat(document.getElementById('po-additional').value) || 0,
    items: []
  };

  const rows = document.querySelectorAll('#po-items-body tr');
  rows.forEach(row => {
    poData.items.push({
      item_id: row.querySelector('.item-id-hidden').value,
      item_code: row.querySelector('.item-code-input').value,
      item_name: row.querySelector('.item-name-input').value,
      description: row.querySelector('.item-desc-input').value,
      quantity: parseFloat(row.querySelector('.item-qty-input').value) || 0,
      unit: row.querySelector('.item-unit-input').value,
      unit_price: parseFloat(row.querySelector('.item-price-input').value) || 0,
      discount: parseFloat(row.querySelector('.item-disc-input').value) || 0,
      tax: parseFloat(row.querySelector('.item-tax-input').value) || 0
    });
  });

  return poData;
}

// Validate entire form before API submission
function validatePOForm(data) {
  const errors = [];
  if (!data.po_date) errors.push("Field 'po_date' is required.");
  if (!data.supplier_id) errors.push("Field 'supplier_id' is required.");
  
  if (data.items.length === 0) {
    errors.push("At least one item is required.");
  } else {
    data.items.forEach((item, idx) => {
      const num = idx + 1;
      if (!item.item_id) errors.push(`Row ${num}: Valid Item must be selected from dropdown list.`);
      if (item.quantity <= 0) errors.push(`Row ${num}: Quantity must be greater than 0.`);
      if (item.unit_price < 0) errors.push(`Row ${num}: Unit price must be a non-negative number.`);
    });
  }

  return errors;
}

// Save Purchase Order (Save as Draft or Submit)
async function savePO(status) {
  const data = collectPOData(status);
  const errors = validatePOForm(data);
  
  if (errors.length > 0) {
    errors.forEach(err => Toast.error(err));
    return;
  }

  const saveBtn = status === 'Draft' 
    ? document.getElementById('btn-save-draft')
    : document.getElementById('btn-submit-po');

  const origText = saveBtn.textContent;
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span class="spinner"></span> Saving...';

  let res;
  if (poId) {
    res = await Api.updatePurchaseOrder(poId, data);
  } else {
    res = await Api.createPurchaseOrder(data);
  }

  saveBtn.disabled = false;
  saveBtn.textContent = origText;

  if (res.success) {
    Toast.success(res.message);
    setTimeout(() => {
      window.location.href = 'purchase-orders.html';
    }, 1500);
  } else {
    if (res.errors && res.errors.length > 0) {
      res.errors.forEach(err => Toast.error(err));
    } else {
      Toast.error(res.message);
    }
  }
}

// Bind Events
document.addEventListener('DOMContentLoaded', () => {
  initPage();

  document.getElementById('btn-add-item-row').addEventListener('click', () => addItemRow());
  document.getElementById('po-additional').addEventListener('input', calculateTotals);

  document.getElementById('btn-save-draft').addEventListener('click', () => savePO('Draft'));
  document.getElementById('btn-submit-po').addEventListener('click', () => savePO('Pending'));
});
