
import { Layout, initLayout } from '../components/Layout.js';
import { getCurrentLang } from '../code/i18n.js';
import { isLoggedIn } from '../code/auth.js';
import { bookingsApi, paymentsApi } from '../code/api.js';
import '../asset/css/custom.css';

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

const formatPrice = (value) =>
  new Intl.NumberFormat('fa-IR').format(Number(value || 0));

const faDigits = (value) =>
  String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(`${String(value).slice(0, 10)}T12:00:00Z`);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function extractBooking(response) {
  return (
    response?.data?.booking ||
    response?.data ||
    response?.booking ||
    null
  );
}

function extractPaymentUrl(response) {
  const candidates = [
    response?.data?.payment_url,
    response?.data?.gateway_url,
    response?.data?.url,
    response?.payment_url,
    response?.gateway_url,
    response?.url
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;

    try {
      const url = new URL(candidate);

      if (url.protocol === 'https:') {
        return url.href;
      }
    } catch {
      // Invalid URL
    }
  }

  return null;
}

// ============================================================
// CHECKOUT PAGE
// ============================================================

export function CheckoutPage() {
  const isFa = getCurrentLang() === 'fa';
  const t = (fa, en) => isFa ? fa : en;

  if (!isLoggedIn()) {
    queueMicrotask(() => {
      window.__app?.router?.navigate('/login');
    });

    return Layout(`
      <div class="nil-checkout-loading">
        ${t('در حال انتقال به ورود...', 'Redirecting to login...')}
      </div>
    `);
  }

  const html = Layout(`
    <main
      class="nil-checkout"
      dir="${isFa ? 'rtl' : 'ltr'}"
      data-nil-checkout
    >
      <div class="nil-checkout-container">

        <!-- HEADER -->
        <header class="nil-checkout-header">
          <button
            type="button"
            class="nil-checkout-back"
            data-checkout-back
          >
            ${isFa ? '→' : '←'}
            ${t('بازگشت به داشبورد', 'Back to dashboard')}
          </button>

          <div class="nil-checkout-brand">
            <span>NIL BEAUTY</span>
          </div>
        </header>

        <!-- HEADING -->
        <section class="nil-checkout-heading">
          <span class="nil-checkout-eyebrow">
            SECURE CHECKOUT
          </span>

          <h1>
            ${t('تکمیل رزرو', 'Complete your booking')}
          </h1>

          <p>
            ${t(
              'اطلاعات نوبتت رو بررسی کن و برای تکمیل رزرو بیعانه رو پرداخت کن.',
              'Review your appointment and pay the deposit to complete your booking.'
            )}
          </p>
        </section>

        <!-- CONTENT -->
        <div data-checkout-content>
          <div class="nil-checkout-loading">
            <div class="nil-checkout-spinner"></div>
            ${t(
              'در حال دریافت اطلاعات رزرو...',
              'Loading booking details...'
            )}
          </div>
        </div>

        <!-- FOOTER -->
        <footer class="nil-checkout-footer">
          <span>✦ NIL BEAUTY STUDIO</span>
          <span>
            ${t(
              'رزرو آنلاین خدمات زیبایی',
              'Online beauty booking'
            )}
          </span>
        </footer>

      </div>
    </main>
  `);

  setTimeout(() => {
    const root = document.querySelector('[data-nil-checkout]');

    if (!root || root.dataset.initialized) return;

    root.dataset.initialized = '1';

    initLayout();
    initCheckout(root, isFa);
  }, 100);

  return html;
}

// ============================================================
// CHECKOUT LOGIC
// ============================================================

