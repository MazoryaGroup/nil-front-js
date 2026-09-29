// ============================================
// Auth Page - Login + Register (یکپارچه + دوزبانه)
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { apiPost } from '../code/api.js';
import { setAuth } from '../code/auth.js';

// ============================================
// AuthPage
// ============================================
export async function AuthPage(params = {}) {
  const mode = params.mode || detectMode();
  const isLogin = mode === 'login';

  const html = Layout(`
    <div class="auth-page">
      <div class="auth-container">

        <div class="auth-header">
          <h2>${isLogin ? t('auth.login_title') : t('auth.register_title')}</h2>
          <p>${isLogin ? t('auth.login_subtitle') : t('auth.register_subtitle')}</p>
        </div>

        ${isLogin ? renderLoginTabs() : ''}
        ${isLogin ? renderPhoneForm() : renderRegisterPhoneForm()}
        ${isLogin ? renderEmailForm() : ''}

        <div class="form-message" data-msg></div>

        <!-- مرحله OTP -->
        <div class="auth-step" data-step="otp" style="display:none">
          <div class="auth-header">
            <h2>${isLogin ? t('auth.otp_title_login') : t('auth.otp_title_register')}</h2>
            <p>${t('auth.otp_subtitle').replace('{phone}', '<span data-phone-display></span>')}</p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label>${t('auth.otp_label')}</label>
              <input
                type="text"
                name="code"
                placeholder="${t('auth.otp_placeholder')}"
                class="auth-input otp-input"
                maxlength="5"
                inputmode="numeric"
                pattern="[0-9]*"
                required
                dir="ltr"
              />
            </div>

            ${!isLogin ? `
              <div class="auth-field" data-name-field>
                <label>${t('auth.name_label')}</label>
                <input type="text" name="name" placeholder="${t('auth.name_placeholder')}" class="auth-input" />
              </div>
            ` : ''}

            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${isLogin ? t('auth.btn_verify_login') : t('auth.btn_verify_register')}
            </button>
          </form>

          <div class="form-message" data-msg-otp></div>

          <div class="auth-resend">
            <button type="button" class="auth-link-btn" data-resend-btn>${t('auth.btn_resend')}</button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div class="auth-footer">
            <button type="button" class="auth-link-btn" data-back-btn>${t('auth.btn_back')}</button>
          </div>
        </div>

        <div class="auth-footer" data-main-footer>
          ${isLogin
            ? `<span>${t('auth.no_account')}</span><a href="/register" data-nav-link>${t('auth.link_register')}</a>`
            : `<span>${t('auth.have_account')}</span><a href="/login" data-nav-link>${t('auth.link_login')}</a>`
          }
        </div>

      </div>
    </div>
  `);

  queueMicrotask(() => {
    initLayout();
    initAuthFlow(mode);
  });

  return html;
}

// ============================================
// تشخیص حالت
// ============================================
function detectMode() {
  return window.location.pathname.includes('register') ? 'register' : 'login';
}

// ============================================
// تب‌ها
// ============================================
function renderLoginTabs() {
  return `
    <div class="auth-tabs" data-tabs>
      <button type="button" class="auth-tab active" data-tab="phone">${t('auth.tab_phone')}</button>
      <button type="button" class="auth-tab" data-tab="email">${t('auth.tab_email')}</button>
    </div>
  `;
}

// ============================================
// فرم شماره (ثبت‌نام)
// ============================================
function renderRegisterPhoneForm() {
  return `
    <form class="auth-form" data-phone-form>
      <div class="auth-field">
        <label>${t('auth.phone_label')}</label>
        <input type="tel" name="phone" placeholder="${t('auth.phone_placeholder')}" class="auth-input" required dir="ltr" />
      </div>
      <button type="submit" class="primary-button w-button" data-submit-btn>${t('auth.btn_send_otp_register')}</button>
    </form>
  `;
}

