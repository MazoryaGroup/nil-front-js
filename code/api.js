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

  // توکن احراز هویت
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
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || json.error || `HTTP ${res.status}`);
    }

    return json;
  } catch (err) {
    console.error(`❌ API ${method} ${endpoint}:`, err);
    throw err;
  }
}

// ============================================
// متدهای پایه
// ============================================
export const apiGet    = (endpoint, options)       => request('GET',    endpoint, null, options);
export const apiPost   = (endpoint, data, options) => request('POST',   endpoint, data, options);
export const apiPut    = (endpoint, data, options) => request('PUT',    endpoint, data, options);
export const apiPatch  = (endpoint, data, options) => request('PATCH',  endpoint, data, options);
export const apiDelete = (endpoint, options)       => request('DELETE', endpoint, null, options);

// ============================================
// Auth API
// ============================================
export const authApi = {
  // ثبت‌نام
 registerSendCode: (name, phone, referral_code) => {
  const payload = { name, phone };
  if (referral_code && referral_code.trim()) {
    payload.referral_code = referral_code.trim();
  }
  return apiPost('/v1/auth/register/send-code', payload);
},

  registerVerify: (phone, code) =>
    apiPost('/v1/auth/register/verify', { phone, code }),

  // ورود با شماره
  loginPhoneSendCode: (phone) =>
    apiPost('/v1/auth/login/phone/send-code', { phone }),

  loginPhoneVerify: (phone, code) =>
    apiPost('/v1/auth/login/phone/verify', { phone, code }),

  // ورود با ایمیل
  loginEmail: (email, password) =>
    apiPost('/v1/auth/login', { email, password }),

  // فراموشی رمز
  forgotSendCode: (phone) =>
    apiPost('/v1/auth/forgot-password/send-code', { phone }),

  forgotVerify: (phone, code) =>
    apiPost('/v1/auth/forgot-password/verify', { phone, code }),

  forgotReset: (phone, reset_token, password, password_confirmation) =>
    apiPost('/v1/auth/forgot-password/reset', {
      phone,
      reset_token,
      password,
      password_confirmation
    }),

  // خروج
  logout: () => apiPost('/v1/auth/logout', {})
};