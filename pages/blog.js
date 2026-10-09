
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { blogsApi } from '../code/api.js';
import { formatDate } from '../code/utils.js';

// ============================================
// Helpers
// ============================================

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fixImageUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const value = url.trim();

  if (!value) return '';

  // Absolute URLs returned by Laravel
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);

      // Never load an API image from the visitor's localhost.
      if (
        ['localhost', '127.0.0.1'].includes(
          parsed.hostname.toLowerCase()
        ) &&
        !['localhost', '127.0.0.1'].includes(
          window.location.hostname.toLowerCase()
        )
      ) {
        return '';
      }

      return parsed.href;
    } catch {
      return '';
    }
  }

  // Protocol-relative URLs
  if (value.startsWith('//')) {
    return window.location.protocol + value;
  }

  // Prevent unsafe URL schemes
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return '';
  }

  // Use configurable API origin for relative storage paths
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  try {
    const apiUrl = new URL(apiBase, window.location.origin);

    const path = value.startsWith('/')
      ? value
      : '/' + value;

    // If backend returns a relative storage path
    if (
      path.startsWith('/storage/') ||
      path.startsWith('/uploads/')
    ) {
      return new URL(path, apiUrl.origin).href;
    }

    return new URL(path, window.location.origin).href;
  } catch {
    return '';
  }
}

function truncate(value, max = 200) {
  const text = String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .trim();

  if (text.length <= max) return text;

  return text.slice(0, max).trimEnd() + '...';
}

function getBlogsArray(response) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // Laravel pagination response
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}

function getBlogImage(blog) {
  return fixImageUrl(blog?.image_1);
}

function renderImage(blog, loading = 'lazy') {
  const image = getBlogImage(blog);
  const title = escapeHtml(blog?.title_1 || '');

  if (!image) {
    return `
      <div class="blog-image-placeholder"
           aria-label="${title}">
        <span>NIL</span>
      </div>
    `;
  }

  return `
    <img
      src="${escapeHtml(image)}"
      loading="${loading}"
      alt="${title}"
      class="cover-image"
      data-blog-image
    />
  `;
}

function bindImageFallbacks(container) {
  container.querySelectorAll('[data-blog-image]')
    .forEach(img => {
      img.addEventListener('error', () => {
        const placeholder = document.createElement('div');

        placeholder.className = 'blog-image-placeholder';
        placeholder.setAttribute(
          'aria-label',
          img.alt || 'Blog image'
        );

        const label = document.createElement('span');
        label.textContent = 'NIL';

        placeholder.appendChild(label);
        img.replaceWith(placeholder);
      }, { once: true });
    });
}

// ============================================
// Blog Page
// ============================================

export async function BlogPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">
            ${isFa ? 'مقالات' : 'BLOGS'}
          </div>

          <h1>${escapeHtml(t('sections.latest_articles'))}</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer">

          <div class="w-dyn-list">
            <div role="list" class="w-dyn-items">

              <div
                role="listitem"
                class="w-dyn-item"
                data-feature-blog
              >
                <div class="loading-placeholder">
                  ${escapeHtml(t('common.loading'))}
                </div>
              </div>

            </div>
          </div>

          <div class="w-dyn-list">
            <div
              role="list"
              class="blog-list w-dyn-items"
              data-blog-list
            >
              <div class="loading-placeholder">
                ${escapeHtml(t('common.loading'))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `);

  setTimeout(() => {
    const featureContainer = document.querySelector(
      '[data-feature-blog]'
    );

    const listContainer = document.querySelector(
      '[data-blog-list]'
    );

    if (!featureContainer || !listContainer) return;

    initLayout();

    loadBlogs(isFa, featureContainer, listContainer);
  }, 100);

  return html;
}

// ============================================
// Load Blogs
// ============================================

async function loadBlogs(
  isFa,
  featureContainer,
  listContainer
) {
  const isCurrentPage = () =>
    featureContainer.isConnected &&
    listContainer.isConnected;

  try {
    const res = await blogsApi.list({
      lang: isFa ? 'fa' : 'en'
    });

    if (!isCurrentPage()) return;

    console.log('📝 Blogs response:', res);

    const blogs = getBlogsArray(res);

    if (!blogs.length) {
      featureContainer.innerHTML = `
        <p>
          ${isFa
            ? 'مقاله‌ای موجود نیست'
            : 'No blogs available'}
        </p>
      `;

      listContainer.innerHTML = '';
      return;
    }

    const feature = blogs[0];
    const others = blogs.slice(1);

    renderFeatureBlog(featureContainer, feature, isFa);
    renderBlogList(listContainer, others, isFa);

    bindImageFallbacks(featureContainer);
    bindImageFallbacks(listContainer);

  } catch (error) {
    if (!isCurrentPage()) return;

    console.error('❌ Blogs error:', error);

    featureContainer.innerHTML = `
      <p>
        ${isFa
          ? 'خطا در دریافت مقالات'
          : 'Failed to load articles'}
      </p>
    `;

    listContainer.innerHTML = '';
  }
}

// ============================================
// Feature Blog
// ============================================

function renderFeatureBlog(container, blog, isFa) {
  const id = encodeURIComponent(blog.id);

  const title = escapeHtml(
    blog.title_1 || (isFa ? 'بدون عنوان' : 'Untitled')
  );

  const description = escapeHtml(
    truncate(blog.description_1, 200)
  );

  const author = escapeHtml(
    blog.author || 'NIL'
  );

  const date = escapeHtml(
    blog.date ? formatDate(blog.date, isFa) : ''
  );

  container.innerHTML = `
    <a
      href="/blog/${id}"
      class="blog-wrap w-inline-block"
      data-nav-link
    >

      <div class="feature-img">
        ${renderImage(blog, 'eager')}
      </div>

      <div class="feature-content">
        <div class="blog-content">

          <div class="blog-data">
            <div class="blog-category">
              ${author}
            </div>

            <div class="body-small">
              ${date}
            </div>
          </div>

          <h3 class="blog-title">
            ${title}
          </h3>

          <p>${description}</p>

        </div>

        <div class="secondary-button">
          ${escapeHtml(t('buttons.read_more'))}
        </div>

      </div>
    </a>
  `;
}

// ============================================
// Blog List
// ============================================

function renderBlogList(container, blogs, isFa) {
  if (!blogs.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = blogs.map(blog => {
    const id = encodeURIComponent(blog.id);

    const title = escapeHtml(
      blog.title_1 || (isFa ? 'بدون عنوان' : 'Untitled')
    );

    const author = escapeHtml(
      blog.author || 'NIL'
    );

    const date = escapeHtml(
      blog.date ? formatDate(blog.date, isFa) : ''
    );

    return `
      <div role="listitem" class="d-flex w-dyn-item">

        <a
          href="/blog/${id}"
          class="blog-card w-inline-block"
          data-nav-link
        >

          <div class="blog-thumb">
            ${renderImage(blog)}
          </div>

          <div class="blog-content">

            <div class="blog-data">
              <div class="blog-category">
                ${author}
              </div>

              <div class="body-small">
                ${date}
              </div>
            </div>

            <h3 class="blog-title">
              ${title}
            </h3>

          </div>
        </a>
      </div>
    `;
  }).join('');
}
