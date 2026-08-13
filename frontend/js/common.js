// ============================================================
// common.js — Shared UI utilities (toast, modal, confirm, nav)
// ============================================================

/* ── Toast ─────────────────────────────────────────────────── */
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.getElementById('toast-container') || (() => {
        const c = document.createElement('div');
        c.id = 'toast-container';
        document.body.appendChild(c);
        return c;
      })();
    }
  },
  show(message, type = 'info', duration = 3500) {
    this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;
    this.container.appendChild(t);
    setTimeout(() => {
      t.classList.add('removing');
      setTimeout(() => t.remove(), 300);
    }, duration);
  },
  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error', 5000),
  warning: (msg) => Toast.show(msg, 'warning'),
  info:    (msg) => Toast.show(msg, 'info'),
};

/* ── Modal ─────────────────────────────────────────────────── */
const Modal = {
  open(id)  { const m = document.getElementById(id); if (m) m.classList.add('show'); },
  close(id) { const m = document.getElementById(id); if (m) m.classList.remove('show'); },
  closeAll() { document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show')); },
};

/* ── Confirm Dialog ─────────────────────────────────────────── */
function showConfirm({ title = 'Are you sure?', message = '', confirmText = 'Delete', icon = '🗑️', onConfirm }) {
  // Re-use a shared confirm modal
  let overlay = document.getElementById('global-confirm-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-confirm-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal modal-sm confirm-modal">
        <div class="confirm-body">
          <div class="confirm-icon" id="gcm-icon"></div>
          <div class="confirm-title" id="gcm-title"></div>
          <p class="confirm-msg" id="gcm-msg"></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="gcm-cancel">Cancel</button>
          <button class="btn btn-danger"  id="gcm-confirm">Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
    document.getElementById('gcm-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  }
  document.getElementById('gcm-icon').textContent    = icon;
  document.getElementById('gcm-title').textContent   = title;
  document.getElementById('gcm-msg').textContent     = message;
  document.getElementById('gcm-confirm').textContent = confirmText;
  overlay.classList.add('show');

  const btn = document.getElementById('gcm-confirm');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    if (onConfirm) onConfirm();
  });
}

/* ── Sidebar Nav ────────────────────────────────────────────── */
function initSidebar() {
  // Expandable Masters nav group
  const masterItems = document.querySelectorAll('.nav-item.has-sub');
  masterItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      item.classList.toggle('open');
    });
  });

  // Active link highlight based on current page
  const page = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link[href]').forEach(a => {
    if (a.getAttribute('href') === page || a.getAttribute('href') === './' + page) {
      a.classList.add('active');
      // open parent group
      const parent = a.closest('.nav-item.has-sub');
      if (!parent) {
        const parentGroup = a.closest('.sub-nav')?.closest('.nav-item');
        if (parentGroup) parentGroup.classList.add('open');
      } else {
        parent.classList.add('open');
      }
      const subParent = a.closest('.sub-nav')?.parentElement;
      if (subParent) subParent.classList.add('open');
    }
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.sidebar-overlay');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
    });
  }

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => {
      if (e.target === o) o.classList.remove('show');
    });
  });
}

/* ── Form Helpers ───────────────────────────────────────────── */
function getFormData(formEl) {
  const fd = new FormData(formEl);
  const obj = {};
  fd.forEach((v, k) => { obj[k] = v.trim(); });
  return obj;
}

function setFormData(formEl, data) {
  Object.entries(data).forEach(([k, v]) => {
    const el = formEl.elements[k];
    if (el) el.value = v ?? '';
  });
}

function clearFormErrors(formEl) {
  formEl.querySelectorAll('.field-error').forEach(e => e.remove());
  formEl.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'));
}

function showFormErrors(formEl, errors) {
  clearFormErrors(formEl);
  errors.forEach(msg => {
    // Try to match to a field
    const match = msg.match(/^Field '(\w+)'/);
    if (match) {
      const el = formEl.elements[match[1]];
      if (el) {
        el.classList.add('is-invalid');
        const err = document.createElement('p');
        err.className = 'field-error';
        err.textContent = msg;
        el.parentNode.appendChild(err);
        return;
      }
    }
    // Generic error
    const err = document.createElement('p');
    err.className = 'field-error mt-8';
    err.textContent = msg;
    formEl.appendChild(err);
  });
}

/* ── Currency Format ────────────────────────────────────────── */
function formatCurrency(val, symbol = '₹') {
  const n = parseFloat(val) || 0;
  return symbol + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Status Badge ────────────────────────────────────────────── */
function statusBadge(status) {
  const map = {
    'active':    'badge-success',
    'inactive':  'badge-danger',
    'draft':     'badge-secondary',
    'pending':   'badge-warning',
    'completed': 'badge-success',
    'cancelled': 'badge-danger',
  };
  const cls = map[(status || '').toLowerCase()] || 'badge-secondary';
  return `<span class="badge ${cls}">${status || '—'}</span>`;
}

/* ── Loading ─────────────────────────────────────────────────── */
function showLoading(container) {
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner spinner-dark"></div>
      <span>Loading…</span>
    </div>`;
}

function showEmpty(container, icon = '📋', title = 'No data found', msg = 'Add your first record to get started.', btn = '') {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${msg}</p>
      ${btn}
    </div>`;
}

// Expose init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initSidebar);
