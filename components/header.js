// ============================================
// Header Component
// ============================================
import { t, getCurrentLang, setLanguage } from '../code/i18n.js';
import { isLoggedIn, getUser, logout } from '../code/auth.js';

export function Header() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const currentPath = window.location.pathname;
  const isActive = (path) => currentPath === path;

  // برچسب زبان (برای نمایش روی دکمه)
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
          <div class="user-menu">
            <a href="/dashboard" class="user-link w-inline-block" data-nav-link title="${user?.name || user?.phone || ''}">
              <img src="/img/users-icon-dark.svg" loading="lazy" alt="User" />
            </a>
            <button class="logout-btn" data-logout-btn title="${t('auth.logout') || 'خروج'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
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
  if (langBtn && !langBtn.dataset.initialized) {
    langBtn.dataset.initialized = 'true';
    langBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const current = getCurrentLang();
      const next = current === 'fa' ? 'en' : 'fa';
      console.log('🌐 Language:', current, '→', next);

      await setLanguage(next);

      // رندر مجدد صفحه
      if (window.__app?.router) {
        window.__app.router.resolve(window.location.pathname);
      } else {
        window.location.reload();
      }
    });
  }

  // ---------- Logout ----------
  const logoutBtn = document.querySelector('[data-logout-btn]');
  if (logoutBtn && !logoutBtn.dataset.initialized) {
    logoutBtn.dataset.initialized = 'true';
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!confirm('آیا مطمئنید می‌خواهید خارج شوید؟')) return;

      logoutBtn.disabled = true;
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
        // حتی اگه API خطا داد، پاک کن
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.__app?.router?.navigate('/login');
      }
    });
  }

  // ---------- منوی موبایل ----------
  const menuBtn = document.querySelector('[data-menu-button]');
  const navMenu = document.querySelector('.nav-menu');
  if (menuBtn && navMenu && !menuBtn.dataset.initialized) {
    menuBtn.dataset.initialized = 'true';
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open');
    });
  }

  // ---------- فرم جستجو ----------
  const searchForm = document.querySelector('[data-search-form]');
  if (searchForm && !searchForm.dataset.initialized) {
    searchForm.dataset.initialized = 'true';
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchForm.querySelector('input[name="query"]').value;
      if (query) {
        window.__app?.router?.navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    });
  }
}