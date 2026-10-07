// ============================================
// Nil Beauty - Entry Point + Router
// ============================================

window.addEventListener('error', (e) => console.error('🚨', e.error || e.message));
window.addEventListener('unhandledrejection', (e) => console.error('🚨', e.reason));

import { Router } from './code/router.js';
import { initI18n } from './code/i18n.js';
import { initAuth } from './code/auth.js';
import { initHeader } from './components/Header.js';
import { initFooter } from './components/Footer.js';

// صفحات
import { HomePage } from './pages/home.js';
import { AboutPage } from './pages/about.js';
import { BlogPage } from './pages/blog.js';
import { BlogSinglePage } from './pages/blog-single.js';
import { ContactPage } from './pages/contact.js';
import { FaqPage } from './pages/faq.js';
import { CheckoutPage } from './pages/checkout.js';
import { LoginPage } from './pages/login.js';
import { RegisterPage } from './pages/register.js';
import { DashboardPage } from './pages/dashboard.js';
import { GalleryPage } from './pages/gallery.js';
import { NotFoundPage } from './pages/not-found.js';

// ============================================
// مسیرها
// ============================================
const routes = [
  { path: '/',              component: HomePage,       title: 'Nil Beauty' },
  { path: '/about',         component: AboutPage,      title: 'درباره ما' },
  { path: '/gallery',       component: GalleryPage,    title: 'گالری' },
  { path: '/blog',          component: BlogPage,       title: 'بلاگ' },
  { path: '/blog/:id',      component: BlogSinglePage, title: 'مقاله' },  // ✅ slug → id
  { path: '/contact',       component: ContactPage,    title: 'تماس' },
  { path: '/faq',           component: FaqPage,        title: 'سوالات' },
  { path: '/checkout',      component: CheckoutPage,   title: 'پرداخت' },
  { path: '/login',         component: LoginPage,      title: 'ورود' },
  { path: '/register',      component: RegisterPage,   title: 'ثبت‌نام' },
  { path: '/dashboard',     component: DashboardPage,  title: 'داشبورد' },
  { path: '*',              component: NotFoundPage,   title: '404' }
];

// ============================================
// راه‌اندازی
// ============================================
async function bootstrap() {
  console.log('🚀 Bootstrap started');
  try {
    await initI18n();
    initAuth();

    const container = document.querySelector('#app');
    if (!container) throw new Error('#app not found');

    const router = new Router(routes, '#app');
    router.start();

    window.__app = { router };

    // ✅ بعد از هر تغییر صفحه، header و footer رو دوباره init کن
    window.addEventListener('pageChanged', () => {
      setTimeout(() => {
        initHeader();
        initFooter();
      }, 100);
    });

    console.log('🎉 Nil Beauty initialized');
  } catch (err) {
    console.error('❌ Bootstrap failed:', err);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<div style="padding:40px;color:red"><h2>خطا</h2><pre>${err.message}</pre></div>`;
    }
  }
}

bootstrap();