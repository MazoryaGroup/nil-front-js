// ============================================
// Gallery Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { apiGet } from '../code/api.js';

const STORAGE_URL = 'https://demo2.mazoryagroup.ir/storage';

export async function GalleryPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${isFa ? 'نمونه کارها' : 'PORTFOLIO'}</div>
          <h1>${isFa ? 'گالری' : 'Gallery'}</h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="w-layout-blockcontainer container w-container">

        <!-- فیلتر دسته‌بندی -->
        <div class="gallery-filters" data-gallery-filters>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>

        <!-- گرید گالری -->
        <div class="gallery-grid" data-gallery-grid>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>

      </div>
    </section>

    <!-- Lightbox -->
    <div class="gallery-lightbox" data-lightbox style="display:none">
      <div class="gallery-lightbox-backdrop" data-lightbox-close></div>
      <button class="gallery-lightbox-close" data-lightbox-close>✕</button>
      <img src="" alt="" class="gallery-lightbox-img" data-lightbox-img />
    </div>
  `);

  setTimeout(() => {
    initLayout();
    initGallery(isFa);
  }, 100);

  return html;
}

// ============================================
// Gallery Logic
// ============================================
function initGallery(isFa) {
  let currentCategoryId = null;

  const filtersEl = document.querySelector('[data-gallery-filters]');
  const gridEl = document.querySelector('[data-gallery-grid]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');

  // ---------- لود اولیه ----------
  loadCategories();
  loadGallery(null);

  // ============================================
  // لود دسته‌بندی‌ها
  // ============================================
  async function loadCategories() {
    try {
      const res = await apiGet('/v1/gallery/categories');
      console.log('📁 Categories response:', res);

      const categories = res.data || [];

      // دکمه "همه" + دسته‌ها
      const allBtn = `
        <button class="gallery-filter-btn active" data-category="all">
          ${isFa ? 'همه' : 'All'}
        </button>
      `;

      const catBtns = categories.map(cat => `
        <button class="gallery-filter-btn" data-category="${cat.id}">
          ${cat.name}
        </button>
      `).join('');

      filtersEl.innerHTML = allBtn + catBtns;

      // Listenerها
      filtersEl.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
          filtersEl.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const cat = btn.dataset.category;
          currentCategoryId = cat === 'all' ? null : cat;
          loadGallery(currentCategoryId);
        });
      });
    } catch (err) {
      console.error('❌ Categories error:', err);
      filtersEl.innerHTML = `<p>${isFa ? 'خطا در بارگذاری دسته‌ها' : 'Failed to load categories'}</p>`;
    }
  }

  // ============================================
  // لود تصاویر گالری
  // ============================================
  async function loadGallery(categoryId) {
    gridEl.innerHTML = `<div class="loading-placeholder">${t('common.loading')}</div>`;

    try {
      // اگه دسته انتخاب شده، فیلتر کن
      const endpoint = categoryId
        ? `/v1/gallery?category_id=${categoryId}`
        : '/v1/gallery';

      const res = await apiGet(endpoint);
      console.log('🖼️ Gallery response:', res);

      const items = res.data || [];

      if (items.length === 0) {
        gridEl.innerHTML = `
          <div class="gallery-empty">
            <p>${isFa ? 'تصویری در این دسته وجود ندارد' : 'No images in this category'}</p>
          </div>
        `;
        return;
      }

      gridEl.innerHTML = items.map(item => {
        const imageUrl = buildImageUrl(item.image);
        return `
          <div class="gallery-item" data-image="${imageUrl}" data-title="${item.title || ''}">
            <div class="gallery-item-img">
              <img src="${imageUrl}" loading="lazy" alt="${item.title || ''}" />
            </div>
            <div class="gallery-item-info">
              <h3 class="gallery-item-title">${item.title || ''}</h3>
              <div class="gallery-item-category">${item.category?.name || ''}</div>
            </div>
          </div>
        `;
      }).join('');

      // Listener برای Lightbox
      gridEl.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
          openLightbox(item.dataset.image, item.dataset.title);
        });
      });

    } catch (err) {
      console.error('❌ Gallery error:', err);
      gridEl.innerHTML = `<p>${isFa ? 'خطا در بارگذاری گالری' : 'Failed to load gallery'}</p>`;
    }
  }

  // ============================================
  // ساخت URL تصویر
  // ============================================
  function buildImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${STORAGE_URL}/${imagePath}`;
  }

  // ============================================
  // Lightbox
  // ============================================
  function openLightbox(imageUrl, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imageUrl;
    lightboxImg.alt = title || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
}