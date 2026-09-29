// ============================================
// About Page
// ============================================
import { Layout, initLayout } from '../components/Layout.js';
import { t } from '../code/i18n.js';

export async function AboutPage() {
  const html = Layout(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${t('sections.our_story')}</div>
          <h1>${t('sections.about_us')}</h1>
        </div>
      </div>
    </section>

    <!-- ABOUT MAIN -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="about-wrap">
          <div class="about-left">
            <img src="/img/about-left.jpg" loading="eager" alt="About" class="cover-image" />
          </div>
          <div class="about-content">
            <div class="about-top">
              <h3>Welcome to glomin – your ultimate destination for premium beauty products</h3>
              <p>At Glomin, we are passionate about helping you look and feel your best. Founded with a mission to deliver high-quality beauty products that cater to all your skincare, makeup, and fragrance needs, we pride ourselves on offering a curated selection of the finest products in the beauty industry.</p>
            </div>
            <div class="about-bottom">
              <div class="about-image">
                <img src="/img/about-image.jpg" loading="eager" alt="About Image" class="cover-image" />
              </div>
              <div class="about-info">
                <div class="about-inner">
                  <img src="/img/ic-satisfaction.svg" loading="lazy" alt="Satisfaction" class="about-icon" />
                  <div>
                    <div class="about-head">Customer Satisfaction</div>
                    <div>Trusted by over 92% satisfied customers</div>
                  </div>
                </div>
                <div class="about-line"></div>
                <div class="about-inner">
                  <img src="/img/ic-awards.svg" loading="lazy" alt="Awards" class="about-icon" />
                  <div>
                    <div class="about-head">Awards and Recognitions</div>
                    <div>Recipient of 30+ industry award</div>
                  </div>
                </div>
                <div class="about-line"></div>
                <div class="about-inner">
                  <img src="/img/ic-global.svg" loading="lazy" alt="Global" class="about-icon" />
                  <div>
                    <div class="about-head">Global Reach</div>
                    <div>Available in 20+ countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VISION & MISSION -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="section-title-wrap">
          <div class="title-wrap">
            <div class="subtitle">${t('sections.our_purpose')}</div>
            <h2>${t('sections.vision_mission')}</h2>
          </div>
        </div>
        <div class="vision-wrap">
          <div class="vision-img">
            <img src="/img/vision-image.jpg" loading="lazy" alt="Vision" class="cover-image" />
          </div>
          <div class="vision-content green">
            <div class="vision-text">
              <div class="vision-dot"></div>
              <div>Innovation</div>
            </div>
            <div class="vision-bottom">
              <div class="vision-divider"></div>
              <p>At Glomin, innovation is at the core of everything we do. we continuously strive to push the boundaries of beauty and skincare through cutting-edge research and advanced technology.</p>
            </div>
          </div>
          <div class="vision-content brown">
            <div class="vision-text">
              <div class="vision-dot"></div>
              <div>Empowering Beauty</div>
            </div>
            <div class="vision-bottom">
              <div class="vision-divider"></div>
              <p>We believe that beauty is about more than just appearance; it's about confidence, self-care, and embracing your unique beauty. Our mission is to empower you to feel beautiful.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DATA BLOCK -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="data-block">
          <div class="fill-block">
            <div class="data-content">
              <h3>Glomin's commitment to quality and confidence</h3>
              <div class="data-paragraph">
                <p>At Glomin, our mission is to empower individuals to embrace their unique beauty with confidence. We are dedicated to delivering premium beauty products that combine luxury with performance, ensuring that every product.</p>
                <p>Our commitment to using the finest ingredients and innovative formulas reflects our passion for quality and effectiveness.</p>
              </div>
            </div>
          </div>
          <div class="fill-block">
            <div class="data-img">
              <img src="/img/data-image.jpg" loading="lazy" alt="Data" class="cover-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="section-title-wrap">
          <div class="title-wrap">
            <div class="subtitle">${t('sections.experts')}</div>
            <h2>${t('sections.meet_team')}</h2>
          </div>
        </div>
        <div class="team-wrap">
          <div class="team-card">
            <div class="team-img">
              <img src="/img/team-1.jpg" loading="lazy" alt="Team 1" class="cover-image" />
            </div>
            <div>
              <div class="body-large">Esther Howards</div>
              <div>Founder &amp; CEO</div>
            </div>
          </div>
          <div class="team-card">
            <div class="team-img">
              <img src="/img/team-2.jpg" loading="lazy" alt="Team 2" class="cover-image" />
            </div>
            <div>
              <div class="body-large">Ronald Richard</div>
              <div>Team Leader</div>
            </div>
          </div>
          <div class="team-card">
            <div class="team-img">
              <img src="/img/team-3.jpg" loading="lazy" alt="Team 3" class="cover-image" />
            </div>
            <div>
              <div class="body-large">Bessie Cooper</div>
              <div>Sales Executive</div>
            </div>
          </div>
          <div class="team-card">
            <div class="team-img">
              <img src="/img/team-4.jpg" loading="lazy" alt="Team 4" class="cover-image" />
            </div>
            <div>
              <div class="body-large">Cameron Williamson</div>
              <div>Marketing Manager</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ + CTA -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="section-wrap">
          <div>
            <div class="section-title-wrap">
              <div class="title-wrap">
                <div class="subtitle">FAQ's</div>
                <h2>Frequently Asked Questions</h2>
              </div>
            </div>
            <div class="faq-wrap">
              <div class="faq-img">
                <img src="/img/faq-image.jpg" loading="lazy" alt="FAQ" class="cover-image" />
              </div>
              <div class="faq-outer" data-faq-list>
                <!-- FAQ items توسط JS پر می‌شن -->
              </div>
            </div>
          </div>

          <div class="cta">
            <div class="fill-block">
              <div class="cta-img">
                <img src="/img/cta-image.jpg" loading="lazy" alt="CTA" class="cover-image" />
              </div>
            </div>
            <div class="fill-block">
              <div class="cta-content">
                <div>
                  <h3 class="cta-title">${t('cta.title')}</h3>
                  <p class="body-small">${t('cta.free_shipping')}</p>
                </div>
                <div class="cta-form-block w-form">
                  <form class="cta-form" data-cta-form>
                    <input class="cta-field w-input" name="email" placeholder="${t('forms.email')}" type="email" required />
                    <input type="submit" class="cta-btn w-button" value="${t('buttons.subscribe')}" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `);

  queueMicrotask(() => {
    initLayout();
    loadFaqs();
  });

  return html;
}

// ============================================
// FAQ accordion
// ============================================
function loadFaqs() {
  const container = document.querySelector('[data-faq-list]');
  if (!container) return;

  const faqs = [
    { q: 'What is Glomin\'s return policy?', a: 'We offer a 30-day return policy on all products. If you are not satisfied with your purchase, please contact our customer support team to initiate a return.' },
    { q: 'Do you offer free shipping?', a: 'Yes, we offer free shipping on all orders over $50. For orders below $50, standard shipping rates apply. Free shipping is available for domestic orders only.' },
    { q: 'Where are Glomin products made?', a: 'Yes, we offer international shipping to many countries. Shipping rates and delivery times vary based on the destination. Please refer to our shipping policy for more details.' },
    { q: 'How do I use Glomin\'s skincare products?', a: 'Each product comes with detailed usage instructions on the packaging. For general guidance, start with cleansing your skin, apply serums or treatments as needed.' },
    { q: 'How can I stay updated on new products and promotions?', a: 'To stay informed about our latest products, promotions, and exclusive offers, sign up for our newsletter on our website.' },
    { q: 'What should I do if I receive a damaged or incorrect item?', a: 'If you receive a damaged or incorrect item, please contact our customer support team immediately. Provide your order number and details about the issue.' }
  ];

  container.innerHTML = faqs.map((f) => `
    <div class="faq" data-faq-item>
      <div class="question-block" data-faq-toggle>
        <p class="body-large color-black">${f.q}</p>
        <div class="faq-icon">
          <div class="plus-icon">+</div>
        </div>
      </div>
      <div class="answer-block" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${f.a}</p></div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('[data-faq-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const answer = toggle.nextElementSibling;
      const isOpen = answer.style.display !== 'none';
      answer.style.display = isOpen ? 'none' : 'block';
      toggle.classList.toggle('active', !isOpen);
    });
  });
}