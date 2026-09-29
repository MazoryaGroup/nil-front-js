// ============================================
// Checkout Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';

export async function CheckoutPage() {
  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <h1>Checkout</h1>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="checkout-form" data-checkout>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    // TODO: بارگذاری سبد خرید از API
  });

  return html;
}