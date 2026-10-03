// ============================================
// Register Page (با کد معرف)
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { authApi } from '../code/api.js';
import { setAuth } from '../code/auth.js';

export async function RegisterPage() {
  console.log('🟢 RegisterPage started');

  const html = Layout(`
    <div class="auth-page">
      <div class="auth-container">

        <div class="auth-header">
          <h2>${t('auth.register_title')}</h2>
          <p>${t('auth.register_subtitle')}</p>
        </div>

        <!-- STEP 1: نام + شماره + کد معرف -->
        <div data-step="phone">
          <form class="auth-form" data-phone-form>
            <div class="auth-field">
              <label>${t('auth.name_label')}</label>
              <input type="text" name="name" placeholder="${t('auth.name_placeholder')}" class="auth-input" required />
            </div>
            <div class="auth-field">
              <label>${t('auth.phone_label')}</label>
              <input type="tel" name="phone" placeholder="${t('auth.phone_placeholder')}" class="auth-input" required dir="ltr" />
            </div>
            <div class="auth-field">
              <label>${t('auth.referral_label') || 'کد معرف'} <span style="font-size:12px;color:#999;font-weight:400">(${t('common.optional') || 'اختیاری'})</span></label>
              <input type="text" name="referral_code" placeholder="${t('auth.referral_placeholder') || 'مثلاً: ABC123'}" class="auth-input" dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${t('auth.btn_send_otp_register')}
            </button>
          </form>
        </div>

        <!-- STEP 2: کد OTP -->
        <div data-step="otp" style="display:none">
          <div class="auth-header" style="margin-bottom:20px">
            <p>${t('auth.otp_subtitle').replace('{phone}', '<strong data-phone-display></strong>')}</p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label>${t('auth.otp_label')}</label>
              <input type="text" name="code" placeholder="${t('auth.otp_placeholder')}" class="auth-input otp-input" maxlength="6" inputmode="numeric" pattern="[0-9]*" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-otp-submit>
              ${t('auth.btn_verify_register')}
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

        <div class="form-message" data-msg></div>

        <div class="auth-footer" data-main-footer>
          <span>${t('auth.have_account')}</span>
          <a href="/login" data-nav-link>${t('auth.link_login')}</a>
        </div>

      </div>
    </div>
  `);

  setTimeout(() => {
    initLayout();
    initRegister();
  }, 100);

  return html;
}

// ============================================
// Register Logic
// ============================================
function initRegister() {
  console.log('🔧 initRegister started');

  let currentPhone = '';
  let currentName = '';
  let currentReferral = '';
  let resendTimer = null;

  const phoneStep = document.querySelector('[data-step="phone"]');
  const otpStep = document.querySelector('[data-step="otp"]');
  const phoneForm = document.querySelector('[data-phone-form]');
  const otpForm = document.querySelector('[data-otp-form]');
  const phoneDisplay = document.querySelector('[data-phone-display]');
  const msg = document.querySelector('[data-msg]');
  const resendBtn = document.querySelector('[data-resend-btn]');
  const timerEl = document.querySelector('[data-timer]');
  const backBtn = document.querySelector('[data-back-btn]');
  const mainFooter = document.querySelector('[data-main-footer]');

  // ============================================
  // STEP 1
  // ============================================
  phoneForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Register form submitted');

    const data = Object.fromEntries(new FormData(phoneForm));
    const name = (data.name || '').trim();
    const phone = normalizePhone(data.phone);
    const referral = (data.referral_code || '').trim().toUpperCase();

    if (!name) {
      showMsg(t('auth.name_required') || 'نام را وارد کنید', 'error');
      return;
    }

    if (!isValidPhone(phone)) {
      showMsg(t('auth.msg_invalid_phone'), 'error');
      return;
    }

    currentPhone = phone;
    currentName = name;
    currentReferral = referral;

    const btn = phoneForm.querySelector('[data-submit-btn]');
    setLoading(btn, true);

    try {
      const res = await authApi.registerSendCode(name, phone, referral);
      console.log('📱 Register send code response:', res);

      if (phoneDisplay) phoneDisplay.textContent = phone;

      if (phoneStep) phoneStep.style.display = 'none';
      if (otpStep) otpStep.style.display = 'block';
      if (mainFooter) mainFooter.style.display = 'none';

      startResendTimer(60);
      showMsg('');

      setTimeout(() => otpStep?.querySelector('input[name="code"]')?.focus(), 100);
    } catch (err) {
      console.error('❌ Register send code error:', err);
      showMsg(err.message || t('auth.msg_error_send'), 'error');
    } finally {
      setLoading(btn, false);
    }
  });

  // ============================================
  // STEP 2
  // ============================================
  otpForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('🔐 Register OTP submitted');

    const data = Object.fromEntries(new FormData(otpForm));

    if (!data.code || data.code.length < 5) {
      showMsg(t('auth.msg_otp_incomplete'), 'error');
      return;
    }

    const btn = otpForm.querySelector('[data-otp-submit]');
    setLoading(btn, true);

    try {
      const res = await authApi.registerVerify(currentPhone, data.code);
      console.log('✅ Register verify response:', res);

      const token = res?.token || res?.access_token || res?.data?.token || res?.data?.access_token;
      const user = res?.user || res?.data?.user || { phone: currentPhone, name: currentName };

      if (!token) throw new Error(t('auth.msg_error_verify'));

      setAuth(token, user);
      showMsg(t('auth.msg_register_success'), 'success');

      setTimeout(() => window.__app?.router?.navigate('/dashboard'), 800);
    } catch (err) {
      console.error('❌ Register verify error:', err);
      showMsg(err.message || t('auth.msg_error_verify'), 'error');
    } finally {
      setLoading(btn, false);
    }
  });

  // ============================================
  // ارسال مجدد
  // ============================================
  resendBtn?.addEventListener('click', async () => {
    if (resendBtn.disabled) return;
    try {
      await authApi.registerSendCode(currentName, currentPhone, currentReferral);
      showMsg(t('auth.msg_otp_resent'), 'success');
      startResendTimer(60);
    } catch (err) {
      showMsg(err.message, 'error');
    }
  });

  // ============================================
  // بازگشت
  // ============================================
  backBtn?.addEventListener('click', () => {
    if (otpStep) otpStep.style.display = 'none';
    if (phoneStep) phoneStep.style.display = 'block';
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

  console.log('✅ initRegister completed');
}