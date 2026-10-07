(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const d of s)if(d.type==="childList")for(const v of d.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&o(v)}).observe(document,{childList:!0,subtree:!0});function i(s){const d={};return s.integrity&&(d.integrity=s.integrity),s.referrerPolicy&&(d.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?d.credentials="include":s.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function o(s){if(s.ep)return;s.ep=!0;const d=i(s);fetch(s.href,d)}})();class Z{constructor(e,i="#app"){this.routes=e,this.container=document.querySelector(i),this.currentPath=null,this.handlePopState=this.handlePopState.bind(this),this.handleLinkClick=this.handleLinkClick.bind(this)}start(){window.addEventListener("popstate",this.handlePopState),document.addEventListener("click",this.handleLinkClick),this.handlePopState()}stop(){window.removeEventListener("popstate",this.handlePopState),document.removeEventListener("click",this.handleLinkClick)}navigate(e,i=!0){i&&window.history.pushState({},"",e),this.resolve(e)}async resolve(e){const i=e.split("?")[0];this.currentPath=i;const o=this.matchRoute(i);if(!o){console.warn("⚠️ No route matched:",i);return}const{route:s,params:d}=o;s.title&&(document.title=s.title+" | Nil Beauty");try{this.container.innerHTML='<div class="page-loading">در حال بارگذاری...</div>';const v=await s.component(d);this.container.innerHTML=v,window.scrollTo(0,0),this.reinitWebflow(),window.dispatchEvent(new CustomEvent("pageChanged",{detail:{path:i,params:d}}))}catch(v){console.error("❌ Render failed:",v),this.container.innerHTML=`
        <div style="padding:40px;text-align:center">
          <h2>خطا در بارگذاری صفحه</h2>
          <p>${v.message}</p>
        </div>
      `}}matchRoute(e){for(const i of this.routes){const o=this.matchPath(i.path,e);if(o!==null)return{route:i,params:o}}return null}matchPath(e,i){if(e==="*")return{};const o=e.split("/").filter(Boolean),s=i.split("/").filter(Boolean);if(o.length!==s.length)return null;const d={};for(let v=0;v<o.length;v++){const m=o[v],w=s[v];if(m.startsWith(":"))d[m.slice(1)]=decodeURIComponent(w);else if(m!==w)return null}return d}handlePopState(){this.resolve(window.location.pathname)}handleLinkClick(e){const i=e.target.closest("a");if(!i)return;const o=i.getAttribute("href");o&&(o.startsWith("http")||o.startsWith("//")||o.startsWith("#")||o.startsWith("mailto:")||o.startsWith("tel:")||i.target==="_blank"||(e.preventDefault(),this.navigate(o)))}reinitWebflow(){if(!(typeof window.Webflow>"u"))try{if(window.Webflow.require){const e=window.Webflow.require("ix2");e&&e.init&&e.init()}window.Webflow.destroy(),window.Webflow.ready()}catch(e){console.warn("⚠️ Webflow reinit failed:",e)}}}let W="en",U={};const V=["fa","en"],Y="en",K="nil-beauty-lang";async function ee(t){try{const e=await fetch(`/lang/${t}.json`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return await e.json()}catch(e){return console.error(`❌ Failed to load ${t}.json`,e),{}}}function te(t,e){return e.split(".").reduce((i,o)=>i==null?void 0:i[o],t)}function ae(t){var i,o,s,d;const e=document.documentElement;t==="fa"?(e.setAttribute("dir","rtl"),e.setAttribute("lang","fa"),(i=document.body)==null||i.classList.add("lang-fa"),(o=document.body)==null||o.classList.remove("lang-en")):(e.setAttribute("dir","ltr"),e.setAttribute("lang","en"),(s=document.body)==null||s.classList.add("lang-en"),(d=document.body)==null||d.classList.remove("lang-fa"))}async function Q(t){V.includes(t)||(t=Y),W=t,localStorage.setItem(K,t),U=await ee(t),ae(t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{lang:t}}))}async function ie(){const t=localStorage.getItem(K),e=t&&V.includes(t)?t:Y;await Q(e)}function M(){return W}function a(t){const e=te(U,t);return e!==void 0?e:t}const O={},oe=(O==null?void 0:O.VITE_API_URL)||"/api";async function F(t,e,i=null,o={}){const s=`${oe}${e}`,d={method:t,headers:{Accept:"application/json","Content-Type":"application/json",...o.headers}},v=localStorage.getItem("auth_token");v&&(d.headers.Authorization=`Bearer ${v}`),i&&(d.body=JSON.stringify(i));try{const m=await fetch(s,d);m.status===401&&(localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user"),window.dispatchEvent(new CustomEvent("auth:expired")));const w=await m.json().catch(()=>({}));if(!m.ok)throw new Error(w.message||w.error||`HTTP ${m.status}`);return w}catch(m){throw console.error(`❌ API ${t} ${e}:`,m),m}}const N=(t,e)=>F("GET",t,null,e),C=(t,e,i)=>F("POST",t,e,i),j={registerSendCode:(t,e,i)=>{const o={name:t,phone:e};return i&&i.trim()&&(o.referral_code=i.trim()),C("/v1/auth/register/send-code",o)},registerVerify:(t,e)=>C("/v1/auth/register/verify",{phone:t,code:e}),loginPhoneSendCode:t=>C("/v1/auth/login/phone/send-code",{phone:t}),loginPhoneVerify:(t,e)=>C("/v1/auth/login/phone/verify",{phone:t,code:e}),loginEmail:(t,e)=>C("/v1/auth/login",{email:t,password:e}),forgotSendCode:t=>C("/v1/auth/forgot-password/send-code",{phone:t}),forgotVerify:(t,e)=>C("/v1/auth/forgot-password/verify",{phone:t,code:e}),forgotReset:(t,e,i,o)=>C("/v1/auth/forgot-password/reset",{phone:t,reset_token:e,password:i,password_confirmation:o}),logout:()=>C("/v1/auth/logout",{})},R="auth_token",z="auth_user";let D=null;function ne(){const t=localStorage.getItem(R),e=localStorage.getItem(z);if(t&&e)try{D=JSON.parse(e)}catch{H()}window.addEventListener("auth:expired",()=>{H(),window.dispatchEvent(new CustomEvent("auth:logout"))})}function B(t,e){localStorage.setItem(R,t),localStorage.setItem(z,JSON.stringify(e)),D=e,window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:e}}))}function H(){localStorage.removeItem(R),localStorage.removeItem(z),D=null}async function se(){var t,e;try{await j.logout()}catch(i){console.warn("⚠️ Logout API failed:",i.message)}finally{H(),window.dispatchEvent(new CustomEvent("auth:logout")),(e=(t=window.__app)==null?void 0:t.router)==null||e.navigate("/login")}}function le(){return localStorage.getItem(R)}function J(){return D}function G(){return!!le()}function re(){const t=J(),e=G(),i=window.location.pathname,o=d=>i===d,s=M()==="fa"?"EN":"FA";return`
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
          <span data-lang-current>${s}</span>
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
  `}function X(){const t=document.querySelector("[data-lang-switch]");t&&!t.dataset.initialized&&(t.dataset.initialized="true",t.addEventListener("click",async d=>{var w;d.preventDefault();const v=M(),m=v==="fa"?"en":"fa";console.log("🌐 Language:",v,"→",m),await Q(m),(w=window.__app)!=null&&w.router?window.__app.router.resolve(window.location.pathname):window.location.reload()}));const e=document.querySelector("[data-logout-btn]");e&&!e.dataset.initialized&&(e.dataset.initialized="true",e.addEventListener("click",async d=>{var v,m;if(d.preventDefault(),!!confirm("آیا مطمئنید می‌خواهید خارج شوید؟")){e.disabled=!0;try{await se()}catch(w){console.error("Logout error:",w),localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user"),(m=(v=window.__app)==null?void 0:v.router)==null||m.navigate("/login")}}}));const i=document.querySelector("[data-menu-button]"),o=document.querySelector(".nav-menu");i&&o&&!i.dataset.initialized&&(i.dataset.initialized="true",i.addEventListener("click",()=>{o.classList.toggle("is-open"),i.classList.toggle("is-open")}));const s=document.querySelector("[data-search-form]");s&&!s.dataset.initialized&&(s.dataset.initialized="true",s.addEventListener("submit",d=>{var m,w;d.preventDefault();const v=s.querySelector('input[name="query"]').value;v&&((w=(m=window.__app)==null?void 0:m.router)==null||w.navigate(`/search?q=${encodeURIComponent(v)}`))}))}function ce(){return`
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
             <a href="tel:+982122634768" class="social-link w-inline-block">
    <img src="/img/phone.png" loading="lazy" alt="Phone" />
</a>
              <a href="https://www.instagram.com/" target="_blank" class="social-link w-inline-block">
                <img src="/img/insta.png" loading="lazy" alt="Instagram" />
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
  `}function E(t,e={}){const{navbarClass:i="navbar w-nav",wrapInPageWrap:o=!0}=e;return`
    <div class="page-wrap">
      <div class="${i}" data-animation="default" data-collapse="medium">
        ${re()}
      </div>

      ${t}
    </div>

    <div id="footer">${ce()}</div>
  `}function L(){X()}async function de(){const t=E(`
    <!-- HERO -->
    <div class="hero">
      <section class="hero-section">
        <div class="w-layout-blockcontainer container w-container">
          <div class="hero-wrap">
            <div class="hero-left">
              <div class="hero-avatar"></div>
              <div class="hero-middle">
                <img src="/img/Hero Left.jpg" loading="eager" alt="Hero Left" class="cover-image" />
              </div>
              <p class="line-height-150 capitalize">${a("hero.tagline")}</p>
            </div>
            <div class="hero-right">
              <div class="hero-image">
                <img src="/img/Hero Center.jpg" loading="eager" alt="Hero Center" class="cover-image" />
              </div>
              <div class="hero-content">
                <div class="hero-top">
                  <div class="hero-info">
                    <h2 class="color-white">${a("hero.title")}</h2>
                    <p class="line-height-150">${a("hero.description")}</p>
                  </div>
                  <a href="/login" class="hero-btn w-button">${a("hero.shop_now")}</a>
                </div>
                <div class="hero-img">
                  <img src="/img/Hero Right.jpg" loading="eager" alt="Hero Right" class="cover-image" />
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
                  <img src="/img/skin-care.jpg" loading="eager" alt="${a("categories.skin_care")}" class="cover-image" />
                </a>
              </div>
            </div>
          </div>
          <div class="category-right w-dyn-list">
            <div role="list" class="categories-wrap w-dyn-items">
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/hair-care" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/hair_care.jpg" loading="eager" alt="${a("categories.hair_care")}" class="cover-image" />
                  <div class="category-text">${a("categories.hair_care")}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/makeup" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/makeup.jpg" loading="eager" alt="${a("categories.makeup")}" class="cover-image" />
                  <div class="category-text">${a("categories.makeup")}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/fragrances" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/fragrances.jpg" loading="eager" alt="${a("categories.fragrances")}" class="cover-image" />
                  <div class="category-text">${a("categories.fragrances")}</div>
                </a>
              </div>
              <div role="listitem" class="d-flex w-dyn-item">
                <a href="/category/beauty-tools" class="category-card w-inline-block" data-nav-link>
                  <img src="/img/beauty_tools.jpg" loading="eager" alt="${a("categories.beauty_tools")}" class="cover-image" />
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
            <img src="/img/about-img.jpg" loading="lazy" alt="About" class="cover-image" />
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
            <img src="/img/about-right.jpg" loading="lazy" alt="About Right" class="cover-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORY BLOCKS (بنر بزرگ) -->
    <section class="section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="w-dyn-list">
          <div role="list" class="category-list w-dyn-items">
            <div style="background-image: url('/img/skin_care.jpg');" role="listitem" class="category-block w-dyn-item">
              <a href="/category/skin-care" class="caegory-link w-inline-block" data-nav-link>
                <div class="body-x-small capitalize">Radiant Skin Solutions</div>
                <h2 class="category-title">Shop premium beauty products at beauty bliss by glomin</h2>
                
              </a>
            </div>
            <div style="background-image: url('/img/beauty-tools.jpg');" role="listitem" class="category-block w-dyn-item">
              <a href="/category/beauty-tools" class="caegory-link w-inline-block" data-nav-link>
                <div class="body-x-small capitalize">Free Shipping</div>
                <h2 class="category-title">Elevate your beauty routine every time with our premium products</h2>
                
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
  `);return queueMicrotask(()=>{L(),ue(),ve()}),t}function ue(){const t=document.querySelector("[data-blog-list]");if(!t)return;const e=[{title:"The ultimate guide to glomin's skincare essentials",slug:"skincare-essentials",category:"Skincare",date:"Aug 23, 2024",image:"/img/blog-thumb-02.jpg"},{title:"Essential tools & accessories for professional beauty routine",slug:"beauty-tools",category:"Accessories",date:"Aug 23, 2024",image:"/img/blog-thumb-03.jpg"},{title:"Behind the scenes how we develop our premium beauty products",slug:"behind-the-scenes",category:"Company Insights",date:"Aug 23, 2024",image:"/img/blog-thumb-04.jpg"}];t.innerHTML=e.map(i=>`
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
  `).join("")}function ve(){const t=document.querySelector("[data-gallery]");if(!t)return;const i=`
    <div class="gallery-wrap">
      ${["/img/gallery-1.jpg","/img/gallery-2.jpg","/img/gallery-3.jpg","/img/gallery-4.jpg","/img/gallery-5.jpg"].map((o,s)=>`
        <a href="https://www.instagram.com/" target="_blank" class="gallery-link w-inline-block">
          <img src="${o}" loading="lazy" alt="Gallery ${s+1}" class="cover-image" />
          <div class="gallery-overlay">
            <div class="social-link">
              <img src="/img/ic-insta.svg" loading="lazy" alt="Instagram" />
            </div>
          </div>
        </a>
      `).join("")}
    </div>
  `;t.innerHTML=i.repeat(4)}async function me(){const t=E(`
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
  `);return queueMicrotask(()=>{L(),ge()}),t}function ge(){const t=document.querySelector("[data-faq-list]");if(!t)return;const e=[{q:"What is Glomin's return policy?",a:"We offer a 30-day return policy on all products. If you are not satisfied with your purchase, please contact our customer support team to initiate a return."},{q:"Do you offer free shipping?",a:"Yes, we offer free shipping on all orders over $50. For orders below $50, standard shipping rates apply. Free shipping is available for domestic orders only."},{q:"Where are Glomin products made?",a:"Yes, we offer international shipping to many countries. Shipping rates and delivery times vary based on the destination. Please refer to our shipping policy for more details."},{q:"How do I use Glomin's skincare products?",a:"Each product comes with detailed usage instructions on the packaging. For general guidance, start with cleansing your skin, apply serums or treatments as needed."},{q:"How can I stay updated on new products and promotions?",a:"To stay informed about our latest products, promotions, and exclusive offers, sign up for our newsletter on our website."},{q:"What should I do if I receive a damaged or incorrect item?",a:"If you receive a damaged or incorrect item, please contact our customer support team immediately. Provide your order number and details about the issue."}];t.innerHTML=e.map(i=>`
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
  `).join(""),t.querySelectorAll("[data-faq-toggle]").forEach(i=>{i.addEventListener("click",()=>{const o=i.nextElementSibling,s=o.style.display!=="none";o.style.display=s?"none":"block",i.classList.toggle("active",!s)})})}async function pe(){const t=E(`
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
  `);return queueMicrotask(()=>{L(),he(),ye()}),t}function he(){const t=document.querySelector("[data-feature-blog]");if(!t)return;const e={title:"How to choose perfect fragrance for every occasion",slug:"how-to-choose-perfect-fragrance-for-every-occasion",category:"Fragrances",date:"Aug 23, 2024",excerpt:"Discover Glomin's collection of perfumes and learn how to select the right scent for your style and mood.",image:"/img/blog-main-01.jpg"};t.innerHTML=`
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
  `}function ye(){const t=document.querySelector("[data-blog-list]");if(!t)return;const e=[{title:"The ultimate guide to glomin's skincare essentials",slug:"the-ultimate-guide-to-glomins-skincare-essentials",category:"Skincare",date:"Aug 23, 2024",image:"/img/blog-thumb-02.jpg"},{title:"Essential tools & accessories for professional beauty routine",slug:"essential-tools-accessories-for-professional-beauty-routine",category:"Accessories",date:"Aug 23, 2024",image:"/img/blog-thumb-03.jpg"},{title:"Behind the scenes how we develop our premium beauty products",slug:"behind-the-scenes-how-we-develop-our-premium-beauty-products",category:"Company Insights",date:"Aug 23, 2024",image:"/img/blog-thumb-04.jpg"},{title:"The importance of sun protection in your skincare routine",slug:"the-importance-of-sun-protection-in-your-skincare-routine",category:"Skincare",date:"Aug 23, 2024",image:"/img/blog-thumb-05.jpg"},{title:"Exploring the benefits of serums and how to use them",slug:"exploring-the-benefits-of-serums-and-how-to-use-them",category:"Accessories",date:"Aug 23, 2024",image:"/img/blog-thumb-06.jpg"},{title:"Glomin's favorite beauty hacks you need to know make life easier",slug:"glomins-favorite-beauty-hacks-you-need-to-know-make-life-easier",category:"Beauty Tips",date:"Aug 23, 2024",image:"/img/blog-thumb-07.jpg"}];t.innerHTML=e.map(i=>`
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
  `).join("")}async function fe(t){const{slug:e}=t,i=E(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-card align-center" data-blog-detail>
          <div class="loading-placeholder">${a("common.loading")}</div>
        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{L(),be()}),i}async function be(t){const e=document.querySelector("[data-blog-detail]");if(e)try{const i={title:"Sample Blog Title",category:"Skincare",date:"2024-08-23",content:"<p>Blog content goes here...</p>"};e.innerHTML=`
      <h2>${i.title}</h2>
      <div class="blog-data small">
        <div class="blog-category">${i.category}</div>
        <div class="blog-line"></div>
        <div class="body-small">${i.date}</div>
      </div>
      <div class="blog-details">
        <div class="richtext w-richtext">${i.content}</div>
      </div>
    `}catch{e.innerHTML=`<p>${a("common.error")}</p>`}}async function we(){const t=E(`
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
  `);return queueMicrotask(()=>{L(),ke()}),t}function ke(){const t=document.querySelector("[data-contact-form]"),e=document.querySelector("[data-form-message]");t&&t.addEventListener("submit",async i=>{i.preventDefault();const o=Object.fromEntries(new FormData(t));e&&(e.textContent="⏳ در حال ارسال...",e.style.color="#666",e.style.display="block");try{console.log("📩 Contact form:",o),await new Promise(s=>setTimeout(s,500)),e&&(e.textContent="✅ "+(a("forms.success_message")||"Thank you! Your message has been sent."),e.style.color="green"),t.reset()}catch(s){console.error("❌ Contact error:",s),e&&(e.textContent="❌ "+(s.message||"Error sending message"),e.style.color="red")}})}async function $e(){const t=E(`
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
  `);return queueMicrotask(()=>{L(),Se()}),t}async function Se(){const t=document.querySelector("[data-faq-list]");if(!t)return;const e=[{q:"What is Glomin’s return policy?",a:"We offer a 30-day return policy."},{q:"Do you offer free shipping?",a:"Yes, on orders over $50."}];t.innerHTML=e.map(i=>`
    <div class="faq w-dropdown" data-faq-item>
      <div class="question-block w-dropdown-toggle" data-faq-toggle>
        <p class="body-large color-black">${i.q}</p>
        <div class="faq-icon">+</div>
      </div>
      <nav class="answer-block w-dropdown-list" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${i.a}</p></div>
      </nav>
    </div>
  `).join(""),t.querySelectorAll("[data-faq-toggle]").forEach(i=>{i.addEventListener("click",()=>{const o=i.nextElementSibling,s=o.style.display!=="none";o.style.display=s?"none":"block"})})}async function qe(t={}){if(!G())return setTimeout(()=>{var m,w;return(w=(m=window.__app)==null?void 0:m.router)==null?void 0:w.navigate("/login")},100),E('<div class="loading-placeholder">در حال انتقال...</div>');const e=M()==="fa",i=t.query||{},o=i.service,s=i.date,d=i.time,v=E(`
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
  `);return queueMicrotask(()=>{L(),_e({serviceId:o,date:s,time:d,isFa:e})}),v}function _e({serviceId:t,date:e,time:i,isFa:o}){let s=null;const d=document.querySelector("[data-booking-info]"),v=document.querySelector("[data-total-price]"),m=document.querySelector("[data-total-tax]"),w=document.querySelector("[data-total-final]"),_=document.querySelector("[data-checkout-msg]"),$=document.querySelector("[data-pay-btn]");f();async function f(){try{s={1:{name:o?"میکاپ عروس":"Bridal Makeup",price:5e6},2:{name:o?"رنگ و مش":"Hair Color",price:25e5},3:{name:o?"کراتین مو":"Keratin Treatment",price:35e5},4:{name:o?"پاکسازی پوست":"Facial Cleansing",price:15e5},5:{name:o?"میکاپ ساده":"Simple Makeup",price:12e5},6:{name:o?"میکاپ مجلسی":"Party Makeup",price:2e6}}[t]||{name:"—",price:0},d.innerHTML=`
        <div class="info-row"><span>${o?"خدمت":"Service"}</span><strong>${s.name}</strong></div>
        <div class="info-row"><span>${o?"تاریخ":"Date"}</span><strong>${e||"—"}</strong></div>
        <div class="info-row"><span>${o?"ساعت":"Time"}</span><strong>${i||"—"}</strong></div>
      `;const b=Math.round(s.price*.09);v.textContent=x(s.price),m.textContent=x(b),w.textContent=x(s.price+b)}catch(c){console.error(c),d.innerHTML="<p>خطا در بارگذاری</p>"}}$==null||$.addEventListener("click",async()=>{var g;const c=document.querySelector("[data-checkout-form]");if(!c.checkValidity()){c.reportValidity();return}const b=Object.fromEntries(new FormData(c)),u=((g=document.querySelector('input[name="payment"]:checked'))==null?void 0:g.value)||"online";S($,!0),k(_,o?"در حال پردازش...":"Processing...","info");try{const n={service_id:t,date:e,time:i,name:b.name,phone:b.phone,note:b.note,payment_method:u};console.log("📅 Booking:",n),await new Promise(l=>setTimeout(l,1200)),u==="online"?(k(_,o?"در حال انتقال به درگاه...":"Redirecting to gateway...","success"),setTimeout(()=>{var l,p;return(p=(l=window.__app)==null?void 0:l.router)==null?void 0:p.navigate("/dashboard")},2e3)):(k(_,o?"رزرو با موفقیت ثبت شد!":"Booked successfully!","success"),setTimeout(()=>{var l,p;return(p=(l=window.__app)==null?void 0:l.router)==null?void 0:p.navigate("/dashboard")},2e3))}catch(n){k(_,n.message||(o?"خطا در پرداخت":"Payment error"),"error")}finally{S($,!1)}});function k(c,b,u="info"){c&&(c.textContent=b,c.style.display=b?"block":"none",c.style.color=u==="error"?"#e74c3c":u==="success"?"#27ae60":"#666")}function S(c,b){c&&(c.disabled=b,b?(c.dataset.originalText=c.textContent,c.textContent=o?"لطفاً صبر کنید...":"Please wait..."):c.textContent=c.dataset.originalText||c.textContent)}function x(c){return new Intl.NumberFormat(o?"fa-IR":"en-US").format(c)+(o?" تومان":" IRR")}}async function xe(){console.log("🟢 LoginPage started");const t=E(`
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
  `);return console.log("🟢 HTML generated"),setTimeout(()=>{console.log("🎬 Initializing login listeners...");const e=document.querySelectorAll("[data-tab]"),i=document.querySelector("[data-otp-step]");console.log("Tabs found:",e.length),console.log("OTP step found:",!!i),L(),Ee(),console.log("✅ Login listeners attached")},100),t}function Ee(){console.log("🔧 initLogin started");let t="",e=null;const i=document.querySelector("[data-tabs]"),o=document.querySelector("[data-otp-step]"),s=document.querySelector("[data-main-footer]"),d=document.querySelector("[data-msg]"),v=document.querySelector("[data-phone-display]"),m=document.querySelector("[data-resend-btn]"),w=document.querySelector("[data-timer]"),_=document.querySelector("[data-back-btn]"),$=document.querySelectorAll("[data-tab]");console.log("🔧 Found",$.length,"tabs"),$.forEach(n=>{n.addEventListener("click",l=>{l.preventDefault(),console.log("🖱️ Tab clicked:",n.dataset.tab);const p=n.dataset.tab;document.querySelectorAll("[data-tab]").forEach(h=>h.classList.remove("active")),document.querySelectorAll("[data-tab-content]").forEach(h=>h.style.display="none"),n.classList.add("active");const y=document.querySelector(`[data-tab-content="${p}"]`);y&&(y.style.display="block"),c("")})});const f=document.querySelector("[data-phone-form]");console.log("🔧 Phone form:",!!f),f==null||f.addEventListener("submit",async n=>{n.preventDefault(),console.log("📱 Phone form submitted");const l=Object.fromEntries(new FormData(f)),p=u(l.phone);if(!g(p)){c(a("auth.msg_invalid_phone"),"error");return}t=p;const y=f.querySelector("[data-submit-btn]");b(y,!0);try{const h=await j.loginPhoneSendCode(p);console.log("📱 Send code response:",h),v&&(v.textContent=p),i&&(i.style.display="none"),document.querySelectorAll("[data-tab-content]").forEach(q=>q.style.display="none"),s&&(s.style.display="none"),o&&(o.style.display="block"),x(60),c(""),setTimeout(()=>{var q;return(q=o==null?void 0:o.querySelector('input[name="code"]'))==null?void 0:q.focus()},100)}catch(h){console.error("❌ Send code error:",h),c(h.message||a("auth.msg_error_send"),"error")}finally{b(y,!1)}});const k=document.querySelector("[data-otp-form]");console.log("🔧 OTP form:",!!k),k==null||k.addEventListener("submit",async n=>{var y,h,q;n.preventDefault(),console.log("🔐 OTP form submitted");const l=Object.fromEntries(new FormData(k));if(!l.code||l.code.length<5){c(a("auth.msg_otp_incomplete"),"error");return}const p=k.querySelector("[data-otp-submit]");b(p,!0);try{const r=await j.loginPhoneVerify(t,l.code);console.log("✅ Verify response:",r);const T=(r==null?void 0:r.token)||(r==null?void 0:r.access_token)||((y=r==null?void 0:r.data)==null?void 0:y.token)||((h=r==null?void 0:r.data)==null?void 0:h.access_token),I=(r==null?void 0:r.user)||((q=r==null?void 0:r.data)==null?void 0:q.user)||{phone:t};if(!T)throw new Error(a("auth.msg_error_verify"));B(T,I),c(a("auth.msg_login_success"),"success"),setTimeout(()=>{var A,P;return(P=(A=window.__app)==null?void 0:A.router)==null?void 0:P.navigate("/dashboard")},800)}catch(r){console.error("❌ Verify error:",r),c(r.message||a("auth.msg_error_verify"),"error")}finally{b(p,!1)}});const S=document.querySelector("[data-email-form]");console.log("🔧 Email form:",!!S),S==null||S.addEventListener("submit",async n=>{var y,h,q;n.preventDefault(),console.log("📧 Email form submitted");const l=Object.fromEntries(new FormData(S)),p=S.querySelector("[data-submit-btn]");b(p,!0);try{const r=await j.loginEmail(l.email,l.password);console.log("📧 Email login response:",r);const T=(r==null?void 0:r.token)||(r==null?void 0:r.access_token)||((y=r==null?void 0:r.data)==null?void 0:y.token)||((h=r==null?void 0:r.data)==null?void 0:h.access_token),I=(r==null?void 0:r.user)||((q=r==null?void 0:r.data)==null?void 0:q.user)||{email:l.email};if(!T)throw new Error(a("auth.msg_error_login"));B(T,I),c(a("auth.msg_login_success"),"success"),setTimeout(()=>{var A,P;return(P=(A=window.__app)==null?void 0:A.router)==null?void 0:P.navigate("/dashboard")},800)}catch(r){console.error("❌ Email login error:",r),c(r.message||a("auth.msg_error_login"),"error")}finally{b(p,!1)}}),m==null||m.addEventListener("click",async()=>{if(!m.disabled)try{await j.loginPhoneSendCode(t),c(a("auth.msg_otp_resent"),"success"),x(60)}catch(n){c(n.message,"error")}}),_==null||_.addEventListener("click",()=>{o&&(o.style.display="none"),i&&(i.style.display="flex");const n=document.querySelector('[data-tab-content="phone"]');n&&(n.style.display="block"),s&&(s.style.display="flex"),k&&k.reset(),e&&clearInterval(e),c("")});function x(n){e&&clearInterval(e);let l=n;m&&(m.disabled=!0,m.style.opacity="0.5");const p=()=>{if(l<=0){clearInterval(e),m&&(m.disabled=!1,m.style.opacity="1"),w&&(w.textContent="");return}w&&(w.textContent=`(${l}s)`),l--};p(),e=setInterval(p,1e3)}function c(n,l="info"){d&&(d.textContent=n,d.style.display=n?"block":"none",d.style.color=l==="error"?"#e74c3c":l==="success"?"#27ae60":"#666")}function b(n,l){n&&(n.disabled=l,l?(n.dataset.originalText=n.textContent,n.textContent=a("auth.loading")):n.textContent=n.dataset.originalText||n.textContent)}function u(n){const l="۰۱۲۳۴۵۶۷۸۹",p="٠١٢٣٤٥٦٧٨٩";let y=n.toString();for(let h=0;h<10;h++)y=y.replace(new RegExp(l[h],"g"),h),y=y.replace(new RegExp(p[h],"g"),h);return y.replace(/\D/g,"")}function g(n){return/^09\d{9}$/.test(n)||/^989\d{9}$/.test(n)}console.log("✅ initLogin completed")}async function Le(){console.log("🟢 RegisterPage started");const t=E(`
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
  `);return setTimeout(()=>{L(),Te()},100),t}function Te(){console.log("🔧 initRegister started");let t="",e="",i="",o=null;const s=document.querySelector('[data-step="phone"]'),d=document.querySelector('[data-step="otp"]'),v=document.querySelector("[data-phone-form]"),m=document.querySelector("[data-otp-form]"),w=document.querySelector("[data-phone-display]"),_=document.querySelector("[data-msg]"),$=document.querySelector("[data-resend-btn]"),f=document.querySelector("[data-timer]"),k=document.querySelector("[data-back-btn]"),S=document.querySelector("[data-main-footer]");v==null||v.addEventListener("submit",async n=>{n.preventDefault(),console.log("📝 Register form submitted");const l=Object.fromEntries(new FormData(v)),p=(l.name||"").trim(),y=u(l.phone),h=(l.referral_code||"").trim().toUpperCase();if(!p){c(a("auth.name_required")||"نام را وارد کنید","error");return}if(!g(y)){c(a("auth.msg_invalid_phone"),"error");return}t=y,e=p,i=h;const q=v.querySelector("[data-submit-btn]");b(q,!0);try{const r=await j.registerSendCode(p,y,h);console.log("📱 Register send code response:",r),w&&(w.textContent=y),s&&(s.style.display="none"),d&&(d.style.display="block"),S&&(S.style.display="none"),x(60),c(""),setTimeout(()=>{var T;return(T=d==null?void 0:d.querySelector('input[name="code"]'))==null?void 0:T.focus()},100)}catch(r){console.error("❌ Register send code error:",r),c(r.message||a("auth.msg_error_send"),"error")}finally{b(q,!1)}}),m==null||m.addEventListener("submit",async n=>{var y,h,q;n.preventDefault(),console.log("🔐 Register OTP submitted");const l=Object.fromEntries(new FormData(m));if(!l.code||l.code.length<5){c(a("auth.msg_otp_incomplete"),"error");return}const p=m.querySelector("[data-otp-submit]");b(p,!0);try{const r=await j.registerVerify(t,l.code);console.log("✅ Register verify response:",r);const T=(r==null?void 0:r.token)||(r==null?void 0:r.access_token)||((y=r==null?void 0:r.data)==null?void 0:y.token)||((h=r==null?void 0:r.data)==null?void 0:h.access_token),I=(r==null?void 0:r.user)||((q=r==null?void 0:r.data)==null?void 0:q.user)||{phone:t,name:e};if(!T)throw new Error(a("auth.msg_error_verify"));B(T,I),c(a("auth.msg_register_success"),"success"),setTimeout(()=>{var A,P;return(P=(A=window.__app)==null?void 0:A.router)==null?void 0:P.navigate("/dashboard")},800)}catch(r){console.error("❌ Register verify error:",r),c(r.message||a("auth.msg_error_verify"),"error")}finally{b(p,!1)}}),$==null||$.addEventListener("click",async()=>{if(!$.disabled)try{await j.registerSendCode(e,t,i),c(a("auth.msg_otp_resent"),"success"),x(60)}catch(n){c(n.message,"error")}}),k==null||k.addEventListener("click",()=>{d&&(d.style.display="none"),s&&(s.style.display="block"),S&&(S.style.display="flex"),m&&m.reset(),o&&clearInterval(o),c("")});function x(n){o&&clearInterval(o);let l=n;$&&($.disabled=!0,$.style.opacity="0.5");const p=()=>{if(l<=0){clearInterval(o),$&&($.disabled=!1,$.style.opacity="1"),f&&(f.textContent="");return}f&&(f.textContent=`(${l}s)`),l--};p(),o=setInterval(p,1e3)}function c(n,l="info"){_&&(_.textContent=n,_.style.display=n?"block":"none",_.style.color=l==="error"?"#e74c3c":l==="success"?"#27ae60":"#666")}function b(n,l){n&&(n.disabled=l,l?(n.dataset.originalText=n.textContent,n.textContent=a("auth.loading")):n.textContent=n.dataset.originalText||n.textContent)}function u(n){const l="۰۱۲۳۴۵۶۷۸۹",p="٠١٢٣٤٥٦٧٨٩";let y=n.toString();for(let h=0;h<10;h++)y=y.replace(new RegExp(l[h],"g"),h),y=y.replace(new RegExp(p[h],"g"),h);return y.replace(/\D/g,"")}function g(n){return/^09\d{9}$/.test(n)||/^989\d{9}$/.test(n)}console.log("✅ initRegister completed")}async function Ce(){if(!G())return setTimeout(()=>{var o,s;return(s=(o=window.__app)==null?void 0:o.router)==null?void 0:s.navigate("/login")},100),E('<div class="loading-placeholder">در حال انتقال...</div>');const t=J(),e=M()==="fa",i=E(`
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
  `);return queueMicrotask(()=>{L(),Ae(t,e)}),i}function Ae(t,e){var x,c,b;let i=[],o=null,s=null,d=null,v=1;(x=document.querySelector("[data-logout-btn]"))==null||x.addEventListener("click",()=>{var u,g;localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user"),(g=(u=window.__app)==null?void 0:u.router)==null||g.navigate("/login")}),document.querySelectorAll("[data-dash-tab]").forEach(u=>{u.addEventListener("click",()=>{document.querySelectorAll("[data-dash-tab]").forEach(n=>n.classList.remove("active")),document.querySelectorAll("[data-dash-content]").forEach(n=>n.style.display="none"),u.classList.add("active");const g=document.querySelector(`[data-dash-content="${u.dataset.dashTab}"]`);g&&(g.style.display="block")})}),m(),w();async function m(){const u=document.querySelector("[data-services-grid]");if(u)try{i=[{id:1,name:e?"میکاپ عروس":"Bridal Makeup",description:e?"میکاپ حرفه‌ای عروس":"Professional bridal makeup",price:5e6,duration:120,image:"/img/service-1.jpg"},{id:2,name:e?"رنگ و مش":"Hair Color",description:e?"رنگ و مش مو":"Hair coloring & highlights",price:25e5,duration:90,image:"/img/service-2.jpg"},{id:3,name:e?"کراتین مو":"Keratin Treatment",description:e?"صافی و درخشندگی مو":"Hair smoothing & shine",price:35e5,duration:150,image:"/img/service-3.jpg"},{id:4,name:e?"پاکسازی پوست":"Facial Cleansing",description:e?"پاکسازی و آبرسانی پوست":"Deep skin cleansing",price:15e5,duration:60,image:"/img/service-4.jpg"},{id:5,name:e?"میکاپ ساده":"Simple Makeup",description:e?"میکاپ روزانه":"Daily makeup",price:12e5,duration:45,image:"/img/service-5.jpg"},{id:6,name:e?"میکاپ مجلسی":"Party Makeup",description:e?"میکاپ مجلسی":"Evening party makeup",price:2e6,duration:60,image:"/img/service-6.jpg"}],u.innerHTML=i.map(g=>`
        <div class="service-card" data-service-id="${g.id}">
          <div class="service-img">
            <img src="${g.image}" loading="lazy" alt="${g.name}" class="cover-image" />
          </div>
          <div class="service-content">
            <h3 class="service-name">${g.name}</h3>
            <p class="service-desc">${g.description}</p>
            <div class="service-meta">
              <span class="service-price">${S(g.price)}</span>
              <span class="service-duration">${g.duration} ${e?"دقیقه":"min"}</span>
            </div>
            <button class="primary-button w-button" data-book-service="${g.id}">
              ${e?"رزرو":"Book"}
            </button>
          </div>
        </div>
      `).join(""),u.querySelectorAll("[data-book-service]").forEach(g=>{g.addEventListener("click",n=>{n.stopPropagation();const l=Number(g.dataset.bookService),p=i.find(y=>y.id===l);p&&_(p)})})}catch(g){console.error("❌ Services load error:",g),u.innerHTML=`<p>${e?"خطا در بارگذاری":"Failed to load"}</p>`}}async function w(){var g;const u=document.querySelector("[data-appointments-list]");if(u)try{const n=[];if(n.length===0){u.innerHTML=`
          <div class="empty-state">
            <p>${e?"هنوز نوبتی رزرو نکرده‌اید":"No appointments yet"}</p>
            <button class="primary-button w-button" data-goto-services>
              ${e?"رزرو اولین نوبت":"Book your first appointment"}
            </button>
          </div>
        `,(g=u.querySelector("[data-goto-services]"))==null||g.addEventListener("click",()=>{document.querySelector('[data-dash-tab="services"]').click()});return}u.innerHTML=n.map(l=>`
        <div class="appointment-card">
          <div class="appointment-info">
            <h3>${l.service}</h3>
            <div class="appointment-meta">
              <span>📅 ${l.date}</span>
              <span>🕐 ${l.time}</span>
            </div>
          </div>
          <div class="appointment-status status-${l.status}">${l.status}</div>
        </div>
      `).join("")}catch(n){console.error("❌ Appointments load error:",n)}}function _(u){o=u,s=null,d=null,v=1;const g=document.querySelector("[data-booking-modal]"),n=g.querySelector("[data-modal-title]"),l=g.querySelector("[data-modal-subtitle]");n.textContent=u.name,l.textContent=u.description,g.querySelector('[data-step="date"]').style.display="block",g.querySelector('[data-step="time"]').style.display="none",g.querySelector("[data-booking-summary]").style.display="none",g.querySelector("[data-booking-prev]").style.display="none",g.querySelector("[data-booking-next]").textContent=e?"ادامه":"Continue",g.querySelector("[data-booking-next]").disabled=!0,$(),g.style.display="flex",document.body.style.overflow="hidden"}function $(){const u=document.querySelector("[data-date-picker]");if(!u)return;const g=[],n=new Date;for(let l=0;l<14;l++){const p=new Date(n);p.setDate(n.getDate()+l),g.push(p)}u.innerHTML=g.map(l=>{const p=l.toISOString().split("T")[0],y=l.toLocaleDateString(e?"fa-IR":"en-US",{weekday:"short"}),h=l.getDate(),q=l.toLocaleDateString(e?"fa-IR":"en-US",{month:"short"});return`
        <button class="date-item" data-date="${p}">
          <span class="date-day">${y}</span>
          <span class="date-num">${h}</span>
          <span class="date-month">${q}</span>
        </button>
      `}).join(""),u.querySelectorAll("[data-date]").forEach(l=>{l.addEventListener("click",()=>{u.querySelectorAll(".date-item").forEach(p=>p.classList.remove("active")),l.classList.add("active"),s=l.dataset.date,k()})})}function f(){const u=document.querySelector("[data-time-picker]");if(!u)return;const g=[];for(let n=9;n<=20;n++)g.push(`${String(n).padStart(2,"0")}:00`),n<20&&g.push(`${String(n).padStart(2,"0")}:30`);u.innerHTML=g.map(n=>`
      <button class="time-item" data-time="${n}">${n}</button>
    `).join(""),u.querySelectorAll("[data-time]").forEach(n=>{n.addEventListener("click",()=>{u.querySelectorAll(".time-item").forEach(l=>l.classList.remove("active")),n.classList.add("active"),d=n.dataset.time,k()})})}(c=document.querySelector("[data-booking-next]"))==null||c.addEventListener("click",()=>{var u,g;if(v===1&&s)v=2,document.querySelector('[data-step="date"]').style.display="none",document.querySelector('[data-step="time"]').style.display="block",document.querySelector("[data-booking-prev]").style.display="block",f(),k();else if(v===2&&d)v=3,document.querySelector('[data-step="time"]').style.display="none",document.querySelector("[data-booking-summary]").style.display="block",document.querySelector("[data-booking-next]").textContent=e?"پرداخت":"Proceed to Payment",document.querySelector("[data-summary-service]").textContent=o.name,document.querySelector("[data-summary-date]").textContent=s,document.querySelector("[data-summary-time]").textContent=d,document.querySelector("[data-summary-price]").textContent=S(o.price);else if(v===3){const n=new URLSearchParams({service:o.id,date:s,time:d});(g=(u=window.__app)==null?void 0:u.router)==null||g.navigate(`/checkout?${n.toString()}`)}}),(b=document.querySelector("[data-booking-prev]"))==null||b.addEventListener("click",()=>{v===2?(v=1,document.querySelector('[data-step="time"]').style.display="none",document.querySelector('[data-step="date"]').style.display="block",document.querySelector("[data-booking-prev]").style.display="none",k()):v===3&&(v=2,document.querySelector("[data-booking-summary]").style.display="none",document.querySelector('[data-step="time"]').style.display="block",document.querySelector("[data-booking-next]").textContent=e?"ادامه":"Continue",k())}),document.querySelectorAll("[data-modal-close]").forEach(u=>{u.addEventListener("click",()=>{document.querySelector("[data-booking-modal]").style.display="none",document.body.style.overflow=""})});function k(){const u=document.querySelector("[data-booking-next]");u&&(v===1?u.disabled=!s:v===2?u.disabled=!d:u.disabled=!1)}function S(u){return new Intl.NumberFormat(e?"fa-IR":"en-US").format(u)+(e?" تومان":" IRR")}}const Pe="https://demo2.mazoryagroup.ir/storage";async function je(){const t=M()==="fa",e=E(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${t?"نمونه کارها":"PORTFOLIO"}</div>
          <h1>${t?"گالری":"Gallery"}</h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="w-layout-blockcontainer container w-container">

        <!-- فیلتر دسته‌بندی -->
        <div class="gallery-filters" data-gallery-filters>
          <div class="loading-placeholder">${a("common.loading")}</div>
        </div>

        <!-- گرید گالری -->
        <div class="gallery-grid" data-gallery-grid>
          <div class="loading-placeholder">${a("common.loading")}</div>
        </div>

      </div>
    </section>

    <!-- Lightbox -->
    <div class="gallery-lightbox" data-lightbox style="display:none">
      <div class="gallery-lightbox-backdrop" data-lightbox-close></div>
      <button class="gallery-lightbox-close" data-lightbox-close>✕</button>
      <img src="" alt="" class="gallery-lightbox-img" data-lightbox-img />
    </div>
  `);return setTimeout(()=>{L(),Ie(t)},100),e}function Ie(t){let e=null;const i=document.querySelector("[data-gallery-filters]"),o=document.querySelector("[data-gallery-grid]"),s=document.querySelector("[data-lightbox]"),d=document.querySelector("[data-lightbox-img]");v(),m(null);async function v(){try{const f=await N("/v1/gallery/categories");console.log("📁 Categories response:",f);const k=f.data||[],S=`
        <button class="gallery-filter-btn active" data-category="all">
          ${t?"همه":"All"}
        </button>
      `,x=k.map(c=>`
        <button class="gallery-filter-btn" data-category="${c.id}">
          ${c.name}
        </button>
      `).join("");i.innerHTML=S+x,i.querySelectorAll("[data-category]").forEach(c=>{c.addEventListener("click",()=>{i.querySelectorAll(".gallery-filter-btn").forEach(u=>u.classList.remove("active")),c.classList.add("active");const b=c.dataset.category;e=b==="all"?null:b,m(e)})})}catch(f){console.error("❌ Categories error:",f),i.innerHTML=`<p>${t?"خطا در بارگذاری دسته‌ها":"Failed to load categories"}</p>`}}async function m(f){o.innerHTML=`<div class="loading-placeholder">${a("common.loading")}</div>`;try{const k=f?`/v1/gallery?category_id=${f}`:"/v1/gallery",S=await N(k);console.log("🖼️ Gallery response:",S);const x=S.data||[];if(x.length===0){o.innerHTML=`
          <div class="gallery-empty">
            <p>${t?"تصویری در این دسته وجود ندارد":"No images in this category"}</p>
          </div>
        `;return}o.innerHTML=x.map(c=>{var u;const b=w(c.image);return`
          <div class="gallery-item" data-image="${b}" data-title="${c.title||""}">
            <div class="gallery-item-img">
              <img src="${b}" loading="lazy" alt="${c.title||""}" />
            </div>
            <div class="gallery-item-info">
              <h3 class="gallery-item-title">${c.title||""}</h3>
              <div class="gallery-item-category">${((u=c.category)==null?void 0:u.name)||""}</div>
            </div>
          </div>
        `}).join(""),o.querySelectorAll(".gallery-item").forEach(c=>{c.addEventListener("click",()=>{_(c.dataset.image,c.dataset.title)})})}catch(k){console.error("❌ Gallery error:",k),o.innerHTML=`<p>${t?"خطا در بارگذاری گالری":"Failed to load gallery"}</p>`}}function w(f){return f?f.startsWith("http")?f:`${Pe}/${f}`:""}function _(f,k){!s||!d||(d.src=f,d.alt=k||"",s.style.display="flex",document.body.style.overflow="hidden")}function $(){s&&(s.style.display="none",d.src="",document.body.style.overflow="")}document.querySelectorAll("[data-lightbox-close]").forEach(f=>{f.addEventListener("click",$)}),document.addEventListener("keydown",f=>{f.key==="Escape"&&s&&s.style.display==="flex"&&$()})}async function Me(){const t=E(`
    <div class="section" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center">
      <div>
        <h1 style="font-size:6rem;margin:0">404</h1>
        <h2>${a("not_found.title")}</h2>
        <p>${a("not_found.description")}</p>
        <a href="/" class="primary-button w-button" data-nav-link>${a("not_found.back_home")}</a>
      </div>
    </div>
  `);return queueMicrotask(()=>L()),t}window.addEventListener("error",t=>console.error("🚨",t.error||t.message));window.addEventListener("unhandledrejection",t=>console.error("🚨",t.reason));const Re=[{path:"/",component:de,title:"Nil Beauty"},{path:"/about",component:me,title:"درباره ما"},{path:"/gallery",component:je,title:"گالری"},{path:"/blog",component:pe,title:"بلاگ"},{path:"/blog/:slug",component:fe,title:"مقاله"},{path:"/contact",component:we,title:"تماس"},{path:"/faq",component:$e,title:"سوالات"},{path:"/checkout",component:qe,title:"پرداخت"},{path:"/login",component:xe,title:"ورود"},{path:"/register",component:Le,title:"ثبت‌نام"},{path:"/dashboard",component:Ce,title:"داشبورد"},{path:"*",component:Me,title:"404"}];async function De(){console.log("🚀 Bootstrap started");try{if(await ie(),ne(),!document.querySelector("#app"))throw new Error("#app not found");const e=new Z(Re,"#app");e.start(),window.__app={router:e},window.addEventListener("pageChanged",()=>{setTimeout(()=>X(),50)}),console.log("🎉 Nil Beauty initialized")}catch(t){console.error("❌ Bootstrap failed:",t);const e=document.getElementById("app");e&&(e.innerHTML=`<div style="padding:40px;color:red"><h2>خطا</h2><pre>${t.message}</pre></div>`)}}De();
