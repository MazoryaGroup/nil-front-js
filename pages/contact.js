// ============================================
// Contact Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { apiPost } from '../code/api.js';

export async function ContactPage() {
  const html = Layout(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${t('sections.get_in_touch') || 'GET IN TOUCH'}</div>
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
                placeholder="${t('forms.first_name')}*"
                type="text"
                required
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="last_name"
                placeholder="${t('forms.last_name')}"
                type="text"
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="email"
                placeholder="${t('forms.email')}*"
                type="email"
                required
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="phone"
                placeholder="${t('forms.phone')}"
                type="text"
              />
              <textarea
                required
                placeholder="${t('forms.message')}*"
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
                    I hereby agree to the
                    <a href="/terms-conditions" class="contact-link" data-nav-link>Terms &amp; Conditions</a>
                    of Glomin
                  </span>
                </label>
                <input
                  type="submit"
                  class="primary-button w-button"
                  value="${t('buttons.submit')}"
                />
              </div>
            </form>

            <div class="form-message" data-form-message></div>
          </div>

          <!-- اطلاعات تماس -->
          <div class="contat-content">
            <p>Whether you need support with your order, have inquiries about our products, or just want to provide feedback.</p>

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
                      <h6>Email</h6>
                      <div class="body-small">
                        To get in touch, email
                        <a href="mailto:info@example.com" class="contact-link">info@example.com</a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/phone-icon.svg" loading="lazy" alt="Call" />
                    </div>
                    <div>
                      <h6>Contact</h6>
                      <div class="body-small">
                        We're here to help –
                        <a href="tel:+(123)456-7890" class="contact-link">+(123) 456-7890</a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/location-icon.svg" loading="lazy" alt="Location" />
                    </div>
                    <div>
                      <h6>Location</h6>
                      <div class="body-small">
                        3891 Ranchview Dr. Richardson, California
                      </div>
                    </div>
                  </div>

                </div>

                <div class="follow-us">
                 
                  
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    initContactForm();
  });

  return html;
}

// ============================================
// راه‌اندازی فرم تماس
// ============================================
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  const msg = document.querySelector('[data-form-message]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    // نمایش لودینگ
    if (msg) {
      msg.textContent = '⏳ در حال ارسال...';
      msg.style.color = '#666';
      msg.style.display = 'block';
    }

    try {
      // TODO: await apiPost('/contact', data);
      console.log('📩 Contact form:', data);

      // شبیه‌سازی موفقیت
      await new Promise(r => setTimeout(r, 500));

      if (msg) {
        msg.textContent = '✅ ' + (t('forms.success_message') || 'Thank you! Your message has been sent.');
        msg.style.color = 'green';
      }
      form.reset();
    } catch (err) {
      console.error('❌ Contact error:', err);
      if (msg) {
        msg.textContent = '❌ ' + (err.message || 'Error sending message');
        msg.style.color = 'red';
      }
    }
  });
}