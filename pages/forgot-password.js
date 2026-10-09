
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { authApi } from '../code/api.js';
import  '../asset/css/custom.css';

const tr = (key, fallback) => {
  const value = t(key);
  return value && value !== key ? value : fallback;
};

function normalizeDigits(value = '') {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const ar = '٠١٢٣٤٥٦٧٨٩';

  return String(value)
    .replace(/[۰-۹]/g, char => String(fa.indexOf(char)))
    .replace(/[٠-٩]/g, char => String(ar.indexOf(char)));
}

function normalizePhone(value) {
  return normalizeDigits(value).replace(/\D/g, '');
}

function validPhone(value) {
  return /^(09\d{9}|989\d{9})$/.test(value);
}

/*
 * این سه تابع رابط اتصال به API هستند.
 * نام متدها باید با code/api.js پروژه هماهنگ باشد.
 */
const forgotApi = {
  sendCode: (phone) =>
    authApi.forgotSendCode(phone),

  verifyCode: (phone, code) =>
    authApi.forgotVerify(phone, code),

  reset: (phone, resetToken, password, passwordConfirmation) =>
    authApi.forgotReset(
      phone,
      resetToken,
      password,
      passwordConfirmation
    )
};

export async function ForgotPasswordPage() {
  const html = Layout(`
    <div class="auth-page">

      <div class="auth-container">

        <div class="auth-mobile-brand">
          <div class="auth-mobile-logo">N</div>
          <div>
            <strong>NIL.</strong>
            <small>BEAUTY STUDIO</small>
          </div>
        </div>

        <!-- STEP 1: PHONE -->
        <section data-forgot-step="phone">

          <div class="auth-header">
            <h2>فراموشی رمز عبور</h2>
            <p>
              شماره موبایل حساب کاربری خودت رو وارد کن
              تا کد بازیابی برات ارسال بشه.
            </p>
          </div>

          <form class="auth-form" data-forgot-phone-form>

            <div class="auth-field">
              <label for="forgot-phone">
                شماره موبایل
              </label>

              <input
                id="forgot-phone"
                class="auth-input"
                type="tel"
                name="phone"
                placeholder="09123456789"
                autocomplete="tel"
                inputmode="tel"
                dir="ltr"
                required
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ارسال کد بازیابی
            </button>

          </form>
        </section>

        <!-- STEP 2: OTP -->
        <section
          data-forgot-step="otp"
          style="display:none"
        >

          <div class="auth-header">
            <h2>تأیید شماره موبایل</h2>
            <p>
              کد شش‌رقمی ارسال‌شده به
              <strong data-phone-display dir="ltr"></strong>
              را وارد کن.
            </p>
          </div>

          <form class="auth-form" data-forgot-otp-form>

            <div class="auth-field">
              <label for="forgot-otp">
                کد تأیید
              </label>

              <input
                id="forgot-otp"
                class="auth-input otp-input"
                type="text"
                name="code"
                placeholder="------"
                maxlength="6"
                inputmode="numeric"
                autocomplete="one-time-code"
                dir="ltr"
                required
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              تأیید کد
            </button>

          </form>

          <div class="auth-resend">
            <button
              type="button"
              class="auth-link-btn"
              data-resend-btn
            >
              ارسال مجدد کد
            </button>

            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:16px">
            <button
              type="button"
              class="auth-link-btn"
              data-back-phone
            >
              تغییر شماره موبایل
            </button>
          </div>

        </section>

        <!-- STEP 3: NEW PASSWORD -->
        <section
          data-forgot-step="reset"
          style="display:none"
        >

          <div class="auth-header">
            <h2>رمز عبور جدید</h2>
            <p>
              یک رمز عبور جدید و امن برای حساب
              کاربری خودت انتخاب کن.
            </p>
          </div>

          <form class="auth-form" data-forgot-reset-form>

            <div class="auth-field">
              <label for="forgot-password">
                رمز عبور جدید
              </label>

              <input
                id="forgot-password"
                class="auth-input"
                type="password"
                name="password"
                placeholder="حداقل ۸ کاراکتر"
                autocomplete="new-password"
                minlength="8"
                dir="ltr"
                required
              />
            </div>

            <div class="auth-field">
              <label for="forgot-confirm">
                تکرار رمز عبور
              </label>

              <input
                id="forgot-confirm"
                class="auth-input"
                type="password"
                name="password_confirmation"
                placeholder="تکرار رمز عبور جدید"
                autocomplete="new-password"
                minlength="8"
                dir="ltr"
                required
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              تغییر رمز عبور
            </button>

          </form>

        </section>

        <!-- STEP 4: SUCCESS -->
        <section
          data-forgot-step="success"
          style="display:none"
        >

          <div class="auth-header">
            <div class="forgot-success-icon">
              ✓
            </div>

            <h2>رمز عبور تغییر کرد!</h2>

            <p>
              رمز عبور حساب کاربری با موفقیت
              تغییر کرد. حالا می‌تونی وارد بشی.
            </p>
          </div>

          <a
            href="/login"
            data-nav-link
            class="primary-button w-button"
          >
            ورود به حساب کاربری
          </a>

        </section>

        <!-- MESSAGE -->
        <div
          class="form-message"
          data-forgot-msg
          role="status"
          aria-live="polite"
        ></div>

        <!-- FOOTER -->
        <div class="auth-footer" data-forgot-footer>
          <span>رمز عبورت رو یادت اومد؟</span>
          <a href="/login" data-nav-link>
            بازگشت به ورود
          </a>
        </div>

      </div>
    </div>
  `);

  setTimeout(() => {
    initLayout();
    initForgotPassword();
  }, 100);

  return html;
}

