// Mock User Database
let users = [
  { id: 1, name: 'Sarah Jenkins', email: 's.jenkins@transitops.io', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: 'Marcus Vance', email: 'm.vance@transitops.io', role: 'Driver', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
  { id: 3, name: 'Lena Rostova', email: 'l.rostova@transitops.io', role: 'Fleet Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: 'David Kim', email: 'd.kim@transitops.io', role: 'Dispatcher', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
  { id: 5, name: 'Aisha Coleman', email: 'a.coleman@transitops.io', role: 'Safety Officer', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
  { id: 6, name: 'Jason Brody', email: 'j.brody@transitops.io', role: 'Financial Analyst', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' }
];

// Security Roles Database
const securityRoles = [
  { name: 'Admin', desc: 'Full administrative access to entire platform including database configuration, system audits, and global security policies.' },
  { name: 'Fleet Manager', desc: 'Oversees vehicles database, schedules maintenance logs, and reviews fuel efficiency statistics.' },
  { name: 'Dispatcher', desc: 'Manages create/update trip flows, validates driver availability, cargo weights, and coordinates active logistics lines.' },
  { name: 'Safety Officer', desc: 'Tracks safety score indices, handles compliance records, driver logs audits, and incident reporting boards.' },
  { name: 'Financial Analyst', desc: 'Grants read access to revenue records, operational expense statistics, and exports CSV/PDF finance files.' },
  { name: 'Driver', desc: 'Reads assigned trip records, updates active delivery timeline status, and reports live delays.' }
];

// Permission Map (Linked with matrix column headers ADM, FLM, DIS, SAF, FIN, DRV)
const permissionMatrix = [
  { key: 'perm_users', label: 'Manage System Users', map: [true, false, false, false, false, false] },
  { key: 'perm_trips_write', label: 'Create & Dispatch Trips', map: [true, false, true, false, false, false] },
  { key: 'perm_trips_read', label: 'View Active Trips Board', map: [true, true, true, true, true, true] },
  { key: 'perm_fleet', label: 'Modify Fleet Vehicles List', map: [true, true, false, false, false, false] },
  { key: 'perm_safety', label: 'Audit Driver Logs & Safety', map: [true, false, false, true, false, false] },
  { key: 'perm_financials', label: 'View Financial Metrics', map: [true, false, false, false, true, false] },
  { key: 'perm_db_settings', label: 'Access System Settings', map: [true, false, false, false, false, false] }
];

// Role mapping column abbreviations
const roleAbbr = ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Driver'];

// State Management
let searchQuery = '';
let activeRoleFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initRBAC();
  setupEventListeners();
});

function initRBAC() {
  renderUsers();
  renderRolesList();
  renderPermissionMatrix();
}

function setupEventListeners() {
  // Search bar input
  document.getElementById('userSearch').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderUsers();
  });

  // Filter dropdown
  document.getElementById('roleFilter').addEventListener('change', (e) => {
    activeRoleFilter = e.target.value;
    renderUsers();
  });

  // Modal open/close actions
  const modal = document.getElementById('userModal');
  document.getElementById('addUserBtn').addEventListener('click', () => {
    openUserModal('add');
  });

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  // Form Submission (Add or Edit)
  document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveUser();
  });
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery);
    const matchesRole = activeRoleFilter === 'all' || user.role === activeRoleFilter;
    return matchesSearch && matchesRole;
  });

  filteredUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="user-cell">
          <img src="${user.avatar}" alt="${user.name}" class="user-cell-avatar">
          <span>${user.name}</span>
        </div>
      </td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <span class="chip chip-${user.status === 'Active' ? 'active' : 'inactive'}">${user.status}</span>
      </td>
      <td class="text-right">
        <div class="actions-cell">
          <button class="action-btn edit" onclick="editUserById(${user.id})" title="Edit User">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="action-btn delete" onclick="deleteUserById(${user.id})" title="Delete User">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

function renderRolesList() {
  const container = document.getElementById('rolesList');
  container.innerHTML = '';

  securityRoles.forEach(role => {
    const div = document.createElement('div');
    div.className = 'role-def-item';
    div.innerHTML = `
      <span class="role-def-badge">${role.name}</span>
      <div class="role-def-details">
        <h4>${role.name} Permissions Context</h4>
        <p>${role.desc}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderPermissionMatrix() {
  const tbody = document.getElementById('matrixTableBody');
  tbody.innerHTML = '';

  permissionMatrix.forEach((perm, index) => {
    const tr = document.createElement('tr');
    let cellsHTML = `<td>${perm.label}</td>`;
    
    roleAbbr.forEach((roleName, rIdx) => {
      const isChecked = perm.map[rIdx] ? 'checked' : '';
      cellsHTML += `
        <td>
          <label class="switch">
            <input type="checkbox" ${isChecked} onchange="toggleMatrixPermission(${index}, ${rIdx}, '${roleName}')">
            <span class="slider"></span>
          </label>
        </td>
      `;
    });

    tr.innerHTML = cellsHTML;
    tbody.appendChild(tr);
  });
}

// Global Permission Change Handlers
window.toggleMatrixPermission = function(pIdx, rIdx, roleName) {
  permissionMatrix[pIdx].map[rIdx] = !permissionMatrix[pIdx].map[rIdx];
  const permissionLabel = permissionMatrix[pIdx].label;
  const isEnabled = permissionMatrix[pIdx].map[rIdx];
  
  showToast(
    `Role '${roleName}' has had access to '${permissionLabel}' ${isEnabled ? 'ENABLED' : 'DISABLED'} globally.`,
    isEnabled ? 'success' : 'danger'
  );
};

// Modal Operations
function openUserModal(mode, userId = null) {
  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');
  const title = document.getElementById('modalTitle');

  form.reset();

  if (mode === 'add') {
    title.textContent = 'Add System User';
    document.getElementById('editUserId').value = '';
  } else if (mode === 'edit' && userId) {
    title.textContent = 'Edit System User';
    const user = users.find(u => u.id === userId);
    if (user) {
      document.getElementById('editUserId').value = user.id;
      document.getElementById('userNameInput').value = user.name;
      document.getElementById('userEmailInput').value = user.email;
      document.getElementById('userRoleInput').value = user.role;
      document.getElementById('userStatusInput').value = user.status;
    }
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('userModal').classList.add('hidden');
}

// Add/Save User database changes
function saveUser() {
  const idVal = document.getElementById('editUserId').value;
  const name = document.getElementById('userNameInput').value;
  const email = document.getElementById('userEmailInput').value;
  const role = document.getElementById('userRoleInput').value;
  const status = document.getElementById('userStatusInput').value;

  if (idVal) {
    // Edit Mode
    const userIndex = users.findIndex(u => u.id === parseInt(idVal));
    if (userIndex !== -1) {
      users[userIndex].name = name;
      users[userIndex].email = email;
      users[userIndex].role = role;
      users[userIndex].status = status;
      showToast(`User ${name} updated successfully.`, 'success');
    }
  } else {
    // Add Mode
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email,
      role,
      status,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&w=100&q=80`
    };
    users.push(newUser);
    showToast(`User ${name} added successfully.`, 'success');
  }

  closeModal();
  renderUsers();
}

window.editUserById = function(userId) {
  openUserModal('edit', userId);
};

window.deleteUserById = function(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  if (confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) {
    users = users.filter(u => u.id !== userId);
    showToast(`User ${user.name} removed from security directories.`, 'danger');
    renderUsers();
  }
};

// Toast notification helper (Cohesion)
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

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}
