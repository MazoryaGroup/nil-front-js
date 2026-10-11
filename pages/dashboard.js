import '../asset/css/custom.css';

import { Layout, initLayout } from '../components/Layout.js';
import { getCurrentLang } from '../code/i18n.js';
import { getUser, isLoggedIn, logout } from '../code/auth.js';

import {
  servicesApi,
  bookingsApi,
  profileApi,
  availabilityApi
} from '../code/api.js';

// ============================================================
// NIL BEAUTY — CUSTOMER DASHBOARD
// MULTI-SERVICE BOOKING + MULTI-SERVICE RESCHEDULE
// ============================================================

// ============================================================
// HELPERS
// ============================================================

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

const faNumber = (value) =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const priceFormat = (value) =>
  new Intl.NumberFormat('fa-IR').format(Number(value || 0));

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

const persianFormatter = new Intl.DateTimeFormat(
  'en-US-u-ca-persian',
  {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }
);

const tehranFormatter = new Intl.DateTimeFormat(
  'en-GB',
  {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
);

// ============================================================
// DATE HELPERS
// ============================================================

function dateParts(formatter, date) {
  const parts = formatter.formatToParts(date);

  const get = (type) =>
    Number(parts.find((p) => p.type === type)?.value);

  return {
    year: get('year'),
    month: get('month'),
    day: get('day')
  };
}

function toISO({ year, month, day }) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0')
  ].join('-');
}

function todayISO() {
  return toISO(dateParts(tehranFormatter, new Date()));
}

function isoToDate(iso) {
  return new Date(`${String(iso).slice(0, 10)}T12:00:00Z`);
}

function addDays(iso, days) {
  const date = isoToDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getJalali(iso) {
  return dateParts(persianFormatter, isoToDate(iso));
}

function formatJalali(iso) {
  if (!iso) return '—';

  try {
    const { year, month, day } = getJalali(iso);

    return (
      `${faNumber(day)} ` +
      `${persianMonths[month - 1]} ` +
      `${faNumber(year)}`
    );
  } catch {
    return String(iso);
  }
}

function getMonthData(offset = 0) {
  const current = getJalali(todayISO());

  const absoluteMonth =
    current.year * 12 + current.month - 1 + offset;

  const year = Math.floor(absoluteMonth / 12);
  const month = ((absoluteMonth % 12) + 12) % 12 + 1;

  let cursor = `${year + 621}-03-15`;
  let firstDay = null;

  for (let i = 0; i < 380; i++) {
    const parts = getJalali(cursor);

    if (
      parts.year === year &&
      parts.month === month &&
      parts.day === 1
    ) {
      firstDay = cursor;
      break;
    }

    cursor = addDays(cursor, 1);
  }

  if (!firstDay) {
    throw new Error('Unable to calculate Persian calendar');
  }

  const days = [];
  cursor = firstDay;

  while (days.length < 31) {
    const parts = getJalali(cursor);

    if (
      parts.year !== year ||
      parts.month !== month
    ) {
      break;
    }

    days.push({
      iso: cursor,
      day: parts.day,
      weekday: isoToDate(cursor).getUTCDay()
    });

    cursor = addDays(cursor, 1);
  }

  return { year, month, days };
}

// ============================================================
// TIME HELPERS
// ============================================================

function clockToMinutes(time) {
  const match = String(time || '').match(
    /^(\d{1,2}):(\d{2})/
  );

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function minutesToClock(minutes) {
  if (
    !Number.isFinite(minutes) ||
    minutes < 0 ||
    minutes >= 1440
  ) {
    return null;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(mins).padStart(2, '0')
  );
}

// ============================================================
// API HELPERS
// ============================================================

function extractList(response, key) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;

  if (Array.isArray(response?.data?.[key])) {
    return response.data[key];
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.[key])) {
    return response[key];
  }

  return [];
}

function extractBookingId(response) {
  return (
    response?.data?.booking?.id ??
    response?.data?.id ??
    response?.booking?.id ??
    response?.booking_id ??
    null
  );
}

function normalizeSlots(response) {
  return extractList(response, 'slots')
    .filter((slot) =>
      slot &&
      slot.start_time &&
      slot.end_time &&
      Array.isArray(slot.staff_ids)
    )
    .map((slot) => ({
      ...slot,

      start_time: String(slot.start_time).slice(0, 5),
      end_time: String(slot.end_time).slice(0, 5),

      staff_ids: [...new Set(
        slot.staff_ids
          .map(Number)
          .filter((id) =>
            Number.isInteger(id) && id > 0
          )
      )]
    }))
    .filter((slot) => slot.staff_ids.length > 0)
    .sort((a, b) =>
      a.start_time.localeCompare(b.start_time) ||
      a.end_time.localeCompare(b.end_time)
    );
}

function getBookingItems(booking) {
  const items =
    booking?.booking_services ||
    booking?.services ||
    [];

  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) =>
    String(a.start_time || '').localeCompare(
      String(b.start_time || '')
    )
  );
}

// ============================================================
// BOOKING RULES
// ============================================================

