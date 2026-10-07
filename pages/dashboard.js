// ============================================
// Dashboard Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t, getCurrentLang } from '../code/i18n.js';
import { getUser, isLoggedIn, logout, setAuth, getToken } from '../code/auth.js';
import { profileApi, bookingsApi, servicesApi, staffApi, availabilityApi } from '../code/api.js';
import {
  formatDate,
  formatTime,
  formatPrice,
  normalizePhone,
  isValidPhone,
  getNextDays
} from '../code/utils.js';

export async function DashboardPage() {
  if (!isLoggedIn()) {
    setTimeout(() => window.__app?.router?.navigate('/login'), 100);
    return Layout(`<div class="loading-placeholder">در حال انتقال...</div>`);
  }

  const user = getUser();
  const isFa = getCurrentLang() === 'fa';

  const html = Layout(`
    <div class="dashboard-page">
      <div class="w-layout-blockcontainer container w-container">

        <div class="dashboard-header">
          <div>
            <h1>${isFa ? 'سلام' : 'Hello'}, ${user?.name || (isFa ? 'کاربر' : 'User')} 👋</h1>
            <p>${isFa ? 'مدیریت نوبت‌ها و پروفایل' : 'Manage appointments and profile'}</p>
          </div>
          <button class="primary-button w-button" data-logout-btn>
            ${isFa ? 'خروج' : 'Logout'}
          </button>
        </div>

        <div class="dashboard-tabs">
          <button class="dashboard-tab active" data-dash-tab="services">
            ${isFa ? 'خدمات' : 'Services'}
          </button>
          <button class="dashboard-tab" data-dash-tab="appointments">
            ${isFa ? 'نوبت‌های من' : 'My Appointments'}
          </button>
          <button class="dashboard-tab" data-dash-tab="profile">
            ${isFa ? 'پروفایل' : 'Profile'}
          </button>
        </div>

        <div class="dashboard-content" data-dash-content="services">
          <div class="services-grid" data-services-grid>
            <div class="loading-placeholder">${t('common.loading')}</div>
          </div>
        </div>

        <div class="dashboard-content" data-dash-content="appointments" style="display:none">
          <div class="appointments-list" data-appointments-list>
            <div class="loading-placeholder">${t('common.loading')}</div>
          </div>
        </div>

        <div class="dashboard-content" data-dash-content="profile" style="display:none">
          <div class="profile-wrapper" data-profile-wrapper>
            <div class="loading-placeholder">${t('common.loading')}</div>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL: رزرو -->
    <div class="booking-modal" data-booking-modal style="display:none">
      <div class="booking-modal-backdrop" data-modal-close></div>
      <div class="booking-modal-content">

        <button class="booking-modal-close" data-modal-close>✕</button>

        <div class="booking-header">
          <h2 data-modal-title>${isFa ? 'رزرو نوبت' : 'Book Appointment'}</h2>
          <p data-modal-subtitle></p>
        </div>

        <div class="booking-step" data-step="date">
          <h3>${isFa ? 'تاریخ را انتخاب کن' : 'Select a date'}</h3>
          <div class="date-picker-grid" data-date-picker></div>
        </div>

        <div class="booking-step" data-step="time" style="display:none">
          <h3>${isFa ? 'ساعت را انتخاب کن' : 'Select a time'}</h3>
          <div class="time-picker-grid" data-time-picker></div>
        </div>

        <div class="booking-step" data-step="notes" style="display:none">
          <h3>${isFa ? 'یادداشت (اختیاری)' : 'Note (Optional)'}</h3>
          <textarea class="auth-input" data-booking-notes rows="3" placeholder="${isFa ? 'توضیحات...' : 'Notes...'}"></textarea>
        </div>

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

        <div class="form-message" data-booking-msg></div>

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

  setTimeout(() => {
    initLayout();
    initDashboard(user, isFa);
  }, 100);

  return html;
}

// ============================================
// منطق داشبورد
// ============================================
function initDashboard(user, isFa) {
  // State
  let services = [];
  let selectedService = null;
  let selectedDate = null;
  let selectedTime = null;
  let currentStep = 1;
  let profileData = null;
  let profileLoaded = false;
  let staffSchedule = null;
  let availableSlots = [];

  // ============================================
  // LOGOUT
  // ============================================
  const logoutBtn = document.querySelector('[data-logout-btn]');
  console.log('🔍 Logout button found:', !!logoutBtn);

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔴 Logout clicked');

      if (!confirm(isFa ? 'از خروج مطمئنید؟' : 'Are you sure you want to logout?')) {
        return;
      }

      logoutBtn.disabled = true;
      const originalText = logoutBtn.textContent;
      logoutBtn.textContent = isFa ? 'در حال خروج...' : 'Logging out...';

      try {
        // پاک کردن localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        console.log('🗑️ Auth cleared');

        // API (اختیاری)
        try {
          await logout();
          console.log('✅ Logout API success');
        } catch (err) {
          console.warn('⚠️ API logout failed:', err.message);
        }

        // ریدایرکت
        console.log('➡️ Redirecting to login');
        window.__app?.router?.navigate('/login');
      } catch (err) {
        console.error('❌ Logout error:', err);
        window.location.href = '/login';
      }
    });
  }

  // ============================================
  // TABS
  // ============================================
  document.querySelectorAll('[data-dash-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-dash-tab]').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('[data-dash-content]').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      const target = document.querySelector(`[data-dash-content="${tab.dataset.dashTab}"]`);
      if (target) target.style.display = 'block';

      if (tab.dataset.dashTab === 'profile' && !profileLoaded) {
        loadProfile();
        profileLoaded = true;
      }
      if (tab.dataset.dashTab === 'appointments') {
        loadAppointments();
      }
    });
  });

  // ============================================
  // لود اولیه
  // ============================================
  loadServices();
  loadAppointments();

  // ============================================
  // لود خدمات از API
  // ============================================
  async function loadServices() {
    const grid = document.querySelector('[data-services-grid]');
    if (!grid) return;

    grid.innerHTML = `<div class="loading-placeholder">${t('common.loading')}</div>`;

    try {
      const res = await servicesApi.list();
      console.log('💼 Services response:', res);

      services = res.data || [];

      if (services.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <p>${isFa ? 'خدمتی موجود نیست' : 'No services available'}</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = services.map(s => `
        <div class="service-card" data-service-id="${s.id}">
          <div class="service-img" style="background: linear-gradient(135deg, #f5f1eb 0%, #e8f0e8 100%); display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 48px; opacity: 0.3;">💇</span>
          </div>
          <div class="service-content">
            <h3 class="service-name">${s.name}</h3>
            <p class="service-desc">${s.description || ''}</p>
            <div class="service-meta">
              <span class="service-price">${formatPrice(s.price, isFa)}</span>
              <span class="service-duration">${s.duration} ${isFa ? 'دقیقه' : 'min'}</span>
            </div>
            <div class="service-deposit">
              ${isFa ? 'بیعانه' : 'Deposit'}: ${formatPrice(s.deposit_amount, isFa)}
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
      console.error('❌ Services error:', err);
      grid.innerHTML = `<p>${isFa ? 'خطا در بارگذاری خدمات' : 'Failed to load services'}</p>`;
    }
  }

  // ============================================
  // لود نوبت‌ها
  // ============================================
  async function loadAppointments() {
    const list = document.querySelector('[data-appointments-list]');
    if (!list) return;

    list.innerHTML = `<div class="loading-placeholder">${t('common.loading')}</div>`;

    try {
      const res = await bookingsApi.list();
      console.log('📋 Bookings response:', res);

      const bookings = res.data || [];

      if (bookings.length === 0) {
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

      const sorted = [...bookings].sort((a, b) =>
        new Date(b.booking_date) - new Date(a.booking_date)
      );

      list.innerHTML = sorted.map(b => renderBookingCard(b)).join('');

      list.querySelectorAll('[data-booking-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = Number(btn.dataset.bookingId);
          const action = btn.dataset.bookingAction;
          const booking = bookings.find(x => x.id === id);

          if (action === 'view') openBookingDetails(booking);
          else if (action === 'cancel') cancelBooking(booking);
          else if (action === 'reschedule') openReschedule(booking);
        });
      });

    } catch (err) {
      console.error('❌ Bookings error:', err);
      list.innerHTML = `<p>${isFa ? 'خطا در بارگذاری نوبت‌ها' : 'Failed to load bookings'}</p>`;
    }
  }

  // ============================================
  // رندر کارت نوبت
  // ============================================
  function renderBookingCard(b) {
    const statusMap = {
      'confirmed': { label: isFa ? 'تایید شده' : 'Confirmed', class: 'confirmed' },
      'pending': { label: isFa ? 'در انتظار' : 'Pending', class: 'pending' },
      'cancelled': { label: isFa ? 'لغو شده' : 'Cancelled', class: 'cancelled' },
      'awaiting_payment': { label: isFa ? 'در انتظار پرداخت' : 'Awaiting Payment', class: 'pending' }
    };
    const status = statusMap[b.status] || { label: b.status, class: 'pending' };

    const serviceNames = (b.booking_services || [])
      .map(bs => bs.service?.name || '—')
      .join(', ') || (isFa ? 'بدون خدمت' : 'No service');

    const paid = Number(b.paid_amount || 0);
    const total = Number(b.total_amount || 0);

    return `
      <div class="appointment-card">
        <div class="appointment-info">
          <div class="appointment-head">
            <h3>${serviceNames}</h3>
            <div class="appointment-status status-${status.class}">${status.label}</div>
          </div>
          <div class="appointment-meta">
            <span>📅 ${formatDate(b.booking_date, isFa)}</span>
            <span>🕐 ${formatTime(b.start_time)} - ${formatTime(b.end_time)}</span>
            <span>💰 ${formatPrice(total, isFa)}</span>
          </div>
          <div class="appointment-payment">
            <span>${isFa ? 'پرداخت شده' : 'Paid'}: ${formatPrice(paid, isFa)}</span>
            ${paid < total ? `<span class="text-danger">${isFa ? 'باقی‌مانده' : 'Remaining'}: ${formatPrice(total - paid, isFa)}</span>` : ''}
          </div>
        </div>
        <div class="appointment-actions">
          <button class="secondary-button small" data-booking-action="view" data-booking-id="${b.id}">
            ${isFa ? 'جزئیات' : 'Details'}
          </button>
          ${b.status !== 'cancelled' ? `
            <button class="secondary-button small" data-booking-action="reschedule" data-booking-id="${b.id}">
              ${isFa ? 'تغییر زمان' : 'Reschedule'}
            </button>
            <button class="secondary-button small danger" data-booking-action="cancel" data-booking-id="${b.id}">
              ${isFa ? 'لغو' : 'Cancel'}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ============================================
  // لغو نوبت
  // ============================================
  async function cancelBooking(booking) {
    if (!confirm(isFa ? 'از لغو این نوبت مطمئنی؟' : 'Cancel this appointment?')) return;

    try {
      await bookingsApi.cancel(booking.id);
      console.log('✅ Booking cancelled');
      loadAppointments();
    } catch (err) {
      console.error('❌ Cancel error:', err);
      alert(err.message || 'خطا در لغو');
    }
  }

  // ============================================
  // تغییر زمان
  // ============================================
  function openReschedule(booking) {
    const newDate = prompt(
      isFa ? 'تاریخ جدید (YYYY-MM-DD):' : 'New date (YYYY-MM-DD):',
      booking.booking_date?.split('T')[0]
    );
    if (!newDate) return;

    const newTime = prompt(
      isFa ? 'ساعت جدید (HH:MM):' : 'New time (HH:MM):',
      booking.start_time?.slice(0, 5)
    );
    if (!newTime) return;

    rescheduleBooking(booking.id, newDate, newTime);
  }

  async function rescheduleBooking(id, date, time) {
    try {
      await bookingsApi.reschedule(id, {
        booking_date: date,
        start_time: time
      });
      console.log('✅ Rescheduled');
      loadAppointments();
    } catch (err) {
      console.error('❌ Reschedule error:', err);
      alert(err.message || 'خطا در تغییر زمان');
    }
  }

  // ============================================
  // جزئیات نوبت
  // ============================================
  function openBookingDetails(booking) {
    const serviceNames = (booking.booking_services || [])
      .map(bs => bs.service?.name || '—')
      .join(', ') || '—';

    const paymentsList = (booking.payments || []).map(p =>
      `• ${formatPrice(p.amount, isFa)} - ${p.type} (${p.payment_method}) - ${p.status}`
    ).join('\n') || (isFa ? 'پرداختی نیست' : 'No payments');

    alert(`
${isFa ? 'خدمت' : 'Service'}: ${serviceNames}
${isFa ? 'تاریخ' : 'Date'}: ${formatDate(booking.booking_date, isFa)}
${isFa ? 'ساعت' : 'Time'}: ${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}
${isFa ? 'وضعیت' : 'Status'}: ${booking.status}
${isFa ? 'مبلغ کل' : 'Total'}: ${formatPrice(booking.total_amount, isFa)}
${isFa ? 'پرداخت شده' : 'Paid'}: ${formatPrice(booking.paid_amount, isFa)}
${isFa ? 'یادداشت' : 'Notes'}: ${booking.notes || '—'}

${isFa ? 'پرداخت‌ها' : 'Payments'}:
${paymentsList}
    `);
  }

  // ============================================
  // پروفایل
  // ============================================
  async function loadProfile() {
    const wrapper = document.querySelector('[data-profile-wrapper]');
    if (!wrapper) return;

    wrapper.innerHTML = `<div class="loading-placeholder">${t('common.loading')}</div>`;

    try {
      const res = await profileApi.get();
      console.log('👤 Profile response:', res);

      const client = res?.data?.client || res?.data || {};
      profileData = client;

      wrapper.innerHTML = renderProfileCard(client);
      initProfileListeners(client);

    } catch (err) {
      console.error('❌ Profile error:', err);
      wrapper.innerHTML = `<p>${isFa ? 'خطا در بارگذاری پروفایل' : 'Failed to load profile'}</p>`;
    }
  }

  function renderProfileCard(client) {
    return `
      <div class="profile-card" data-profile-view>
        <div class="profile-card-header">
          <div class="profile-avatar">${getInitials(client.name)}</div>
          <div class="profile-card-info">
            <h2>${client.name || '-'}</h2>
            <p dir="ltr">${client.email || '-'}</p>
          </div>
        </div>

        <div class="profile-fields">
          <div class="profile-field">
            <label>${isFa ? 'نام' : 'Name'}</label>
            <div class="profile-value">${client.name || '-'}</div>
          </div>
          <div class="profile-field">
            <label>${isFa ? 'ایمیل' : 'Email'}</label>
            <div class="profile-value" dir="ltr">${client.email || '-'}</div>
          </div>
          <div class="profile-field">
            <label>${isFa ? 'شماره تلفن' : 'Phone'}</label>
            <div class="profile-value" dir="ltr">${client.phone || '-'}</div>
          </div>
          ${client.referral_code ? `
            <div class="profile-field">
              <label>${isFa ? 'کد معرف' : 'Referral Code'}</label>
              <div class="profile-value" dir="ltr">${client.referral_code}</div>
            </div>
          ` : ''}
          <div class="profile-field">
            <label>${isFa ? 'تاریخ عضویت' : 'Member Since'}</label>
            <div class="profile-value">${formatDate(client.created_at, isFa)}</div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="primary-button w-button" data-edit-profile>
            ${isFa ? 'ویرایش پروفایل' : 'Edit Profile'}
          </button>
          <button class="secondary-button" data-change-phone>
            ${isFa ? 'تغییر شماره تلفن' : 'Change Phone'}
          </button>
        </div>
      </div>

      <div class="profile-card" data-edit-form style="display:none">
        <h2>${isFa ? 'ویرایش پروفایل' : 'Edit Profile'}</h2>
        <form data-profile-form>
          <div class="profile-field">
            <label>${isFa ? 'نام' : 'Name'}</label>
            <input type="text" name="name" class="auth-input" value="${client.name || ''}" required />
          </div>
          <div class="profile-field">
            <label>${isFa ? 'ایمیل' : 'Email'}</label>
            <input type="email" name="email" class="auth-input" value="${client.email || ''}" dir="ltr" />
          </div>
          <div class="profile-actions">
            <button type="submit" class="primary-button w-button">${isFa ? 'ذخیره' : 'Save'}</button>
            <button type="button" class="secondary-button" data-cancel-edit>${isFa ? 'لغو' : 'Cancel'}</button>
          </div>
        </form>
        <div class="form-message" data-edit-msg></div>
      </div>

      <div class="profile-card" data-phone-wrapper style="display:none">
        <h2>${isFa ? 'تغییر شماره تلفن' : 'Change Phone Number'}</h2>

        <form data-phone-step-1>
          <div class="profile-field">
            <label>${isFa ? 'شماره جدید' : 'New Phone'}</label>
            <input type="tel" name="phone" class="auth-input" placeholder="09123456789" dir="ltr" required />
          </div>
          <div class="profile-actions">
            <button type="submit" class="primary-button w-button">${isFa ? 'ارسال کد' : 'Send Code'}</button>
            <button type="button" class="secondary-button" data-cancel-phone>${isFa ? 'لغو' : 'Cancel'}</button>
          </div>
        </form>

        <form data-phone-step-2 style="display:none">
          <p style="margin-bottom:16px;font-size:14px;color:var(--color-gray)">
            ${isFa ? 'کد ارسال شده به شماره جدید را وارد کنید' : 'Enter the code sent to new phone'}
          </p>
          <div class="profile-field">
            <label>${isFa ? 'کد تایید' : 'Verification Code'}</label>
            <input type="text" name="code" class="auth-input otp-input" maxlength="6" inputmode="numeric" pattern="[0-9]*" dir="ltr" required />
          </div>
          <div class="profile-actions">
            <button type="submit" class="primary-button w-button">${isFa ? 'تایید' : 'Verify'}</button>
            <button type="button" class="secondary-button" data-cancel-phone>${isFa ? 'لغو' : 'Cancel'}</button>
          </div>
        </form>

        <div class="form-message" data-phone-msg></div>
      </div>
    `;
  }

  function initProfileListeners(client) {
    const wrapper = document.querySelector('[data-profile-wrapper]');
    if (!wrapper) return;

    const view = wrapper.querySelector('[data-profile-view]');
    const editForm = wrapper.querySelector('[data-edit-form]');
    const profileForm = wrapper.querySelector('[data-profile-form]');
    const editMsg = wrapper.querySelector('[data-edit-msg]');

    const phoneWrapper = wrapper.querySelector('[data-phone-wrapper]');
    const phoneStep1 = wrapper.querySelector('[data-phone-step-1]');
    const phoneStep2 = wrapper.querySelector('[data-phone-step-2]');
    const phoneMsg = wrapper.querySelector('[data-phone-msg]');
    let newPhone = '';

    wrapper.querySelector('[data-edit-profile]')?.addEventListener('click', () => {
      view.style.display = 'none';
      editForm.style.display = 'block';
    });

    wrapper.querySelector('[data-cancel-edit]')?.addEventListener('click', () => {
      editForm.style.display = 'none';
      view.style.display = 'block';
    });

    profileForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(profileForm));
      const btn = profileForm.querySelector('button[type="submit"]');
      setLoading(btn, true);
      showMsg(editMsg, '');

      try {
        await profileApi.update(data);
        console.log('✅ Profile updated');
        showMsg(editMsg, isFa ? 'پروفایل بروزرسانی شد' : 'Profile updated', 'success');

        const updatedUser = { ...client, ...data };
        setAuth(getToken(), updatedUser);

        setTimeout(() => {
          profileLoaded = false;
          loadProfile();
        }, 1000);
      } catch (err) {
        console.error('❌ Update error:', err);
        showMsg(editMsg, err.message || 'خطا', 'error');
      } finally {
        setLoading(btn, false);
      }
    });

    wrapper.querySelector('[data-change-phone]')?.addEventListener('click', () => {
      view.style.display = 'none';
      phoneWrapper.style.display = 'block';
    });

    wrapper.querySelectorAll('[data-cancel-phone]').forEach(btn => {
      btn.addEventListener('click', () => {
        phoneWrapper.style.display = 'none';
        view.style.display = 'block';
        phoneStep1.style.display = 'block';
        phoneStep2.style.display = 'none';
        phoneStep1.reset();
        phoneStep2.reset();
        showMsg(phoneMsg, '');
      });
    });

    phoneStep1?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(phoneStep1));
      const phone = normalizePhone(data.phone);

      if (!isValidPhone(phone)) {
        showMsg(phoneMsg, isFa ? 'شماره معتبر نیست' : 'Invalid phone', 'error');
        return;
      }

      newPhone = phone;
      const btn = phoneStep1.querySelector('button[type="submit"]');
      setLoading(btn, true);
      showMsg(phoneMsg, '');

      try {
        await profileApi.changePhoneSendCode(phone);
        console.log('📱 Code sent to:', phone);
        phoneStep1.style.display = 'none';
        phoneStep2.style.display = 'block';
        showMsg(phoneMsg, isFa ? 'کد ارسال شد' : 'Code sent', 'success');
      } catch (err) {
        console.error('❌ Send code error:', err);
        showMsg(phoneMsg, err.message || 'خطا', 'error');
      } finally {
        setLoading(btn, false);
      }
    });

    phoneStep2?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(phoneStep2));

      if (!data.code || data.code.length < 5) {
        showMsg(phoneMsg, isFa ? 'کد را کامل وارد کنید' : 'Enter full code', 'error');
        return;
      }

      const btn = phoneStep2.querySelector('button[type="submit"]');
      setLoading(btn, true);
      showMsg(phoneMsg, '');

      try {
        const res = await profileApi.changePhoneVerify(newPhone, data.code);
        console.log('✅ Phone changed:', res);

        const newToken = res?.data?.token || res?.token;
        const updatedUser = { ...client, phone: newPhone };
        setAuth(newToken || getToken(), updatedUser);

        showMsg(phoneMsg, isFa ? 'شماره تغییر کرد' : 'Phone updated', 'success');

        setTimeout(() => {
          profileLoaded = false;
          loadProfile();
        }, 1000);
      } catch (err) {
        console.error('❌ Verify error:', err);
        showMsg(phoneMsg, err.message || 'کد اشتباه', 'error');
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // ============================================
  // لود schedule کارمند
  // ============================================
  async function loadStaffSchedule(staffId) {
    if (staffSchedule) return staffSchedule;

    try {
      const res = await staffApi.schedule(staffId);
      console.log('👨‍💼 Staff schedule:', res);

      staffSchedule = res?.data?.schedules || [];
      return staffSchedule;
    } catch (err) {
      console.error('❌ Staff schedule error:', err);
      return [];
    }
  }

  // ============================================
  // MODAL رزرو
  // ============================================
  async function openBookingModal(service) {
    selectedService = service;
    selectedDate = null;
    selectedTime = null;
    currentStep = 1;
    staffSchedule = null;

    const modal = document.querySelector('[data-booking-modal]');
    modal.querySelector('[data-modal-title]').textContent = service.name;
    modal.querySelector('[data-modal-subtitle]').textContent = service.description || '';

    modal.querySelector('[data-step="date"]').style.display = 'block';
    modal.querySelector('[data-step="time"]').style.display = 'none';
    modal.querySelector('[data-step="notes"]').style.display = 'none';
    modal.querySelector('[data-booking-summary]').style.display = 'none';
    modal.querySelector('[data-booking-prev]').style.display = 'none';
    modal.querySelector('[data-booking-next]').textContent = isFa ? 'ادامه' : 'Continue';
    modal.querySelector('[data-booking-next]').disabled = true;
    modal.querySelector('[data-booking-msg]').textContent = '';
    modal.querySelector('[data-booking-notes]').value = '';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    await renderDatePicker();
  }

  // ============================================
  // Date Picker
  // ============================================
  async function renderDatePicker() {
    const picker = document.querySelector('[data-date-picker]');
    if (!picker) return;

    picker.innerHTML = `<div class="loading-placeholder">${isFa ? 'در حال بارگذاری...' : 'Loading...'}</div>`;

    await loadStaffSchedule(selectedService.staff_id || 1);

    const days = getNextDays(14);

    picker.innerHTML = days.map(d => {
      const workingHours = getWorkingHours(d.iso, staffSchedule);
      const isOff = !workingHours;

      return `
        <button
          class="date-item ${isOff ? 'disabled' : ''}"
          data-date="${d.iso}"
          ${isOff ? 'disabled' : ''}
        >
          <span class="date-day">${d.weekday}</span>
          <span class="date-num">${d.dayNum}</span>
          <span class="date-month">${d.monthName}</span>
          ${isOff ? '<span class="off-label">تعطیل</span>' : ''}
        </button>
      `;
    }).join('');

    picker.querySelectorAll('.date-item:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        picker.querySelectorAll('.date-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDate = btn.dataset.date;
        updateNextButton();
      });
    });
  }

  // ============================================
  // Working Hours Helpers
  // ============================================
  function getWorkingHours(date, staffSchedule) {
    const d = new Date(date);
    const jsDay = d.getDay();

    const daySchedule = staffSchedule.find(s => s.day_of_week === jsDay);
    if (!daySchedule) return null;

    return {
      start: daySchedule.start_time.slice(0, 5),
      end: daySchedule.end_time.slice(0, 5)
    };
  }

  function generateTimeSlots(start, end, stepMinutes = 30) {
    const slots = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let current = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    while (current < endTotal) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      current += stepMinutes;
    }

    return slots;
  }

  // ============================================
  // Time Picker
  // ============================================
  async function renderTimePicker() {
    const picker = document.querySelector('[data-time-picker]');
    if (!picker) return;

    picker.innerHTML = `<div class="loading-placeholder">${isFa ? 'در حال بارگذاری...' : 'Loading...'}</div>`;

    try {
      const workingHours = getWorkingHours(selectedDate, staffSchedule);
      if (!workingHours) {
        picker.innerHTML = `<p class="text-danger">${isFa ? 'این روز تعطیل است' : 'Closed on this day'}</p>`;
        return;
      }

      const res = await availabilityApi.check(
        selectedService.staff_id || 1,
        selectedService.id,
        selectedDate
      );
      console.log('⏰ Available slots:', res);

      availableSlots = (res?.data || []).map(s => s.start_time.slice(0, 5));

      const allSlots = generateTimeSlots(workingHours.start, workingHours.end, 30);

      picker.innerHTML = allSlots.map(time => {
        const isAvailable = availableSlots.includes(time);

        return `
          <button
            class="time-item ${isAvailable ? '' : 'booked'}"
            data-time="${time}"
            ${isAvailable ? '' : 'disabled'}
          >
            ${time}
            ${!isAvailable ? '<span class="booked-label">✕</span>' : ''}
          </button>
        `;
      }).join('');

      picker.querySelectorAll('.time-item:not(.booked)').forEach(btn => {
        btn.addEventListener('click', () => {
          picker.querySelectorAll('.time-item').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedTime = btn.dataset.time;
          updateNextButton();
        });
      });

    } catch (err) {
      console.error('❌ Time picker error:', err);
      picker.innerHTML = `<p>${isFa ? 'خطا در بارگذاری ساعات' : 'Failed to load times'}</p>`;
    }
  }

  // ============================================
  // NEXT Button
  // ============================================
  document.querySelector('[data-booking-next]')?.addEventListener('click', async () => {
    const nextBtn = document.querySelector('[data-booking-next]');
    const msg = document.querySelector('[data-booking-msg]');

    if (currentStep === 1 && selectedDate) {
      currentStep = 2;
      document.querySelector('[data-step="date"]').style.display = 'none';
      document.querySelector('[data-step="time"]').style.display = 'block';
      document.querySelector('[data-booking-prev]').style.display = 'block';
      await renderTimePicker();
      updateNextButton();
    } else if (currentStep === 2 && selectedTime) {
      currentStep = 3;
      document.querySelector('[data-step="time"]').style.display = 'none';
      document.querySelector('[data-step="notes"]').style.display = 'block';
      nextBtn.textContent = isFa ? 'مشاهده خلاصه' : 'View Summary';
      updateNextButton();
    } else if (currentStep === 3) {
      currentStep = 4;
      document.querySelector('[data-step="notes"]').style.display = 'none';
      document.querySelector('[data-booking-summary]').style.display = 'block';
      nextBtn.textContent = isFa ? 'ثبت و پرداخت' : 'Book & Pay';

      document.querySelector('[data-summary-service]').textContent = selectedService.name;
      document.querySelector('[data-summary-date]').textContent = formatDate(selectedDate, isFa);
      document.querySelector('[data-summary-time]').textContent = selectedTime;
      document.querySelector('[data-summary-price]').textContent = formatPrice(selectedService.price, isFa);
    } else if (currentStep === 4) {
      const notes = document.querySelector('[data-booking-notes]').value.trim();

      setLoading(nextBtn, true);
      showMsg(msg, '');

      try {
        const payload = {
          booking_date: selectedDate,
          services: [
            {
              service_id: selectedService.id,
              staff_id: selectedService.staff_id || 1,
              start_time: selectedTime
            }
          ],
          notes: notes || undefined
        };

        console.log('📅 Creating booking:', payload);
        const res = await bookingsApi.create(payload);
        console.log('✅ Booking created:', res);

        const bookingId = res?.data?.id;

        showMsg(msg, isFa ? 'نوبت ثبت شد. در حال انتقال به پرداخت...' : 'Booked! Redirecting to payment...', 'success');

        document.querySelector('[data-booking-modal]').style.display = 'none';
        document.body.style.overflow = '';

        loadAppointments();

        if (bookingId) {
          setTimeout(() => {
            window.__app?.router?.navigate(`/checkout?booking=${bookingId}`);
          }, 800);
        }
      } catch (err) {
        console.error('❌ Create booking error:', err);
        showMsg(msg, err.message || (isFa ? 'خطا در ثبت نوبت' : 'Booking failed'), 'error');
      } finally {
        setLoading(nextBtn, false);
      }
    }
  });

  // ============================================
  // PREV Button
  // ============================================
  document.querySelector('[data-booking-prev]')?.addEventListener('click', () => {
    const nextBtn = document.querySelector('[data-booking-next]');

    if (currentStep === 2) {
      currentStep = 1;
      document.querySelector('[data-step="time"]').style.display = 'none';
      document.querySelector('[data-step="date"]').style.display = 'block';
      document.querySelector('[data-booking-prev]').style.display = 'none';
      updateNextButton();
    } else if (currentStep === 3) {
      currentStep = 2;
      document.querySelector('[data-step="notes"]').style.display = 'none';
      document.querySelector('[data-step="time"]').style.display = 'block';
      nextBtn.textContent = isFa ? 'ادامه' : 'Continue';
      updateNextButton();
    } else if (currentStep === 4) {
      currentStep = 3;
      document.querySelector('[data-booking-summary]').style.display = 'none';
      document.querySelector('[data-step="notes"]').style.display = 'block';
      nextBtn.textContent = isFa ? 'مشاهده خلاصه' : 'View Summary';
      updateNextButton();
    }
  });

  // ============================================
  // CLOSE Modal
  // ============================================
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector('[data-booking-modal]').style.display = 'none';
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // UPDATE Next Button
  // ============================================
  function updateNextButton() {
    const btn = document.querySelector('[data-booking-next]');
    if (!btn) return;
    if (currentStep === 1) btn.disabled = !selectedDate;
    else if (currentStep === 2) btn.disabled = !selectedTime;
    else btn.disabled = false;
  }

  // ============================================
  // Helpers
  // ============================================
  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
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
      btn.textContent = isFa ? 'لطفاً صبر کنید...' : 'Please wait...';
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
    }
  }
}