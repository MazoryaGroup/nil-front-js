// ============================================
// Footer Component
// ============================================
import { t } from '../code/i18n.js';

export function Footer() {
  return `
    <section class="footer">
      <div class="w-layout-blockcontainer container w-container">
        <div class="footer-wrap">
          <div class="footer-top">
            <a href="/" class="footer-brand w-inline-block">
              <div>NIL BEAUTY</div>
            </a>

            <div class="footer-menu">
              <div class="footer-data">
                <div class="footer-head">${t('footer.pages')}</div>
                <div class="footer-links">
                  <a href="/" class="footer-link w-inline-block">
                    <div>${t('nav.home')}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/about" class="footer-link w-inline-block">
                    <div>${t('nav.about')}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/blog" class="footer-link w-inline-block">
                    <div>${t('nav.blogs')}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>

              <div class="footer-data">
                <div class="footer-head">${t('footer.resource')}</div>
                <div class="footer-links">
                  <a href="/faq" class="footer-link w-inline-block">
                    <div>FAQ</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/contact" class="footer-link w-inline-block">
                    <div>${t('nav.contact')}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>

              <div class="footer-data">
                <div class="footer-head">${t('footer.utility')}</div>
                <div class="footer-links">
                  <a href="/login" class="footer-link w-inline-block">
                    <div>Login</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-middle">
            <div class="newsletter-form-block w-form">
              <div class="newsletter-text">${t('footer.newsletter_text')}</div>
              <form class="newsletter-form" data-newsletter-form>
                <input
                  class="newsletter-field w-input"
                  maxlength="256"
                  name="email"
                  placeholder="${t('footer.email_placeholder')}"
                  type="email"
                  required
                />
                <input
                  type="submit"
                  class="newsletter-btn w-button"
                  value="${t('buttons.subscribe')}"
                />
              </form>
            </div>

            <div class="footer-social">
              <a href="https://www.whatsapp.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/whatsapp.png" loading="lazy" alt="WhatsApp" />
              </a>
              <a href="https://www.youtube.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/phone.png" loading="lazy" alt="Phone" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/insta.svg" loading="lazy" alt="Instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="foter-bottom">
        <div class="w-layout-blockcontainer container w-container">
          <div class="footer-last">
            <div class="designer-text">
              Designed. Powered by
              <a href="https://www.mazoryagroup.ir/" target="_blank" class="utility-link">MazoryaGroup</a>.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}