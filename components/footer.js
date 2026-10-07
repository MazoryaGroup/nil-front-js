// ============================================
// Footer Component
// ============================================
import { t, getCurrentLang } from '../code/i18n.js';
import { waitingListApi } from '../code/api.js';

export function Footer() {
  const isFa = getCurrentLang() === 'fa';

  return `
    <section class="footer">
      <div class="w-layout-blockcontainer container w-container">
        <div class="footer-wrap">
          <div class="footer-top">
            <a href="/" class="footer-brand w-inline-block" data-nav-link>
              <div>NIL BEAUTY</div>
            </a>

            <div class="footer-menu">
              <div class="footer-data">
                <div class="footer-head">${t('footer.pages')}</div>
                <div class="footer-links">
                  <a href="/" class="footer-link w-inline-block" data-nav-link>
                    <div>${t('nav.home')}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/about" class="footer-link w-inline-block" data-nav-link>
                    <div>${t('nav.about')}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/blog" class="footer-link w-inline-block" data-nav-link>
                    <div>${t('nav.blogs')}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>

              <div class="footer-data">
                <div class="footer-head">${t('footer.resource')}</div>
                <div class="footer-links">
                  <a href="/faq" class="footer-link w-inline-block" data-nav-link>
                    <div>FAQ</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/contact" class="footer-link w-inline-block" data-nav-link>
                    <div>${t('nav.contact')}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>

              <div class="footer-data">
                <div class="footer-head">${t('footer.utility')}</div>
                <div class="footer-links">
                  <a href="/gallery" class="footer-link w-inline-block" data-nav-link>
                    <div>${t('nav.gallery') || (isFa ? 'گالری' : 'Gallery')}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/login" class="footer-link w-inline-block" data-nav-link>
                    <div>${isFa ? 'ورود' : 'Login'}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-middle">
            <div class="newsletter-form-block w-form">
              
              <div class="newsletter-form" data-newsletter-form>
                
                
              </div>
              <div class="form-message" data-newsletter-msg></div>
            </div>

            <div class="footer-social">
              <a href="https://www.whatsapp.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/whatsapp.png" loading="lazy" alt="WhatsApp" />
              </a>
              <a href="tel:+982122634768" class="social-link w-inline-block">
                <img src="/img/phone.png" loading="lazy" alt="Phone" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/insta.png" loading="lazy" alt="Instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="foter-bottom">
        <div class="w-layout-blockcontainer container w-container">
          <div class="footer-last">
            <div class="designer-text">
              ${isFa ? 'طراحی شده' : 'Designed'}. Powered by
              <a href="https://www.mazoryagroup.ir/" target="_blank" class="utility-link">MazoryaGroup</a>.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================
// راه‌اندازی فرم خبرنامه
// ============================================
export function initFooter() {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;

  // ✅ پاک کردن listenerهای قبلی با clone
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  const isFa = getCurrentLang() === 'fa';
  const msg = newForm.parentElement.querySelector('[data-newsletter-msg]');
  const submitBtn = newForm.querySelector('[data-newsletter-submit]');
  const emailInput = newForm.querySelector('input[name="email"]');

  if (!submitBtn || !emailInput) return;

  console.log('🔧 initFooter: newsletter button listener attached');

  // ✅ listener روی دکمه
  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (submitBtn.disabled) return;

    const email = (emailInput.value || '').trim();

    if (!email || !isValidEmail(email)) {
      showMsg(msg, isFa ? 'ایمیل معتبر وارد کنید' : 'Please enter a valid email', 'error');
      return;
    }

    setLoading(submitBtn, true);
    showMsg(msg, isFa ? 'در حال ارسال...' : 'Sending...', 'info');

    try {
      const res = await waitingListApi.subscribe(email);
      console.log('📧 Waiting list response:', res);

      showMsg(msg, isFa ? 'ایمیل ثبت شد ✓' : 'Email registered ✓', 'success');
      emailInput.value = '';
    } catch (err) {
      console.error('❌ Newsletter error:', err);
      showMsg(msg, err.message || 'Failed to subscribe', 'error');
    } finally {
      setLoading(submitBtn, false);
    }
  });

  // ✅ Enter روی input هم submit کنه
  emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitBtn.click();
    }
  });

  // ============================================
  // Helpers
  // ============================================
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

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
      btn.textContent = '...';
    } else {
      btn.textContent = btn.dataset.originalText || 'SUBSCRIBE';
    }
  }
}

// ============================================
// ✅ Auto-init
// ============================================
if (typeof window !== 'undefined') {
  window.addEventListener('pageChanged', () => setTimeout(initFooter, 100));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initFooter, 500));
  } else {
    setTimeout(initFooter, 500);
  }
}