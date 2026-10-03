// ============================================
// Login Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { authApi } from '../code/api.js';
import { setAuth } from '../code/auth.js';

export async function LoginPage() {
  console.log('🟢 LoginPage started');

  const html = Layout(`
    <div class="auth-page">
      <div class="auth-container">

        <div class="auth-header">
          <h2>${t('auth.login_title')}</h2>
          <p>${t('auth.login_subtitle')}</p>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs" data-tabs>
          <button type="button" class="auth-tab active" data-tab="phone">${t('auth.tab_phone')}</button>
          <button type="button" class="auth-tab" data-tab="email">${t('auth.tab_email')}</button>
        </div>

        <!-- Phone Tab -->
        <div class="auth-tab-content" data-tab-content="phone">
          <form class="auth-form" data-phone-form>
            <div class="auth-field">
              <label>${t('auth.phone_label')}</label>
              <input type="tel" name="phone" placeholder="${t('auth.phone_placeholder')}" class="auth-input" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${t('auth.btn_send_otp_login')}
            </button>
          </form>
        </div>

        <!-- Email Tab -->
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
            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${t('auth.btn_login')}
            </button>
          </form>
        </div>

        <!-- OTP Step -->
        <div class="auth-otp-step" data-otp-step style="display:none">
          <div class="auth-header" style="margin-bottom:20px">
            <p>${t('auth.otp_subtitle').replace('{phone}', '<strong data-phone-display></strong>')}</p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label>${t('auth.otp_label')}</label>
              <input type="text" name="code" placeholder="${t('auth.otp_placeholder')}" class="auth-input otp-input" maxlength="6" inputmode="numeric" pattern="[0-9]*" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-otp-submit>
              ${t('auth.btn_verify_login')}
            </button>
          </form>

          <div class="auth-resend">
            <button type="button" class="auth-link-btn" data-resend-btn>${t('auth.btn_resend')}</button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:12px">
            <button type="button" class="auth-link-btn" data-back-btn>${t('auth.btn_back')}</button>
          </div>
        </div>

        <!-- Message -->
        <div class="form-message" data-msg></div>

        <!-- Footer -->
        <div class="auth-footer" data-main-footer>
          <span>${t('auth.no_account')}</span>
          <a href="/register" data-nav-link>${t('auth.link_register')}</a>
        </div>

      </div>
    </div>
  `);

  console.log('🟢 HTML generated');

  // ✅ بعد از رندر، listener ها رو وصل کن
  setTimeout(() => {
    console.log('🎬 Initializing login listeners...');

    const tabs = document.querySelectorAll('[data-tab]');
    const otpStep = document.querySelector('[data-otp-step]');

    console.log('Tabs found:', tabs.length);
    console.log('OTP step found:', !!otpStep);

    initLayout();
    initLogin();

    console.log('✅ Login listeners attached');
  }, 100);

  return html;
}

