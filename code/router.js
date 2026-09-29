// ============================================
// Router - موتور روتینگ SPA
// ============================================

export class Router {
  constructor(routes, containerSelector = '#app') {
    this.routes = routes;
    this.container = document.querySelector(containerSelector);
    this.currentPath = null;

    // bind
    this.handlePopState = this.handlePopState.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  // ============================================
  // شروع
  // ============================================
  start() {
    window.addEventListener('popstate', this.handlePopState);
    document.addEventListener('click', this.handleLinkClick);
    this.handlePopState();
  }

  // ============================================
  // توقف
  // ============================================
  stop() {
    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('click', this.handleLinkClick);
  }

  // ============================================
  // ناوبری
  // ============================================
  navigate(path, pushState = true) {
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    this.resolve(path);
  }

  // ============================================
  // resolve کردن مسیر
  // ============================================
  async resolve(path) {
    // پاک کردن query string
    const cleanPath = path.split('?')[0];
    this.currentPath = cleanPath;

    // پیدا کردن route
    const match = this.matchRoute(cleanPath);

    if (!match) {
      console.warn('⚠️ No route matched:', cleanPath);
      return;
    }

    const { route, params } = match;

    // تنظیم title
    if (route.title) {
      document.title = route.title + ' | Nil Beauty';
    }

    // رندر کامپوننت
    try {
      this.container.innerHTML = '<div class="page-loading">در حال بارگذاری...</div>';

      const html = await route.component(params);
      this.container.innerHTML = html;

      // اسکرول به بالا
      window.scrollTo(0, 0);

      // اطلاع به Webflow برای re-init انیمیشن‌ها
      this.reinitWebflow();

      // dispatch event
      window.dispatchEvent(new CustomEvent('pageChanged', {
        detail: { path: cleanPath, params }
      }));
    } catch (err) {
      console.error('❌ Render failed:', err);
      this.container.innerHTML = `
        <div style="padding:40px;text-align:center">
          <h2>خطا در بارگذاری صفحه</h2>
          <p>${err.message}</p>
        </div>
      `;
    }
  }

  // ============================================
  // مطابقت مسیر با route
  // ============================================
  matchRoute(path) {
    for (const route of this.routes) {
      const params = this.matchPath(route.path, path);
      if (params !== null) {
        return { route, params };
      }
    }
    return null;
  }

  // ============================================
  // مطابقت الگو با مسیر (پشتیبانی از :param و *)
  // ============================================
  matchPath(pattern, path) {
    // مسیر wildcard
    if (pattern === '*') return {};

    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    // اگه تعداد بخش‌ها یکی نباشه
    if (patternParts.length !== pathParts.length) return null;

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      const p = patternParts[i];
      const v = pathParts[i];

      if (p.startsWith(':')) {
        params[p.slice(1)] = decodeURIComponent(v);
      } else if (p !== v) {
        return null;
      }
    }

    return params;
  }

  // ============================================
  // مدیریت popstate (back/forward مرورگر)
  // ============================================
  handlePopState() {
    this.resolve(window.location.pathname);
  }

  // ============================================
  // مدیریت کلیک روی لینک‌های داخلی
  // ============================================
  handleLinkClick(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // لینک‌های خارجی، hash، mailto، tel
    if (
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.target === '_blank'
    ) return;

    // جلوگیری از رفتار پیش‌فرض
    e.preventDefault();
    this.navigate(href);
  }

  // ============================================
  // راه‌اندازی مجدد Webflow بعد از رندر
  // ============================================
  reinitWebflow() {
    if (typeof window.Webflow === 'undefined') return;
    try {
      // انیمیشن‌ها
      if (window.Webflow.require) {
        const ix2 = window.Webflow.require('ix2');
        if (ix2 && ix2.init) ix2.init();
      }
      // dropdown ها
      window.Webflow.destroy();
      window.Webflow.ready();
    } catch (err) {
      console.warn('⚠️ Webflow reinit failed:', err);
    }
  }
}