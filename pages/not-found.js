// ============================================
// 404 Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';

export async function NotFoundPage() {
  const html = Layout(`
    <div class="section" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center">
      <div>
        <h1 style="font-size:6rem;margin:0">404</h1>
        <h2>${t('not_found.title')}</h2>
        <p>${t('not_found.description')}</p>
        <a href="/" class="primary-button w-button" data-nav-link>${t('not_found.back_home')}</a>
      </div>
    </div>
  `);

  queueMicrotask(() => initLayout());
  return html;
}