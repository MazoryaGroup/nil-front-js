// ============================================
// Auth - احراز هویت
// ============================================
import { authApi } from './api.js';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

let currentUser = null;

// ============================================
// راه‌اندازی
// ============================================
export function initAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (token && user) {
    try {
      currentUser = JSON.parse(user);
    } catch {
      clearAuth();
    }
  }

  window.addEventListener('auth:expired', () => {
    clearAuth();
    window.dispatchEvent(new CustomEvent('auth:logout'));
  });
}

// ============================================
// ذخیره توکن
// ============================================
export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  currentUser = user;
  window.dispatchEvent(new CustomEvent('auth:login', { detail: { user } }));
}

// ============================================
// پاک کردن توکن (بدون navigate)
// ============================================
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  currentUser = null;
}

// ============================================
// خروج (با API + navigate)
// ============================================
export async function logout() {
  console.log('🚪 Logging out...');

  try {
    // صدا زدن API (اگه fail داد، مهم نیست)
    await authApi.logout();
    console.log('✅ Logout API success');
  } catch (err) {
    console.warn('⚠️ Logout API failed:', err.message);
  }

  // پاک کردن localStorage
  clearAuth();
  console.log('🗑️ Auth cleared');

  // dispatch event
  window.dispatchEvent(new CustomEvent('auth:logout'));

  // ریدایرکت
  setTimeout(() => {
    if (window.__app?.router) {
      window.__app.router.navigate('/login');
    } else {
      window.location.href = '/login';
    }
  }, 100);
}

// ============================================
// گرفتن‌ها
// ============================================
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  return currentUser;
}

export function isLoggedIn() {
  return !!getToken();
}