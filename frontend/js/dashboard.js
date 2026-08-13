// ============================================================
// dashboard.js — Dashboard page logic
// ============================================================

let poChart = null;

async function loadDashboard() {
  const root = document.getElementById('dashboard-root');
  showLoading(root);

  // Today's date
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const res = await Api.getDashboard();

  if (!res.success) {
    root.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Could not load dashboard</h3><p>${res.message}</p></div>`;
    return;
  }

  const d = res.data;

  root.innerHTML = `
    <!-- Stats Cards -->
    <div class="stats-grid" id="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon icon-primary">📋</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Total POs</div>
          <div class="stat-card-value" id="stat-total">${d.total_po}</div>
          <div class="stat-card-sub">All purchase orders</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-purple">📝</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Draft</div>
          <div class="stat-card-value" id="stat-draft">${d.draft_po}</div>
          <div class="stat-card-sub">Pending review</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-warning">⏳</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Pending</div>
          <div class="stat-card-value" id="stat-pending">${d.pending_po}</div>
          <div class="stat-card-sub">Awaiting fulfilment</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-success">✅</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Completed</div>
          <div class="stat-card-value" id="stat-completed">${d.completed_po}</div>
          <div class="stat-card-sub">Fulfilled orders</div>
        </div>
      </div>
    </div>

    <!-- Second row: Value + master counts -->
    <div class="stats-grid" style="grid-template-columns: repeat(auto-fit,minmax(160px,1fr));margin-bottom:28px;">
      <div class="stat-card">
        <div class="stat-card-icon icon-success">💰</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Total Value</div>
          <div class="stat-card-value" style="font-size:20px;">${formatCurrency(d.total_value)}</div>
          <div class="stat-card-sub">Across all POs</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-info">🏢</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Suppliers</div>
          <div class="stat-card-value">${d.total_suppliers}</div>
          <div class="stat-card-sub"><a href="suppliers.html" style="color:var(--primary)">Manage →</a></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-warning">📦</div>
        <div class="stat-card-body">
          <div class="stat-card-label">Items</div>
          <div class="stat-card-value">${d.total_items}</div>
          <div class="stat-card-sub"><a href="items.html" style="color:var(--primary)">Manage →</a></div>
        </div>
      </div>
    </div>

    <!-- Chart + Recent Orders -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Purchase Orders</span>
          <a href="purchase-orders.html" class="btn btn-outline btn-sm" id="btn-view-all-po">View All</a>
        </div>
        <div class="table-wrapper">
          <table class="table" id="recent-po-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Date</th>
                <th class="number-cell">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="recent-po-body"></tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">PO Status Overview</span></div>
        <div class="card-body">
          <div class="chart-container">
            <canvas id="po-chart"></canvas>
          </div>
          <div id="chart-legend" style="margin-top:16px;display:flex;flex-direction:column;gap:8px;"></div>
        </div>
      </div>
    </div>
  `;

  // Render recent POs
  renderRecentPOs(d.recent_orders);

  // Render chart
  renderChart(d.status_chart);
}

function renderRecentPOs(orders) {
  const tbody = document.getElementById('recent-po-body');
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state" style="padding:30px 20px;"><div class="empty-state-icon">📋</div><h3>No purchase orders yet</h3><p>Create your first PO to get started.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><a href="purchase-orders.html?id=${o.id}" style="color:var(--primary);font-weight:600;">${o.po_number}</a></td>
      <td>${o.supplier_name}</td>
      <td>${formatDate(o.po_date)}</td>
      <td class="number-cell fw-600">${formatCurrency(o.grand_total)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>
  `).join('');
}

function renderChart(chartData) {
  const ctx = document.getElementById('po-chart');
  if (!ctx) return;

  const hasData = chartData.some(d => d.value > 0);

  if (poChart) poChart.destroy();

  poChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartData.map(d => d.label),
      datasets: [{
        data: hasData ? chartData.map(d => d.value) : [1],
        backgroundColor: hasData ? chartData.map(d => d.color) : ['#e2e8f0'],
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw} POs`
          }
        }
      },
      animation: { animateRotate: true, duration: 800 },
    },
  });

  // Custom legend
  const legend = document.getElementById('chart-legend');
  if (legend) {
    legend.innerHTML = chartData.map(d => `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0;"></span>
          <span style="color:var(--text-secondary);">${d.label}</span>
        </div>
        <span style="font-weight:700;">${d.value}</span>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
