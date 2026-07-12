// Mock data arrays for performers
const topVehicles = [
  { rank: 1, id: 'TRK-1002', name: 'Volvo FH16 Semi', efficiency: '98%', status: 'Active', revenue: '$42,300' },
  { rank: 2, id: 'TRK-4401', name: 'Kenworth Flatbed', efficiency: '94%', status: 'Active', revenue: '$38,150' },
  { rank: 3, id: 'TRK-9005', name: 'Peterbilt Reefer', efficiency: '91%', status: 'Active', revenue: '$32,900' }
];

const topDrivers = [
  { rank: 1, name: 'Marcus Vance', safety: '99.2', status: 'Excellent', trips: 42 },
  { rank: 2, name: 'Aisha Coleman', safety: '98.5', status: 'Excellent', trips: 39 },
  { rank: 3, name: 'Jason Brody', safety: '95.8', status: 'Good', trips: 35 }
];

// App State (to hold chart references for updating)
let revenueChartInstance = null;
let fuelChartInstance = null;
let tripsChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initAnalytics();
  setupEventListeners();
});

function initAnalytics() {
  renderPerformers();
  initCharts();
}

function setupEventListeners() {
  // Date Range Change Updates KPIs
  const dateRangeSelect = document.getElementById('dateRange');
  dateRangeSelect.addEventListener('change', (e) => {
    updateKPIs(e.target.value);
    showToast(`Dashboard updated for the last ${e.target.value === '12m' ? '12 Months' : e.target.value}`, 'info');
  });

  // Export Buttons
  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    showToast('Exporting analytics data to CSV...', 'info');
    setTimeout(() => {
      showToast('CSV downloaded successfully.', 'success');
    }, 1500);
  });

  document.getElementById('exportPdfBtn').addEventListener('click', () => {
    showToast('Compiling PDF report...', 'info');
    setTimeout(() => {
      showToast('Operational Report PDF generated.', 'success');
    }, 2000);
  });
}

// Dynamically updates KPI metrics depending on date select
function updateKPIs(range) {
  const kpiFleet = document.getElementById('kpiFleetUtilization');
  const kpiFuel = document.getElementById('kpiFuelEfficiency');
  const kpiRevenue = document.getElementById('kpiRevenue');
  const kpiCost = document.getElementById('kpiOperationalCost');
  const kpiRoi = document.getElementById('kpiRoi');
  const kpiMaint = document.getElementById('kpiMaintenanceCost');

  if (range === '7d') {
    kpiFleet.textContent = '82.1%';
    kpiFuel.textContent = '3.0 km/L';
    kpiRevenue.textContent = '$38,200';
    kpiCost.textContent = '$22,400';
    kpiRoi.textContent = '22.1%';
    kpiMaint.textContent = '$2,100';
  } else if (range === '30d') {
    kpiFleet.textContent = '86.4%';
    kpiFuel.textContent = '3.2 km/L';
    kpiRevenue.textContent = '$142,500';
    kpiCost.textContent = '$84,120';
    kpiRoi.textContent = '24.8%';
    kpiMaint.textContent = '$9,340';
  } else if (range === '90d') {
    kpiFleet.textContent = '88.9%';
    kpiFuel.textContent = '3.3 km/L';
    kpiRevenue.textContent = '$438,000';
    kpiCost.textContent = '$241,500';
    kpiRoi.textContent = '26.4%';
    kpiMaint.textContent = '$26,180';
  } else if (range === '12m') {
    kpiFleet.textContent = '91.2%';
    kpiFuel.textContent = '3.5 km/L';
    kpiRevenue.textContent = '$1,840,000';
    kpiCost.textContent = '$992,000';
    kpiRoi.textContent = '28.5%';
    kpiMaint.textContent = '$108,400';
  }
}

function renderPerformers() {
  const vList = document.getElementById('topVehiclesList');
  const dList = document.getElementById('topDriversList');

  vList.innerHTML = '';
  dList.innerHTML = '';

  topVehicles.forEach(v => {
    const div = document.createElement('div');
    div.className = 'performer-item';
    div.innerHTML = `
      <div class="performer-left">
        <span class="rank-badge">${v.rank}</span>
        <div class="performer-info">
          <h4>${v.name}</h4>
          <p>ID: ${v.id} • ROI Score: ${v.efficiency}</p>
        </div>
      </div>
      <div class="performer-metric">
        <div class="performer-score">${v.revenue}</div>
        <div class="performer-subtext">Revenue Earned</div>
      </div>
    `;
    vList.appendChild(div);
  });

  topDrivers.forEach(d => {
    const div = document.createElement('div');
    div.className = 'performer-item';
    div.innerHTML = `
      <div class="performer-left">
        <span class="rank-badge">${d.rank}</span>
        <div class="performer-info">
          <h4>${d.name}</h4>
          <p>${d.trips} Trips Completed • ${d.status}</p>
        </div>
      </div>
      <div class="performer-metric">
        <div class="performer-score">${d.safety} / 100</div>
        <div class="performer-subtext">Safety Rating</div>
      </div>
    `;
    dList.appendChild(div);
  });
}

function initCharts() {
  // 1. Bar Chart - Revenue vs Cost
  const ctxBar = document.getElementById('revenueBarChart').getContext('2d');
  revenueChartInstance = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [120000, 135000, 115000, 142500, 150000, 165000],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        },
        {
          label: 'Operational Costs ($)',
          data: [78000, 81000, 75000, 84120, 88000, 92000],
          backgroundColor: '#ef4444',
          borderRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'Inter' }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#f1f5f9' } }
      }
    }
  });

  // 2. Line Chart - Fuel Consumption
  const ctxLine = document.getElementById('fuelLineChart').getContext('2d');
  fuelChartInstance = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Fuel Consumption (L)',
        data: [1200, 1350, 1250, 1400, 1550, 1100, 950],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#f1f5f9' } }
      }
    }
  });

  // 3. Pie Chart - Regional distribution
  const ctxPie = document.getElementById('tripsPieChart').getContext('2d');
  tripsChartInstance = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: ['Midwest', 'South', 'East Coast', 'West Coast'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#3b82f6', '#22c55e', '#facc15', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { family: 'Inter', size: 11 },
            boxWidth: 12
          }
        }
      }
    }
  });
}

// Toast helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'check-circle';
  if (type === 'info') icon = 'info';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}