// ============================================
// فرم شماره (ورود)
// ============================================
function renderPhoneForm() {
  return `
    <div class="auth-tab-content" data-tab-content="phone">
      <form class="auth-form" data-phone-form>
        <div class="auth-field">
          <label>${t('auth.phone_label')}</label>
          <input type="tel" name="phone" placeholder="${t('auth.phone_placeholder')}" class="auth-input" required dir="ltr" />
        </div>
        <button type="submit" class="primary-button w-button" data-submit-btn>${t('auth.btn_send_otp_login')}</button>
      </form>
    </div>
  `;
}

// ============================================
// فرم ایمیل
// ============================================
function renderEmailForm() {
  return `
    <div class="auth-tab-content" data-tab-content="email" style="display:none">
      <form class="auth-form" data-email-form>
        <div class="auth-field">
          <label>${t('auth.email_label')}</label>
          <input type="email" name="email" placeholder="${t('auth.email_placeholder')}" class="auth-input" required dir="ltr" />
        </div>
        <div class="auth-field">
          <label>${t('auth.password_label')}</label>
          <input type="password" name="password" placeholder="${t('auth.password_placeholder')}" class="auth-input" required dir="ltr" />
        </div>
        <button type="submit" class="primary-button w-button" data-submit-btn>${t('auth.btn_login')}</button>
      </form>
    </div>
  `;
}

