// ============================================
// Blog Single Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { apiGet } from '../code/api.js';
import { t } from '../code/i18n.js';

export async function BlogSinglePage(params) {
  const { slug } = params;

  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-card align-center" data-blog-detail>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    loadBlogDetail(slug);
  });

  return html;
}

async function loadBlogDetail(slug) {
  const container = document.querySelector('[data-blog-detail]');
  if (!container) return;

  try {
    // TODO: const blog = await apiGet(`/blogs/${slug}`);
    const blog = {
      title: 'Sample Blog Title',
      category: 'Skincare',
      date: '2024-08-23',
      content: '<p>Blog content goes here...</p>'
    };

    container.innerHTML = `
      <h2>${blog.title}</h2>
      <div class="blog-data small">
        <div class="blog-category">${blog.category}</div>
        <div class="blog-line"></div>
        <div class="body-small">${blog.date}</div>
      </div>
      <div class="blog-details">
        <div class="richtext w-richtext">${blog.content}</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p>${t('common.error')}</p>`;
  }
}