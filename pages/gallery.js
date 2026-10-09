
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { galleryApi } from '../code/api.js';

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
    // Absolute URL
    if (/^https?:\/\//i.test(value)) {
      const parsed = new URL(value);

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

    // Protocol-relative URL
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

function getArray(response) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}

// ============================================
// Gallery Page
// ============================================

export async function GalleryPage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">
            ${isFa ? 'نمونه کارها' : 'PORTFOLIO'}
          </div>
          <h1>${isFa ? 'گالری' : 'Gallery'}</h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="w-layout-blockcontainer container w-container">

        <div class="gallery-filters" data-gallery-filters>
          <div class="loading-placeholder">
            ${escapeHtml(t('common.loading'))}
          </div>
        </div>

        <div class="gallery-grid" data-gallery-grid>
          <div class="loading-placeholder">
            ${escapeHtml(t('common.loading'))}
          </div>
        </div>

      </div>
    </section>

    <div
      class="gallery-lightbox"
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label="${isFa ? 'نمایش تصویر' : 'Image preview'}"
      style="display:none"
    >
      <div
        class="gallery-lightbox-backdrop"
        data-lightbox-close
      ></div>

      <button
        type="button"
        class="gallery-lightbox-close"
        data-lightbox-close
        aria-label="${isFa ? 'بستن' : 'Close'}"
      >
        ✕
      </button>

      <img
        src=""
        alt=""
        class="gallery-lightbox-img"
        data-lightbox-img
      />
    </div>
  `);

  setTimeout(() => {
    const gridEl = document.querySelector(
      '[data-gallery-grid]'
    );

    if (!gridEl) return;

    initLayout();
    initGallery(isFa);
  }, 100);

  return html;
}

// ============================================
// Gallery Logic
// ============================================

function initGallery(isFa) {
  const filtersEl = document.querySelector(
    '[data-gallery-filters]'
  );

  const gridEl = document.querySelector(
    '[data-gallery-grid]'
  );

  const lightbox = document.querySelector(
    '[data-lightbox]'
  );

  const lightboxImg = document.querySelector(
    '[data-lightbox-img]'
  );

  if (!filtersEl || !gridEl || !lightbox || !lightboxImg) {
    return;
  }

  let currentCategoryId = null;
  let galleryRequestId = 0;
  let previousFocusedElement = null;
  let previousBodyOverflow = '';

  const closeButton = lightbox.querySelector(
    '.gallery-lightbox-close'
  );

  const isCurrentPage = () =>
    filtersEl.isConnected &&
    gridEl.isConnected &&
    lightbox.isConnected;

  // ============================================
  // Categories
  // ============================================

  async function loadCategories() {
    try {
      const response = await galleryApi.categories();

      if (!isCurrentPage()) return;

      const categories = getArray(response);

      filtersEl.innerHTML = `
        <button
          type="button"
          class="gallery-filter-btn active"
          data-category="all"
          aria-pressed="true"
        >
          ${isFa ? 'همه' : 'All'}
        </button>

        ${categories.map(category => `
          <button
            type="button"
            class="gallery-filter-btn"
            data-category="${escapeHtml(category.id)}"
            aria-pressed="false"
          >
            ${escapeHtml(category.name)}
          </button>
        `).join('')}
      `;

    } catch (error) {
      if (!isCurrentPage()) return;

      console.error('❌ Categories error:', error);

      filtersEl.innerHTML = `
        <p>
          ${isFa
            ? 'خطا در بارگذاری دسته‌بندی‌ها'
            : 'Failed to load categories'}
        </p>
      `;
    }
  }

  // ============================================
  // Gallery Items
  // ============================================

  async function loadGallery(categoryId = null) {
    const requestId = ++galleryRequestId;

    gridEl.innerHTML = `
      <div class="loading-placeholder">
        ${escapeHtml(t('common.loading'))}
      </div>
    `;

    try {
      const response = await galleryApi.list(categoryId);

      if (
        !isCurrentPage() ||
        requestId !== galleryRequestId
      ) {
        return;
      }

      const items = getArray(response);

      if (!items.length) {
        gridEl.innerHTML = `
          <div class="gallery-empty">
            <p>
              ${isFa
                ? 'تصویری در این دسته وجود ندارد'
                : 'No images in this category'}
            </p>
          </div>
        `;
        return;
      }

      gridEl.innerHTML = items.map(item => {
        const imageUrl = fixImageUrl(item.image);
        const title = escapeHtml(item.title || '');
        const category = escapeHtml(
          item.category?.name || ''
        );

        if (!imageUrl) return '';

        return `
          <div
            class="gallery-item"
            role="button"
            tabindex="0"
            data-image="${escapeHtml(imageUrl)}"
            data-title="${title}"
            aria-label="${title || (isFa ? 'نمایش تصویر' : 'View image')}"
          >

            <div class="gallery-item-img">
              <img
                src="${escapeHtml(imageUrl)}"
                loading="lazy"
                alt="${title}"
              />
            </div>

            <div class="gallery-item-info">
              <h3 class="gallery-item-title">
                ${title}
              </h3>

              <div class="gallery-item-category">
                ${category}
              </div>
            </div>

          </div>
        `;
      }).join('');

    } catch (error) {
      if (
        !isCurrentPage() ||
        requestId !== galleryRequestId
      ) {
        return;
      }

      console.error('❌ Gallery error:', error);

      gridEl.innerHTML = `
        <p>
          ${isFa
            ? 'خطا در بارگذاری گالری'
            : 'Failed to load gallery'}
        </p>
      `;
    }
  }

  // ============================================
  // Filters (Event Delegation)
  // ============================================

  filtersEl.addEventListener('click', event => {
    const button = event.target.closest(
      '[data-category]'
    );

    if (!button || !filtersEl.contains(button)) {
      return;
    }

    const categoryId = button.dataset.category;

    if (
      categoryId === 'all' &&
      currentCategoryId === null
    ) {
      return;
    }

    if (categoryId === String(currentCategoryId)) {
      return;
    }

    currentCategoryId =
      categoryId === 'all' ? null : categoryId;

    filtersEl.querySelectorAll('[data-category]')
      .forEach(item => {
        const active = item === button;

        item.classList.toggle('active', active);
        item.setAttribute(
          'aria-pressed',
          String(active)
        );
      });

    loadGallery(currentCategoryId);
  });

  // ============================================
  // Lightbox
  // ============================================

  function openLightbox(imageUrl, title = '') {
    if (!imageUrl || !isCurrentPage()) return;

    previousFocusedElement = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;

    lightboxImg.src = imageUrl;
    lightboxImg.alt = title;

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    closeButton?.focus();
  }

  function closeLightbox() {
    if (lightbox.style.display !== 'flex') return;

    lightbox.style.display = 'none';
    lightboxImg.removeAttribute('src');

    document.body.style.overflow = previousBodyOverflow;

    if (previousFocusedElement?.isConnected) {
      previousFocusedElement.focus();
    }
  }

  gridEl.addEventListener('click', event => {
    const item = event.target.closest('.gallery-item');

    if (!item || !gridEl.contains(item)) return;

    openLightbox(
      item.dataset.image,
      item.dataset.title
    );
  });

  gridEl.addEventListener('keydown', event => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return;
    }

    const item = event.target.closest('.gallery-item');

    if (!item || !gridEl.contains(item)) return;

    event.preventDefault();

    openLightbox(
      item.dataset.image,
      item.dataset.title
    );
  });

  lightbox.addEventListener('click', event => {
    if (event.target.closest('[data-lightbox-close]')) {
      closeLightbox();
    }
  });

  const handleKeydown = event => {
    if (!isCurrentPage()) {
      document.removeEventListener(
        'keydown',
        handleKeydown
      );
      return;
    }

    if (lightbox.style.display !== 'flex') return;

    if (event.key === 'Escape') {
      closeLightbox();
    }

    // Keep keyboard focus inside the dialog
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton?.focus();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  // Close lightbox when the SPA navigates away
  const handlePageChange = () => {
    if (!isCurrentPage()) {
      document.body.style.overflow =
        previousBodyOverflow;

      document.removeEventListener(
        'keydown',
        handleKeydown
      );

      window.removeEventListener(
        'pageChanged',
        handlePageChange
      );
    }
  };

  window.addEventListener(
    'pageChanged',
    handlePageChange
  );

  // ============================================
  // Initial Load
  // ============================================

  loadCategories();
  loadGallery(null);
}
