// ============================================
// Signup Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';
import { apiPost } from '../code/api.js';
import { setAuth } from '../code/auth.js';

export async function SignupPage() {
  const html = Layout(`
    <div class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="user-form-block">
          <form data-signup-form>
            <h2>${t('buttons.sign_up')}</h2>
            <div class="user-field">
              <label>${t('forms.email')}</label>
              <input class="login-input w-input" name="email" type="email" required />
            </div>
            <div class="user-field">
              <label>نام</label>
              <input class="login-input w-input" name="name" type="text" required />
            </div>
            <div class="user-field">
              <label>${t('forms.password')}</label>
              <input class="login-input w-input" name="password" type="password" required />
            </div>
            <button type="submit" class="login-button w-button">${t('buttons.sign_up')}</button>
          </form>
          <div class="form-message" data-form-message></div>
        </div>
      </div>
    </div>
  `);

  queueMicrotask(() => {
    initLayout();
    initSignupForm();
  });

  return html;
}

function initSignupForm() {
  const form = document.querySelector('[data-signup-form]');
  const msg = document.querySelector('[data-form-message]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    try {
      // TODO: const res = await apiPost('/auth/register', data);
      console.log('📝 Signup:', data);
      msg.textContent = '✅ ثبت‌نام موفق';
      msg.style.color = 'green';
      // setAuth(res.token, res.user);
      // window.__app.router.navigate('/');
    } catch (err) {
      msg.textContent = '❌ ' + err.message;
      msg.style.color = 'red';
    }
  });
}