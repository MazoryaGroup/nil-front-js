
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { authApi } from '../code/api.js';
import { setAuth } from '../code/auth.js';
import '../asset/css/custom.css';

const tr = (key, fallback) => {
  const value = t(key);
  return value && value !== key ? value : fallback;
};

const normalizeDigits = (value = '') => {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const ar = '٠١٢٣٤٥٦٧٨٩';

  return String(value)
    .replace(/[۰-۹]/g, char => String(fa.indexOf(char)))
    .replace(/[٠-٩]/g, char => String(ar.indexOf(char)));
};

const normalizePhone = value =>
  normalizeDigits(value).replace(/\D/g, '');

const validPhone = value =>
  /^(09\d{9}|989\d{9})$/.test(value);

const getToken = res =>
  res?.token ||
  res?.access_token ||
  res?.data?.token ||
  res?.data?.access_token;

const setLoading = (button, loading) => {
  if (!button) return;

  if (loading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = tr('auth.loading', 'لطفاً صبر کنید...');
  } else {
    button.disabled = false;
    button.textContent =
      button.dataset.originalText || button.textContent;
  }
};

export async function RegisterPage() {
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

        <div class="auth-header">
          <h2>${tr('auth.register_title', 'ساخت حساب کاربری')}</h2>
          <p>${tr(
            'auth.register_subtitle',
            'برای شروع، اطلاعاتت رو وارد کن.'
          )}</p>
        </div>

        <div data-step="phone">
          <form class="auth-form" data-phone-form>

            <div class="auth-field">
              <label for="register-name">
                ${tr('auth.name_label', 'نام و نام خانوادگی')}
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                class="auth-input"
                placeholder="${tr('auth.name_placeholder', 'نام و نام خانوادگی')}"
                autocomplete="name"
                required
              />
            </div>

            <div class="auth-field">
              <label for="register-phone">
                ${tr('auth.phone_label', 'شماره موبایل')}
              </label>
              <input
                id="register-phone"
                type="tel"
                name="phone"
                class="auth-input"
                placeholder="09123456789"
                autocomplete="tel"
                inputmode="tel"
                dir="ltr"
                required
              />
            </div>

            <div class="auth-field">
              <label for="register-referral">
                ${tr('auth.referral_label', 'کد معرف')}
                <span>(${tr('common.optional', 'اختیاری')})</span>
              </label>
              <input
                id="register-referral"
                type="text"
                name="referral_code"
                class="auth-input"
                placeholder="${tr('auth.referral_placeholder', 'مثلاً ABC123')}"
                dir="ltr"
                autocomplete="off"
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${tr('auth.btn_send_otp_register', 'ارسال کد تأیید')}
            </button>

          </form>
        </div>

        <div data-step="otp" style="display:none">

          <div class="auth-header">
            <h2>تأیید شماره موبایل</h2>
            <p>
              کد ارسال‌شده به شماره
              <strong data-phone-display dir="ltr"></strong>
              را وارد کن.
            </p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label for="register-otp">
                ${tr('auth.otp_label', 'کد تأیید')}
              </label>
              <input
                id="register-otp"
                type="text"
                name="code"
                class="auth-input otp-input"
                placeholder="------"
                maxlength="6"
                inputmode="numeric"
                autocomplete="one-time-code"
                pattern="[0-9]{6}"
                dir="ltr"
                required
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-otp-submit
            >
              ${tr('auth.btn_verify_register', 'تأیید و ثبت‌نام')}
            </button>
          </form>

          <div class="auth-resend">
            <button
              type="button"
              class="auth-link-btn"
              data-resend-btn
            >
              ${tr('auth.btn_resend', 'ارسال مجدد کد')}
            </button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:16px">
            <button
              type="button"
              class="auth-link-btn"
              data-back-btn
            >
              ${tr('auth.btn_back', 'بازگشت و ویرایش اطلاعات')}
            </button>
          </div>

        </div>

        <div
          class="form-message"
          data-msg
          role="status"
          aria-live="polite"
        ></div>

        <div class="auth-footer" data-main-footer>
          <span>${tr('auth.have_account', 'قبلاً ثبت‌نام کردی؟')}</span>
          <a href="/login" data-nav-link>
            ${tr('auth.link_login', 'ورود به حساب')}
          </a>
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

function initRegister() {
  const root = document.querySelector('.auth-page');
  if (!root) return;

  const $ = selector => root.querySelector(selector);

  const phoneStep = $('[data-step="phone"]');
  const otpStep = $('[data-step="otp"]');
  const phoneForm = $('[data-phone-form]');
  const otpForm = $('[data-otp-form]');
  const footer = $('[data-main-footer]');
  const msg = $('[data-msg]');
  const phoneDisplay = $('[data-phone-display]');
  const resendBtn = $('[data-resend-btn]');
  const timerEl = $('[data-timer]');
  const backBtn = $('[data-back-btn]');

  let currentPhone = '';
  let currentName = '';
  let currentReferral = '';
  let resendTimer = null;

  function showMsg(message = '', type = 'info') {
    if (!msg) return;

    msg.textContent = message;
    msg.style.display = message ? 'block' : 'none';
    msg.style.color =
      type === 'error' ? '#b42318' :
      type === 'success' ? '#626a4e' : '#111111';
  }

  function startResendTimer(seconds = 60) {
    if (resendTimer) clearInterval(resendTimer);

    let remaining = seconds;

    resendBtn.disabled = true;

    const update = () => {
      if (remaining <= 0) {
        clearInterval(resendTimer);
        resendTimer = null;
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

  function showOtpStep() {
    phoneStep.style.display = 'none';
    otpStep.style.display = 'block';
    footer.style.display = 'none';

    phoneDisplay.textContent = currentPhone;

    startResendTimer(60);
    showMsg();

    setTimeout(() => {
      otpForm.querySelector('[name="code"]')?.focus();
    }, 100);
  }

  phoneForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(phoneForm));

    const name = String(data.name || '').trim();
    const phone = normalizePhone(data.phone || '');
    const referral = String(data.referral_code || '')
      .trim()
      .toUpperCase();

    if (!name) {
      showMsg('لطفاً نام خودت رو وارد کن.', 'error');
      return;
    }

    if (!validPhone(phone)) {
      showMsg(
        tr('auth.msg_invalid_phone', 'شماره موبایل معتبر نیست.'),
        'error'
      );
      return;
    }

    const button = $('[data-submit-btn]');
    setLoading(button, true);

    try {
      await authApi.registerSendCode(
        name,
        phone,
        referral
      );

      currentName = name;
      currentPhone = phone;
      currentReferral = referral;

      showOtpStep();
    } catch (error) {
      showMsg(
        error.message ||
        tr('auth.msg_error_send', 'ارسال کد با خطا مواجه شد.'),
        'error'
      );
    } finally {
      setLoading(button, false);
    }
  });

  otpForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const code = normalizeDigits(
      new FormData(otpForm).get('code') || ''
    ).trim();

    if (!/^\d{6}$/.test(code)) {
      showMsg(
        tr('auth.msg_otp_incomplete', 'کد شش‌رقمی را وارد کن.'),
        'error'
      );
      return;
    }

    const button = $('[data-otp-submit]');
    setLoading(button, true);

    try {
      const res = await authApi.registerVerify(
        currentPhone,
        code
      );

      const token = getToken(res);
      const user =
        res?.user || res?.data?.user || {
          name: currentName,
          phone: currentPhone
        };

      if (!token) {
        throw new Error(
          tr('auth.msg_error_verify', 'تأیید کد ناموفق بود.')
        );
      }

      setAuth(token, user);

      showMsg(
        tr('auth.msg_register_success', 'ثبت‌نام با موفقیت انجام شد.'),
        'success'
      );

      setTimeout(() => {
        window.__app?.router?.navigate('/dashboard');
      }, 800);
    } catch (error) {
      showMsg(
        error.message ||
        tr('auth.msg_error_verify', 'کد تأیید نامعتبر است.'),
        'error'
      );
    } finally {
      setLoading(button, false);
    }
  });

  resendBtn?.addEventListener('click', async () => {
    if (resendBtn.disabled || !currentPhone) return;

    resendBtn.disabled = true;

    try {
      await authApi.registerSendCode(
        currentName,
        currentPhone,
        currentReferral
      );

      showMsg(
        tr('auth.msg_otp_resent', 'کد جدید ارسال شد.'),
        'success'
      );

      startResendTimer(60);
    } catch (error) {
      resendBtn.disabled = false;
      showMsg(error.message || 'خطا در ارسال مجدد کد.', 'error');
    }
  });

  backBtn?.addEventListener('click', () => {
    if (resendTimer) clearInterval(resendTimer);
    resendTimer = null;

    otpStep.style.display = 'none';
    phoneStep.style.display = 'block';
    footer.style.display = 'flex';

    otpForm.reset();
    showMsg();
  });

  otpForm?.querySelector('[name="code"]')
    ?.addEventListener('input', event => {
      event.target.value = normalizeDigits(
        event.target.value
      ).replace(/\D/g, '').slice(0, 6);
    });
}
