// ============================================
// Nil Beauty - Entry Point + Router
// ============================================

// ============================================
// خطاگیری سراسری (باید اول باشه)
// ============================================
window.addEventListener('error', (e) => {
  console.error('🚨 GLOBAL ERROR:', e.error || e.message);
  console.error('📍 File:', e.filename, 'Line:', e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('🚨 UNHANDLED REJECTION:', e.reason);
});

// ============================================
// Importها
// ============================================
import { Router } from './code/router.js';
import { initI18n } from './code/i18n.js';
import { initAuth } from './code/auth.js';

// صفحات
import { HomePage } from './pages/home.js';
import { AboutPage } from './pages/about.js';
import { BlogPage } from './pages/blog.js';
import { BlogSinglePage } from './pages/blog-single.js';
import { ContactPage } from './pages/contact.js';
import { FaqPage } from './pages/faq.js';
import { CheckoutPage } from './pages/checkout.js';
import { SignupPage } from './pages/signup.js';
import { NotFoundPage } from './pages/not-found.js';

// ============================================
// تعریف مسیرها
// ============================================
const routes = [
  { path: '/',              component: HomePage,       title: 'Nil Beauty' },
  { path: '/about',         component: AboutPage,      title: 'درباره ما' },
  { path: '/blog',          component: BlogPage,       title: 'بلاگ' },
  { path: '/blog/:slug',    component: BlogSinglePage, title: 'مقاله' },
  { path: '/contact',       component: ContactPage,    title: 'تماس با ما' },
  { path: '/faq',           component: FaqPage,        title: 'سوالات متداول' },
  { path: '/checkout',      component: CheckoutPage,   title: 'پرداخت' },
  { path: '/signup',        component: SignupPage,     title: 'ثبت‌نام' },
  { path: '*',              component: NotFoundPage,   title: '404' }
];

// ============================================
// راه‌اندازی
// ============================================
async function bootstrap() {
  console.log('🚀 Bootstrap started');

  try {
    // ۱. راه‌اندازی i18n
    console.log('⏳ Step 1: initI18n...');
    await initI18n();
    console.log('✅ Step 1: i18n ready');

    // ۲. راه‌اندازی auth
    console.log('⏳ Step 2: initAuth...');
    initAuth();
    console.log('✅ Step 2: auth ready');

    // ۳. ساخت روتر
    console.log('⏳ Step 3: Router...');
    const container = document.querySelector('#app');
    if (!container) {
      throw new Error('#app element not found in DOM');
    }
    const router = new Router(routes, '#app');
    console.log('✅ Step 3: Router created');

    // ۴. شروع روتر
    console.log('⏳ Step 4: router.start...');
    router.start();
    console.log('✅ Step 4: Router started');

    // در دسترس قرار دادن برای دیباگ
    window.__app = { router };

    console.log('🎉 Nil Beauty initialized successfully');
  } catch (err) {
    console.error('❌ Bootstrap failed:', err);
    console.error('📍 Stack:', err.stack);

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="padding:40px;text-align:center;font-family:sans-serif">
          <h2 style="color:red">❌ خطا در بارگذاری برنامه</h2>
          <pre style="text-align:left;background:#f5f5f5;padding:20px;border-radius:8px;overflow:auto">${err.message}\n\n${err.stack || ''}</pre>
          <button onclick="location.reload()" style="padding:10px 20px;margin-top:20px;cursor:pointer">رفرش</button>
        </div>
      `;
    }
  }
}

// ============================================
// اجرا
// ============================================
bootstrap();