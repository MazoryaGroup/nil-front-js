
/**
 * ============================================================
 * NIL BEAUTY - API CLIENT
 * Laravel REST API | JWT Authentication | Vite
 * Session timeout: 10 minutes
 * ============================================================
 */

const BASE_URL = 'https://apinil.mazoryagroup.ir/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const LOGIN_TIME_KEY = 'auth_login_time';

const SESSION_DURATION = 10 * 60 * 1000;

// ============================================================
// Session Helpers
// ============================================================

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function isSessionExpired() {
  const loginTime = Number(
    localStorage.getItem(LOGIN_TIME_KEY)
  );

  if (!Number.isFinite(loginTime) || loginTime <= 0) {
    return true;
  }

  const elapsed = Date.now() - loginTime;

  return elapsed < 0 || elapsed >= SESSION_DURATION;
}

function clearAuthSession() {
  const hadSession =
    !!localStorage.getItem(TOKEN_KEY) ||
    !!localStorage.getItem(LOGIN_TIME_KEY);

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGIN_TIME_KEY);

  if (hadSession) {
    window.dispatchEvent(
      new CustomEvent('auth:expired')
    );
  }
}

function getAuthToken() {
  const token = getStoredToken();

  if (!token) return null;

  if (isSessionExpired()) {
    clearAuthSession();
    return null;
  }

  return token;
}

// ============================================================
// Query Helpers
// ============================================================

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          query.append(`${key}[]`, String(item));
        }
      });

      return;
    }

    query.append(key, String(value));
  });

  return query.toString();
}

function withQuery(endpoint, params = {}) {
  const query = buildQuery(params);

  if (!query) return endpoint;

  return `${endpoint}${endpoint.includes('?') ? '&' : '?'}${query}`;
}

// ============================================================
// Error Helpers
// ============================================================

function getValidationMessage(json) {
  const errors = json?.errors;

  if (!errors || typeof errors !== 'object') {
    return null;
  }

  const messages = Object.values(errors)
    .flat()
    .filter((message) => typeof message === 'string');

  return messages.length
    ? messages.join('\n')
    : null;
}

function createApiError(response, json) {
  const message =
    getValidationMessage(json) ||
    json?.message ||
    (
      typeof json?.error === 'string'
        ? json.error
        : null
    ) ||
    `HTTP ${response.status}`;

  const error = new Error(message);

  error.name = 'ApiError';
  error.status = response.status;
  error.statusCode =
    json?.statusCode || response.status;
  error.errors = json?.errors || null;
  error.response = json;

  return error;
}

function createSessionError() {
  const error = new Error(
    'Session expired. Please login again.'
  );

  error.name = 'SessionExpiredError';
  error.status = 401;
  error.statusCode = 401;

  return error;
}

// ============================================================
// Public Authentication Endpoints
// ============================================================

function isPublicAuthEndpoint(endpoint) {
  const path = String(endpoint).split('?')[0];

  return [
    '/v1/auth/register/send-code',
    '/v1/auth/register/verify',
    '/v1/auth/login',
    '/v1/auth/login/phone/send-code',
    '/v1/auth/login/phone/verify',
    '/v1/auth/forgot-password/send-code',
    '/v1/auth/forgot-password/verify',
    '/v1/auth/forgot-password/reset'
  ].includes(path);
}

// ============================================================
// Main Request
// ============================================================

