const API_BASE_URL = '';

const screens = {
  auth: document.getElementById('auth-screen'),
  skin: document.getElementById('skin-screen'),
  dashboard: document.getElementById('dashboard-screen'),
  routine: document.getElementById('routine-screen'),
  community: document.getElementById('community-screen'),
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

const ageInput = document.getElementById('age');
const darkCirclesInput = document.getElementById('dark-circles');
const acneInput = document.getElementById('acne');
const drynessInput = document.getElementById('dryness');
const budgetInput = document.getElementById('budget');

const goCommunityBtn = document.getElementById('go-community');
const communityError = document.getElementById('community-error');
const postForm = document.getElementById('post-form');
const postContentInput = document.getElementById('post-content');
const postsList = document.getElementById('posts-list');
const backToDashboardFromCommunityBtn = document.getElementById(
  'back-to-dashboard-from-community',
);

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

document.getElementById('skin-options').addEventListener('click', async (event) => {
  const target = event.target.closest('[data-skin]');
  if (!target) return;
  currentSkinType = target.getAttribute('data-skin');

  const name = currentUser?.first_name || 'there';
  dashboardTitle.textContent = `Hi, ${name}`;
  dashboardSkin.textContent = `Skin type: ${currentSkinType}`;

  const profile = {
    skin_type: currentSkinType,
    age: Number(ageInput.value || 0) || null,
    dark_circles: darkCirclesInput.value || null,
    acne: acneInput.value || null,
    dryness: drynessInput.value || null,
    budget: Number(budgetInput.value || 0) || null,
  };

  try {
    if (authToken) {
      await apiRequest('/profiles', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profile),
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save profile', error);
  }

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
      const li = createProductCheckboxItem(p, 'morning');
      morningList.appendChild(li);
    });

    evening.forEach((p) => {
      const li = createProductCheckboxItem(p, 'evening');
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

function getRoutineStorageKey(period) {
  const userId = currentUser?.user_id || 'anonymous';
  const today = new Date().toISOString().slice(0, 10);
  return `routine:${userId}:${today}:${period}`;
}

function saveRoutineCompletion(period, productId, done) {
  const key = getRoutineStorageKey(period);
  const existing = JSON.parse(localStorage.getItem(key) || '{}');
  existing[productId] = done;
  localStorage.setItem(key, JSON.stringify(existing));
}

function getRoutineCompletion(period) {
  const key = getRoutineStorageKey(period);
  return JSON.parse(localStorage.getItem(key) || '{}');
}

function createProductCheckboxItem(product, period) {
  const li = document.createElement('li');
  const id = `step-${period}-${product.product_id}`;
  const stored = getRoutineCompletion(period);
  const isChecked = !!stored[product.product_id];

  li.innerHTML = `
    <label>
      <input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''} />
      ${product.name} <span class="step-type">(${product.step_type})</span>
    </label>
  `;

  const checkbox = li.querySelector('input');
  checkbox.addEventListener('change', () => {
    saveRoutineCompletion(period, product.product_id, checkbox.checked);
  });

  return li;
}

goCommunityBtn.addEventListener('click', async () => {
  communityError.classList.add('hidden');
  postsList.innerHTML = '';
  showScreen('community');

  try {
    const posts = await apiRequest('/community/posts', {
      method: 'GET',
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    });

    posts.forEach((post) => {
      const li = document.createElement('li');
      const author = post.user?.first_name || 'Anonymous';
      li.textContent = `${author}: ${post.content}`;
      postsList.appendChild(li);
    });
  } catch (error) {
    communityError.textContent = error.message;
    communityError.classList.remove('hidden');
  }
});

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  communityError.classList.add('hidden');

  const content = postContentInput.value.trim();
  if (!content) return;

  try {
    await apiRequest('/community/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content }),
    });
    postContentInput.value = '';
    goCommunityBtn.click();
  } catch (error) {
    communityError.textContent = error.message;
    communityError.classList.remove('hidden');
  }
});

backToDashboardFromCommunityBtn.addEventListener('click', () => {
  showScreen('dashboard');
});

setAuthMode(true);
showScreen('auth');

