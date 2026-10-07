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

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, config);

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
  registerSendCode: (name, phone, referral_code) => {
    const payload = { name, phone };
    if (referral_code && referral_code.trim()) {
      payload.referral_code = referral_code.trim();
    }
    return apiPost('/v1/auth/register/send-code', payload);
  },

  registerVerify: (phone, code) =>
    apiPost('/v1/auth/register/verify', { phone, code }),

  loginPhoneSendCode: (phone) =>
    apiPost('/v1/auth/login/phone/send-code', { phone }),

  loginPhoneVerify: (phone, code) =>
    apiPost('/v1/auth/login/phone/verify', { phone, code }),

  loginEmail: (email, password) =>
    apiPost('/v1/auth/login', { email, password }),

  forgotSendCode: (phone) =>
    apiPost('/v1/auth/forgot-password/send-code', { phone }),

  forgotVerify: (phone, code) =>
    apiPost('/v1/auth/forgot-password/verify', { phone, code }),

  forgotReset: (phone, reset_token, password, password_confirmation) =>
    apiPost('/v1/auth/forgot-password/reset', {
      phone, reset_token, password, password_confirmation
    }),

  logout: () => apiPost('/v1/auth/logout', {})
};

// ============================================
// Profile API
// ============================================
export const profileApi = {
  get: () => apiGet('/v1/auth/profile'),
  update: (data) => apiPut('/v1/auth/profile', data),
  changePhoneSendCode: (phone) =>
    apiPost('/v1/auth/profile/change-phone/send-code', { phone }),
  changePhoneVerify: (phone, code) =>
    apiPost('/v1/auth/profile/change-phone/verify', { phone, code })
};

// ============================================
// Bookings API
// ============================================
export const bookingsApi = {
  list: () => apiGet('/v1/bookings'),
  get: (id) => apiGet(`/v1/bookings/${id}`),
  create: (data) => apiPost('/v1/bookings', data),
  cancel: (id, reason = null) => {
    const payload = reason ? { cancellation_reason: reason } : {};
    return apiPost(`/v1/bookings/${id}/cancel`, payload);
  },
  reschedule: (id, data) => apiPut(`/v1/bookings/${id}/reschedule`, data)
};

// ============================================
// Services API
// ============================================
export const servicesApi = {
  list: () => apiGet('/v1/services'),
  get: (id) => apiGet(`/v1/services/${id}`)
};

// ============================================
// Staff API
// ============================================
export const staffApi = {
  list: () => apiGet('/v1/staff'),
  get: (id) => apiGet(`/v1/staff/${id}`),
  schedule: (id) => apiGet(`/v1/staff/${id}/schedule`)
};

// ============================================
// Availability API
// ============================================
export const availabilityApi = {
  check: (staffId, serviceId, date) =>
    apiGet(`/v1/availability?staff_id=${staffId}&service_id=${serviceId}&date=${date}`)
};

// ============================================
// Payments API
// ============================================
export const paymentsApi = {
  deposit: (bookingId, data = {}) =>
    apiPost(`/v1/payments/bookings/${bookingId}/deposit`, data),

  start: (bookingId, data = {}) =>
    apiPost(`/v1/payments/bookings/${bookingId}/start`, data)
};

// ============================================
// Messages API (Contact Form)
// ============================================
export const messagesApi = {
  send: (data) => apiPost('/messages', data)
};

// ============================================
// Waiting List API (Newsletter)
// ============================================
export const waitingListApi = {
  subscribe: (email) => apiPost('/waiting-list', { email })
};

// ============================================
// Gallery API
// ============================================
export const galleryApi = {
  list: (categoryId = null) => {
    const endpoint = categoryId
      ? `/v1/gallery?category_id=${categoryId}`
      : '/v1/gallery';
    return apiGet(endpoint);
  },

  categories: () => apiGet('/v1/gallery/categories'),

  get: (id) => apiGet(`/v1/gallery/${id}`)
};
// ============================================
// Blogs API
// ============================================
export const blogsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiGet(`/v1/blogs${query ? '?' + query : ''}`);
  },

  get: (id, lang = null) => {
    const query = lang ? `?lang=${lang}` : '';
    return apiGet(`/v1/blogs/${id}${query}`);
  }
};
