// Dummy Database & Seed Data
const vehicles = [
  { id: 'TRK-1002', name: 'Volvo FH16 Semi', capacity: 18000, status: 'Available', type: 'Semi-Truck' },
  { id: 'TRK-8802', name: 'Isuzu NPR Box', capacity: 5000, status: 'Maintenance', type: 'Box Truck' },
  { id: 'TRK-4401', name: 'Kenworth T680 Flatbed', capacity: 15000, status: 'Available', type: 'Flatbed' },
  { id: 'TRK-9005', name: 'Peterbilt Reefer', capacity: 10000, status: 'In-Transit', type: 'Refrigerated' }
];

const drivers = [
  { id: 'D-201', name: 'Marcus Vance', status: 'Available', phone: '+1 (555) 234-5678' },
  { id: 'D-550', name: 'Lena Rostova', status: 'Active Trip', phone: '+1 (555) 876-5432' },
  { id: 'D-882', name: 'Jason Brody', status: 'Off-Duty', phone: '+1 (555) 901-2345' },
  { id: 'D-119', name: 'Aisha Coleman', status: 'Available', phone: '+1 (555) 345-6789' }
];

let trips = [
  {
    id: 'TX-4091',
    startLocation: 'Chicago Hub',
    endLocation: 'Detroit Depot',
    driver: 'Aisha Coleman',
    vehicle: 'Kenworth T680 Flatbed',
    distance: 450,
    cargo: 8500,
    status: 'Completed',
    eta: 'Arrived'
  },
  {
    id: 'TX-3304',
    startLocation: 'Dallas Hub',
    endLocation: 'Houston Depot',
    driver: 'Lena Rostova',
    vehicle: 'Peterbilt Reefer',
    distance: 380,
    cargo: 6200,
    status: 'Dispatched',
    eta: '2.5 hrs'
  },
  {
    id: 'TX-0128',
    startLocation: 'Miami Port',
    endLocation: 'Atlanta Distribution',
    driver: 'Marcus Vance',
    vehicle: 'Volvo FH16 Semi',
    distance: 1050,
    cargo: 14000,
    status: 'Draft',
    eta: 'Not Dispatched'
  }
];

const timelineLogs = [
  { time: '14:25', type: 'success', message: 'Trip #TX-4091 completed at Detroit Depot.' },
  { time: '12:00', type: 'info', message: 'Trip #TX-3304 departed Dallas Hub.' },
  { time: '09:15', type: 'warning', message: 'Vehicle #TRK-8802 status set to Maintenance.' }
];

// App State
let activeFilter = 'all';
let searchQuery = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  setupEventListeners();
  validateForm();
});

function initUI() {
  populateDropdowns();
  renderTrips();
  renderVehiclesList();
  renderDriversList();
  renderTimeline();
}

function populateDropdowns() {
  const vehicleSelect = document.getElementById('vehicleSelect');
  const driverSelect = document.getElementById('driverSelect');

  // Clear selections
  vehicleSelect.innerHTML = '<option value="" disabled selected>Select an available vehicle</option>';
  driverSelect.innerHTML = '<option value="" disabled selected>Select an available driver</option>';

  vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.name} (${v.id}) - Max: ${v.capacity}kg [${v.status}]`;
    vehicleSelect.appendChild(opt);
  });

  drivers.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.id}) - [${d.status}]`;
    driverSelect.appendChild(opt);
  });
}

