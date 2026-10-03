// ============================================
// Dashboard Page - داشبورد کاربر
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { getUser, isLoggedIn } from '../code/auth.js';
import { apiGet } from '../code/api.js';

export async function DashboardPage() {
  // اگه لاگین نیست، بره login
  if (!isLoggedIn()) {
    setTimeout(() => window.__app?.router?.navigate('/login'), 100);
    return Layout(`<div class="loading-placeholder">در حال انتقال...</div>`);
  }

  const user = getUser();
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <div class="dashboard-page">
      <div class="w-layout-blockcontainer container w-container">

        <!-- HEADER -->
        <div class="dashboard-header">
          <div>
            <h1>${isFa ? 'سلام' : 'Hello'}, ${user?.name || (isFa ? 'کاربر' : 'User')} 👋</h1>
            <p>${isFa ? 'خدمت مورد نظرت رو انتخاب کن و رزرو کن' : 'Choose a service and book your appointment'}</p>
          </div>
          <button class="primary-button w-button" data-logout-btn>
            ${isFa ? 'خروج' : 'Logout'}
          </button>
        </div>

        <!-- TABS -->
        <div class="dashboard-tabs">
          <button class="dashboard-tab active" data-dash-tab="services">
            ${isFa ? 'خدمات' : 'Services'}
          </button>
          <button class="dashboard-tab" data-dash-tab="appointments">
            ${isFa ? 'نوبت‌های من' : 'My Appointments'}
          </button>
        </div>

        <!-- TAB: خدمات -->
        <div class="dashboard-content" data-dash-content="services">
          <div class="services-grid" data-services-grid>
            <div class="loading-placeholder">${t('common.loading')}</div>
          </div>
        </div>

        <!-- TAB: نوبت‌ها -->
        <div class="dashboard-content" data-dash-content="appointments" style="display:none">
          <div class="appointments-list" data-appointments-list>
            <div class="loading-placeholder">${t('common.loading')}</div>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL: انتخاب خدمت + تاریخ/ساعت -->
    <div class="booking-modal" data-booking-modal style="display:none">
      <div class="booking-modal-backdrop" data-modal-close></div>
      <div class="booking-modal-content">

        <button class="booking-modal-close" data-modal-close>✕</button>

        <div class="booking-header">
          <h2 data-modal-title>${isFa ? 'رزرو نوبت' : 'Book Appointment'}</h2>
          <p data-modal-subtitle></p>
        </div>

        <!-- مرحله ۱: تاریخ -->
        <div class="booking-step" data-step="date">
          <h3>${isFa ? 'تاریخ را انتخاب کن' : 'Select a date'}</h3>
          <div class="date-picker-grid" data-date-picker></div>
        </div>

        <!-- مرحله ۲: ساعت -->
        <div class="booking-step" data-step="time" style="display:none">
          <h3>${isFa ? 'ساعت را انتخاب کن' : 'Select a time'}</h3>
          <div class="time-picker-grid" data-time-picker></div>
        </div>

        <!-- خلاصه + پرداخت -->
        <div class="booking-summary" data-booking-summary style="display:none">
          <div class="summary-row">
            <span>${isFa ? 'خدمت' : 'Service'}:</span>
            <strong data-summary-service></strong>
          </div>
          <div class="summary-row">
            <span>${isFa ? 'تاریخ' : 'Date'}:</span>
            <strong data-summary-date></strong>
          </div>
          <div class="summary-row">
            <span>${isFa ? 'ساعت' : 'Time'}:</span>
            <strong data-summary-time></strong>
          </div>
          <div class="summary-row total">
            <span>${isFa ? 'مبلغ' : 'Total'}:</span>
            <strong data-summary-price></strong>
          </div>
        </div>

        <!-- دکمه‌ها -->
        <div class="booking-actions">
          <button class="secondary-button" data-booking-prev style="display:none">
            ${isFa ? '← قبلی' : '← Back'}
          </button>
          <button class="primary-button w-button" data-booking-next disabled>
            ${isFa ? 'ادامه' : 'Continue'}
          </button>
        </div>

      </div>
    </div>
  `);

  queueMicrotask(() => {
    initLayout();
    initDashboard(user, isFa);
  });

  return html;
}

// ============================================
// منطق داشبورد
// ============================================
function initDashboard(user, isFa) {
  let services = [];
  let selectedService = null;
  let selectedDate = null;
  let selectedTime = null;
  let currentStep = 1;

  // ---------- Logout ----------
  document.querySelector('[data-logout-btn]')?.addEventListener('click', () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.__app?.router?.navigate('/login');
  });

  // ---------- Tabs ----------
  document.querySelectorAll('[data-dash-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-dash-tab]').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('[data-dash-content]').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      const target = document.querySelector(`[data-dash-content="${tab.dataset.dashTab}"]`);
      if (target) target.style.display = 'block';
    });
  });

  // ---------- لود خدمات ----------
  loadServices();

  // ---------- لود نوبت‌ها ----------
  loadAppointments();

  // ============================================
  // لود خدمات
  // ============================================
  async function loadServices() {
    const grid = document.querySelector('[data-services-grid]');
    if (!grid) return;

    try {
      // TODO: services = await apiGet('/services');
      services = [
        { id: 1, name: isFa ? 'میکاپ عروس' : 'Bridal Makeup', description: isFa ? 'میکاپ حرفه‌ای عروس' : 'Professional bridal makeup', price: 5000000, duration: 120, image: '/img/service-1.jpg' },
        { id: 2, name: isFa ? 'رنگ و مش' : 'Hair Color', description: isFa ? 'رنگ و مش مو' : 'Hair coloring & highlights', price: 2500000, duration: 90, image: '/img/service-2.jpg' },
        { id: 3, name: isFa ? 'کراتین مو' : 'Keratin Treatment', description: isFa ? 'صافی و درخشندگی مو' : 'Hair smoothing & shine', price: 3500000, duration: 150, image: '/img/service-3.jpg' },
        { id: 4, name: isFa ? 'پاکسازی پوست' : 'Facial Cleansing', description: isFa ? 'پاکسازی و آبرسانی پوست' : 'Deep skin cleansing', price: 1500000, duration: 60, image: '/img/service-4.jpg' },
        { id: 5, name: isFa ? 'میکاپ ساده' : 'Simple Makeup', description: isFa ? 'میکاپ روزانه' : 'Daily makeup', price: 1200000, duration: 45, image: '/img/service-5.jpg' },
        { id: 6, name: isFa ? 'میکاپ مجلسی' : 'Party Makeup', description: isFa ? 'میکاپ مجلسی' : 'Evening party makeup', price: 2000000, duration: 60, image: '/img/service-6.jpg' }
      ];

      grid.innerHTML = services.map(s => `
        <div class="service-card" data-service-id="${s.id}">
          <div class="service-img">
            <img src="${s.image}" loading="lazy" alt="${s.name}" class="cover-image" />
          </div>
          <div class="service-content">
            <h3 class="service-name">${s.name}</h3>
            <p class="service-desc">${s.description}</p>
            <div class="service-meta">
              <span class="service-price">${formatPrice(s.price)}</span>
              <span class="service-duration">${s.duration} ${isFa ? 'دقیقه' : 'min'}</span>
            </div>
            <button class="primary-button w-button" data-book-service="${s.id}">
              ${isFa ? 'رزرو' : 'Book'}
            </button>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('[data-book-service]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = Number(btn.dataset.bookService);
          const service = services.find(s => s.id === id);
          if (service) openBookingModal(service);
        });
      });

    } catch (err) {
      console.error('❌ Services load error:', err);
      grid.innerHTML = `<p>${isFa ? 'خطا در بارگذاری' : 'Failed to load'}</p>`;
    }
  }

  // ============================================
  // لود نوبت‌ها
  // ============================================
  async function loadAppointments() {
    const list = document.querySelector('[data-appointments-list]');
    if (!list) return;

    try {
      // TODO: const res = await apiGet('/appointments');
      const appointments = [
        // { id: 1, service: 'میکاپ عروس', date: '1403/08/15', time: '14:00', status: 'confirmed', price: 5000000 }
      ];

      if (appointments.length === 0) {
        list.innerHTML = `
          <div class="empty-state">
            <p>${isFa ? 'هنوز نوبتی رزرو نکرده‌اید' : 'No appointments yet'}</p>
            <button class="primary-button w-button" data-goto-services>
              ${isFa ? 'رزرو اولین نوبت' : 'Book your first appointment'}
            </button>
          </div>
        `;

        list.querySelector('[data-goto-services]')?.addEventListener('click', () => {
          document.querySelector('[data-dash-tab="services"]').click();
        });
        return;
      }

      list.innerHTML = appointments.map(a => `
        <div class="appointment-card">
          <div class="appointment-info">
            <h3>${a.service}</h3>
            <div class="appointment-meta">
              <span>📅 ${a.date}</span>
              <span>🕐 ${a.time}</span>
            </div>
          </div>
          <div class="appointment-status status-${a.status}">${a.status}</div>
        </div>
      `).join('');

    } catch (err) {
      console.error('❌ Appointments load error:', err);
    }
  }

  // ============================================
  // باز کردن Modal رزرو
  // ============================================
  function openBookingModal(service) {
    selectedService = service;
    selectedDate = null;
    selectedTime = null;
    currentStep = 1;

    const modal = document.querySelector('[data-booking-modal]');
    const title = modal.querySelector('[data-modal-title]');
    const subtitle = modal.querySelector('[data-modal-subtitle]');

    title.textContent = service.name;
    subtitle.textContent = service.description;

    // ریست مراحل
    modal.querySelector('[data-step="date"]').style.display = 'block';
    modal.querySelector('[data-step="time"]').style.display = 'none';
    modal.querySelector('[data-booking-summary]').style.display = 'none';
    modal.querySelector('[data-booking-prev]').style.display = 'none';
    modal.querySelector('[data-booking-next]').textContent = isFa ? 'ادامه' : 'Continue';
    modal.querySelector('[data-booking-next]').disabled = true;

    // ساخت تاریخ‌ها
    renderDatePicker();

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // ============================================
  // ساخت Date Picker (۷ روز آینده)
  // ============================================
  function renderDatePicker() {
    const picker = document.querySelector('[data-date-picker]');
    if (!picker) return;

    const days = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    picker.innerHTML = days.map(d => {
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString(isFa ? 'fa-IR' : 'en-US', { month: 'short' });

      return `
        <button class="date-item" data-date="${iso}">
          <span class="date-day">${dayName}</span>
          <span class="date-num">${dayNum}</span>
          <span class="date-month">${monthName}</span>
        </button>
      `;
    }).join('');

    picker.querySelectorAll('[data-date]').forEach(btn => {
      btn.addEventListener('click', () => {
        picker.querySelectorAll('.date-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDate = btn.dataset.date;
        updateNextButton();
      });
    });
  }

  // ============================================
  // ساخت Time Picker
  // ============================================
  function renderTimePicker() {
    const picker = document.querySelector('[data-time-picker]');
    if (!picker) return;

    // ساعت‌های ۹ صبح تا ۸ شب
    const times = [];
    for (let h = 9; h <= 20; h++) {
      times.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 20) times.push(`${String(h).padStart(2, '0')}:30`);
    }

    // TODO: فیلتر کن بر اساس رزروهای موجود
    // const availableTimes = await apiGet(`/services/${selectedService.id}/available?date=${selectedDate}`);

    picker.innerHTML = times.map(time => `
      <button class="time-item" data-time="${time}">${time}</button>
    `).join('');

    picker.querySelectorAll('[data-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        picker.querySelectorAll('.time-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTime = btn.dataset.time;
        updateNextButton();
      });
    });
  }

  // ============================================
  // دکمه‌های ادامه / قبلی
  // ============================================
  document.querySelector('[data-booking-next]')?.addEventListener('click', () => {
    if (currentStep === 1 && selectedDate) {
      // برو مرحله ۲ (ساعت)
      currentStep = 2;
      document.querySelector('[data-step="date"]').style.display = 'none';
      document.querySelector('[data-step="time"]').style.display = 'block';
      document.querySelector('[data-booking-prev]').style.display = 'block';
      renderTimePicker();
      updateNextButton();
    } else if (currentStep === 2 && selectedTime) {
      // برو مرحله ۳ (خلاصه + پرداخت)
      currentStep = 3;
      document.querySelector('[data-step="time"]').style.display = 'none';
      document.querySelector('[data-booking-summary]').style.display = 'block';
      document.querySelector('[data-booking-next]').textContent = isFa ? 'پرداخت' : 'Proceed to Payment';

      // پر کردن خلاصه
      document.querySelector('[data-summary-service]').textContent = selectedService.name;
      document.querySelector('[data-summary-date]').textContent = selectedDate;
      document.querySelector('[data-summary-time]').textContent = selectedTime;
      document.querySelector('[data-summary-price]').textContent = formatPrice(selectedService.price);
    } else if (currentStep === 3) {
      // برو چک‌اوت
      const params = new URLSearchParams({
        service: selectedService.id,
        date: selectedDate,
        time: selectedTime
      });
      window.__app?.router?.navigate(`/checkout?${params.toString()}`);
    }
  });

  document.querySelector('[data-booking-prev]')?.addEventListener('click', () => {
    if (currentStep === 2) {
      currentStep = 1;
      document.querySelector('[data-step="time"]').style.display = 'none';
      document.querySelector('[data-step="date"]').style.display = 'block';
      document.querySelector('[data-booking-prev]').style.display = 'none';
      updateNextButton();
    } else if (currentStep === 3) {
      currentStep = 2;
      document.querySelector('[data-booking-summary]').style.display = 'none';
      document.querySelector('[data-step="time"]').style.display = 'block';
      document.querySelector('[data-booking-next]').textContent = isFa ? 'ادامه' : 'Continue';
      updateNextButton();
    }
  });

  // ---------- بستن Modal ----------
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector('[data-booking-modal]').style.display = 'none';
      document.body.style.overflow = '';
    });
  });

  // ---------- آپدیت دکمه‌ی ادامه ----------
  function updateNextButton() {
    const btn = document.querySelector('[data-booking-next]');
    if (!btn) return;
    if (currentStep === 1) btn.disabled = !selectedDate;
    else if (currentStep === 2) btn.disabled = !selectedTime;
    else btn.disabled = false;
  }

  // ---------- فرمت قیمت ----------
  function formatPrice(price) {
    return new Intl.NumberFormat(isFa ? 'fa-IR' : 'en-US').format(price) + (isFa ? ' تومان' : ' IRR');
  }
}