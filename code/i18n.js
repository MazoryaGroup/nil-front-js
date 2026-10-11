
// ============================================
// NIL BEAUTY - i18n
// سیستم دوزبانه فارسی و انگلیسی
// زبان پیش‌فرض همیشه انگلیسی
// ============================================

let currentLang = 'en';
let translations = {};

const SUPPORTED_LANGS = ['fa', 'en'];
const DEFAULT_LANG = 'en';

// ============================================
// بارگذاری فایل ترجمه
// ============================================

async function loadTranslations(lang) {
  try {
    const res = await fetch(`/lang/${lang}.json`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error(
      `❌ Failed to load ${lang}.json`,
      err
    );

    return {};
  }
}

// ============================================
// گرفتن مقدار تودرتو
// ============================================

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;

  return path
    .split('.')
    .reduce((acc, key) => acc?.[key], obj);
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
  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = DEFAULT_LANG;
  }

  currentLang = lang;

  // زبان در localStorage ذخیره نمی‌شود
  // بنابراین با Refresh دوباره انگلیسی خواهد شد

  translations = await loadTranslations(lang);

  setDirection(lang);

  // اعمال ترجمه روی المان‌های صفحه
  applyTranslations();

  // اطلاع‌رسانی تغییر زبان به کامپوننت‌ها
  window.dispatchEvent(
    new CustomEvent('languageChanged', {
      detail: {
        lang,
        translations
      }
    })
  );
}

// ============================================
// راه‌اندازی اولیه
// همیشه انگلیسی
// ============================================

export async function initI18n() {
  await setLanguage(DEFAULT_LANG);
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

export function t(key, vars = {}) {
  const value = getNestedValue(translations, key);

  if (value === undefined || value === null) {
    return key;
  }

  // جایگزینی متغیرها مانند {phone}
  return String(value).replace(
    /\{(\w+)\}/g,
    (_, name) =>
      vars[name] !== undefined
        ? vars[name]
        : `{${name}}`
  );
}

// ============================================
// اعمال ترجمه روی DOM
//
// data-i18n="nav.home"         -> textContent
// data-i18n-html="..."         -> innerHTML
// data-i18n-placeholder="..."  -> placeholder
// data-i18n-title="..."        -> title
// data-i18n-aria="..."         -> aria-label
// ============================================

export function applyTranslations(root = document) {

  // ترجمه متن
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');

    if (key) {
      el.textContent = t(key);
    }
  });

  // ترجمه HTML
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');

    if (key) {
      el.innerHTML = t(key);
    }
  });

  // ترجمه Placeholder
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');

    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });

  // ترجمه Title
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');

    if (key) {
      el.setAttribute('title', t(key));
    }
  });

  // ترجمه aria-label
  root.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');

    if (key) {
      el.setAttribute('aria-label', t(key));
    }
  });
}

// ============================================
// تغییر زبان با یک کلیک
// ============================================

export function toggleLanguage() {
  const next = currentLang === 'fa' ? 'en' : 'fa';

  return setLanguage(next);
}

// ============================================
// اتصال دکمه‌های تغییر زبان
//
// data-lang="fa"
// data-lang="en"
// ============================================

export function bindLanguageSwitchers(root = document) {
  root.querySelectorAll('[data-lang]').forEach(el => {

    // جلوگیری از ثبت چندباره رویداد
    if (el.dataset.langBound === '1') {
      return;
    }

    el.dataset.langBound = '1';

    el.addEventListener('click', (e) => {
      e.preventDefault();

      const lang = el.getAttribute('data-lang');

      if (lang && SUPPORTED_LANGS.includes(lang)) {
        setLanguage(lang);
      }
    });
  });
}

// ============================================
// راه‌اندازی خودکار
// ============================================

if (typeof window !== 'undefined') {

  const startI18n = async () => {
    await initI18n();
    bindLanguageSwitchers();
  };

  if (document.readyState === 'loading') {

    window.addEventListener(
      'DOMContentLoaded',
      startI18n,
      { once: true }
    );

  } else {

    startI18n();

  }
}
