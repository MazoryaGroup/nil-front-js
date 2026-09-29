// ============================================
// i18n - سیستم دوزبانه
// ============================================

let currentLang = 'en';
let translations = {};

const SUPPORTED_LANGS = ['fa', 'en'];
const DEFAULT_LANG = 'en';  // ← انگلیسی پیش‌فرض
const STORAGE_KEY = 'nil-beauty-lang';

// ============================================
// بارگذاری فایل ترجمه
// ============================================
async function loadTranslations(lang) {
  try {
    const res = await fetch(`/lang/${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to load ${lang}.json`, err);
    return {};
  }
}

// ============================================
// گرفتن مقدار تودرتو
// ============================================
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

// ============================================
// تنظیم جهت صفحه
// ============================================
function setDirection(lang) {
  const html = document.documentElement;
  if (lang === 'fa') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'fa');
    document.body?.classList.add('lang-fa');
    document.body?.classList.remove('lang-en');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    document.body?.classList.add('lang-en');
    document.body?.classList.remove('lang-fa');
  }
}

// ============================================
// تغییر زبان
// ============================================
export async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  translations = await loadTranslations(lang);
  setDirection(lang);

  window.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { lang }
  }));
}

// ============================================
// راه‌اندازی اولیه
// ============================================
export async function initI18n() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const lang = saved && SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  await setLanguage(lang);
}

// ============================================
// گرفتن زبان فعلی
// ============================================
export function getCurrentLang() {
  return currentLang;
}

// ============================================
// گرفتن ترجمه
// ============================================
export function t(key) {
  const value = getNestedValue(translations, key);
  return value !== undefined ? value : key;
}