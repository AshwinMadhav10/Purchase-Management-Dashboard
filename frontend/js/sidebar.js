// ============================================================
// sidebar.js — Injects the shared sidebar HTML into every page
// ============================================================

(function injectSidebar() {
  const currentPage = location.pathname.split('/').pop();

  const sidebarHTML = `
    <div class="sidebar-overlay"></div>
    <aside class="sidebar" id="main-sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">🛒</div>
        <div class="sidebar-logo-text">
          <span class="sidebar-logo-title">PurchasePro</span>
          <span class="sidebar-logo-sub">ERP System</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section-label">Main</p>
        <ul>
          <li class="nav-item">
            <a class="nav-link" href="dashboard.html" id="nav-dashboard">
              <span class="nav-icon">📊</span> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="purchase-orders.html" id="nav-po-list">
              <span class="nav-icon">📋</span> Purchase Orders
            </a>
          </li>
        </ul>

        <p class="nav-section-label">Masters</p>
        <ul>
          <li class="nav-item has-sub" id="nav-masters-group">
            <a class="nav-link" href="#" id="nav-masters">
              <span class="nav-icon">🗂️</span> Masters
              <span class="nav-arrow">›</span>
            </a>
            <ul class="sub-nav">
              <li class="nav-item">
                <a class="nav-link" href="suppliers.html" id="nav-suppliers">
                  <span class="nav-icon">🏢</span> Suppliers
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="items.html" id="nav-items">
                  <span class="nav-icon">📦</span> Items
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">A</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">Admin User</div>
            <div class="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>`;

  // Insert before first child of body
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Highlight active nav item
  const pageNavMap = {
    'dashboard.html':        'nav-dashboard',
    'purchase-orders.html':  'nav-po-list',
    'create-purchase-order.html': 'nav-po-list',
    'suppliers.html':        'nav-suppliers',
    'items.html':            'nav-items',
  };
  const activeId = pageNavMap[currentPage];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.classList.add('active');
      // Open masters group if needed
      const masterPages = ['suppliers.html','items.html'];
      if (masterPages.includes(currentPage)) {
        document.getElementById('nav-masters-group')?.classList.add('open');
      }
    }
  }
})();
