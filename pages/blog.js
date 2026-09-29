// ============================================
// Blog List Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';

export async function BlogPage() {
  const html = Layout(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${t('sections.blogs') || 'BLOGS'}</div>
          <h1>${t('sections.latest_articles')}</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer">

          <!-- FEATURE BLOG -->
          <div class="w-dyn-list">
            <div role="list" class="w-dyn-items">
              <div role="listitem" class="w-dyn-item" data-feature-blog>
                <div class="loading-placeholder">${t('common.loading')}</div>
              </div>
            </div>
          </div>

          <!-- BLOG LIST -->
          <div class="w-dyn-list">
            <div role="list" class="blog-list w-dyn-items" data-blog-list>
              <div class="loading-placeholder">${t('common.loading')}</div>
            </div>
            <div role="navigation" class="pagination" data-pagination></div>
          </div>

        </div>
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    loadFeatureBlog();
    loadBlogList();
  });

  return html;
}

// ============================================
// Feature Blog (کارت بزرگ)
// ============================================
function loadFeatureBlog() {
  const container = document.querySelector('[data-feature-blog]');
  if (!container) return;

  // TODO: apiGet('/blogs/featured')
  const blog = {
    title: 'How to choose perfect fragrance for every occasion',
    slug: 'how-to-choose-perfect-fragrance-for-every-occasion',
    category: 'Fragrances',
    date: 'Aug 23, 2024',
    excerpt: "Discover Glomin's collection of perfumes and learn how to select the right scent for your style and mood.",
    image: '/img/blog-main-01.jpg'
  };

  container.innerHTML = `
    <a href="/blog/${blog.slug}" class="blog-wrap w-inline-block" data-nav-link>
      <div class="feature-img">
        <img src="${blog.image}" loading="eager" alt="${blog.title}" class="cover-image" />
      </div>
      <div class="feature-content">
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${blog.category}</div>
            <div class="body-small">${blog.date}</div>
          </div>
          <h3 class="blog-title">${blog.title}</h3>
          <p>${blog.excerpt}</p>
        </div>
        <div class="secondary-button">${t('buttons.read_more')}</div>
      </div>
    </a>
  `;
}

// ============================================
// Blog List (کارت‌های کوچک)
// ============================================
function loadBlogList() {
  const container = document.querySelector('[data-blog-list]');
  if (!container) return;

  // TODO: apiGet('/blogs')
  const blogs = [
    { title: "The ultimate guide to glomin's skincare essentials", slug: 'the-ultimate-guide-to-glomins-skincare-essentials', category: 'Skincare', date: 'Aug 23, 2024', image: '/img/blog-thumb-02.jpg' },
    { title: 'Essential tools & accessories for professional beauty routine', slug: 'essential-tools-accessories-for-professional-beauty-routine', category: 'Accessories', date: 'Aug 23, 2024', image: '/img/blog-thumb-03.jpg' },
    { title: 'Behind the scenes how we develop our premium beauty products', slug: 'behind-the-scenes-how-we-develop-our-premium-beauty-products', category: 'Company Insights', date: 'Aug 23, 2024', image: '/img/blog-thumb-04.jpg' },
    { title: 'The importance of sun protection in your skincare routine', slug: 'the-importance-of-sun-protection-in-your-skincare-routine', category: 'Skincare', date: 'Aug 23, 2024', image: '/img/blog-thumb-05.jpg' },
    { title: 'Exploring the benefits of serums and how to use them', slug: 'exploring-the-benefits-of-serums-and-how-to-use-them', category: 'Accessories', date: 'Aug 23, 2024', image: '/img/blog-thumb-06.jpg' },
    { title: "Glomin's favorite beauty hacks you need to know make life easier", slug: 'glomins-favorite-beauty-hacks-you-need-to-know-make-life-easier', category: 'Beauty Tips', date: 'Aug 23, 2024', image: '/img/blog-thumb-07.jpg' }
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
        <div class="d-none">Blogs</div>
      </a>
    </div>
  `).join('');
}