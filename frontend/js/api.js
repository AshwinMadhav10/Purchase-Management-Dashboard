// ============================================================
// api.js — Centralized API helper for all fetch() calls
// ============================================================

const API_BASE = '../../backend/api';

const Api = {
  async request(endpoint, method = 'GET', body = null, params = {}) {
    let url = `${API_BASE}/${endpoint}`;
    if (Object.keys(params).length) {
      url += '?' + new URLSearchParams(params).toString();
    }
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(url, opts);
      const json = await res.json();
      return json;
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection.', errors: [err.message] };
    }
  },

  // Suppliers
  getSuppliers:    (q = '')  => Api.request('suppliers.php', 'GET', null, q ? { q } : {}),
  createSupplier:  (data)    => Api.request('suppliers.php', 'POST', data),
  updateSupplier:  (id, data)=> Api.request('suppliers.php', 'PUT',  data, { id }),
  deleteSupplier:  (id)      => Api.request('suppliers.php', 'DELETE', null, { id }),

  // Items
  getItems:        (q = '')  => Api.request('items.php', 'GET', null, q ? { q } : {}),
  createItem:      (data)    => Api.request('items.php', 'POST', data),
  updateItem:      (id, data)=> Api.request('items.php', 'PUT',  data, { id }),
  deleteItem:      (id)      => Api.request('items.php', 'DELETE', null, { id }),

  // Purchase Orders
  getPurchaseOrders: (params = {}) => Api.request('purchase-orders.php', 'GET', null, params),
  getPurchaseOrder:  (id)          => Api.request('purchase-orders.php', 'GET', null, { id }),
  createPurchaseOrder: (data)      => Api.request('purchase-orders.php', 'POST', data),
  updatePurchaseOrder: (id, data)  => Api.request('purchase-orders.php', 'PUT', data, { id }),
  deletePurchaseOrder: (id)        => Api.request('purchase-orders.php', 'DELETE', null, { id }),

  // Dashboard
  getDashboard: () => Api.request('dashboard.php'),
};
