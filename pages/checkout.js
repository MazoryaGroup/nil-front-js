
import { Layout, initLayout } from '../components/Layout.js';
import { getCurrentLang } from '../code/i18n.js';
import { isLoggedIn } from '../code/auth.js';
import { bookingsApi, paymentsApi, apiPost } from '../code/api.js';
import '../asset/css/custom.css';


// Replace with the actual Laravel route bound to DiscountCodeController@validateCode.
const DISCOUNT_VALIDATE_ENDPOINT = '/v1/discount-codes/validate';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const formatPrice = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));
const faDigits = (value) => String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
  }).format(date);
}

function extractBooking(response) {
  return response?.data?.booking || response?.data || response?.booking || null;
}

function extractPaymentUrl(response) {
  const candidates = [
    response?.data?.payment_url, response?.data?.gateway_url,
    response?.data?.url, response?.payment_url,
    response?.gateway_url, response?.url
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === 'https:') return url.href;
    } catch { /* Invalid URL */ }
  }
  return null;
}

export function CheckoutPage() {
  const isFa = getCurrentLang() === 'fa';
  const t = (fa, en) => isFa ? fa : en;

  if (!isLoggedIn()) {
    queueMicrotask(() => window.__app?.router?.navigate('/login'));
    return Layout(`<div class="nil-checkout-loading">${t('در حال انتقال به ورود...', 'Redirecting to login...')}</div>`);
  }

  const html = Layout(`
    <main class="nil-checkout" dir="${isFa ? 'rtl' : 'ltr'}" data-nil-checkout>
      <div class="nil-checkout-container">
        <header class="nil-checkout-header">
          <button type="button" class="nil-checkout-back" data-checkout-back>
            ${isFa ? '→' : '←'} ${t('بازگشت به داشبورد', 'Back to dashboard')}
          </button>
          <div class="nil-checkout-brand">
            <span class="nil-checkout-logo">N</span><span>NIL BEAUTY</span>
          </div>
        </header>
        <section class="nil-checkout-heading">
          <span class="nil-checkout-eyebrow">SECURE CHECKOUT</span>
          <h1>${t('تکمیل رزرو', 'Complete your booking')}</h1>
          <p>${t('اطلاعات نوبتت رو بررسی کن و برای تکمیل رزرو بیعانه رو پرداخت کن.', 'Review your appointment and pay the deposit to complete your booking.')}</p>
        </section>
        <div data-checkout-content>
          <div class="nil-checkout-loading">
            <div class="nil-checkout-spinner"></div>
            ${t('در حال دریافت اطلاعات رزرو...', 'Loading booking details...')}
          </div>
        </div>
        <footer class="nil-checkout-footer">
          <span>✦ NIL BEAUTY STUDIO</span>
          <span>${t('رزرو آنلاین خدمات زیبایی', 'Online beauty booking')}</span>
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

async function initCheckout(root, isFa) {
  const $ = (selector) => root.querySelector(selector);
  const t = (fa, en) => isFa ? fa : en;
  const container = $('[data-checkout-content]');
  const bookingId = new URLSearchParams(window.location.search).get('booking');

  let booking = null;
  let processing = false;
  let applyingDiscount = false;
  let discountPreview = null;

  $('[data-checkout-back]').addEventListener('click', () => {
    window.__app?.router?.navigate('/dashboard');
  });

  function showError(message, allowRetry = false) {
    container.innerHTML = `
      <div class="nil-checkout-state">
        <div class="nil-checkout-state-icon">!</div>
        <h2>${t('مشکلی پیش آمد', 'Something went wrong')}</h2>
        <p>${escapeHtml(message)}</p>
        ${allowRetry ? `<button type="button" class="nil-checkout-button" data-checkout-retry>${t('تلاش مجدد', 'Try again')}</button>` : ''}
      </div>
    `;
    $('[data-checkout-retry]')?.addEventListener('click', loadBooking);
  }

  async function loadBooking() {
    if (!bookingId || !/^\d+$/.test(bookingId)) {
      showError(t('شناسه رزرو معتبر نیست.', 'Invalid booking ID.'));
      return;
    }

    container.innerHTML = `
      <div class="nil-checkout-loading">
        <div class="nil-checkout-spinner"></div>
        ${t('در حال دریافت اطلاعات رزرو...', 'Loading booking details...')}
      </div>
    `;

    try {
      const response = await bookingsApi.get(bookingId);
      booking = extractBooking(response);
      if (!booking || typeof booking !== 'object' || !booking.id) {
        throw new Error(t('اطلاعات رزرو دریافت نشد.', 'Booking details not found.'));
      }
      discountPreview = null;
      renderBooking();
    } catch (error) {
      console.error('Checkout booking error:', error);
      showError(error.message, true);
    }
  }

  function renderBooking() {
    const services = booking.booking_services || booking.services || [];
    const total = Number(booking.subtotal ?? booking.total_amount ?? 0);
    const deposit = Number(booking.deposit_amount ?? 0);
    const paid = Number(booking.paid_amount ?? 0);
    const discountCode = booking.discount_code ?? booking.coupon_code ?? booking.discount?.code ?? null;
    const discountAmount = Number(booking.discount_amount ?? booking.discount?.amount ?? 0);
    const remainingDeposit = Math.max(0, deposit - paid);
    const isPaid = booking.payment_status === 'paid' || (remainingDeposit === 0 && deposit > 0);
    const isCancelled = ['cancelled', 'expired', 'rejected'].includes(booking.status);
    const isCompleted = booking.status === 'completed';
    const canPay = !isPaid && !isCancelled && !isCompleted && remainingDeposit > 0;

    container.innerHTML = `
      <div class="nil-checkout-grid">
        <section class="nil-checkout-card">
          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">✦</div>
            <div>
              <span class="nil-checkout-eyebrow">APPOINTMENT DETAILS</span>
              <h2>${t('جزئیات نوبت', 'Appointment details')}</h2>
            </div>
          </div>
          <div class="nil-checkout-booking-number">
            <span>${t('شماره رزرو', 'Booking number')}</span>
            <strong>#${faDigits(booking.id)}</strong>
          </div>
          <div class="nil-checkout-info">
            <div class="nil-checkout-info-item">
              <span>${t('تاریخ نوبت', 'Appointment date')}</span>
              <strong>${formatDate(booking.booking_date)}</strong>
            </div>
            <div class="nil-checkout-info-item">
              <span>${t('ساعت شروع', 'Start time')}</span>
              <strong>${escapeHtml(String(booking.start_time || '').slice(0, 5))}</strong>
            </div>
            <div class="nil-checkout-info-item">
              <span>${t('ساعت پایان', 'End time')}</span>
              <strong>${escapeHtml(String(booking.end_time || '').slice(0, 5))}</strong>
            </div>
            <div class="nil-checkout-info-item">
              <span>${t('وضعیت رزرو', 'Booking status')}</span>
              <strong>${escapeHtml(booking.status || '-')}</strong>
            </div>
          </div>
          <div class="nil-checkout-divider"></div>
          <h3 class="nil-checkout-subtitle">${t('خدمات انتخاب‌شده', 'Selected services')}</h3>
          <div class="nil-checkout-services">
            ${services.length ? services.map((item) => `
              <div class="nil-checkout-service">
                <div>
                  <strong>${escapeHtml(item.service?.name || item.service_name || item.name || t('خدمت زیبایی', 'Beauty service'))}</strong>
                  <small>${faDigits(item.duration || item.service?.duration || 0)} ${t('دقیقه', 'min')}</small>
                </div>
                <span>${formatPrice(item.price)} ${t('تومان', 'Toman')}</span>
              </div>
            `).join('') : `<p class="nil-checkout-muted">${t('اطلاعات خدمات موجود نیست.', 'Service details unavailable.')}</p>`}
          </div>
        </section>

        <aside class="nil-checkout-card nil-checkout-payment">
          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">◈</div>
            <div>
              <span class="nil-checkout-eyebrow">PAYMENT SUMMARY</span>
              <h2>${t('خلاصه پرداخت', 'Payment summary')}</h2>
            </div>
          </div>
          <div class="nil-checkout-price-row">
            <span>${t('مبلغ کل خدمات', 'Services total')}</span>
            <strong>${formatPrice(total)} ${t('تومان', 'Toman')}</strong>
          </div>
          <div class="nil-checkout-price-row">
            <span>${t('بیعانه رزرو', 'Booking deposit')}</span>
            <strong>${formatPrice(deposit)} ${t('تومان', 'Toman')}</strong>
          </div>
          <div class="nil-checkout-price-row">
            <span>${t('پرداخت‌شده', 'Already paid')}</span>
            <strong>${formatPrice(paid)} ${t('تومان', 'Toman')}</strong>
          </div>
          <div class="nil-checkout-divider"></div>

          ${canPay ? `
            <div class="nil-checkout-discount">
              <label for="nil-discount-code">${t('کد تخفیف داری؟', 'Have a discount code?')}</label>
              <div class="nil-discount-input-group">
                <input id="nil-discount-code" class="nil-discount-input" type="text"
                  maxlength="100" autocomplete="off"
                  value="${escapeHtml(discountCode || '')}"
                  placeholder="${t('کد تخفیف را وارد کنید', 'Enter discount code')}" />
                <button type="button" class="nil-discount-button" data-discount-apply>
                  ${t('بررسی کد', 'Check code')}
                </button>
              </div>
              <p class="nil-discount-message" data-discount-message role="status" aria-live="polite"></p>
            </div>
          ` : ''}

          ${discountAmount > 0 ? `
            <div class="nil-checkout-price-row">
              <span>${t('تخفیف ثبت‌شده', 'Saved discount')}${discountCode ? ` (${escapeHtml(discountCode)})` : ''}</span>
              <strong>− ${formatPrice(discountAmount)} ${t('تومان', 'Toman')}</strong>
            </div>
          ` : ''}

          <div data-discount-preview></div>
          <div class="nil-checkout-total">
            <span>${t('بیعانه قابل پرداخت', 'Deposit due')}</span>
            <div><strong>${formatPrice(remainingDeposit)}</strong><small>${t('تومان', 'Toman')}</small></div>
          </div>

          ${isPaid ? `<div class="nil-checkout-success">✓ ${t('بیعانه پرداخت شده است.', 'Deposit has been paid.')}</div>` : ''}
          ${isCancelled ? `<div class="nil-checkout-warning">${t('این رزرو قابل پرداخت نیست.', 'This booking cannot be paid.')}</div>` : ''}
          ${canPay ? `
            <button type="button" class="nil-checkout-button" data-checkout-pay>
              <span>${t('پرداخت بیعانه', 'Pay deposit')}</span><span>${isFa ? '←' : '→'}</span>
            </button>
            <p class="nil-checkout-secure">◈ ${t('پرداخت از طریق درگاه امن بانکی', 'Secure payment through banking gateway')}</p>
          ` : ''}
          <p class="nil-checkout-error" data-payment-error hidden></p>
          <div class="nil-checkout-note">
            <strong>✦ ${t('نکته مهم', 'Important note')}</strong>
            <p>${t('کد تخفیف ابتدا بررسی می‌شود. مبلغ واقعی پرداخت فقط توسط سرور تعیین می‌شود.', 'Discount codes are validated first. The server determines the actual payment amount.')}</p>
          </div>
        </aside>
      </div>
    `;

    $('[data-checkout-pay]')?.addEventListener('click', startPayment);
    $('[data-discount-apply]')?.addEventListener('click', applyDiscount);
    $('#nil-discount-code')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyDiscount();
      }
    });
    $('#nil-discount-code')?.addEventListener('input', () => {
      discountPreview = null;
      renderDiscountPreview();
      const message = $('[data-discount-message]');
      if (message) message.textContent = '';
    });
    renderDiscountPreview();
  }

  function renderDiscountPreview() {
    const element = $('[data-discount-preview]');
    if (!element) return;
    if (!discountPreview) {
      element.innerHTML = '';
      return;
    }
    element.innerHTML = `
      <div class="nil-checkout-divider"></div>
      <div class="nil-checkout-price-row">
        <span>${t('تخفیف پیشنهادی', 'Validated discount')}</span>
        <strong>− ${formatPrice(discountPreview.discount_amount)} ${t('تومان', 'Toman')}</strong>
      </div>
      <div class="nil-checkout-price-row">
        <span>${t('جمع خدمات پس از تخفیف (پیش‌نمایش)', 'Services total after discount (preview)')}</span>
        <strong>${formatPrice(discountPreview.final_amount)} ${t('تومان', 'Toman')}</strong>
      </div>
      <p class="nil-checkout-muted">
        ${t('این مبلغ فقط پیش‌نمایش است؛ تخفیف هنوز برای پرداخت ثبت نشده است.', 'Preview only: the discount has not been saved for payment.')}
      </p>
    `;
  }

  async function applyDiscount() {
    if (applyingDiscount || processing || !booking) return;
    const input = $('#nil-discount-code');
    const button = $('[data-discount-apply]');
    const message = $('[data-discount-message]');
    const code = input?.value.trim() || '';
    discountPreview = null;
    renderDiscountPreview();

    if (!code) {
      if (message) {
        message.textContent = t('کد تخفیف را وارد کن.', 'Enter a discount code.');
        message.classList.add('error');
      }
      return;
    }

    applyingDiscount = true;
    if (button) button.disabled = true;
    if (input) input.disabled = true;
    if (message) {
      message.classList.remove('error');
      message.textContent = t('در حال بررسی کد...', 'Checking discount code...');
    }

    try {
      const response = await bookingsApi.validateDiscount(
  booking.id,
  code
);
      if (!response?.data || response.success === false || response.is_status === false) {
        throw new Error(response?.message || t('کد معتبر نیست.', 'Invalid discount code.'));
      }
      const data = response.data;
      if (!Number.isFinite(Number(data.discount_amount)) || !Number.isFinite(Number(data.final_amount))) {
        throw new Error(t('مبلغ تخفیف در پاسخ سرور معتبر نیست.', 'Invalid discount totals in server response.'));
      }
      discountPreview = {
        code: String(data.code || code),
        discount_amount: Number(data.discount_amount),
        final_amount: Number(data.final_amount)
      };
      renderDiscountPreview();
      if (message?.isConnected) {
        message.textContent = t('کد معتبر است؛ مبلغ تخفیف در پیش‌نمایش نمایش داده شد.', 'Valid code. Discount shown as preview.');
        message.classList.remove('error');
      }
    } catch (error) {
      if (message?.isConnected) {
        message.textContent = error.message || t('خطا در بررسی کد تخفیف.', 'Could not validate discount.');
        message.classList.add('error');
      }
    } finally {
      applyingDiscount = false;
      if (button?.isConnected) button.disabled = false;
      if (input?.isConnected) input.disabled = false;
    }
  }

  async function startPayment() {
    if (processing || applyingDiscount || !booking) return;
    processing = true;
    const button = $('[data-checkout-pay]');
    const errorBox = $('[data-payment-error]');
    if (button) {
      button.disabled = true;
      button.textContent = t('در حال اتصال به درگاه...', 'Connecting to payment gateway...');
    }
    if (errorBox) errorBox.hidden = true;

    try {
      // The backend owns the payable amount; never send a client-calculated discount.
      const response = await paymentsApi.start(booking.id);
      const paymentUrl = extractPaymentUrl(response);
      if (!paymentUrl) {
        throw new Error(t('آدرس درگاه پرداخت در پاسخ سرور وجود ندارد.', 'Payment gateway URL is missing from the server response.'));
      }
      window.location.assign(paymentUrl);
    } catch (error) {
      console.error('Payment error:', error);
      if (errorBox) {
        errorBox.textContent = error.message;
        errorBox.hidden = false;
      }
      if (button) {
        button.disabled = false;
        button.innerHTML = `<span>${t('تلاش مجدد برای پرداخت', 'Retry payment')}</span><span>${isFa ? '←' : '→'}</span>`;
      }
      processing = false;
    }
  }

  await loadBooking();
}
