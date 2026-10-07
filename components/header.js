// ============================================
// Header Component
// ============================================
import { t, getCurrentLang, setLanguage } from '../code/i18n.js';
import { isLoggedIn, getUser } from '../code/auth.js';

export function Header() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const currentPath = window.location.pathname;
  const isActive = (path) => currentPath === path;

  const langLabel = getCurrentLang() === 'fa' ? 'EN' : 'FA';

  return `
    <div class="container w-container">
      <div class="nav-wrapper">
        <a href="/" class="brand w-nav-brand" data-nav-link>
          <div>NIL</div>
        </a>

        <nav role="navigation" class="nav-menu w-nav-menu">
          <div class="nav-inner">
            <a href="/" class="nav-link w-inline-block ${isActive('/') ? 'w--current' : ''}" data-nav-link>
              <div class="nav-link-inner">${t('nav.home')}</div>
              <div class="bottom-underline"></div>
            </a>
            <a href="/about" class="nav-link w-inline-block ${isActive('/about') ? 'w--current' : ''}" data-nav-link>
              <div class="nav-link-inner">${t('nav.about')}</div>
              <div class="bottom-underline"></div>
            </a>
            <a href="/blog" class="nav-link w-inline-block ${isActive('/blog') ? 'w--current' : ''}" data-nav-link>
              <div class="nav-link-inner">${t('nav.blogs')}</div>
              <div class="bottom-underline"></div>
            </a>
            <a href="/contact" class="nav-link w-inline-block ${isActive('/contact') ? 'w--current' : ''}" data-nav-link>
              <div class="nav-link-inner">${t('nav.contact')}</div>
              <div class="bottom-underline"></div>
            </a>
            ${loggedIn ? `
              <a href="/dashboard" class="nav-link w-inline-block ${isActive('/dashboard') ? 'w--current' : ''}" data-nav-link>
                <div class="nav-link-inner">${t('nav.dashboard') || 'Dashboard'}</div>
                <div class="bottom-underline"></div>
              </a>
            ` : ''}
          </div>

          <form action="/search" class="search w-form" data-search-form>
            <input
              class="search-input w-input"
              maxlength="256"
              name="query"
              placeholder="${t('nav.search_placeholder')}"
              type="search"
              id="search"
              required
            />
            <input type="submit" class="search-button w-button" value="" />
          </form>
        </nav>

        <!-- سوییچ زبان -->
        <button class="lang-switch" data-lang-switch title="Change language">
          <span data-lang-current>${langLabel}</span>
        </button>

        ${loggedIn ? `
          <!-- کاربر لاگین شده -->
          <a href="/dashboard" class="user-link w-inline-block" data-nav-link title="${user?.name || user?.phone || ''}">
            <img src="/img/users-icon-dark.svg" loading="lazy" alt="User" />
          </a>
        ` : `
          <!-- کاربر مهمان -->
          <a href="/login" class="user-link w-inline-block" data-nav-link title="Login / Sign up">
            <img src="/img/users-icon-dark.svg" loading="lazy" alt="User" />
          </a>
        `}

        <!-- منوی موبایل -->
        <div class="menu-button w-nav-button" data-menu-button>
          <div class="nav-top-line"></div>
          <div class="nav-middle-line"></div>
          <div class="nav-bottom-line"></div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// راه‌اندازی event listener های هدر
// ============================================
export function initHeader() {
  // ---------- سوییچ زبان ----------
  const langBtn = document.querySelector('[data-lang-switch]');
  if (langBtn) {
    const newLangBtn = langBtn.cloneNode(true);
    langBtn.parentNode.replaceChild(newLangBtn, langBtn);

    newLangBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const current = getCurrentLang();
      const next = current === 'fa' ? 'en' : 'fa';
      console.log('🌐 Language:', current, '→', next);

      await setLanguage(next);

      if (window.__app?.router) {
        window.__app.router.resolve(window.location.pathname);
      } else {
        window.location.reload();
      }
    });
  }

  // ---------- منوی موبایل ----------
  const menuBtn = document.querySelector('[data-menu-button]');
  const navMenu = document.querySelector('.nav-menu');
  if (menuBtn && navMenu) {
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);

    newMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      newMenuBtn.classList.toggle('is-open');
    });
  }

  // ---------- فرم جستجو ----------
  const searchForm = document.querySelector('[data-search-form]');
  if (searchForm) {
    const newForm = searchForm.cloneNode(true);
    searchForm.parentNode.replaceChild(newForm, searchForm);

    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = newForm.querySelector('input[name="query"]').value;
      if (query) {
        window.__app?.router?.navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    });
  }
}