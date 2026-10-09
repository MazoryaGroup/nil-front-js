
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

  try {
    // Full URL
    if (/^https?:\/\//i.test(value)) {
      const parsed = new URL(value);

      // Don't use localhost URLs on production
      const localHosts = ['localhost', '127.0.0.1'];

      if (
        localHosts.includes(parsed.hostname.toLowerCase()) &&
        !localHosts.includes(
          window.location.hostname.toLowerCase()
        )
      ) {
        return '';
      }

      return parsed.href;
    }

    if (value.startsWith('//')) {
      return window.location.protocol + value;
    }

    // Reject unsafe schemes
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
      return '';
    }

    const apiBase = new URL(
      import.meta.env.VITE_API_URL || '/api',
      window.location.origin
    );

    const path = value.startsWith('/')
      ? value
      : '/' + value;

    if (
      path.startsWith('/storage/') ||
      path.startsWith('/uploads/')
    ) {
      return new URL(path, apiBase.origin).href;
    }

    return new URL(path, window.location.origin).href;
  } catch {
    return '';
  }
}

function formatBlogDate(date, isFa) {
  if (!date) return '';

  try {
    return formatDate(date, isFa) || '';
  } catch {
    return '';
  }
}

function renderBlogImage(url, alt, loading = 'lazy') {
  const src = fixImageUrl(url);

  if (!src) return '';

  return `
    <img
      src="${escapeHtml(src)}"
      loading="${loading}"
      alt="${escapeHtml(alt)}"
      class="cover-image"
      data-blog-image
    />
  `;
}

/*
 * Article descriptions are treated as plain text.
 * This prevents API content from injecting HTML/scripts.
 *
 * If Laravel deliberately returns rich HTML,
 * use an HTML sanitizer such as DOMPurify instead.
 */
function renderDescription(value) {
  if (!value) return '';

  const text = escapeHtml(value).replace(/\r\n?/g, '\n');

  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(paragraph => `
      <p>${paragraph.replace(/\n/g, '<br>')}</p>
    `)
    .join('');
}

function bindImageFallbacks(container) {
  container.querySelectorAll('[data-blog-image]')
    .forEach(image => {
      const handleError = () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'blog-image-placeholder';

        const label = document.createElement('span');
        label.textContent = 'NIL';

        placeholder.appendChild(label);
        image.replaceWith(placeholder);
      };

      image.addEventListener('error', handleError, {
        once: true
      });

      if (image.complete && image.naturalWidth === 0) {
        handleError();
      }
    });
}

// ============================================
// Page
// ============================================

export async function BlogSinglePage(params = {}) {
  const isFa = getCurrentLang() === 'fa';
  const blogId = params.id ?? params.slug;

  const html = Layout(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div
          class="blog-card align-center"
          data-blog-detail
        >
          <div class="loading-placeholder">
            ${escapeHtml(t('common.loading'))}
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="blog-single-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer" data-blog-content>
          <div class="loading-placeholder">
            ${escapeHtml(t('common.loading'))}
          </div>
        </div>
      </div>
    </section>
  `);

  setTimeout(() => {
    const titleEl = document.querySelector(
      '[data-blog-detail]'
    );

    const contentEl = document.querySelector(
      '[data-blog-content]'
    );

    if (!titleEl || !contentEl) return;

    initLayout();
    loadBlogDetail(blogId, isFa, titleEl, contentEl);
  }, 100);

  return html;
}

// ============================================
// Load Blog Detail
// ============================================

async function loadBlogDetail(
  id,
  isFa,
  titleEl,
  contentEl
) {
  const isCurrentPage = () =>
    titleEl.isConnected && contentEl.isConnected;

  const showNotFound = () => {
    titleEl.innerHTML = `
      <h2>
        ${isFa ? 'مقاله یافت نشد' : 'Blog not found'}
      </h2>
    `;

    contentEl.innerHTML = '';
  };

  if (id === null || id === undefined || id === '') {
    showNotFound();
    return;
  }

  try {
    const res = await blogsApi.get(
      id,
      isFa ? 'fa' : 'en'
    );

    if (!isCurrentPage()) return;

    console.log('📄 Blog detail response:', res);

    const blog = res?.data || res;

    if (
      !blog ||
      typeof blog !== 'object' ||
      Array.isArray(blog) ||
      !blog.id
    ) {
      showNotFound();
      return;
    }

    renderBlogDetail(titleEl, contentEl, blog, isFa);

  } catch (error) {
    if (!isCurrentPage()) return;

    console.error('❌ Blog detail error:', error);

    titleEl.innerHTML = `
      <h2 class="text-danger">
        ${isFa
          ? 'خطا در بارگذاری مقاله'
          : 'Failed to load article'}
      </h2>
    `;

    contentEl.innerHTML = '';
  }
}

// ============================================
// Render Blog Detail
// ============================================

function renderBlogDetail(
  titleEl,
  contentEl,
  blog,
  isFa
) {
  const title = escapeHtml(
    blog.title_1 || blog.title ||
    (isFa ? 'بدون عنوان' : 'Untitled')
  );

  const author = escapeHtml(
    blog.author || 'NIL'
  );

  const date = escapeHtml(
    formatBlogDate(blog.date, isFa)
  );

  const readingTime = Number(blog.reading_time);

  // Header
  titleEl.innerHTML = `
    <h2>${title}</h2>

    <div class="blog-data small">
      <div class="blog-category">
        ${author}
      </div>

      ${date ? `
        <div class="blog-line"></div>
        <div class="body-small">
          ${date}
        </div>
      ` : ''}

      ${Number.isFinite(readingTime) && readingTime > 0 ? `
        <div class="blog-line"></div>
        <div class="body-small">
          ${escapeHtml(readingTime)}
          ${isFa ? 'دقیقه مطالعه' : 'min read'}
        </div>
      ` : ''}
    </div>
  `;

  let contentHTML = '';

  // Main image
  if (blog.image_1) {
    const imageHTML = renderBlogImage(
      blog.image_1,
      blog.title_1 || blog.title || '',
      'eager'
    );

    if (imageHTML) {
      contentHTML += `
        <div class="blog-main">
          ${imageHTML}
        </div>
      `;
    }
  }

  contentHTML += `
    <div class="blog-details">
      <div class="richtext w-richtext">
  `;

  // Section 1
  if (blog.description_1) {
    contentHTML += renderDescription(
      blog.description_1
    );
  }

  // Section 2
  if (blog.title_2) {
    contentHTML += `
      <h3>${escapeHtml(blog.title_2)}</h3>
    `;
  }

  if (blog.description_2) {
    contentHTML += renderDescription(
      blog.description_2
    );
  }

  // Second image
  if (blog.image_2) {
    const imageHTML = renderBlogImage(
      blog.image_2,
      blog.title_2 || blog.title_1 || 'Media'
    );

    if (imageHTML) {
      contentHTML += `
        <figure
          style="max-width:1800px"
          class="w-richtext-align-fullwidth w-richtext-figure-type-image"
        >
          <div>
            ${imageHTML}
          </div>
        </figure>
      `;
    }
  }

  // Section 3
  if (blog.title_3) {
    contentHTML += `
      <h3>${escapeHtml(blog.title_3)}</h3>
    `;
  }

  if (blog.description_3) {
    contentHTML += renderDescription(
      blog.description_3
    );
  }

  contentHTML += `
      </div>
    </div>
  `;

  contentEl.innerHTML = contentHTML;

  bindImageFallbacks(contentEl);
}
