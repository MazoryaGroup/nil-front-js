
/**
 * ============================================================
 * NIL BEAUTY - API CLIENT
 * Laravel REST API | JWT Authentication | Vite
 * ============================================================
 */

const BASE_URL = (
  import.meta.env.VITE_API_URL || '/api'
).replace(/\/+$/, '');

// ============================================================
// Helpers
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

function getAuthToken() {
  return localStorage.getItem('auth_token');
}

function clearAuthSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');

  window.dispatchEvent(new CustomEvent('auth:expired'));
}

function getValidationMessage(json) {
  const errors = json?.errors;

  if (!errors || typeof errors !== 'object') {
    return null;
  }

  const messages = Object.values(errors)
    .flat()
    .filter((message) => typeof message === 'string');

  return messages.length ? messages.join('\n') : null;
}

function createApiError(response, json) {
  const message =
    getValidationMessage(json) ||
    json?.message ||
    (typeof json?.error === 'string' ? json.error : null) ||
    `HTTP ${response.status}`;

  const error = new Error(message);

  error.name = 'ApiError';
  error.status = response.status;
  error.statusCode = json?.statusCode || response.status;
  error.errors = json?.errors || null;
  error.response = json;

  return error;
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

  const headers = {
    Accept: 'application/json',
    ...options.headers
  };

  const token = getAuthToken();

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: method.toUpperCase(),
    headers,
    ...options
  };

  // Keep merged headers if options contain custom headers.
  config.headers = headers;

  if (
    data !== null &&
    data !== undefined &&
    !['GET', 'HEAD'].includes(config.method)
  ) {
    if (data instanceof FormData) {
      config.body = data;

      // Browser sets multipart boundary automatically.
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    } else {
      config.headers['Content-Type'] =
        config.headers['Content-Type'] || 'application/json';

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
        json = await response.json().catch(() => ({}));
      } else {
        const text = await response.text().catch(() => '');

        json = text
          ? { message: response.ok ? '' : `HTTP ${response.status}` }
          : {};
      }
    }

    if (response.status === 401 && token) {
      clearAuthSession();
    }

    if (!response.ok) {
      throw createApiError(response, json);
    }

    // Support APIs that return HTTP 200 with success=false.
    if (
      json &&
      typeof json === 'object' &&
      (json.success === false || json.is_status === false)
    ) {
      const error = new Error(
        json.message || 'API request failed.'
      );

      error.name = 'ApiError';
      error.status = json.statusCode || response.status;
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

export const apiPost = (endpoint, data = {}, options = {}) =>
  request('POST', endpoint, data, options);

export const apiPut = (endpoint, data = {}, options = {}) =>
  request('PUT', endpoint, data, options);

export const apiPatch = (endpoint, data = {}, options = {}) =>
  request('PATCH', endpoint, data, options);

export const apiDelete = (endpoint, options = {}) =>
  request('DELETE', endpoint, null, options);

// ============================================================
// Authentication API
// ============================================================

export const authApi = {
  registerSendCode: (name, phone, referral_code = null) => {
    const payload = {
      name,
      phone
    };

    if (
      typeof referral_code === 'string' &&
      referral_code.trim()
    ) {
      payload.referral_code = referral_code.trim();
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
    apiPost('/v1/auth/login/phone/send-code', {
      phone
    }),

  loginPhoneVerify: (phone, code) =>
    apiPost('/v1/auth/login/phone/verify', {
      phone,
      code
    }),

  loginEmail: (email, password) =>
    apiPost('/v1/auth/login', {
      email,
      password
    }),

  forgotSendCode: (phone) =>
    apiPost('/v1/auth/forgot-password/send-code', {
      phone
    }),

  forgotVerify: (phone, code) =>
    apiPost('/v1/auth/forgot-password/verify', {
      phone,
      code
    }),

  forgotReset: (
    phone,
    reset_token,
    password,
    password_confirmation
  ) =>
    apiPost('/v1/auth/forgot-password/reset', {
      phone,
      reset_token,
      password,
      password_confirmation
    }),

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
    apiPut('/v1/auth/profile', data),

  changePhoneSendCode: (phone) =>
    apiPost(
      '/v1/auth/profile/change-phone/send-code',
      { phone }
    ),

  changePhoneVerify: (phone, code) =>
    apiPost(
      '/v1/auth/profile/change-phone/verify',
      { phone, code }
    )
};

// ============================================================
// Bookings API
// ============================================================

export const bookingsApi = {
  list: (params = {}) =>
    apiGet(withQuery('/v1/bookings', params)),

  get: (id) =>
    apiGet(`/v1/bookings/${encodeURIComponent(id)}`),

  create: (data) =>
    apiPost('/v1/bookings', data),

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
    )
};

// ============================================================
// Services API
// ============================================================

export const servicesApi = {
  list: (params = {}) =>
    apiGet(withQuery('/v1/services', params)),

  get: (id) =>
    apiGet(`/v1/services/${encodeURIComponent(id)}`)
};

// ============================================================
// Staff API
// ============================================================

export const staffApi = {
  list: (params = {}) =>
    apiGet(withQuery('/v1/staff', params)),

  get: (id) =>
    apiGet(`/v1/staff/${encodeURIComponent(id)}`),

  schedule: (id) =>
    apiGet(
      `/v1/staff/${encodeURIComponent(id)}/schedule`
    )
};

// ============================================================
// Availability API
// ============================================================

export const availabilityApi = {
  /**
   * Get available slots.
   *
   * staffId:
   *   null -> automatically search all eligible staff
   *   id   -> search one specific staff member
   *
   * Compatible with AvailabilityController:
   * GET /v1/availability
   *
   * Response:
   * {
   *   success: true,
   *   data: [
   *     {
   *       start_time: "09:00",
   *       end_time: "10:00",
   *       duration: 60,
   *       staff_ids: [1, 2]
   *     }
   *   ]
   * }
   */
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
      withQuery('/v1/availability', params)
    );
  },

  /**
   * Convenience method for booking without
   * choosing a staff member.
   */
  checkGeneral: (serviceId, date, interval = 30) =>
    apiGet(
      withQuery('/v1/availability', {
        service_id: serviceId,
        date,
        interval
      })
    ),

  /**
   * Convenience method for selected staff.
   */
  checkStaff: (
    staffId,
    serviceId,
    date,
    interval = 30
  ) =>
    apiGet(
      withQuery('/v1/availability', {
        staff_id: staffId,
        service_id: serviceId,
        date,
        interval
      })
    )
};

// ============================================================
// Payments API
// ============================================================

export const paymentsApi = {
  deposit: (bookingId, data = {}) =>
    apiPost(
      `/v1/payments/bookings/${encodeURIComponent(bookingId)}/deposit`,
      data
    ),

  start: (bookingId, data = {}) =>
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
    apiPost('/messages', data)
};

// ============================================================
// Waiting List API
// ============================================================

export const waitingListApi = {
  subscribe: (email) =>
    apiPost('/waiting-list', { email })
};

// ============================================================
// Gallery API
// ============================================================

export const galleryApi = {
  list: (categoryId = null) =>
    apiGet(
      withQuery('/v1/gallery', {
        category_id: categoryId
      })
    ),

  categories: () =>
    apiGet('/v1/gallery/categories'),

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
      withQuery('/v1/blogs', params)
    ),

  get: (id, lang = null) =>
    apiGet(
      withQuery(
        `/v1/blogs/${encodeURIComponent(id)}`,
        { lang }
      )
    )
};
