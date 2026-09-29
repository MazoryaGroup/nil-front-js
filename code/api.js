// ============================================
// API Client - اتصال به Laravel
// ============================================

const BASE_URL = import.meta.env?.VITE_API_URL || '/api';

// ============================================
// درخواست اصلی
// ============================================
async function request(method, endpoint, data = null, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  // اضافه کردن توکن احراز هویت
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, config);

    // خطای 401 → logout
    if (res.status === 401) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }

    return json;
  } catch (err) {
    console.error(`❌ API ${method} ${endpoint}:`, err);
    throw err;
  }
}

// ============================================
// متدها
// ============================================
export const apiGet    = (endpoint, options)       => request('GET',    endpoint, null, options);
export const apiPost   = (endpoint, data, options) => request('POST',   endpoint, data, options);
export const apiPut    = (endpoint, data, options) => request('PUT',    endpoint, data, options);
export const apiPatch  = (endpoint, data, options) => request('PATCH',  endpoint, data, options);
export const apiDelete = (endpoint, options)       => request('DELETE', endpoint, null, options);