function canModifyBooking(booking) {
  const allowedStatuses = [
    'confirmed',
    'pending',
    'awaiting_payment'
  ];

  if (!allowedStatuses.includes(booking.status)) {
    return false;
  }

  const date = String(
    booking.booking_date || ''
  ).slice(0, 10);

  const time = String(
    booking.start_time || ''
  ).slice(0, 5);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}$/.test(time)
  ) {
    return false;
  }

  const appointment = new Date(
    `${date}T${time}:00+03:30`
  );

  return (
    Number.isFinite(appointment.getTime()) &&
    appointment.getTime() - Date.now() >=
      24 * 60 * 60 * 1000
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

export async function DashboardPage() {
  if (!isLoggedIn()) {
    queueMicrotask(() => {
      window.__app?.router?.navigate('/login');
    });

    return Layout(`
      <div class="nil-loading">
        در حال انتقال به ورود...
      </div>
    `);
  }

  const user = getUser();
  const isFa = getCurrentLang() === 'fa';
  const t = (fa, en) => isFa ? fa : en;

  const html = Layout(`
    <main
      class="nil-dashboard"
      data-nil-dashboard
      dir="${isFa ? 'rtl' : 'ltr'}"
    >
      <div class="nil-shell">

        <!-- HEADER -->
        <header class="nil-topbar">
          <div class="nil-brand">
            <div>
              <strong>NIL BEAUTY</strong>
              <small>
                ${t('پنل مشتریان', 'Customer dashboard')}
              </small>
            </div>
          </div>

          <button
            type="button"
            class="nil-icon-btn"
            data-nil-logout
            title="${t('خروج', 'Logout')}"
          >
            ↪
          </button>
        </header>

        <!-- WELCOME -->
        <section class="nil-welcome">
          <div>
            <span class="nil-eyebrow">
              YOUR BEAUTY, YOUR TIME
            </span>

            <h1>
              ${t('سلام', 'Hello')}،
              ${escapeHtml(
                user?.name || t('عزیز', 'there')
              )}
              <span>✦</span>
            </h1>

            <p>
              ${t(
                'زیبایی از زمانی شروع می‌شود که برای خودت می‌گذاری.',
                'Beauty begins with time for yourself.'
              )}
            </p>
          </div>

          <div class="nil-welcome-mark">✳</div>
        </section>

        <!-- TABS -->
        <nav class="nil-tabs">
          <button
            type="button"
            class="active"
            data-nil-tab="services"
          >
            <span>✦</span>
            ${t('رزرو خدمات', 'Book services')}
          </button>

          <button
            type="button"
            data-nil-tab="bookings"
          >
            <span>◷</span>
            ${t('نوبت‌های من', 'Appointments')}
          </button>

          <button
            type="button"
            data-nil-tab="profile"
          >
            <span>♙</span>
            ${t('پروفایل', 'Profile')}
          </button>
        </nav>

        <!-- SERVICES -->
        <section
          class="nil-panel"
          data-nil-panel="services"
        >
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">
                EXPLORE SERVICES
              </span>

              <h2>
                ${t('خدمات زیبایی', 'Beauty services')}
              </h2>

              <p>
                ${t(
                  'می‌توانی یک یا چند خدمت انتخاب کنی',
                  'Select one or more services'
                )}
              </p>
            </div>
          </div>

          <div
            class="nil-service-grid"
            data-nil-services
          >
            <div class="nil-loading">
              ${t(
                'در حال دریافت خدمات...',
                'Loading services...'
              )}
            </div>
          </div>
        </section>

        <!-- MY BOOKINGS -->
        <section
          class="nil-panel"
          data-nil-panel="bookings"
          hidden
        >
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">
                MY APPOINTMENTS
              </span>

              <h2>
                ${t('نوبت‌های من', 'My appointments')}
              </h2>
            </div>

            <button
              type="button"
              class="nil-text-btn"
              data-nil-refresh
            >
              ${t('بروزرسانی ↻', 'Refresh ↻')}
            </button>
          </div>

          <div
            class="nil-bookings"
            data-nil-bookings
          ></div>
        </section>

        <!-- PROFILE -->
        <section
          class="nil-panel"
          data-nil-panel="profile"
          hidden
        >
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">
                MY ACCOUNT
              </span>

              <h2>
                ${t('حساب کاربری', 'My account')}
              </h2>
            </div>
          </div>

          <div data-nil-profile></div>
        </section>
      </div>

      <!-- SELECTED SERVICES -->
      <div
        class="nil-selection"
        data-nil-selection
        hidden
      >
        <div class="nil-selection-inner">
          <div>
            <small data-nil-selection-count></small>
            <strong data-nil-selection-total></strong>
          </div>

          <button
            type="button"
            class="nil-btn nil-btn-dark"
            data-nil-continue
          >
            ${t('ادامه رزرو', 'Continue')} ←
          </button>
        </div>
      </div>

      <!-- BOOKING MODAL -->
      <div
        class="nil-modal"
        data-nil-modal
        hidden
      >
        <div
          class="nil-modal-shade"
          data-nil-close
        ></div>

        <section
          class="nil-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="${t('رزرو نوبت', 'Book appointment')}"
        >
          <div class="nil-dialog-header">
            <div>
              <span class="nil-eyebrow">
                BOOK YOUR APPOINTMENT
              </span>

              <h2>
                ${t('رزرو نوبت', 'Book appointment')}
              </h2>
            </div>

            <button
              type="button"
              class="nil-icon-btn"
              data-nil-close
            >
              ✕
            </button>
          </div>

          <div class="nil-progress">
            <span
              data-nil-progress="1"
              class="active"
            ></span>

            <span data-nil-progress="2"></span>
            <span data-nil-progress="3"></span>
          </div>

          <div class="nil-dialog-body">

            <!-- STEP 1 -->
            <div data-nil-step="1">
              <h3>
                ${t(
                  'چه روزی برات مناسبه؟',
                  'Choose a date'
                )}
              </h3>

              <p class="nil-muted">
                ${t(
                  'از تقویم شمسی تاریخ دلخواهت رو انتخاب کن',
                  'Select your preferred date'
                )}
              </p>

              <div data-nil-calendar></div>
            </div>

            <!-- STEP 2 -->
            <div data-nil-step="2" hidden>
              <h3>
                ${t(
                  'انتخاب ساعت خدمات',
                  'Choose service times'
                )}
              </h3>

              <p
                class="nil-muted"
                data-nil-date-label
              ></p>

              <div
                class="nil-time-grid"
                data-nil-times
              ></div>
            </div>

            <!-- STEP 3 -->
            <div data-nil-step="3" hidden>
              <h3>
                ${t(
                  'تأیید اطلاعات',
                  'Confirm booking'
                )}
              </h3>

              <div data-nil-summary></div>

              <div data-nil-discount-wrapper>
                <label
                  class="nil-field-label"
                  for="nil-booking-discount-code"
                >
                  ${t(
                    'کد تخفیف (اختیاری)',
                    'Discount code (optional)'
                  )}
                </label>

                <input
                  id="nil-booking-discount-code"
                  class="nil-input"
                  data-nil-booking-discount-code
                  type="text"
                  maxlength="100"
                  autocomplete="off"
                  placeholder="${t(
                    'کد تخفیف را وارد کنید',
                    'Enter discount code'
                  )}"
                />

                <p class="nil-muted">
                  ${t(
                    'اعتبار کد و مبلغ نهایی هنگام ثبت رزرو توسط سرور بررسی می‌شود.',
                    'The server validates the discount when creating your booking.'
                  )}
                </p>
              </div>

              <label
                class="nil-field-label"
                for="nil-notes"
              >
                ${t(
                  'توضیحات (اختیاری)',
                  'Notes (optional)'
                )}
              </label>

              <textarea
                id="nil-notes"
                class="nil-input"
                data-nil-notes
                rows="3"
                placeholder="${t(
                  'توضیحات شما...',
                  'Your notes...'
                )}"
              ></textarea>
            </div>

            <p
              class="nil-feedback"
              data-nil-message
              hidden
            ></p>
          </div>

          <div class="nil-dialog-footer">
            <button
              type="button"
              class="nil-btn nil-btn-light"
              data-nil-back
              hidden
            >
              ${t('بازگشت', 'Back')}
            </button>

            <button
              type="button"
              class="nil-btn nil-btn-dark"
              data-nil-next
              disabled
            >
              ${t('ادامه', 'Continue')}
            </button>
          </div>
        </section>
      </div>
    </main>
  `);

  setTimeout(() => {
    const root = document.querySelector(
      '[data-nil-dashboard]'
    );

    if (!root) return;

    initLayout();
    initDashboard(root, isFa);
  }, 100);

  return html;
}

// ============================================================
// DASHBOARD LOGIC
// ============================================================

function initDashboard(root, isFa) {
  if (root.dataset.initialized === '1') return;

  root.dataset.initialized = '1';

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const t = (fa, en) => isFa ? fa : en;

  // ============================================================
  // STATE
  // ============================================================

  let services = [];
  let selectedServices = [];
  let previousSelectedServices = null;

  let selectedDate = null;
  let selectedSlot = null;
  let selectedSlots = [];

  let currentServiceIndex = 0;
  let monthOffset = 0;
  let currentStep = 1;

  let loadingAvailability = false;
  let submitting = false;
  let availabilityRequestId = 0;

  // Reschedule state
  let rescheduleBooking = null;
  let rescheduleItems = [];
  let rescheduleStaffId = null;

  const modal = $('[data-nil-modal]');
  const nextButton = $('[data-nil-next]');
  const backButton = $('[data-nil-back]');

  // ============================================================
  // GENERAL
  // ============================================================

  function showMessage(message = '', error = true) {
    const element = $('[data-nil-message]');

    element.textContent = message;
    element.hidden = !message;
    element.classList.toggle('error', error);
  }

  function resetRescheduleState() {
    rescheduleBooking = null;
    rescheduleItems = [];
    rescheduleStaffId = null;
    previousSelectedServices = null;
  }

  function resetTimeSelection() {
    selectedSlot = null;
    selectedSlots = [];
    currentServiceIndex = 0;
  }

  function updateNextButton() {
    let disabled = submitting;

    if (currentStep === 1) {
      disabled ||= !selectedDate;
    }

    if (currentStep === 2) {
      disabled ||= (
        loadingAvailability ||
        !selectedSlot?.staff_id ||
        !selectedSlot?.start_time
      );
    }

    if (currentStep === 3) {
      disabled ||= (
        !selectedDate ||
        selectedSlots.length !== selectedServices.length ||
        selectedServices.some((service, index) => {
          const slot = selectedSlots[index];

          return (
            String(slot?.service_id) !== String(service.id) ||
            !slot?.staff_id ||
            !slot?.start_time
          );
        })
      );
    }

    nextButton.disabled = disabled;
  }

  function setStep(step) {
    currentStep = step;
    showMessage();

    $$('[data-nil-step]').forEach((element) => {
      element.hidden =
        Number(element.dataset.nilStep) !== step;
    });

    $$('[data-nil-progress]').forEach((element) => {
      element.classList.toggle(
        'active',
        Number(element.dataset.nilProgress) <= step
      );
    });

    backButton.hidden = step === 1;

    nextButton.textContent = step === 3
      ? (
          rescheduleBooking
            ? t('تأیید جابجایی', 'Confirm reschedule')
            : t('ثبت نوبت', 'Book now')
        )
      : t('ادامه', 'Continue');

    updateNextButton();
  }

  function switchTab(tab) {
    $$('[data-nil-tab]').forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.nilTab === tab
      );
    });

    $$('[data-nil-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.nilPanel !== tab;
    });

    if (tab === 'bookings') loadBookings();
    if (tab === 'profile') loadProfile();
  }

  $$('[data-nil-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      switchTab(button.dataset.nilTab);
    });
  });

  $('[data-nil-refresh]').addEventListener(
    'click',
    loadBookings
  );

  $('[data-nil-logout]').addEventListener(
    'click',
    async () => {
      if (!confirm(t('خارج می‌شوی؟', 'Log out?'))) {
        return;
      }

      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }

      window.__app?.router?.navigate('/login');
    }
  );

  // ============================================================
  // SERVICES
  // ============================================================

  async function loadServices() {
    const container = $('[data-nil-services]');

    try {
      const response = await servicesApi.list();

      services = extractList(response, 'services').filter(
        (service) =>
          ![false, 0, '0'].includes(service.is_active)
      );

      renderServices();
    } catch (error) {
      container.innerHTML = `
        <div class="nil-empty">
          ${escapeHtml(error.message)}
        </div>
      `;
    }
  }

  function renderServices() {
    const container = $('[data-nil-services]');

    if (!services.length) {
      container.innerHTML = `
        <div class="nil-empty">
          ${t(
            'خدمتی موجود نیست',
            'No services available'
          )}
        </div>
      `;
      return;
    }

    container.innerHTML = services.map((service, index) => {
      const active = selectedServices.some(
        (item) =>
          String(item.id) === String(service.id)
      );

      return `
        <button
          type="button"
          class="nil-service ${active ? 'selected' : ''}"
          data-service-id="${escapeHtml(service.id)}"
          aria-pressed="${active}"
        >
          <div class="nil-service-top">
            <span class="nil-service-number">
              ${String(index + 1).padStart(2, '0')}
            </span>

            <span class="nil-service-check">
              ${active ? '✓' : '+'}
            </span>
          </div>

          <div class="nil-service-symbol">✧</div>

          <div class="nil-service-info">
            <h3>
              ${escapeHtml(service.name)}
            </h3>

            <p>
              ${escapeHtml(
                service.description ||
                t(
                  'خدمات زیبایی نیل',
                  'NIL beauty service'
                )
              )}
            </p>

            <div class="nil-service-meta">
              <span>
                ◷ ${faNumber(service.duration || 0)}
                ${t('دقیقه', 'min')}
              </span>

              <strong>
                ${priceFormat(service.price)}
                ${t('تومان', 'Toman')}
              </strong>
            </div>
          </div>
        </button>
      `;
    }).join('');

    container.querySelectorAll('[data-service-id]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const service = services.find(
            (item) =>
              String(item.id) === button.dataset.serviceId
          );

          if (!service) return;

          const exists = selectedServices.some(
            (item) =>
              String(item.id) === String(service.id)
          );

          if (exists) {
            selectedServices = selectedServices.filter(
              (item) =>
                String(item.id) !== String(service.id)
            );
          } else {
            selectedServices.push(service);
          }

          renderServices();
          updateSelectionBar();
        });
      });
  }

  function updateSelectionBar() {
    const count = selectedServices.length;

    $('[data-nil-selection]').hidden = count === 0;

    $('[data-nil-selection-count]').textContent = t(
      `${faNumber(count)} خدمت انتخاب شده`,
      `${count} selected services`
    );

    const total = selectedServices.reduce(
      (sum, service) =>
        sum + Number(service.price || 0),
      0
    );

    $('[data-nil-selection-total]').textContent =
      `${priceFormat(total)} ${t('تومان', 'Toman')}`;
  }

  $('[data-nil-continue]').addEventListener(
    'click',
    openModal
  );

  // ============================================================
  // OPEN BOOKING MODAL
  // ============================================================

  function openModal() {
    if (!selectedServices.length) return;

    resetRescheduleState();
    resetTimeSelection();

    selectedDate = null;
    monthOffset = 0;

    availabilityRequestId++;
    loadingAvailability = false;

    $('[data-nil-notes]').value = '';
    $('[data-nil-booking-discount-code]').value = '';
    $('[data-nil-discount-wrapper]').hidden = false;

    const heading = modal.querySelector(
      '.nil-dialog-header h2'
    );

    if (heading) {
      heading.textContent = t(
        'رزرو نوبت',
        'Book appointment'
      );
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    setStep(1);
    renderCalendar();
  }

  // ============================================================
  // OPEN RESCHEDULE MODAL — MULTI SERVICE
  // ============================================================

  function openRescheduleModal(booking) {
    if (!canModifyBooking(booking)) {
      alert(t(
        'جابجایی نوبت فقط تا ۲۴ ساعت قبل امکان‌پذیر است.',
        'Rescheduling requires at least 24 hours notice.'
      ));
      return;
    }

    const items = getBookingItems(booking);

    if (!items.length) {
      alert(t(
        'اطلاعات خدمات این رزرو موجود نیست.',
        'Booking services are unavailable.'
      ));
      return;
    }

    // The first service determines the new start time.
    const firstItem = items[0];

    const firstServiceId =
      firstItem.service_id ??
      firstItem.service?.id;

    const firstStaffId =
      firstItem.staff_id ??
      firstItem.staff?.id;

    const firstService = services.find(
      (item) =>
        String(item.id) === String(firstServiceId)
    );

    if (!firstService || !firstStaffId) {
      alert(t(
        'اطلاعات خدمت یا پرسنل این رزرو کامل نیست.',
        'Booking service or staff information is incomplete.'
      ));
      return;
    }

    // Every service must have valid timing information.
    const validItems = items.every((item) => {
      return (
        clockToMinutes(item.start_time) !== null &&
        clockToMinutes(item.end_time) !== null &&
        (
          item.service_id ??
          item.service?.id
        ) != null &&
        (
          item.staff_id ??
          item.staff?.id
        ) != null
      );
    });

    if (!validItems) {
      alert(t(
        'اطلاعات زمان‌بندی بعضی خدمات کامل نیست.',
        'Some service scheduling details are missing.'
      ));
      return;
    }

    previousSelectedServices = [...selectedServices];

    rescheduleBooking = booking;
    rescheduleItems = items;
    rescheduleStaffId = Number(firstStaffId);

    // Only one service is selected for the time picker.
    // All original services remain in rescheduleItems.
    selectedServices = [firstService];

    selectedDate = null;
    resetTimeSelection();

    monthOffset = 0;

    availabilityRequestId++;
    loadingAvailability = false;

    $('[data-nil-notes]').value = booking.notes || '';
    $('[data-nil-booking-discount-code]').value = '';
    $('[data-nil-discount-wrapper]').hidden = true;

    const heading = modal.querySelector(
      '.nil-dialog-header h2'
    );

    if (heading) {
      heading.textContent = t(
        items.length > 1
          ? 'جابجایی رزرو چندخدمتی'
          : 'جابجایی نوبت',

        items.length > 1
          ? 'Reschedule multiple services'
          : 'Reschedule appointment'
      );
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    setStep(1);
    renderCalendar();
  }

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  function closeModal() {
    if (submitting) return;

    availabilityRequestId++;
    loadingAvailability = false;

    if (rescheduleBooking) {
      selectedServices = previousSelectedServices || [];

      renderServices();
      updateSelectionBar();
    }

    resetRescheduleState();
    resetTimeSelection();

    selectedDate = null;

    modal.hidden = true;
    document.body.style.overflow = '';

    const heading = modal.querySelector(
      '.nil-dialog-header h2'
    );

    if (heading) {
      heading.textContent = t(
        'رزرو نوبت',
        'Book appointment'
      );
    }

    setStep(1);
  }

  $$('[data-nil-close]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  // ============================================================
  // PERSIAN CALENDAR
  // ============================================================

  function renderCalendar() {
    const container = $('[data-nil-calendar]');

    let month;

    try {
      month = getMonthData(monthOffset);
    } catch (error) {
      container.textContent = error.message;
      return;
    }

    const today = todayISO();

    const weekdays = isFa
      ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
      : ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];

    const emptyDays =
      (month.days[0].weekday + 1) % 7;

    container.innerHTML = `
      <div class="nil-calendar">

        <div class="nil-calendar-head">
          <button
            type="button"
            data-month-prev
            ${monthOffset === 0 ? 'disabled' : ''}
          >
            →
          </button>

          <div>
            <strong>
              ${persianMonths[month.month - 1]}
              ${faNumber(month.year)}
            </strong>

            <small>
              ${t(
                'انتخاب تاریخ نوبت',
                'Select a date'
              )}
            </small>
          </div>

          <button
            type="button"
            data-month-next
          >
            ←
          </button>
        </div>

        <div class="nil-weekdays">
          ${weekdays.map((day) => `
            <span>${day}</span>
          `).join('')}
        </div>

        <div class="nil-calendar-grid">
          ${Array(emptyDays)
            .fill('<span></span>')
            .join('')}

          ${month.days.map((day) => {
            const isPast = day.iso < today;
            const isToday = day.iso === today;
            const isSelected = day.iso === selectedDate;

            return `
              <button
                type="button"
                data-calendar-date="${day.iso}"
                class="
                  ${isToday ? 'today' : ''}
                  ${isSelected ? 'active' : ''}
                "
                ${isPast ? 'disabled' : ''}
              >
                ${faNumber(day.day)}
                ${isToday ? '<i></i>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <div class="nil-calendar-note">
          <span class="nil-calendar-dot"></span>
          ${t(
            'تاریخ امروز مشخص شده است',
            'Today is marked'
          )}
        </div>

      </div>
    `;

    container.querySelector('[data-month-prev]')
      ?.addEventListener('click', () => {
        if (monthOffset <= 0) return;

        monthOffset--;
        renderCalendar();
      });

    container.querySelector('[data-month-next]')
      ?.addEventListener('click', () => {
        monthOffset++;
        renderCalendar();
      });

    container.querySelectorAll(
      '[data-calendar-date]:not(:disabled)'
    ).forEach((button) => {
      button.addEventListener('click', () => {
        selectedDate = button.dataset.calendarDate;

        resetTimeSelection();

        renderCalendar();
        updateNextButton();
      });
    });
  }

  // ============================================================
  // AVAILABLE TIMES
  // SUPPORTS BOOKING + RESCHEDULING
  // ============================================================

  async function loadAvailableTimes() {
    const container = $('[data-nil-times]');
    const requestId = ++availabilityRequestId;

    const service = selectedServices[currentServiceIndex];

    selectedSlot =
      selectedSlots[currentServiceIndex] || null;

    loadingAvailability = true;
    updateNextButton();

    if (!selectedDate || !service) {
      loadingAvailability = false;

      container.innerHTML = `
        <div class="nil-empty">
          ${t(
            'اطلاعات انتخاب خدمت کامل نیست.',
            'Service selection is incomplete.'
          )}
        </div>
      `;

      updateNextButton();
      return;
    }

    const isRescheduling = !!rescheduleBooking;

    const progress = isRescheduling
      ? t(
          'ساعت شروع جدید رزرو',
          'New booking start time'
        )
      : (
          selectedServices.length > 1
            ? t(
                `خدمت ${faNumber(currentServiceIndex + 1)} از ${faNumber(selectedServices.length)}`,
                `Service ${currentServiceIndex + 1} of ${selectedServices.length}`
              )
            : t('انتخاب ساعت', 'Choose a time')
        );

    $('[data-nil-date-label]').textContent =
      `${formatJalali(selectedDate)} — ${progress}: ${service.name}`;

    const previous =
      selectedSlots[currentServiceIndex - 1];

    const earliestStart = isRescheduling
      ? null
      : previous?.end_time || null;

    const selectedSoFar = isRescheduling
      ? ''
      : selectedSlots
          .slice(0, currentServiceIndex)
          .map((slot, index) => `
            <div
              class="nil-summary-row"
              style="margin-bottom:6px"
            >
              <span>
                ${escapeHtml(
                  selectedServices[index]?.name || ''
                )}
              </span>

              <strong>
                ${escapeHtml(slot.start_time)}
                -
                ${escapeHtml(slot.end_time)}
              </strong>
            </div>
          `).join('');

    const priorHtml = selectedSoFar
      ? `
        <div
          class="nil-summary"
          style="grid-column:1/-1;margin-bottom:16px"
        >
          ${selectedSoFar}
        </div>
      `
      : '';

    container.innerHTML = `
      ${priorHtml}

      <div
        class="nil-loading"
        style="grid-column:1/-1"
      >
        ${t(
          'در حال بررسی ساعت‌های آزاد...',
          'Checking available times...'
        )}
      </div>
    `;

    try {
      const response = await availabilityApi.check(
        null,
        service.id,
        selectedDate,
        30
      );

      if (requestId !== availabilityRequestId) return;

      const slots = normalizeSlots(response).filter((slot) => {
        const afterPrevious =
          !earliestStart ||
          slot.start_time >= earliestStart;

        // Keep the original staff for rescheduling.
        const sameStaff =
          !isRescheduling ||
          slot.staff_ids.includes(rescheduleStaffId);

        return afterPrevious && sameStaff;
      });

      if (
        selectedSlot &&
        !slots.some((slot) =>
          slot.start_time === selectedSlot.start_time &&
          slot.end_time === selectedSlot.end_time &&
          slot.staff_ids.includes(
            Number(selectedSlot.staff_id)
          )
        )
      ) {
        selectedSlot = null;

        selectedSlots = selectedSlots.slice(
          0,
          currentServiceIndex
        );

        updateNextButton();
      }

      if (!slots.length) {
        container.innerHTML = `
          ${priorHtml}

          <div
            class="nil-empty"
            style="grid-column:1/-1"
          >
            ${isRescheduling
              ? t(
                  'برای پرسنل فعلی در این تاریخ ساعت آزادی پیدا نشد. تاریخ دیگری انتخاب کن.',
                  'No available times for the assigned staff on this date.'
                )
              : earliestStart
                ? t(
                    `برای ${escapeHtml(service.name)} بعد از ساعت ${escapeHtml(earliestStart)} زمان آزادی پیدا نشد.`,
                    `No available time for ${escapeHtml(service.name)} after ${escapeHtml(earliestStart)}.`
                  )
                : t(
                    'برای این روز ساعت آزادی پیدا نشد.',
                    'No available times for this date.'
                  )
            }
          </div>
        `;

        return;
      }

      container.innerHTML = `
        ${priorHtml}

        <p
          class="nil-muted"
          style="grid-column:1/-1;margin-bottom:12px"
        >
          ${isRescheduling
            ? t(
                'انتخاب ساعت شروع جدید تمام خدمات:',
                'Choose the new start time for all services:'
              )
            : t('ساعت خدمت:', 'Time for:')
          }

          <strong>
            ${escapeHtml(service.name)}
          </strong>
        </p>

        ${slots.map((slot, index) => {
          const active =
            selectedSlot?.start_time === slot.start_time &&
            selectedSlot?.end_time === slot.end_time;

          return `
            <button
              type="button"
              class="nil-time ${active ? 'active' : ''}"
              data-slot-index="${index}"
              aria-pressed="${active}"
            >
              <span>
                ◷ ${escapeHtml(slot.start_time)}
              </span>

              <small
                style="
                  display:block;
                  margin-top:6px;
                  opacity:.65;
                  font-size:11px;
                "
              >
                ${t('تا', 'to')}
                ${escapeHtml(slot.end_time)}
              </small>
            </button>
          `;
        }).join('')}
      `;

      container.querySelectorAll('[data-slot-index]')
        .forEach((button) => {
          button.addEventListener('click', () => {
            const slot = slots[
              Number(button.dataset.slotIndex)
            ];

            if (!slot?.staff_ids?.length) return;

            selectedSlot = {
              service_id: service.id,
              start_time: slot.start_time,
              end_time: slot.end_time,
              duration: slot.duration,
              staff_ids: slot.staff_ids,

              staff_id: isRescheduling
                ? rescheduleStaffId
                : slot.staff_ids[0]
            };

            selectedSlots = selectedSlots.slice(
              0,
              currentServiceIndex
            );

            selectedSlots[currentServiceIndex] =
              selectedSlot;

            container.querySelectorAll('[data-slot-index]')
              .forEach((element) => {
                const active = element === button;

                element.classList.toggle(
                  'active',
                  active
                );

                element.setAttribute(
                  'aria-pressed',
                  String(active)
                );
              });

            updateNextButton();
          });
        });

    } catch (error) {
      if (requestId !== availabilityRequestId) return;

      console.error('Availability error:', error);

      container.innerHTML = `
        ${priorHtml}

        <div
          class="nil-empty"
          style="grid-column:1/-1"
        >
          ${escapeHtml(
            error.message ||
            t(
              'خطا در دریافت ساعت‌ها',
              'Failed to load times'
            )
          )}
        </div>
      `;
    } finally {
      if (requestId === availabilityRequestId) {
        loadingAvailability = false;
        updateNextButton();
      }
    }
  }

  // ============================================================
  // RESCHEDULE PREVIEW
  // ============================================================

  function buildReschedulePreview() {
    if (
      !rescheduleBooking ||
      !rescheduleItems.length ||
      !selectedSlot?.start_time
    ) {
      return null;
    }

    const originalStart = clockToMinutes(
      rescheduleItems[0].start_time
    );

    const newStart = clockToMinutes(
      selectedSlot.start_time
    );

    if (
      originalStart === null ||
      newStart === null
    ) {
      return null;
    }

    const difference = newStart - originalStart;

    const rows = [];

    for (const item of rescheduleItems) {
      const oldStart = clockToMinutes(
        item.start_time
      );

      const oldEnd = clockToMinutes(
        item.end_time
      );

      if (
        oldStart === null ||
        oldEnd === null ||
        oldEnd <= oldStart
      ) {
        return null;
      }

      const newServiceStart = minutesToClock(
        oldStart + difference
      );

      const newServiceEnd = minutesToClock(
        oldEnd + difference
      );

      if (!newServiceStart || !newServiceEnd) {
        return null;
      }

      rows.push({
        service_id:
          item.service_id ??
          item.service?.id,

        staff_id:
          item.staff_id ??
          item.staff?.id,

        name:
          item.service?.name ||
          item.service_name ||
          item.name ||
          t('خدمت', 'Service'),

        oldStart: String(item.start_time).slice(0, 5),
        oldEnd: String(item.end_time).slice(0, 5),

        newStart: newServiceStart,
        newEnd: newServiceEnd
      });
    }

    return rows;
  }

  // ============================================================
  // BOOKING SUMMARY
  // ============================================================

  function renderSummary() {
    // ========================================================
    // RESCHEDULE SUMMARY
    // ========================================================

    if (rescheduleBooking) {
      const rows = buildReschedulePreview();

      if (!rows) {
        $('[data-nil-summary]').innerHTML = '';

        showMessage(t(
          'زمان انتخاب‌شده معتبر نیست یا باعث می‌شود یکی از خدمات از محدوده همان روز خارج شود.',
          'The selected time is invalid or a service would extend beyond the day.'
        ));

        return false;
      }

      $('[data-nil-summary]').innerHTML = `
        <div class="nil-summary">

          <div class="nil-summary-row">
            <span>
              ${t('شماره رزرو', 'Booking number')}
            </span>

            <strong>
              #${escapeHtml(rescheduleBooking.id)}
            </strong>
          </div>

          <div class="nil-summary-row">
            <span>
              ${t('تاریخ قبلی', 'Previous date')}
            </span>

            <strong>
              ${formatJalali(
                rescheduleBooking.booking_date
              )}
            </strong>
          </div>

          <div class="nil-summary-row">
            <span>
              ${t('تاریخ جدید', 'New date')}
            </span>

            <strong>
              ${formatJalali(selectedDate)}
            </strong>
          </div>

          <div
            style="
              margin:16px 0 8px;
              font-weight:600;
            "
          >
            ${t(
              'زمان‌بندی جدید خدمات',
              'New service schedule'
            )}
          </div>

          ${rows.map((row, index) => `
            <div class="nil-summary-row">
              <span>
                <strong>
                  ${faNumber(index + 1)}.
                  ${escapeHtml(row.name)}
                </strong>

                <small
                  style="
                    display:block;
                    margin-top:5px;
                    opacity:.65;
                  "
                >
                  ${t('قبلی', 'Previous')}:
                  ${escapeHtml(row.oldStart)}
                  -
                  ${escapeHtml(row.oldEnd)}
                </small>
              </span>

              <strong>
                ${escapeHtml(row.newStart)}
                -
                ${escapeHtml(row.newEnd)}
              </strong>
            </div>
          `).join('')}

          <p
            class="nil-muted"
            style="margin-top:16px"
          >
            ${t(
              'ترتیب، مدت و پرسنل خدمات باید حفظ شود. ظرفیت تمام خدمات هنگام ثبت نهایی توسط سرور بررسی می‌شود.',
              'Service order, duration and staff must be preserved. The server validates availability for every service.'
            )}
          </p>

        </div>
      `;

      return true;
    }

    // ========================================================
    // NEW BOOKING SUMMARY
    // ========================================================

    const total = selectedServices.reduce(
      (sum, service) =>
        sum + Number(service.price || 0),
      0
    );

    const deposit = selectedServices.reduce(
      (sum, service) =>
        sum + Number(service.deposit_amount || 0),
      0
    );

    const first = selectedSlots[0];
    const last = selectedSlots[
      selectedSlots.length - 1
    ];

    $('[data-nil-summary]').innerHTML = `
      <div class="nil-summary">

        ${selectedServices.map((service, index) => {
          const slot = selectedSlots[index];

          return `
            <div class="nil-summary-row">
              <span>
                ${escapeHtml(service.name)}

                <small
                  style="
                    display:block;
                    opacity:.7;
                  "
                >
                  ◷
                  ${escapeHtml(slot?.start_time || '-')}
                  -
                  ${escapeHtml(slot?.end_time || '-')}
                </small>
              </span>

              <strong>
                ${priceFormat(service.price)}
                ${t('تومان', 'Toman')}
              </strong>
            </div>
          `;
        }).join('')}

        <div class="nil-summary-row">
          <span>
            ${t('تاریخ', 'Date')}
          </span>

          <strong>
            ${formatJalali(selectedDate)}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>
            ${t(
              'شروع اولین خدمت',
              'First service starts'
            )}
          </span>

          <strong>
            ${escapeHtml(first?.start_time || '-')}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>
            ${t(
              'پایان آخرین خدمت',
              'Last service ends'
            )}
          </span>

          <strong>
            ${escapeHtml(last?.end_time || '-')}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>
            ${t(
              'بیعانه پیش از تخفیف',
              'Deposit before discount'
            )}
          </span>

          <strong>
            ${priceFormat(deposit)}
            ${t('تومان', 'Toman')}
          </strong>
        </div>

        <div class="nil-summary-row total">
          <span>
            ${t(
              'جمع خدمات پیش از تخفیف',
              'Total before discount'
            )}
          </span>

          <strong>
            ${priceFormat(total)}
            ${t('تومان', 'Toman')}
          </strong>
        </div>

      </div>
    `;

    return true;
  }

  // ============================================================
  // STEP NAVIGATION
  // ============================================================

  nextButton.addEventListener('click', async () => {
    if (submitting || nextButton.disabled) return;

    // STEP 1 -> STEP 2
    if (currentStep === 1) {
      if (!selectedDate) return;

      currentServiceIndex = 0;

      selectedSlot =
        selectedSlots[0] || null;

      setStep(2);
      await loadAvailableTimes();

      return;
    }

    // STEP 2 -> NEXT SERVICE OR SUMMARY
    if (currentStep === 2) {
      if (!selectedSlot?.staff_id) return;

      if (
        !rescheduleBooking &&
        currentServiceIndex <
          selectedServices.length - 1
      ) {
        currentServiceIndex++;

        selectedSlot =
          selectedSlots[currentServiceIndex] || null;

        await loadAvailableTimes();
      } else {
        const valid = renderSummary();

        if (valid) {
          setStep(3);
        }
      }

      return;
    }

    // STEP 3 -> SUBMIT
    if (currentStep === 3) {
      if (rescheduleBooking) {
        await submitReschedule();
      } else {
        await submitBooking();
      }
    }
  });

  backButton.addEventListener('click', async () => {
    if (submitting || currentStep <= 1) return;

    if (currentStep === 3) {
      currentServiceIndex =
        selectedServices.length - 1;

      selectedSlot =
        selectedSlots[currentServiceIndex] || null;

      setStep(2);
      await loadAvailableTimes();

      return;
    }

    if (
      currentStep === 2 &&
      currentServiceIndex > 0
    ) {
      currentServiceIndex--;

      selectedSlot =
        selectedSlots[currentServiceIndex] || null;

      await loadAvailableTimes();

      return;
    }

    if (currentStep === 2) {
      availabilityRequestId++;
      loadingAvailability = false;
      selectedSlot = null;
    }

    setStep(1);
  });

  // ============================================================
  // CREATE BOOKING — MULTI SERVICE
  // ============================================================

  async function submitBooking() {
    if (submitting) return;

    const validSelections =
      selectedServices.length > 0 &&
      selectedSlots.length === selectedServices.length &&
      selectedServices.every((service, index) => {
        const slot = selectedSlots[index];

        return (
          String(slot?.service_id) === String(service.id) &&
          !!slot?.staff_id &&
          !!slot?.start_time
        );
      });

    if (!selectedDate || !validSelections) {
      showMessage(t(
        'اطلاعات رزرو کامل نیست.',
        'Booking details are incomplete.'
      ));

      return;
    }

    submitting = true;
    updateNextButton();

    const discountCode = $(
      '[data-nil-booking-discount-code]'
    ).value.trim();

    const payload = {
      booking_date: selectedDate,

      services: selectedServices.map(
        (service, index) => ({
          service_id: service.id,
          staff_id: selectedSlots[index].staff_id,
          start_time: selectedSlots[index].start_time
        })
      ),

      notes:
        $('[data-nil-notes]').value.trim() || null,

      discount_code: discountCode || null,

      use_referral_reward: false
    };

    try {
      const response = await bookingsApi.create(payload);

      if (
        response?.success === false ||
        response?.is_status === false
      ) {
        throw new Error(
          response.message || 'Booking failed'
        );
      }

      const bookingId = extractBookingId(response);

      const createdBooking =
        response?.data?.booking ||
        response?.data ||
        response?.booking ||
        {};

      if (!bookingId) {
        showMessage(t(
          'پاسخ سرور شناسه رزرو ندارد. قبل از تلاش مجدد نوبت‌های من را بررسی کن.',
          'Booking ID is missing. Check appointments before retrying.'
        ));

        return;
      }

      const isFreeBooking =
        createdBooking.total_amount !== undefined &&
        createdBooking.total_amount !== null &&
        Number(createdBooking.total_amount) === 0 &&
        createdBooking.status === 'confirmed';

      selectedServices = [];
      selectedDate = null;

      resetTimeSelection();

      renderServices();
      updateSelectionBar();

      modal.hidden = true;
      document.body.style.overflow = '';

      if (isFreeBooking) {
        switchTab('bookings');

        alert(t(
          'رزرو شما با تخفیف کامل و بدون نیاز به پرداخت تأیید شد.',
          'Your fully discounted booking was confirmed without payment.'
        ));
      } else {
        window.__app?.router?.navigate(
          `/checkout?booking=${encodeURIComponent(bookingId)}`
        );
      }

    } catch (error) {
      console.error('Booking error:', error);
      console.error('BACKEND ERROR:', error.response?.error);
      console.error('FULL RESPONSE:', error.response);

      showMessage(
        error.response?.error ||
        error.response?.message ||
        error.message ||
        t(
          'خطا در ثبت رزرو',
          'Booking failed'
        )
      );
    } finally {
      submitting = false;
      updateNextButton();
    }
  }

  // ============================================================
  // RESCHEDULE — SINGLE & MULTI SERVICE
  // ============================================================

  async function submitReschedule() {
    if (
      submitting ||
      !rescheduleBooking ||
      !selectedDate ||
      !selectedSlot?.start_time ||
      !rescheduleStaffId
    ) {
      return;
    }

    if (!canModifyBooking(rescheduleBooking)) {
      showMessage(t(
        'مهلت جابجایی این نوبت تمام شده است.',
        'The rescheduling deadline has passed.'
      ));

      return;
    }

    // Validate the entire shifted schedule before submitting.
    const preview = buildReschedulePreview();

    if (!preview || !preview.length) {
      showMessage(t(
        'زمان‌بندی جدید معتبر نیست.',
        'The new schedule is invalid.'
      ));

      return;
    }

    submitting = true;
    updateNextButton();

    try {
      // Existing API contract.
      // Backend must move ALL booking services atomically.
      const payload = {
        booking_date: selectedDate,
        start_time: selectedSlot.start_time,
        staff_id: rescheduleStaffId
      };

      const response = await bookingsApi.reschedule(
        rescheduleBooking.id,
        payload
      );

      if (
        response?.success === false ||
        response?.is_status === false
      ) {
        throw new Error(
          response.message || 'Reschedule failed'
        );
      }

      selectedServices =
        previousSelectedServices || [];

      resetRescheduleState();
      resetTimeSelection();

      selectedDate = null;

      availabilityRequestId++;
      loadingAvailability = false;

      renderServices();
      updateSelectionBar();

      modal.hidden = true;
      document.body.style.overflow = '';

      const heading = modal.querySelector(
        '.nil-dialog-header h2'
      );

      if (heading) {
        heading.textContent = t(
          'رزرو نوبت',
          'Book appointment'
        );
      }

      switchTab('bookings');

      alert(t(
        'درخواست جابجایی رزرو با موفقیت ثبت شد.',
        'The booking reschedule request was successful.'
      ));

    } catch (error) {
      console.error(
        'Multi-service reschedule error:',
        error
      );

      showMessage(
        error.response?.error ||
        error.response?.message ||
        error.message ||
        t(
          'خطا در جابجایی رزرو',
          'Failed to reschedule booking'
        )
      );
    } finally {
      submitting = false;
      updateNextButton();
    }
  }

  // ============================================================
  // MY BOOKINGS
  // ============================================================

  async function loadBookings() {
    const container = $('[data-nil-bookings]');

    container.innerHTML = `
      <div class="nil-loading">
        ${t(
          'در حال دریافت نوبت‌ها...',
          'Loading appointments...'
        )}
      </div>
    `;

    try {
      const response = await bookingsApi.list();
      const bookings = extractList(response, 'bookings');

      if (!bookings.length) {
        container.innerHTML = `
          <div class="nil-empty">
            ${t(
              'هنوز نوبتی ثبت نکردی.',
              'No appointments yet.'
            )}
          </div>
        `;

        return;
      }

      const statusLabels = {
        confirmed: t('تأیید شده', 'Confirmed'),
        awaiting_payment: t(
          'در انتظار پرداخت',
          'Awaiting payment'
        ),
        pending: t('در انتظار', 'Pending'),
        cancelled: t('لغو شده', 'Cancelled'),
        completed: t('انجام شده', 'Completed')
      };

      container.innerHTML = bookings.map((booking) => {
        const items = getBookingItems(booking);

        const serviceNames = items
          .map((item) =>
            item.service?.name ||
            item.service_name ||
            item.name
          )
          .filter(Boolean)
          .join(' + ');

        const title =
          serviceNames ||
          t('نوبت زیبایی', 'Beauty appointment');

        const canModify = canModifyBooking(booking);

        const totalAmount =
          booking.total_amount ??
          booking.subtotal ??
          0;

        const discountAmount =
          Number(booking.discount_amount || 0);

        return `
          <article class="nil-booking-card">

            <div class="nil-booking-top">
              <div>
                <small>
                  ${formatJalali(
                    booking.booking_date
                  )}
                </small>

                <h3>
                  ${escapeHtml(title)}
                </h3>

                ${items.length > 1 ? `
                  <small
                    style="
                      display:block;
                      margin-top:6px;
                      opacity:.7;
                    "
                  >
                    ${t(
                      `${faNumber(items.length)} خدمت در یک رزرو`,
                      `${items.length} services in one booking`
                    )}
                  </small>
                ` : ''}
              </div>

              <span class="nil-status">
                ${escapeHtml(
                  statusLabels[booking.status] ||
                  booking.status ||
                  '-'
                )}
              </span>
            </div>

            <div class="nil-booking-bottom">
              <span>
                ◷
                ${escapeHtml(
                  String(
                    booking.start_time || ''
                  ).slice(0, 5)
                )}
              </span>

              <strong>
                ${priceFormat(totalAmount)}
                ${t('تومان', 'Toman')}
              </strong>
            </div>

            ${discountAmount > 0 ? `
              <div class="nil-booking-bottom">
                <span>
                  ${t(
                    'تخفیف اعمال‌شده',
                    'Applied discount'
                  )}
                </span>

                <strong>
                  ${priceFormat(discountAmount)}
                  ${t('تومان', 'Toman')}
                </strong>
              </div>
            ` : ''}

            ${items.length > 1 ? `
              <div
                class="nil-summary"
                style="margin-top:12px"
              >
                ${items.map((item) => `
                  <div class="nil-summary-row">
                    <span>
                      ${escapeHtml(
                        item.service?.name ||
                        item.service_name ||
                        item.name ||
                        t('خدمت', 'Service')
                      )}
                    </span>

                    <strong>
                      ${escapeHtml(
                        String(item.start_time || '').slice(0, 5)
                      )}
                      -
                      ${escapeHtml(
                        String(item.end_time || '').slice(0, 5)
                      )}
                    </strong>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="nil-booking-actions">

              ${booking.status === 'awaiting_payment' ? `
                <button
                  type="button"
                  data-booking-pay="${escapeHtml(booking.id)}"
                >
                  ${t(
                    'ادامه پرداخت',
                    'Continue payment'
                  )}
                </button>
              ` : ''}

              ${canModify ? `
                <button
                  type="button"
                  class="nil-reschedule-btn"
                  data-booking-reschedule="${escapeHtml(booking.id)}"
                >
                  ◷
                  ${t(
                    'تغییر تاریخ و ساعت',
                    'Reschedule'
                  )}
                </button>

                <button
                  type="button"
                  data-booking-cancel="${escapeHtml(booking.id)}"
                >
                  ${t(
                    'لغو نوبت',
                    'Cancel'
                  )}
                </button>
              ` : ''}

            </div>
          </article>
        `;
      }).join('');

      // ========================================================
      // RESCHEDULE BUTTONS
      // ========================================================

      container.querySelectorAll(
        '[data-booking-reschedule]'
      ).forEach((button) => {
        button.addEventListener('click', () => {
          const booking = bookings.find(
            (item) =>
              String(item.id) ===
              button.dataset.bookingReschedule
          );

          if (!booking) return;

          openRescheduleModal(booking);
        });
      });

      // ========================================================
      // PAYMENT BUTTONS
      // ========================================================

      container.querySelectorAll(
        '[data-booking-pay]'
      ).forEach((button) => {
        button.addEventListener('click', () => {
          window.__app?.router?.navigate(
            `/checkout?booking=${encodeURIComponent(
              button.dataset.bookingPay
            )}`
          );
        });
      });

      // ========================================================
      // CANCEL BUTTONS
      // ========================================================

      container.querySelectorAll(
        '[data-booking-cancel]'
      ).forEach((button) => {
        button.addEventListener('click', async () => {
          const booking = bookings.find(
            (item) =>
              String(item.id) ===
              button.dataset.bookingCancel
          );

          if (!booking) return;

          if (!canModifyBooking(booking)) {
            alert(t(
              'لغو نوبت فقط تا ۲۴ ساعت قبل امکان‌پذیر است.',
              'Cancellation requires at least 24 hours notice.'
            ));

            return;
          }

          if (!confirm(t(
            'آیا از لغو این نوبت مطمئن هستید؟',
            'Are you sure you want to cancel this appointment?'
          ))) {
            return;
          }

          button.disabled = true;

          try {
            const response = await bookingsApi.cancel(
              booking.id
            );

            if (
              response?.success === false ||
              response?.is_status === false
            ) {
              throw new Error(
                response.message || 'Cancellation failed'
              );
            }

            await loadBookings();

            alert(t(
              'نوبت شما با موفقیت لغو شد.',
              'Your appointment was cancelled successfully.'
            ));

          } catch (error) {
            console.error(
              'Cancel booking error:',
              error
            );

            alert(
              error.message ||
              t(
                'خطا در لغو نوبت',
                'Cancellation failed'
              )
            );

            if (button.isConnected) {
              button.disabled = false;
            }
          }
        });
      });

    } catch (error) {
      console.error('Load bookings error:', error);

      container.innerHTML = `
        <div class="nil-empty">
          ${escapeHtml(error.message)}
        </div>
      `;
    }
  }

  // ============================================================
  // PROFILE
  // ============================================================

  async function loadProfile() {
    const container = $('[data-nil-profile]');

    container.innerHTML = `
      <div class="nil-loading">
        ${t(
          'در حال بارگذاری...',
          'Loading...'
        )}
      </div>
    `;

    try {
      const response = await profileApi.get();

      const client =
        response?.data?.client ||
        response?.data ||
        {};

      container.innerHTML = `
        <div class="nil-profile-card">

          <div class="nil-profile-head">
            <div class="nil-avatar">
              ${escapeHtml(
                String(client.name || '?').charAt(0)
              )}
            </div>

            <div>
              <h3>
                ${escapeHtml(client.name || '-')}
              </h3>

              <p>
                ${escapeHtml(client.phone || '-')}
              </p>
            </div>
          </div>

          <div class="nil-profile-field">
            <span>
              ${t('نام', 'Name')}
            </span>

            <strong>
              ${escapeHtml(client.name || '-')}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>
              ${t('ایمیل', 'Email')}
            </span>

            <strong>
              ${escapeHtml(client.email || '-')}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>
              ${t('شماره موبایل', 'Phone')}
            </span>

            <strong>
              ${escapeHtml(client.phone || '-')}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>
              ${t('کد معرف', 'Referral code')}
            </span>

            <strong>
              ${escapeHtml(
                client.referral_code || '-'
              )}
            </strong>
          </div>

          <button
            type="button"
            class="nil-btn nil-btn-dark"
            data-edit-profile
          >
            ${t(
              'ویرایش اطلاعات',
              'Edit profile'
            )}
          </button>

        </div>
      `;

      container.querySelector(
        '[data-edit-profile]'
      )?.addEventListener('click', () => {
        renderProfileEditor(client);
      });

    } catch (error) {
      container.innerHTML = `
        <div class="nil-empty">
          ${escapeHtml(error.message)}
        </div>
      `;
    }
  }

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  function renderProfileEditor(client) {
    const container = $('[data-nil-profile]');

    container.innerHTML = `
      <form
        class="nil-profile-card"
        data-profile-form
      >
        <h3>
          ${t(
            'ویرایش پروفایل',
            'Edit profile'
          )}
        </h3>

        <label class="nil-field-label">
          ${t('نام', 'Name')}
        </label>

        <input
          class="nil-input"
          name="name"
          value="${escapeHtml(client.name || '')}"
          required
        >

        <label class="nil-field-label">
          ${t('ایمیل', 'Email')}
        </label>

        <input
          class="nil-input"
          name="email"
          type="email"
          value="${escapeHtml(client.email || '')}"
        >

        <p
          class="nil-feedback"
          data-profile-error
        ></p>

        <button
          type="submit"
          class="nil-btn nil-btn-dark"
        >
          ${t(
            'ذخیره تغییرات',
            'Save changes'
          )}
        </button>

        <button
          type="button"
          class="nil-btn nil-btn-light"
          data-profile-back
        >
          ${t('بازگشت', 'Back')}
        </button>
      </form>
    `;

    container.querySelector(
      '[data-profile-back]'
    ).addEventListener('click', loadProfile);

    container.querySelector(
      '[data-profile-form]'
    ).addEventListener('submit', async (event) => {
      event.preventDefault();

      const form = event.currentTarget;

      const submitButton = form.querySelector(
        '[type="submit"]'
      );

      submitButton.disabled = true;

      try {
        await profileApi.update({
          name: form.elements.name.value.trim(),
          email:
            form.elements.email.value.trim() || null
        });

        await loadProfile();

      } catch (error) {
        form.querySelector(
          '[data-profile-error]'
        ).textContent = error.message;

        submitButton.disabled = false;
      }
    });
  }

  // ============================================================
  // INITIALIZE
  // ============================================================

  loadServices();
}