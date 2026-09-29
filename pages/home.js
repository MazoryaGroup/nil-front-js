// ============================================
// Home Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';

export async function HomePage() {
  const html = Layout(`
    <!-- HERO -->
    <div class="hero">
      <section class="hero-section">
        <div class="w-layout-blockcontainer container w-container">
          <div class="hero-wrap">
            <div class="hero-left">
              <div class="hero-avatar"></div>
              <div class="hero-middle">
                <img src="/img/3.jpg" loading="eager" alt="Hero Left" class="cover-image" />
              </div>
              <p class="line-height-150 capitalize">${t('hero.tagline')}</p>
            </div>
            <div class="hero-right">
              <div class="hero-image">
                <img src="/asset/img/1.jpg" loading="eager" alt="Hero Center" class="cover-image" />
              </div>
              <div class="hero-content">
                <div class="hero-top">
                  <div class="hero-info">
                    <h2 class="color-white">${t('hero.title')}</h2>
                    <p class="line-height-150">${t('hero.description')}</p>
                  </div>
                  <a href="/product" class="hero-btn w-button">${t('hero.shop_now')}</a>
                </div>
                <div class="hero-img">
                  <img src="/asset/img/2.jpg" loading="eager" alt="Hero Right" class="cover-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- CATEGORIES -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="section-title-wrap">
          <div class="title-wrap">
            <div class="subtitle">${t('sections.explore')}</div>
            <h2>${t('sections.categories')}</h2>
          </div>
        </div>
        <div class="category-wrap">
          <div class="category-left w-dyn-list">
            <div role="list" class="categories-wrap w-dyn-items">
              <div role="listitem" class="w-dyn-item">
                <a href="/category/skin-care" class="feature-category w-inline-block" data-nav-link>
                  <div class="category-text">${t('categories.skin_care')}</div>
                  <img src="/img/4.jpg" loading="eager" alt="${t('categories.skin_care')}" class="cover-image" />
                </a>
              </div>
            </div>
          </div>
          <div class="category-right w-dyn-list">
            <div role="list" class="categories-wrap w-dyn-items">
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/hair-care" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/6.jpg" loading="eager" alt="${t('categories.hair_care')}" class="cover-image" />
                  <div class="category-text">${t('categories.hair_care')}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/makeup" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/5.jpg" loading="eager" alt="${t('categories.makeup')}" class="cover-image" />
                  <div class="category-text">${t('categories.makeup')}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/fragrances" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/7.jpg" loading="eager" alt="${t('categories.fragrances')}" class="cover-image" />
                  <div class="category-text">${t('categories.fragrances')}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/beauty-tools" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/8.jpg" loading="eager" alt="${t('categories.beauty_tools')}" class="cover-image" />
                  <div class="category-text">${t('categories.beauty_tools')}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT BLOCK -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="about-block">
          <div class="about-img">
            <img src="/img/9.jpg" loading="lazy" alt="About" class="cover-image" />
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
            <img src="/img/10.jpg" loading="lazy" alt="About Right" class="cover-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORY BLOCKS (بنر بزرگ) -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="w-dyn-list">
          <div role="list" class="category-list w-dyn-items">
            <div style="background-image: url('/img/11.jpg');" role="listitem" class="category-block w-dyn-item">
              <a href="/category/skin-care" class="caegory-link w-inline-block" data-nav-link>
                <div class="body-x-small capitalize">Radiant Skin Solutions</div>
                <h2 class="category-title">Shop premium beauty products at beauty bliss by glomin</h2>
                <div class="secondary-button invert">${t('buttons.shop_now')}</div>
              </a>
            </div>
            <div style="background-image: url('/img/12.jpg');" role="listitem" class="category-block w-dyn-item">
              <a href="/category/beauty-tools" class="caegory-link w-inline-block" data-nav-link>
                <div class="body-x-small capitalize">Free Shipping</div>
                <h2 class="category-title">Elevate your beauty routine every time with our premium products</h2>
                <div class="secondary-button invert">${t('buttons.shop_now')}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOG -->
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
                <form class="cta-form" data-cta-form>
                  <input class="cta-field w-input" name="email" placeholder="${t('forms.email')}" type="email" required />
                  <input type="submit" class="cta-btn w-button" value="${t('buttons.subscribe')}" />
                </form>
                <div class="form-message" data-form-message></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section class="gallery">
      <div class="gallery-outer" data-gallery>
        <!-- گالری توسط JS پر می‌شه -->
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    loadBlogs();
    loadGallery();
  });

  return html;
}

// ============================================
// لود بلاگ‌ها
// ============================================
function loadBlogs() {
  const container = document.querySelector('[data-blog-list]');
  if (!container) return;

  const blogs = [
    { title: 'The ultimate guide to glomin\'s skincare essentials', slug: 'skincare-essentials', category: 'Skincare', date: 'Aug 23, 2024', image: '/img/blog-thumb-02.jpg' },
    { title: 'Essential tools & accessories for professional beauty routine', slug: 'beauty-tools', category: 'Accessories', date: 'Aug 23, 2024', image: '/img/blog-thumb-03.jpg' },
    { title: 'Behind the scenes how we develop our premium beauty products', slug: 'behind-the-scenes', category: 'Company Insights', date: 'Aug 23, 2024', image: '/img/blog-thumb-04.jpg' }
  ];

  container.innerHTML = blogs.map(b => `
    <div role="listitem" class="d-flex w-dyn-item">
      <a href="/blog/${b.slug}" class="blog-card w-inline-block" data-nav-link>
        <div class="blog-thumb">
          <img src="${b.image}" loading="lazy" alt="${b.title}" class="cover-image" />
        </div>
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${b.category}</div>
            <div class="body-small">${b.date}</div>
          </div>
          <h3 class="blog-title">${b.title}</h3>
        </div>
      </a>
    </div>
  `).join('');
}

// ============================================
// لود گالری (تصاویر اینستاگرام)
// ============================================
function loadGallery() {
  const container = document.querySelector('[data-gallery]');
  if (!container) return;

  // ۵ تصویر گالری
  const images = [
    '/img/gallery-1.jpg',
    '/img/gallery-2.jpg',
    '/img/gallery-3.jpg',
    '/img/gallery-4.jpg',
    '/img/gallery-5.jpg'
  ];

  // ۴ بار تکرار می‌کنیم تا اسلایدر بی‌نهایت بشه
  const wrapHTML = `
    <div class="gallery-wrap">
      ${images.map((img, i) => `
        <a href="https://www.instagram.com/" target="_blank" class="gallery-link w-inline-block">
          <img src="${img}" loading="lazy" alt="Gallery ${i + 1}" class="cover-image" />
          <div class="gallery-overlay">
            <div class="social-link">
              <img src="/img/ic-insta.svg" loading="lazy" alt="Instagram" />
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  `;

  container.innerHTML = wrapHTML.repeat(4);
}