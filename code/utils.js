// ============================================
// ابزارهای کمکی
// ============================================

// انتخاب یک المان
export const $  = (sel, parent = document) => parent.querySelector(sel);

// انتخاب چند المان
export const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// ساخت المان از HTML string
export function el(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

// escape کردن HTML (برای جلوگیری از XSS)
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// دیبانس
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// تروتل
export function throttle(fn, limit = 300) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// فرمت تاریخ
export function formatDate(date, locale = 'fa-IR') {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// تأخیر
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));