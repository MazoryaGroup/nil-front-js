// ============================================
// Contact Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { apiPost } from '../code/api.js';

export async function ContactPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${isFa ? 'با ما در تماس باشید' : 'GET IN TOUCH'}</div>
          <h1>${t('nav.contact')}</h1>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="contact-wrap">

          <!-- فرم تماس -->
          <div class="contact-form-block w-form">
            <form class="contact-form" data-contact-form>
              <input
                class="text-field w-input"
                maxlength="256"
                name="first_name"
                placeholder="${isFa ? 'نام' : 'First name'}*"
                type="text"
                required
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="last_name"
                placeholder="${isFa ? 'نام خانوادگی' : 'Last name'}"
                type="text"
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="email"
                placeholder="${isFa ? 'ایمیل' : 'Email'}*"
                type="email"
                required
                dir="ltr"
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="phone"
                placeholder="${isFa ? 'شماره تلفن' : 'Phone'}"
                type="tel"
                dir="ltr"
              />
              <textarea
                required
                placeholder="${isFa ? 'پیام شما *' : 'Your message *'}"
                maxlength="5000"
                name="message"
                class="text-field textarea w-input"
              ></textarea>

              <div class="div-block">
                <label class="w-checkbox">
                  <input
                    type="checkbox"
                    name="agree"
                    required
                    class="w-checkbox-input"
                  />
                  <span class="w-form-label">
                    ${isFa ? 'با' : 'I agree to the'}
                    <a href="/terms-conditions" class="contact-link" data-nav-link>${isFa ? 'شرایط و قوانین' : 'Terms & Conditions'}</a>
                    ${isFa ? 'موافقم' : 'of Glomin'}
                  </span>
                </label>
                <input
                  type="submit"
                  class="primary-button w-button"
                  value="${t('buttons.submit')}"
                  data-submit-btn
                />
              </div>
            </form>

            <div class="form-message" data-form-message></div>
          </div>

          <!-- اطلاعات تماس -->
          <div class="contat-content">
            <p>${isFa ? 'اگه سوالی داری، یا می‌خوای بازخورد بدی، خوشحال می‌شیم بشنویم.' : 'Whether you need support, have inquiries, or want to provide feedback.'}</p>

            <div class="contact-inner">
              <div class="contact-img">
                <img src="/img/contact-image.jpg" loading="eager" alt="Contact" class="cover-image" />
              </div>

              <div class="contact-info">
                <div class="contact-outer">

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/mail-icon.svg" loading="lazy" alt="Mail" />
                    </div>
                    <div>
                      <h6>${isFa ? 'ایمیل' : 'Email'}</h6>
                      <div class="body-small">
                        ${isFa ? 'برای تماس ایمیل بزنید' : 'To get in touch, email'}
                        <a href="mailto:info@example.com" class="contact-link">info@example.com</a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/phone-icon.svg" loading="lazy" alt="Call" />
                    </div>
                    <div>
                      <h6>${isFa ? 'تماس' : 'Contact'}</h6>
                      <div class="body-small">
                        ${isFa ? 'ما اینجا هستیم' : "We're here to help"} –
                        <a href="tel:+(123)456-7890" class="contact-link">+(123) 456-7890</a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/location-icon.svg" loading="lazy" alt="Location" />
                    </div>
                    <div>
                      <h6>${isFa ? 'آدرس' : 'Location'}</h6>
                      <div class="body-small">
                        3891 Ranchview Dr. Richardson, California
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `);

  setTimeout(() => {
    initLayout();
    initContactForm(isFa);
  }, 100);

  return html;
}

// ============================================
// فرم تماس
// ============================================
function initContactForm(isFa) {
  const form = document.querySelector('[data-contact-form]');
  const msg = document.querySelector('[data-form-message]');
  if (!form) return;

  const submitBtn = form.querySelector('[data-submit-btn]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // جلوگیری از ارسال دوباره
    if (submitBtn.disabled) return;

    const data = Object.fromEntries(new FormData(form));

    // حذف agree از payload
    delete data.agree;

    setLoading(submitBtn, true);
    showMsg(msg, isFa ? 'در حال ارسال...' : 'Sending...', 'info');

    try {
      const res = await apiPost('/messages', data);
      console.log('📩 Contact response:', res);

      showMsg(
        msg,
        isFa ? 'پیام شما با موفقیت ارسال شد ✓' : 'Your message has been sent ✓',
        'success'
      );

      form.reset();
    } catch (err) {
      console.error('❌ Contact error:', err);
      showMsg(msg, err.message || (isFa ? 'خطا در ارسال پیام' : 'Error sending message'), 'error');
    } finally {
      setLoading(submitBtn, false);
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
      btn.dataset.originalText = btn.value || btn.textContent;
      btn.value = isFa ? 'لطفاً صبر کنید...' : 'Please wait...';
    } else {
      btn.value = btn.dataset.originalText || 'SUBMIT';
    }
  }
}