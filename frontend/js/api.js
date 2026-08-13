// ============================================================
// api.js — Client-Side Storage & Management (LocalStorage - No DB Needed)
// ============================================================

const STORAGE_KEYS = {
  SUPPLIERS: 'pmd_suppliers',
  ITEMS: 'pmd_items',
  PO: 'pmd_purchase_orders'
};

// Initial Seed Data (if local storage is completely empty)
const DEFAULT_SUPPLIERS = [
  {
    id: "SUP0001",
    code: "SC0001",
    name: "ABC Traders",
    contact_person: "John Doe",
    phone: "9876543210",
    email: "contact@abctraders.com",
    address: "123 Business Park, Tech Zone",
    tax_number: "GSTIN987654321",
    payment_terms: "Net 30",
    status: "Active",
    created_at: "2026-08-13 10:00:00"
  }
];

const DEFAULT_ITEMS = [
  {
    id: "ITM0001",
    code: "IC0001",
    name: "Laptop",
    description: "Dell Business Laptop",
    category: "Electronics",
    unit: "Pcs",
    purchase_price: 50000,
    tax: 18,
    status: "Active",
    created_at: "2026-08-13 10:00:00"
  }
];

const DEFAULT_PO = [];

// Initialize LocalStorage with default seeds if empty
function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(DEFAULT_SUPPLIERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(DEFAULT_ITEMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PO)) {
    localStorage.setItem(STORAGE_KEYS.PO, JSON.stringify(DEFAULT_PO));
  }
}

initLocalStorage();

// Storage Helpers
function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(prefix, records, field = 'id') {
  let max = 0;
  records.forEach(r => {
    const val = r[field] || '';
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    if (num > max) max = num;
  });
  return prefix + String(max + 1).padStart(4, '0');
}

function generatePONumber(records) {
  const year = new Date().getFullYear();
  let max = 0;
  records.forEach(r => {
    const poNum = r.po_number || '';
    const match = poNum.match(new RegExp(`PO-${year}-(\\d+)`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  });
  return `PO-${year}-${String(max + 1).padStart(4, '0')}`;
}

function recalculatePOTotals(po) {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  if (po.items && Array.isArray(po.items)) {
    po.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      const disc = parseFloat(item.discount) || 0;
      const tax = parseFloat(item.tax) || 0;

      const lineBase = qty * price;
      const lineDisc = lineBase * (disc / 100);
      const lineAfterDisc = lineBase - lineDisc;
      const lineTax = lineAfterDisc * (tax / 100);
      const lineTotal = lineAfterDisc + lineTax;

      item.line_total = Math.round(lineTotal * 100) / 100;
      subtotal += lineBase;
      totalDiscount += lineDisc;
      totalTax += lineTax;
    });
  }

  const additional = parseFloat(po.additional_charges) || 0;
  po.subtotal = Math.round(subtotal * 100) / 100;
  po.total_discount = Math.round(totalDiscount * 100) / 100;
  po.total_tax = Math.round(totalTax * 100) / 100;
  po.additional_charges = Math.round(additional * 100) / 100;
  po.grand_total = Math.round((subtotal - totalDiscount + totalTax + additional) * 100) / 100;
}

