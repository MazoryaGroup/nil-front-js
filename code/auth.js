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
// پاک کردن توکن
// ============================================
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  currentUser = null;
}

// ============================================
// خروج (با API)
// ============================================
export async function logout() {
  try {
    await authApi.logout();
  } catch (err) {
    console.warn('⚠️ Logout API failed:', err.message);
  } finally {
    clearAuth();
    window.dispatchEvent(new CustomEvent('auth:logout'));
    window.__app?.router?.navigate('/login');
  }
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