
import { authApi } from './api.js';

// ============================================
// NIL BEAUTY - AUTH MANAGEMENT
// Session expiration: 10 minutes
// ============================================

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const LOGIN_TIME_KEY = 'auth_login_time';

const SESSION_DURATION = 10 * 60 * 1000;

let currentUser = null;
let sessionTimer = null;
let authInitialized = false;
let loggingOut = false;

// ============================================
// Helpers
// ============================================

function getLoginTime() {
  const value = localStorage.getItem(LOGIN_TIME_KEY);

  if (!value) return null;

  const timestamp = Number(value);

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return null;
  }

  return timestamp;
}

function getRemainingTime() {
  const loginTime = getLoginTime();

  if (!loginTime) return 0;

  return Math.max(
    0,
    SESSION_DURATION - (Date.now() - loginTime)
  );
}

function clearSessionTimer() {
  if (sessionTimer !== null) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
}

function clearAuth() {
  clearSessionTimer();

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGIN_TIME_KEY);

  currentUser = null;
}

function redirectToLogin() {
  if (window.location.pathname === '/login') {
    return;
  }

  if (window.__app?.router?.navigate) {
    window.__app.router.navigate('/login');
  } else {
    window.location.replace('/login');
  }
}

function expireSession() {
  const hadSession =
    !!localStorage.getItem(TOKEN_KEY) ||
    !!localStorage.getItem(LOGIN_TIME_KEY);

  clearAuth();

  if (hadSession) {
    window.dispatchEvent(
      new CustomEvent('auth:logout', {
        detail: { reason: 'session_expired' }
      })
    );
  }

  redirectToLogin();
}

function scheduleSessionExpiration() {
  clearSessionTimer();

  const remaining = getRemainingTime();

  if (remaining <= 0) {
    expireSession();
    return;
  }

  sessionTimer = setTimeout(() => {
    if (getRemainingTime() <= 0) {
      expireSession();
    } else {
      scheduleSessionExpiration();
    }
  }, remaining);
}

// ============================================
// Check session validity
// ============================================

function hasValidSession() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return false;

  const loginTime = getLoginTime();

  if (!loginTime) {
    expireSession();
    return false;
  }

  if (
    loginTime > Date.now() ||
    Date.now() - loginTime >= SESSION_DURATION
  ) {
    expireSession();
    return false;
  }

  return true;
}

// ============================================
// Initialize auth
// ============================================

export function initAuth() {
  if (authInitialized) return;

  authInitialized = true;

  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (token) {
    if (!hasValidSession()) {
      return;
    }

    if (user) {
      try {
        currentUser = JSON.parse(user);
      } catch {
        expireSession();
        return;
      }
    }

    scheduleSessionExpiration();
  } else {
    clearAuth();
  }

  window.addEventListener('auth:expired', () => {
    expireSession();
  });

  // Check when user returns to browser tab
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && localStorage.getItem(TOKEN_KEY)) {
      if (hasValidSession()) {
        scheduleSessionExpiration();
      }
    }
  });

  // Sync logout between browser tabs
  window.addEventListener('storage', (event) => {
    if (
      event.key === TOKEN_KEY ||
      event.key === LOGIN_TIME_KEY
    ) {
      if (!localStorage.getItem(TOKEN_KEY)) {
        clearAuth();
        window.dispatchEvent(
          new CustomEvent('auth:logout')
        );
        redirectToLogin();
      } else if (hasValidSession()) {
        scheduleSessionExpiration();
      }
    }
  });
}

// ============================================
// Save authentication
// ============================================

export function setAuth(token, user) {
  clearSessionTimer();

  const loginTime = Date.now();

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(
    LOGIN_TIME_KEY,
    String(loginTime)
  );

  currentUser = user;

  scheduleSessionExpiration();

  window.dispatchEvent(
    new CustomEvent('auth:login', {
      detail: { user }
    })
  );
}

// ============================================
// Logout
// ============================================

export async function logout() {
  if (loggingOut) return;

  loggingOut = true;

  console.log('🚪 Logging out...');

  try {
    await authApi.logout();
    console.log('✅ Logout API success');
  } catch (error) {
    console.warn(
      '⚠️ Logout API failed:',
      error.message
    );
  } finally {
    clearAuth();

    window.dispatchEvent(
      new CustomEvent('auth:logout')
    );

    redirectToLogin();

    loggingOut = false;
  }
}

// ============================================
// Getters
// ============================================

export function getToken() {
  if (!hasValidSession()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (!hasValidSession()) {
    return null;
  }

  if (currentUser) {
    return currentUser;
  }

  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) return null;

  try {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  } catch {
    expireSession();
    return null;
  }
}

export function isLoggedIn() {
  return hasValidSession();
}

// ============================================
// Optional session helpers
// ============================================

export function getSessionRemainingSeconds() {
  if (!hasValidSession()) return 0;

  return Math.ceil(getRemainingTime() / 1000);
}

export function getSessionExpiresAt() {
  if (!hasValidSession()) return null;

  return getLoginTime() + SESSION_DURATION;
}
