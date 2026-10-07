// ============================================
// Blog Single Page
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

export async function BlogSinglePage(params = {}) {
  const isFa = getCurrentLang() === 'fa';
  const blogId = params.id || params.slug;

  const html = Layout(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-card align-center" data-blog-detail>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="blog-single-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer" data-blog-content>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>
      </div>
    </section>
  `);

  setTimeout(() => {
    initLayout();
    loadBlogDetail(blogId, isFa);
  }, 100);

  return html;
}

// ============================================
// لود جزئیات بلاگ
// ============================================
async function loadBlogDetail(id, isFa) {
  const titleEl = document.querySelector('[data-blog-detail]');
  const contentEl = document.querySelector('[data-blog-content]');

  if (!titleEl || !contentEl) return;

  if (!id) {
    titleEl.innerHTML = `<h2>${isFa ? 'مقاله یافت نشد' : 'Blog not found'}</h2>`;
    contentEl.innerHTML = '';
    return;
  }

  try {
    const res = await blogsApi.get(id, isFa ? 'fa' : 'en');
    console.log('📄 Blog detail response:', res);

    const blog = res?.data || res;

    if (!blog || !blog.id) {
      titleEl.innerHTML = `<h2>${isFa ? 'مقاله یافت نشد' : 'Blog not found'}</h2>`;
      contentEl.innerHTML = '';
      return;
    }

    renderBlogDetail(titleEl, contentEl, blog, isFa);

  } catch (err) {
    console.error('❌ Blog detail error:', err);
    titleEl.innerHTML = `<h2 class="text-danger">${isFa ? 'خطا در بارگذاری' : 'Failed to load'}</h2>`;
    contentEl.innerHTML = '';
  }
}

// ============================================
// رندر جزئیات
// ============================================
function renderBlogDetail(titleEl, contentEl, blog, isFa) {
  const title = blog.title_1 || blog.title || 'Untitled';
  const image1 = fixImageUrl(blog.image_1);
  const image2 = fixImageUrl(blog.image_2);

  // Header
  titleEl.innerHTML = `
    <h2>${title}</h2>
    <div class="blog-data small">
      <div class="blog-category">${blog.author || 'Glomin'}</div>
      <div class="blog-line"></div>
      <div class="body-small">${formatDate(blog.date, isFa)}</div>
      ${blog.reading_time ? `
        <div class="blog-line"></div>
        <div class="body-small">${blog.reading_time} ${isFa ? 'دقیقه مطالعه' : 'min read'}</div>
      ` : ''}
    </div>
  `;

  // Content
  let contentHTML = '';

  // عکس اصلی
  if (image1) {
    contentHTML += `
      <div class="blog-main">
        <img src="${image1}" loading="eager" alt="${title}" class="cover-image" />
      </div>
    `;
  }

  // محتوا
  contentHTML += `
    <div class="blog-details">
      <div class="richtext w-richtext">
  `;

  // بخش ۱
  if (blog.description_1) {
    contentHTML += `<p>${blog.description_1}</p>`;
  }

  // بخش ۲
  if (blog.title_2 && blog.title_2.trim()) {
    contentHTML += `
      <h3>${blog.title_2}</h3>
      ${blog.description_2 ? `<p>${blog.description_2}</p>` : ''}
    `;
  }

  // عکس دوم
  if (image2) {
    contentHTML += `
      <figure style="max-width: 1800px" class="w-richtext-align-fullwidth w-richtext-figure-type-image">
        <div>
          <img src="${image2}" loading="lazy" alt="${blog.title_2 || 'Media'}" />
        </div>
      </figure>
    `;
  }

  // بخش ۳
  if (blog.title_3 && blog.title_3.trim()) {
    contentHTML += `
      <h3>${blog.title_3}</h3>
      ${blog.description_3 ? `<p>${blog.description_3}</p>` : ''}
    `;
  }

  contentHTML += `
      </div>
    </div>
  `;

  contentEl.innerHTML = contentHTML;
}