// Validation Logic
function validateForm() {
  const vehicleId = document.getElementById('vehicleSelect').value;
  const driverId = document.getElementById('driverSelect').value;
  const cargoWeightVal = parseFloat(document.getElementById('cargoWeight').value) || 0;
  
  const valDriver = document.getElementById('valDriver');
  const valVehicle = document.getElementById('valVehicle');
  const valCargo = document.getElementById('valCargo');
  const dispatchBtn = document.getElementById('dispatchBtn');

  let driverOk = false;
  let vehicleOk = false;
  let cargoOk = false;

  // 1. Driver check
  if (driverId) {
    const driver = drivers.find(d => d.id === driverId);
    if (driver.status === 'Available') {
      valDriver.className = 'validation-item success';
      valDriver.innerHTML = `<i data-lucide="check-circle" class="val-icon"></i> <span>Driver ${driver.name} is available.</span>`;
      driverOk = true;
    } else {
      valDriver.className = 'validation-item danger';
      valDriver.innerHTML = `<i data-lucide="alert-circle" class="val-icon"></i> <span>Driver ${driver.name} is ${driver.status} (Unavailable).</span>`;
    }
  } else {
    valDriver.className = 'validation-item';
    valDriver.innerHTML = `<i data-lucide="circle-dashed" class="val-icon"></i> <span>Select driver to verify status</span>`;
  }

  // 2. Vehicle check
  let selectedVehicleCapacity = 0;
  if (vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    selectedVehicleCapacity = vehicle.capacity;
    if (vehicle.status === 'Available') {
      valVehicle.className = 'validation-item success';
      valVehicle.innerHTML = `<i data-lucide="check-circle" class="val-icon"></i> <span>Vehicle ${vehicle.name} is available.</span>`;
      vehicleOk = true;
    } else {
      valVehicle.className = 'validation-item danger';
      valVehicle.innerHTML = `<i data-lucide="alert-circle" class="val-icon"></i> <span>Vehicle ${vehicle.name} is ${vehicle.status} (Unavailable).</span>`;
    }
  } else {
    valVehicle.className = 'validation-item';
    valVehicle.innerHTML = `<i data-lucide="circle-dashed" class="val-icon"></i> <span>Select vehicle to verify status</span>`;
  }

  // 3. Cargo Cap validation
  if (cargoWeightVal > 0) {
    if (vehicleId) {
      if (cargoWeightVal <= selectedVehicleCapacity) {
        valCargo.className = 'validation-item success';
        valCargo.innerHTML = `<i data-lucide="check-circle" class="val-icon"></i> <span>Cargo weight (${cargoWeightVal}kg) within limit (${selectedVehicleCapacity}kg).</span>`;
        cargoOk = true;
      } else {
        valCargo.className = 'validation-item danger';
        valCargo.innerHTML = `<i data-lucide="alert-circle" class="val-icon"></i> <span>Cargo weight exceeds vehicle capacity by ${cargoWeightVal - selectedVehicleCapacity}kg!</span>`;
      }
    } else {
      valCargo.className = 'validation-item';
      valCargo.innerHTML = `<i data-lucide="circle-dashed" class="val-icon"></i> <span>Select vehicle to validate cargo capacity.</span>`;
    }
  } else {
    valCargo.className = 'validation-item';
    valCargo.innerHTML = `<i data-lucide="circle-dashed" class="val-icon"></i> <span>Enter cargo weight to validate capacity</span>`;
  }

  lucide.createIcons();

  // Enable/Disable Dispatch Button
  if (driverOk && vehicleOk && cargoOk) {
    dispatchBtn.disabled = false;
  } else {
    dispatchBtn.disabled = true;
  }
}

function setupEventListeners() {
  // Realtime form check
  document.getElementById('vehicleSelect').addEventListener('change', validateForm);
  document.getElementById('driverSelect').addEventListener('change', validateForm);
  document.getElementById('cargoWeight').addEventListener('input', validateForm);

  // Form submission
  document.getElementById('createTripForm').addEventListener('submit', (e) => {
    e.preventDefault();
    dispatchTrip('Dispatched');
  });

  document.getElementById('saveDraftBtn').addEventListener('click', () => {
    dispatchTrip('Draft');
  });

  // Search input
  document.getElementById('tripSearch').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTrips();
  });

  // Filter Pills
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      filterPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-status');
      renderTrips();
    });
  });

  // Notifications Toggle
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationsDropdown = document.getElementById('notificationsDropdown');
  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationsDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    notificationsDropdown.classList.add('hidden');
  });
}

function dispatchTrip(status) {
  const vehicleId = document.getElementById('vehicleSelect').value;
  const driverId = document.getElementById('driverSelect').value;
  const cargo = parseFloat(document.getElementById('cargoWeight').value);
  const distance = parseFloat(document.getElementById('routeDistance').value);
  const startLocation = document.getElementById('startLocation').value;
  const endLocation = document.getElementById('endLocation').value;

  const vehicle = vehicles.find(v => v.id === vehicleId);
  const driver = drivers.find(d => d.id === driverId);

  const tripId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
  const etaHours = Math.ceil(distance / 70); // Estimating 70km/h
  const eta = status === 'Dispatched' ? `${etaHours} hrs` : (status === 'Draft' ? 'Not Dispatched' : 'Arrived');

  const newTrip = {
    id: tripId,
    startLocation,
    endLocation,
    driver: driver.name,
    vehicle: vehicle.name,
    distance,
    cargo,
    status,
    eta
  };

  // Add trip to start of array
  trips.unshift(newTrip);

  // Update statuses if dispatched
  if (status === 'Dispatched') {
    vehicle.status = 'In-Transit';
    driver.status = 'Active Trip';
    showToast(`Trip ${tripId} has been successfully dispatched!`, 'success');
    addTimelineLog('info', `Trip #${tripId} dispatched. Driver: ${driver.name}.`);
  } else {
    showToast(`Trip draft ${tripId} saved.`, 'info');
    addTimelineLog('success', `Draft trip #${tripId} created.`);
  }

  // Refresh lists
  populateDropdowns();
  renderTrips();
  renderVehiclesList();
  renderDriversList();
  validateForm();
  document.getElementById('createTripForm').reset();
}

