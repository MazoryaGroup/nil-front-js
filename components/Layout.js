// ============================================
// Layout
// ============================================
import { Header, initHeader } from './Header.js';
import { Footer, initFooter } from './Footer.js';

export function Layout(content, options = {}) {
  const { navbarClass = 'navbar w-nav' } = options;

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

export function initLayout() {
  initHeader();
  initFooter();
}