async function request(
  method,
  endpoint,
  data = null,
  options = {}
) {
  const url = `${BASE_URL}${endpoint}`;

  const publicAuth = isPublicAuthEndpoint(endpoint);
  const hadToken = !!getStoredToken();

  // Prevent expired sessions from using protected APIs.
  if (
    !publicAuth &&
    hadToken &&
    isSessionExpired()
  ) {
    clearAuthSession();
    throw createSessionError();
  }

  const headers = {
    Accept: 'application/json',
    ...options.headers
  };

  // Public login/OTP requests never need an old JWT.
  const token = publicAuth ? null : getAuthToken();

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: method.toUpperCase(),
    ...options,
    headers
  };

  if (
    data !== null &&
    data !== undefined &&
    !['GET', 'HEAD'].includes(config.method)
  ) {
    if (data instanceof FormData) {
      config.body = data;

      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    } else {
      config.headers['Content-Type'] =
        config.headers['Content-Type'] ||
        'application/json';

      config.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, config);

    const contentType =
      response.headers.get('content-type') || '';

    let json = {};

    if (response.status !== 204) {
      if (contentType.includes('application/json')) {
        json = await response
          .json()
          .catch(() => ({}));
      } else {
        const responseText = await response
          .text()
          .catch(() => '');

        json = responseText
          ? {
              message: response.ok
                ? ''
                : `HTTP ${response.status}`
            }
          : {};
      }
    }

    // Only invalidate the current session if the
    // rejected request used the same stored token.
    if (
      response.status === 401 &&
      token &&
      getStoredToken() === token
    ) {
      clearAuthSession();
    }

    if (!response.ok) {
      throw createApiError(response, json);
    }

    if (
      json &&
      typeof json === 'object' &&
      (
        json.success === false ||
        json.is_status === false
      )
    ) {
      const error = new Error(
        json.message || 'API request failed.'
      );

      error.name = 'ApiError';
      error.status =
        json.statusCode || response.status;
      error.response = json;

      throw error;
    }

    return json;
  } catch (error) {
    console.error(
      `[NIL API] ${method.toUpperCase()} ${endpoint}`,
      {
        message: error.message,
        status: error.status || null,
        errors: error.errors || null
      }
    );

    throw error;
  }
}

// ============================================================
// Base Methods
// ============================================================

export const apiGet = (endpoint, options = {}) =>
  request('GET', endpoint, null, options);

export const apiPost = (
  endpoint,
  data = {},
  options = {}
) =>
  request('POST', endpoint, data, options);

export const apiPut = (
  endpoint,
  data = {},
  options = {}
) =>
  request('PUT', endpoint, data, options);

export const apiPatch = (
  endpoint,
  data = {},
  options = {}
) =>
  request('PATCH', endpoint, data, options);

export const apiDelete = (
  endpoint,
  options = {}
) =>
  request('DELETE', endpoint, null, options);

// ============================================================
// Authentication API
// ============================================================

export const authApi = {
  registerSendCode: (
    name,
    phone,
    referral_code = null
  ) => {
    const payload = {
      name,
      phone
    };

    if (
      typeof referral_code === 'string' &&
      referral_code.trim()
    ) {
      payload.referral_code =
        referral_code.trim();
    }

    return apiPost(
      '/v1/auth/register/send-code',
      payload
    );
  },

  registerVerify: (phone, code) =>
    apiPost('/v1/auth/register/verify', {
      phone,
      code
    }),

  loginPhoneSendCode: (phone) =>
    apiPost(
      '/v1/auth/login/phone/send-code',
      { phone }
    ),

  loginPhoneVerify: (phone, code) =>
    apiPost(
      '/v1/auth/login/phone/verify',
      {
        phone,
        code
      }
    ),

  loginEmail: (email, password) =>
    apiPost('/v1/auth/login', {
      email,
      password
    }),

  forgotSendCode: (phone) =>
    apiPost(
      '/v1/auth/forgot-password/send-code',
      { phone }
    ),

  forgotVerify: (phone, code) =>
    apiPost(
      '/v1/auth/forgot-password/verify',
      {
        phone,
        code
      }
    ),

  forgotReset: (
    phone,
    reset_token,
    password,
    password_confirmation
  ) =>
    apiPost(
      '/v1/auth/forgot-password/reset',
      {
        phone,
        reset_token,
        password,
        password_confirmation
      }
    ),

  logout: () =>
    apiPost('/v1/auth/logout', {})
};

// ============================================================
// Profile API
// ============================================================

export const profileApi = {
  get: () =>
    apiGet('/v1/auth/profile'),

  update: (data) =>
    apiPut(
      '/v1/auth/profile',
      data
    ),

  changePhoneSendCode: (phone) =>
    apiPost(
      '/v1/auth/profile/change-phone/send-code',
      { phone }
    ),

  changePhoneVerify: (phone, code) =>
    apiPost(
      '/v1/auth/profile/change-phone/verify',
      {
        phone,
        code
      }
    )
};

// ============================================================
// Bookings API
// ============================================================

