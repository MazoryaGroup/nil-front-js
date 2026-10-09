
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { waitingListApi, blogsApi, galleryApi } from '../code/api.js';
import { formatDate } from '../code/utils.js';
import '../asset/css/home.css';

// ============================================
// Helpers
// ============================================

const esc = (value = '') => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function getItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function fixImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  const raw = value.trim();

  try {
    if (/^https?:\/\//i.test(raw)) {
      const url = new URL(raw);

      if (
        ['localhost', '127.0.0.1'].includes(url.hostname) &&
        !['localhost', '127.0.0.1'].includes(location.hostname)
      ) {
        return '';
      }

      return url.href;
    }

    if (raw.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(raw)) {
      return '';
    }

    const path = '/' + raw.replace(/^\/+/, '');
    const apiOrigin = new URL(
      import.meta.env.VITE_API_URL || '/api',
      location.origin
    ).origin;

    const origin = /^\/(storage|uploads)\//.test(path)
      ? apiOrigin
      : location.origin;

    return new URL(path, origin).href;
  } catch {
    return '';
  }
}

function imageMarkup(value, alt = '', eager = false) {
  const src = fixImageUrl(value);

  if (!src) {
    return '<div class="nil-image-placeholder">NIL</div>';
  }

  return `
    <img
      src="${esc(src)}"
      alt="${esc(alt)}"
      loading="${eager ? 'eager' : 'lazy'}"
      class="cover-image"
      data-home-image
    />
  `;
}

function bindImageFallbacks(container) {
  container.querySelectorAll('[data-home-image]').forEach(img => {
    const fallback = () => {
      if (!img.isConnected) return;

      const placeholder = document.createElement('div');
      placeholder.className = 'nil-image-placeholder';
      placeholder.textContent = 'NIL';
      img.replaceWith(placeholder);
    };

    img.addEventListener('error', fallback, { once: true });

    if (img.complete && !img.naturalWidth) fallback();
  });
}

function dateLabel(value, isFa) {
  if (!value) return '';

  try {
    return esc(formatDate(value, isFa));
  } catch {
    return '';
  }
}

// ============================================
// Home Page
// ============================================