const Api = {
  // --- SUPPLIERS ---
  async getSuppliers(q = '') {
    let suppliers = getStore(STORAGE_KEYS.SUPPLIERS);
    if (q) {
      const query = q.toLowerCase().trim();
      suppliers = suppliers.filter(s =>
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.code && s.code.toLowerCase().includes(query)) ||
        (s.email && s.email.toLowerCase().includes(query))
      );
    }
    return { success: true, message: 'Success', data: suppliers };
  },

  async createSupplier(data) {
    const suppliers = getStore(STORAGE_KEYS.SUPPLIERS);
    const newSupplier = {
      id: generateId('SUP', suppliers, 'id'),
      code: generateId('SC', suppliers, 'code'),
      name: data.name || '',
      contact_person: data.contact_person || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      tax_number: data.tax_number || '',
      payment_terms: data.payment_terms || '',
      status: data.status || 'Active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    suppliers.push(newSupplier);
    setStore(STORAGE_KEYS.SUPPLIERS, suppliers);
    return { success: true, message: 'Supplier created successfully.', data: newSupplier };
  },

  async updateSupplier(id, data) {
    const suppliers = getStore(STORAGE_KEYS.SUPPLIERS);
    const index = suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, message: 'Supplier not found.' };
    }
    suppliers[index] = {
      ...suppliers[index],
      name: data.name !== undefined ? data.name : suppliers[index].name,
      contact_person: data.contact_person !== undefined ? data.contact_person : suppliers[index].contact_person,
      phone: data.phone !== undefined ? data.phone : suppliers[index].phone,
      email: data.email !== undefined ? data.email : suppliers[index].email,
      address: data.address !== undefined ? data.address : suppliers[index].address,
      tax_number: data.tax_number !== undefined ? data.tax_number : suppliers[index].tax_number,
      payment_terms: data.payment_terms !== undefined ? data.payment_terms : suppliers[index].payment_terms,
      status: data.status !== undefined ? data.status : suppliers[index].status,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setStore(STORAGE_KEYS.SUPPLIERS, suppliers);
    return { success: true, message: 'Supplier updated successfully.', data: suppliers[index] };
  },

  async deleteSupplier(id) {
    let suppliers = getStore(STORAGE_KEYS.SUPPLIERS);
    const initialLen = suppliers.length;
    suppliers = suppliers.filter(s => s.id !== id);
    if (suppliers.length === initialLen) {
      return { success: false, message: 'Supplier not found.' };
    }
    setStore(STORAGE_KEYS.SUPPLIERS, suppliers);
    return { success: true, message: 'Supplier deleted successfully.', data: [] };
  },

  // --- ITEMS ---
  async getItems(q = '') {
    let items = getStore(STORAGE_KEYS.ITEMS);
    if (q) {
      const query = q.toLowerCase().trim();
      items = items.filter(i =>
        (i.name && i.name.toLowerCase().includes(query)) ||
        (i.code && i.code.toLowerCase().includes(query)) ||
        (i.category && i.category.toLowerCase().includes(query))
      );
    }
    return { success: true, message: 'Success', data: items };
  },

  async createItem(data) {
    const items = getStore(STORAGE_KEYS.ITEMS);
    const newItem = {
      id: generateId('ITM', items, 'id'),
      code: generateId('IC', items, 'code'),
      name: data.name || '',
      description: data.description || '',
      category: data.category || '',
      unit: data.unit || 'Pcs',
      purchase_price: parseFloat(data.purchase_price) || 0,
      tax: parseFloat(data.tax) || 0,
      status: data.status || 'Active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    items.push(newItem);
    setStore(STORAGE_KEYS.ITEMS, items);
    return { success: true, message: 'Item created successfully.', data: newItem };
  },

  async updateItem(id, data) {
    const items = getStore(STORAGE_KEYS.ITEMS);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
      return { success: false, message: 'Item not found.' };
    }
    items[index] = {
      ...items[index],
      name: data.name !== undefined ? data.name : items[index].name,
      description: data.description !== undefined ? data.description : items[index].description,
      category: data.category !== undefined ? data.category : items[index].category,
      unit: data.unit !== undefined ? data.unit : items[index].unit,
      purchase_price: data.purchase_price !== undefined ? parseFloat(data.purchase_price) : items[index].purchase_price,
      tax: data.tax !== undefined ? parseFloat(data.tax) : items[index].tax,
      status: data.status !== undefined ? data.status : items[index].status,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setStore(STORAGE_KEYS.ITEMS, items);
    return { success: true, message: 'Item updated successfully.', data: items[index] };
  },

  async deleteItem(id) {
    let items = getStore(STORAGE_KEYS.ITEMS);
    const initialLen = items.length;
    items = items.filter(i => i.id !== id);
    if (items.length === initialLen) {
      return { success: false, message: 'Item not found.' };
    }
    setStore(STORAGE_KEYS.ITEMS, items);
    return { success: true, message: 'Item deleted successfully.', data: [] };
  },

  // --- PURCHASE ORDERS ---
  async getPurchaseOrders(params = {}) {
    let orders = getStore(STORAGE_KEYS.PO);
    if (params.status) {
      orders = orders.filter(o => (o.status || '').toLowerCase() === params.status.toLowerCase());
    }
    if (params.q) {
      const query = params.q.toLowerCase().trim();
      orders = orders.filter(o =>
        (o.po_number && o.po_number.toLowerCase().includes(query)) ||
        (o.supplier_name && o.supplier_name.toLowerCase().includes(query))
      );
    }
    return { success: true, message: 'Success', data: orders };
  },

  async getPurchaseOrder(id) {
    const orders = getStore(STORAGE_KEYS.PO);
    const po = orders.find(o => o.id === id);
    if (!po) {
      return { success: false, message: 'Purchase order not found.' };
    }
    return { success: true, message: 'Success', data: po };
  },

  async createPurchaseOrder(data) {
    const orders = getStore(STORAGE_KEYS.PO);
    const newPO = {
      id: generateId('PO', orders, 'id'),
      po_number: generatePONumber(orders),
      po_date: data.po_date || new Date().toISOString().split('T')[0],
      status: data.status || 'Draft',
      supplier_id: data.supplier_id || '',
      supplier_name: data.supplier_name || '',
      expected_delivery_date: data.expected_delivery_date || '',
      reference_number: data.reference_number || '',
      payment_terms: data.payment_terms || '',
      delivery_location: data.delivery_location || '',
      notes: data.notes || '',
      additional_charges: parseFloat(data.additional_charges) || 0,
      items: data.items || [],
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    recalculatePOTotals(newPO);
    orders.push(newPO);
    setStore(STORAGE_KEYS.PO, orders);
    return { success: true, message: 'Purchase Order created successfully.', data: newPO };
  },

  async updatePurchaseOrder(id, data) {
    const orders = getStore(STORAGE_KEYS.PO);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
      return { success: false, message: 'Purchase order not found.' };
    }
    const updatedPO = {
      ...orders[index],
      ...data,
      id: orders[index].id,
      po_number: orders[index].po_number,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    recalculatePOTotals(updatedPO);
    orders[index] = updatedPO;
    setStore(STORAGE_KEYS.PO, orders);
    return { success: true, message: 'Purchase Order updated successfully.', data: updatedPO };
  },

  async deletePurchaseOrder(id) {
    let orders = getStore(STORAGE_KEYS.PO);
    const initialLen = orders.length;
    orders = orders.filter(o => o.id !== id);
    if (orders.length === initialLen) {
      return { success: false, message: 'Purchase order not found.' };
    }
    setStore(STORAGE_KEYS.PO, orders);
    return { success: true, message: 'Purchase Order deleted successfully.', data: [] };
  },

  // --- DASHBOARD ---
  async getDashboard() {
    const orders = getStore(STORAGE_KEYS.PO);
    const suppliers = getStore(STORAGE_KEYS.SUPPLIERS);
    const items = getStore(STORAGE_KEYS.ITEMS);

    let draft = 0, pending = 0, completed = 0, cancelled = 0;
    let grandTotalSum = 0;

    orders.forEach(o => {
      const s = (o.status || 'draft').toLowerCase();
      if (s === 'draft') draft++;
      else if (s === 'pending') pending++;
      else if (s === 'completed') completed++;
      else if (s === 'cancelled') cancelled++;

      grandTotalSum += parseFloat(o.grand_total) || 0;
    });

    const recent = [...orders].reverse().slice(0, 5).map(o => ({
      id: o.id,
      po_number: o.po_number,
      supplier_name: o.supplier_name,
      po_date: o.po_date,
      grand_total: o.grand_total,
      status: o.status
    }));

    return {
      success: true,
      message: 'Success',
      data: {
        total_po: orders.length,
        draft_po: draft,
        pending_po: pending,
        completed_po: completed,
        cancelled_po: cancelled,
        total_value: Math.round(grandTotalSum * 100) / 100,
        total_suppliers: suppliers.length,
        total_items: items.length,
        status_chart: [
          { label: 'Draft', value: draft, color: '#6366f1' },
          { label: 'Pending', value: pending, color: '#f59e0b' },
          { label: 'Completed', value: completed, color: '#10b981' },
          { label: 'Cancelled', value: cancelled, color: '#ef4444' }
        ],
        recent_orders: recent
      }
    };
  }
};

