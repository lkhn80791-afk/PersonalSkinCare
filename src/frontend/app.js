const API_BASE_URL = '';

const screens = {
  auth: document.getElementById('auth-screen'),
  skin: document.getElementById('skin-screen'),
  dashboard: document.getElementById('dashboard-screen'),
  routine: document.getElementById('routine-screen'),
};

const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authToggle = document.getElementById('auth-toggle');
const authError = document.getElementById('auth-error');
const authSubmit = document.getElementById('auth-submit');
const emailInput = document.getElementById('auth-email');
const firstNameGroup = document.getElementById('first-name-group');
const firstNameInput = document.getElementById('auth-first-name');
const passwordInput = document.getElementById('auth-password');

const dashboardTitle = document.getElementById('dashboard-title');
const dashboardSkin = document.getElementById('dashboard-skin');
const viewRoutineBtn = document.getElementById('view-routine');

const routineError = document.getElementById('routine-error');
const routineLoading = document.getElementById('routine-loading');
const routineContent = document.getElementById('routine-content');
const morningList = document.getElementById('morning-list');
const eveningList = document.getElementById('evening-list');
const backToDashboardBtn = document.getElementById('back-to-dashboard');

let isLoginMode = true;
let authToken = null;
let currentUser = null;
let currentSkinType = null;

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle('active', key === name);
  });
}

function setAuthMode(login) {
  isLoginMode = login;
  if (login) {
    authTitle.textContent = 'Welcome back';
    firstNameGroup.style.display = 'none';
    authSubmit.textContent = 'Log in';
    authToggle.textContent = 'New here? Create an account';
  } else {
    authTitle.textContent = 'Create your account';
    firstNameGroup.style.display = 'block';
    authSubmit.textContent = 'Sign up';
    authToggle.textContent = 'Already have an account? Log in';
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // ignore parse errors
  }

  if (!response.ok) {
    const message = data.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  authError.classList.add('hidden');
  authError.textContent = '';
  authSubmit.disabled = true;
  authSubmit.textContent = isLoginMode ? 'Logging in…' : 'Signing up…';

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const firstName = firstNameInput.value.trim();

    let result;
    if (isLoginMode) {
      result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } else {
      result = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, first_name: firstName }),
      });
    }

    authToken = result.token;
    currentUser = result.user;

    showScreen('skin');
  } catch (error) {
    authError.textContent = error.message;
    authError.classList.remove('hidden');
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent = isLoginMode ? 'Log in' : 'Sign up';
  }
});

authToggle.addEventListener('click', () => {
  setAuthMode(!isLoginMode);
});

document.getElementById('skin-options').addEventListener('click', (event) => {
  const target = event.target.closest('[data-skin]');
  if (!target) return;
  currentSkinType = target.getAttribute('data-skin');

  const name = currentUser?.first_name || 'there';
  dashboardTitle.textContent = `Hi, ${name}`;
  dashboardSkin.textContent = `Skin type: ${currentSkinType}`;

  showScreen('dashboard');
});

viewRoutineBtn.addEventListener('click', async () => {
  if (!authToken || !currentSkinType) return;

  showScreen('routine');
  routineError.classList.add('hidden');
  routineContent.classList.add('hidden');
  routineLoading.classList.remove('hidden');

  try {
    const data = await apiRequest('/routines/recommendation', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        skin_type: currentSkinType,
        concerns: [],
      }),
    });

    const morning = data.morning_products || [];
    const evening = data.evening_products || [];

    morningList.innerHTML = '';
    eveningList.innerHTML = '';

    morning.forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = `${p.name} <span class="step-type">(${p.step_type})</span>`;
      morningList.appendChild(li);
    });

    evening.forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = `${p.name} <span class="step-type">(${p.step_type})</span>`;
      eveningList.appendChild(li);
    });

    routineLoading.classList.add('hidden');
    routineContent.classList.remove('hidden');
  } catch (error) {
    routineLoading.classList.add('hidden');
    routineError.textContent = error.message;
    routineError.classList.remove('hidden');
  }
});

backToDashboardBtn.addEventListener('click', () => {
  showScreen('dashboard');
});

// Initial state
setAuthMode(true);
showScreen('auth');

