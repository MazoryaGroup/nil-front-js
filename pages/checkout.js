// ============================================
// Checkout Page - پرداخت
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { isLoggedIn, getUser } from '../code/auth.js';
import { apiGet, apiPost, bookingsApi, paymentsApi, servicesApi } from '../code/api.js';
import { formatDate, formatPrice } from '../code/utils.js';

export async function CheckoutPage(params = {}) {
  if (!isLoggedIn()) {
    setTimeout(() => window.__app?.router?.navigate('/login'), 100);
    return Layout(`<div class="loading-placeholder">در حال انتقال...</div>`);
  }

  const isFa = getCurrentLang() === 'fa';
  const query = params.query || {};
  const bookingId = query.booking;   // ← از URL: /checkout?booking=28

  const html = Layout(`
    <div class="checkout-page">
      <div class="w-layout-blockcontainer container w-container">

        <div class="checkout-header">
          <h1>${isFa ? 'پرداخت' : 'Checkout'}</h1>
          <p>${isFa ? 'اطلاعات رزرو را تایید کن و پرداخت کن' : 'Confirm your booking and complete payment'}</p>
        </div>

        <div class="checkout-grid">

          <!-- سمت چپ -->
          <div class="checkout-main">

            <!-- خلاصه رزرو -->
            <div class="checkout-card">
              <h2>${isFa ? 'خلاصه رزرو' : 'Booking Summary'}</h2>
              <div class="checkout-info" data-booking-info>
                <div class="loading-placeholder">${t('common.loading')}</div>
              </div>
            </div>

            <!-- روش پرداخت -->
            <div class="checkout-card">
              <h2>${isFa ? 'روش پرداخت' : 'Payment Method'}</h2>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" name="payment" value="online" checked />
                  <span>${isFa ? 'پرداخت آنلاین (بیعانه)' : 'Online Payment (Deposit)'}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="payment" value="cash" />
                  <span>${isFa ? 'پرداخت در محل' : 'Pay on Site'}</span>
                </label>
              </div>
            </div>

          </div>

          <!-- سمت راست -->
          <div class="checkout-sidebar">
            <div class="checkout-card sticky">
              <h2>${isFa ? 'جمع کل' : 'Total'}</h2>

              <div class="total-row">
                <span>${isFa ? 'مبلغ کل' : 'Total Amount'}</span>
                <strong data-total-price>—</strong>
              </div>

              <div class="total-row">
                <span>${isFa ? 'بیعانه' : 'Deposit'}</span>
                <strong data-deposit-amount>—</strong>
              </div>

              <div class="total-row">
                <span>${isFa ? 'پرداخت شده' : 'Paid'}</span>
                <strong data-paid-amount>—</strong>
              </div>

              <div class="total-row grand">
                <span>${isFa ? 'قابل پرداخت' : 'Payable'}</span>
                <strong data-total-final>—</strong>
              </div>

              <button class="primary-button w-button full-width" data-pay-btn>
                ${isFa ? 'پرداخت' : 'Pay Now'}
              </button>

              <div class="form-message" data-checkout-msg></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    initLayout();
    initCheckout({ bookingId, isFa });
  }, 100);

  return html;
}

// ============================================
// منطق چک‌اوت
// ============================================
function initCheckout({ bookingId, isFa }) {
  let booking = null;

  const infoEl = document.querySelector('[data-booking-info]');
  const priceEl = document.querySelector('[data-total-price]');
  const depositEl = document.querySelector('[data-deposit-amount]');
  const paidEl = document.querySelector('[data-paid-amount]');
  const finalEl = document.querySelector('[data-total-final]');
  const msg = document.querySelector('[data-checkout-msg]');
  const payBtn = document.querySelector('[data-pay-btn]');

  // ============================================
  // لود اطلاعات نوبت
  // ============================================
  loadBooking();

  async function loadBooking() {
    if (!bookingId) {
      infoEl.innerHTML = `<p class="text-danger">${isFa ? 'شناسه نوبت یافت نشد' : 'Booking ID not found'}</p>`;
      return;
    }

    try {
      const res = await bookingsApi.get(bookingId);
      console.log('📋 Booking details:', res);

      booking = res?.data || {};

      renderBookingInfo(booking);

    } catch (err) {
      console.error('❌ Booking load error:', err);
      infoEl.innerHTML = `<p class="text-danger">${isFa ? 'خطا در بارگذاری نوبت' : 'Failed to load booking'}</p>`;
    }
  }

  // ============================================
  // نمایش اطلاعات
  // ============================================
  function renderBookingInfo(b) {
    const serviceNames = (b.booking_services || [])
      .map(bs => bs.service?.name || '—')
      .join(', ') || '—';

    const staffName = b.booking_services?.[0]?.staff?.name || '—';

    infoEl.innerHTML = `
      <div class="info-row">
        <span>${isFa ? 'کد رزرو' : 'Booking ID'}</span>
        <strong>#${b.id}</strong>
      </div>
      <div class="info-row">
        <span>${isFa ? 'خدمت' : 'Service'}</span>
        <strong>${serviceNames}</strong>
      </div>
      <div class="info-row">
        <span>${isFa ? 'کارمند' : 'Staff'}</span>
        <strong>${staffName}</strong>
      </div>
      <div class="info-row">
        <span>${isFa ? 'تاریخ' : 'Date'}</span>
        <strong>${formatDate(b.booking_date, isFa)}</strong>
      </div>
      <div class="info-row">
        <span>${isFa ? 'ساعت' : 'Time'}</span>
        <strong>${b.start_time?.slice(0, 5) || '—'} - ${b.end_time?.slice(0, 5) || '—'}</strong>
      </div>
      <div class="info-row">
        <span>${isFa ? 'وضعیت' : 'Status'}</span>
        <strong>${getStatusLabel(b.status)}</strong>
      </div>
    `;

    // قیمت‌ها
    const total = Number(b.total_amount || 0);
    const deposit = Number(b.deposit_amount || 0);
    const paid = Number(b.paid_amount || 0);
    const payable = Math.max(0, total - paid);

    priceEl.textContent = formatPrice(total, isFa);
    depositEl.textContent = formatPrice(deposit, isFa);
    paidEl.textContent = formatPrice(paid, isFa);
    finalEl.textContent = formatPrice(payable, isFa);

    // اگه کامل پرداخت شده
    if (payable === 0) {
      payBtn.disabled = true;
      payBtn.textContent = isFa ? 'پرداخت شده ✓' : 'Already Paid ✓';
      showMsg(msg, isFa ? 'این نوبت قبلاً پرداخت شده' : 'This booking is already paid', 'success');
    }
  }

  function getStatusLabel(status) {
    const map = {
      'confirmed': isFa ? 'تایید شده' : 'Confirmed',
      'pending': isFa ? 'در انتظار' : 'Pending',
      'cancelled': isFa ? 'لغو شده' : 'Cancelled',
      'awaiting_payment': isFa ? 'در انتظار پرداخت' : 'Awaiting Payment'
    };
    return map[status] || status;
  }

  // ============================================
  // دکمه پرداخت
  // ============================================
  payBtn?.addEventListener('click', async () => {
    if (!booking) {
      showMsg(msg, isFa ? 'اطلاعات نوبت یافت نشد' : 'Booking not found', 'error');
      return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'online';

    setLoading(payBtn, true);
    showMsg(msg, isFa ? 'در حال پردازش...' : 'Processing...', 'info');

    try {
      if (paymentMethod === 'online') {
        // ✅ پرداخت آنلاین بیعانه
        const res = await paymentsApi.deposit(booking.id);
        console.log('💳 Deposit response:', res);

        const paymentUrl = res?.data?.payment_url || res?.data?.url || res?.payment_url;

        if (paymentUrl) {
          showMsg(msg, isFa ? 'در حال انتقال به درگاه...' : 'Redirecting to gateway...', 'success');
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 800);
        } else {
          throw new Error(isFa ? 'لینک پرداخت دریافت نشد' : 'Payment URL not received');
        }

      } else {
        // ✅ پرداخت در محل - فقط رزرو بمونه
        showMsg(msg, isFa ? 'نوبت ثبت شد. پرداخت در محل انجام می‌شود.' : 'Booked. Pay on site.', 'success');
        setTimeout(() => {
          window.__app?.router?.navigate('/dashboard');
        }, 1500);
      }

    } catch (err) {
      console.error('❌ Payment error:', err);
      showMsg(msg, err.message || (isFa ? 'خطا در پرداخت' : 'Payment error'), 'error');
    } finally {
      setLoading(payBtn, false);
    }
  });

  // ============================================
  // Helpers
  // ============================================
  function showMsg(el, text, type = 'info') {
    if (!el) return;
    el.textContent = text;
    el.style.display = text ? 'block' : 'none';
    el.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#666';
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = isFa ? 'لطفاً صبر کنید...' : 'Please wait...';
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
    }
  }
}