function initForgotPassword() {
  const root = document.querySelector('.auth-page');
  if (!root) return;

  const $ = selector => root.querySelector(selector);
  const $$ = selector => root.querySelectorAll(selector);

  const phoneForm = $('[data-forgot-phone-form]');
  const otpForm = $('[data-forgot-otp-form]');
  const resetForm = $('[data-forgot-reset-form]');

  const message = $('[data-forgot-msg]');
  const footer = $('[data-forgot-footer]');
  const phoneDisplay = $('[data-phone-display]');
  const resendBtn = $('[data-resend-btn]');
  const timerEl = $('[data-timer]');
  const backBtn = $('[data-back-phone]');

  let currentPhone = '';
  let resetToken = '';    
  let resendTimer = null;
  let sendingCode = false;

  function showStep(step) {
    $$('[data-forgot-step]').forEach(element => {
      element.style.display =
        element.dataset.forgotStep === step
          ? 'block'
          : 'none';
    });

    if (footer) {
      footer.style.display =
        step === 'success' ? 'none' : 'flex';
    }

    showMsg('');
  }

  function showMsg(text = '', type = 'info') {
    if (!message) return;

    message.textContent = text;
    message.style.display = text ? 'block' : 'none';

    message.style.color =
      type === 'error' ? '#b42318' :
      type === 'success' ? '#626a4e' :
      '#111111';
  }

  function setLoading(button, loading) {
    if (!button) return;

    if (loading) {
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = tr(
        'auth.loading',
        'لطفاً صبر کنید...'
      );
    } else {
      button.disabled = false;
      button.textContent =
        button.dataset.originalText || button.textContent;
    }
  }

  function stopTimer() {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }

  function startResendTimer(seconds = 60) {
    stopTimer();

    let remaining = seconds;

    resendBtn.disabled = true;

    const update = () => {
      if (remaining <= 0) {
        stopTimer();
        resendBtn.disabled = false;
        timerEl.textContent = '';
        return;
      }

      timerEl.textContent = `(${remaining}s)`;
      remaining--;
    };

    update();
    resendTimer = setInterval(update, 1000);
  }

  // STEP 1 — Send OTP
  phoneForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const phone = normalizePhone(
      new FormData(phoneForm).get('phone') || ''
    );

    if (!validPhone(phone)) {
      showMsg('شماره موبایل معتبر نیست.', 'error');
      return;
    }

    const button = phoneForm.querySelector('[data-submit-btn]');
    setLoading(button, true);

    try {
      await forgotApi.sendCode(phone);

      currentPhone = phone;
      resetToken = '';

      phoneDisplay.textContent = phone;

      showStep('otp');
      startResendTimer(60);

      setTimeout(() => {
        otpForm.querySelector('[name="code"]')?.focus();
      }, 100);
    } catch (error) {
      showMsg(
        error.message || 'ارسال کد بازیابی ناموفق بود.',
        'error'
      );
    } finally {
      setLoading(button, false);
    }
  });

  // OTP numeric normalization
  otpForm?.querySelector('[name="code"]')
    ?.addEventListener('input', event => {
      event.target.value = normalizeDigits(
        event.target.value
      ).replace(/\D/g, '').slice(0, 6);
    });

  // STEP 2 — Verify OTP
  otpForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const code = normalizeDigits(
      new FormData(otpForm).get('code') || ''
    ).trim();

    if (!/^\d{6}$/.test(code)) {
      showMsg('کد تأیید باید شش‌رقمی باشد.', 'error');
      return;
    }

    const button = otpForm.querySelector('[data-submit-btn]');
    setLoading(button, true);

    try {
      const res = await forgotApi.verifyCode(currentPhone, code);

const token =
  res?.reset_token ||
  res?.data?.reset_token;

if (!token) {
  throw new Error('توکن بازیابی رمز عبور از سرور دریافت نشد.');
}

resetToken = token;

stopTimer();
showStep('reset');
    } catch (error) {
      showMsg(
        error.message || 'کد تأیید نامعتبر است.',
        'error'
      );
    } finally {
      setLoading(button, false);
    }
  });

  // STEP 3 — Reset password
  resetForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(resetForm)
    );

    const password = String(data.password || '');
    const confirmation = String(
      data.password_confirmation || ''
    );

    if (password.length < 8) {
      showMsg(
        'رمز عبور باید حداقل ۸ کاراکتر باشد.',
        'error'
      );
      return;
    }

    if (password !== confirmation) {
      showMsg(
        'رمز عبور و تکرار آن یکسان نیستند.',
        'error'
      );
      return;
    }

    if (!currentPhone || !resetToken) {
      showMsg(
        'ابتدا شماره موبایل خود را تأیید کنید.',
        'error'
      );
      return;
    }

    const button = resetForm.querySelector('[data-submit-btn]');
    setLoading(button, true);

    try {
      await forgotApi.reset(
        currentPhone,
        resetToken,
        password,
        confirmation
      );

      resetForm.reset();
      resetToken = '';

      showStep('success');
    } catch (error) {
      showMsg(
        error.message || 'تغییر رمز عبور ناموفق بود.',
        'error'
      );
    } finally {
      setLoading(button, false);
    }
  });

  // Resend OTP
  resendBtn?.addEventListener('click', async () => {
    if (resendBtn.disabled || sendingCode || !currentPhone) {
      return;
    }

    sendingCode = true;
    resendBtn.disabled = true;

    try {
      await forgotApi.sendCode(currentPhone);

      resetToken = '';
      otpForm.reset();

      showMsg('کد جدید ارسال شد.', 'success');
      startResendTimer(60);
    } catch (error) {
      resendBtn.disabled = false;

      showMsg(
        error.message || 'ارسال مجدد کد ناموفق بود.',
        'error'
      );
    } finally {
      sendingCode = false;
    }
  });

  // Back to phone
  backBtn?.addEventListener('click', () => {
    stopTimer();

    currentPhone = '';
    resetToken = '';

    otpForm.reset();
    showStep('phone');
  });
}