// ============================================
// Login Logic
// ============================================
function initLogin() {
  console.log('🔧 initLogin started');

  let currentPhone = '';
  let resendTimer = null;

  const tabsEl = document.querySelector('[data-tabs]');
  const otpStep = document.querySelector('[data-otp-step]');
  const mainFooter = document.querySelector('[data-main-footer]');
  const msg = document.querySelector('[data-msg]');
  const phoneDisplay = document.querySelector('[data-phone-display]');
  const resendBtn = document.querySelector('[data-resend-btn]');
  const timerEl = document.querySelector('[data-timer]');
  const backBtn = document.querySelector('[data-back-btn]');

  // ============================================
  // Tabs
  // ============================================
  const tabs = document.querySelectorAll('[data-tab]');
  console.log('🔧 Found', tabs.length, 'tabs');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🖱️ Tab clicked:', tab.dataset.tab);

      const target = tab.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('[data-tab-content]').forEach(c => c.style.display = 'none');

      tab.classList.add('active');
      const content = document.querySelector(`[data-tab-content="${target}"]`);
      if (content) content.style.display = 'block';

      showMsg('');
    });
  });

  // ============================================
  // Phone Form
  // ============================================
  const phoneForm = document.querySelector('[data-phone-form]');
  console.log('🔧 Phone form:', !!phoneForm);

  phoneForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📱 Phone form submitted');

    const data = Object.fromEntries(new FormData(phoneForm));
    const phone = normalizePhone(data.phone);

    if (!isValidPhone(phone)) {
      showMsg(t('auth.msg_invalid_phone'), 'error');
      return;
    }

    currentPhone = phone;
    const btn = phoneForm.querySelector('[data-submit-btn]');
    setLoading(btn, true);

    try {
      const res = await authApi.loginPhoneSendCode(phone);
      console.log('📱 Send code response:', res);

      if (phoneDisplay) phoneDisplay.textContent = phone;

      if (tabsEl) tabsEl.style.display = 'none';
      document.querySelectorAll('[data-tab-content]').forEach(c => c.style.display = 'none');
      if (mainFooter) mainFooter.style.display = 'none';

      if (otpStep) otpStep.style.display = 'block';
      startResendTimer(60);
      showMsg('');

      setTimeout(() => otpStep?.querySelector('input[name="code"]')?.focus(), 100);
    } catch (err) {
      console.error('❌ Send code error:', err);
      showMsg(err.message || t('auth.msg_error_send'), 'error');
    } finally {
      setLoading(btn, false);
    }
  });

  // ============================================
  // OTP Form
  // ============================================
  const otpForm = document.querySelector('[data-otp-form]');
  console.log('🔧 OTP form:', !!otpForm);

  otpForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('🔐 OTP form submitted');

    const data = Object.fromEntries(new FormData(otpForm));

    if (!data.code || data.code.length < 5) {
      showMsg(t('auth.msg_otp_incomplete'), 'error');
      return;
    }

    const btn = otpForm.querySelector('[data-otp-submit]');
    setLoading(btn, true);

    try {
      const res = await authApi.loginPhoneVerify(currentPhone, data.code);
      console.log('✅ Verify response:', res);

      const token = res?.token || res?.access_token || res?.data?.token || res?.data?.access_token;
      const user = res?.user || res?.data?.user || { phone: currentPhone };

      if (!token) throw new Error(t('auth.msg_error_verify'));

      setAuth(token, user);
      showMsg(t('auth.msg_login_success'), 'success');

      setTimeout(() => window.__app?.router?.navigate('/dashboard'), 800);
    } catch (err) {
      console.error('❌ Verify error:', err);
      showMsg(err.message || t('auth.msg_error_verify'), 'error');
    } finally {
      setLoading(btn, false);
    }
  });

  // ============================================
  // Email Form
  // ============================================
  const emailForm = document.querySelector('[data-email-form]');
  console.log('🔧 Email form:', !!emailForm);

  emailForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📧 Email form submitted');

    const data = Object.fromEntries(new FormData(emailForm));
    const btn = emailForm.querySelector('[data-submit-btn]');
    setLoading(btn, true);

    try {
      const res = await authApi.loginEmail(data.email, data.password);
      console.log('📧 Email login response:', res);

      const token = res?.token || res?.access_token || res?.data?.token || res?.data?.access_token;
      const user = res?.user || res?.data?.user || { email: data.email };

      if (!token) throw new Error(t('auth.msg_error_login'));

      setAuth(token, user);
      showMsg(t('auth.msg_login_success'), 'success');

      setTimeout(() => window.__app?.router?.navigate('/dashboard'), 800);
    } catch (err) {
      console.error('❌ Email login error:', err);
      showMsg(err.message || t('auth.msg_error_login'), 'error');
    } finally {
      setLoading(btn, false);
    }
  });

  // ============================================
  // Resend
  // ============================================
  resendBtn?.addEventListener('click', async () => {
    if (resendBtn.disabled) return;
    try {
      await authApi.loginPhoneSendCode(currentPhone);
      showMsg(t('auth.msg_otp_resent'), 'success');
      startResendTimer(60);
    } catch (err) {
      showMsg(err.message, 'error');
    }
  });

  // ============================================
  // Back
  // ============================================
  backBtn?.addEventListener('click', () => {
    if (otpStep) otpStep.style.display = 'none';
    if (tabsEl) tabsEl.style.display = 'flex';
    const phoneTab = document.querySelector('[data-tab-content="phone"]');
    if (phoneTab) phoneTab.style.display = 'block';
    if (mainFooter) mainFooter.style.display = 'flex';
    if (otpForm) otpForm.reset();
    if (resendTimer) clearInterval(resendTimer);
    showMsg('');
  });

  // ============================================
  // Helpers
  // ============================================
  function startResendTimer(seconds) {
    if (resendTimer) clearInterval(resendTimer);
    let remaining = seconds;
    if (resendBtn) {
      resendBtn.disabled = true;
      resendBtn.style.opacity = '0.5';
    }

    const update = () => {
      if (remaining <= 0) {
        clearInterval(resendTimer);
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.style.opacity = '1';
        }
        if (timerEl) timerEl.textContent = '';
        return;
      }
      if (timerEl) timerEl.textContent = `(${remaining}s)`;
      remaining--;
    };
    update();
    resendTimer = setInterval(update, 1000);
  }

  function showMsg(text, type = 'info') {
    if (!msg) return;
    msg.textContent = text;
    msg.style.display = text ? 'block' : 'none';
    msg.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#666';
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

  console.log('✅ initLogin completed');
}