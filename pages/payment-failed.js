
import { Layout, initLayout } from '../components/Layout.js';
import { getCurrentLang } from '../code/i18n.js';
import '../asset/css/payment-result.css';

export async function PaymentFailedPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <main class="nil-payment-page" dir="${isFa ? 'rtl' : 'ltr'}">
      <div class="nil-payment-container">

        <div class="nil-payment-card">

          <div class="nil-payment-icon failed">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="28"
                stroke="currentColor" stroke-width="2"/>
              <path d="M23 23L41 41M41 23L23 41"
                stroke="currentColor" stroke-width="3"
                stroke-linecap="round"/>
            </svg>
          </div>

          <span class="nil-payment-label">NIL BEAUTY</span>

          <h1>
            ${isFa ? 'پرداخت ناموفق' : 'Payment Failed'}
          </h1>

          <p class="nil-payment-description">
            ${isFa
              ? 'پرداخت شما انجام نشد یا فرایند پرداخت لغو شد. در صورت کسر وجه، وضعیت تراکنش را از بانک یا درگاه پیگیری کنید.'
              : 'Your payment was not completed or was cancelled. If money was deducted, check the transaction with your bank or payment provider.'}
          </p>

          <div class="nil-payment-notice">
            <span class="nil-payment-notice-icon">!</span>
            <p>
              ${isFa
                ? 'برای اطمینان از وضعیت نوبت، ابتدا نوبت‌های خود را بررسی کنید. در صورت نیاز می‌توانید دوباره برای پرداخت اقدام کنید.'
                : 'Please check your booking status first. You may try paying again if needed.'}
            </p>
          </div>

          <div class="nil-payment-actions">
            <a href="/bookings" data-nav-link class="nil-payment-btn primary">
              ${isFa ? 'بررسی نوبت‌ها' : 'Check My Bookings'}
            </a>

            <a href="/" data-nav-link class="nil-payment-btn secondary">
              ${isFa ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
            </a>
          </div>

        </div>

        <p class="nil-payment-footer">
          NIL BEAUTY · ${isFa ? 'همراه شما هستیم' : 'We are here for you'}
        </p>

      </div>
    </main>
  `);

  setTimeout(() => initLayout(), 100);

  return html;
}
