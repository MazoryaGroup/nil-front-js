(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();class F{constructor(e,i="#app"){this.routes=e,this.container=document.querySelector(i),this.currentPath=null,this.handlePopState=this.handlePopState.bind(this),this.handleLinkClick=this.handleLinkClick.bind(this)}start(){window.addEventListener("popstate",this.handlePopState),document.addEventListener("click",this.handleLinkClick),this.handlePopState()}stop(){window.removeEventListener("popstate",this.handlePopState),document.removeEventListener("click",this.handleLinkClick)}navigate(e,i=!0){i&&window.history.pushState({},"",e),this.resolve(e)}async resolve(e){const i=e.split("?")[0];this.currentPath=i;const o=this.matchRoute(i);if(!o){console.warn("⚠️ No route matched:",i);return}const{route:l,params:c}=o;l.title&&(document.title=l.title+" | Nil Beauty");try{this.container.innerHTML='<div class="page-loading">در حال بارگذاری...</div>';const u=await l.component(c);this.container.innerHTML=u,window.scrollTo(0,0),this.reinitWebflow(),window.dispatchEvent(new CustomEvent("pageChanged",{detail:{path:i,params:c}}))}catch(u){console.error("❌ Render failed:",u),this.container.innerHTML=`
        <div style="padding:40px;text-align:center">
          <h2>خطا در بارگذاری صفحه</h2>
          <p>${u.message}</p>
        </div>
      `}}matchRoute(e){for(const i of this.routes){const o=this.matchPath(i.path,e);if(o!==null)return{route:i,params:o}}return null}matchPath(e,i){if(e==="*")return{};const o=e.split("/").filter(Boolean),l=i.split("/").filter(Boolean);if(o.length!==l.length)return null;const c={};for(let u=0;u<o.length;u++){const g=o[u],f=l[u];if(g.startsWith(":"))c[g.slice(1)]=decodeURIComponent(f);else if(g!==f)return null}return c}handlePopState(){this.resolve(window.location.pathname)}handleLinkClick(e){const i=e.target.closest("a");if(!i)return;const o=i.getAttribute("href");o&&(o.startsWith("http")||o.startsWith("//")||o.startsWith("#")||o.startsWith("mailto:")||o.startsWith("tel:")||i.target==="_blank"||(e.preventDefault(),this.navigate(o)))}reinitWebflow(){if(!(typeof window.Webflow>"u"))try{if(window.Webflow.require){const e=window.Webflow.require("ix2");e&&e.init&&e.init()}window.Webflow.destroy(),window.Webflow.ready()}catch(e){console.warn("⚠️ Webflow reinit failed:",e)}}}let W="en",G={};const U=["fa","en"],V="en",Y="nil-beauty-lang";async function X(t){try{const e=await fetch(`/lang/${t}.json`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return await e.json()}catch(e){return console.error(`❌ Failed to load ${t}.json`,e),{}}}function Z(t,e){return e.split(".").reduce((i,o)=>i==null?void 0:i[o],t)}function ee(t){var i,o,l,c;const e=document.documentElement;t==="fa"?(e.setAttribute("dir","rtl"),e.setAttribute("lang","fa"),(i=document.body)==null||i.classList.add("lang-fa"),(o=document.body)==null||o.classList.remove("lang-en")):(e.setAttribute("dir","ltr"),e.setAttribute("lang","en"),(l=document.body)==null||l.classList.add("lang-en"),(c=document.body)==null||c.classList.remove("lang-fa"))}async function K(t){U.includes(t)||(t=V),W=t,localStorage.setItem(Y,t),G=await X(t),ee(t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{lang:t}}))}async function te(){const t=localStorage.getItem(Y),e=t&&U.includes(t)?t:V;await K(e)}function M(){return W}function a(t){const e=Z(G,t);return e!==void 0?e:t}const B={},ae=(B==null?void 0:B.VITE_API_URL)||"/api";async function ie(t,e,i=null,o={}){const l=`${ae}${e}`,c={method:t,headers:{Accept:"application/json","Content-Type":"application/json",...o.headers}},u=localStorage.getItem("auth_token");u&&(c.headers.Authorization=`Bearer ${u}`),i&&(c.body=JSON.stringify(i));try{const g=await fetch(l,c);g.status===401&&(localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user"),window.dispatchEvent(new CustomEvent("auth:expired")));const f=await g.json().catch(()=>({}));if(!g.ok)throw new Error(f.message||f.error||`HTTP ${g.status}`);return f}catch(g){throw console.error(`❌ API ${t} ${e}:`,g),g}}const C=(t,e,i)=>ie("POST",t,e,i),j={registerSendCode:(t,e,i)=>{const o={name:t,phone:e};return i&&i.trim()&&(o.referral_code=i.trim()),C("/v1/auth/register/send-code",o)},registerVerify:(t,e)=>C("/v1/auth/register/verify",{phone:t,code:e}),loginPhoneSendCode:t=>C("/v1/auth/login/phone/send-code",{phone:t}),loginPhoneVerify:(t,e)=>C("/v1/auth/login/phone/verify",{phone:t,code:e}),loginEmail:(t,e)=>C("/v1/auth/login",{email:t,password:e}),forgotSendCode:t=>C("/v1/auth/forgot-password/send-code",{phone:t}),forgotVerify:(t,e)=>C("/v1/auth/forgot-password/verify",{phone:t,code:e}),forgotReset:(t,e,i,o)=>C("/v1/auth/forgot-password/reset",{phone:t,reset_token:e,password:i,password_confirmation:o}),logout:()=>C("/v1/auth/logout",{})},D="auth_token",H="auth_user";let R=null;function oe(){const t=localStorage.getItem(D),e=localStorage.getItem(H);if(t&&e)try{R=JSON.parse(e)}catch{z()}window.addEventListener("auth:expired",()=>{z(),window.dispatchEvent(new CustomEvent("auth:logout"))})}function O(t,e){localStorage.setItem(D,t),localStorage.setItem(H,JSON.stringify(e)),R=e,window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:e}}))}function z(){localStorage.removeItem(D),localStorage.removeItem(H),R=null}async function ne(){var t,e;try{await j.logout()}catch(i){console.warn("⚠️ Logout API failed:",i.message)}finally{z(),window.dispatchEvent(new CustomEvent("auth:logout")),(e=(t=window.__app)==null?void 0:t.router)==null||e.navigate("/login")}}function se(){return localStorage.getItem(D)}function Q(){return R}function N(){return!!se()}function le(){const t=Q(),e=N(),i=window.location.pathname,o=c=>i===c,l=M()==="fa"?"EN":"FA";return`
    <div class="container w-container">
      <div class="nav-wrapper">
        <a href="/" class="brand w-nav-brand" data-nav-link>
          <div>NIL</div>
        </a>

        <nav role="navigation" class="nav-menu w-nav-menu">
          <div class="nav-inner">
            <a href="/" class="nav-link w-inline-block ${o("/")?"w--current":""}" data-nav-link>
              <div class="nav-link-inner">${a("nav.home")}</div>
              <div class="bottom-underline"></div>
            </a>
            <a href="/about" class="nav-link w-inline-block ${o("/about")?"w--current":""}" data-nav-link>
              <div class="nav-link-inner">${a("nav.about")}</div>
              <div class="bottom-underline"></div>
            </a>
            <a href="/blog" class="nav-link w-inline-block ${o("/blog")?"w--current":""}" data-nav-link>
              <div class="nav-link-inner">${a("nav.blogs")}</div>
              <div class="bottom-underline"></div>
            </a>
            <a href="/contact" class="nav-link w-inline-block ${o("/contact")?"w--current":""}" data-nav-link>
              <div class="nav-link-inner">${a("nav.contact")}</div>
              <div class="bottom-underline"></div>
            </a>
            ${e?`
              <a href="/dashboard" class="nav-link w-inline-block ${o("/dashboard")?"w--current":""}" data-nav-link>
                <div class="nav-link-inner">${a("nav.dashboard")||"Dashboard"}</div>
                <div class="bottom-underline"></div>
              </a>
            `:""}
          </div>

          <form action="/search" class="search w-form" data-search-form>
            <input
              class="search-input w-input"
              maxlength="256"
              name="query"
              placeholder="${a("nav.search_placeholder")}"
              type="search"
              id="search"
              required
            />
            <input type="submit" class="search-button w-button" value="" />
          </form>
        </nav>

        <!-- سوییچ زبان -->
        <button class="lang-switch" data-lang-switch title="Change language">
          <span data-lang-current>${l}</span>
        </button>

        ${e?`
          <!-- کاربر لاگین شده -->
          <div class="user-menu">
            <a href="/dashboard" class="user-link w-inline-block" data-nav-link title="${(t==null?void 0:t.name)||(t==null?void 0:t.phone)||""}">
              <img src="/img/users-icon-dark.svg" loading="lazy" alt="User" />
            </a>
            <button class="logout-btn" data-logout-btn title="${a("auth.logout")||"خروج"}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        `:`
          <!-- کاربر مهمان -->
          <a href="/login" class="user-link w-inline-block" data-nav-link title="Login / Sign up">
            <img src="/img/users-icon-dark.svg" loading="lazy" alt="User" />
          </a>
        `}

        <!-- منوی موبایل -->
        <div class="menu-button w-nav-button" data-menu-button>
          <div class="nav-top-line"></div>
          <div class="nav-middle-line"></div>
          <div class="nav-bottom-line"></div>
        </div>
      </div>
    </div>
  `}function J(){const t=document.querySelector("[data-lang-switch]");t&&!t.dataset.initialized&&(t.dataset.initialized="true",t.addEventListener("click",async c=>{var f;c.preventDefault();const u=M(),g=u==="fa"?"en":"fa";console.log("🌐 Language:",u,"→",g),await K(g),(f=window.__app)!=null&&f.router?window.__app.router.resolve(window.location.pathname):window.location.reload()}));const e=document.querySelector("[data-logout-btn]");e&&!e.dataset.initialized&&(e.dataset.initialized="true",e.addEventListener("click",async c=>{var u,g;if(c.preventDefault(),!!confirm("آیا مطمئنید می‌خواهید خارج شوید؟")){e.disabled=!0;try{await ne()}catch(f){console.error("Logout error:",f),localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user"),(g=(u=window.__app)==null?void 0:u.router)==null||g.navigate("/login")}}}));const i=document.querySelector("[data-menu-button]"),o=document.querySelector(".nav-menu");i&&o&&!i.dataset.initialized&&(i.dataset.initialized="true",i.addEventListener("click",()=>{o.classList.toggle("is-open"),i.classList.toggle("is-open")}));const l=document.querySelector("[data-search-form]");l&&!l.dataset.initialized&&(l.dataset.initialized="true",l.addEventListener("submit",c=>{var g,f;c.preventDefault();const u=l.querySelector('input[name="query"]').value;u&&((f=(g=window.__app)==null?void 0:g.router)==null||f.navigate(`/search?q=${encodeURIComponent(u)}`))}))}function re(){return`
    <section class="footer">
      <div class="w-layout-blockcontainer container w-container">
        <div class="footer-wrap">
          <div class="footer-top">
            <a href="/" class="footer-brand w-inline-block">
              <div>NIL BEAUTY</div>
            </a>

            <div class="footer-menu">
              <div class="footer-data">
                <div class="footer-head">${a("footer.pages")}</div>
                <div class="footer-links">
                  <a href="/" class="footer-link w-inline-block">
                    <div>${a("nav.home")}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/about" class="footer-link w-inline-block">
                    <div>${a("nav.about")}</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/blog" class="footer-link w-inline-block">
                    <div>${a("nav.blogs")}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>

              <div class="footer-data">
                <div class="footer-head">${a("footer.resource")}</div>
                <div class="footer-links">
                  <a href="/faq" class="footer-link w-inline-block">
                    <div>FAQ</div>
                    <div class="underline"></div>
                  </a>
                  <a href="/contact" class="footer-link w-inline-block">
                    <div>${a("nav.contact")}</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>

              <div class="footer-data">
                <div class="footer-head">${a("footer.utility")}</div>
                <div class="footer-links">
                  <a href="/login" class="footer-link w-inline-block">
                    <div>Login</div>
                    <div class="underline"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-middle">
            <div class="newsletter-form-block w-form">
              <div class="newsletter-text">${a("footer.newsletter_text")}</div>
              <form class="newsletter-form" data-newsletter-form>
                <input
                  class="newsletter-field w-input"
                  maxlength="256"
                  name="email"
                  placeholder="${a("footer.email_placeholder")}"
                  type="email"
                  required
                />
                <input
                  type="submit"
                  class="newsletter-btn w-button"
                  value="${a("buttons.subscribe")}"
                />
              </form>
            </div>

            <div class="footer-social">
              <a href="https://www.whatsapp.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/whatsapp.png" loading="lazy" alt="WhatsApp" />
              </a>
              <a href="https://www.youtube.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/phone.png" loading="lazy" alt="Phone" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/insta.svg" loading="lazy" alt="Instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="foter-bottom">
        <div class="w-layout-blockcontainer container w-container">
          <div class="footer-last">
            <div class="designer-text">
              Designed. Powered by
              <a href="https://www.mazoryagroup.ir/" target="_blank" class="utility-link">MazoryaGroup</a>.
            </div>
          </div>
        </div>
      </div>
    </section>
  `}function x(t,e={}){const{navbarClass:i="navbar w-nav",wrapInPageWrap:o=!0}=e;return`
    <div class="page-wrap">
      <div class="${i}" data-animation="default" data-collapse="medium">
        ${le()}
      </div>

      ${t}
    </div>

    <div id="footer">${re()}</div>
  `}function T(){J()}async function ce(){const t=x(`
    <!-- HERO -->
    <div class="hero">
      <section class="hero-section">
        <div class="w-layout-blockcontainer container w-container">
          <div class="hero-wrap">
            <div class="hero-left">
              <div class="hero-avatar"></div>
              <div class="hero-middle">
                <img src="/img/3.jpg" loading="eager" alt="Hero Left" class="cover-image" />
              </div>
              <p class="line-height-150 capitalize">${a("hero.tagline")}</p>
            </div>
            <div class="hero-right">
              <div class="hero-image">
                <img src="/asset/img/1.jpg" loading="eager" alt="Hero Center" class="cover-image" />
              </div>
              <div class="hero-content">
                <div class="hero-top">
                  <div class="hero-info">
                    <h2 class="color-white">${a("hero.title")}</h2>
                    <p class="line-height-150">${a("hero.description")}</p>
                  </div>
                  <a href="/product" class="hero-btn w-button">${a("hero.shop_now")}</a>
                </div>
                <div class="hero-img">
                  <img src="/asset/img/2.jpg" loading="eager" alt="Hero Right" class="cover-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- CATEGORIES -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="section-title-wrap">
          <div class="title-wrap">
            <div class="subtitle">${a("sections.explore")}</div>
            <h2>${a("sections.categories")}</h2>
          </div>
        </div>
        <div class="category-wrap">
          <div class="category-left w-dyn-list">
            <div role="list" class="categories-wrap w-dyn-items">
              <div role="listitem" class="w-dyn-item">
                <a href="/category/skin-care" class="feature-category w-inline-block" data-nav-link>
                  <div class="category-text">${a("categories.skin_care")}</div>
                  <img src="/img/4.jpg" loading="eager" alt="${a("categories.skin_care")}" class="cover-image" />
                </a>
              </div>
            </div>
          </div>
          <div class="category-right w-dyn-list">
            <div role="list" class="categories-wrap w-dyn-items">
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/hair-care" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/6.jpg" loading="eager" alt="${a("categories.hair_care")}" class="cover-image" />
                  <div class="category-text">${a("categories.hair_care")}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/makeup" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/5.jpg" loading="eager" alt="${a("categories.makeup")}" class="cover-image" />
                  <div class="category-text">${a("categories.makeup")}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/fragrances" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/7.jpg" loading="eager" alt="${a("categories.fragrances")}" class="cover-image" />
                  <div class="category-text">${a("categories.fragrances")}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/beauty-tools" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/8.jpg" loading="eager" alt="${a("categories.beauty_tools")}" class="cover-image" />
                  <div class="category-text">${a("categories.beauty_tools")}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT BLOCK -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="about-block">
          <div class="about-img">
            <img src="/img/9.jpg" loading="lazy" alt="About" class="cover-image" />
          </div>
          <div class="about-data">
            <div class="about-top">
              <h1 class="about-title">Your ultimate destination for premium beauty <br>products</h1>
              <p class="mx-medium">Where your beauty journey begins. At Beauty Bliss, we believe that every individual deserves to feel confident and radiant.</p>
              <div class="about-btn">
                <a href="/about" class="primary-button large w-button" data-nav-link>${a("buttons.about_glomin")}</a>
              </div>
            </div>
          </div>
          <div class="about-right">
            <img src="/img/10.jpg" loading="lazy" alt="About Right" class="cover-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORY BLOCKS (بنر بزرگ) -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="w-dyn-list">
          <div role="list" class="category-list w-dyn-items">
            <div style="background-image: url('/img/11.jpg');" role="listitem" class="category-block w-dyn-item">
              <a href="/category/skin-care" class="caegory-link w-inline-block" data-nav-link>
                <div class="body-x-small capitalize">Radiant Skin Solutions</div>
                <h2 class="category-title">Shop premium beauty products at beauty bliss by glomin</h2>
                <div class="secondary-button invert">${a("buttons.shop_now")}</div>
              </a>
            </div>
            <div style="background-image: url('/img/12.jpg');" role="listitem" class="category-block w-dyn-item">
              <a href="/category/beauty-tools" class="caegory-link w-inline-block" data-nav-link>
                <div class="body-x-small capitalize">Free Shipping</div>
                <h2 class="category-title">Elevate your beauty routine every time with our premium products</h2>
                <div class="secondary-button invert">${a("buttons.shop_now")}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOG -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div>
          <div class="section-title-wrap">
            <div class="title-wrap">
              <div class="subtitle">${a("sections.news")}</div>
              <h2>${a("sections.latest_articles")}</h2>
            </div>
          </div>
          <div class="w-dyn-list">
            <div role="list" class="blog-list w-dyn-items" data-blog-list>
              <div class="loading-placeholder">${a("common.loading")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="cta">
          <div class="fill-block">
            <div class="cta-img">
              <img src="/img/cta-image.jpg" loading="lazy" alt="CTA" class="cover-image" />
            </div>
          </div>
          <div class="fill-block">
            <div class="cta-content">
              <div>
                <h3 class="cta-title">${a("cta.title")}</h3>
                <p class="body-small">${a("cta.free_shipping")}</p>
              </div>
              <div class="cta-form-block w-form">
                <form class="cta-form" data-cta-form>
                  <input class="cta-field w-input" name="email" placeholder="${a("forms.email")}" type="email" required />
                  <input type="submit" class="cta-btn w-button" value="${a("buttons.subscribe")}" />
                </form>
                <div class="form-message" data-form-message></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section class="gallery">
      <div class="gallery-outer" data-gallery>
        <!-- گالری توسط JS پر می‌شه -->
      </div>
    </section>
  `);return queueMicrotask(()=>{T(),de(),ue()}),t}function de(){const t=document.querySelector("[data-blog-list]");if(!t)return;const e=[{title:"The ultimate guide to glomin's skincare essentials",slug:"skincare-essentials",category:"Skincare",date:"Aug 23, 2024",image:"/img/blog-thumb-02.jpg"},{title:"Essential tools & accessories for professional beauty routine",slug:"beauty-tools",category:"Accessories",date:"Aug 23, 2024",image:"/img/blog-thumb-03.jpg"},{title:"Behind the scenes how we develop our premium beauty products",slug:"behind-the-scenes",category:"Company Insights",date:"Aug 23, 2024",image:"/img/blog-thumb-04.jpg"}];t.innerHTML=e.map(i=>`
    <div role="listitem" class="d-flex w-dyn-item">
      <a href="/blog/${i.slug}" class="blog-card w-inline-block" data-nav-link>
        <div class="blog-thumb">
          <img src="${i.image}" loading="lazy" alt="${i.title}" class="cover-image" />
        </div>
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${i.category}</div>
            <div class="body-small">${i.date}</div>
          </div>
          <h3 class="blog-title">${i.title}</h3>
        </div>
      </a>
    </div>
  `).join("")}function ue(){const t=document.querySelector("[data-gallery]");if(!t)return;const i=`
    <div class="gallery-wrap">
      ${["/img/gallery-1.jpg","/img/gallery-2.jpg","/img/gallery-3.jpg","/img/gallery-4.jpg","/img/gallery-5.jpg"].map((o,l)=>`
        <a href="https://www.instagram.com/" target="_blank" class="gallery-link w-inline-block">
          <img src="${o}" loading="lazy" alt="Gallery ${l+1}" class="cover-image" />
          <div class="gallery-overlay">
            <div class="social-link">
              <img src="/img/ic-insta.svg" loading="lazy" alt="Instagram" />
            </div>
          </div>
        </a>
      `).join("")}
    </div>
  `;t.innerHTML=i.repeat(4)}async function ve(){const t=x(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${a("sections.our_story")}</div>
          <h1>${a("sections.about_us")}</h1>
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
            <div class="subtitle">${a("sections.our_purpose")}</div>
            <h2>${a("sections.vision_mission")}</h2>
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
            <div class="subtitle">${a("sections.experts")}</div>
            <h2>${a("sections.meet_team")}</h2>
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
                  <h3 class="cta-title">${a("cta.title")}</h3>
                  <p class="body-small">${a("cta.free_shipping")}</p>
                </div>
                <div class="cta-form-block w-form">
                  <form class="cta-form" data-cta-form>
                    <input class="cta-field w-input" name="email" placeholder="${a("forms.email")}" type="email" required />
                    <input type="submit" class="cta-btn w-button" value="${a("buttons.subscribe")}" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{T(),me()}),t}function me(){const t=document.querySelector("[data-faq-list]");if(!t)return;const e=[{q:"What is Glomin's return policy?",a:"We offer a 30-day return policy on all products. If you are not satisfied with your purchase, please contact our customer support team to initiate a return."},{q:"Do you offer free shipping?",a:"Yes, we offer free shipping on all orders over $50. For orders below $50, standard shipping rates apply. Free shipping is available for domestic orders only."},{q:"Where are Glomin products made?",a:"Yes, we offer international shipping to many countries. Shipping rates and delivery times vary based on the destination. Please refer to our shipping policy for more details."},{q:"How do I use Glomin's skincare products?",a:"Each product comes with detailed usage instructions on the packaging. For general guidance, start with cleansing your skin, apply serums or treatments as needed."},{q:"How can I stay updated on new products and promotions?",a:"To stay informed about our latest products, promotions, and exclusive offers, sign up for our newsletter on our website."},{q:"What should I do if I receive a damaged or incorrect item?",a:"If you receive a damaged or incorrect item, please contact our customer support team immediately. Provide your order number and details about the issue."}];t.innerHTML=e.map(i=>`
    <div class="faq" data-faq-item>
      <div class="question-block" data-faq-toggle>
        <p class="body-large color-black">${i.q}</p>
        <div class="faq-icon">
          <div class="plus-icon">+</div>
        </div>
      </div>
      <div class="answer-block" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${i.a}</p></div>
      </div>
    </div>
  `).join(""),t.querySelectorAll("[data-faq-toggle]").forEach(i=>{i.addEventListener("click",()=>{const o=i.nextElementSibling,l=o.style.display!=="none";o.style.display=l?"none":"block",i.classList.toggle("active",!l)})})}async function ge(){const t=x(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${a("sections.blogs")||"BLOGS"}</div>
          <h1>${a("sections.latest_articles")}</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer">

          <!-- FEATURE BLOG -->
          <div class="w-dyn-list">
            <div role="list" class="w-dyn-items">
              <div role="listitem" class="w-dyn-item" data-feature-blog>
                <div class="loading-placeholder">${a("common.loading")}</div>
              </div>
            </div>
          </div>

          <!-- BLOG LIST -->
          <div class="w-dyn-list">
            <div role="list" class="blog-list w-dyn-items" data-blog-list>
              <div class="loading-placeholder">${a("common.loading")}</div>
            </div>
            <div role="navigation" class="pagination" data-pagination></div>
          </div>

        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{T(),pe(),he()}),t}function pe(){const t=document.querySelector("[data-feature-blog]");if(!t)return;const e={title:"How to choose perfect fragrance for every occasion",slug:"how-to-choose-perfect-fragrance-for-every-occasion",category:"Fragrances",date:"Aug 23, 2024",excerpt:"Discover Glomin's collection of perfumes and learn how to select the right scent for your style and mood.",image:"/img/blog-main-01.jpg"};t.innerHTML=`
    <a href="/blog/${e.slug}" class="blog-wrap w-inline-block" data-nav-link>
      <div class="feature-img">
        <img src="${e.image}" loading="eager" alt="${e.title}" class="cover-image" />
      </div>
      <div class="feature-content">
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${e.category}</div>
            <div class="body-small">${e.date}</div>
          </div>
          <h3 class="blog-title">${e.title}</h3>
          <p>${e.excerpt}</p>
        </div>
        <div class="secondary-button">${a("buttons.read_more")}</div>
      </div>
    </a>
  `}function he(){const t=document.querySelector("[data-blog-list]");if(!t)return;const e=[{title:"The ultimate guide to glomin's skincare essentials",slug:"the-ultimate-guide-to-glomins-skincare-essentials",category:"Skincare",date:"Aug 23, 2024",image:"/img/blog-thumb-02.jpg"},{title:"Essential tools & accessories for professional beauty routine",slug:"essential-tools-accessories-for-professional-beauty-routine",category:"Accessories",date:"Aug 23, 2024",image:"/img/blog-thumb-03.jpg"},{title:"Behind the scenes how we develop our premium beauty products",slug:"behind-the-scenes-how-we-develop-our-premium-beauty-products",category:"Company Insights",date:"Aug 23, 2024",image:"/img/blog-thumb-04.jpg"},{title:"The importance of sun protection in your skincare routine",slug:"the-importance-of-sun-protection-in-your-skincare-routine",category:"Skincare",date:"Aug 23, 2024",image:"/img/blog-thumb-05.jpg"},{title:"Exploring the benefits of serums and how to use them",slug:"exploring-the-benefits-of-serums-and-how-to-use-them",category:"Accessories",date:"Aug 23, 2024",image:"/img/blog-thumb-06.jpg"},{title:"Glomin's favorite beauty hacks you need to know make life easier",slug:"glomins-favorite-beauty-hacks-you-need-to-know-make-life-easier",category:"Beauty Tips",date:"Aug 23, 2024",image:"/img/blog-thumb-07.jpg"}];t.innerHTML=e.map(i=>`
    <div role="listitem" class="d-flex w-dyn-item">
      <a href="/blog/${i.slug}" class="blog-card w-inline-block" data-nav-link>
        <div class="blog-thumb">
          <img src="${i.image}" loading="lazy" alt="${i.title}" class="cover-image" />
        </div>
        <div class="blog-content">
          <div class="blog-data">
            <div class="blog-category">${i.category}</div>
            <div class="body-small">${i.date}</div>
          </div>
          <h3 class="blog-title">${i.title}</h3>
        </div>
        <div class="d-none">Blogs</div>
      </a>
    </div>
  `).join("")}async function ye(t){const{slug:e}=t,i=x(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-card align-center" data-blog-detail>
          <div class="loading-placeholder">${a("common.loading")}</div>
        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{T(),fe()}),i}async function fe(t){const e=document.querySelector("[data-blog-detail]");if(e)try{const i={title:"Sample Blog Title",category:"Skincare",date:"2024-08-23",content:"<p>Blog content goes here...</p>"};e.innerHTML=`
      <h2>${i.title}</h2>
      <div class="blog-data small">
        <div class="blog-category">${i.category}</div>
        <div class="blog-line"></div>
        <div class="body-small">${i.date}</div>
      </div>
      <div class="blog-details">
        <div class="richtext w-richtext">${i.content}</div>
      </div>
    `}catch{e.innerHTML=`<p>${a("common.error")}</p>`}}async function be(){const t=x(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${a("sections.get_in_touch")||"GET IN TOUCH"}</div>
          <h1>${a("nav.contact")}</h1>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section>
      <div class="w-layout-blockcontainer container w-container">
        <div class="contact-wrap">

          <!-- فرم تماس -->
          <div class="contact-form-block w-form">
            <form class="contact-form" data-contact-form>
              <input
                class="text-field w-input"
                maxlength="256"
                name="first_name"
                placeholder="${a("forms.first_name")}*"
                type="text"
                required
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="last_name"
                placeholder="${a("forms.last_name")}"
                type="text"
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="email"
                placeholder="${a("forms.email")}*"
                type="email"
                required
              />
              <input
                class="text-field w-input"
                maxlength="256"
                name="phone"
                placeholder="${a("forms.phone")}"
                type="text"
              />
              <textarea
                required
                placeholder="${a("forms.message")}*"
                maxlength="5000"
                name="message"
                class="text-field textarea w-input"
              ></textarea>

              <div class="div-block">
                <label class="w-checkbox">
                  <input
                    type="checkbox"
                    name="agree"
                    required
                    class="w-checkbox-input"
                  />
                  <span class="w-form-label">
                    I hereby agree to the
                    <a href="/terms-conditions" class="contact-link" data-nav-link>Terms &amp; Conditions</a>
                    of Glomin
                  </span>
                </label>
                <input
                  type="submit"
                  class="primary-button w-button"
                  value="${a("buttons.submit")}"
                />
              </div>
            </form>

            <div class="form-message" data-form-message></div>
          </div>

          <!-- اطلاعات تماس -->
          <div class="contat-content">
            <p>Whether you need support with your order, have inquiries about our products, or just want to provide feedback.</p>

            <div class="contact-inner">
              <div class="contact-img">
                <img src="/img/contact-image.jpg" loading="eager" alt="Contact" class="cover-image" />
              </div>

              <div class="contact-info">
                <div class="contact-outer">

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/mail-icon.svg" loading="lazy" alt="Mail" />
                    </div>
                    <div>
                      <h6>Email</h6>
                      <div class="body-small">
                        To get in touch, email
                        <a href="mailto:info@example.com" class="contact-link">info@example.com</a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/phone-icon.svg" loading="lazy" alt="Call" />
                    </div>
                    <div>
                      <h6>Contact</h6>
                      <div class="body-small">
                        We're here to help –
                        <a href="tel:+(123)456-7890" class="contact-link">+(123) 456-7890</a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img src="/img/location-icon.svg" loading="lazy" alt="Location" />
                    </div>
                    <div>
                      <h6>Location</h6>
                      <div class="body-small">
                        3891 Ranchview Dr. Richardson, California
                      </div>
                    </div>
                  </div>

                </div>

                <div class="follow-us">
                 
                  
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{T(),we()}),t}function we(){const t=document.querySelector("[data-contact-form]"),e=document.querySelector("[data-form-message]");t&&t.addEventListener("submit",async i=>{i.preventDefault();const o=Object.fromEntries(new FormData(t));e&&(e.textContent="⏳ در حال ارسال...",e.style.color="#666",e.style.display="block");try{console.log("📩 Contact form:",o),await new Promise(l=>setTimeout(l,500)),e&&(e.textContent="✅ "+(a("forms.success_message")||"Thank you! Your message has been sent."),e.style.color="green"),t.reset()}catch(l){console.error("❌ Contact error:",l),e&&(e.textContent="❌ "+(l.message||"Error sending message"),e.style.color="red")}})}async function ke(){const t=x(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">FAQ's</div>
          <h1>Frequently Asked Questions</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="faq-wrap" data-faq-list>
          <div class="loading-placeholder">${a("common.loading")}</div>
        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{T(),$e()}),t}async function $e(){const t=document.querySelector("[data-faq-list]");if(!t)return;const e=[{q:"What is Glomin’s return policy?",a:"We offer a 30-day return policy."},{q:"Do you offer free shipping?",a:"Yes, on orders over $50."}];t.innerHTML=e.map(i=>`
    <div class="faq w-dropdown" data-faq-item>
      <div class="question-block w-dropdown-toggle" data-faq-toggle>
        <p class="body-large color-black">${i.q}</p>
        <div class="faq-icon">+</div>
      </div>
      <nav class="answer-block w-dropdown-list" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${i.a}</p></div>
      </nav>
    </div>
  `).join(""),t.querySelectorAll("[data-faq-toggle]").forEach(i=>{i.addEventListener("click",()=>{const o=i.nextElementSibling,l=o.style.display!=="none";o.style.display=l?"none":"block"})})}async function Se(t={}){if(!N())return setTimeout(()=>{var g,f;return(f=(g=window.__app)==null?void 0:g.router)==null?void 0:f.navigate("/login")},100),x('<div class="loading-placeholder">در حال انتقال...</div>');const e=M()==="fa",i=t.query||{},o=i.service,l=i.date,c=i.time,u=x(`
    <div class="checkout-page">
      <div class="w-layout-blockcontainer container w-container">

        <div class="checkout-header">
          <h1>${e?"پرداخت":"Checkout"}</h1>
          <p>${e?"اطلاعات رزرو را تایید کن و پرداخت کن":"Confirm your booking and complete payment"}</p>
        </div>

        <div class="checkout-grid">

          <!-- سمت چپ: اطلاعات -->
          <div class="checkout-main">

            <!-- خلاصه رزرو -->
            <div class="checkout-card">
              <h2>${e?"خلاصه رزرو":"Booking Summary"}</h2>
              <div class="checkout-info" data-booking-info>
                <div class="loading-placeholder">${a("common.loading")}</div>
              </div>
            </div>

            <!-- اطلاعات تماس -->
            <div class="checkout-card">
              <h2>${e?"اطلاعات تماس":"Contact Info"}</h2>
              <form class="checkout-form" data-checkout-form>
                <div class="checkout-field">
                  <label>${e?"نام کامل":"Full Name"}</label>
                  <input type="text" name="name" class="auth-input" required />
                </div>
                <div class="checkout-field">
                  <label>${e?"شماره تلفن":"Phone"}</label>
                  <input type="tel" name="phone" class="auth-input" dir="ltr" required />
                </div>
                <div class="checkout-field">
                  <label>${e?"یادداشت":"Note"}</label>
                  <textarea name="note" class="auth-input" rows="3"></textarea>
                </div>
              </form>
            </div>

            <!-- روش پرداخت -->
            <div class="checkout-card">
              <h2>${e?"روش پرداخت":"Payment Method"}</h2>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" name="payment" value="online" checked />
                  <span>${e?"پرداخت آنلاین":"Online Payment"}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="payment" value="cash" />
                  <span>${e?"پرداخت در محل":"Pay on Site"}</span>
                </label>
              </div>
            </div>

          </div>

          <!-- سمت راست: Total + پرداخت -->
          <div class="checkout-sidebar">
            <div class="checkout-card sticky">
              <h2>${e?"جمع کل":"Total"}</h2>
              <div class="total-row">
                <span>${e?"مبلغ":"Amount"}</span>
                <strong data-total-price>—</strong>
              </div>
              <div class="total-row">
                <span>${e?"مالیات":"Tax"}</span>
                <strong data-total-tax>0</strong>
              </div>
              <div class="total-row grand">
                <span>${e?"قابل پرداخت":"Payable"}</span>
                <strong data-total-final>—</strong>
              </div>

              <button class="primary-button w-button full-width" data-pay-btn>
                ${e?"پرداخت":"Pay Now"}
              </button>

              <div class="form-message" data-checkout-msg></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `);return queueMicrotask(()=>{T(),qe({serviceId:o,date:l,time:c,isFa:e})}),u}function qe({serviceId:t,date:e,time:i,isFa:o}){let l=null;const c=document.querySelector("[data-booking-info]"),u=document.querySelector("[data-total-price]"),g=document.querySelector("[data-total-tax]"),f=document.querySelector("[data-total-final]"),q=document.querySelector("[data-checkout-msg]"),k=document.querySelector("[data-pay-btn]");_();async function _(){try{l={1:{name:o?"میکاپ عروس":"Bridal Makeup",price:5e6},2:{name:o?"رنگ و مش":"Hair Color",price:25e5},3:{name:o?"کراتین مو":"Keratin Treatment",price:35e5},4:{name:o?"پاکسازی پوست":"Facial Cleansing",price:15e5},5:{name:o?"میکاپ ساده":"Simple Makeup",price:12e5},6:{name:o?"میکاپ مجلسی":"Party Makeup",price:2e6}}[t]||{name:"—",price:0},c.innerHTML=`
        <div class="info-row"><span>${o?"خدمت":"Service"}</span><strong>${l.name}</strong></div>
        <div class="info-row"><span>${o?"تاریخ":"Date"}</span><strong>${e||"—"}</strong></div>
        <div class="info-row"><span>${o?"ساعت":"Time"}</span><strong>${i||"—"}</strong></div>
      `;const b=Math.round(l.price*.09);u.textContent=E(l.price),g.textContent=E(b),f.textContent=E(l.price+b)}catch(v){console.error(v),c.innerHTML="<p>خطا در بارگذاری</p>"}}k==null||k.addEventListener("click",async()=>{var m;const v=document.querySelector("[data-checkout-form]");if(!v.checkValidity()){v.reportValidity();return}const b=Object.fromEntries(new FormData(v)),d=((m=document.querySelector('input[name="payment"]:checked'))==null?void 0:m.value)||"online";S(k,!0),w(q,o?"در حال پردازش...":"Processing...","info");try{const n={service_id:t,date:e,time:i,name:b.name,phone:b.phone,note:b.note,payment_method:d};console.log("📅 Booking:",n),await new Promise(s=>setTimeout(s,1200)),d==="online"?(w(q,o?"در حال انتقال به درگاه...":"Redirecting to gateway...","success"),setTimeout(()=>{var s,p;return(p=(s=window.__app)==null?void 0:s.router)==null?void 0:p.navigate("/dashboard")},2e3)):(w(q,o?"رزرو با موفقیت ثبت شد!":"Booked successfully!","success"),setTimeout(()=>{var s,p;return(p=(s=window.__app)==null?void 0:s.router)==null?void 0:p.navigate("/dashboard")},2e3))}catch(n){w(q,n.message||(o?"خطا در پرداخت":"Payment error"),"error")}finally{S(k,!1)}});function w(v,b,d="info"){v&&(v.textContent=b,v.style.display=b?"block":"none",v.style.color=d==="error"?"#e74c3c":d==="success"?"#27ae60":"#666")}function S(v,b){v&&(v.disabled=b,b?(v.dataset.originalText=v.textContent,v.textContent=o?"لطفاً صبر کنید...":"Please wait..."):v.textContent=v.dataset.originalText||v.textContent)}function E(v){return new Intl.NumberFormat(o?"fa-IR":"en-US").format(v)+(o?" تومان":" IRR")}}async function _e(){console.log("🟢 LoginPage started");const t=x(`
    <div class="auth-page">
      <div class="auth-container">

        <div class="auth-header">
          <h2>${a("auth.login_title")}</h2>
          <p>${a("auth.login_subtitle")}</p>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs" data-tabs>
          <button type="button" class="auth-tab active" data-tab="phone">${a("auth.tab_phone")}</button>
          <button type="button" class="auth-tab" data-tab="email">${a("auth.tab_email")}</button>
        </div>

        <!-- Phone Tab -->
        <div class="auth-tab-content" data-tab-content="phone">
          <form class="auth-form" data-phone-form>
            <div class="auth-field">
              <label>${a("auth.phone_label")}</label>
              <input type="tel" name="phone" placeholder="${a("auth.phone_placeholder")}" class="auth-input" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${a("auth.btn_send_otp_login")}
            </button>
          </form>
        </div>

        <!-- Email Tab -->
        <div class="auth-tab-content" data-tab-content="email" style="display:none">
          <form class="auth-form" data-email-form>
            <div class="auth-field">
              <label>${a("auth.email_label")}</label>
              <input type="email" name="email" placeholder="${a("auth.email_placeholder")}" class="auth-input" required dir="ltr" />
            </div>
            <div class="auth-field">
              <label>${a("auth.password_label")}</label>
              <input type="password" name="password" placeholder="${a("auth.password_placeholder")}" class="auth-input" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${a("auth.btn_login")}
            </button>
          </form>
        </div>

        <!-- OTP Step -->
        <div class="auth-otp-step" data-otp-step style="display:none">
          <div class="auth-header" style="margin-bottom:20px">
            <p>${a("auth.otp_subtitle").replace("{phone}","<strong data-phone-display></strong>")}</p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label>${a("auth.otp_label")}</label>
              <input type="text" name="code" placeholder="${a("auth.otp_placeholder")}" class="auth-input otp-input" maxlength="6" inputmode="numeric" pattern="[0-9]*" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-otp-submit>
              ${a("auth.btn_verify_login")}
            </button>
          </form>

          <div class="auth-resend">
            <button type="button" class="auth-link-btn" data-resend-btn>${a("auth.btn_resend")}</button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:12px">
            <button type="button" class="auth-link-btn" data-back-btn>${a("auth.btn_back")}</button>
          </div>
        </div>

        <!-- Message -->
        <div class="form-message" data-msg></div>

        <!-- Footer -->
        <div class="auth-footer" data-main-footer>
          <span>${a("auth.no_account")}</span>
          <a href="/register" data-nav-link>${a("auth.link_register")}</a>
        </div>

      </div>
    </div>
  `);return console.log("🟢 HTML generated"),setTimeout(()=>{console.log("🎬 Initializing login listeners...");const e=document.querySelectorAll("[data-tab]"),i=document.querySelector("[data-otp-step]");console.log("Tabs found:",e.length),console.log("OTP step found:",!!i),T(),xe(),console.log("✅ Login listeners attached")},100),t}function xe(){console.log("🔧 initLogin started");let t="",e=null;const i=document.querySelector("[data-tabs]"),o=document.querySelector("[data-otp-step]"),l=document.querySelector("[data-main-footer]"),c=document.querySelector("[data-msg]"),u=document.querySelector("[data-phone-display]"),g=document.querySelector("[data-resend-btn]"),f=document.querySelector("[data-timer]"),q=document.querySelector("[data-back-btn]"),k=document.querySelectorAll("[data-tab]");console.log("🔧 Found",k.length,"tabs"),k.forEach(n=>{n.addEventListener("click",s=>{s.preventDefault(),console.log("🖱️ Tab clicked:",n.dataset.tab);const p=n.dataset.tab;document.querySelectorAll("[data-tab]").forEach(h=>h.classList.remove("active")),document.querySelectorAll("[data-tab-content]").forEach(h=>h.style.display="none"),n.classList.add("active");const y=document.querySelector(`[data-tab-content="${p}"]`);y&&(y.style.display="block"),v("")})});const _=document.querySelector("[data-phone-form]");console.log("🔧 Phone form:",!!_),_==null||_.addEventListener("submit",async n=>{n.preventDefault(),console.log("📱 Phone form submitted");const s=Object.fromEntries(new FormData(_)),p=d(s.phone);if(!m(p)){v(a("auth.msg_invalid_phone"),"error");return}t=p;const y=_.querySelector("[data-submit-btn]");b(y,!0);try{const h=await j.loginPhoneSendCode(p);console.log("📱 Send code response:",h),u&&(u.textContent=p),i&&(i.style.display="none"),document.querySelectorAll("[data-tab-content]").forEach($=>$.style.display="none"),l&&(l.style.display="none"),o&&(o.style.display="block"),E(60),v(""),setTimeout(()=>{var $;return($=o==null?void 0:o.querySelector('input[name="code"]'))==null?void 0:$.focus()},100)}catch(h){console.error("❌ Send code error:",h),v(h.message||a("auth.msg_error_send"),"error")}finally{b(y,!1)}});const w=document.querySelector("[data-otp-form]");console.log("🔧 OTP form:",!!w),w==null||w.addEventListener("submit",async n=>{var y,h,$;n.preventDefault(),console.log("🔐 OTP form submitted");const s=Object.fromEntries(new FormData(w));if(!s.code||s.code.length<5){v(a("auth.msg_otp_incomplete"),"error");return}const p=w.querySelector("[data-otp-submit]");b(p,!0);try{const r=await j.loginPhoneVerify(t,s.code);console.log("✅ Verify response:",r);const L=(r==null?void 0:r.token)||(r==null?void 0:r.access_token)||((y=r==null?void 0:r.data)==null?void 0:y.token)||((h=r==null?void 0:r.data)==null?void 0:h.access_token),I=(r==null?void 0:r.user)||(($=r==null?void 0:r.data)==null?void 0:$.user)||{phone:t};if(!L)throw new Error(a("auth.msg_error_verify"));O(L,I),v(a("auth.msg_login_success"),"success"),setTimeout(()=>{var A,P;return(P=(A=window.__app)==null?void 0:A.router)==null?void 0:P.navigate("/dashboard")},800)}catch(r){console.error("❌ Verify error:",r),v(r.message||a("auth.msg_error_verify"),"error")}finally{b(p,!1)}});const S=document.querySelector("[data-email-form]");console.log("🔧 Email form:",!!S),S==null||S.addEventListener("submit",async n=>{var y,h,$;n.preventDefault(),console.log("📧 Email form submitted");const s=Object.fromEntries(new FormData(S)),p=S.querySelector("[data-submit-btn]");b(p,!0);try{const r=await j.loginEmail(s.email,s.password);console.log("📧 Email login response:",r);const L=(r==null?void 0:r.token)||(r==null?void 0:r.access_token)||((y=r==null?void 0:r.data)==null?void 0:y.token)||((h=r==null?void 0:r.data)==null?void 0:h.access_token),I=(r==null?void 0:r.user)||(($=r==null?void 0:r.data)==null?void 0:$.user)||{email:s.email};if(!L)throw new Error(a("auth.msg_error_login"));O(L,I),v(a("auth.msg_login_success"),"success"),setTimeout(()=>{var A,P;return(P=(A=window.__app)==null?void 0:A.router)==null?void 0:P.navigate("/dashboard")},800)}catch(r){console.error("❌ Email login error:",r),v(r.message||a("auth.msg_error_login"),"error")}finally{b(p,!1)}}),g==null||g.addEventListener("click",async()=>{if(!g.disabled)try{await j.loginPhoneSendCode(t),v(a("auth.msg_otp_resent"),"success"),E(60)}catch(n){v(n.message,"error")}}),q==null||q.addEventListener("click",()=>{o&&(o.style.display="none"),i&&(i.style.display="flex");const n=document.querySelector('[data-tab-content="phone"]');n&&(n.style.display="block"),l&&(l.style.display="flex"),w&&w.reset(),e&&clearInterval(e),v("")});function E(n){e&&clearInterval(e);let s=n;g&&(g.disabled=!0,g.style.opacity="0.5");const p=()=>{if(s<=0){clearInterval(e),g&&(g.disabled=!1,g.style.opacity="1"),f&&(f.textContent="");return}f&&(f.textContent=`(${s}s)`),s--};p(),e=setInterval(p,1e3)}function v(n,s="info"){c&&(c.textContent=n,c.style.display=n?"block":"none",c.style.color=s==="error"?"#e74c3c":s==="success"?"#27ae60":"#666")}function b(n,s){n&&(n.disabled=s,s?(n.dataset.originalText=n.textContent,n.textContent=a("auth.loading")):n.textContent=n.dataset.originalText||n.textContent)}function d(n){const s="۰۱۲۳۴۵۶۷۸۹",p="٠١٢٣٤٥٦٧٨٩";let y=n.toString();for(let h=0;h<10;h++)y=y.replace(new RegExp(s[h],"g"),h),y=y.replace(new RegExp(p[h],"g"),h);return y.replace(/\D/g,"")}function m(n){return/^09\d{9}$/.test(n)||/^989\d{9}$/.test(n)}console.log("✅ initLogin completed")}async function Ee(){const t=x(`
    <div class="section" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center">
      <div>
        <h1 style="font-size:6rem;margin:0">404</h1>
        <h2>${a("not_found.title")}</h2>
        <p>${a("not_found.description")}</p>
        <a href="/" class="primary-button w-button" data-nav-link>${a("not_found.back_home")}</a>
      </div>
    </div>
  `);return queueMicrotask(()=>T()),t}async function Le(){if(!N())return setTimeout(()=>{var o,l;return(l=(o=window.__app)==null?void 0:o.router)==null?void 0:l.navigate("/login")},100),x('<div class="loading-placeholder">در حال انتقال...</div>');const t=Q(),e=M()==="fa",i=x(`
    <div class="dashboard-page">
      <div class="w-layout-blockcontainer container w-container">

        <!-- HEADER -->
        <div class="dashboard-header">
          <div>
            <h1>${e?"سلام":"Hello"}, ${(t==null?void 0:t.name)||(e?"کاربر":"User")} 👋</h1>
            <p>${e?"خدمت مورد نظرت رو انتخاب کن و رزرو کن":"Choose a service and book your appointment"}</p>
          </div>
          <button class="primary-button w-button" data-logout-btn>
            ${e?"خروج":"Logout"}
          </button>
        </div>

        <!-- TABS -->
        <div class="dashboard-tabs">
          <button class="dashboard-tab active" data-dash-tab="services">
            ${e?"خدمات":"Services"}
          </button>
          <button class="dashboard-tab" data-dash-tab="appointments">
            ${e?"نوبت‌های من":"My Appointments"}
          </button>
        </div>

        <!-- TAB: خدمات -->
        <div class="dashboard-content" data-dash-content="services">
          <div class="services-grid" data-services-grid>
            <div class="loading-placeholder">${a("common.loading")}</div>
          </div>
        </div>

        <!-- TAB: نوبت‌ها -->
        <div class="dashboard-content" data-dash-content="appointments" style="display:none">
          <div class="appointments-list" data-appointments-list>
            <div class="loading-placeholder">${a("common.loading")}</div>
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
          <h2 data-modal-title>${e?"رزرو نوبت":"Book Appointment"}</h2>
          <p data-modal-subtitle></p>
        </div>

        <!-- مرحله ۱: تاریخ -->
        <div class="booking-step" data-step="date">
          <h3>${e?"تاریخ را انتخاب کن":"Select a date"}</h3>
          <div class="date-picker-grid" data-date-picker></div>
        </div>

        <!-- مرحله ۲: ساعت -->
        <div class="booking-step" data-step="time" style="display:none">
          <h3>${e?"ساعت را انتخاب کن":"Select a time"}</h3>
          <div class="time-picker-grid" data-time-picker></div>
        </div>

        <!-- خلاصه + پرداخت -->
        <div class="booking-summary" data-booking-summary style="display:none">
          <div class="summary-row">
            <span>${e?"خدمت":"Service"}:</span>
            <strong data-summary-service></strong>
          </div>
          <div class="summary-row">
            <span>${e?"تاریخ":"Date"}:</span>
            <strong data-summary-date></strong>
          </div>
          <div class="summary-row">
            <span>${e?"ساعت":"Time"}:</span>
            <strong data-summary-time></strong>
          </div>
          <div class="summary-row total">
            <span>${e?"مبلغ":"Total"}:</span>
            <strong data-summary-price></strong>
          </div>
        </div>

        <!-- دکمه‌ها -->
        <div class="booking-actions">
          <button class="secondary-button" data-booking-prev style="display:none">
            ${e?"← قبلی":"← Back"}
          </button>
          <button class="primary-button w-button" data-booking-next disabled>
            ${e?"ادامه":"Continue"}
          </button>
        </div>

      </div>
    </div>
  `);return queueMicrotask(()=>{T(),Te(t,e)}),i}function Te(t,e){var E,v,b;let i=[],o=null,l=null,c=null,u=1;(E=document.querySelector("[data-logout-btn]"))==null||E.addEventListener("click",()=>{var d,m;localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user"),(m=(d=window.__app)==null?void 0:d.router)==null||m.navigate("/login")}),document.querySelectorAll("[data-dash-tab]").forEach(d=>{d.addEventListener("click",()=>{document.querySelectorAll("[data-dash-tab]").forEach(n=>n.classList.remove("active")),document.querySelectorAll("[data-dash-content]").forEach(n=>n.style.display="none"),d.classList.add("active");const m=document.querySelector(`[data-dash-content="${d.dataset.dashTab}"]`);m&&(m.style.display="block")})}),g(),f();async function g(){const d=document.querySelector("[data-services-grid]");if(d)try{i=[{id:1,name:e?"میکاپ عروس":"Bridal Makeup",description:e?"میکاپ حرفه‌ای عروس":"Professional bridal makeup",price:5e6,duration:120,image:"/img/service-1.jpg"},{id:2,name:e?"رنگ و مش":"Hair Color",description:e?"رنگ و مش مو":"Hair coloring & highlights",price:25e5,duration:90,image:"/img/service-2.jpg"},{id:3,name:e?"کراتین مو":"Keratin Treatment",description:e?"صافی و درخشندگی مو":"Hair smoothing & shine",price:35e5,duration:150,image:"/img/service-3.jpg"},{id:4,name:e?"پاکسازی پوست":"Facial Cleansing",description:e?"پاکسازی و آبرسانی پوست":"Deep skin cleansing",price:15e5,duration:60,image:"/img/service-4.jpg"},{id:5,name:e?"میکاپ ساده":"Simple Makeup",description:e?"میکاپ روزانه":"Daily makeup",price:12e5,duration:45,image:"/img/service-5.jpg"},{id:6,name:e?"میکاپ مجلسی":"Party Makeup",description:e?"میکاپ مجلسی":"Evening party makeup",price:2e6,duration:60,image:"/img/service-6.jpg"}],d.innerHTML=i.map(m=>`
        <div class="service-card" data-service-id="${m.id}">
          <div class="service-img">
            <img src="${m.image}" loading="lazy" alt="${m.name}" class="cover-image" />
          </div>
          <div class="service-content">
            <h3 class="service-name">${m.name}</h3>
            <p class="service-desc">${m.description}</p>
            <div class="service-meta">
              <span class="service-price">${S(m.price)}</span>
              <span class="service-duration">${m.duration} ${e?"دقیقه":"min"}</span>
            </div>
            <button class="primary-button w-button" data-book-service="${m.id}">
              ${e?"رزرو":"Book"}
            </button>
          </div>
        </div>
      `).join(""),d.querySelectorAll("[data-book-service]").forEach(m=>{m.addEventListener("click",n=>{n.stopPropagation();const s=Number(m.dataset.bookService),p=i.find(y=>y.id===s);p&&q(p)})})}catch(m){console.error("❌ Services load error:",m),d.innerHTML=`<p>${e?"خطا در بارگذاری":"Failed to load"}</p>`}}async function f(){var m;const d=document.querySelector("[data-appointments-list]");if(d)try{const n=[];if(n.length===0){d.innerHTML=`
          <div class="empty-state">
            <p>${e?"هنوز نوبتی رزرو نکرده‌اید":"No appointments yet"}</p>
            <button class="primary-button w-button" data-goto-services>
              ${e?"رزرو اولین نوبت":"Book your first appointment"}
            </button>
          </div>
        `,(m=d.querySelector("[data-goto-services]"))==null||m.addEventListener("click",()=>{document.querySelector('[data-dash-tab="services"]').click()});return}d.innerHTML=n.map(s=>`
        <div class="appointment-card">
          <div class="appointment-info">
            <h3>${s.service}</h3>
            <div class="appointment-meta">
              <span>📅 ${s.date}</span>
              <span>🕐 ${s.time}</span>
            </div>
          </div>
          <div class="appointment-status status-${s.status}">${s.status}</div>
        </div>
      `).join("")}catch(n){console.error("❌ Appointments load error:",n)}}function q(d){o=d,l=null,c=null,u=1;const m=document.querySelector("[data-booking-modal]"),n=m.querySelector("[data-modal-title]"),s=m.querySelector("[data-modal-subtitle]");n.textContent=d.name,s.textContent=d.description,m.querySelector('[data-step="date"]').style.display="block",m.querySelector('[data-step="time"]').style.display="none",m.querySelector("[data-booking-summary]").style.display="none",m.querySelector("[data-booking-prev]").style.display="none",m.querySelector("[data-booking-next]").textContent=e?"ادامه":"Continue",m.querySelector("[data-booking-next]").disabled=!0,k(),m.style.display="flex",document.body.style.overflow="hidden"}function k(){const d=document.querySelector("[data-date-picker]");if(!d)return;const m=[],n=new Date;for(let s=0;s<14;s++){const p=new Date(n);p.setDate(n.getDate()+s),m.push(p)}d.innerHTML=m.map(s=>{const p=s.toISOString().split("T")[0],y=s.toLocaleDateString(e?"fa-IR":"en-US",{weekday:"short"}),h=s.getDate(),$=s.toLocaleDateString(e?"fa-IR":"en-US",{month:"short"});return`
        <button class="date-item" data-date="${p}">
          <span class="date-day">${y}</span>
          <span class="date-num">${h}</span>
          <span class="date-month">${$}</span>
        </button>
      `}).join(""),d.querySelectorAll("[data-date]").forEach(s=>{s.addEventListener("click",()=>{d.querySelectorAll(".date-item").forEach(p=>p.classList.remove("active")),s.classList.add("active"),l=s.dataset.date,w()})})}function _(){const d=document.querySelector("[data-time-picker]");if(!d)return;const m=[];for(let n=9;n<=20;n++)m.push(`${String(n).padStart(2,"0")}:00`),n<20&&m.push(`${String(n).padStart(2,"0")}:30`);d.innerHTML=m.map(n=>`
      <button class="time-item" data-time="${n}">${n}</button>
    `).join(""),d.querySelectorAll("[data-time]").forEach(n=>{n.addEventListener("click",()=>{d.querySelectorAll(".time-item").forEach(s=>s.classList.remove("active")),n.classList.add("active"),c=n.dataset.time,w()})})}(v=document.querySelector("[data-booking-next]"))==null||v.addEventListener("click",()=>{var d,m;if(u===1&&l)u=2,document.querySelector('[data-step="date"]').style.display="none",document.querySelector('[data-step="time"]').style.display="block",document.querySelector("[data-booking-prev]").style.display="block",_(),w();else if(u===2&&c)u=3,document.querySelector('[data-step="time"]').style.display="none",document.querySelector("[data-booking-summary]").style.display="block",document.querySelector("[data-booking-next]").textContent=e?"پرداخت":"Proceed to Payment",document.querySelector("[data-summary-service]").textContent=o.name,document.querySelector("[data-summary-date]").textContent=l,document.querySelector("[data-summary-time]").textContent=c,document.querySelector("[data-summary-price]").textContent=S(o.price);else if(u===3){const n=new URLSearchParams({service:o.id,date:l,time:c});(m=(d=window.__app)==null?void 0:d.router)==null||m.navigate(`/checkout?${n.toString()}`)}}),(b=document.querySelector("[data-booking-prev]"))==null||b.addEventListener("click",()=>{u===2?(u=1,document.querySelector('[data-step="time"]').style.display="none",document.querySelector('[data-step="date"]').style.display="block",document.querySelector("[data-booking-prev]").style.display="none",w()):u===3&&(u=2,document.querySelector("[data-booking-summary]").style.display="none",document.querySelector('[data-step="time"]').style.display="block",document.querySelector("[data-booking-next]").textContent=e?"ادامه":"Continue",w())}),document.querySelectorAll("[data-modal-close]").forEach(d=>{d.addEventListener("click",()=>{document.querySelector("[data-booking-modal]").style.display="none",document.body.style.overflow=""})});function w(){const d=document.querySelector("[data-booking-next]");d&&(u===1?d.disabled=!l:u===2?d.disabled=!c:d.disabled=!1)}function S(d){return new Intl.NumberFormat(e?"fa-IR":"en-US").format(d)+(e?" تومان":" IRR")}}async function Ce(){console.log("🟢 RegisterPage started");const t=x(`
    <div class="auth-page">
      <div class="auth-container">

        <div class="auth-header">
          <h2>${a("auth.register_title")}</h2>
          <p>${a("auth.register_subtitle")}</p>
        </div>

        <!-- STEP 1: نام + شماره + کد معرف -->
        <div data-step="phone">
          <form class="auth-form" data-phone-form>
            <div class="auth-field">
              <label>${a("auth.name_label")}</label>
              <input type="text" name="name" placeholder="${a("auth.name_placeholder")}" class="auth-input" required />
            </div>
            <div class="auth-field">
              <label>${a("auth.phone_label")}</label>
              <input type="tel" name="phone" placeholder="${a("auth.phone_placeholder")}" class="auth-input" required dir="ltr" />
            </div>
            <div class="auth-field">
              <label>${a("auth.referral_label")||"کد معرف"} <span style="font-size:12px;color:#999;font-weight:400">(${a("common.optional")||"اختیاری"})</span></label>
              <input type="text" name="referral_code" placeholder="${a("auth.referral_placeholder")||"مثلاً: ABC123"}" class="auth-input" dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-submit-btn>
              ${a("auth.btn_send_otp_register")}
            </button>
          </form>
        </div>

        <!-- STEP 2: کد OTP -->
        <div data-step="otp" style="display:none">
          <div class="auth-header" style="margin-bottom:20px">
            <p>${a("auth.otp_subtitle").replace("{phone}","<strong data-phone-display></strong>")}</p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label>${a("auth.otp_label")}</label>
              <input type="text" name="code" placeholder="${a("auth.otp_placeholder")}" class="auth-input otp-input" maxlength="6" inputmode="numeric" pattern="[0-9]*" required dir="ltr" />
            </div>
            <button type="submit" class="primary-button w-button" data-otp-submit>
              ${a("auth.btn_verify_register")}
            </button>
          </form>

          <div class="auth-resend">
            <button type="button" class="auth-link-btn" data-resend-btn>${a("auth.btn_resend")}</button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:12px">
            <button type="button" class="auth-link-btn" data-back-btn>${a("auth.btn_back")}</button>
          </div>
        </div>

        <div class="form-message" data-msg></div>

        <div class="auth-footer" data-main-footer>
          <span>${a("auth.have_account")}</span>
          <a href="/login" data-nav-link>${a("auth.link_login")}</a>
        </div>

      </div>
    </div>
  `);return setTimeout(()=>{T(),Ae()},100),t}function Ae(){console.log("🔧 initRegister started");let t="",e="",i="",o=null;const l=document.querySelector('[data-step="phone"]'),c=document.querySelector('[data-step="otp"]'),u=document.querySelector("[data-phone-form]"),g=document.querySelector("[data-otp-form]"),f=document.querySelector("[data-phone-display]"),q=document.querySelector("[data-msg]"),k=document.querySelector("[data-resend-btn]"),_=document.querySelector("[data-timer]"),w=document.querySelector("[data-back-btn]"),S=document.querySelector("[data-main-footer]");u==null||u.addEventListener("submit",async n=>{n.preventDefault(),console.log("📝 Register form submitted");const s=Object.fromEntries(new FormData(u)),p=(s.name||"").trim(),y=d(s.phone),h=(s.referral_code||"").trim().toUpperCase();if(!p){v(a("auth.name_required")||"نام را وارد کنید","error");return}if(!m(y)){v(a("auth.msg_invalid_phone"),"error");return}t=y,e=p,i=h;const $=u.querySelector("[data-submit-btn]");b($,!0);try{const r=await j.registerSendCode(p,y,h);console.log("📱 Register send code response:",r),f&&(f.textContent=y),l&&(l.style.display="none"),c&&(c.style.display="block"),S&&(S.style.display="none"),E(60),v(""),setTimeout(()=>{var L;return(L=c==null?void 0:c.querySelector('input[name="code"]'))==null?void 0:L.focus()},100)}catch(r){console.error("❌ Register send code error:",r),v(r.message||a("auth.msg_error_send"),"error")}finally{b($,!1)}}),g==null||g.addEventListener("submit",async n=>{var y,h,$;n.preventDefault(),console.log("🔐 Register OTP submitted");const s=Object.fromEntries(new FormData(g));if(!s.code||s.code.length<5){v(a("auth.msg_otp_incomplete"),"error");return}const p=g.querySelector("[data-otp-submit]");b(p,!0);try{const r=await j.registerVerify(t,s.code);console.log("✅ Register verify response:",r);const L=(r==null?void 0:r.token)||(r==null?void 0:r.access_token)||((y=r==null?void 0:r.data)==null?void 0:y.token)||((h=r==null?void 0:r.data)==null?void 0:h.access_token),I=(r==null?void 0:r.user)||(($=r==null?void 0:r.data)==null?void 0:$.user)||{phone:t,name:e};if(!L)throw new Error(a("auth.msg_error_verify"));O(L,I),v(a("auth.msg_register_success"),"success"),setTimeout(()=>{var A,P;return(P=(A=window.__app)==null?void 0:A.router)==null?void 0:P.navigate("/dashboard")},800)}catch(r){console.error("❌ Register verify error:",r),v(r.message||a("auth.msg_error_verify"),"error")}finally{b(p,!1)}}),k==null||k.addEventListener("click",async()=>{if(!k.disabled)try{await j.registerSendCode(e,t,i),v(a("auth.msg_otp_resent"),"success"),E(60)}catch(n){v(n.message,"error")}}),w==null||w.addEventListener("click",()=>{c&&(c.style.display="none"),l&&(l.style.display="block"),S&&(S.style.display="flex"),g&&g.reset(),o&&clearInterval(o),v("")});function E(n){o&&clearInterval(o);let s=n;k&&(k.disabled=!0,k.style.opacity="0.5");const p=()=>{if(s<=0){clearInterval(o),k&&(k.disabled=!1,k.style.opacity="1"),_&&(_.textContent="");return}_&&(_.textContent=`(${s}s)`),s--};p(),o=setInterval(p,1e3)}function v(n,s="info"){q&&(q.textContent=n,q.style.display=n?"block":"none",q.style.color=s==="error"?"#e74c3c":s==="success"?"#27ae60":"#666")}function b(n,s){n&&(n.disabled=s,s?(n.dataset.originalText=n.textContent,n.textContent=a("auth.loading")):n.textContent=n.dataset.originalText||n.textContent)}function d(n){const s="۰۱۲۳۴۵۶۷۸۹",p="٠١٢٣٤٥٦٧٨٩";let y=n.toString();for(let h=0;h<10;h++)y=y.replace(new RegExp(s[h],"g"),h),y=y.replace(new RegExp(p[h],"g"),h);return y.replace(/\D/g,"")}function m(n){return/^09\d{9}$/.test(n)||/^989\d{9}$/.test(n)}console.log("✅ initRegister completed")}window.addEventListener("error",t=>console.error("🚨",t.error||t.message));window.addEventListener("unhandledrejection",t=>console.error("🚨",t.reason));const Pe=[{path:"/",component:ce,title:"Nil Beauty"},{path:"/about",component:ve,title:"درباره ما"},{path:"/blog",component:ge,title:"بلاگ"},{path:"/blog/:slug",component:ye,title:"مقاله"},{path:"/contact",component:be,title:"تماس"},{path:"/faq",component:ke,title:"سوالات"},{path:"/checkout",component:Se,title:"پرداخت"},{path:"/login",component:_e,title:"ورود"},{path:"/dashboard",component:Le,title:"داشبورد"},{path:"/register",component:Ce,title:"ثبت‌نام"},{path:"*",component:Ee,title:"404"}];async function je(){console.log("🚀 Bootstrap started");try{if(await te(),oe(),!document.querySelector("#app"))throw new Error("#app not found");const e=new F(Pe,"#app");e.start(),window.__app={router:e},window.addEventListener("pageChanged",()=>{setTimeout(()=>J(),50)}),console.log("🎉 Nil Beauty initialized")}catch(t){console.error("❌ Bootstrap failed:",t);const e=document.getElementById("app");e&&(e.innerHTML=`<div style="padding:40px;color:red"><h2>خطا</h2><pre>${t.message}</pre></div>`)}}je();