// ============================================
// منطق Auth
// ============================================
function initAuthFlow(mode) {
  const isLogin = mode === 'login';
  let currentPhone = '';
  let resendTimer = null;

  // تب‌ها
  if (isLogin) {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('[data-tab-content]').forEach(c => c.style.display = 'none');
        tab.classList.add('active');
        const target = document.querySelector(`[data-tab-content="${tab.dataset.tab}"]`);
        if (target) target.style.display = 'block';
      });
    });
  }

  const phoneForm = document.querySelector('[data-phone-form]');
  const emailForm = document.querySelector('[data-email-form]');
  const otpStep = document.querySelector('[data-step="otp"]');
  const otpForm = document.querySelector('[data-otp-form]');
  const phoneDisplay = document.querySelector('[data-phone-display]');
  const msg = document.querySelector('[data-msg]');
  const msgOtp = document.querySelector('[data-msg-otp]');
  const resendBtn = document.querySelector('[data-resend-btn]');
  const timerEl = document.querySelector('[data-timer]');
  const backBtn = document.querySelector('[data-back-btn]');
  const mainFooter = document.querySelector('[data-main-footer]');
  const tabsEl = document.querySelector('[data-tabs]');

  // ============================================
  // ارسال شماره
  // ============================================
  phoneForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(phoneForm));
    const phone = normalizePhone(data.phone);

    if (!isValidPhone(phone)) {
      showMsg(msg, t('auth.msg_invalid_phone'), 'error');
      return;
    }

    currentPhone = phone;
    setLoading(phoneForm.querySelector('[data-submit-btn]'), true);

    try {
      // TODO: await apiPost(isLogin ? '/auth/login-otp' : '/auth/send-otp', { phone });
      console.log(isLogin ? '📱 Login OTP:' : '📱 Register OTP:', phone);
      await new Promise(r => setTimeout(r, 800));

      if (phoneDisplay) phoneDisplay.textContent = phone;

      if (isLogin) {
        document.querySelectorAll('[data-tab-content]').forEach(c => c.style.display = 'none');
        if (tabsEl) tabsEl.style.display = 'none';
      } else {
        phoneForm.style.display = 'none';
      }

      if (mainFooter) mainFooter.style.display = 'none';
      otpStep.style.display = 'block';
      startResendTimer(60);

      if (!isLogin) showMsg(msg, t('auth.msg_otp_sent'), 'success');
    } catch (err) {
      showMsg(msg, err.message || t('auth.msg_error_send'), 'error');
    } finally {
      setLoading(phoneForm.querySelector('[data-submit-btn]'), false);
    }
  });

  // ============================================
  // ورود با ایمیل
  // ============================================
  emailForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(emailForm));
    setLoading(emailForm.querySelector('[data-submit-btn]'), true);

    try {
      // TODO: const res = await apiPost('/auth/login', data);
      console.log('📧 Login:', data);
      await new Promise(r => setTimeout(r, 800));

      // setAuth(res.token, res.user);
      showMsg(msg, t('auth.msg_login_success'), 'success');
      setTimeout(() => window.__app?.router?.navigate('/'), 1000);
    } catch (err) {
      showMsg(msg, err.message || t('auth.msg_error_login'), 'error');
    } finally {
      setLoading(emailForm.querySelector('[data-submit-btn]'), false);
    }
  });

  // ============================================
  // تایید OTP
  // ============================================
  otpForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(otpForm));

    if (!data.code || data.code.length < 5) {
      showMsg(msgOtp, t('auth.msg_otp_incomplete'), 'error');
      return;
    }

    setLoading(otpForm.querySelector('[data-submit-btn]'), true);

    try {
      const endpoint = isLogin ? '/auth/verify-login-otp' : '/auth/verify-otp';
      const payload = isLogin
        ? { phone: currentPhone, code: data.code }
        : { phone: currentPhone, code: data.code, name: data.name };

      // TODO: const res = await apiPost(endpoint, payload);
      console.log('✅', endpoint, payload);
      await new Promise(r => setTimeout(r, 800));

      // setAuth(res.token, res.user);
      showMsg(msgOtp, isLogin ? t('auth.msg_login_success') : t('auth.msg_register_success'), 'success');
      setTimeout(() => window.__app?.router?.navigate('/'), 1000);
    } catch (err) {
      showMsg(msgOtp, err.message || t('auth.msg_error_verify'), 'error');
    } finally {
      setLoading(otpForm.querySelector('[data-submit-btn]'), false);
    }
  });

  // ============================================
  // ارسال مجدد
  // ============================================
  resendBtn?.addEventListener('click', async () => {
    if (resendBtn.disabled) return;
    try {
      // TODO: await apiPost(isLogin ? '/auth/login-otp' : '/auth/send-otp', { phone: currentPhone });
      console.log('🔄 Resend to:', currentPhone);
      showMsg(msgOtp, t('auth.msg_otp_resent'), 'success');
      startResendTimer(60);
    } catch (err) {
      showMsg(msgOtp, err.message, 'error');
    }
  });

  // ============================================
  // بازگشت
  // ============================================
  backBtn?.addEventListener('click', () => {
    otpStep.style.display = 'none';
    if (mainFooter) mainFooter.style.display = 'flex';

    if (isLogin) {
      if (tabsEl) tabsEl.style.display = 'flex';
      const phoneTab = document.querySelector('[data-tab-content="phone"]');
      if (phoneTab) phoneTab.style.display = 'block';
    } else {
      phoneForm.style.display = 'flex';
      phoneForm.style.flexDirection = 'column';
    }

    otpForm.reset();
    if (resendTimer) clearInterval(resendTimer);
  });

  // ============================================
  // توابع کمکی
  // ============================================
  function startResendTimer(seconds) {
    if (resendTimer) clearInterval(resendTimer);
    let remaining = seconds;
    resendBtn.disabled = true;
    resendBtn.style.opacity = '0.5';

    const update = () => {
      if (remaining <= 0) {
        clearInterval(resendTimer);
        resendBtn.disabled = false;
        resendBtn.style.opacity = '1';
        timerEl.textContent = '';
        return;
      }
      timerEl.textContent = `(${remaining}s)`;
      remaining--;
    };
    update();
    resendTimer = setInterval(update, 1000);
  }

  function showMsg(element, text, type = 'info') {
    if (!element) return;
    element.textContent = text;
    element.style.display = text ? 'block' : 'none';
    element.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#666';
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = t('auth.loading');
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
    }
  }

  function normalizePhone(phone) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    let result = phone.toString();
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(persianDigits[i], 'g'), i);
      result = result.replace(new RegExp(arabicDigits[i], 'g'), i);
    }
    return result.replace(/\D/g, '');
  }

  function isValidPhone(phone) {
    return /^09\d{9}$/.test(phone) || /^989\d{9}$/.test(phone);
  }
}