function addTimelineLog(type, message) {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  timelineLogs.unshift({ time: timeStr, type, message });
  renderTimeline();
}

// Render dynamic trips on dispatch board
function renderTrips() {
  const tripsGrid = document.getElementById('tripsGrid');
  const emptyState = document.getElementById('tripsEmptyState');

  const filteredTrips = trips.filter(trip => {
    const matchesFilter = activeFilter === 'all' || trip.status === activeFilter;
    const matchesSearch = trip.id.toLowerCase().includes(searchQuery) ||
                          trip.startLocation.toLowerCase().includes(searchQuery) ||
                          trip.endLocation.toLowerCase().includes(searchQuery) ||
                          trip.driver.toLowerCase().includes(searchQuery) ||
                          trip.vehicle.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  tripsGrid.innerHTML = '';

  if (filteredTrips.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  filteredTrips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';
    card.innerHTML = `
      <div class="trip-route-icon">
        <i data-lucide="navigation-2"></i>
      </div>
      <div class="trip-info-main">
        <div class="trip-locations">
          <span>${trip.startLocation}</span>
          <i data-lucide="arrow-right" class="trip-arrow"></i>
          <span>${trip.endLocation}</span>
        </div>
        <div class="trip-details-meta">
          <div class="trip-meta-item">
            <i data-lucide="hash"></i>
            <span>${trip.id}</span>
          </div>
          <div class="trip-meta-item">
            <i data-lucide="user"></i>
            <span>${trip.driver}</span>
          </div>
          <div class="trip-meta-item">
            <i data-lucide="truck"></i>
            <span>${trip.vehicle}</span>
          </div>
          <div class="trip-meta-item">
            <i data-lucide="box"></i>
            <span>${trip.cargo} kg</span>
          </div>
          <div class="trip-meta-item">
            <i data-lucide="map-pin"></i>
            <span>${trip.distance} km</span>
          </div>
          <div class="trip-meta-item">
            <i data-lucide="clock"></i>
            <span>ETA: ${trip.eta}</span>
          </div>
        </div>
      </div>
      <div>
        <span class="status-badge status-${trip.status.toLowerCase()}">${trip.status}</span>
      </div>
    `;
    tripsGrid.appendChild(card);
  });

  lucide.createIcons();
}

function renderVehiclesList() {
  const container = document.getElementById('vehicleStatusList');
  container.innerHTML = '';

  vehicles.forEach(v => {
    let dotClass = 'dot-success';
    if (v.status === 'Maintenance') dotClass = 'dot-danger';
    if (v.status === 'In-Transit') dotClass = 'dot-warning';

    const div = document.createElement('div');
    div.className = 'status-item';
    div.innerHTML = `
      <div class="status-item-left">
        <span class="status-dot ${dotClass}"></span>
        <div>
          <div class="item-title">${v.name}</div>
          <div class="item-subtitle">${v.type} • Cap: ${v.capacity}kg</div>
        </div>
      </div>
      <span class="badge ${v.status === 'Available' ? 'badge-info' : 'badge-secondary'}">${v.status}</span>
    `;
    container.appendChild(div);
  });
}

function renderDriversList() {
  const container = document.getElementById('driverStatusList');
  container.innerHTML = '';

  drivers.forEach(d => {
    let dotClass = 'dot-success';
    if (d.status === 'Off-Duty') dotClass = 'dot-danger';
    if (d.status === 'Active Trip') dotClass = 'dot-warning';

    const div = document.createElement('div');
    div.className = 'status-item';
    div.innerHTML = `
      <div class="status-item-left">
        <span class="status-dot ${dotClass}"></span>
        <div>
          <div class="item-title">${d.name}</div>
          <div class="item-subtitle">${d.phone}</div>
        </div>
      </div>
      <span class="badge ${d.status === 'Available' ? 'badge-info' : 'badge-secondary'}">${d.status}</span>
    `;
    container.appendChild(div);
  });
}

function renderTimeline() {
  const container = document.getElementById('timelineList');
  container.innerHTML = '';

  timelineLogs.forEach(log => {
    const div = document.createElement('div');
    div.className = 'timeline-event';
    div.innerHTML = `
      <span class="timeline-point ${log.type === 'success' ? 'success' : (log.type === 'warning' ? 'danger' : '')}"></span>
      <div class="timeline-time">${log.time}</div>
      <div class="timeline-desc">${log.message}</div>
    `;
    container.appendChild(div);
  });
}

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'check-circle';
  if (type === 'danger') icon = 'alert-octagon';
  if (type === 'info') icon = 'info';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}