export async function HomePage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <main class="nil-home">

      <!-- HERO -->
      <div class="hero">
        <section class="hero-section">
          <div class="w-layout-blockcontainer container w-container">
            <div class="hero-wrap">

              <div class="hero-left">
                <div class="hero-avatar"></div>

                <div class="hero-middle">
                  <img
                    src="/img/Hero Left.jpg"
                    loading="eager"
                    alt="NIL Beauty"
                    class="cover-image"
                  />
                </div>

                <p class="line-height-150 capitalize">
                  ${esc(t('hero.tagline'))}
                </p>
              </div>

              <div class="hero-right">

                <div class="hero-image">
                  <img
                    src="/img/Hero Center.jpg"
                    loading="eager"
                    fetchpriority="high"
                    alt="NIL Beauty Salon"
                    class="cover-image"
                  />
                </div>

                <div class="hero-content">
                  <div class="hero-top">

                    <div class="hero-info">
                      <h2 class="color-white">
                        ${esc(t('hero.title'))}
                      </h2>

                      <p class="line-height-150">
                        ${esc(t('hero.description'))}
                      </p>
                    </div>

                    <a
                      href="/login"
                      data-nav-link
                      class="hero-btn w-button"
                    >
                      ${isFa ? 'رزرو نوبت' : 'Book Now'}
                      <span aria-hidden="true">↗</span>
                    </a>

                  </div>

                  <div class="hero-img">
                    <img
                      src="/img/Hero Right.jpg"
                      loading="eager"
                      alt="NIL Beauty Services"
                      class="cover-image"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- CATEGORIES -->
      <section class="section nil-home-categories">
        <div class="w-layout-blockcontainer container w-container">

          <div class="section-title-wrap">
            <div class="title-wrap">
              <div class="subtitle">
                ${esc(t('sections.explore'))}
              </div>

              <h2>${esc(t('sections.categories'))}</h2>
            </div>
          </div>

          <div class="category-wrap" data-categories-wrap>
            <div class="loading-placeholder">
              ${esc(t('common.loading'))}
            </div>
          </div>

        </div>
      </section>

      <!-- ABOUT -->
      <section class="nil-home-about">
        <div class="w-layout-blockcontainer container w-container">

          <div class="about-block">

            <div class="about-img">
              <img
                src="/img/about-img.jpg"
                loading="lazy"
                alt="About NIL"
                class="cover-image"
              />
            </div>

            <div class="about-data">
              <div class="about-top">

                <h2 class="about-title">
                  ${esc(t('about.title'))}
                  <br>
                  ${esc(t('about.title_secondary'))}
                </h2>

                <p class="mx-medium">
                  ${esc(t('about.description'))}
                </p>

                <div class="about-btn">
                  <a
                    href="/about"
                    data-nav-link
                    class="primary-button large w-button"
                  >
                    ${isFa ? 'درباره نیل' : 'About NIL'}
                  </a>
                </div>

              </div>
            </div>

            <div class="about-right">
              <img
                src="/img/about-right.jpg"
                loading="lazy"
                alt="NIL Salon"
                class="cover-image"
              />
            </div>

          </div>
        </div>
      </section>

      <!-- BLOG -->
      <section class="section nil-home-blogs">
        <div class="w-layout-blockcontainer container w-container">

          <div class="section-title-wrap">
            <div class="title-wrap">
              <div class="subtitle">
                ${esc(t('sections.news'))}
              </div>

              <h2>
                ${esc(t('sections.latest_articles'))}
              </h2>
            </div>

            <a
              href="/blog"
              data-nav-link
              class="nil-home-more"
            >
              ${isFa ? 'همه مقالات' : 'All Articles'}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div class="w-dyn-list">
            <div
              role="list"
              class="blog-list w-dyn-items"
              data-blog-list
            >
              <div class="loading-placeholder">
                ${esc(t('common.loading'))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- CTA -->
      <section class="section to-top nil-home-cta">
        <div class="w-layout-blockcontainer container w-container">

          <div class="cta">

            <div class="fill-block">
              <div class="cta-img">
                <img
                  src="/img/cta-image.jpg"
                  loading="lazy"
                  alt="NIL Beauty"
                  class="cover-image"
                />
              </div>
            </div>

            <div class="fill-block">
              <div class="cta-content">

                <div>
                  <h3 class="cta-title">
                    ${esc(t('cta.title'))}
                  </h3>

                  <p class="body-small">
                    ${isFa
                      ? 'از تازه‌ترین اخبار و پیشنهادهای نیل باخبر شو.'
                      : 'Discover the latest NIL news and offers.'}
                  </p>
                </div>

                <div class="cta-form-block w-form">

                  <form class="cta-form" data-cta-form>

                    <input
                      class="cta-field w-input"
                      type="email"
                      name="email"
                      dir="ltr"
                      maxlength="255"
                      autocomplete="email"
                      placeholder="${esc(t('forms.email'))}"
                      aria-label="Email"
                      required
                      data-cta-email
                    />

                    <button
                      type="submit"
                      class="cta-btn w-button"
                      data-cta-submit
                    >
                      ${esc(t('buttons.subscribe'))}
                    </button>

                  </form>

                  <div
                    class="form-message nil-cta-message"
                    data-cta-msg
                    role="status"
                    aria-live="polite"
                    hidden
                  ></div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  `);

  setTimeout(() => {
    const root = document.querySelector('.nil-home');
    if (!root) return;

    initLayout();
    loadCategories(root, isFa);
    loadBlogs(root, isFa);
    initCtaForm(root, isFa);
  }, 100);

  return html;
}

// ============================================
// Categories
// ============================================

async function loadCategories(root, isFa) {
  const container = root.querySelector('[data-categories-wrap]');
  if (!container) return;

  try {
    const response = await galleryApi.categories();

    if (!container.isConnected) return;

    const categories = getItems(response);

    if (!categories.length) {
      container.innerHTML = `
        <p class="nil-home-empty">
          ${isFa ? 'دسته‌بندی موجود نیست' : 'No categories available'}
        </p>
      `;
      return;
    }

    const feature = categories[0];
    const others = categories.slice(1);

    const cardHref = category =>
      `/gallery?category=${encodeURIComponent(category.id)}`;

    container.innerHTML = `
      <div class="category-left w-dyn-list">
        <div role="list" class="categories-wrap w-dyn-items">

          <div role="listitem" class="w-dyn-item">
            <a
              href="${cardHref(feature)}"
              class="feature-category w-inline-block"
              data-nav-link
            >
              <div class="category-text">
                ${esc(feature.name)}
              </div>

              ${imageMarkup(feature.image, feature.name, true)}
            </a>
          </div>

        </div>
      </div>

      <div class="category-right w-dyn-list">
        <div role="list" class="categories-wrap w-dyn-items">

          ${others.map(category => `
            <div role="listitem" class="d-flex w-dyn-item">
              <a
                href="${cardHref(category)}"
                class="category-card w-inline-block"
                data-nav-link
              >
                ${imageMarkup(category.image, category.name)}

                <div class="category-text">
                  ${esc(category.name)}
                </div>
              </a>
            </div>
          `).join('')}

        </div>
      </div>
    `;

    bindImageFallbacks(container);

  } catch (error) {
    if (!container.isConnected) return;

    console.error('Home categories:', error);

    container.innerHTML = `
      <p class="nil-home-error">
        ${isFa
          ? 'خطا در بارگذاری دسته‌بندی‌ها'
          : 'Failed to load categories'}
      </p>
    `;
  }
}

// ============================================
// Latest Blogs
// ============================================

async function loadBlogs(root, isFa) {
  const container = root.querySelector('[data-blog-list]');
  if (!container) return;

  try {
    const response = await blogsApi.list({
      lang: isFa ? 'fa' : 'en'
    });

    if (!container.isConnected) return;

    const blogs = getItems(response).slice(0, 3);

    if (!blogs.length) {
      container.innerHTML = `
        <p class="nil-home-empty">
          ${isFa ? 'مقاله‌ای موجود نیست' : 'No articles available'}
        </p>
      `;
      return;
    }

    container.innerHTML = blogs.map(blog => {
      const title = blog.title_1 ||
        (isFa ? 'بدون عنوان' : 'Untitled');

      const author = typeof blog.author === 'string'
        ? blog.author
        : blog.author?.name || 'NIL';

      const date = dateLabel(blog.date, isFa);

      return `
        <div role="listitem" class="d-flex w-dyn-item">

          <a
            href="/blog/${encodeURIComponent(blog.id)}"
            class="blog-card w-inline-block"
            data-nav-link
          >
            <div class="blog-thumb">
              ${imageMarkup(blog.image_1, title)}
            </div>

            <div class="blog-content">

              <div class="blog-data">
                <div class="blog-category">
                  ${esc(author)}
                </div>

                <div class="body-small">
                  ${date}
                </div>
              </div>

              <h3 class="blog-title">
                ${esc(title)}
              </h3>

            </div>
          </a>

        </div>
      `;
    }).join('');

    bindImageFallbacks(container);

  } catch (error) {
    if (!container.isConnected) return;

    console.error('Home blogs:', error);

    container.innerHTML = `
      <p class="nil-home-error">
        ${isFa
          ? 'خطا در بارگذاری مقالات'
          : 'Failed to load articles'}
      </p>
    `;
  }
}

// ============================================
// Newsletter
// ============================================

function initCtaForm(root, isFa) {
  const form = root.querySelector('[data-cta-form]');
  const emailInput = root.querySelector('[data-cta-email]');
  const submitBtn = root.querySelector('[data-cta-submit]');
  const message = root.querySelector('[data-cta-msg]');

  if (!form || !emailInput || !submitBtn) return;
  if (form.dataset.initialized === 'true') return;

  form.dataset.initialized = 'true';

  let submitting = false;

  function showMessage(text, state = 'info') {
    if (!message) return;

    message.textContent = text;
    message.hidden = !text;
    message.dataset.state = state;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (submitting || !form.reportValidity()) return;

    const email = emailInput.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage(
        isFa ? 'ایمیل معتبر وارد کنید' : 'Enter a valid email',
        'error'
      );
      return;
    }

    submitting = true;
    submitBtn.disabled = true;

    const originalText = submitBtn.textContent;

    submitBtn.textContent = isFa
      ? 'در حال ثبت...'
      : 'Submitting...';

    showMessage(
      isFa ? 'در حال ارسال...' : 'Sending...',
      'info'
    );

    try {
      await waitingListApi.subscribe(email);

      if (!form.isConnected) return;

      showMessage(
        isFa ? 'ایمیل شما ثبت شد ✓' : 'Email registered ✓',
        'success'
      );

      form.reset();

    } catch (error) {
      if (!form.isConnected) return;

      console.error('Newsletter:', error);

      showMessage(
        error.message ||
          (isFa ? 'خطا در ثبت ایمیل' : 'Subscription failed'),
        'error'
      );

    } finally {
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
