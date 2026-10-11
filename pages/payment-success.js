
import { Layout, initLayout } from '../components/Layout.js';
import { getCurrentLang } from '../code/i18n.js';
import { apiGet } from '../code/api.js';
import '../asset/css/payment-result.css';

const escapeHtml = (value = '') => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getBookingId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('booking_id');
};

export async function PaymentSuccessPage() {
  const isFa = getCurrentLang() === 'fa';
  const bookingId = getBookingId();

  const html = Layout(`
    <main class="nil-payment-page" dir="${isFa ? 'rtl' : 'ltr'}">
      <div class="nil-payment-container">

        <div class="nil-payment-card">

          <div class="nil-payment-icon success">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="28"
                stroke="currentColor" stroke-width="2"/>
              <path d="M19 33L28 42L46 23"
                stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <span class="nil-payment-label">NIL BEAUTY</span>

          <h1>
            ${isFa ? 'در حال بررسی پرداخت...' : 'Verifying Payment...'}
          </h1>

          <p class="nil-payment-description" data-payment-description>
            ${isFa
              ? 'لطفاً چند لحظه منتظر بمانید تا وضعیت پرداخت بررسی شود.'
              : 'Please wait while we verify your payment.'}
          </p>

          <div class="nil-payment-details" data-payment-details hidden></div>

          <div class="nil-payment-actions">
            <a href="/bookings" data-nav-link class="nil-payment-btn primary">
              ${isFa ? 'نوبت‌های من' : 'My Bookings'}
            </a>

            <a href="/" data-nav-link class="nil-payment-btn secondary">
              ${isFa ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
            </a>
          </div>

        </div>

        <p class="nil-payment-footer">
          NIL BEAUTY · ${isFa ? 'زیبایی در جزئیات است' : 'Beauty in every detail'}
        </p>

      </div>
    </main>
  `);

  setTimeout(() => {
    initLayout();

    const root = document.querySelector('.nil-payment-page');
    if (root) verifyBookingPayment(root, bookingId, isFa);
  }, 100);

  return html;
}

async function verifyBookingPayment(root, bookingId, isFa) {
  const title = root.querySelector('h1');
  const description = root.querySelector('[data-payment-description]');
  const details = root.querySelector('[data-payment-details]');

  if (!bookingId) {
    title.textContent = isFa ? 'وضعیت پرداخت نامشخص است' : 'Payment Status Unknown';
    description.textContent = isFa
      ? 'شناسه نوبت در آدرس موجود نیست. لطفاً وضعیت را در نوبت‌های خود بررسی کنید.'
      : 'Booking ID is missing. Please check your bookings.';
    return;
  }

  try {
    // The booking endpoint must return the current saved payment status.
    const response = await apiGet(
      `/v1/bookings/${encodeURIComponent(bookingId)}`
    );

    if (!root.isConnected) return;

    const booking = response?.data?.booking ||
      response?.data ||
      response?.booking ||
      response;

    const paymentStatus = String(booking?.payment_status || '').toLowerCase();

    const paid = ['paid', 'completed', 'success', 'successful']
      .includes(paymentStatus);

    if (!paid) {
      title.textContent = isFa ? 'پرداخت هنوز تأیید نشده' : 'Payment Not Confirmed';

      description.textContent = isFa
        ? 'هنوز پرداخت موفقی برای این نوبت ثبت نشده است. وضعیت نوبت را بررسی کنید.'
        : 'A successful payment has not been recorded for this booking.';

      return;
    }

    title.textContent = isFa ? 'پرداخت موفق!' : 'Payment Successful!';

    description.textContent = isFa
      ? 'بیعانه نوبت شما با موفقیت پرداخت و ثبت شد.'
      : 'Your booking deposit has been successfully paid.';

    details.hidden = false;
    details.innerHTML = `
      <div class="nil-payment-detail-row">
        <span>${isFa ? 'شماره نوبت' : 'Booking Number'}</span>
        <strong>#${escapeHtml(booking.id || bookingId)}</strong>
      </div>

      <div class="nil-payment-detail-row">
        <span>${isFa ? 'وضعیت پرداخت' : 'Payment Status'}</span>
        <strong class="nil-payment-success-text">
          ${isFa ? 'پرداخت شده' : 'Paid'}
        </strong>
      </div>

      ${booking.booking_date ? `
        <div class="nil-payment-detail-row">
          <span>${isFa ? 'تاریخ نوبت' : 'Booking Date'}</span>
          <strong>${escapeHtml(booking.booking_date)}</strong>
        </div>
      ` : ''}
    `;

  } catch (error) {
    if (!root.isConnected) return;

    console.error('Payment verification display:', error);

    title.textContent = isFa ? 'خطا در بررسی پرداخت' : 'Verification Error';
    description.textContent = isFa
      ? 'امکان دریافت وضعیت پرداخت وجود ندارد. لطفاً نوبت‌های خود را بررسی کنید.'
      : 'Unable to retrieve payment status. Please check your bookings.';
  }
}
