// ============================================
// Layout - پوسته‌ی مشترک صفحات
// ============================================
import { Header, initHeader } from './Header.js';
import { Footer } from './Footer.js';

export function Layout(content, options = {}) {
  const { navbarClass = 'navbar w-nav', wrapInPageWrap = true } = options;

  return `
    <div class="page-wrap">
      <div class="${navbarClass}" data-animation="default" data-collapse="medium">
        ${Header()}
      </div>

      ${content}
    </div>

    <div id="footer">${Footer()}</div>
  `;
}

// بعد از رندر هر صفحه صدا زده می‌شه
export function initLayout() {
  initHeader();
}