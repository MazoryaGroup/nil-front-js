
import { t, getCurrentLang } from '../code/i18n.js';

// ============================================
// NIL BEAUTY - Minimal Footer
// ============================================

export function Footer() {
  const isFa = getCurrentLang() === 'fa';
  const year = new Date().getFullYear();

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/blog', label: t('nav.blogs') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/faq', label: 'FAQ' }
  ];

  return `
    <footer class="nil-footer" dir="${isFa ? 'rtl' : 'ltr'}">
      <div class="nil-footer-container">

        <!-- Brand -->
        <div class="nil-footer-brand">
          <a
            href="/"
            class="nil-footer-logo"
            data-nav-link
            aria-label="NIL Beauty"
          >
            <img
              src="/img/logo.png"
              alt="NIL Beauty"
              loading="lazy"
            />
          </a>

          <p class="nil-footer-description">
            ${isFa
              ? 'زیبایی، در ساده‌ترین شکل خود.'
              : 'Beauty in its purest form.'}
          </p>
        </div>

        <!-- Navigation -->
        <nav
          class="nil-footer-navigation"
          aria-label="${isFa ? 'لینک‌های فوتر' : 'Footer navigation'}"
        >
          ${links.map(link => `
            <a href="${link.href}" data-nav-link>
              ${link.label}
            </a>
          `).join('')}
        </nav>

        <!-- Social -->
        <div class="nil-footer-social">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src="/img/insta.png"
              alt=""
              loading="lazy"
            />
          </a>

          <a
            href="https://www.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <img
              src="/img/whatsapp.png"
              alt=""
              loading="lazy"
            />
          </a>

          <a
            href="tel:+982122634768"
            aria-label="${isFa ? 'تماس تلفنی' : 'Call us'}"
          >
            <img
              src="/img/phone.png"
              alt=""
              loading="lazy"
            />
          </a>
        </div>

        <!-- Bottom -->
        <div class="nil-footer-bottom">
          <span>
            © ${year} NIL BEAUTY.
            ${isFa ? 'تمامی حقوق محفوظ است.' : 'All rights reserved.'}
          </span>

          <span class="nil-footer-credit">
            ${isFa ? 'طراحی و توسعه توسط' : 'Designed & developed by'}
            <a
              href="https://www.mazoryagroup.ir/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MazoryaGroup
            </a>
          </span>
        </div>

      </div>
    </footer>
  `;
}

// Kept for compatibility with Layout.js
export function initFooter() {
  // No interactive form in the minimal footer.
}
