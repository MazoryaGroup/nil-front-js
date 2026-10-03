// ============================================
// Checkout Page - پرداخت
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { isLoggedIn, getUser } from '../code/auth.js';
import { apiPost } from '../code/api.js';

export async function CheckoutPage(params = {}) {
  if (!isLoggedIn()) {
    setTimeout(() => window.__app?.router?.navigate('/login'), 100);
    return Layout(`<div class="loading-placeholder">در حال انتقال...</div>`);
  }

  const isFa = getCurrentLang() === 'fa';
  const query = params.query || {};
  const serviceId = query.service;
  const date = query.date;
  const time = query.time;

  const html = Layout(`
    <div class="checkout-page">
      <div class="w-layout-blockcontainer container w-container">

        <div class="checkout-header">
          <h1>${isFa ? 'پرداخت' : 'Checkout'}</h1>
          <p>${isFa ? 'اطلاعات رزرو را تایید کن و پرداخت کن' : 'Confirm your booking and complete payment'}</p>
        </div>

        <div class="checkout-grid">

          <!-- سمت چپ: اطلاعات -->
          <div class="checkout-main">

            <!-- خلاصه رزرو -->
            <div class="checkout-card">
              <h2>${isFa ? 'خلاصه رزرو' : 'Booking Summary'}</h2>
              <div class="checkout-info" data-booking-info>
                <div class="loading-placeholder">${t('common.loading')}</div>
              </div>
            </div>

            <!-- اطلاعات تماس -->
            <div class="checkout-card">
              <h2>${isFa ? 'اطلاعات تماس' : 'Contact Info'}</h2>
              <form class="checkout-form" data-checkout-form>
                <div class="checkout-field">
                  <label>${isFa ? 'نام کامل' : 'Full Name'}</label>
                  <input type="text" name="name" class="auth-input" required />
                </div>
                <div class="checkout-field">
                  <label>${isFa ? 'شماره تلفن' : 'Phone'}</label>
                  <input type="tel" name="phone" class="auth-input" dir="ltr" required />
                </div>
                <div class="checkout-field">
                  <label>${isFa ? 'یادداشت' : 'Note'}</label>
                  <textarea name="note" class="auth-input" rows="3"></textarea>
                </div>
              </form>
            </div>

            <!-- روش پرداخت -->
            <div class="checkout-card">
              <h2>${isFa ? 'روش پرداخت' : 'Payment Method'}</h2>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" name="payment" value="online" checked />
                  <span>${isFa ? 'پرداخت آنلاین' : 'Online Payment'}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="payment" value="cash" />
                  <span>${isFa ? 'پرداخت در محل' : 'Pay on Site'}</span>
                </label>
              </div>
            </div>

          </div>

          <!-- سمت راست: Total + پرداخت -->
          <div class="checkout-sidebar">
            <div class="checkout-card sticky">
              <h2>${isFa ? 'جمع کل' : 'Total'}</h2>
              <div class="total-row">
                <span>${isFa ? 'مبلغ' : 'Amount'}</span>
                <strong data-total-price>—</strong>
              </div>
              <div class="total-row">
                <span>${isFa ? 'مالیات' : 'Tax'}</span>
                <strong data-total-tax>0</strong>
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

  queueMicrotask(() => {
    initLayout();
    initCheckout({ serviceId, date, time, isFa });
  });

  return html;
}

// ============================================
// منطق چک‌اوت
// ============================================
function initCheckout({ serviceId, date, time, isFa }) {
  let service = null;

  const infoEl = document.querySelector('[data-booking-info]');
  const priceEl = document.querySelector('[data-total-price]');
  const taxEl = document.querySelector('[data-total-tax]');
  const finalEl = document.querySelector('[data-total-final]');
  const msg = document.querySelector('[data-checkout-msg]');
  const payBtn = document.querySelector('[data-pay-btn]');

  // ---------- لود اطلاعات خدمت ----------
  loadService();

  async function loadService() {
    try {
      // TODO: service = await apiGet(`/services/${serviceId}`);
      const services = {
        1: { name: isFa ? 'میکاپ عروس' : 'Bridal Makeup', price: 5000000 },
        2: { name: isFa ? 'رنگ و مش' : 'Hair Color', price: 2500000 },
        3: { name: isFa ? 'کراتین مو' : 'Keratin Treatment', price: 3500000 },
        4: { name: isFa ? 'پاکسازی پوست' : 'Facial Cleansing', price: 1500000 },
        5: { name: isFa ? 'میکاپ ساده' : 'Simple Makeup', price: 1200000 },
        6: { name: isFa ? 'میکاپ مجلسی' : 'Party Makeup', price: 2000000 }
      };
      service = services[serviceId] || { name: '—', price: 0 };

      // نمایش خلاصه
      infoEl.innerHTML = `
        <div class="info-row"><span>${isFa ? 'خدمت' : 'Service'}</span><strong>${service.name}</strong></div>
        <div class="info-row"><span>${isFa ? 'تاریخ' : 'Date'}</span><strong>${date || '—'}</strong></div>
        <div class="info-row"><span>${isFa ? 'ساعت' : 'Time'}</span><strong>${time || '—'}</strong></div>
      `;

      // قیمت
      const tax = Math.round(service.price * 0.09);
      priceEl.textContent = formatPrice(service.price);
      taxEl.textContent = formatPrice(tax);
      finalEl.textContent = formatPrice(service.price + tax);
    } catch (err) {
      console.error(err);
      infoEl.innerHTML = `<p>خطا در بارگذاری</p>`;
    }
  }

  // ---------- دکمه‌ی پرداخت ----------
  payBtn?.addEventListener('click', async () => {
    const form = document.querySelector('[data-checkout-form]');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = Object.fromEntries(new FormData(form));
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'online';

    setLoading(payBtn, true);
    showMsg(msg, isFa ? 'در حال پردازش...' : 'Processing...', 'info');

    try {
      const payload = {
        service_id: serviceId,
        date,
        time,
        name: formData.name,
        phone: formData.phone,
        note: formData.note,
        payment_method: paymentMethod
      };

      // TODO: const res = await apiPost('/appointments', payload);
      console.log('📅 Booking:', payload);
      await new Promise(r => setTimeout(r, 1200));

      if (paymentMethod === 'online') {
        // TODO: ریدایرکت به درگاه پرداخت
        // window.location.href = res.payment_url;
        showMsg(msg, isFa ? 'در حال انتقال به درگاه...' : 'Redirecting to gateway...', 'success');
        setTimeout(() => window.__app?.router?.navigate('/dashboard'), 2000);
      } else {
        showMsg(msg, isFa ? 'رزرو با موفقیت ثبت شد!' : 'Booked successfully!', 'success');
        setTimeout(() => window.__app?.router?.navigate('/dashboard'), 2000);
      }
    } catch (err) {
      showMsg(msg, err.message || (isFa ? 'خطا در پرداخت' : 'Payment error'), 'error');
    } finally {
      setLoading(payBtn, false);
    }
  });

  // ---------- توابع کمکی ----------
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

  function formatPrice(price) {
    return new Intl.NumberFormat(isFa ? 'fa-IR' : 'en-US').format(price) + (isFa ? ' تومان' : ' IRR');
  }
}