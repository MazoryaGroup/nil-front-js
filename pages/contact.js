
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { messagesApi } from '../code/api.js';

// ============================================
// Helpers
// ============================================

function normalizeDigits(value = '') {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const ar = '٠١٢٣٤٥٦٧٨٩';

  return String(value)
    .replace(/[۰-۹]/g, char => String(fa.indexOf(char)))
    .replace(/[٠-٩]/g, char => String(ar.indexOf(char)));
}

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// Contact Page
// ============================================

export async function ContactPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">

          <div class="subtitle">
            ${isFa ? 'با ما در تماس باشید' : 'GET IN TOUCH'}
          </div>

          <h1>${escapeHtml(t('nav.contact'))}</h1>

        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section>
      <div class="w-layout-blockcontainer container w-container">

        <div class="contact-wrap">

          <!-- CONTACT FORM -->
          <div class="contact-form-block w-form">

            <form class="contact-form" data-contact-form>

              <input
                class="text-field w-input"
                maxlength="255"
                name="first_name"
                placeholder="${isFa ? 'نام *' : 'First name *'}"
                type="text"
                autocomplete="given-name"
                required
              />

              <input
                class="text-field w-input"
                maxlength="255"
                name="last_name"
                placeholder="${isFa ? 'نام خانوادگی' : 'Last name'}"
                type="text"
                autocomplete="family-name"
              />

              <input
                class="text-field w-input"
                maxlength="255"
                name="email"
                placeholder="${isFa ? 'ایمیل *' : 'Email *'}"
                type="email"
                autocomplete="email"
                dir="ltr"
                required
              />

              <input
                class="text-field w-input"
                maxlength="20"
                name="phone"
                placeholder="${isFa ? 'شماره تلفن' : 'Phone'}"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
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
                    ${isFa
                      ? 'با ارسال این فرم، موافقت خود را با بررسی پیام توسط مجموعه NIL اعلام می‌کنم.'
                      : 'I agree to NIL processing my message to respond to my inquiry.'}
                  </span>
                </label>

                <input
                  type="submit"
                  class="primary-button w-button"
                  value="${escapeHtml(t('buttons.submit'))}"
                  data-submit-btn
                />

              </div>
            </form>

            <div
              class="contact-form-message"
              data-form-message
              role="status"
              aria-live="polite"
            ></div>

          </div>

          <!-- CONTACT INFORMATION -->
          <div class="contat-content">

            <p>
              ${isFa
                ? 'سؤال، پیشنهاد یا انتقادی داری؟ پیام خودت رو برامون ارسال کن. خوشحال می‌شیم باهات در ارتباط باشیم.'
                : 'Have a question or feedback? Send us a message. We would love to hear from you.'}
            </p>

            <div class="contact-inner">

              <div class="contact-img">
                <img
                  src="/img/contact-image.jpg"
                  loading="lazy"
                  alt="NIL Beauty Contact"
                  class="cover-image"
                />
              </div>

              <div class="contact-info">
                <div class="contact-outer">

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img
                        src="/img/mail-icon.svg"
                        loading="lazy"
                        alt=""
                      />
                    </div>

                    <div>
                      <h6>${isFa ? 'ایمیل' : 'Email'}</h6>
                      <div class="body-small">
                        ${isFa
                          ? 'برای ارتباط با مجموعه از فرم تماس استفاده کنید.'
                          : 'Use the contact form to reach our team.'}
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img
                        src="/img/phone-icon.svg"
                        loading="lazy"
                        alt=""
                      />
                    </div>

                    <div>
                      <h6>${isFa ? 'پشتیبانی' : 'Support'}</h6>
                      <div class="body-small">
                        ${isFa
                          ? 'پیام خود را ثبت کنید تا تیم مجموعه با شما ارتباط بگیرد.'
                          : 'Submit your message and our team will get back to you.'}
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
    const form = document.querySelector('[data-contact-form]');

    if (!form) return;

    initLayout();
    initContactForm(form, isFa);
  }, 100);

  return html;
}

// ============================================
// Contact Form
// ============================================

function initContactForm(form, isFa) {
  const msg = form.parentElement.querySelector(
    '[data-form-message]'
  );

  const submitBtn = form.querySelector(
    '[data-submit-btn]'
  );

  let submitting = false;

  function showMsg(text = '', type = 'info') {
    if (!msg) return;

    msg.textContent = text;
    msg.style.display = text ? 'block' : 'none';

    msg.classList.remove(
      'is-success',
      'is-error',
      'is-info'
    );

    msg.classList.add(`is-${type}`);
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;

    if (loading) {
      submitBtn.dataset.originalText = submitBtn.value;
      submitBtn.value = isFa
        ? 'لطفاً صبر کنید...'
        : 'Please wait...';
    } else {
      submitBtn.value =
        submitBtn.dataset.originalText ||
        (isFa ? 'ارسال پیام' : 'Submit');
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (submitting) return;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    const data = {
      first_name: String(
        formData.get('first_name') || ''
      ).trim(),

      last_name: String(
        formData.get('last_name') || ''
      ).trim(),

      email: String(
        formData.get('email') || ''
      ).trim(),

      phone: normalizeDigits(
        String(formData.get('phone') || '').trim()
      ),

      message: String(
        formData.get('message') || ''
      ).trim()
    };

    if (!data.first_name || !data.email || !data.message) {
      showMsg(
        isFa
          ? 'لطفاً فیلدهای ضروری را تکمیل کنید.'
          : 'Please complete the required fields.',
        'error'
      );
      return;
    }

    submitting = true;
    setLoading(true);

    showMsg(
      isFa ? 'در حال ارسال پیام...' : 'Sending message...',
      'info'
    );

    try {
      await messagesApi.send(data);

      if (!form.isConnected) return;

      showMsg(
        isFa
          ? 'پیام شما با موفقیت ارسال شد ✓'
          : 'Your message has been sent successfully ✓',
        'success'
      );

      form.reset();

    } catch (error) {
      if (!form.isConnected) return;

      console.error('❌ Contact error:', error);

      showMsg(
        error.message ||
          (isFa
            ? 'خطا در ارسال پیام'
            : 'Failed to send message'),
        'error'
      );

    } finally {
      submitting = false;
      setLoading(false);
    }
  });
}
