// ============================================
// ابزارهای کمکی
// ============================================

// ============================================
// انتخاب المان‌ها
// ============================================
export const $  = (sel, parent = document) => parent.querySelector(sel);
export const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// ساخت المان از HTML string
export function el(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

// escape کردن HTML (جلوگیری از XSS)
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================
// Timing
// ============================================
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

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

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ============================================
// Date / Time Utils (شمسی)
// ============================================

/**
 * فرمت تاریخ کامل
 * @param {string|Date} date
 * @param {boolean} isFa - اگه true، شمسی
 * @returns {string} "۸ آبان ۱۴۰۵"
 */
export function formatDate(date, isFa = true) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date).split('T')[0] || '—';

    return d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
      calendar: isFa ? 'persian' : 'gregory',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (err) {
    return '—';
  }
}

/**
 * فرمت تاریخ کوتاه (بدون سال)
 * @returns {string} "۸ آبان"
 */
export function formatDateShort(date, isFa = true) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    return d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
      calendar: isFa ? 'persian' : 'gregory',
      month: 'short',
      day: 'numeric'
    });
  } catch { return '—'; }
}

/**
 * فرمت روز هفته
 * @returns {string} "جمعه" یا "Fri"
 */
export function formatWeekday(date, isFa = true) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    return d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
      calendar: isFa ? 'persian' : 'gregory',
      weekday: 'short'
    });
  } catch { return '—'; }
}

/**
 * فرمت روز ماه (فقط عدد)
 * @returns {string} "۸" یا "8"
 */
export function formatDayNumber(date, isFa = true) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    const parts = d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
      calendar: isFa ? 'persian' : 'gregory',
      day: 'numeric'
    });
    return parts.replace(/[^\d۰-۹٠-٩]/g, '') || d.getDate();
  } catch { return '—'; }
}

/**
 * فرمت نام ماه
 * @returns {string} "آبان" یا "Nov"
 */
export function formatMonthName(date, isFa = true) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    return d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
      calendar: isFa ? 'persian' : 'gregory',
      month: 'short'
    });
  } catch { return '—'; }
}

/**
 * فرمت تاریخ + ساعت
 * @returns {string} "۸ آبان ۱۴۰۵، ۱۴:۳۰"
 */
export function formatDateTime(date, isFa = true) {
  if (!date) return '—';
  try {
    const d = new Date(date);
    return d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
      calendar: isFa ? 'persian' : 'gregory',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch { return '—'; }
}

/**
 * فرمت ساعت (HH:MM)
 * @param {string} timeStr - "14:00:00"
 * @returns {string} "14:00"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '—';
  return String(timeStr).slice(0, 5);
}

/**
 * امروز به صورت ISO (برای date picker)
 * @returns {string} "2026-10-31"
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * لیست N روز آینده به صورت ISO
 */
export function getNextDays(count = 14) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: d.toISOString().split('T')[0],
      weekday: formatWeekday(d, true),
      dayNum: formatDayNumber(d, true),
      monthName: formatMonthName(d, true),
      date: d
    });
  }
  return days;
}

/**
 * تبدیل تاریخ ISO به نمایش
 * @param {string} isoDate - "2026-10-31"
 */
export function isoToDisplayDate(isoDate, isFa = true) {
  if (!isoDate) return '—';
  return formatDate(isoDate, isFa);
}

// ============================================
// Formatters
// ============================================

/**
 * فرمت قیمت
 * @param {number|string} price
 * @param {boolean} isFa
 * @returns {string} "۵۰۰,۰۰۰ تومان" یا "500,000 IRR"
 */
export function formatPrice(price, isFa = true) {
  const num = Number(price || 0);
  return new Intl.NumberFormat(isFa ? 'fa-IR' : 'en-US').format(num) +
         (isFa ? ' تومان' : ' IRR');
}

/**
 * فرمت عدد
 */
export function formatNumber(num, isFa = true) {
  return new Intl.NumberFormat(isFa ? 'fa-IR' : 'en-US').format(Number(num || 0));
}

// ============================================
// Phone Utils
// ============================================

/**
 * تبدیل اعداد فارسی/عربی به انگلیسی و حذف غیرعددی
 */
export function normalizePhone(phone) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  let result = String(phone);
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), i);
    result = result.replace(new RegExp(arabicDigits[i], 'g'), i);
  }
  return result.replace(/\D/g, '');
}

/**
 * اعتبارسنجی شماره ایران
 */
export function isValidPhone(phone) {
  return /^09\d{9}$/.test(phone) || /^989\d{9}$/.test(phone);
}