// ============================================
// Home Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { waitingListApi, blogsApi, galleryApi } from '../code/api.js';
import { formatDate } from '../code/utils.js';

// ✅ حذف localhost از URL عکس‌ها
function fixImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://localhost')) {
    return url
      .replace(/^http:\/\/localhost\/nil-back\/public/, '')
      .replace(/^http:\/\/localhost/, '');
  }
  if (url.startsWith('/')) return url;
  return '/' + url;
}

export async function HomePage() {
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <!-- HERO -->
    <div class="hero">
      <section class="hero-section">
        <div class="w-layout-blockcontainer container w-container">
          <div class="hero-wrap">
            <div class="hero-left">
              <div class="hero-avatar"></div>
              <div class="hero-middle">
                <img src="/img/Hero Left.jpg" loading="eager" alt="Hero Left" class="cover-image" />
              </div>
              <p class="line-height-150 capitalize">${t('hero.tagline')}</p>
            </div>
            <div class="hero-right">
              <div class="hero-image">
                <img src="/img/Hero Center.jpg" loading="eager" alt="Hero Center" class="cover-image" />
              </div>
              <div class="hero-content">
                <div class="hero-top">
                  <div class="hero-info">
                    <h2 class="color-white">${t('hero.title')}</h2>
                    <p class="line-height-150">${t('hero.description')}</p>
                  </div>
                  <a href="/login" class="hero-btn w-button">${t('hero.shop_now')}</a>
                </div>
                <div class="hero-img">
                  <img src="/img/Hero Right.jpg" loading="eager" alt="Hero Right" class="cover-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- CATEGORIES — از Gallery API -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="section-title-wrap">
          <div class="title-wrap">
            <div class="subtitle">${t('sections.explore')}</div>
            <h2>${t('sections.categories')}</h2>
          </div>
        </div>
        <div class="category-wrap" data-categories-wrap>
          <div class="loading-placeholder">${t('common.loading')}</div>
        </div>
      </div>
    </section>

    <!-- ABOUT BLOCK -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="about-block">
          <div class="about-img">
            <img src="/img/about-img.jpg" loading="lazy" alt="About" class="cover-image" />
          </div>
          <div class="about-data">
            <div class="about-top">
              <h1 class="about-title">Your ultimate destination for premium beauty <br>products</h1>
              <p class="mx-medium">Where your beauty journey begins. At Beauty Bliss, we believe that every individual deserves to feel confident and radiant.</p>
              <div class="about-btn">
                <a href="/about" class="primary-button large w-button" data-nav-link>${t('buttons.about_glomin')}</a>
              </div>
            </div>
          </div>
          <div class="about-right">
            <img src="/img/about-right.jpg" loading="lazy" alt="About Right" class="cover-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- BLOG — از API -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div>
          <div class="section-title-wrap">
            <div class="title-wrap">
              <div class="subtitle">${t('sections.news')}</div>
              <h2>${t('sections.latest_articles')}</h2>
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

    <!-- CTA -->
    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="cta">
          <div class="fill-block">
            <div class="cta-img">
              <img src="/img/cta-image.jpg" loading="lazy" alt="CTA" class="cover-image" />
            </div>
          </div>
          <div class="fill-block">
            <div class="cta-content">
              <div>
                <h3 class="cta-title">${t('cta.title')}</h3>
                <p class="body-small">${t('cta.free_shipping')}</p>
              </div>
              <div class="cta-form-block w-form">
                <div class="cta-form" data-cta-form>
                  <input
                    class="cta-field w-input"
                    name="email"
                    placeholder="${t('forms.email')}"
                    type="email"
                    dir="ltr"
                    data-cta-email
                  />
                  <button
                    type="button"
                    class="cta-btn w-button"
                    data-cta-submit
                  >${t('buttons.subscribe')}</button>
                </div>
                <div class="form-message" data-cta-msg></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

   
  `);

  setTimeout(() => {
    initLayout();
    loadCategories(isFa);
    loadBlogs(isFa);
    loadGallery();
    initCtaForm(isFa);
  }, 100);

  return html;
}

// ============================================
// دسته‌بندی‌ها — از Gallery API
// ============================================
async function loadCategories(isFa) {
  const container = document.querySelector('[data-categories-wrap]');
  if (!container) return;

  try {
    const res = await galleryApi.categories();
    console.log('📁 Categories response:', res);

    const categories = res.data || [];

    if (categories.length === 0) {
      container.innerHTML = `<p>${isFa ? 'دسته‌ای موجود نیست' : 'No categories'}</p>`;
      return;
    }

    const feature = categories[0];
    const others = categories.slice(1);
    const featureImage = fixImageUrl(feature.image);

    container.innerHTML = `
      <div class="category-left w-dyn-list">
        <div role="list" class="categories-wrap w-dyn-items">
          <div role="listitem" class="w-dyn-item">
            <a href="/gallery?category=${feature.id}" class="feature-category w-inline-block" data-nav-link>
              <div class="category-text">${feature.name}</div>
              ${featureImage ? `
                <img src="${featureImage}" loading="eager" alt="${feature.name}" class="cover-image" />
              ` : `
                <div class="category-placeholder feature-placeholder">${isFa ? 'مشاهده' : 'View'}</div>
              `}
            </a>
          </div>
        </div>
      </div>
      <div class="category-right w-dyn-list">
        <div role="list" class="categories-wrap w-dyn-items">
          ${others.map(cat => {
            const img = fixImageUrl(cat.image);
            return `
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/gallery?category=${cat.id}" class="category-card w-inline-block" data-nav-link>
                  ${img ? `
                    <img src="${img}" loading="eager" alt="${cat.name}" class="cover-image" />
                  ` : `
                    <div class="category-placeholder">${isFa ? 'مشاهده' : 'View'}</div>
                  `}
                  <div class="category-text">${cat.name}</div>
                </a>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

  } catch (err) {
    console.error('❌ Categories error:', err);
    container.innerHTML = `<p class="text-danger">${isFa ? 'خطا در بارگذاری دسته‌ها' : 'Failed to load categories'}</p>`;
  }
}

// ============================================
// بلاگ‌ها — از API
// ============================================
async function loadBlogs(isFa) {
  const container = document.querySelector('[data-blog-list]');
  if (!container) return;

  try {
    const res = await blogsApi.list({ lang: isFa ? 'fa' : 'en' });
    console.log('📝 Blogs response:', res);

    const blogs = (res.data || []).slice(0, 3);

    if (blogs.length === 0) {
      container.innerHTML = `<p>${isFa ? 'مقاله‌ای موجود نیست' : 'No blogs'}</p>`;
      return;
    }

    container.innerHTML = blogs.map(b => {
      const image = fixImageUrl(b.image_1);
      const title = b.title_1 || 'Untitled';

      return `
        <div role="listitem" class="d-flex w-dyn-item">
          <a href="/blog/${b.id}" class="blog-card w-inline-block" data-nav-link>
            <div class="blog-thumb">
              <img src="${image}" loading="lazy" alt="${title}" class="cover-image" />
            </div>
            <div class="blog-content">
              <div class="blog-data">
                <div class="blog-category">${b.author || 'Glomin'}</div>
                <div class="body-small">${formatDate(b.date, isFa)}</div>
              </div>
              <h3 class="blog-title">${title}</h3>
            </div>
          </a>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('❌ Blogs error:', err);
    container.innerHTML = `<p class="text-danger">${isFa ? 'خطا در بارگذاری مقالات' : 'Failed to load blogs'}</p>`;
  }
}

// ============================================
// گالری — از API (فقط ۵ تای آخر)
// ============================================
async function loadGallery() {
  const container = document.querySelector('[data-gallery]');
  if (!container) return;

  try {
    const res = await galleryApi.list();
    console.log('🖼️ Gallery response:', res);

    const items = res.data || [];

    if (items.length === 0) {
      container.innerHTML = '';
      return;
    }

    // ✅ فقط ۵ تای آخر
    const lastFive = items.slice(-5);

    const imagesHTML = lastFive.map(item => {
      const image = fixImageUrl(item.image);
      return `
        <a href="/gallery" class="gallery-link w-inline-block" data-nav-link>
          <img src="${image}" loading="lazy" alt="${item.title || ''}" class="cover-image" />
          <div class="gallery-overlay">
            <div class="social-link">
              <img src="/img/ic-insta.svg" loading="lazy" alt="Instagram" />
            </div>
          </div>
        </a>
      `;
    }).join('');

    const wrapHTML = `<div class="gallery-wrap">${imagesHTML}</div>`;
    container.innerHTML = wrapHTML.repeat(4);

  } catch (err) {
    console.error('❌ Gallery error:', err);
    container.innerHTML = '';
  }
}

// ============================================
// CTA — فرم newsletter
// ============================================
function initCtaForm(isFa) {
  const wrapper = document.querySelector('[data-cta-form]');
  if (!wrapper || wrapper.dataset.initialized === 'true') return;

  wrapper.dataset.initialized = 'true';

  const submitBtn = wrapper.querySelector('[data-cta-submit]');
  const emailInput = wrapper.querySelector('[data-cta-email]');
  const msg = document.querySelector('[data-cta-msg]');

  if (!submitBtn || !emailInput) return;

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (submitBtn.disabled) return;

    const email = (emailInput.value || '').trim();

    if (!email || !isValidEmail(email)) {
      showMsg(msg, isFa ? 'ایمیل معتبر وارد کنید' : 'Please enter a valid email', 'error');
      return;
    }

    setLoading(submitBtn, true);
    showMsg(msg, isFa ? 'در حال ارسال...' : 'Sending...', 'info');

    try {
      const res = await waitingListApi.subscribe(email);
      console.log('📧 CTA subscribe response:', res);

      showMsg(
        msg,
        isFa ? 'ایمیل شما ثبت شد ✓' : 'Your email has been registered ✓',
        'success'
      );

      emailInput.value = '';
    } catch (err) {
      console.error('❌ CTA subscribe error:', err);
      showMsg(msg, err.message || (isFa ? 'خطا در ثبت ایمیل' : 'Failed to subscribe'), 'error');
    } finally {
      setLoading(submitBtn, false);
    }
  });

  emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitBtn.click();
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMsg(el, text, type = 'info') {
    if (!el) return;
    el.textContent = text;
    el.style.display = text ? 'block' : 'none';
    el.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#666';
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = '...';
    } else {
      btn.textContent = btn.dataset.originalText || 'SUBSCRIBE';
    }
  }
}