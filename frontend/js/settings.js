document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupSettingsListeners();
});

// Theme switcher init & state
function initTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    toggleThemeButtons('dark');
  } else {
    document.body.classList.remove('dark-theme');
    toggleThemeButtons('light');
  }
}

function toggleThemeButtons(theme) {
  const lightBtn = document.getElementById('lightThemeBtn');
  const darkBtn = document.getElementById('darkThemeBtn');

  if (theme === 'dark') {
    darkBtn.classList.add('active');
    lightBtn.classList.remove('active');
  } else {
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
  }
}

function setupSettingsListeners() {
  // Theme Buttons click
  document.getElementById('lightThemeBtn').addEventListener('click', () => {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    toggleThemeButtons('light');
    showToast('Theme switched to Light Mode.', 'info');
  });

  document.getElementById('darkThemeBtn').addEventListener('click', () => {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    toggleThemeButtons('dark');
    showToast('Theme switched to Dark Mode.', 'info');
  });

  // Profile Save
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profName').value;
    showToast(`Profile for ${name} saved successfully.`, 'success');
  });

  // Company Details Save
  document.getElementById('companyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Company information updated.', 'success');
  });

  // Security Update
  document.getElementById('securityForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('newPass').value;
    const currentPass = document.getElementById('currentPass').value;

    if (newPass.length < 8) {
      showToast('New password must be at least 8 characters long.', 'danger');
      return;
    }

    showToast('Password changed successfully.', 'success');
    document.getElementById('securityForm').reset();
  });

  // Copy API Key
  document.getElementById('copyApiKeyBtn').addEventListener('click', () => {
    const rawKey = 'pk_live_51Msz8BsgGfXyFm9K00e9a56qPzmTrx902LK8812N';
    navigator.clipboard.writeText(rawKey).then(() => {
      showToast('API Key copied to clipboard!', 'success');
    }).catch(err => {
      showToast('Failed to copy API key.', 'danger');
    });
  });

  // Backup Trigger
  const backupBtn = document.getElementById('triggerBackupBtn');
  backupBtn.addEventListener('click', () => {
    backupBtn.disabled = true;
    backupBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> <span>Backing up...</span>';
    lucide.createIcons();
    showToast('Starting system database backup...', 'info');

    setTimeout(() => {
      backupBtn.disabled = false;
      backupBtn.innerHTML = '<i data-lucide="refresh-cw"></i> <span>Backup Now</span>';
      lucide.createIcons();
      showToast('Database backup successfully uploaded to secure storage.', 'success');
    }, 2500);
  });
}

// Toast helper (Cohesive styling)
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