export const bookingsApi = {
  list: (params = {}) =>
    apiGet(
      withQuery('/v1/bookings', params)
    ),

  get: (id) =>
    apiGet(
      `/v1/bookings/${encodeURIComponent(id)}`
    ),

  create: (data) =>
    apiPost(
      '/v1/bookings',
      data
    ),

  cancel: (id, reason = null) => {
    const payload = {};

    if (reason) {
      payload.cancellation_reason = reason;
    }

    return apiPost(
      `/v1/bookings/${encodeURIComponent(id)}/cancel`,
      payload
    );
  },

  reschedule: (id, data) =>
    apiPut(
      `/v1/bookings/${encodeURIComponent(id)}/reschedule`,
      data
    ),

  validateDiscount: (bookingId, code) =>
    apiPost(
      '/v1/discount-codes/validate',
      {
        booking_id: Number(bookingId),
        code: String(code).trim()
      }
    ),

  applyDiscount: (id, data) =>
    apiPost(
      `/v1/bookings/${encodeURIComponent(id)}/apply-discount`,
      data
    )
};

// ============================================================
// Services API
// ============================================================

export const servicesApi = {
  list: (params = {}) =>
    apiGet(
      withQuery('/v1/services', params)
    ),

  get: (id) =>
    apiGet(
      `/v1/services/${encodeURIComponent(id)}`
    )
};

// ============================================================
// Staff API
// ============================================================

export const staffApi = {
  list: (params = {}) =>
    apiGet(
      withQuery('/v1/staff', params)
    ),

  get: (id) =>
    apiGet(
      `/v1/staff/${encodeURIComponent(id)}`
    ),

  schedule: (id) =>
    apiGet(
      `/v1/staff/${encodeURIComponent(id)}/schedule`
    )
};

// ============================================================
// Availability API
// ============================================================

export const availabilityApi = {
  check: (
    staffId = null,
    serviceId,
    date,
    interval = 30
  ) => {
    const params = {
      service_id: serviceId,
      date,
      interval
    };

    if (
      staffId !== null &&
      staffId !== undefined &&
      staffId !== ''
    ) {
      params.staff_id = staffId;
    }

    return apiGet(
      withQuery(
        '/v1/availability',
        params
      )
    );
  },

  checkGeneral: (
    serviceId,
    date,
    interval = 30
  ) =>
    apiGet(
      withQuery(
        '/v1/availability',
        {
          service_id: serviceId,
          date,
          interval
        }
      )
    ),

  checkStaff: (
    staffId,
    serviceId,
    date,
    interval = 30
  ) =>
    apiGet(
      withQuery(
        '/v1/availability',
        {
          staff_id: staffId,
          service_id: serviceId,
          date,
          interval
        }
      )
    )
};

// ============================================================
// Payments API
// ============================================================

export const paymentsApi = {
  deposit: (
    bookingId,
    data = {}
  ) =>
    apiPost(
      `/v1/payments/bookings/${encodeURIComponent(bookingId)}/deposit`,
      data
    ),

  start: (
    bookingId,
    data = {}
  ) =>
    apiPost(
      `/v1/payments/bookings/${encodeURIComponent(bookingId)}/start`,
      data
    )
};

// ============================================================
// Messages API
// ============================================================

export const messagesApi = {
  send: (data) =>
    apiPost(
      '/messages',
      data
    )
};

// ============================================================
// Waiting List API
// ============================================================

export const waitingListApi = {
  subscribe: (email) =>
    apiPost(
      '/waiting-list',
      { email }
    )
};

// ============================================================
// Gallery API
// ============================================================

export const galleryApi = {
  list: (categoryId = null) =>
    apiGet(
      withQuery(
        '/v1/gallery',
        {
          category_id: categoryId
        }
      )
    ),

  categories: () =>
    apiGet(
      '/v1/gallery/categories'
    ),

  get: (id) =>
    apiGet(
      `/v1/gallery/${encodeURIComponent(id)}`
    )
};

// ============================================================
// Blogs API
// ============================================================

export const blogsApi = {
  list: (params = {}) =>
    apiGet(
      withQuery(
        '/v1/blogs',
        params
      )
    ),

  get: (
    id,
    lang = null
  ) =>
    apiGet(
      withQuery(
        `/v1/blogs/${encodeURIComponent(id)}`,
        { lang }
      )
    )
};
