// ============================================
// Auth - احراز هویت
// ============================================

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
      logout();
    }
  }

  // گوش دادن به انقضای توکن
  window.addEventListener('auth:expired', () => {
    logout();
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
// خروج
// ============================================
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  currentUser = null;
  window.dispatchEvent(new CustomEvent('auth:logout'));
}

// ============================================
// گرفتن توکن
// ============================================
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ============================================
// گرفتن کاربر فعلی
// ============================================
export function getUser() {
  return currentUser;
}

// ============================================
// آیا لاگین است؟
// ============================================
export function isLoggedIn() {
  return !!getToken();
}