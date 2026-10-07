// ============================================
// Blog List Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { blogsApi } from '../code/api.js';
import { formatDate } from '../code/utils.js';

// ✅ حذف localhost و مسیر Laravel از URL عکس‌ها
function fixImageUrl(url) {
  if (!url) return '';

  if (url.startsWith('http://localhost')) {
    return url
      .replace(/^http:\/\/localhost\/nil-back\/public/, '')
      .replace(/^http:\/\/localhost/, '');
  }

  if (url.startsWith('/')) {
    return url;
  }

  return '/' + url;
}

// ✅ این export خیلی مهمه
export async function BlogPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${isFa ? 'مقالات' : 'BLOGS'}</div>
          <h1>${t('sections.latest_articles')}</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer">
          <div class="w-dyn-list">
            <div role="list" class="w-dyn-items">
              <div role="listitem" class="w-dyn-item" data-feature-blog>
                <div class="loading-placeholder">${t('common.loading')}</div>
              </div>
            </div>
          </div>

          <div class="w-dyn-list">
            <div role="list" class="blog-list w-dyn-items" data-blog-list>
              <div class="loading-placeholder">${t('common.loading')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `);

  setTimeout(() => {
    initLayout();
    loadBlogs(isFa);
  }, 100);

  return html;
}

async function loadBlogs(isFa) {
  const featureContainer = document.querySelector('[data-feature-blog]');
  const listContainer = document.querySelector('[data-blog-list]');
  if (!featureContainer || !listContainer) return;

  try {
    const res = await blogsApi.list({ lang: isFa ? 'fa' : 'en' });
    console.log('📝 Blogs response:', res);

    const blogs = res.data || [];

    if (blogs.length === 0) {
      featureContainer.innerHTML = `<p>${isFa ? 'مقاله‌ای موجود نیست' : 'No blogs available'}</p>`;
      listContainer.innerHTML = '';
      return;
    }

    const feature = blogs[0];
    const others = blogs.slice(1);

    renderFeatureBlog(featureContainer, feature, isFa);
    renderBlogList(listContainer, others, isFa);
  } catch (err) {
    console.error('❌ Blogs error:', err);
    featureContainer.innerHTML = `<p>${isFa ? 'خطا' : 'Error'}</p>`;
    listContainer.innerHTML = '';
  }
}

function renderFeatureBlog(container, blog, isFa) {
  const image = fixImageUrl(blog.image_1);
  const title = blog.title_1 || 'Untitled';

  container.innerHTML = `
    <a href="/blog/${blog.id}" class="blog-wrap w-inline-block" data-nav-link>
      <div class="feature-img">
        <img src="${image}" loading="eager" alt="${title}" class="cover-image" />
      </div>
      <div class="feature-content">
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${blog.author || 'Glomin'}</div>
            <div class="body-small">${formatDate(blog.date, isFa)}</div>
          </div>
          <h3 class="blog-title">${title}</h3>
          <p>${truncate(blog.description_1 || '', 200)}</p>
        </div>
        <div class="secondary-button">${t('buttons.read_more')}</div>
      </div>
    </a>
  `;
}

function renderBlogList(container, blogs, isFa) {
  if (blogs.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = blogs.map(b => `
    <div role="listitem" class="d-flex w-dyn-item">
      <a href="/blog/${b.id}" class="blog-card w-inline-block" data-nav-link>
        <div class="blog-thumb">
          <img src="${fixImageUrl(b.image_1)}" loading="lazy" alt="${b.title_1 || ''}" class="cover-image" />
        </div>
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${b.author || 'Glomin'}</div>
            <div class="body-small">${formatDate(b.date, isFa)}</div>
          </div>
          <h3 class="blog-title">${b.title_1 || 'Untitled'}</h3>
        </div>
      </a>
    </div>
  `).join('');
}

function truncate(str, max) {
  if (!str) return '';
  if (str.length <= max) return str;
  return str.substring(0, max).trim() + '...';
}