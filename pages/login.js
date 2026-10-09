
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

export async function LoginPage() {
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
          <h2>${tr('auth.login_title', 'خوش اومدی!')}</h2>
          <p>${tr(
            'auth.login_subtitle',
            'برای ورود به حساب کاربری اطلاعاتت رو وارد کن.'
          )}</p>
        </div>

        <div class="auth-tabs" data-tabs>
          <button
            type="button"
            class="auth-tab active"
            data-tab="phone"
            aria-selected="true"
          >
            ${tr('auth.tab_phone', 'شماره موبایل')}
          </button>

          <button
            type="button"
            class="auth-tab"
            data-tab="email"
            aria-selected="false"
          >
            ${tr('auth.tab_email', 'ایمیل')}
          </button>
        </div>

        <div class="auth-tab-content" data-tab-content="phone">
          <form class="auth-form" data-phone-form>

            <div class="auth-field">
              <label for="login-phone">
                ${tr('auth.phone_label', 'شماره موبایل')}
              </label>
              <input
                id="login-phone"
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
            <div style="text-align:left; margin-top:-8px;">
  <a
    href="/forgot-password"
    data-nav-link
    class="auth-link-btn"
  >
    رمز عبورت رو فراموش کردی؟
  </a>
</div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${tr('auth.btn_send_otp_login', 'ارسال کد تأیید')}
            </button>

          </form>
        </div>

        <div
          class="auth-tab-content"
          data-tab-content="email"
          style="display:none"
        >
          <form class="auth-form" data-email-form>

            <div class="auth-field">
              <label for="login-email">
                ${tr('auth.email_label', 'ایمیل')}
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                class="auth-input"
                placeholder="example@email.com"
                autocomplete="email"
                dir="ltr"
                required
              />
            </div>

            <div class="auth-field">
              <label for="login-password">
                ${tr('auth.password_label', 'رمز عبور')}
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                class="auth-input"
                autocomplete="current-password"
                dir="ltr"
                required
              />
            </div>
            <div style="text-align:left; margin-top:-8px;">
  <a
    href="/forgot-password"
    data-nav-link
    class="auth-link-btn"
  >
    رمز عبورت رو فراموش کردی؟
  </a>
</div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${tr('auth.btn_login', 'ورود به حساب')}
            </button>

            <div style="text-align:center">
              <a href="/forgot-password" data-nav-link class="auth-link-btn">
                ${tr('auth.forgot_password', 'رمز عبورت رو فراموش کردی؟')}
              </a>
            </div>

          </form>
        </div>

        <div
          class="auth-otp-step"
          data-otp-step
          style="display:none"
        >
          <div class="auth-header">
            <h2>${tr('auth.otp_label', 'تأیید شماره موبایل')}</h2>
            <p>
              کد ارسال‌شده به شماره
              <strong data-phone-display dir="ltr"></strong>
              را وارد کن.
            </p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label for="login-otp">
                ${tr('auth.otp_label', 'کد تأیید')}
              </label>
              <input
                id="login-otp"
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
              ${tr('auth.btn_verify_login', 'تأیید و ورود')}
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
              ${tr('auth.btn_back', 'بازگشت و تغییر شماره')}
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
          <span>${tr('auth.no_account', 'حساب کاربری نداری؟')}</span>
          <a href="/register" data-nav-link>
            ${tr('auth.link_register', 'ثبت‌نام کن')}
          </a>
        </div>

      </div>
    </div>
  `);

  setTimeout(() => {
    initLayout();
    initLogin();
  }, 100);

  return html;
}

function initLogin() {
  const root = document.querySelector('.auth-page');
  if (!root) return;

  const $ = selector => root.querySelector(selector);
  const $$ = selector => root.querySelectorAll(selector);

  const tabsEl = $('[data-tabs]');
  const otpStep = $('[data-otp-step]');
  const footer = $('[data-main-footer]');
  const msg = $('[data-msg]');
  const phoneDisplay = $('[data-phone-display]');
  const resendBtn = $('[data-resend-btn]');
  const timerEl = $('[data-timer]');
  const backBtn = $('[data-back-btn]');
  const phoneForm = $('[data-phone-form]');
  const emailForm = $('[data-email-form]');
  const otpForm = $('[data-otp-form]');

  let currentPhone = '';
  let resendTimer = null;

  function showMsg(message = '', type = 'info') {
    if (!msg) return;

    msg.textContent = message;
    msg.style.display = message ? 'block' : 'none';
    msg.style.color =
      type === 'error' ? '#b42318' :
      type === 'success' ? '#626a4e' : '#111111';
  }

  function showTab(name) {
    $$('.auth-tab').forEach(tab => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    $$('[data-tab-content]').forEach(content => {
      content.style.display =
        content.dataset.tabContent === name ? 'block' : 'none';
    });

    showMsg();
  }

  $$('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      showTab(tab.dataset.tab);
    });
  });

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
    tabsEl.style.display = 'none';

    $$('[data-tab-content]').forEach(content => {
      content.style.display = 'none';
    });

    footer.style.display = 'none';
    otpStep.style.display = 'block';
    phoneDisplay.textContent = currentPhone;

    startResendTimer(60);
    showMsg();

    setTimeout(() => {
      otpForm.querySelector('[name="code"]')?.focus();
    }, 100);
  }

  phoneForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const phone = normalizePhone(
      new FormData(phoneForm).get('phone') || ''
    );

    if (!validPhone(phone)) {
      showMsg(
        tr('auth.msg_invalid_phone', 'شماره موبایل معتبر نیست.'),
        'error'
      );
      return;
    }

    const button = phoneForm.querySelector('[data-submit-btn]');
    setLoading(button, true);

    try {
      await authApi.loginPhoneSendCode(phone);

      currentPhone = phone;
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
      const res = await authApi.loginPhoneVerify(
        currentPhone,
        code
      );

      const token = getToken(res);
      const user =
        res?.user || res?.data?.user || {
          phone: currentPhone
        };

      if (!token) {
        throw new Error(
          tr('auth.msg_error_verify', 'تأیید کد ناموفق بود.')
        );
      }

      setAuth(token, user);

      showMsg(
        tr('auth.msg_login_success', 'ورود موفقیت‌آمیز بود.'),
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

  emailForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(emailForm));
    const button = emailForm.querySelector('[data-submit-btn]');

    setLoading(button, true);

    try {
      const res = await authApi.loginEmail(
        data.email,
        data.password
      );

      const token = getToken(res);
      const user =
        res?.user || res?.data?.user || {
          email: data.email
        };

      if (!token) {
        throw new Error(
          tr('auth.msg_error_login', 'ورود ناموفق بود.')
        );
      }

      setAuth(token, user);

      showMsg(
        tr('auth.msg_login_success', 'ورود موفقیت‌آمیز بود.'),
        'success'
      );

      setTimeout(() => {
        window.__app?.router?.navigate('/dashboard');
      }, 800);
    } catch (error) {
      showMsg(
        error.message ||
        tr('auth.msg_error_login', 'ایمیل یا رمز عبور اشتباه است.'),
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
      await authApi.loginPhoneSendCode(currentPhone);

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
    tabsEl.style.display = 'flex';
    footer.style.display = 'flex';

    otpForm.reset();
    showTab('phone');
  });

  otpForm?.querySelector('[name="code"]')
    ?.addEventListener('input', event => {
      event.target.value = normalizeDigits(
        event.target.value
      ).replace(/\D/g, '').slice(0, 6);
    });
}
