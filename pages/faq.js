// ============================================
// FAQ Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';

export async function FaqPage() {
  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">FAQ's</div>
          <h1>Frequently Asked Questions</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="faq-wrap" data-faq-list>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    loadFaqs();
  });

  return html;
}

async function loadFaqs() {
  const container = document.querySelector('[data-faq-list]');
  if (!container) return;

  // TODO: apiGet('/faqs')
  const faqs = [
    { q: 'What is Glomin’s return policy?', a: 'We offer a 30-day return policy.' },
    { q: 'Do you offer free shipping?', a: 'Yes, on orders over $50.' }
  ];

  container.innerHTML = faqs.map((f) => `
    <div class="faq w-dropdown" data-faq-item>
      <div class="question-block w-dropdown-toggle" data-faq-toggle>
        <p class="body-large color-black">${f.q}</p>
        <div class="faq-icon">+</div>
      </div>
      <nav class="answer-block w-dropdown-list" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${f.a}</p></div>
      </nav>
    </div>
  `).join('');

  // toggle
  container.querySelectorAll('[data-faq-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const answer = toggle.nextElementSibling;
      const isOpen = answer.style.display !== 'none';
      answer.style.display = isOpen ? 'none' : 'block';
    });
  });
}