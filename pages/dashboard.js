
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

// =====================================================
// NIL DASHBOARD V3
// Responsive | Persian Calendar | Optional Staff
// =====================================================

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

const faNumber = (value) =>
  String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

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

// =====================================================
// Date Helpers
// =====================================================

function getDateParts(formatter, date) {
  const parts = formatter.formatToParts(date);

  const get = (type) =>
    Number(parts.find((item) => item.type === type)?.value);

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
  return toISO(getDateParts(tehranFormatter, new Date()));
}

function isoToDate(iso) {
  return new Date(`${iso}T12:00:00Z`);
}

function addDays(iso, days) {
  const date = isoToDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getJalali(iso) {
  return getDateParts(persianFormatter, isoToDate(iso));
}

function formatJalali(iso) {
  if (!iso) return '—';

  try {
    const { year, month, day } = getJalali(
      String(iso).slice(0, 10)
    );

    return `${faNumber(day)} ${persianMonths[month - 1]} ${faNumber(year)}`;
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

  // Persian new year falls around March 20/21.
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

    if (parts.year !== year || parts.month !== month) {
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

// =====================================================
// API Response Helpers
// =====================================================

function extractList(response, key) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) {
    return response.data;
  }

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
  const items = extractList(response, 'slots');

  return items
    .filter((slot) =>
      slot &&
      typeof slot === 'object' &&
      slot.start_time &&
      slot.end_time &&
      Array.isArray(slot.staff_ids) &&
      slot.staff_ids.length > 0
    )
    .map((slot) => ({
      ...slot,
      start_time: String(slot.start_time).slice(0, 5),
      end_time: String(slot.end_time).slice(0, 5),
      staff_ids: [...new Set(
        slot.staff_ids
          .map(Number)
          .filter((id) => Number.isInteger(id) && id > 0)
      )]
    }))
    .filter((slot) => slot.staff_ids.length > 0)
    .sort((a, b) =>
      a.start_time.localeCompare(b.start_time) ||
      a.end_time.localeCompare(b.end_time)
    );
}

// =====================================================
// Main Page
// =====================================================

export async function DashboardPage() {
  if (!isLoggedIn()) {
    queueMicrotask(() => {
      window.__app?.router?.navigate('/login');
    });

    return Layout(`
      <div class="nil-loading">در حال انتقال به ورود...</div>
    `);
  }

  const user = getUser();
  const isFa = getCurrentLang() === 'fa';

  const t = (fa, en) => isFa ? fa : en;

  const html = Layout(`
    <main class="nil-dashboard"
      data-nil-dashboard
      dir="${isFa ? 'rtl' : 'ltr'}">

      <div class="nil-shell">

        <!-- HEADER -->
        <header class="nil-topbar">
          <div class="nil-brand">
            <div class="nil-brand-icon">N</div>
            <div>
              <strong>NIL BEAUTY</strong>
              <small>${t('پنل مشتریان', 'Customer dashboard')}</small>
            </div>
          </div>

          <button
            class="nil-icon-btn"
            data-nil-logout
            title="${t('خروج', 'Logout')}">
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
              ${escapeHtml(user?.name || t('عزیز', 'there'))}
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
          <button class="active" data-nil-tab="services">
            <span>✦</span>
            ${t('رزرو خدمات', 'Book services')}
          </button>

          <button data-nil-tab="bookings">
            <span>◷</span>
            ${t('نوبت‌های من', 'Appointments')}
          </button>

          <button data-nil-tab="profile">
            <span>♙</span>
            ${t('پروفایل', 'Profile')}
          </button>
        </nav>

        <!-- SERVICES -->
        <section class="nil-panel" data-nil-panel="services">
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">EXPLORE SERVICES</span>
              <h2>${t('خدمات زیبایی', 'Beauty services')}</h2>
              <p>
                ${t(
                  'خدمات دلخواهت رو انتخاب کن',
                  'Choose your favorite services'
                )}
              </p>
            </div>
          </div>

          <div class="nil-service-grid" data-nil-services>
            <div class="nil-loading">
              ${t('در حال دریافت خدمات...', 'Loading services...')}
            </div>
          </div>
        </section>

        <!-- BOOKINGS -->
        <section
          class="nil-panel"
          data-nil-panel="bookings"
          hidden>

          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">MY APPOINTMENTS</span>
              <h2>${t('نوبت‌های من', 'My appointments')}</h2>
            </div>

            <button class="nil-text-btn" data-nil-refresh>
              ${t('بروزرسانی ↻', 'Refresh ↻')}
            </button>
          </div>

          <div class="nil-bookings" data-nil-bookings></div>
        </section>

        <!-- PROFILE -->
        <section
          class="nil-panel"
          data-nil-panel="profile"
          hidden>

          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">MY ACCOUNT</span>
              <h2>${t('حساب کاربری', 'My account')}</h2>
            </div>
          </div>

          <div data-nil-profile></div>
        </section>

      </div>

      <!-- SELECTED SERVICES BAR -->
      <div class="nil-selection" data-nil-selection hidden>
        <div class="nil-selection-inner">
          <div>
            <small data-nil-selection-count></small>
            <strong data-nil-selection-total></strong>
          </div>

          <button
            class="nil-btn nil-btn-dark"
            data-nil-continue>
            ${t('ادامه رزرو', 'Continue')} ←
          </button>
        </div>
      </div>

      <!-- BOOKING MODAL -->
      <div class="nil-modal" data-nil-modal hidden>
        <div class="nil-modal-shade" data-nil-close></div>

        <section
          class="nil-dialog"
          role="dialog"
          aria-modal="true">

          <div class="nil-dialog-header">
            <div>
              <span class="nil-eyebrow">
                BOOK YOUR APPOINTMENT
              </span>

              <h2>${t('رزرو نوبت', 'Book appointment')}</h2>
            </div>

            <button class="nil-icon-btn" data-nil-close>
              ✕
            </button>
          </div>

          <div class="nil-progress">
            <span data-nil-progress="1" class="active"></span>
            <span data-nil-progress="2"></span>
            <span data-nil-progress="3"></span>
          </div>

          <div class="nil-dialog-body">

            <!-- STEP 1 -->
            <div data-nil-step="1">
              <h3>${t('چه روزی برات مناسبه؟', 'Choose a date')}</h3>

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
              <h3>${t('انتخاب ساعت', 'Choose a time')}</h3>

              <p class="nil-muted" data-nil-date-label></p>

              <div class="nil-time-grid" data-nil-times></div>
            </div>

            <!-- STEP 3 -->
            <div data-nil-step="3" hidden>
              <h3>${t('تأیید اطلاعات', 'Confirm booking')}</h3>

              <div data-nil-summary></div>

              <label class="nil-field-label" for="nil-notes">
                ${t('توضیحات (اختیاری)', 'Notes (optional)')}
              </label>

              <textarea
                id="nil-notes"
                class="nil-input"
                data-nil-notes
                rows="3"
                placeholder="${t('توضیحات شما...', 'Your notes...')}">
              </textarea>
            </div>

            <p
              class="nil-feedback"
              data-nil-message
              hidden>
            </p>
          </div>

          <div class="nil-dialog-footer">
            <button
              class="nil-btn nil-btn-light"
              data-nil-back
              hidden>
              ${t('بازگشت', 'Back')}
            </button>

            <button
              class="nil-btn nil-btn-dark"
              data-nil-next
              disabled>
              ${t('ادامه', 'Continue')}
            </button>
          </div>
        </section>
      </div>
    </main>
  `);

  setTimeout(() => {
    const root = document.querySelector('[data-nil-dashboard]');

    if (!root) return;

    initLayout();
    initDashboard(root, isFa);
  }, 100);

  return html;
}

// =====================================================
// Dashboard Logic
// =====================================================

function initDashboard(root, isFa) {
  if (root.dataset.initialized === '1') return;
  root.dataset.initialized = '1';

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];

  const t = (fa, en) => isFa ? fa : en;

  let services = [];
  let selectedServices = [];

  let selectedDate = null;
  let selectedSlot = null;

  let monthOffset = 0;
  let currentStep = 1;

  let loadingAvailability = false;
  let submitting = false;

  let availabilityRequestId = 0;

  const modal = $('[data-nil-modal]');
  const nextButton = $('[data-nil-next]');
  const backButton = $('[data-nil-back]');

  // ===================================================
  // General
  // ===================================================

  function showMessage(text = '', error = true) {
    const element = $('[data-nil-message]');

    element.textContent = text;
    element.hidden = !text;
    element.classList.toggle('error', error);
  }

  function setStep(step) {
    currentStep = step;

    showMessage();

    $$('[data-nil-step]').forEach((element) => {
      element.hidden = Number(element.dataset.nilStep) !== step;
    });

    $$('[data-nil-progress]').forEach((element) => {
      element.classList.toggle(
        'active',
        Number(element.dataset.nilProgress) <= step
      );
    });

    backButton.hidden = step === 1;

    nextButton.textContent = step === 3
      ? t('ثبت نوبت', 'Book now')
      : t('ادامه', 'Continue');

    updateNextButton();
  }

  function updateNextButton() {
    let disabled = submitting;

    if (currentStep === 1) {
      disabled ||= !selectedDate;
    }

    if (currentStep === 2) {
      disabled ||= loadingAvailability || !selectedSlot;
    }

    if (currentStep === 3) {
      disabled ||= !selectedSlot || !selectedDate;
    }

    nextButton.disabled = disabled;
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
      if (!confirm(t('خارج می‌شوی؟', 'Log out?'))) return;

      try {
        await logout();
      } catch (error) {
        console.error('Logout:', error);
      }

      window.__app?.router?.navigate('/login');
    }
  );

  // ===================================================
  // Services
  // ===================================================

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
          ${t('خدمتی موجود نیست', 'No services available')}
        </div>
      `;
      return;
    }

    container.innerHTML = services.map((service, index) => {
      const active = selectedServices.some(
        (item) => String(item.id) === String(service.id)
      );

      return `
        <button
          type="button"
          class="nil-service ${active ? 'selected' : ''}"
          data-service-id="${escapeHtml(service.id)}"
          aria-pressed="${active}">

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
            <h3>${escapeHtml(service.name)}</h3>

            <p>
              ${escapeHtml(
                service.description ||
                t('خدمات زیبایی نیل', 'NIL beauty service')
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
            (item) => String(item.id) === String(service.id)
          );

          if (exists) {
            selectedServices = selectedServices.filter(
              (item) => String(item.id) !== String(service.id)
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

    $('[data-nil-selection-count]').textContent =
      t(
        `${faNumber(count)} خدمت انتخاب شده`,
        `${count} selected services`
      );

    const total = selectedServices.reduce(
      (sum, service) => sum + Number(service.price || 0),
      0
    );

    $('[data-nil-selection-total]').textContent =
      `${priceFormat(total)} ${t('تومان', 'Toman')}`;
  }

  // ===================================================
  // Modal
  // ===================================================

  function openModal() {
    if (!selectedServices.length) return;

    selectedDate = null;
    selectedSlot = null;

    monthOffset = 0;
    availabilityRequestId++;

    $('[data-nil-notes]').value = '';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    setStep(1);
    renderCalendar();
  }

  function closeModal() {
    if (submitting) return;

    availabilityRequestId++;

    modal.hidden = true;
    document.body.style.overflow = '';
  }

  $('[data-nil-continue]').addEventListener(
    'click',
    openModal
  );

  $$('[data-nil-close]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  // ===================================================
  // Jalali Calendar
  // ===================================================

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

    // JS: Sunday=0, Saturday=6.
    // Calendar: Saturday first.
    const emptyDays = (month.days[0].weekday + 1) % 7;

    container.innerHTML = `
      <div class="nil-calendar">

        <div class="nil-calendar-head">
          <button
            type="button"
            data-month-prev
            ${monthOffset === 0 ? 'disabled' : ''}>
            →
          </button>

          <div>
            <strong>
              ${persianMonths[month.month - 1]}
              ${faNumber(month.year)}
            </strong>

            <small>
              ${t('انتخاب تاریخ نوبت', 'Select a date')}
            </small>
          </div>

          <button type="button" data-month-next>
            ←
          </button>
        </div>

        <div class="nil-weekdays">
          ${weekdays.map((day) => `<span>${day}</span>`).join('')}
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
                ${isPast ? 'disabled' : ''}>

                ${faNumber(day.day)}
                ${isToday ? '<i></i>' : ''}
              </button>
            `;
          }).join('')}

        </div>

        <div class="nil-calendar-note">
          <span class="nil-calendar-dot"></span>
          ${t('تاریخ امروز مشخص شده است', 'Today is marked')}
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
        selectedSlot = null;

        renderCalendar();
        updateNextButton();
      });
    });
  }

  // ===================================================
  // Available Times
  // ===================================================

  async function loadAvailableTimes() {
    const container = $('[data-nil-times]');

    const requestId = ++availabilityRequestId;

    selectedSlot = null;
    loadingAvailability = true;

    updateNextButton();

    $('[data-nil-date-label]').textContent =
      formatJalali(selectedDate);

    container.innerHTML = `
      <div class="nil-loading">
        ${t(
          'در حال بررسی ساعت‌های آزاد...',
          'Checking available times...'
        )}
      </div>
    `;

    // Current backend controller supports one service.
    // Multi-service availability must be checked as a group.
    if (selectedServices.length !== 1) {
      loadingAvailability = false;
      updateNextButton();

      container.innerHTML = `
        <div class="nil-empty">
          ${t(
            'برای رزرو همزمان چند خدمت، باید API ظرفیت ترکیبی تکمیل شود. فعلاً یک خدمت انتخاب کن.',
            'Combined availability is required for multiple services. Please select one service.'
          )}
        </div>
      `;
      return;
    }

    const service = selectedServices[0];

    try {
      // Staff is optional.
      // The new Laravel controller finds eligible staff.
      const response = await availabilityApi.check(
        null,
        service.id,
        selectedDate,
        30
      );

      if (requestId !== availabilityRequestId) return;

      const slots = normalizeSlots(response);

      if (!slots.length) {
        container.innerHTML = `
          <div class="nil-empty">
            ${t(
              'برای این روز ساعت آزادی پیدا نشد.',
              'No available times for this date.'
            )}
          </div>
        `;
        return;
      }

      // Keep every interval separate, including intervals
      // that have the same start but different end times.
      container.innerHTML = slots.map((slot, index) => `
        <button
          type="button"
          class="nil-time"
          data-slot-index="${index}">

          <span>
            ◷ ${escapeHtml(slot.start_time)}
          </span>

          <small style="
            display:block;
            margin-top:6px;
            opacity:.65;
            font-size:11px;
          ">
            ${t('تا', 'to')}
            ${escapeHtml(slot.end_time)}
          </small>
        </button>
      `).join('');

      container.querySelectorAll('[data-slot-index]')
        .forEach((button) => {
          button.addEventListener('click', () => {
            const index = Number(button.dataset.slotIndex);
            const slot = slots[index];

            if (!slot || !slot.staff_ids.length) return;

            // Choose an eligible staff member for this slot.
            // Backend must re-check availability on creation.
            selectedSlot = {
              start_time: slot.start_time,
              end_time: slot.end_time,
              duration: slot.duration,
              staff_ids: slot.staff_ids,
              staff_id: slot.staff_ids[0]
            };

            container.querySelectorAll('[data-slot-index]')
              .forEach((element) => {
                element.classList.toggle(
                  'active',
                  element === button
                );
              });

            updateNextButton();
          });
        });

    } catch (error) {
      if (requestId !== availabilityRequestId) return;

      console.error('Availability error:', error);

      container.innerHTML = `
        <div class="nil-empty">
          ${escapeHtml(
            error.message ||
            t('خطا در دریافت ساعت‌ها', 'Failed to load times')
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

  // ===================================================
  // Booking Summary
  // ===================================================

  function renderSummary() {
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

    $('[data-nil-summary]').innerHTML = `
      <div class="nil-summary">

        ${selectedServices.map((service) => `
          <div class="nil-summary-row">
            <span>${escapeHtml(service.name)}</span>

            <strong>
              ${priceFormat(service.price)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>
        `).join('')}

        <div class="nil-summary-row">
          <span>${t('تاریخ', 'Date')}</span>
          <strong>${formatJalali(selectedDate)}</strong>
        </div>

        <div class="nil-summary-row">
          <span>${t('ساعت شروع', 'Start time')}</span>
          <strong>
            ${escapeHtml(selectedSlot?.start_time)}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>${t('ساعت پایان', 'End time')}</span>
          <strong>
            ${escapeHtml(selectedSlot?.end_time)}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>${t('بیعانه', 'Deposit')}</span>
          <strong>
            ${priceFormat(deposit)}
            ${t('تومان', 'Toman')}
          </strong>
        </div>

        <div class="nil-summary-row total">
          <span>${t('مبلغ کل', 'Total')}</span>
          <strong>
            ${priceFormat(total)}
            ${t('تومان', 'Toman')}
          </strong>
        </div>
      </div>
    `;
  }

  // ===================================================
  // Steps
  // ===================================================

  nextButton.addEventListener('click', async () => {
    if (submitting) return;

    if (currentStep === 1) {
      if (!selectedDate) return;

      setStep(2);
      await loadAvailableTimes();
      return;
    }

    if (currentStep === 2) {
      if (!selectedSlot) return;

      renderSummary();
      setStep(3);
      return;
    }

    if (currentStep === 3) {
      await submitBooking();
    }
  });

  backButton.addEventListener('click', () => {
    if (submitting || currentStep <= 1) return;

    if (currentStep === 2) {
      availabilityRequestId++;
      loadingAvailability = false;
      selectedSlot = null;
    }

    setStep(currentStep - 1);
  });

  // ===================================================
  // Create Booking
  // ===================================================

  async function submitBooking() {
    if (submitting) return;

    if (
      !selectedDate ||
      !selectedSlot ||
      !selectedSlot.staff_id ||
      selectedServices.length !== 1
    ) {
      showMessage(
        t('اطلاعات رزرو کامل نیست.', 'Booking details are incomplete.')
      );
      return;
    }

    submitting = true;
    updateNextButton();

    const service = selectedServices[0];

    const payload = {
      booking_date: selectedDate,
      services: [
        {
          service_id: service.id,
          staff_id: selectedSlot.staff_id,
          start_time: selectedSlot.start_time
        }
      ],
      notes: $('[data-nil-notes]').value.trim() || null
    };

    try {
      const response = await bookingsApi.create(payload);

      const bookingId = extractBookingId(response);

      if (!bookingId) {
        showMessage(
          t(
            'پاسخ سرور شناسه رزرو ندارد. قبل از تلاش مجدد، نوبت‌های من را بررسی کن.',
            'Booking ID is missing. Check your appointments before retrying.'
          )
        );
        return;
      }

      selectedServices = [];

      renderServices();
      updateSelectionBar();

      modal.hidden = true;
      document.body.style.overflow = '';

      window.__app?.router?.navigate(
        `/checkout?booking=${encodeURIComponent(bookingId)}`
      );

    } catch (error) {
      console.error('Booking error:', error);

      showMessage(
        error.message ||
        t('خطا در ثبت رزرو', 'Booking failed')
      );
    } finally {
      submitting = false;
      updateNextButton();
    }
  }

  // ===================================================
  // My Bookings
  // ===================================================

  async function loadBookings() {
    const container = $('[data-nil-bookings]');

    container.innerHTML = `
      <div class="nil-loading">
        ${t('در حال دریافت نوبت‌ها...', 'Loading appointments...')}
      </div>
    `;

    try {
      const response = await bookingsApi.list();
      const bookings = extractList(response, 'bookings');

      if (!bookings.length) {
        container.innerHTML = `
          <div class="nil-empty">
            ${t('هنوز نوبتی ثبت نکردی.', 'No appointments yet.')}
          </div>
        `;
        return;
      }

      const statusLabels = {
        confirmed: t('تأیید شده', 'Confirmed'),
        awaiting_payment: t('در انتظار پرداخت', 'Awaiting payment'),
        pending: t('در انتظار', 'Pending'),
        cancelled: t('لغو شده', 'Cancelled'),
        completed: t('انجام شده', 'Completed')
      };

      container.innerHTML = bookings.map((booking) => {
        const items =
          booking.booking_services ||
          booking.services ||
          [];

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

        return `
          <article class="nil-booking-card">

            <div class="nil-booking-top">
              <div>
                <small>
                  ${formatJalali(booking.booking_date)}
                </small>

                <h3>${escapeHtml(title)}</h3>
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
                ◷ ${escapeHtml(
                  String(booking.start_time || '').slice(0, 5)
                )}
              </span>

              <strong>
                ${priceFormat(
                  booking.subtotal ??
                  booking.total_amount ??
                  0
                )}
                ${t('تومان', 'Toman')}
              </strong>
            </div>

            <div class="nil-booking-actions">

              ${booking.status === 'awaiting_payment' ? `
                <button data-booking-pay="${escapeHtml(booking.id)}">
                  ${t('ادامه پرداخت', 'Continue payment')}
                </button>
              ` : ''}

              ${!['cancelled', 'completed'].includes(booking.status) ? `
                <button data-booking-cancel="${escapeHtml(booking.id)}">
                  ${t('لغو نوبت', 'Cancel')}
                </button>
              ` : ''}

            </div>
          </article>
        `;
      }).join('');

      container.querySelectorAll('[data-booking-pay]')
        .forEach((button) => {
          button.addEventListener('click', () => {
            window.__app?.router?.navigate(
              `/checkout?booking=${encodeURIComponent(
                button.dataset.bookingPay
              )}`
            );
          });
        });

      container.querySelectorAll('[data-booking-cancel]')
        .forEach((button) => {
          button.addEventListener('click', async () => {
            const booking = bookings.find(
              (item) =>
                String(item.id) === button.dataset.bookingCancel
            );

            if (!booking) return;

            const time = String(
              booking.start_time || '00:00'
            ).slice(0, 5);

            // Tehran currently uses UTC+03:30.
            const appointmentDate = new Date(
              `${booking.booking_date}T${time}:00+03:30`
            );

            if (!Number.isFinite(appointmentDate.getTime())) {
              alert(t('تاریخ نوبت نامعتبر است', 'Invalid date'));
              return;
            }

            const hoursRemaining =
              (appointmentDate.getTime() - Date.now()) / 3600000;

            if (hoursRemaining < 24) {
              alert(
                t(
                  'لغو نوبت در کمتر از ۲۴ ساعت مجاز نیست.',
                  'Cancellation requires 24 hours notice.'
                )
              );
              return;
            }

            if (!confirm(
              t('نوبت لغو شود؟', 'Cancel appointment?')
            )) {
              return;
            }

            button.disabled = true;

            try {
              await bookingsApi.cancel(booking.id);
              await loadBookings();
            } catch (error) {
              alert(error.message);
              button.disabled = false;
            }
          });
        });

    } catch (error) {
      container.innerHTML = `
        <div class="nil-empty">
          ${escapeHtml(error.message)}
        </div>
      `;
    }
  }

  // ===================================================
  // Profile
  // ===================================================

  async function loadProfile() {
    const container = $('[data-nil-profile]');

    container.innerHTML = `
      <div class="nil-loading">
        ${t('در حال بارگذاری...', 'Loading...')}
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
              <h3>${escapeHtml(client.name || '-')}</h3>
              <p>${escapeHtml(client.phone || '-')}</p>
            </div>
          </div>

          <div class="nil-profile-field">
            <span>${t('نام', 'Name')}</span>
            <strong>${escapeHtml(client.name || '-')}</strong>
          </div>

          <div class="nil-profile-field">
            <span>${t('ایمیل', 'Email')}</span>
            <strong>${escapeHtml(client.email || '-')}</strong>
          </div>

          <div class="nil-profile-field">
            <span>${t('شماره موبایل', 'Phone')}</span>
            <strong>${escapeHtml(client.phone || '-')}</strong>
          </div>

          <div class="nil-profile-field">
            <span>${t('کد معرف', 'Referral code')}</span>
            <strong>${escapeHtml(client.referral_code || '-')}</strong>
          </div>

          <button
            class="nil-btn nil-btn-dark"
            data-edit-profile>
            ${t('ویرایش اطلاعات', 'Edit profile')}
          </button>
        </div>
      `;

      container.querySelector('[data-edit-profile]')
        .addEventListener('click', () => {
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

  function renderProfileEditor(client) {
    const container = $('[data-nil-profile]');

    container.innerHTML = `
      <form class="nil-profile-card" data-profile-form>
        <h3>${t('ویرایش پروفایل', 'Edit profile')}</h3>

        <label class="nil-field-label">
          ${t('نام', 'Name')}
        </label>

        <input
          class="nil-input"
          name="name"
          value="${escapeHtml(client.name || '')}"
          required>

        <label class="nil-field-label">
          ${t('ایمیل', 'Email')}
        </label>

        <input
          class="nil-input"
          name="email"
          type="email"
          value="${escapeHtml(client.email || '')}">

        <p class="nil-feedback" data-profile-error></p>

        <button
          type="submit"
          class="nil-btn nil-btn-dark">
          ${t('ذخیره تغییرات', 'Save changes')}
        </button>

        <button
          type="button"
          class="nil-btn nil-btn-light"
          data-profile-back>
          ${t('بازگشت', 'Back')}
        </button>
      </form>
    `;

    container.querySelector('[data-profile-back]')
      .addEventListener('click', loadProfile);

    container.querySelector('[data-profile-form]')
      .addEventListener('submit', async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const submitButton = form.querySelector(
          '[type="submit"]'
        );

        submitButton.disabled = true;

        try {
          await profileApi.update({
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim() || null
          });

          await loadProfile();

        } catch (error) {
          form.querySelector('[data-profile-error]')
            .textContent = error.message;

          submitButton.disabled = false;
        }
      });
  }

  // ===================================================
  // Initialize
  // ===================================================

  loadServices();
}
