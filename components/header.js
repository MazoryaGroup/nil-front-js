
import {
  t,
  getCurrentLang,
  setLanguage
} from '../code/i18n.js';

import {
  isLoggedIn,
  getUser
} from '../code/auth.js';

// ============================================
// Helpers
// ============================================

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isActivePath(path) {
  const current = window.location.pathname;

  if (path === '/') {
    return current === '/';
  }

  return current === path || current.startsWith(path + '/');
}

// ============================================
// Header HTML
// ============================================

export function Header() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const isFa = getCurrentLang() === 'fa';

  const langLabel = isFa ? 'EN' : 'FA';

  const userTitle = escapeHtml(
    user?.name ||
    user?.phone ||
    (isFa ? 'حساب کاربری' : 'My account')
  );

  const navLinks = [
    {
      path: '/',
      label: t('nav.home')
    },
    {
      path: '/about',
      label: t('nav.about')
    },
    {
      path: '/gallery',
      label: isFa ? 'گالری' : 'Gallery'
    },
    {
      path: '/blog',
      label: t('nav.blogs')
    },
    {
      path: '/contact',
      label: t('nav.contact')
    }
  ];

  if (loggedIn) {
    navLinks.push({
      path: '/dashboard',
      label: t('nav.dashboard') || (isFa ? 'داشبورد' : 'Dashboard')
    });
  }

  return `
    <div class="container w-container">
      <div class="nav-wrapper">

        <!-- BRAND -->
        <a
          href="/"
          class="brand w-nav-brand"
          data-nav-link
          aria-label="NIL Beauty"
        >
          <div>NIL</div>
        </a>

        <!-- NAVIGATION -->
        <nav
          role="navigation"
          class="nav-menu w-nav-menu"
          id="nil-mobile-navigation"
          data-nav-menu
          aria-label="${isFa ? 'منوی اصلی' : 'Main navigation'}"
        >
          <div class="nav-inner">

            ${navLinks.map(link => `
              <a
                href="${link.path}"
                class="nav-link w-inline-block ${
                  isActivePath(link.path) ? 'w--current' : ''
                }"
                data-nav-link
                ${isActivePath(link.path) ? 'aria-current="page"' : ''}
              >
                <div class="nav-link-inner">
                  ${escapeHtml(link.label)}
                </div>

                <div class="bottom-underline"></div>
              </a>
            `).join('')}

          </div>
        </nav>

        <!-- LANGUAGE SWITCH -->
        <button
          type="button"
          class="lang-switch"
          data-lang-switch
          aria-label="${isFa ? 'تغییر زبان به انگلیسی' : 'Switch to Persian'}"
          title="${isFa ? 'English' : 'فارسی'}"
        >
          <span data-lang-current>
            ${langLabel}
          </span>
        </button>

        <!-- USER -->
        ${loggedIn ? `
          <a
            href="/dashboard"
            class="user-link w-inline-block"
            data-nav-link
            title="${userTitle}"
            aria-label="${userTitle}"
          >
            <img
              src="/img/users-icon-dark.svg"
              loading="lazy"
              alt=""
            />
          </a>
        ` : `
          <a
            href="/login"
            class="user-link w-inline-block"
            data-nav-link
            title="${isFa ? 'ورود / ثبت‌نام' : 'Login / Register'}"
            aria-label="${isFa ? 'ورود / ثبت‌نام' : 'Login / Register'}"
          >
            <img
              src="/img/users-icon-dark.svg"
              loading="lazy"
              alt=""
            />
          </a>
        `}

        <!-- MOBILE MENU -->
        <button
          type="button"
          class="menu-button w-nav-button"
          data-menu-button
          aria-label="${isFa ? 'باز کردن منو' : 'Open menu'}"
          aria-controls="nil-mobile-navigation"
          aria-expanded="false"
        >
          <div class="nav-top-line"></div>
          <div class="nav-middle-line"></div>
          <div class="nav-bottom-line"></div>
        </button>

      </div>
    </div>
  `;
}

// ============================================
// Header Events
// ============================================

export function initHeader() {
  const langBtn = document.querySelector(
    '[data-lang-switch]'
  );

  const menuBtn = document.querySelector(
    '[data-menu-button]'
  );

  const navMenu = document.querySelector(
    '[data-nav-menu]'
  );

  // ============================================
  // Language Switch
  // ============================================

  if (langBtn && !langBtn.dataset.initialized) {
    langBtn.dataset.initialized = 'true';

    langBtn.addEventListener('click', async event => {
      event.preventDefault();

      if (langBtn.disabled) return;

      langBtn.disabled = true;

      const current = getCurrentLang();
      const next = current === 'fa' ? 'en' : 'fa';

      try {
        await setLanguage(next);

        if (window.__app?.router) {
          await window.__app.router.resolve(
            window.location.pathname
          );
        } else {
          window.location.reload();
        }

      } catch (error) {
        console.error(
          '❌ Language switch error:',
          error
        );

      } finally {
        if (langBtn.isConnected) {
          langBtn.disabled = false;
        }
      }
    });
  }

  // ============================================
  // Mobile Menu
  // ============================================

  if (
    menuBtn &&
    navMenu &&
    !menuBtn.dataset.initialized
  ) {
    menuBtn.dataset.initialized = 'true';

    function setMenuOpen(open) {
      navMenu.classList.toggle('is-open', open);
      menuBtn.classList.toggle('is-open', open);

      menuBtn.setAttribute(
        'aria-expanded',
        String(open)
      );
    }

    menuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains(
        'is-open'
      );

      setMenuOpen(!isOpen);
    });

    // Close after navigation
    navMenu.addEventListener('click', event => {
      const link = event.target.closest(
        'a[data-nav-link]'
      );

      if (link) {
        setMenuOpen(false);
      }
    });

    // Escape closes the menu
    menuBtn.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    });

    navMenu.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.focus();
      }
    });
  }
}