async function initCheckout(root, isFa) {
  const $ = (selector) => root.querySelector(selector);
  const t = (fa, en) => isFa ? fa : en;

  const container = $('[data-checkout-content]');

  const bookingId = new URLSearchParams(
    window.location.search
  ).get('booking');

  let booking = null;
  let processing = false;

  // ==========================================================
  // BACK TO DASHBOARD
  // ==========================================================

  $('[data-checkout-back]').addEventListener('click', () => {
    window.__app?.router?.navigate('/dashboard');
  });

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  function showError(message, allowRetry = false) {
    container.innerHTML = `
      <div class="nil-checkout-state">
        <div class="nil-checkout-state-icon">!</div>

        <h2>
          ${t('مشکلی پیش آمد', 'Something went wrong')}
        </h2>

        <p>${escapeHtml(message)}</p>

        ${allowRetry ? `
          <button
            type="button"
            class="nil-checkout-button"
            data-checkout-retry
          >
            ${t('تلاش مجدد', 'Try again')}
          </button>
        ` : ''}
      </div>
    `;

    $('[data-checkout-retry]')?.addEventListener(
      'click',
      loadBooking
    );
  }

  // ==========================================================
  // LOAD BOOKING FROM BACKEND
  // ==========================================================

  async function loadBooking() {
    if (!bookingId || !/^\d+$/.test(bookingId)) {
      showError(
        t('شناسه رزرو معتبر نیست.', 'Invalid booking ID.')
      );
      return;
    }

    container.innerHTML = `
      <div class="nil-checkout-loading">
        <div class="nil-checkout-spinner"></div>

        ${t(
          'در حال دریافت اطلاعات رزرو...',
          'Loading booking details...'
        )}
      </div>
    `;

    try {
      const response = await bookingsApi.get(bookingId);

      booking = extractBooking(response);

      if (
        !booking ||
        typeof booking !== 'object' ||
        !booking.id
      ) {
        throw new Error(
          t(
            'اطلاعات رزرو دریافت نشد.',
            'Booking details not found.'
          )
        );
      }

      renderBooking();

    } catch (error) {
      console.error('Checkout booking error:', error);

      showError(
        error.message ||
        t(
          'خطا در دریافت اطلاعات رزرو',
          'Failed to load booking'
        ),
        true
      );
    }
  }

  // ==========================================================
  // RENDER BOOKING
  // ==========================================================

  function renderBooking() {
    const services =
      booking.booking_services ||
      booking.services ||
      [];

    // --------------------------------------------------------
    // FINANCIAL DATA — FROM BACKEND
    // --------------------------------------------------------

    const subtotal = Number(booking.subtotal ?? 0);

    const discountAmount = Number(
      booking.discount_amount ?? 0
    );

    const total = Number(
      booking.total_amount ??
      Math.max(0, subtotal - discountAmount)
    );

    const deposit = Number(
      booking.deposit_amount ?? 0
    );

    const paid = Number(
      booking.paid_amount ?? 0
    );

    // Remaining deposit to pay now
    const remainingDeposit = Math.max(
      0,
      deposit - paid
    );

    // Actual remaining balance
    const remainingBalance = Math.max(
      0,
      total - paid
    );

    // Balance after the required deposit is fully paid
    const balanceAfterDeposit = Math.max(
      0,
      total - Math.max(paid, deposit)
    );

    // --------------------------------------------------------
    // BOOKING STATUS
    // --------------------------------------------------------

    const isFreeBooking =
      total === 0 &&
      booking.status === 'confirmed';

    const isDepositPaid =
      remainingDeposit === 0 &&
      deposit > 0;

    const isCancelled = [
      'cancelled',
      'expired',
      'rejected'
    ].includes(booking.status);

    const isCompleted =
      booking.status === 'completed';

    const canPay =
      !isFreeBooking &&
      !isDepositPaid &&
      !isCancelled &&
      !isCompleted &&
      remainingDeposit > 0;

    // --------------------------------------------------------
    // HTML
    // --------------------------------------------------------

    container.innerHTML = `
      <div class="nil-checkout-grid">

        <!-- APPOINTMENT DETAILS -->
        <section class="nil-checkout-card">

          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">✦</div>

            <div>
              <span class="nil-checkout-eyebrow">
                APPOINTMENT DETAILS
              </span>

              <h2>
                ${t('جزئیات نوبت', 'Appointment details')}
              </h2>
            </div>
          </div>

          <!-- BOOKING NUMBER -->
          <div class="nil-checkout-booking-number">
            <span>
              ${t('شماره رزرو', 'Booking number')}
            </span>

            <strong>
              #${faDigits(booking.id)}
            </strong>
          </div>

          <!-- DATE AND TIME -->
          <div class="nil-checkout-info">

            <div class="nil-checkout-info-item">
              <span>
                ${t('تاریخ نوبت', 'Appointment date')}
              </span>

              <strong>
                ${formatDate(booking.booking_date)}
              </strong>
            </div>

            <div class="nil-checkout-info-item">
              <span>
                ${t('ساعت شروع', 'Start time')}
              </span>

              <strong>
                ${escapeHtml(
                  String(booking.start_time || '').slice(0, 5)
                )}
              </strong>
            </div>

            <div class="nil-checkout-info-item">
              <span>
                ${t('ساعت پایان', 'End time')}
              </span>

              <strong>
                ${escapeHtml(
                  String(booking.end_time || '').slice(0, 5)
                )}
              </strong>
            </div>

            <div class="nil-checkout-info-item">
              <span>
                ${t('وضعیت رزرو', 'Booking status')}
              </span>

              <strong>
                ${escapeHtml(booking.status || '-')}
              </strong>
            </div>

          </div>

          <div class="nil-checkout-divider"></div>

          <!-- SERVICES -->
          <h3 class="nil-checkout-subtitle">
            ${t('خدمات انتخاب‌شده', 'Selected services')}
          </h3>

          <div class="nil-checkout-services">

            ${services.length ? services.map((item) => `
              <div class="nil-checkout-service">

                <div>
                  <strong>
                    ${escapeHtml(
                      item.service?.name ||
                      item.service_name ||
                      item.name ||
                      t('خدمت زیبایی', 'Beauty service')
                    )}
                  </strong>

                  <small>
                    ${faDigits(
                      item.duration ||
                      item.service?.duration ||
                      0
                    )}
                    ${t('دقیقه', 'min')}
                  </small>
                </div>

                <span>
                  ${formatPrice(item.price)}
                  ${t('تومان', 'Toman')}
                </span>

              </div>
            `).join('') : `
              <p class="nil-checkout-muted">
                ${t(
                  'اطلاعات خدمات موجود نیست.',
                  'Service details unavailable.'
                )}
              </p>
            `}

          </div>

        </section>

        <!-- PAYMENT SUMMARY -->
        <aside class="nil-checkout-card nil-checkout-payment">

          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">◈</div>

            <div>
              <span class="nil-checkout-eyebrow">
                PAYMENT SUMMARY
              </span>

              <h2>
                ${t('خلاصه پرداخت', 'Payment summary')}
              </h2>
            </div>
          </div>

          <!-- SUBTOTAL -->
          <div class="nil-checkout-price-row">
            <span>
              ${t('مبلغ کل خدمات', 'Services total')}
            </span>

            <strong>
              ${formatPrice(subtotal)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>

          <!-- DISCOUNT -->
          ${discountAmount > 0 ? `
            <div class="nil-checkout-price-row">
              <span>
                ${t('تخفیف ثبت‌شده', 'Applied discount')}
              </span>

              <strong>
                − ${formatPrice(discountAmount)}
                ${t('تومان', 'Toman')}
              </strong>
            </div>
          ` : ''}

          <!-- FINAL TOTAL -->
          <div class="nil-checkout-price-row">
            <span>
              ${t(
                'مبلغ نهایی پس از تخفیف',
                'Final total after discount'
              )}
            </span>

            <strong>
              ${formatPrice(total)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>

          <div class="nil-checkout-divider"></div>

          <!-- DEPOSIT -->
          <div class="nil-checkout-price-row">
            <span>
              ${t('بیعانه رزرو', 'Booking deposit')}
            </span>

            <strong>
              ${formatPrice(deposit)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>

          <!-- PAID -->
          <div class="nil-checkout-price-row">
            <span>
              ${t('پرداخت‌شده', 'Already paid')}
            </span>

            <strong>
              ${formatPrice(paid)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>

          <!-- CURRENT REMAINING -->
          <div class="nil-checkout-price-row">
            <span>
              ${t(
                'مانده کل در حال حاضر',
                'Current outstanding balance'
              )}
            </span>

            <strong>
              ${formatPrice(remainingBalance)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>

          <!-- AFTER DEPOSIT -->
          <div class="nil-checkout-price-row">
            <span>
              ${t(
                'مانده پس از پرداخت بیعانه',
                'Balance after deposit'
              )}
            </span>

            <strong>
              ${formatPrice(balanceAfterDeposit)}
              ${t('تومان', 'Toman')}
            </strong>
          </div>

          <!-- DEPOSIT DUE -->
          <div class="nil-checkout-total">
            <span>
              ${t('بیعانه قابل پرداخت', 'Deposit due')}
            </span>

            <div>
              <strong>
                ${formatPrice(remainingDeposit)}
              </strong>

              <small>
                ${t('تومان', 'Toman')}
              </small>
            </div>
          </div>

          <!-- FREE BOOKING -->
          ${isFreeBooking ? `
            <div class="nil-checkout-success">
              ✓ ${t(
                'رزرو با تخفیف کامل و بدون پرداخت تأیید شده است.',
                'Booking confirmed with a full discount. No payment required.'
              )}
            </div>
          ` : ''}

          <!-- PAID DEPOSIT -->
          ${isDepositPaid && !isFreeBooking ? `
            <div class="nil-checkout-success">
              ✓ ${t(
                'بیعانه پرداخت شده است.',
                'Deposit has been paid.'
              )}
            </div>
          ` : ''}

          <!-- CANCELLED -->
          ${isCancelled ? `
            <div class="nil-checkout-warning">
              ${t(
                'این رزرو قابل پرداخت نیست.',
                'This booking cannot be paid.'
              )}
            </div>
          ` : ''}

          <!-- PAYMENT BUTTON -->
          ${canPay ? `
            <button
              type="button"
              class="nil-checkout-button"
              data-checkout-pay
            >
              <span>
                ${t('پرداخت بیعانه', 'Pay deposit')}
              </span>

              <span>
                ${isFa ? '←' : '→'}
              </span>
            </button>

            <p class="nil-checkout-secure">
              ◈ ${t(
                'پرداخت از طریق درگاه امن بانکی',
                'Secure payment through banking gateway'
              )}
            </p>
          ` : ''}

          <!-- PAYMENT ERROR -->
          <p
            class="nil-checkout-error"
            data-payment-error
            hidden
          ></p>

          <!-- NOTE -->
          <div class="nil-checkout-note">
            <strong>
              ✦ ${t('نکته مهم', 'Important note')}
            </strong>

            <p>
              ${t(
                'کد تخفیف هنگام ثبت نوبت اعمال می‌شود. مبالغ این صفحه از سرور دریافت شده‌اند.',
                'Discounts are applied when creating the booking. Amounts on this page come from the server.'
              )}
            </p>
          </div>

        </aside>

      </div>
    `;

    // Payment button event
    $('[data-checkout-pay]')?.addEventListener(
      'click',
      startPayment
    );
  }

  // ==========================================================
  // START PAYMENT
  // ==========================================================

  async function startPayment() {
    if (processing || !booking) return;

    processing = true;

    const button = $('[data-checkout-pay]');
    const errorBox = $('[data-payment-error]');

    if (button) {
      button.disabled = true;

      button.textContent = t(
        'در حال اتصال به درگاه...',
        'Connecting to payment gateway...'
      );
    }

    if (errorBox) {
      errorBox.hidden = true;
    }

    try {
      // Only the backend determines the payable amount.
      const response = await paymentsApi.start(booking.id);

      const paymentUrl = extractPaymentUrl(response);

      if (!paymentUrl) {
        throw new Error(
          t(
            'آدرس درگاه پرداخت در پاسخ سرور وجود ندارد.',
            'Payment gateway URL is missing from the server response.'
          )
        );
      }

      // Redirect to payment gateway
      window.location.assign(paymentUrl);

    } catch (error) {
      console.error('Payment error:', error);

      if (errorBox) {
        errorBox.textContent =
          error.message ||
          t('خطا در پرداخت', 'Payment failed');

        errorBox.hidden = false;
      }

      if (button) {
        button.disabled = false;

        button.innerHTML = `
          <span>
            ${t(
              'تلاش مجدد برای پرداخت',
              'Retry payment'
            )}
          </span>

          <span>
            ${isFa ? '←' : '→'}
          </span>
        `;
      }

      processing = false;
    }
  }

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  await loadBooking();
}
