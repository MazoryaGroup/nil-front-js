(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();class ze{constructor(e,a="#app"){this.routes=e,this.container=document.querySelector(a),this.currentPath=null,this.handlePopState=this.handlePopState.bind(this),this.handleLinkClick=this.handleLinkClick.bind(this)}start(){window.addEventListener("popstate",this.handlePopState),document.addEventListener("click",this.handleLinkClick),this.handlePopState()}stop(){window.removeEventListener("popstate",this.handlePopState),document.removeEventListener("click",this.handleLinkClick)}navigate(e,a=!0){a&&window.history.pushState({},"",e),this.resolve(e)}async resolve(e){const a=e.split("?")[0];this.currentPath=a;const n=this.matchRoute(a);if(!n){console.warn("⚠️ No route matched:",a);return}const{route:i,params:o}=n;i.title&&(document.title=i.title+" | Nil Beauty");try{this.container.innerHTML='<div class="page-loading">در حال بارگذاری...</div>';const s=await i.component(o);this.container.innerHTML=s,window.scrollTo(0,0),this.reinitWebflow(),window.dispatchEvent(new CustomEvent("pageChanged",{detail:{path:a,params:o}}))}catch(s){console.error("❌ Render failed:",s),this.container.innerHTML=`
        <div style="padding:40px;text-align:center">
          <h2>خطا در بارگذاری صفحه</h2>
          <p>${s.message}</p>
        </div>
      `}}matchRoute(e){for(const a of this.routes){const n=this.matchPath(a.path,e);if(n!==null)return{route:a,params:n}}return null}matchPath(e,a){if(e==="*")return{};const n=e.split("/").filter(Boolean),i=a.split("/").filter(Boolean);if(n.length!==i.length)return null;const o={};for(let s=0;s<n.length;s++){const d=n[s],r=i[s];if(d.startsWith(":"))o[d.slice(1)]=decodeURIComponent(r);else if(d!==r)return null}return o}handlePopState(){this.resolve(window.location.pathname)}handleLinkClick(e){const a=e.target.closest("a");if(!a)return;const n=a.getAttribute("href");n&&(n.startsWith("http")||n.startsWith("//")||n.startsWith("#")||n.startsWith("mailto:")||n.startsWith("tel:")||a.target==="_blank"||(e.preventDefault(),this.navigate(n)))}reinitWebflow(){if(!(typeof window.Webflow>"u"))try{if(window.Webflow.require){const e=window.Webflow.require("ix2");e&&e.init&&e.init()}window.Webflow.destroy(),window.Webflow.ready()}catch(e){console.warn("⚠️ Webflow reinit failed:",e)}}}let ye="en",Mt={};const be=["fa","en"],we="en";async function We(t){try{const e=await fetch(`/lang/${t}.json`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return await e.json()}catch(e){return console.error(`❌ Failed to load ${t}.json`,e),{}}}function Ye(t,e){if(!(!t||!e))return e.split(".").reduce((a,n)=>a==null?void 0:a[n],t)}function Fe(t){var a,n,i,o;const e=document.documentElement;t==="fa"?(e.setAttribute("dir","rtl"),e.setAttribute("lang","fa"),(a=document.body)==null||a.classList.add("lang-fa"),(n=document.body)==null||n.classList.remove("lang-en")):(e.setAttribute("dir","ltr"),e.setAttribute("lang","en"),(i=document.body)==null||i.classList.add("lang-en"),(o=document.body)==null||o.classList.remove("lang-fa"))}async function Vt(t){be.includes(t)||(t=we),ye=t,Mt=await We(t),Fe(t),je(),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{lang:t,translations:Mt}}))}async function $e(){await Vt(we)}function Z(){return ye}function u(t,e={}){const a=Ye(Mt,t);return a==null?t:String(a).replace(/\{(\w+)\}/g,(n,i)=>e[i]!==void 0?e[i]:`{${i}}`)}function je(t=document){t.querySelectorAll("[data-i18n]").forEach(e=>{const a=e.getAttribute("data-i18n");a&&(e.textContent=u(a))}),t.querySelectorAll("[data-i18n-html]").forEach(e=>{const a=e.getAttribute("data-i18n-html");a&&(e.innerHTML=u(a))}),t.querySelectorAll("[data-i18n-placeholder]").forEach(e=>{const a=e.getAttribute("data-i18n-placeholder");a&&e.setAttribute("placeholder",u(a))}),t.querySelectorAll("[data-i18n-title]").forEach(e=>{const a=e.getAttribute("data-i18n-title");a&&e.setAttribute("title",u(a))}),t.querySelectorAll("[data-i18n-aria]").forEach(e=>{const a=e.getAttribute("data-i18n-aria");a&&e.setAttribute("aria-label",u(a))})}function Ge(t=document){t.querySelectorAll("[data-lang]").forEach(e=>{e.dataset.langBound!=="1"&&(e.dataset.langBound="1",e.addEventListener("click",a=>{a.preventDefault();const n=e.getAttribute("data-lang");n&&be.includes(n)&&Vt(n)}))})}if(typeof window<"u"){const t=async()=>{await $e(),Ge()};document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t,{once:!0}):t()}const Ve="http://127.0.0.1:8000/api",Dt="auth_token",Ke="auth_user",Rt="auth_login_time",Qe=10*60*1e3;function Ot(){return localStorage.getItem(Dt)}function ke(){const t=Number(localStorage.getItem(Rt));if(!Number.isFinite(t)||t<=0)return!0;const e=Date.now()-t;return e<0||e>=Qe}function Ut(){const t=!!localStorage.getItem(Dt)||!!localStorage.getItem(Rt);localStorage.removeItem(Dt),localStorage.removeItem(Ke),localStorage.removeItem(Rt),t&&window.dispatchEvent(new CustomEvent("auth:expired"))}function Je(){const t=Ot();return t?ke()?(Ut(),null):t:null}function Ze(t={}){const e=new URLSearchParams;return Object.entries(t).forEach(([a,n])=>{if(!(n==null||n==="")){if(Array.isArray(n)){n.forEach(i=>{i!=null&&e.append(`${a}[]`,String(i))});return}e.append(a,String(n))}}),e.toString()}function st(t,e={}){const a=Ze(e);return a?`${t}${t.includes("?")?"&":"?"}${a}`:t}function Xe(t){const e=t==null?void 0:t.errors;if(!e||typeof e!="object")return null;const a=Object.values(e).flat().filter(n=>typeof n=="string");return a.length?a.join(`
`):null}function ta(t,e){const a=Xe(e)||(e==null?void 0:e.message)||(typeof(e==null?void 0:e.error)=="string"?e.error:null)||`HTTP ${t.status}`,n=new Error(a);return n.name="ApiError",n.status=t.status,n.statusCode=(e==null?void 0:e.statusCode)||t.status,n.errors=(e==null?void 0:e.errors)||null,n.response=e,n}function ea(){const t=new Error("Session expired. Please login again.");return t.name="SessionExpiredError",t.status=401,t.statusCode=401,t}function aa(t){const e=String(t).split("?")[0];return["/v1/auth/register/send-code","/v1/auth/register/verify","/v1/auth/login","/v1/auth/login/phone/send-code","/v1/auth/login/phone/verify","/v1/auth/forgot-password/send-code","/v1/auth/forgot-password/verify","/v1/auth/forgot-password/reset"].includes(e)}async function Kt(t,e,a=null,n={}){const i=`${Ve}${e}`,o=aa(e),s=!!Ot();if(!o&&s&&ke())throw Ut(),ea();const d={Accept:"application/json",...n.headers},r=o?null:Je();r&&!d.Authorization&&(d.Authorization=`Bearer ${r}`);const l={method:t.toUpperCase(),...n,headers:d};a!=null&&!["GET","HEAD"].includes(l.method)&&(a instanceof FormData?(l.body=a,delete l.headers["Content-Type"],delete l.headers["content-type"]):(l.headers["Content-Type"]=l.headers["Content-Type"]||"application/json",l.body=JSON.stringify(a)));try{const v=await fetch(i,l),N=v.headers.get("content-type")||"";let f={};if(v.status!==204&&(N.includes("application/json")?f=await v.json().catch(()=>({})):f=await v.text().catch(()=>"")?{message:v.ok?"":`HTTP ${v.status}`}:{}),v.status===401&&r&&Ot()===r&&Ut(),!v.ok)throw ta(v,f);if(f&&typeof f=="object"&&(f.success===!1||f.is_status===!1)){const $=new Error(f.message||"API request failed.");throw $.name="ApiError",$.status=f.statusCode||v.status,$.response=f,$}return f}catch(v){throw console.error(`[NIL API] ${t.toUpperCase()} ${e}`,{message:v.message,status:v.status||null,errors:v.errors||null}),v}}const Q=(t,e={})=>Kt("GET",t,null,e),F=(t,e={},a={})=>Kt("POST",t,e,a),Se=(t,e={},a={})=>Kt("PUT",t,e,a),tt={registerSendCode:(t,e,a=null)=>{const n={name:t,phone:e};return typeof a=="string"&&a.trim()&&(n.referral_code=a.trim()),F("/v1/auth/register/send-code",n)},registerVerify:(t,e)=>F("/v1/auth/register/verify",{phone:t,code:e}),loginPhoneSendCode:t=>F("/v1/auth/login/phone/send-code",{phone:t}),loginPhoneVerify:(t,e)=>F("/v1/auth/login/phone/verify",{phone:t,code:e}),loginEmail:(t,e)=>F("/v1/auth/login",{email:t,password:e}),forgotSendCode:t=>F("/v1/auth/forgot-password/send-code",{phone:t}),forgotVerify:(t,e)=>F("/v1/auth/forgot-password/verify",{phone:t,code:e}),forgotReset:(t,e,a,n)=>F("/v1/auth/forgot-password/reset",{phone:t,reset_token:e,password:a,password_confirmation:n}),logout:()=>F("/v1/auth/logout",{})},ne={get:()=>Q("/v1/auth/profile"),update:t=>Se("/v1/auth/profile",t),changePhoneSendCode:t=>F("/v1/auth/profile/change-phone/send-code",{phone:t}),changePhoneVerify:(t,e)=>F("/v1/auth/profile/change-phone/verify",{phone:t,code:e})},ht={list:(t={})=>Q(st("/v1/bookings",t)),get:t=>Q(`/v1/bookings/${encodeURIComponent(t)}`),create:t=>F("/v1/bookings",t),cancel:(t,e=null)=>{const a={};return e&&(a.cancellation_reason=e),F(`/v1/bookings/${encodeURIComponent(t)}/cancel`,a)},reschedule:(t,e)=>Se(`/v1/bookings/${encodeURIComponent(t)}/reschedule`,e),validateDiscount:(t,e)=>F("/v1/discount-codes/validate",{booking_id:Number(t),code:String(e).trim()}),applyDiscount:(t,e)=>F(`/v1/bookings/${encodeURIComponent(t)}/apply-discount`,e)},na={list:(t={})=>Q(st("/v1/services",t)),get:t=>Q(`/v1/services/${encodeURIComponent(t)}`)},ia={check:(t=null,e,a,n=30)=>{const i={service_id:e,date:a,interval:n};return t!=null&&t!==""&&(i.staff_id=t),Q(st("/v1/availability",i))},checkGeneral:(t,e,a=30)=>Q(st("/v1/availability",{service_id:t,date:e,interval:a})),checkStaff:(t,e,a,n=30)=>Q(st("/v1/availability",{staff_id:t,service_id:e,date:a,interval:n}))},oa={deposit:(t,e={})=>F(`/v1/payments/bookings/${encodeURIComponent(t)}/deposit`,e),start:(t,e={})=>F(`/v1/payments/bookings/${encodeURIComponent(t)}/start`,e)},sa={send:t=>F("/messages",t)},_e={subscribe:t=>F("/waiting-list",{email:t})},Ht={list:(t=null)=>Q(st("/v1/gallery",{category_id:t})),categories:()=>Q("/v1/gallery/categories"),get:t=>Q(`/v1/gallery/${encodeURIComponent(t)}`)},Qt={list:(t={})=>Q(st("/v1/blogs",t)),get:(t,e=null)=>Q(st(`/v1/blogs/${encodeURIComponent(t)}`,{lang:e}))},ot="auth_token",xt="auth_user",wt="auth_login_time",Ee=10*60*1e3;let ct=null,Lt=null,ie=!1,Pt=!1;function Le(){const t=localStorage.getItem(wt);if(!t)return null;const e=Number(t);return!Number.isFinite(e)||e<=0?null:e}function oe(){const t=Le();return t?Math.max(0,Ee-(Date.now()-t)):0}function Jt(){Lt!==null&&(clearTimeout(Lt),Lt=null)}function Ct(){Jt(),localStorage.removeItem(ot),localStorage.removeItem(xt),localStorage.removeItem(wt),ct=null}function Zt(){var t,e;window.location.pathname!=="/login"&&((e=(t=window.__app)==null?void 0:t.router)!=null&&e.navigate?window.__app.router.navigate("/login"):window.location.replace("/login"))}function dt(){const t=!!localStorage.getItem(ot)||!!localStorage.getItem(wt);Ct(),t&&window.dispatchEvent(new CustomEvent("auth:logout",{detail:{reason:"session_expired"}})),Zt()}function yt(){Jt();const t=oe();if(t<=0){dt();return}Lt=setTimeout(()=>{oe()<=0?dt():yt()},t)}function bt(){if(!localStorage.getItem(ot))return!1;const e=Le();return!e||e>Date.now()||Date.now()-e>=Ee?(dt(),!1):!0}function ra(){if(ie)return;ie=!0;const t=localStorage.getItem(ot),e=localStorage.getItem(xt);if(t){if(!bt())return;if(e)try{ct=JSON.parse(e)}catch{dt();return}yt()}else Ct();window.addEventListener("auth:expired",()=>{dt()}),document.addEventListener("visibilitychange",()=>{!document.hidden&&localStorage.getItem(ot)&&bt()&&yt()}),window.addEventListener("storage",a=>{(a.key===ot||a.key===wt)&&(localStorage.getItem(ot)?bt()&&yt():(Ct(),window.dispatchEvent(new CustomEvent("auth:logout")),Zt()))})}function zt(t,e){Jt();const a=Date.now();localStorage.setItem(ot,t),localStorage.setItem(xt,JSON.stringify(e)),localStorage.setItem(wt,String(a)),ct=e,yt(),window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:e}}))}async function la(){if(!Pt){Pt=!0,console.log("🚪 Logging out...");try{await tt.logout(),console.log("✅ Logout API success")}catch(t){console.warn("⚠️ Logout API failed:",t.message)}finally{Ct(),window.dispatchEvent(new CustomEvent("auth:logout")),Zt(),Pt=!1}}}function Te(){if(!bt())return null;if(ct)return ct;const t=localStorage.getItem(xt);if(!t)return null;try{return ct=JSON.parse(t),ct}catch{return dt(),null}}function Xt(){return bt()}function se(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function re(t){const e=window.location.pathname;return t==="/"?e==="/":e===t||e.startsWith(t+"/")}function ca(){const t=Te(),e=Xt(),a=Z()==="fa",n=a?"EN":"FA",i=se((t==null?void 0:t.name)||(t==null?void 0:t.phone)||(a?"حساب کاربری":"My account")),o=[{path:"/",label:u("nav.home")},{path:"/about",label:u("nav.about")},{path:"/blog",label:u("nav.blogs")},{path:"/contact",label:u("nav.contact")}];return e&&o.push({path:"/dashboard",label:u("nav.dashboard")||(a?"داشبورد":"Dashboard")}),`
    <div class="container w-container">
      <div class="nav-wrapper">
<!-- BRAND -->
<a
  href="/"
  class="brand w-nav-brand"
  data-nav-link
  aria-label="NIL Beauty"
>
  <img
    src="/img/logo.png"
    alt="NIL Beauty"
    class="nil-brand-logo"
    width="110"
    height="55"
  />
</a>

        <!-- NAVIGATION -->
        <nav
          role="navigation"
          class="nav-menu w-nav-menu"
          id="nil-mobile-navigation"
          data-nav-menu
          aria-label="${a?"منوی اصلی":"Main navigation"}"
        >
          <div class="nav-inner">

            ${o.map(s=>`
              <a
                href="${s.path}"
                class="nav-link w-inline-block ${re(s.path)?"w--current":""}"
                data-nav-link
                ${re(s.path)?'aria-current="page"':""}
              >
                <div class="nav-link-inner">
                  ${se(s.label)}
                </div>

                <div class="bottom-underline"></div>
              </a>
            `).join("")}

          </div>
        </nav>

        <!-- LANGUAGE SWITCH -->
        <button
          type="button"
          class="lang-switch"
          data-lang-switch
          aria-label="${a?"تغییر زبان به انگلیسی":"Switch to Persian"}"
          title="${a?"English":"فارسی"}"
        >
          <span data-lang-current>
            ${n}
          </span>
        </button>

        <!-- USER -->
        ${e?`
          <a
            href="/dashboard"
            class="user-link w-inline-block"
            data-nav-link
            title="${i}"
            aria-label="${i}"
          >
            <img
              src="/img/users-icon-dark.svg"
              loading="lazy"
              alt=""
            />
          </a>
        `:`
          <a
            href="/login"
            class="user-link w-inline-block"
            data-nav-link
            title="${a?"ورود / ثبت‌نام":"Login / Register"}"
            aria-label="${a?"ورود / ثبت‌نام":"Login / Register"}"
          >
            <img
              src="/img/users-icon-dark.svg"
              loading="lazy"
              alt=""
            />
          </a>
        `}

        <!-- MOBILE MENU -->
        <button
          type="button"
          class="menu-button w-nav-button"
          data-menu-button
          aria-label="${a?"باز کردن منو":"Open menu"}"
          aria-controls="nil-mobile-navigation"
          aria-expanded="false"
        >
          <div class="nav-top-line"></div>
          <div class="nav-middle-line"></div>
          <div class="nav-bottom-line"></div>
        </button>

      </div>
    </div>
  `}function Ce(){const t=document.querySelector("[data-lang-switch]"),e=document.querySelector("[data-menu-button]"),a=document.querySelector("[data-nav-menu]");if(t&&!t.dataset.initialized&&(t.dataset.initialized="true",t.addEventListener("click",async i=>{var d;if(i.preventDefault(),t.disabled)return;t.disabled=!0;const s=Z()==="fa"?"en":"fa";try{await Vt(s),(d=window.__app)!=null&&d.router?await window.__app.router.resolve(window.location.pathname):window.location.reload()}catch(r){console.error("❌ Language switch error:",r)}finally{t.isConnected&&(t.disabled=!1)}})),e&&a&&!e.dataset.initialized){let i=function(o){a.classList.toggle("is-open",o),e.classList.toggle("is-open",o),e.setAttribute("aria-expanded",String(o))};var n=i;e.dataset.initialized="true",e.addEventListener("click",()=>{const o=a.classList.contains("is-open");i(!o)}),a.addEventListener("click",o=>{o.target.closest("a[data-nav-link]")&&i(!1)}),e.addEventListener("keydown",o=>{o.key==="Escape"&&i(!1)}),a.addEventListener("keydown",o=>{o.key==="Escape"&&(i(!1),e.focus())})}}function da(){const t=Z()==="fa",e=new Date().getFullYear(),a=[{href:"/",label:u("nav.home")},{href:"/about",label:u("nav.about")},{href:"/blog",label:u("nav.blogs")},{href:"/contact",label:u("nav.contact")},{href:"/faq",label:"FAQ"}];return`
    <footer class="nil-footer" dir="${t?"rtl":"ltr"}">
      <div class="nil-footer-container">

        <!-- Brand -->
        <div class="nil-footer-brand">
          <a
            href="/"
            class="nil-footer-logo"
            data-nav-link
            aria-label="NIL Beauty"
          >
            <img
              src="/img/logo.png"
              alt="NIL Beauty"
              loading="lazy"
            />
          </a>

          <p class="nil-footer-description">
            ${t?"زیبایی، در ساده‌ترین شکل خود.":"Beauty in its purest form."}
          </p>
        </div>

        <!-- Navigation -->
        <nav
          class="nil-footer-navigation"
          aria-label="${t?"لینک‌های فوتر":"Footer navigation"}"
        >
          ${a.map(n=>`
            <a href="${n.href}" data-nav-link>
              ${n.label}
            </a>
          `).join("")}
        </nav>

        <!-- Social -->
        <div class="nil-footer-social">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src="/img/insta.png"
              alt=""
              loading="lazy"
            />
          </a>

          <a
            href="https://www.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <img
              src="/img/whatsapp.png"
              alt=""
              loading="lazy"
            />
          </a>

          <a
            href="tel:+982122634768"
            aria-label="${t?"تماس تلفنی":"Call us"}"
          >
            <img
              src="/img/phone.png"
              alt=""
              loading="lazy"
            />
          </a>
        </div>

        <!-- Bottom -->
        <div class="nil-footer-bottom">
          <span>
            © ${e} NIL BEAUTY.
            ${t?"تمامی حقوق محفوظ است.":"All rights reserved."}
          </span>

          <span class="nil-footer-credit">
            ${t?"طراحی و توسعه توسط":"Designed & developed by"}
            <a
              href="https://www.mazoryagroup.ir/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MazoryaGroup
            </a>
          </span>
        </div>

      </div>
    </footer>
  `}function G(t,e={}){const{navbarClass:a="navbar w-nav"}=e;return`
    <div class="page-wrap">
      <div class="${a}" data-animation="default" data-collapse="medium">
        ${ca()}
      </div>
      ${t}
    </div>
    <div id="footer">${da()}</div>
  `}function K(){Ce()}function At(t,e=!0){if(!t)return"—";try{const a=new Date(t);return isNaN(a.getTime())?String(t).split("T")[0]||"—":a.toLocaleDateString(e?"fa-IR":"en-US",{calendar:e?"persian":"gregory",year:"numeric",month:"long",day:"numeric"})}catch{return"—"}}const Y=(t="")=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");function xe(t){var e;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((e=t==null?void 0:t.data)==null?void 0:e.data)?t.data.data:[]}function ua(t){if(typeof t!="string"||!t.trim())return"";const e=t.trim();try{if(/^https?:\/\//i.test(e)){const o=new URL(e);return["localhost","127.0.0.1"].includes(o.hostname)&&!["localhost","127.0.0.1"].includes(location.hostname)?"":o.href}if(e.startsWith("//")||/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a="/"+e.replace(/^\/+/,""),n=new URL("/api",location.origin).origin,i=/^\/(storage|uploads)\//.test(a)?n:location.origin;return new URL(a,i).href}catch{return""}}function Wt(t,e="",a=!1){const n=ua(t);return n?`
    <img
      src="${Y(n)}"
      alt="${Y(e)}"
      loading="${a?"eager":"lazy"}"
      class="cover-image"
      data-home-image
    />
  `:'<div class="nil-image-placeholder">NIL</div>'}function Ae(t){t.querySelectorAll("[data-home-image]").forEach(e=>{const a=()=>{if(!e.isConnected)return;const n=document.createElement("div");n.className="nil-image-placeholder",n.textContent="NIL",e.replaceWith(n)};e.addEventListener("error",a,{once:!0}),e.complete&&!e.naturalWidth&&a()})}function ma(t,e){if(!t)return"";try{return Y(At(t,e))}catch{return""}}async function ga(){const t=Z()==="fa",e=G(`
    <main class="nil-home">

      <!-- HERO -->
      <div class="hero">
        <section class="hero-section">
          <div class="w-layout-blockcontainer container w-container">
            <div class="hero-wrap">

              <div class="hero-left">
                <div class="hero-avatar"></div>

                <div class="hero-middle">
                  <img
                    src="/img/Hero Left.jpg"
                    loading="eager"
                    alt="NIL Beauty"
                    class="cover-image"
                  />
                </div>

                <p class="line-height-150 capitalize">
                  ${Y(u("hero.tagline"))}
                </p>
              </div>

              <div class="hero-right">

                <div class="hero-image">
                  <img
                    src="/img/Hero Center.jpg"
                    loading="eager"
                    fetchpriority="high"
                    alt="NIL Beauty Salon"
                    class="cover-image"
                  />
                </div>

                <div class="hero-content">
                  <div class="hero-top">

                    <div class="hero-info">
                      <h2 class="color-white">
                        ${Y(u("hero.title"))}
                      </h2>

                      <p class="line-height-150">
                        ${Y(u("hero.description"))}
                      </p>
                    </div>

                    <a
                      href="/login"
                      data-nav-link
                      class="hero-btn w-button"
                    >
                      ${t?"رزرو نوبت":"Book Now"}
                      <span aria-hidden="true">↗</span>
                    </a>

                  </div>

                  <div class="hero-img">
                    <img
                      src="/img/Hero Right.jpg"
                      loading="eager"
                      alt="NIL Beauty Services"
                      class="cover-image"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- CATEGORIES -->
      <section class="section nil-home-categories">
        <div class="w-layout-blockcontainer container w-container">

          <div class="section-title-wrap">
            <div class="title-wrap">
              <div class="subtitle">
                ${Y(u("sections.explore"))}
              </div>

              <h2>${Y(u("sections.categories"))}</h2>
            </div>
          </div>

          <div class="category-wrap" data-categories-wrap>
            <div class="loading-placeholder">
              ${Y(u("common.loading"))}
            </div>
          </div>

        </div>
      </section>

      <!-- ABOUT -->
      <section class="nil-home-about">
        <div class="w-layout-blockcontainer container w-container">

          <div class="about-block">

            <div class="about-img">
              <img
                src="/img/about-img.jpg"
                loading="lazy"
                alt="About NIL"
                class="cover-image"
              />
            </div>

            <div class="about-data">
              <div class="about-top">

                <h2 class="about-title">
                  ${Y(u("about.title"))}
                  <br>
                  ${Y(u("about.title_secondary"))}
                </h2>

                <p class="mx-medium">
                  ${Y(u("about.description"))}
                </p>

                <div class="about-btn">
                  <a
                    href="/about"
                    data-nav-link
                    class="primary-button large w-button"
                  >
                    ${t?"درباره نیل":"About NIL"}
                  </a>
                </div>

              </div>
            </div>

            <div class="about-right">
              <img
                src="/img/about-right.jpg"
                loading="lazy"
                alt="NIL Salon"
                class="cover-image"
              />
            </div>

          </div>
        </div>
      </section>

      <!-- BLOG -->
      <section class="section nil-home-blogs">
        <div class="w-layout-blockcontainer container w-container">

          <div class="section-title-wrap">
            <div class="title-wrap">
              <div class="subtitle">
                ${Y(u("sections.news"))}
              </div>

              <h2>
                ${Y(u("sections.latest_articles"))}
              </h2>
            </div>

            <a
              href="/blog"
              data-nav-link
              class="nil-home-more"
            >
              ${t?"همه مقالات":"All Articles"}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div class="w-dyn-list">
            <div
              role="list"
              class="blog-list w-dyn-items"
              data-blog-list
            >
              <div class="loading-placeholder">
                ${Y(u("common.loading"))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- CTA -->
      <section class="section to-top nil-home-cta">
        <div class="w-layout-blockcontainer container w-container">

          <div class="cta">

            <div class="fill-block">
              <div class="cta-img">
                <img
                  src="/img/cta-image.jpg"
                  loading="lazy"
                  alt="NIL Beauty"
                  class="cover-image"
                />
              </div>
            </div>

            <div class="fill-block">
              <div class="cta-content">

                <div>
                  <h3 class="cta-title">
                    ${Y(u("cta.title"))}
                  </h3>

                  <p class="body-small">
                    ${t?"از تازه‌ترین اخبار و پیشنهادهای نیل باخبر شو.":"Discover the latest NIL news and offers."}
                  </p>
                </div>

                <div class="cta-form-block w-form">

                  <form class="cta-form" data-cta-form>

                    <input
                      class="cta-field w-input"
                      type="email"
                      name="email"
                      dir="ltr"
                      maxlength="255"
                      autocomplete="email"
                      placeholder="${Y(u("forms.email"))}"
                      aria-label="Email"
                      required
                      data-cta-email
                    />

                    <button
                      type="submit"
                      class="cta-btn w-button"
                      data-cta-submit
                    >
                      ${Y(u("buttons.subscribe"))}
                    </button>

                  </form>

                  <div
                    class="form-message nil-cta-message"
                    data-cta-msg
                    role="status"
                    aria-live="polite"
                    hidden
                  ></div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  `);return setTimeout(()=>{const a=document.querySelector(".nil-home");a&&(K(),pa(a,t),va(a,t),fa(a,t))},100),e}async function pa(t,e){const a=t.querySelector("[data-categories-wrap]");if(a)try{const n=await Ht.categories();if(!a.isConnected)return;const i=xe(n);if(!i.length){a.innerHTML=`
        <p class="nil-home-empty">
          ${e?"دسته‌بندی موجود نیست":"No categories available"}
        </p>
      `;return}const o=i[0],s=i.slice(1,5),d=r=>`/gallery?category=${encodeURIComponent(r.id)}`;a.innerHTML=`
      <div class="category-left w-dyn-list">
        <div role="list" class="categories-wrap w-dyn-items">

          <div role="listitem" class="w-dyn-item">
            <a
              href="${d(o)}"
              class="feature-category w-inline-block"
              data-nav-link
            >
              <div class="category-text">
                ${Y(o.name)}
              </div>

              ${Wt(o.image,o.name,!0)}
            </a>
          </div>

        </div>
      </div>

      <div class="category-right w-dyn-list">
        <div role="list" class="categories-wrap w-dyn-items">

          ${s.map(r=>`
            <div role="listitem" class="d-flex w-dyn-item">
              <a
                href="${d(r)}"
                class="category-card w-inline-block"
                data-nav-link
              >
                ${Wt(r.image,r.name)}

                <div class="category-text">
                  ${Y(r.name)}
                </div>
              </a>
            </div>
          `).join("")}

        </div>
      </div>
    `,Ae(a)}catch(n){if(!a.isConnected)return;console.error("Home categories:",n),a.innerHTML=`
      <p class="nil-home-error">
        ${e?"خطا در بارگذاری دسته‌بندی‌ها":"Failed to load categories"}
      </p>
    `}}async function va(t,e){const a=t.querySelector("[data-blog-list]");if(a)try{const n=await Qt.list({lang:e?"fa":"en"});if(!a.isConnected)return;const i=xe(n).slice(0,3);if(!i.length){a.innerHTML=`
        <p class="nil-home-empty">
          ${e?"مقاله‌ای موجود نیست":"No articles available"}
        </p>
      `;return}a.innerHTML=i.map(o=>{var l;const s=o.title_1||(e?"بدون عنوان":"Untitled"),d=typeof o.author=="string"?o.author:((l=o.author)==null?void 0:l.name)||"NIL",r=ma(o.date,e);return`
        <div role="listitem" class="d-flex w-dyn-item">

          <a
            href="/blog/${encodeURIComponent(o.id)}"
            class="blog-card w-inline-block"
            data-nav-link
          >
            <div class="blog-thumb">
              ${Wt(o.image_1,s)}
            </div>

            <div class="blog-content">

              <div class="blog-data">
                <div class="blog-category">
                  ${Y(d)}
                </div>

                <div class="body-small">
                  ${r}
                </div>
              </div>

              <h3 class="blog-title">
                ${Y(s)}
              </h3>

            </div>
          </a>

        </div>
      `}).join(""),Ae(a)}catch(n){if(!a.isConnected)return;console.error("Home blogs:",n),a.innerHTML=`
      <p class="nil-home-error">
        ${e?"خطا در بارگذاری مقالات":"Failed to load articles"}
      </p>
    `}}function fa(t,e){const a=t.querySelector("[data-cta-form]"),n=t.querySelector("[data-cta-email]"),i=t.querySelector("[data-cta-submit]"),o=t.querySelector("[data-cta-msg]");if(!a||!n||!i||a.dataset.initialized==="true")return;a.dataset.initialized="true";let s=!1;function d(r,l="info"){o&&(o.textContent=r,o.hidden=!r,o.dataset.state=l)}a.addEventListener("submit",async r=>{if(r.preventDefault(),s||!a.reportValidity())return;const l=n.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l)){d(e?"ایمیل معتبر وارد کنید":"Enter a valid email","error");return}s=!0,i.disabled=!0;const v=i.textContent;i.textContent=e?"در حال ثبت...":"Submitting...",d(e?"در حال ارسال...":"Sending...","info");try{if(await _e.subscribe(l),!a.isConnected)return;d(e?"ایمیل شما ثبت شد ✓":"Email registered ✓","success"),a.reset()}catch(N){if(!a.isConnected)return;console.error("Newsletter:",N),d(N.message||(e?"خطا در ثبت ایمیل":"Subscription failed"),"error")}finally{s=!1,i.disabled=!1,i.textContent=v}})}async function ha(){const t=Z()==="fa",e=G(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${u("sections.our_story")}</div>
          <h1>${u("sections.about_us")}</h1>
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
              <h3>${u("about_us.title")}</h3>
              <p>${u("about_us.description")}</p>
            </div>
            <div class="about-bottom">
              <div class="about-image">
                <img src="/img/about-image.jpg" loading="eager" alt="About Image" class="cover-image" />
              </div>
              <div class="about-info">
                <div class="about-inner">
                  <img src="/img/ic-satisfaction.svg" loading="lazy" alt="Satisfaction" class="about-icon" />
                  <div>
                    <div class="about-head">${u("about_us.customers")}</div>
                    <div>${u("about_us.customers_description")}</div>
                  </div>
                </div>
                <div class="about-line"></div>
                <div class="about-inner">
                  <img src="/img/ic-awards.svg" loading="lazy" alt="Awards" class="about-icon" />
                  <div>
                    <div class="about-head">${u("about_us.awards")}</div>
                    <div>${u("about_us.awards_description")}</div>
                  </div>
                </div>
                <div class="about-line"></div>
                <div class="about-inner">
                  <img src="/img/ic-global.svg" loading="lazy" alt="Global" class="about-icon" />
                  <div>
                    <div class="about-head">${u("about_us.global_reach")}</div>
                    <div>${u("about_us.global_reach_description")}</div>
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
            <div class="subtitle">${u("sections.our_purpose")}</div>
            <h2>${u("sections.vision_mission")}</h2>
          </div>
        </div>
        <div class="vision-wrap">
          <div class="vision-img">
            <img src="/img/vision-image.jpg" loading="lazy" alt="Vision" class="cover-image" />
          </div>
          <div class="vision-content green">
            <div class="vision-text">
              <div class="vision-dot"></div>
              <div>${u("about_us.Innovation")}</div>
            </div>
            <div class="vision-bottom">
              <div class="vision-divider"></div>
              <p>${u("about_us.Innovation_description")}</p>
            </div>
          </div>
          <div class="vision-content brown">
            <div class="vision-text">
              <div class="vision-dot"></div>
              <div>${u("about_us.Empowering Beauty")}</div>
            </div>
            <div class="vision-bottom">
              <div class="vision-divider"></div>
              <p>${u("about_us.Empowering Beauty_description")}</p>
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
              <h3>${u("about_us.commitment")}</h3>
              <div class="data-paragraph">
                <p>${u("about_us.commitment_description")}</p>
                <p>${u("about_us.commitment_description2")}</p>
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
            <div class="subtitle">${u("sections.experts")}</div>
            <h2>${u("sections.meet_team")}</h2>
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
                <h2>${t?"سوالات متداول":"Frequently Asked Questions"}</h2>
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
                  <h3 class="cta-title">${u("cta.title")}</h3>
                  <p class="body-small">${u("cta.free_shipping")}</p>
                </div>
                <div class="cta-form-block w-form">
                  <!-- ✅ div به جای form -->
                  <div class="cta-form" data-cta-form>
                    <input
                      class="cta-field w-input"
                      name="email"
                      placeholder="${u("forms.email")}"
                      type="email"
                      dir="ltr"
                      data-cta-email
                    />
                    <button
                      type="button"
                      class="cta-btn w-button"
                      data-cta-submit
                    >${u("buttons.subscribe")}</button>
                  </div>
                  <div class="form-message" data-cta-msg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `);return setTimeout(()=>{K(),ya(t),ba(t)},100),e}function ya(t){const e=document.querySelector("[data-faq-list]");if(!e)return;const a=t?[{q:"سیاست بازگشت گلومین چیست؟",a:"ما ۳۰ روز ضمانت بازگشت برای همه‌ی محصولات داریم. اگه از خرید خود راضی نیستید، لطفاً با پشتیبانی تماس بگیرید."},{q:"ارسال رایگان دارید؟",a:"بله، برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان ارسال رایگان است. برای سفارش‌های کمتر، هزینه‌ی ارسال استاندارد اعمال می‌شود."},{q:"محصولات گلومین کجا تولید می‌شوند؟",a:"ما ارسال بین‌المللی به بسیاری از کشورها داریم. هزینه و زمان ارسال بسته به مقصد متفاوت است."},{q:"چطور از محصولات مراقبت پوست گلومین استفاده کنم؟",a:"هر محصول دارای دستورالعمل استفاده روی بسته‌بندی است. برای راهنمایی کلی: ابتدا پوست را تمیز کنید، سپس سرم یا محصولات درمانی را اعمال کنید."},{q:"چطور از محصولات جدید و تخفیف‌ها باخبر بشم؟",a:"برای اطلاع از جدیدترین محصولات، تخفیف‌ها و پیشنهادات ویژه، در خبرنامه‌ی ما ثبت‌نام کنید."},{q:"اگه محصول آسیب‌دیده یا اشتباه دریافت کردم چیکار کنم؟",a:"اگه محصول آسیب‌دیده یا اشتباه دریافت کردید، لطفاً بلافاصله با پشتیبانی تماس بگیرید. شماره سفارش و جزئیات مشکل را ارسال کنید."}]:[{q:"What is Glomin's return policy?",a:"We offer a 30-day return policy on all products. If you are not satisfied with your purchase, please contact our customer support team."},{q:"Do you offer free shipping?",a:"Yes, we offer free shipping on all orders over $50. For orders below $50, standard shipping rates apply."},{q:"Where are Glomin products made?",a:"We offer international shipping to many countries. Shipping rates and delivery times vary based on the destination."},{q:"How do I use Glomin's skincare products?",a:"Each product comes with detailed usage instructions on the packaging. For general guidance, start with cleansing your skin, then apply serums or treatments as needed."},{q:"How can I stay updated on new products and promotions?",a:"To stay informed about our latest products, promotions, and exclusive offers, sign up for our newsletter on our website."},{q:"What should I do if I receive a damaged or incorrect item?",a:"If you receive a damaged or incorrect item, please contact our customer support team immediately with your order number and details."}];e.innerHTML=a.map(n=>`
    <div class="faq" data-faq-item>
      <div class="question-block" data-faq-toggle>
        <p class="body-large color-black">${n.q}</p>
        <div class="faq-icon">
          <div class="plus-icon">+</div>
        </div>
      </div>
      <div class="answer-block" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${n.a}</p></div>
      </div>
    </div>
  `).join(""),e.querySelectorAll("[data-faq-toggle]").forEach(n=>{n.addEventListener("click",()=>{const i=n.nextElementSibling,o=i.style.display!=="none";i.style.display=o?"none":"block",n.classList.toggle("active",!o)})})}function ba(t){const e=document.querySelector("[data-cta-form]");if(!e||e.dataset.initialized==="true")return;e.dataset.initialized="true";const a=e.querySelector("[data-cta-submit]"),n=e.querySelector("[data-cta-email]"),i=document.querySelector("[data-cta-msg]");if(!a||!n)return;a.addEventListener("click",async r=>{if(r.preventDefault(),r.stopPropagation(),a.disabled)return;const l=(n.value||"").trim();if(!l||!o(l)){s(i,t?"ایمیل معتبر وارد کنید":"Please enter a valid email","error");return}d(a,!0),s(i,t?"در حال ارسال...":"Sending...","info");try{const v=await _e.subscribe(l);console.log("📧 CTA subscribe response:",v),s(i,t?"ایمیل شما ثبت شد ✓":"Your email has been registered ✓","success"),n.value=""}catch(v){console.error("❌ CTA subscribe error:",v),s(i,v.message||(t?"خطا در ثبت ایمیل":"Failed to subscribe"),"error")}finally{d(a,!1)}}),n.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),a.click())});function o(r){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)}function s(r,l,v="info"){r&&(r.textContent=l,r.style.display=l?"block":"none",r.style.color=v==="error"?"#e74c3c":v==="success"?"#27ae60":"#666")}function d(r,l){r&&(r.disabled=l,l?(r.dataset.originalText=r.textContent,r.textContent="..."):r.textContent=r.dataset.originalText||"SUBSCRIBE")}}function J(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function wa(t){if(!t||typeof t!="string")return"";const e=t.trim();if(!e)return"";if(/^https?:\/\//i.test(e))try{const n=new URL(e);return["localhost","127.0.0.1"].includes(n.hostname.toLowerCase())&&!["localhost","127.0.0.1"].includes(window.location.hostname.toLowerCase())?"":n.href}catch{return""}if(e.startsWith("//"))return window.location.protocol+e;if(/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a="/api";try{const n=new URL(a,window.location.origin),i=e.startsWith("/")?e:"/"+e;return i.startsWith("/storage/")||i.startsWith("/uploads/")?new URL(i,n.origin).href:new URL(i,window.location.origin).href}catch{return""}}function $a(t,e=200){const a=String(t??"").replace(/<[^>]*>/g,"").trim();return a.length<=e?a:a.slice(0,e).trimEnd()+"..."}function ka(t){var e;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((e=t==null?void 0:t.data)==null?void 0:e.data)?t.data.data:[]}function Sa(t){return wa(t==null?void 0:t.image_1)}function Ie(t,e="lazy"){const a=Sa(t),n=J((t==null?void 0:t.title_1)||"");return a?`
    <img
      src="${J(a)}"
      loading="${e}"
      alt="${n}"
      class="cover-image"
      data-blog-image
    />
  `:`
      <div class="blog-image-placeholder"
           aria-label="${n}">
        <span>NIL</span>
      </div>
    `}function le(t){t.querySelectorAll("[data-blog-image]").forEach(e=>{e.addEventListener("error",()=>{const a=document.createElement("div");a.className="blog-image-placeholder",a.setAttribute("aria-label",e.alt||"Blog image");const n=document.createElement("span");n.textContent="NIL",a.appendChild(n),e.replaceWith(a)},{once:!0})})}async function _a(){const t=Z()==="fa",e=G(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">
            ${t?"مقالات":"BLOGS"}
          </div>

          <h1>${J(u("sections.latest_articles"))}</h1>
        </div>
      </div>
    </section>

    <section class="section to-top">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer">

          <div class="w-dyn-list">
            <div role="list" class="w-dyn-items">

              <div
                role="listitem"
                class="w-dyn-item"
                data-feature-blog
              >
                <div class="loading-placeholder">
                  ${J(u("common.loading"))}
                </div>
              </div>

            </div>
          </div>

          <div class="w-dyn-list">
            <div
              role="list"
              class="blog-list w-dyn-items"
              data-blog-list
            >
              <div class="loading-placeholder">
                ${J(u("common.loading"))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `);return setTimeout(()=>{const a=document.querySelector("[data-feature-blog]"),n=document.querySelector("[data-blog-list]");!a||!n||(K(),Ea(t,a,n))},100),e}async function Ea(t,e,a){const n=()=>e.isConnected&&a.isConnected;try{const i=await Qt.list({lang:t?"fa":"en"});if(!n())return;console.log("📝 Blogs response:",i);const o=ka(i);if(!o.length){e.innerHTML=`
        <p>
          ${t?"مقاله‌ای موجود نیست":"No blogs available"}
        </p>
      `,a.innerHTML="";return}const s=o[0],d=o.slice(1);La(e,s,t),Ta(a,d,t),le(e),le(a)}catch(i){if(!n())return;console.error("❌ Blogs error:",i),e.innerHTML=`
      <p>
        ${t?"خطا در دریافت مقالات":"Failed to load articles"}
      </p>
    `,a.innerHTML=""}}function La(t,e,a){const n=encodeURIComponent(e.id),i=J(e.title_1||(a?"بدون عنوان":"Untitled")),o=J($a(e.description_1,200)),s=J(e.author||"NIL"),d=J(e.date?At(e.date,a):"");t.innerHTML=`
    <a
      href="/blog/${n}"
      class="blog-wrap w-inline-block"
      data-nav-link
    >

      <div class="feature-img">
        ${Ie(e,"eager")}
      </div>

      <div class="feature-content">
        <div class="blog-content">

          <div class="blog-data">
            <div class="blog-category">
              ${s}
            </div>

            <div class="body-small">
              ${d}
            </div>
          </div>

          <h3 class="blog-title">
            ${i}
          </h3>

          <p>${o}</p>

        </div>

        <div class="secondary-button">
          ${J(u("buttons.read_more"))}
        </div>

      </div>
    </a>
  `}function Ta(t,e,a){if(!e.length){t.innerHTML="";return}t.innerHTML=e.map(n=>{const i=encodeURIComponent(n.id),o=J(n.title_1||(a?"بدون عنوان":"Untitled")),s=J(n.author||"NIL"),d=J(n.date?At(n.date,a):"");return`
      <div role="listitem" class="d-flex w-dyn-item">

        <a
          href="/blog/${i}"
          class="blog-card w-inline-block"
          data-nav-link
        >

          <div class="blog-thumb">
            ${Ie(n)}
          </div>

          <div class="blog-content">

            <div class="blog-data">
              <div class="blog-category">
                ${s}
              </div>

              <div class="body-small">
                ${d}
              </div>
            </div>

            <h3 class="blog-title">
              ${o}
            </h3>

          </div>
        </a>
      </div>
    `}).join("")}function X(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ca(t){if(!t||typeof t!="string")return"";const e=t.trim();if(!e)return"";try{if(/^https?:\/\//i.test(e)){const i=new URL(e),o=["localhost","127.0.0.1"];return o.includes(i.hostname.toLowerCase())&&!o.includes(window.location.hostname.toLowerCase())?"":i.href}if(e.startsWith("//"))return window.location.protocol+e;if(/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a=new URL("/api",window.location.origin),n=e.startsWith("/")?e:"/"+e;return n.startsWith("/storage/")||n.startsWith("/uploads/")?new URL(n,a.origin).href:new URL(n,window.location.origin).href}catch{return""}}function xa(t,e){if(!t)return"";try{return At(t,e)||""}catch{return""}}function ce(t,e,a="lazy"){const n=Ca(t);return n?`
    <img
      src="${X(n)}"
      loading="${a}"
      alt="${X(e)}"
      class="cover-image"
      data-blog-image
    />
  `:""}function Bt(t){return t?X(t).replace(/\r\n?/g,`
`).split(/\n\s*\n/).filter(Boolean).map(a=>`
      <p>${a.replace(/\n/g,"<br>")}</p>
    `).join(""):""}function Aa(t){t.querySelectorAll("[data-blog-image]").forEach(e=>{const a=()=>{const n=document.createElement("div");n.className="blog-image-placeholder";const i=document.createElement("span");i.textContent="NIL",n.appendChild(i),e.replaceWith(n)};e.addEventListener("error",a,{once:!0}),e.complete&&e.naturalWidth===0&&a()})}async function Ia(t={}){const e=Z()==="fa",a=t.id??t.slug,n=G(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div
          class="blog-card align-center"
          data-blog-detail
        >
          <div class="loading-placeholder">
            ${X(u("common.loading"))}
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="blog-single-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer" data-blog-content>
          <div class="loading-placeholder">
            ${X(u("common.loading"))}
          </div>
        </div>
      </div>
    </section>
  `);return setTimeout(()=>{const i=document.querySelector("[data-blog-detail]"),o=document.querySelector("[data-blog-content]");!i||!o||(K(),qa(a,e,i,o))},100),n}async function qa(t,e,a,n){const i=()=>a.isConnected&&n.isConnected,o=()=>{a.innerHTML=`
      <h2>
        ${e?"مقاله یافت نشد":"Blog not found"}
      </h2>
    `,n.innerHTML=""};if(t==null||t===""){o();return}try{const s=await Qt.get(t,e?"fa":"en");if(!i())return;console.log("📄 Blog detail response:",s);const d=(s==null?void 0:s.data)||s;if(!d||typeof d!="object"||Array.isArray(d)||!d.id){o();return}Na(a,n,d,e)}catch(s){if(!i())return;console.error("❌ Blog detail error:",s),a.innerHTML=`
      <h2 class="text-danger">
        ${e?"خطا در بارگذاری مقاله":"Failed to load article"}
      </h2>
    `,n.innerHTML=""}}function Na(t,e,a,n){const i=X(a.title_1||a.title||(n?"بدون عنوان":"Untitled")),o=X(a.author||"NIL"),s=X(xa(a.date,n)),d=Number(a.reading_time);t.innerHTML=`
    <h2>${i}</h2>

    <div class="blog-data small">
      <div class="blog-category">
        ${o}
      </div>

      ${s?`
        <div class="blog-line"></div>
        <div class="body-small">
          ${s}
        </div>
      `:""}

      ${Number.isFinite(d)&&d>0?`
        <div class="blog-line"></div>
        <div class="body-small">
          ${X(d)}
          ${n?"دقیقه مطالعه":"min read"}
        </div>
      `:""}
    </div>
  `;let r="";if(a.image_1){const l=ce(a.image_1,a.title_1||a.title||"","eager");l&&(r+=`
        <div class="blog-main">
          ${l}
        </div>
      `)}if(r+=`
    <div class="blog-details">
      <div class="richtext w-richtext">
  `,a.description_1&&(r+=Bt(a.description_1)),a.title_2&&(r+=`
      <h3>${X(a.title_2)}</h3>
    `),a.description_2&&(r+=Bt(a.description_2)),a.image_2){const l=ce(a.image_2,a.title_2||a.title_1||"Media");l&&(r+=`
        <figure
          style="max-width:1800px"
          class="w-richtext-align-fullwidth w-richtext-figure-type-image"
        >
          <div>
            ${l}
          </div>
        </figure>
      `)}a.title_3&&(r+=`
      <h3>${X(a.title_3)}</h3>
    `),a.description_3&&(r+=Bt(a.description_3)),r+=`
      </div>
    </div>
  `,e.innerHTML=r,Aa(e)}function Pa(t=""){const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))}function de(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}async function Ba(){const t=Z()==="fa",e=G(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">

          <div class="subtitle">
            ${t?"با ما در تماس باشید":"GET IN TOUCH"}
          </div>

          <h1>${de(u("nav.contact"))}</h1>

        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section>
      <div class="w-layout-blockcontainer container w-container">

        <div class="contact-wrap">

          <!-- CONTACT FORM -->
          <div class="contact-form-block w-form">

            <form class="contact-form" data-contact-form>

              <input
                class="text-field w-input"
                maxlength="255"
                name="first_name"
                placeholder="${t?"نام *":"First name *"}"
                type="text"
                autocomplete="given-name"
                required
              />

              <input
                class="text-field w-input"
                maxlength="255"
                name="last_name"
                placeholder="${t?"نام خانوادگی":"Last name"}"
                type="text"
                autocomplete="family-name"
              />

              <input
                class="text-field w-input"
                maxlength="255"
                name="email"
                placeholder="${t?"ایمیل *":"Email *"}"
                type="email"
                autocomplete="email"
                dir="ltr"
                required
              />

              <input
                class="text-field w-input"
                maxlength="20"
                name="phone"
                placeholder="${t?"شماره تلفن":"Phone"}"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                dir="ltr"
              />

              <textarea
                required
                placeholder="${t?"پیام شما *":"Your message *"}"
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
                    ${t?"با ارسال این فرم، موافقت خود را با بررسی پیام توسط مجموعه NIL اعلام می‌کنم.":"I agree to NIL processing my message to respond to my inquiry."}
                  </span>
                </label>

                <input
                  type="submit"
                  class="primary-button w-button"
                  value="${de(u("common.submit"))}"
                  data-submit-btn
                />

              </div>
            </form>

            <div
              class="contact-form-message"
              data-form-message
              role="status"
              aria-live="polite"
            ></div>

          </div>

          <!-- CONTACT INFORMATION -->
          <div class="contat-content">

            <p>
              ${t?"سؤال، پیشنهاد یا انتقادی داری؟ پیام خودت رو برامون ارسال کن. خوشحال می‌شیم باهات در ارتباط باشیم.":"Have a question or feedback? Send us a message. We would love to hear from you."}
            </p>

            <div class="contact-inner">

              <div class="contact-img">
                <img
                  src="/img/contact-image.jpg"
                  loading="lazy"
                  alt="NIL Beauty Contact"
                  class="cover-image"
                />
              </div>

              <div class="contact-info">
                <div class="contact-outer">

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img
                        src="/img/mail-icon.svg"
                        loading="lazy"
                        alt=""
                      />
                    </div>

                    <div>
                      <h6>${t?"ایمیل":"Email"}</h6>
                      <div class="body-small">
                        ${t?"برای ارتباط با مجموعه از فرم تماس استفاده کنید.":"Use the contact form to reach our team."}
                      </div>
                    </div>
                  </div>

                  <div class="contact-block">
                    <div class="contact-icon">
                      <img
                        src="/img/phone-icon.svg"
                        loading="lazy"
                        alt=""
                      />
                    </div>

                    <div>
                      <h6>${t?"پشتیبانی":"Support"}</h6>
                      <div class="body-small">
                        ${t?"پیام خود را ثبت کنید تا تیم مجموعه با شما ارتباط بگیرد.":"Submit your message and our team will get back to you."}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `);return setTimeout(()=>{const a=document.querySelector("[data-contact-form]");a&&(K(),Ma(a,t))},100),e}function Ma(t,e){const a=t.parentElement.querySelector("[data-form-message]"),n=t.querySelector("[data-submit-btn]");let i=!1;function o(d="",r="info"){a&&(a.textContent=d,a.style.display=d?"block":"none",a.classList.remove("is-success","is-error","is-info"),a.classList.add(`is-${r}`))}function s(d){n.disabled=d,d?(n.dataset.originalText=n.value,n.value=e?"لطفاً صبر کنید...":"Please wait..."):n.value=n.dataset.originalText||(e?"ارسال پیام":"Submit")}t.addEventListener("submit",async d=>{if(d.preventDefault(),i||!t.reportValidity())return;const r=new FormData(t),l={first_name:String(r.get("first_name")||"").trim(),last_name:String(r.get("last_name")||"").trim(),email:String(r.get("email")||"").trim(),phone:Pa(String(r.get("phone")||"").trim()),message:String(r.get("message")||"").trim()};if(!l.first_name||!l.email||!l.message){o(e?"لطفاً فیلدهای ضروری را تکمیل کنید.":"Please complete the required fields.","error");return}i=!0,s(!0),o(e?"در حال ارسال پیام...":"Sending message...","info");try{if(await sa.send(l),!t.isConnected)return;o(e?"پیام شما با موفقیت ارسال شد ✓":"Your message has been sent successfully ✓","success"),t.reset()}catch(v){if(!t.isConnected)return;console.error("❌ Contact error:",v),o(v.message||(e?"خطا در ارسال پیام":"Failed to send message"),"error")}finally{i=!1,s(!1)}})}async function Da(){const t=G(`
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
          <div class="loading-placeholder">${u("common.loading")}</div>
        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{K(),Ra()}),t}async function Ra(){const t=document.querySelector("[data-faq-list]");if(!t)return;const e=[{q:"What is Glomin’s return policy?",a:"We offer a 30-day return policy."},{q:"Do you offer free shipping?",a:"Yes, on orders over $50."}];t.innerHTML=e.map(a=>`
    <div class="faq w-dropdown" data-faq-item>
      <div class="question-block w-dropdown-toggle" data-faq-toggle>
        <p class="body-large color-black">${a.q}</p>
        <div class="faq-icon">+</div>
      </div>
      <nav class="answer-block w-dropdown-list" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${a.a}</p></div>
      </nav>
    </div>
  `).join(""),t.querySelectorAll("[data-faq-toggle]").forEach(a=>{a.addEventListener("click",()=>{const n=a.nextElementSibling,i=n.style.display!=="none";n.style.display=i?"none":"block"})})}const vt=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),nt=t=>new Intl.NumberFormat("fa-IR").format(Number(t||0)),ue=t=>String(t).replace(/\d/g,e=>"۰۱۲۳۴۵۶۷۸۹"[e]);function Oa(t){if(!t)return"—";const e=new Date(`${String(t).slice(0,10)}T12:00:00Z`);return Number.isNaN(e.getTime())?"—":new Intl.DateTimeFormat("fa-IR-u-ca-persian",{timeZone:"UTC",year:"numeric",month:"long",day:"numeric"}).format(e)}function Ua(t){var e;return((e=t==null?void 0:t.data)==null?void 0:e.booking)||(t==null?void 0:t.data)||(t==null?void 0:t.booking)||null}function Ha(t){var a,n,i;const e=[(a=t==null?void 0:t.data)==null?void 0:a.payment_url,(n=t==null?void 0:t.data)==null?void 0:n.gateway_url,(i=t==null?void 0:t.data)==null?void 0:i.url,t==null?void 0:t.payment_url,t==null?void 0:t.gateway_url,t==null?void 0:t.url];for(const o of e)if(typeof o=="string")try{const s=new URL(o);if(s.protocol==="https:")return s.href}catch{}return null}function za(){const t=Z()==="fa",e=(n,i)=>t?n:i;if(!Xt())return queueMicrotask(()=>{var n,i;(i=(n=window.__app)==null?void 0:n.router)==null||i.navigate("/login")}),G(`
      <div class="nil-checkout-loading">
        ${e("در حال انتقال به ورود...","Redirecting to login...")}
      </div>
    `);const a=G(`
    <main
      class="nil-checkout"
      dir="${t?"rtl":"ltr"}"
      data-nil-checkout
    >
      <div class="nil-checkout-container">

        <!-- HEADER -->
        <header class="nil-checkout-header">
          <button
            type="button"
            class="nil-checkout-back"
            data-checkout-back
          >
            ${t?"→":"←"}
            ${e("بازگشت به داشبورد","Back to dashboard")}
          </button>

          <div class="nil-checkout-brand">
            <span>NIL BEAUTY</span>
          </div>
        </header>

        <!-- HEADING -->
        <section class="nil-checkout-heading">
          <span class="nil-checkout-eyebrow">
            SECURE CHECKOUT
          </span>

          <h1>
            ${e("تکمیل رزرو","Complete your booking")}
          </h1>

          <p>
            ${e("اطلاعات نوبتت رو بررسی کن و برای تکمیل رزرو بیعانه رو پرداخت کن.","Review your appointment and pay the deposit to complete your booking.")}
          </p>
        </section>

        <!-- CONTENT -->
        <div data-checkout-content>
          <div class="nil-checkout-loading">
            <div class="nil-checkout-spinner"></div>
            ${e("در حال دریافت اطلاعات رزرو...","Loading booking details...")}
          </div>
        </div>

        <!-- FOOTER -->
        <footer class="nil-checkout-footer">
          <span>✦ NIL BEAUTY STUDIO</span>
          <span>
            ${e("رزرو آنلاین خدمات زیبایی","Online beauty booking")}
          </span>
        </footer>

      </div>
    </main>
  `);return setTimeout(()=>{const n=document.querySelector("[data-nil-checkout]");!n||n.dataset.initialized||(n.dataset.initialized="1",K(),Wa(n,t))},100),a}async function Wa(t,e){const a=f=>t.querySelector(f),n=(f,$)=>e?f:$,i=a("[data-checkout-content]"),o=new URLSearchParams(window.location.search).get("booking");let s=null,d=!1;a("[data-checkout-back]").addEventListener("click",()=>{var f,$;($=(f=window.__app)==null?void 0:f.router)==null||$.navigate("/dashboard")});function r(f,$=!1){var B;i.innerHTML=`
      <div class="nil-checkout-state">
        <div class="nil-checkout-state-icon">!</div>

        <h2>
          ${n("مشکلی پیش آمد","Something went wrong")}
        </h2>

        <p>${vt(f)}</p>

        ${$?`
          <button
            type="button"
            class="nil-checkout-button"
            data-checkout-retry
          >
            ${n("تلاش مجدد","Try again")}
          </button>
        `:""}
      </div>
    `,(B=a("[data-checkout-retry]"))==null||B.addEventListener("click",l)}async function l(){if(!o||!/^\d+$/.test(o)){r(n("شناسه رزرو معتبر نیست.","Invalid booking ID."));return}i.innerHTML=`
      <div class="nil-checkout-loading">
        <div class="nil-checkout-spinner"></div>

        ${n("در حال دریافت اطلاعات رزرو...","Loading booking details...")}
      </div>
    `;try{const f=await ht.get(o);if(s=Ua(f),!s||typeof s!="object"||!s.id)throw new Error(n("اطلاعات رزرو دریافت نشد.","Booking details not found."));v()}catch(f){console.error("Checkout booking error:",f),r(f.message||n("خطا در دریافت اطلاعات رزرو","Failed to load booking"),!0)}}function v(){var M;const f=s.booking_services||s.services||[],$=Number(s.subtotal??0),B=Number(s.discount_amount??0),x=Number(s.total_amount??Math.max(0,$-B)),C=Number(s.deposit_amount??0),y=Number(s.paid_amount??0),A=Math.max(0,C-y),O=Math.max(0,x-y),I=Math.max(0,x-Math.max(y,C)),h=x===0&&s.status==="confirmed",m=A===0&&C>0,b=["cancelled","expired","rejected"].includes(s.status),P=s.status==="completed",E=!h&&!m&&!b&&!P&&A>0;i.innerHTML=`
      <div class="nil-checkout-grid">

        <!-- APPOINTMENT DETAILS -->
        <section class="nil-checkout-card">

          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">✦</div>

            <div>
              <span class="nil-checkout-eyebrow">
                APPOINTMENT DETAILS
              </span>

              <h2>
                ${n("جزئیات نوبت","Appointment details")}
              </h2>
            </div>
          </div>

          <!-- BOOKING NUMBER -->
          <div class="nil-checkout-booking-number">
            <span>
              ${n("شماره رزرو","Booking number")}
            </span>

            <strong>
              #${ue(s.id)}
            </strong>
          </div>

          <!-- DATE AND TIME -->
          <div class="nil-checkout-info">

            <div class="nil-checkout-info-item">
              <span>
                ${n("تاریخ نوبت","Appointment date")}
              </span>

              <strong>
                ${Oa(s.booking_date)}
              </strong>
            </div>

            <div class="nil-checkout-info-item">
              <span>
                ${n("ساعت شروع","Start time")}
              </span>

              <strong>
                ${vt(String(s.start_time||"").slice(0,5))}
              </strong>
            </div>

            <div class="nil-checkout-info-item">
              <span>
                ${n("ساعت پایان","End time")}
              </span>

              <strong>
                ${vt(String(s.end_time||"").slice(0,5))}
              </strong>
            </div>

            <div class="nil-checkout-info-item">
              <span>
                ${n("وضعیت رزرو","Booking status")}
              </span>

              <strong>
                ${vt(s.status||"-")}
              </strong>
            </div>

          </div>

          <div class="nil-checkout-divider"></div>

          <!-- SERVICES -->
          <h3 class="nil-checkout-subtitle">
            ${n("خدمات انتخاب‌شده","Selected services")}
          </h3>

          <div class="nil-checkout-services">

            ${f.length?f.map(H=>{var V,et;return`
              <div class="nil-checkout-service">

                <div>
                  <strong>
                    ${vt(((V=H.service)==null?void 0:V.name)||H.service_name||H.name||n("خدمت زیبایی","Beauty service"))}
                  </strong>

                  <small>
                    ${ue(H.duration||((et=H.service)==null?void 0:et.duration)||0)}
                    ${n("دقیقه","min")}
                  </small>
                </div>

                <span>
                  ${nt(H.price)}
                  ${n("تومان","Toman")}
                </span>

              </div>
            `}).join(""):`
              <p class="nil-checkout-muted">
                ${n("اطلاعات خدمات موجود نیست.","Service details unavailable.")}
              </p>
            `}

          </div>

        </section>

        <!-- PAYMENT SUMMARY -->
        <aside class="nil-checkout-card nil-checkout-payment">

          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">◈</div>

            <div>
              <span class="nil-checkout-eyebrow">
                PAYMENT SUMMARY
              </span>

              <h2>
                ${n("خلاصه پرداخت","Payment summary")}
              </h2>
            </div>
          </div>

          <!-- SUBTOTAL -->
          <div class="nil-checkout-price-row">
            <span>
              ${n("مبلغ کل خدمات","Services total")}
            </span>

            <strong>
              ${nt($)}
              ${n("تومان","Toman")}
            </strong>
          </div>

          <!-- DISCOUNT -->
          ${B>0?`
            <div class="nil-checkout-price-row">
              <span>
                ${n("تخفیف ثبت‌شده","Applied discount")}
              </span>

              <strong>
                − ${nt(B)}
                ${n("تومان","Toman")}
              </strong>
            </div>
          `:""}

          <!-- FINAL TOTAL -->
          <div class="nil-checkout-price-row">
            <span>
              ${n("مبلغ نهایی پس از تخفیف","Final total after discount")}
            </span>

            <strong>
              ${nt(x)}
              ${n("تومان","Toman")}
            </strong>
          </div>

          <div class="nil-checkout-divider"></div>

          <!-- DEPOSIT -->
          <div class="nil-checkout-price-row">
            <span>
              ${n("بیعانه رزرو","Booking deposit")}
            </span>

            <strong>
              ${nt(C)}
              ${n("تومان","Toman")}
            </strong>
          </div>

          <!-- PAID -->
          <div class="nil-checkout-price-row">
            <span>
              ${n("پرداخت‌شده","Already paid")}
            </span>

            <strong>
              ${nt(y)}
              ${n("تومان","Toman")}
            </strong>
          </div>

          <!-- CURRENT REMAINING -->
          <div class="nil-checkout-price-row">
            <span>
              ${n("مانده کل در حال حاضر","Current outstanding balance")}
            </span>

            <strong>
              ${nt(O)}
              ${n("تومان","Toman")}
            </strong>
          </div>

          <!-- AFTER DEPOSIT -->
          <div class="nil-checkout-price-row">
            <span>
              ${n("مانده پس از پرداخت بیعانه","Balance after deposit")}
            </span>

            <strong>
              ${nt(I)}
              ${n("تومان","Toman")}
            </strong>
          </div>

          <!-- DEPOSIT DUE -->
          <div class="nil-checkout-total">
            <span>
              ${n("بیعانه قابل پرداخت","Deposit due")}
            </span>

            <div>
              <strong>
                ${nt(A)}
              </strong>

              <small>
                ${n("تومان","Toman")}
              </small>
            </div>
          </div>

          <!-- FREE BOOKING -->
          ${h?`
            <div class="nil-checkout-success">
              ✓ ${n("رزرو با تخفیف کامل و بدون پرداخت تأیید شده است.","Booking confirmed with a full discount. No payment required.")}
            </div>
          `:""}

          <!-- PAID DEPOSIT -->
          ${m&&!h?`
            <div class="nil-checkout-success">
              ✓ ${n("بیعانه پرداخت شده است.","Deposit has been paid.")}
            </div>
          `:""}

          <!-- CANCELLED -->
          ${b?`
            <div class="nil-checkout-warning">
              ${n("این رزرو قابل پرداخت نیست.","This booking cannot be paid.")}
            </div>
          `:""}

          <!-- PAYMENT BUTTON -->
          ${E?`
            <button
              type="button"
              class="nil-checkout-button"
              data-checkout-pay
            >
              <span>
                ${n("پرداخت بیعانه","Pay deposit")}
              </span>

              <span>
                ${e?"←":"→"}
              </span>
            </button>

            <p class="nil-checkout-secure">
              ◈ ${n("پرداخت از طریق درگاه امن بانکی","Secure payment through banking gateway")}
            </p>
          `:""}

          <!-- PAYMENT ERROR -->
          <p
            class="nil-checkout-error"
            data-payment-error
            hidden
          ></p>

          <!-- NOTE -->
          <div class="nil-checkout-note">
            <strong>
              ✦ ${n("نکته مهم","Important note")}
            </strong>

            <p>
              ${n("کد تخفیف هنگام ثبت نوبت اعمال می‌شود. مبالغ این صفحه از سرور دریافت شده‌اند.","Discounts are applied when creating the booking. Amounts on this page come from the server.")}
            </p>
          </div>

        </aside>

      </div>
    `,(M=a("[data-checkout-pay]"))==null||M.addEventListener("click",N)}async function N(){if(d||!s)return;d=!0;const f=a("[data-checkout-pay]"),$=a("[data-payment-error]");f&&(f.disabled=!0,f.textContent=n("در حال اتصال به درگاه...","Connecting to payment gateway...")),$&&($.hidden=!0);try{const B=await oa.start(s.id),x=Ha(B);if(!x)throw new Error(n("آدرس درگاه پرداخت در پاسخ سرور وجود ندارد.","Payment gateway URL is missing from the server response."));window.location.assign(x)}catch(B){console.error("Payment error:",B),$&&($.textContent=B.message||n("خطا در پرداخت","Payment failed"),$.hidden=!1),f&&(f.disabled=!1,f.innerHTML=`
          <span>
            ${n("تلاش مجدد برای پرداخت","Retry payment")}
          </span>

          <span>
            ${e?"←":"→"}
          </span>
        `),d=!1}}await l()}const U=(t,e)=>{const a=u(t);return a&&a!==t?a:e},Yt=(t="")=>{const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))},Ya=t=>Yt(t).replace(/\D/g,""),Fa=t=>/^(09\d{9}|989\d{9})$/.test(t),me=t=>{var e,a;return(t==null?void 0:t.token)||(t==null?void 0:t.access_token)||((e=t==null?void 0:t.data)==null?void 0:e.token)||((a=t==null?void 0:t.data)==null?void 0:a.access_token)},ut=(t,e)=>{t&&(e?(t.dataset.originalText=t.textContent,t.disabled=!0,t.textContent=U("auth.loading","لطفاً صبر کنید...")):(t.disabled=!1,t.textContent=t.dataset.originalText||t.textContent))};async function ja(){const t=G(`
    <div class="auth-page">


      <div class="auth-container">

        <div class="auth-mobile-brand">
          
          <img
    src="/img/logo.png"
    alt="NIL Beauty"
    class="nil-brand-logo"
    width="110"
    height="55"
  />
          <div>
            
          </div>
        </div>

        <div class="auth-header">
          <h2>${U("auth.login_title","خوش اومدی!")}</h2>
          <p>${U("auth.login_subtitle","برای ورود به حساب کاربری اطلاعاتت رو وارد کن.")}</p>
        </div>

        <div class="auth-tabs" data-tabs>
          <button
            type="button"
            class="auth-tab active"
            data-tab="phone"
            aria-selected="true"
          >
            ${U("auth.tab_phone","شماره موبایل")}
          </button>

          <button
            type="button"
            class="auth-tab"
            data-tab="email"
            aria-selected="false"
          >
            ${U("auth.tab_email","ایمیل")}
          </button>
        </div>

        <div class="auth-tab-content" data-tab-content="phone">
          <form class="auth-form" data-phone-form>

            <div class="auth-field">
              <label for="login-phone">
                ${U("auth.phone_label","شماره موبایل")}
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
    ${u("auth.forgot-password")}
  </a>
</div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${U("auth.btn_send_otp_login","ارسال کد تأیید")}
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
                ${U("auth.email_label","ایمیل")}
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
                ${U("auth.password_label","رمز عبور")}
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
   ${U("auth.password_label","رمز عبور")}
  </a>
</div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${U("auth.btn_login","ورود به حساب")}
            </button>

            <div style="text-align:center">
              <a href="/forgot-password" data-nav-link class="auth-link-btn">
               ${u("auth.forgot-password")}
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
            <h2>${U("auth.otp_label","تأیید شماره موبایل")}</h2>
            <p>
              کد ارسال‌شده به شماره
              <strong data-phone-display dir="ltr"></strong>
              را وارد کن.
            </p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label for="login-otp">
                ${U("auth.otp_label","کد تأیید")}
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
              ${U("auth.btn_verify_login","تأیید و ورود")}
            </button>
          </form>

          <div class="auth-resend">
            <button
              type="button"
              class="auth-link-btn"
              data-resend-btn
            >
              ${U("auth.btn_resend","ارسال مجدد کد")}
            </button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:16px">
            <button
              type="button"
              class="auth-link-btn"
              data-back-btn
            >
              ${U("auth.btn_back","بازگشت و تغییر شماره")}
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
          <span>${U("auth.no_account","حساب کاربری نداری؟")}</span>
          <a href="/register" data-nav-link>
            ${U("auth.link_register","ثبت‌نام کن")}
          </a>
        </div>

      </div>
    </div>
  `);return setTimeout(()=>{K(),Ga()},100),t}function Ga(){var I;const t=document.querySelector(".auth-page");if(!t)return;const e=h=>t.querySelector(h),a=h=>t.querySelectorAll(h),n=e("[data-tabs]"),i=e("[data-otp-step]"),o=e("[data-main-footer]"),s=e("[data-msg]"),d=e("[data-phone-display]"),r=e("[data-resend-btn]"),l=e("[data-timer]"),v=e("[data-back-btn]"),N=e("[data-phone-form]"),f=e("[data-email-form]"),$=e("[data-otp-form]");let B="",x=null;function C(h="",m="info"){s&&(s.textContent=h,s.style.display=h?"block":"none",s.style.color=m==="error"?"#b42318":m==="success"?"#626a4e":"#111111")}function y(h){a(".auth-tab").forEach(m=>{const b=m.dataset.tab===h;m.classList.toggle("active",b),m.setAttribute("aria-selected",String(b))}),a("[data-tab-content]").forEach(m=>{m.style.display=m.dataset.tabContent===h?"block":"none"}),C()}a(".auth-tab").forEach(h=>{h.addEventListener("click",()=>{y(h.dataset.tab)})});function A(h=60){x&&clearInterval(x);let m=h;r.disabled=!0;const b=()=>{if(m<=0){clearInterval(x),x=null,r.disabled=!1,l.textContent="";return}l.textContent=`(${m}s)`,m--};b(),x=setInterval(b,1e3)}function O(){n.style.display="none",a("[data-tab-content]").forEach(h=>{h.style.display="none"}),o.style.display="none",i.style.display="block",d.textContent=B,A(60),C(),setTimeout(()=>{var h;(h=$.querySelector('[name="code"]'))==null||h.focus()},100)}N==null||N.addEventListener("submit",async h=>{h.preventDefault();const m=Ya(new FormData(N).get("phone")||"");if(!Fa(m)){C(U("auth.msg_invalid_phone","شماره موبایل معتبر نیست."),"error");return}const b=N.querySelector("[data-submit-btn]");ut(b,!0);try{await tt.loginPhoneSendCode(m),B=m,O()}catch(P){C(P.message||U("auth.msg_error_send","ارسال کد با خطا مواجه شد."),"error")}finally{ut(b,!1)}}),$==null||$.addEventListener("submit",async h=>{var P;h.preventDefault();const m=Yt(new FormData($).get("code")||"").trim();if(!/^\d{6}$/.test(m)){C(U("auth.msg_otp_incomplete","کد شش‌رقمی را وارد کن."),"error");return}const b=e("[data-otp-submit]");ut(b,!0);try{const E=await tt.loginPhoneVerify(B,m),M=me(E),H=(E==null?void 0:E.user)||((P=E==null?void 0:E.data)==null?void 0:P.user)||{phone:B};if(!M)throw new Error(U("auth.msg_error_verify","تأیید کد ناموفق بود."));zt(M,H),C(U("auth.msg_login_success","ورود موفقیت‌آمیز بود."),"success"),setTimeout(()=>{var V,et;(et=(V=window.__app)==null?void 0:V.router)==null||et.navigate("/dashboard")},800)}catch(E){C(E.message||U("auth.msg_error_verify","کد تأیید نامعتبر است."),"error")}finally{ut(b,!1)}}),f==null||f.addEventListener("submit",async h=>{var P;h.preventDefault();const m=Object.fromEntries(new FormData(f)),b=f.querySelector("[data-submit-btn]");ut(b,!0);try{const E=await tt.loginEmail(m.email,m.password),M=me(E),H=(E==null?void 0:E.user)||((P=E==null?void 0:E.data)==null?void 0:P.user)||{email:m.email};if(!M)throw new Error(U("auth.msg_error_login","ورود ناموفق بود."));zt(M,H),C(U("auth.msg_login_success","ورود موفقیت‌آمیز بود."),"success"),setTimeout(()=>{var V,et;(et=(V=window.__app)==null?void 0:V.router)==null||et.navigate("/dashboard")},800)}catch(E){C(E.message||U("auth.msg_error_login","ایمیل یا رمز عبور اشتباه است."),"error")}finally{ut(b,!1)}}),r==null||r.addEventListener("click",async()=>{if(!(r.disabled||!B)){r.disabled=!0;try{await tt.loginPhoneSendCode(B),C(U("auth.msg_otp_resent","کد جدید ارسال شد."),"success"),A(60)}catch(h){r.disabled=!1,C(h.message||"خطا در ارسال مجدد کد.","error")}}}),v==null||v.addEventListener("click",()=>{x&&clearInterval(x),x=null,i.style.display="none",n.style.display="flex",o.style.display="flex",$.reset(),y("phone")}),(I=$==null?void 0:$.querySelector('[name="code"]'))==null||I.addEventListener("input",h=>{h.target.value=Yt(h.target.value).replace(/\D/g,"").slice(0,6)})}const W=(t,e)=>{const a=u(t);return a&&a!==t?a:e},Ft=(t="")=>{const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))},Va=t=>Ft(t).replace(/\D/g,""),Ka=t=>/^(09\d{9}|989\d{9})$/.test(t),Qa=t=>{var e,a;return(t==null?void 0:t.token)||(t==null?void 0:t.access_token)||((e=t==null?void 0:t.data)==null?void 0:e.token)||((a=t==null?void 0:t.data)==null?void 0:a.access_token)},St=(t,e)=>{t&&(e?(t.dataset.originalText=t.textContent,t.disabled=!0,t.textContent=W("auth.loading","لطفاً صبر کنید...")):(t.disabled=!1,t.textContent=t.dataset.originalText||t.textContent))};async function Ja(){const t=G(`
    <div class="auth-page">


      <div class="auth-container">

        <div class="auth-mobile-brand">
          
          <img
    src="/img/logo.png"
    alt="NIL Beauty"
    class="nil-brand-logo"
    width="110"
    height="55"
  />
          <div>
            
          </div>
        </div>

        <div class="auth-header">
          <h2>${W("auth.register_title","ساخت حساب کاربری")}</h2>
          <p>${W("auth.register_subtitle","برای شروع، اطلاعاتت رو وارد کن.")}</p>
        </div>

        <div data-step="phone">
          <form class="auth-form" data-phone-form>

            <div class="auth-field">
              <label for="register-name">
                ${W("auth.name_label","نام و نام خانوادگی")}
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                class="auth-input"
                placeholder="${W("auth.name_placeholder","نام و نام خانوادگی")}"
                autocomplete="name"
                required
              />
            </div>

            <div class="auth-field">
              <label for="register-phone">
                ${W("auth.phone_label","شماره موبایل")}
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
                ${W("auth.referral_label","کد معرف")}
                <span>(${W("common.optional","اختیاری")})</span>
              </label>
              <input
                id="register-referral"
                type="text"
                name="referral_code"
                class="auth-input"
                placeholder="${W("auth.referral_placeholder","مثلاً ABC123")}"
                dir="ltr"
                autocomplete="off"
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${W("auth.btn_send_otp_register","ارسال کد تأیید")}
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
                ${W("auth.otp_label","کد تأیید")}
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
              ${W("auth.btn_verify_register","تأیید و ثبت‌نام")}
            </button>
          </form>

          <div class="auth-resend">
            <button
              type="button"
              class="auth-link-btn"
              data-resend-btn
            >
              ${W("auth.btn_resend","ارسال مجدد کد")}
            </button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:16px">
            <button
              type="button"
              class="auth-link-btn"
              data-back-btn
            >
              ${W("auth.btn_back","بازگشت و ویرایش اطلاعات")}
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
          <span>${W("auth.have_account","قبلاً ثبت‌نام کردی؟")}</span>
          <a href="/login" data-nav-link>
            ${W("auth.link_login","ورود به حساب")}
          </a>
        </div>

      </div>
    </div>
  `);return setTimeout(()=>{K(),Za()},100),t}function Za(){var O;const t=document.querySelector(".auth-page");if(!t)return;const e=I=>t.querySelector(I),a=e('[data-step="phone"]'),n=e('[data-step="otp"]'),i=e("[data-phone-form]"),o=e("[data-otp-form]"),s=e("[data-main-footer]"),d=e("[data-msg]"),r=e("[data-phone-display]"),l=e("[data-resend-btn]"),v=e("[data-timer]"),N=e("[data-back-btn]");let f="",$="",B="",x=null;function C(I="",h="info"){d&&(d.textContent=I,d.style.display=I?"block":"none",d.style.color=h==="error"?"#b42318":h==="success"?"#626a4e":"#111111")}function y(I=60){x&&clearInterval(x);let h=I;l.disabled=!0;const m=()=>{if(h<=0){clearInterval(x),x=null,l.disabled=!1,v.textContent="";return}v.textContent=`(${h}s)`,h--};m(),x=setInterval(m,1e3)}function A(){a.style.display="none",n.style.display="block",s.style.display="none",r.textContent=f,y(60),C(),setTimeout(()=>{var I;(I=o.querySelector('[name="code"]'))==null||I.focus()},100)}i==null||i.addEventListener("submit",async I=>{I.preventDefault();const h=Object.fromEntries(new FormData(i)),m=String(h.name||"").trim(),b=Va(h.phone||""),P=String(h.referral_code||"").trim().toUpperCase();if(!m){C("لطفاً نام خودت رو وارد کن.","error");return}if(!Ka(b)){C(W("auth.msg_invalid_phone","شماره موبایل معتبر نیست."),"error");return}const E=e("[data-submit-btn]");St(E,!0);try{await tt.registerSendCode(m,b,P),$=m,f=b,B=P,A()}catch(M){C(M.message||W("auth.msg_error_send","ارسال کد با خطا مواجه شد."),"error")}finally{St(E,!1)}}),o==null||o.addEventListener("submit",async I=>{var b;I.preventDefault();const h=Ft(new FormData(o).get("code")||"").trim();if(!/^\d{6}$/.test(h)){C(W("auth.msg_otp_incomplete","کد شش‌رقمی را وارد کن."),"error");return}const m=e("[data-otp-submit]");St(m,!0);try{const P=await tt.registerVerify(f,h),E=Qa(P),M=(P==null?void 0:P.user)||((b=P==null?void 0:P.data)==null?void 0:b.user)||{name:$,phone:f};if(!E)throw new Error(W("auth.msg_error_verify","تأیید کد ناموفق بود."));zt(E,M),C(W("auth.msg_register_success","ثبت‌نام با موفقیت انجام شد."),"success"),setTimeout(()=>{var H,V;(V=(H=window.__app)==null?void 0:H.router)==null||V.navigate("/dashboard")},800)}catch(P){C(P.message||W("auth.msg_error_verify","کد تأیید نامعتبر است."),"error")}finally{St(m,!1)}}),l==null||l.addEventListener("click",async()=>{if(!(l.disabled||!f)){l.disabled=!0;try{await tt.registerSendCode($,f,B),C(W("auth.msg_otp_resent","کد جدید ارسال شد."),"success"),y(60)}catch(I){l.disabled=!1,C(I.message||"خطا در ارسال مجدد کد.","error")}}}),N==null||N.addEventListener("click",()=>{x&&clearInterval(x),x=null,n.style.display="none",a.style.display="block",s.style.display="flex",o.reset(),C()}),(O=o==null?void 0:o.querySelector('[name="code"]'))==null||O.addEventListener("input",I=>{I.target.value=Ft(I.target.value).replace(/\D/g,"").slice(0,6)})}const T=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),at=t=>String(t).replace(/\d/g,e=>"۰۱۲۳۴۵۶۷۸۹"[e]),lt=t=>new Intl.NumberFormat("fa-IR").format(Number(t||0)),qe=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],Xa=new Intl.DateTimeFormat("en-US-u-ca-persian",{timeZone:"UTC",year:"numeric",month:"numeric",day:"numeric"}),tn=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Tehran",year:"numeric",month:"2-digit",day:"2-digit"});function Ne(t,e){const a=t.formatToParts(e),n=i=>{var o;return Number((o=a.find(s=>s.type===i))==null?void 0:o.value)};return{year:n("year"),month:n("month"),day:n("day")}}function en({year:t,month:e,day:a}){return[String(t).padStart(4,"0"),String(e).padStart(2,"0"),String(a).padStart(2,"0")].join("-")}function Pe(){return en(Ne(tn,new Date))}function te(t){return new Date(`${String(t).slice(0,10)}T12:00:00Z`)}function ge(t,e){const a=te(t);return a.setUTCDate(a.getUTCDate()+e),a.toISOString().slice(0,10)}function Tt(t){return Ne(Xa,te(t))}function ft(t){if(!t)return"—";try{const{year:e,month:a,day:n}=Tt(t);return`${at(n)} ${qe[a-1]} ${at(e)}`}catch{return String(t)}}function an(t=0){const e=Tt(Pe()),a=e.year*12+e.month-1+t,n=Math.floor(a/12),i=(a%12+12)%12+1;let o=`${n+621}-03-15`,s=null;for(let r=0;r<380;r++){const l=Tt(o);if(l.year===n&&l.month===i&&l.day===1){s=o;break}o=ge(o,1)}if(!s)throw new Error("Unable to calculate Persian calendar");const d=[];for(o=s;d.length<31;){const r=Tt(o);if(r.year!==n||r.month!==i)break;d.push({iso:o,day:r.day,weekday:te(o).getUTCDay()}),o=ge(o,1)}return{year:n,month:i,days:d}}function mt(t){const e=String(t||"").match(/^(\d{1,2}):(\d{2})/);if(!e)return null;const a=Number(e[1]),n=Number(e[2]);return a<0||a>23||n<0||n>59?null:a*60+n}function pe(t){if(!Number.isFinite(t)||t<0||t>=1440)return null;const e=Math.floor(t/60),a=t%60;return String(e).padStart(2,"0")+":"+String(a).padStart(2,"0")}function jt(t,e){var a,n;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((a=t==null?void 0:t.data)==null?void 0:a[e])?t.data[e]:Array.isArray((n=t==null?void 0:t.data)==null?void 0:n.data)?t.data.data:Array.isArray(t==null?void 0:t[e])?t[e]:[]}function nn(t){var e,a,n,i;return((a=(e=t==null?void 0:t.data)==null?void 0:e.booking)==null?void 0:a.id)??((n=t==null?void 0:t.data)==null?void 0:n.id)??((i=t==null?void 0:t.booking)==null?void 0:i.id)??(t==null?void 0:t.booking_id)??null}function on(t){return jt(t,"slots").filter(e=>e&&e.start_time&&e.end_time&&Array.isArray(e.staff_ids)).map(e=>({...e,start_time:String(e.start_time).slice(0,5),end_time:String(e.end_time).slice(0,5),staff_ids:[...new Set(e.staff_ids.map(Number).filter(a=>Number.isInteger(a)&&a>0))]})).filter(e=>e.staff_ids.length>0).sort((e,a)=>e.start_time.localeCompare(a.start_time)||e.end_time.localeCompare(a.end_time))}function ve(t){const e=(t==null?void 0:t.booking_services)||(t==null?void 0:t.services)||[];return Array.isArray(e)?[...e].sort((a,n)=>String(a.start_time||"").localeCompare(String(n.start_time||""))):[]}function _t(t){if(!["confirmed","pending","awaiting_payment"].includes(t.status))return!1;const a=String(t.booking_date||"").slice(0,10),n=String(t.start_time||"").slice(0,5);if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!/^\d{2}:\d{2}$/.test(n))return!1;const i=new Date(`${a}T${n}:00+03:30`);return Number.isFinite(i.getTime())&&i.getTime()-Date.now()>=24*60*60*1e3}async function sn(){if(!Xt())return queueMicrotask(()=>{var i,o;(o=(i=window.__app)==null?void 0:i.router)==null||o.navigate("/login")}),G(`
      <div class="nil-loading">
        در حال انتقال به ورود...
      </div>
    `);const t=Te(),e=Z()==="fa",a=(i,o)=>e?i:o,n=G(`
    <main
      class="nil-dashboard"
      data-nil-dashboard
      dir="${e?"rtl":"ltr"}"
    >
      <div class="nil-shell">

        <!-- HEADER -->
        <header class="nil-topbar">
          <div class="nil-brand">
            <div>
              <strong>NIL BEAUTY</strong>
              <small>
                ${a("پنل مشتریان","Customer dashboard")}
              </small>
            </div>
          </div>

          <button
            type="button"
            class="nil-icon-btn"
            data-nil-logout
            title="${a("خروج","Logout")}"
          >
            ↪
          </button>
        </header>

        <!-- WELCOME -->
        <section class="nil-welcome">
          <div>
            <span class="nil-eyebrow">
              YOUR BEAUTY, YOUR TIME
            </span>

            <h1>
              ${a("سلام","Hello")}،
              ${T((t==null?void 0:t.name)||a("عزیز","there"))}
              <span>✦</span>
            </h1>

            <p>
              ${a("زیبایی از زمانی شروع می‌شود که برای خودت می‌گذاری.","Beauty begins with time for yourself.")}
            </p>
          </div>

          <div class="nil-welcome-mark">✳</div>
        </section>

        <!-- TABS -->
        <nav class="nil-tabs">
          <button
            type="button"
            class="active"
            data-nil-tab="services"
          >
            <span>✦</span>
            ${a("رزرو خدمات","Book services")}
          </button>

          <button
            type="button"
            data-nil-tab="bookings"
          >
            <span>◷</span>
            ${a("نوبت‌های من","Appointments")}
          </button>

          <button
            type="button"
            data-nil-tab="profile"
          >
            <span>♙</span>
            ${a("پروفایل","Profile")}
          </button>
        </nav>

        <!-- SERVICES -->
        <section
          class="nil-panel"
          data-nil-panel="services"
        >
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">
                EXPLORE SERVICES
              </span>

              <h2>
                ${a("خدمات زیبایی","Beauty services")}
              </h2>

              <p>
                ${a("می‌توانی یک یا چند خدمت انتخاب کنی","Select one or more services")}
              </p>
            </div>
          </div>

          <div
            class="nil-service-grid"
            data-nil-services
          >
            <div class="nil-loading">
              ${a("در حال دریافت خدمات...","Loading services...")}
            </div>
          </div>
        </section>

        <!-- MY BOOKINGS -->
        <section
          class="nil-panel"
          data-nil-panel="bookings"
          hidden
        >
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">
                MY APPOINTMENTS
              </span>

              <h2>
                ${a("نوبت‌های من","My appointments")}
              </h2>
            </div>

            <button
              type="button"
              class="nil-text-btn"
              data-nil-refresh
            >
              ${a("بروزرسانی ↻","Refresh ↻")}
            </button>
          </div>

          <div
            class="nil-bookings"
            data-nil-bookings
          ></div>
        </section>

        <!-- PROFILE -->
        <section
          class="nil-panel"
          data-nil-panel="profile"
          hidden
        >
          <div class="nil-section-head">
            <div>
              <span class="nil-eyebrow">
                MY ACCOUNT
              </span>

              <h2>
                ${a("حساب کاربری","My account")}
              </h2>
            </div>
          </div>

          <div data-nil-profile></div>
        </section>
      </div>

      <!-- SELECTED SERVICES -->
      <div
        class="nil-selection"
        data-nil-selection
        hidden
      >
        <div class="nil-selection-inner">
          <div>
            <small data-nil-selection-count></small>
            <strong data-nil-selection-total></strong>
          </div>

          <button
            type="button"
            class="nil-btn nil-btn-dark"
            data-nil-continue
          >
            ${a("ادامه رزرو","Continue")} ←
          </button>
        </div>
      </div>

      <!-- BOOKING MODAL -->
      <div
        class="nil-modal"
        data-nil-modal
        hidden
      >
        <div
          class="nil-modal-shade"
          data-nil-close
        ></div>

        <section
          class="nil-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="${a("رزرو نوبت","Book appointment")}"
        >
          <div class="nil-dialog-header">
            <div>
              <span class="nil-eyebrow">
                BOOK YOUR APPOINTMENT
              </span>

              <h2>
                ${a("رزرو نوبت","Book appointment")}
              </h2>
            </div>

            <button
              type="button"
              class="nil-icon-btn"
              data-nil-close
            >
              ✕
            </button>
          </div>

          <div class="nil-progress">
            <span
              data-nil-progress="1"
              class="active"
            ></span>

            <span data-nil-progress="2"></span>
            <span data-nil-progress="3"></span>
          </div>

          <div class="nil-dialog-body">

            <!-- STEP 1 -->
            <div data-nil-step="1">
              <h3>
                ${a("چه روزی برات مناسبه؟","Choose a date")}
              </h3>

              <p class="nil-muted">
                ${a("از تقویم شمسی تاریخ دلخواهت رو انتخاب کن","Select your preferred date")}
              </p>

              <div data-nil-calendar></div>
            </div>

            <!-- STEP 2 -->
            <div data-nil-step="2" hidden>
              <h3>
                ${a("انتخاب ساعت خدمات","Choose service times")}
              </h3>

              <p
                class="nil-muted"
                data-nil-date-label
              ></p>

              <div
                class="nil-time-grid"
                data-nil-times
              ></div>
            </div>

            <!-- STEP 3 -->
            <div data-nil-step="3" hidden>
              <h3>
                ${a("تأیید اطلاعات","Confirm booking")}
              </h3>

              <div data-nil-summary></div>

              <div data-nil-discount-wrapper>
                <label
                  class="nil-field-label"
                  for="nil-booking-discount-code"
                >
                  ${a("کد تخفیف (اختیاری)","Discount code (optional)")}
                </label>

                <input
                  id="nil-booking-discount-code"
                  class="nil-input"
                  data-nil-booking-discount-code
                  type="text"
                  maxlength="100"
                  autocomplete="off"
                  placeholder="${a("کد تخفیف را وارد کنید","Enter discount code")}"
                />

                <p class="nil-muted">
                  ${a("اعتبار کد و مبلغ نهایی هنگام ثبت رزرو توسط سرور بررسی می‌شود.","The server validates the discount when creating your booking.")}
                </p>
              </div>

              <label
                class="nil-field-label"
                for="nil-notes"
              >
                ${a("توضیحات (اختیاری)","Notes (optional)")}
              </label>

              <textarea
                id="nil-notes"
                class="nil-input"
                data-nil-notes
                rows="3"
                placeholder="${a("توضیحات شما...","Your notes...")}"
              ></textarea>
            </div>

            <p
              class="nil-feedback"
              data-nil-message
              hidden
            ></p>
          </div>

          <div class="nil-dialog-footer">
            <button
              type="button"
              class="nil-btn nil-btn-light"
              data-nil-back
              hidden
            >
              ${a("بازگشت","Back")}
            </button>

            <button
              type="button"
              class="nil-btn nil-btn-dark"
              data-nil-next
              disabled
            >
              ${a("ادامه","Continue")}
            </button>
          </div>
        </section>
      </div>
    </main>
  `);return setTimeout(()=>{const i=document.querySelector("[data-nil-dashboard]");i&&(K(),rn(i,e))},100),n}function rn(t,e){if(t.dataset.initialized==="1")return;t.dataset.initialized="1";const a=c=>t.querySelector(c),n=c=>[...t.querySelectorAll(c)],i=(c,p)=>e?c:p;let o=[],s=[],d=null,r=null,l=null,v=[],N=0,f=0,$=1,B=!1,x=!1,C=0,y=null,A=[],O=null;const I=a("[data-nil-modal]"),h=a("[data-nil-next]"),m=a("[data-nil-back]");function b(c="",p=!0){const k=a("[data-nil-message]");k.textContent=c,k.hidden=!c,k.classList.toggle("error",p)}function P(){y=null,A=[],O=null,d=null}function E(){l=null,v=[],N=0}function M(){let c=x;$===1&&(c||(c=!r)),$===2&&(c||(c=B||!(l!=null&&l.staff_id)||!(l!=null&&l.start_time))),$===3&&(c||(c=!r||v.length!==s.length||s.some((p,k)=>{const w=v[k];return String(w==null?void 0:w.service_id)!==String(p.id)||!(w!=null&&w.staff_id)||!(w!=null&&w.start_time)}))),h.disabled=c}function H(c){$=c,b(),n("[data-nil-step]").forEach(p=>{p.hidden=Number(p.dataset.nilStep)!==c}),n("[data-nil-progress]").forEach(p=>{p.classList.toggle("active",Number(p.dataset.nilProgress)<=c)}),m.hidden=c===1,h.textContent=c===3?y?i("تأیید جابجایی","Confirm reschedule"):i("ثبت نوبت","Book now"):i("ادامه","Continue"),M()}function V(c){n("[data-nil-tab]").forEach(p=>{p.classList.toggle("active",p.dataset.nilTab===c)}),n("[data-nil-panel]").forEach(p=>{p.hidden=p.dataset.nilPanel!==c}),c==="bookings"&&It(),c==="profile"&&qt()}n("[data-nil-tab]").forEach(c=>{c.addEventListener("click",()=>{V(c.dataset.nilTab)})}),a("[data-nil-refresh]").addEventListener("click",It),a("[data-nil-logout]").addEventListener("click",async()=>{var c,p;if(confirm(i("خارج می‌شوی؟","Log out?"))){try{await la()}catch(k){console.error("Logout error:",k)}(p=(c=window.__app)==null?void 0:c.router)==null||p.navigate("/login")}});async function et(){const c=a("[data-nil-services]");try{const p=await na.list();o=jt(p,"services").filter(k=>![!1,0,"0"].includes(k.is_active)),gt()}catch(p){c.innerHTML=`
        <div class="nil-empty">
          ${T(p.message)}
        </div>
      `}}function gt(){const c=a("[data-nil-services]");if(!o.length){c.innerHTML=`
        <div class="nil-empty">
          ${i("خدمتی موجود نیست","No services available")}
        </div>
      `;return}c.innerHTML=o.map((p,k)=>{const w=s.some(g=>String(g.id)===String(p.id));return`
        <button
          type="button"
          class="nil-service ${w?"selected":""}"
          data-service-id="${T(p.id)}"
          aria-pressed="${w}"
        >
          <div class="nil-service-top">
            <span class="nil-service-number">
              ${String(k+1).padStart(2,"0")}
            </span>

            <span class="nil-service-check">
              ${w?"✓":"+"}
            </span>
          </div>

          <div class="nil-service-symbol">✧</div>

          <div class="nil-service-info">
            <h3>
              ${T(p.name)}
            </h3>

            <p>
              ${T(p.description||i("خدمات زیبایی نیل","NIL beauty service"))}
            </p>

            <div class="nil-service-meta">
              <span>
                ◷ ${at(p.duration||0)}
                ${i("دقیقه","min")}
              </span>

              <strong>
                ${lt(p.price)}
                ${i("تومان","Toman")}
              </strong>
            </div>
          </div>
        </button>
      `}).join(""),c.querySelectorAll("[data-service-id]").forEach(p=>{p.addEventListener("click",()=>{const k=o.find(g=>String(g.id)===p.dataset.serviceId);if(!k)return;s.some(g=>String(g.id)===String(k.id))?s=s.filter(g=>String(g.id)!==String(k.id)):s.push(k),gt(),$t()})})}function $t(){const c=s.length;a("[data-nil-selection]").hidden=c===0,a("[data-nil-selection-count]").textContent=i(`${at(c)} خدمت انتخاب شده`,`${c} selected services`);const p=s.reduce((k,w)=>k+Number(w.price||0),0);a("[data-nil-selection-total]").textContent=`${lt(p)} ${i("تومان","Toman")}`}a("[data-nil-continue]").addEventListener("click",Be);function Be(){if(!s.length)return;P(),E(),r=null,f=0,C++,B=!1,a("[data-nil-notes]").value="",a("[data-nil-booking-discount-code]").value="",a("[data-nil-discount-wrapper]").hidden=!1;const c=I.querySelector(".nil-dialog-header h2");c&&(c.textContent=i("رزرو نوبت","Book appointment")),I.hidden=!1,document.body.style.overflow="hidden",H(1),pt()}function Me(c){var j,L;if(!_t(c)){alert(i("جابجایی نوبت فقط تا ۲۴ ساعت قبل امکان‌پذیر است.","Rescheduling requires at least 24 hours notice."));return}const p=ve(c);if(!p.length){alert(i("اطلاعات خدمات این رزرو موجود نیست.","Booking services are unavailable."));return}const k=p[0],w=k.service_id??((j=k.service)==null?void 0:j.id),g=k.staff_id??((L=k.staff)==null?void 0:L.id),S=o.find(R=>String(R.id)===String(w));if(!S||!g){alert(i("اطلاعات خدمت یا پرسنل این رزرو کامل نیست.","Booking service or staff information is incomplete."));return}if(!p.every(R=>{var _,z;return mt(R.start_time)!==null&&mt(R.end_time)!==null&&(R.service_id??((_=R.service)==null?void 0:_.id))!=null&&(R.staff_id??((z=R.staff)==null?void 0:z.id))!=null})){alert(i("اطلاعات زمان‌بندی بعضی خدمات کامل نیست.","Some service scheduling details are missing."));return}d=[...s],y=c,A=p,O=Number(g),s=[S],r=null,E(),f=0,C++,B=!1,a("[data-nil-notes]").value=c.notes||"",a("[data-nil-booking-discount-code]").value="",a("[data-nil-discount-wrapper]").hidden=!0;const D=I.querySelector(".nil-dialog-header h2");D&&(D.textContent=i(p.length>1?"جابجایی رزرو چندخدمتی":"جابجایی نوبت",p.length>1?"Reschedule multiple services":"Reschedule appointment")),I.hidden=!1,document.body.style.overflow="hidden",H(1),pt()}function De(){if(x)return;C++,B=!1,y&&(s=d||[],gt(),$t()),P(),E(),r=null,I.hidden=!0,document.body.style.overflow="";const c=I.querySelector(".nil-dialog-header h2");c&&(c.textContent=i("رزرو نوبت","Book appointment")),H(1)}n("[data-nil-close]").forEach(c=>{c.addEventListener("click",De)});function pt(){var S,q;const c=a("[data-nil-calendar]");let p;try{p=an(f)}catch(D){c.textContent=D.message;return}const k=Pe(),w=e?["ش","ی","د","س","چ","پ","ج"]:["Sa","Su","Mo","Tu","We","Th","Fr"],g=(p.days[0].weekday+1)%7;c.innerHTML=`
      <div class="nil-calendar">

        <div class="nil-calendar-head">
          <button
            type="button"
            data-month-prev
            ${f===0?"disabled":""}
          >
            →
          </button>

          <div>
            <strong>
              ${qe[p.month-1]}
              ${at(p.year)}
            </strong>

            <small>
              ${i("انتخاب تاریخ نوبت","Select a date")}
            </small>
          </div>

          <button
            type="button"
            data-month-next
          >
            ←
          </button>
        </div>

        <div class="nil-weekdays">
          ${w.map(D=>`
            <span>${D}</span>
          `).join("")}
        </div>

        <div class="nil-calendar-grid">
          ${Array(g).fill("<span></span>").join("")}

          ${p.days.map(D=>{const j=D.iso<k,L=D.iso===k,R=D.iso===r;return`
              <button
                type="button"
                data-calendar-date="${D.iso}"
                class="
                  ${L?"today":""}
                  ${R?"active":""}
                "
                ${j?"disabled":""}
              >
                ${at(D.day)}
                ${L?"<i></i>":""}
              </button>
            `}).join("")}
        </div>

        <div class="nil-calendar-note">
          <span class="nil-calendar-dot"></span>
          ${i("تاریخ امروز مشخص شده است","Today is marked")}
        </div>

      </div>
    `,(S=c.querySelector("[data-month-prev]"))==null||S.addEventListener("click",()=>{f<=0||(f--,pt())}),(q=c.querySelector("[data-month-next]"))==null||q.addEventListener("click",()=>{f++,pt()}),c.querySelectorAll("[data-calendar-date]:not(:disabled)").forEach(D=>{D.addEventListener("click",()=>{r=D.dataset.calendarDate,E(),pt(),M()})})}async function kt(){const c=a("[data-nil-times]"),p=++C,k=s[N];if(l=v[N]||null,B=!0,M(),!r||!k){B=!1,c.innerHTML=`
        <div class="nil-empty">
          ${i("اطلاعات انتخاب خدمت کامل نیست.","Service selection is incomplete.")}
        </div>
      `,M();return}const w=!!y,g=w?i("ساعت شروع جدید رزرو","New booking start time"):s.length>1?i(`خدمت ${at(N+1)} از ${at(s.length)}`,`Service ${N+1} of ${s.length}`):i("انتخاب ساعت","Choose a time");a("[data-nil-date-label]").textContent=`${ft(r)} — ${g}: ${k.name}`;const S=v[N-1],q=w?null:(S==null?void 0:S.end_time)||null,D=w?"":v.slice(0,N).map((L,R)=>{var _;return`
            <div
              class="nil-summary-row"
              style="margin-bottom:6px"
            >
              <span>
                ${T(((_=s[R])==null?void 0:_.name)||"")}
              </span>

              <strong>
                ${T(L.start_time)}
                -
                ${T(L.end_time)}
              </strong>
            </div>
          `}).join(""),j=D?`
        <div
          class="nil-summary"
          style="grid-column:1/-1;margin-bottom:16px"
        >
          ${D}
        </div>
      `:"";c.innerHTML=`
      ${j}

      <div
        class="nil-loading"
        style="grid-column:1/-1"
      >
        ${i("در حال بررسی ساعت‌های آزاد...","Checking available times...")}
      </div>
    `;try{const L=await ia.check(null,k.id,r,30);if(p!==C)return;const R=on(L).filter(_=>{const z=!q||_.start_time>=q,rt=!w||_.staff_ids.includes(O);return z&&rt});if(l&&!R.some(_=>_.start_time===l.start_time&&_.end_time===l.end_time&&_.staff_ids.includes(Number(l.staff_id)))&&(l=null,v=v.slice(0,N),M()),!R.length){c.innerHTML=`
          ${j}

          <div
            class="nil-empty"
            style="grid-column:1/-1"
          >
            ${w?i("برای پرسنل فعلی در این تاریخ ساعت آزادی پیدا نشد. تاریخ دیگری انتخاب کن.","No available times for the assigned staff on this date."):q?i(`برای ${T(k.name)} بعد از ساعت ${T(q)} زمان آزادی پیدا نشد.`,`No available time for ${T(k.name)} after ${T(q)}.`):i("برای این روز ساعت آزادی پیدا نشد.","No available times for this date.")}
          </div>
        `;return}c.innerHTML=`
        ${j}

        <p
          class="nil-muted"
          style="grid-column:1/-1;margin-bottom:12px"
        >
          ${w?i("انتخاب ساعت شروع جدید تمام خدمات:","Choose the new start time for all services:"):i("ساعت خدمت:","Time for:")}

          <strong>
            ${T(k.name)}
          </strong>
        </p>

        ${R.map((_,z)=>{const rt=(l==null?void 0:l.start_time)===_.start_time&&(l==null?void 0:l.end_time)===_.end_time;return`
            <button
              type="button"
              class="nil-time ${rt?"active":""}"
              data-slot-index="${z}"
              aria-pressed="${rt}"
            >
              <span>
                ◷ ${T(_.start_time)}
              </span>

              <small
                style="
                  display:block;
                  margin-top:6px;
                  opacity:.65;
                  font-size:11px;
                "
              >
                ${i("تا","to")}
                ${T(_.end_time)}
              </small>
            </button>
          `}).join("")}
      `,c.querySelectorAll("[data-slot-index]").forEach(_=>{_.addEventListener("click",()=>{var rt;const z=R[Number(_.dataset.slotIndex)];(rt=z==null?void 0:z.staff_ids)!=null&&rt.length&&(l={service_id:k.id,start_time:z.start_time,end_time:z.end_time,duration:z.duration,staff_ids:z.staff_ids,staff_id:w?O:z.staff_ids[0]},v=v.slice(0,N),v[N]=l,c.querySelectorAll("[data-slot-index]").forEach(Nt=>{const ae=Nt===_;Nt.classList.toggle("active",ae),Nt.setAttribute("aria-pressed",String(ae))}),M())})})}catch(L){if(p!==C)return;console.error("Availability error:",L),c.innerHTML=`
        ${j}

        <div
          class="nil-empty"
          style="grid-column:1/-1"
        >
          ${T(L.message||i("خطا در دریافت ساعت‌ها","Failed to load times"))}
        </div>
      `}finally{p===C&&(B=!1,M())}}function ee(){var g,S,q;if(!y||!A.length||!(l!=null&&l.start_time))return null;const c=mt(A[0].start_time),p=mt(l.start_time);if(c===null||p===null)return null;const k=p-c,w=[];for(const D of A){const j=mt(D.start_time),L=mt(D.end_time);if(j===null||L===null||L<=j)return null;const R=pe(j+k),_=pe(L+k);if(!R||!_)return null;w.push({service_id:D.service_id??((g=D.service)==null?void 0:g.id),staff_id:D.staff_id??((S=D.staff)==null?void 0:S.id),name:((q=D.service)==null?void 0:q.name)||D.service_name||D.name||i("خدمت","Service"),oldStart:String(D.start_time).slice(0,5),oldEnd:String(D.end_time).slice(0,5),newStart:R,newEnd:_})}return w}function Re(){if(y){const g=ee();return g?(a("[data-nil-summary]").innerHTML=`
        <div class="nil-summary">

          <div class="nil-summary-row">
            <span>
              ${i("شماره رزرو","Booking number")}
            </span>

            <strong>
              #${T(y.id)}
            </strong>
          </div>

          <div class="nil-summary-row">
            <span>
              ${i("تاریخ قبلی","Previous date")}
            </span>

            <strong>
              ${ft(y.booking_date)}
            </strong>
          </div>

          <div class="nil-summary-row">
            <span>
              ${i("تاریخ جدید","New date")}
            </span>

            <strong>
              ${ft(r)}
            </strong>
          </div>

          <div
            style="
              margin:16px 0 8px;
              font-weight:600;
            "
          >
            ${i("زمان‌بندی جدید خدمات","New service schedule")}
          </div>

          ${g.map((S,q)=>`
            <div class="nil-summary-row">
              <span>
                <strong>
                  ${at(q+1)}.
                  ${T(S.name)}
                </strong>

                <small
                  style="
                    display:block;
                    margin-top:5px;
                    opacity:.65;
                  "
                >
                  ${i("قبلی","Previous")}:
                  ${T(S.oldStart)}
                  -
                  ${T(S.oldEnd)}
                </small>
              </span>

              <strong>
                ${T(S.newStart)}
                -
                ${T(S.newEnd)}
              </strong>
            </div>
          `).join("")}

          <p
            class="nil-muted"
            style="margin-top:16px"
          >
            ${i("ترتیب، مدت و پرسنل خدمات باید حفظ شود. ظرفیت تمام خدمات هنگام ثبت نهایی توسط سرور بررسی می‌شود.","Service order, duration and staff must be preserved. The server validates availability for every service.")}
          </p>

        </div>
      `,!0):(a("[data-nil-summary]").innerHTML="",b(i("زمان انتخاب‌شده معتبر نیست یا باعث می‌شود یکی از خدمات از محدوده همان روز خارج شود.","The selected time is invalid or a service would extend beyond the day.")),!1)}const c=s.reduce((g,S)=>g+Number(S.price||0),0),p=s.reduce((g,S)=>g+Number(S.deposit_amount||0),0),k=v[0],w=v[v.length-1];return a("[data-nil-summary]").innerHTML=`
      <div class="nil-summary">

        ${s.map((g,S)=>{const q=v[S];return`
            <div class="nil-summary-row">
              <span>
                ${T(g.name)}

                <small
                  style="
                    display:block;
                    opacity:.7;
                  "
                >
                  ◷
                  ${T((q==null?void 0:q.start_time)||"-")}
                  -
                  ${T((q==null?void 0:q.end_time)||"-")}
                </small>
              </span>

              <strong>
                ${lt(g.price)}
                ${i("تومان","Toman")}
              </strong>
            </div>
          `}).join("")}

        <div class="nil-summary-row">
          <span>
            ${i("تاریخ","Date")}
          </span>

          <strong>
            ${ft(r)}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>
            ${i("شروع اولین خدمت","First service starts")}
          </span>

          <strong>
            ${T((k==null?void 0:k.start_time)||"-")}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>
            ${i("پایان آخرین خدمت","Last service ends")}
          </span>

          <strong>
            ${T((w==null?void 0:w.end_time)||"-")}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>
            ${i("بیعانه پیش از تخفیف","Deposit before discount")}
          </span>

          <strong>
            ${lt(p)}
            ${i("تومان","Toman")}
          </strong>
        </div>

        <div class="nil-summary-row total">
          <span>
            ${i("جمع خدمات پیش از تخفیف","Total before discount")}
          </span>

          <strong>
            ${lt(c)}
            ${i("تومان","Toman")}
          </strong>
        </div>

      </div>
    `,!0}h.addEventListener("click",async()=>{if(!(x||h.disabled)){if($===1){if(!r)return;N=0,l=v[0]||null,H(2),await kt();return}if($===2){if(!(l!=null&&l.staff_id))return;!y&&N<s.length-1?(N++,l=v[N]||null,await kt()):Re()&&H(3);return}$===3&&(y?await Ue():await Oe())}}),m.addEventListener("click",async()=>{if(!(x||$<=1)){if($===3){N=s.length-1,l=v[N]||null,H(2),await kt();return}if($===2&&N>0){N--,l=v[N]||null,await kt();return}$===2&&(C++,B=!1,l=null),H(1)}});async function Oe(){var w,g,S,q,D,j;if(x)return;const c=s.length>0&&v.length===s.length&&s.every((L,R)=>{const _=v[R];return String(_==null?void 0:_.service_id)===String(L.id)&&!!(_!=null&&_.staff_id)&&!!(_!=null&&_.start_time)});if(!r||!c){b(i("اطلاعات رزرو کامل نیست.","Booking details are incomplete."));return}x=!0,M();const p=a("[data-nil-booking-discount-code]").value.trim(),k={booking_date:r,services:s.map((L,R)=>({service_id:L.id,staff_id:v[R].staff_id,start_time:v[R].start_time})),notes:a("[data-nil-notes]").value.trim()||null,discount_code:p||null,use_referral_reward:!1};try{const L=await ht.create(k);if((L==null?void 0:L.success)===!1||(L==null?void 0:L.is_status)===!1)throw new Error(L.message||"Booking failed");const R=nn(L),_=((w=L==null?void 0:L.data)==null?void 0:w.booking)||(L==null?void 0:L.data)||(L==null?void 0:L.booking)||{};if(!R){b(i("پاسخ سرور شناسه رزرو ندارد. قبل از تلاش مجدد نوبت‌های من را بررسی کن.","Booking ID is missing. Check appointments before retrying."));return}const z=_.total_amount!==void 0&&_.total_amount!==null&&Number(_.total_amount)===0&&_.status==="confirmed";s=[],r=null,E(),gt(),$t(),I.hidden=!0,document.body.style.overflow="",z?(V("bookings"),alert(i("رزرو شما با تخفیف کامل و بدون نیاز به پرداخت تأیید شد.","Your fully discounted booking was confirmed without payment."))):(S=(g=window.__app)==null?void 0:g.router)==null||S.navigate(`/checkout?booking=${encodeURIComponent(R)}`)}catch(L){console.error("Booking error:",L),console.error("BACKEND ERROR:",(q=L.response)==null?void 0:q.error),console.error("FULL RESPONSE:",L.response),b(((D=L.response)==null?void 0:D.error)||((j=L.response)==null?void 0:j.message)||L.message||i("خطا در ثبت رزرو","Booking failed"))}finally{x=!1,M()}}async function Ue(){var p,k;if(x||!y||!r||!(l!=null&&l.start_time)||!O)return;if(!_t(y)){b(i("مهلت جابجایی این نوبت تمام شده است.","The rescheduling deadline has passed."));return}const c=ee();if(!c||!c.length){b(i("زمان‌بندی جدید معتبر نیست.","The new schedule is invalid."));return}x=!0,M();try{const w={booking_date:r,start_time:l.start_time,staff_id:O},g=await ht.reschedule(y.id,w);if((g==null?void 0:g.success)===!1||(g==null?void 0:g.is_status)===!1)throw new Error(g.message||"Reschedule failed");s=d||[],P(),E(),r=null,C++,B=!1,gt(),$t(),I.hidden=!0,document.body.style.overflow="";const S=I.querySelector(".nil-dialog-header h2");S&&(S.textContent=i("رزرو نوبت","Book appointment")),V("bookings"),alert(i("درخواست جابجایی رزرو با موفقیت ثبت شد.","The booking reschedule request was successful."))}catch(w){console.error("Multi-service reschedule error:",w),b(((p=w.response)==null?void 0:p.error)||((k=w.response)==null?void 0:k.message)||w.message||i("خطا در جابجایی رزرو","Failed to reschedule booking"))}finally{x=!1,M()}}async function It(){const c=a("[data-nil-bookings]");c.innerHTML=`
      <div class="nil-loading">
        ${i("در حال دریافت نوبت‌ها...","Loading appointments...")}
      </div>
    `;try{const p=await ht.list(),k=jt(p,"bookings");if(!k.length){c.innerHTML=`
          <div class="nil-empty">
            ${i("هنوز نوبتی ثبت نکردی.","No appointments yet.")}
          </div>
        `;return}const w={confirmed:i("تأیید شده","Confirmed"),awaiting_payment:i("در انتظار پرداخت","Awaiting payment"),pending:i("در انتظار","Pending"),cancelled:i("لغو شده","Cancelled"),completed:i("انجام شده","Completed")};c.innerHTML=k.map(g=>{const S=ve(g),D=S.map(_=>{var z;return((z=_.service)==null?void 0:z.name)||_.service_name||_.name}).filter(Boolean).join(" + ")||i("نوبت زیبایی","Beauty appointment"),j=_t(g),L=g.total_amount??g.subtotal??0,R=Number(g.discount_amount||0);return`
          <article class="nil-booking-card">

            <div class="nil-booking-top">
              <div>
                <small>
                  ${ft(g.booking_date)}
                </small>

                <h3>
                  ${T(D)}
                </h3>

                ${S.length>1?`
                  <small
                    style="
                      display:block;
                      margin-top:6px;
                      opacity:.7;
                    "
                  >
                    ${i(`${at(S.length)} خدمت در یک رزرو`,`${S.length} services in one booking`)}
                  </small>
                `:""}
              </div>

              <span class="nil-status">
                ${T(w[g.status]||g.status||"-")}
              </span>
            </div>

            <div class="nil-booking-bottom">
              <span>
                ◷
                ${T(String(g.start_time||"").slice(0,5))}
              </span>

              <strong>
                ${lt(L)}
                ${i("تومان","Toman")}
              </strong>
            </div>

            ${R>0?`
              <div class="nil-booking-bottom">
                <span>
                  ${i("تخفیف اعمال‌شده","Applied discount")}
                </span>

                <strong>
                  ${lt(R)}
                  ${i("تومان","Toman")}
                </strong>
              </div>
            `:""}

            ${S.length>1?`
              <div
                class="nil-summary"
                style="margin-top:12px"
              >
                ${S.map(_=>{var z;return`
                  <div class="nil-summary-row">
                    <span>
                      ${T(((z=_.service)==null?void 0:z.name)||_.service_name||_.name||i("خدمت","Service"))}
                    </span>

                    <strong>
                      ${T(String(_.start_time||"").slice(0,5))}
                      -
                      ${T(String(_.end_time||"").slice(0,5))}
                    </strong>
                  </div>
                `}).join("")}
              </div>
            `:""}

            <div class="nil-booking-actions">

              ${g.status==="awaiting_payment"?`
                <button
                  type="button"
                  data-booking-pay="${T(g.id)}"
                >
                  ${i("ادامه پرداخت","Continue payment")}
                </button>
              `:""}

              ${j?`
                <button
                  type="button"
                  class="nil-reschedule-btn"
                  data-booking-reschedule="${T(g.id)}"
                >
                  ◷
                  ${i("تغییر تاریخ و ساعت","Reschedule")}
                </button>

                <button
                  type="button"
                  data-booking-cancel="${T(g.id)}"
                >
                  ${i("لغو نوبت","Cancel")}
                </button>
              `:""}

            </div>
          </article>
        `}).join(""),c.querySelectorAll("[data-booking-reschedule]").forEach(g=>{g.addEventListener("click",()=>{const S=k.find(q=>String(q.id)===g.dataset.bookingReschedule);S&&Me(S)})}),c.querySelectorAll("[data-booking-pay]").forEach(g=>{g.addEventListener("click",()=>{var S,q;(q=(S=window.__app)==null?void 0:S.router)==null||q.navigate(`/checkout?booking=${encodeURIComponent(g.dataset.bookingPay)}`)})}),c.querySelectorAll("[data-booking-cancel]").forEach(g=>{g.addEventListener("click",async()=>{const S=k.find(q=>String(q.id)===g.dataset.bookingCancel);if(S){if(!_t(S)){alert(i("لغو نوبت فقط تا ۲۴ ساعت قبل امکان‌پذیر است.","Cancellation requires at least 24 hours notice."));return}if(confirm(i("آیا از لغو این نوبت مطمئن هستید؟","Are you sure you want to cancel this appointment?"))){g.disabled=!0;try{const q=await ht.cancel(S.id);if((q==null?void 0:q.success)===!1||(q==null?void 0:q.is_status)===!1)throw new Error(q.message||"Cancellation failed");await It(),alert(i("نوبت شما با موفقیت لغو شد.","Your appointment was cancelled successfully."))}catch(q){console.error("Cancel booking error:",q),alert(q.message||i("خطا در لغو نوبت","Cancellation failed")),g.isConnected&&(g.disabled=!1)}}}})})}catch(p){console.error("Load bookings error:",p),c.innerHTML=`
        <div class="nil-empty">
          ${T(p.message)}
        </div>
      `}}async function qt(){var p,k;const c=a("[data-nil-profile]");c.innerHTML=`
      <div class="nil-loading">
        ${i("در حال بارگذاری...","Loading...")}
      </div>
    `;try{const w=await ne.get(),g=((p=w==null?void 0:w.data)==null?void 0:p.client)||(w==null?void 0:w.data)||{};c.innerHTML=`
        <div class="nil-profile-card">

          <div class="nil-profile-head">
            <div class="nil-avatar">
              ${T(String(g.name||"?").charAt(0))}
            </div>

            <div>
              <h3>
                ${T(g.name||"-")}
              </h3>

              <p>
                ${T(g.phone||"-")}
              </p>
            </div>
          </div>

          <div class="nil-profile-field">
            <span>
              ${i("نام","Name")}
            </span>

            <strong>
              ${T(g.name||"-")}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>
              ${i("ایمیل","Email")}
            </span>

            <strong>
              ${T(g.email||"-")}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>
              ${i("شماره موبایل","Phone")}
            </span>

            <strong>
              ${T(g.phone||"-")}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>
              ${i("کد معرف","Referral code")}
            </span>

            <strong>
              ${T(g.referral_code||"-")}
            </strong>
          </div>

          <button
            type="button"
            class="nil-btn nil-btn-dark"
            data-edit-profile
          >
            ${i("ویرایش اطلاعات","Edit profile")}
          </button>

        </div>
      `,(k=c.querySelector("[data-edit-profile]"))==null||k.addEventListener("click",()=>{He(g)})}catch(w){c.innerHTML=`
        <div class="nil-empty">
          ${T(w.message)}
        </div>
      `}}function He(c){const p=a("[data-nil-profile]");p.innerHTML=`
      <form
        class="nil-profile-card"
        data-profile-form
      >
        <h3>
          ${i("ویرایش پروفایل","Edit profile")}
        </h3>

        <label class="nil-field-label">
          ${i("نام","Name")}
        </label>

        <input
          class="nil-input"
          name="name"
          value="${T(c.name||"")}"
          required
        >

        <label class="nil-field-label">
          ${i("ایمیل","Email")}
        </label>

        <input
          class="nil-input"
          name="email"
          type="email"
          value="${T(c.email||"")}"
        >

        <p
          class="nil-feedback"
          data-profile-error
        ></p>

        <button
          type="submit"
          class="nil-btn nil-btn-dark"
        >
          ${i("ذخیره تغییرات","Save changes")}
        </button>

        <button
          type="button"
          class="nil-btn nil-btn-light"
          data-profile-back
        >
          ${i("بازگشت","Back")}
        </button>
      </form>
    `,p.querySelector("[data-profile-back]").addEventListener("click",qt),p.querySelector("[data-profile-form]").addEventListener("submit",async k=>{k.preventDefault();const w=k.currentTarget,g=w.querySelector('[type="submit"]');g.disabled=!0;try{await ne.update({name:w.elements.name.value.trim(),email:w.elements.email.value.trim()||null}),await qt()}catch(S){w.querySelector("[data-profile-error]").textContent=S.message,g.disabled=!1}})}et()}function it(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ln(t){if(!t||typeof t!="string")return"";const e=t.trim();if(!e)return"";try{if(/^https?:\/\//i.test(e)){const i=new URL(e),o=["localhost","127.0.0.1"];return o.includes(i.hostname.toLowerCase())&&!o.includes(window.location.hostname.toLowerCase())?"":i.href}if(e.startsWith("//"))return window.location.protocol+e;if(/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a=new URL("/api",window.location.origin),n=e.startsWith("/")?e:"/"+e;return n.startsWith("/storage/")||n.startsWith("/uploads/")?new URL(n,a.origin).href:new URL(n,window.location.origin).href}catch{return""}}function fe(t){var e;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((e=t==null?void 0:t.data)==null?void 0:e.data)?t.data.data:[]}async function cn(){const t=Z()==="fa",e=G(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">
            ${t?"نمونه کارها":"PORTFOLIO"}
          </div>
          <h1>${t?"گالری":"Gallery"}</h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="w-layout-blockcontainer container w-container">

        <div class="gallery-filters" data-gallery-filters>
          <div class="loading-placeholder">
            ${it(u("common.loading"))}
          </div>
        </div>

        <div class="gallery-grid" data-gallery-grid>
          <div class="loading-placeholder">
            ${it(u("common.loading"))}
          </div>
        </div>

      </div>
    </section>

    <div
      class="gallery-lightbox"
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label="${t?"نمایش تصویر":"Image preview"}"
      style="display:none"
    >
      <div
        class="gallery-lightbox-backdrop"
        data-lightbox-close
      ></div>

      <button
        type="button"
        class="gallery-lightbox-close"
        data-lightbox-close
        aria-label="${t?"بستن":"Close"}"
      >
        ✕
      </button>

      <img
        src=""
        alt=""
        class="gallery-lightbox-img"
        data-lightbox-img
      />
    </div>
  `);return setTimeout(()=>{document.querySelector("[data-gallery-grid]")&&(K(),dn(t))},100),e}function dn(t){const e=document.querySelector("[data-gallery-filters]"),a=document.querySelector("[data-gallery-grid]"),n=document.querySelector("[data-lightbox]"),i=document.querySelector("[data-lightbox-img]");if(!e||!a||!n||!i)return;let o=null,s=0,d=null,r="";const l=n.querySelector(".gallery-lightbox-close"),v=()=>e.isConnected&&a.isConnected&&n.isConnected;async function N(){try{const y=await Ht.categories();if(!v())return;const A=fe(y);e.innerHTML=`
        <button
          type="button"
          class="gallery-filter-btn active"
          data-category="all"
          aria-pressed="true"
        >
          ${t?"همه":"All"}
        </button>

        ${A.map(O=>`
          <button
            type="button"
            class="gallery-filter-btn"
            data-category="${it(O.id)}"
            aria-pressed="false"
          >
            ${it(O.name)}
          </button>
        `).join("")}
      `}catch(y){if(!v())return;console.error("❌ Categories error:",y),e.innerHTML=`
        <p>
          ${t?"خطا در بارگذاری دسته‌بندی‌ها":"Failed to load categories"}
        </p>
      `}}async function f(y=null){const A=++s;a.innerHTML=`
      <div class="loading-placeholder">
        ${it(u("common.loading"))}
      </div>
    `;try{const O=await Ht.list(y);if(!v()||A!==s)return;const I=fe(O);if(!I.length){a.innerHTML=`
          <div class="gallery-empty">
            <p>
              ${t?"تصویری در این دسته وجود ندارد":"No images in this category"}
            </p>
          </div>
        `;return}a.innerHTML=I.map(h=>{var E;const m=ln(h.image),b=it(h.title||""),P=it(((E=h.category)==null?void 0:E.name)||"");return m?`
          <div
            class="gallery-item"
            role="button"
            tabindex="0"
            data-image="${it(m)}"
            data-title="${b}"
            aria-label="${b||(t?"نمایش تصویر":"View image")}"
          >

            <div class="gallery-item-img">
              <img
                src="${it(m)}"
                loading="lazy"
                alt="${b}"
              />
            </div>

            <div class="gallery-item-info">
              <h3 class="gallery-item-title">
                ${b}
              </h3>

              <div class="gallery-item-category">
                ${P}
              </div>
            </div>

          </div>
        `:""}).join("")}catch(O){if(!v()||A!==s)return;console.error("❌ Gallery error:",O),a.innerHTML=`
        <p>
          ${t?"خطا در بارگذاری گالری":"Failed to load gallery"}
        </p>
      `}}e.addEventListener("click",y=>{const A=y.target.closest("[data-category]");if(!A||!e.contains(A))return;const O=A.dataset.category;O==="all"&&o===null||O!==String(o)&&(o=O==="all"?null:O,e.querySelectorAll("[data-category]").forEach(I=>{const h=I===A;I.classList.toggle("active",h),I.setAttribute("aria-pressed",String(h))}),f(o))});function $(y,A=""){!y||!v()||(d=document.activeElement,r=document.body.style.overflow,i.src=y,i.alt=A,n.style.display="flex",document.body.style.overflow="hidden",l==null||l.focus())}function B(){n.style.display==="flex"&&(n.style.display="none",i.removeAttribute("src"),document.body.style.overflow=r,d!=null&&d.isConnected&&d.focus())}a.addEventListener("click",y=>{const A=y.target.closest(".gallery-item");!A||!a.contains(A)||$(A.dataset.image,A.dataset.title)}),a.addEventListener("keydown",y=>{if(y.key!=="Enter"&&y.key!==" ")return;const A=y.target.closest(".gallery-item");!A||!a.contains(A)||(y.preventDefault(),$(A.dataset.image,A.dataset.title))}),n.addEventListener("click",y=>{y.target.closest("[data-lightbox-close]")&&B()});const x=y=>{if(!v()){document.removeEventListener("keydown",x);return}n.style.display==="flex"&&(y.key==="Escape"&&B(),y.key==="Tab"&&(y.preventDefault(),l==null||l.focus()))};document.addEventListener("keydown",x);const C=()=>{v()||(document.body.style.overflow=r,document.removeEventListener("keydown",x),window.removeEventListener("pageChanged",C))};window.addEventListener("pageChanged",C),N(),f(null)}async function un(){const t=G(`
    <div class="section" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center">
      <div>
        <h1 style="font-size:6rem;margin:0">404</h1>
        <h2>${u("not_found.title")}</h2>
        <p>${u("not_found.description")}</p>
        <a href="/" class="primary-button w-button" data-nav-link>${u("not_found.back_home")}</a>
      </div>
    </div>
  `);return queueMicrotask(()=>K()),t}const mn=(t,e)=>{const a=u(t);return a&&a!==t?a:e};function Gt(t=""){const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))}function gn(t){return Gt(t).replace(/\D/g,"")}function pn(t){return/^(09\d{9}|989\d{9})$/.test(t)}const Et={sendCode:t=>tt.forgotSendCode(t),verifyCode:(t,e)=>tt.forgotVerify(t,e),reset:(t,e,a,n)=>tt.forgotReset(t,e,a,n)};async function vn(){const t=G(`
    <div class="auth-page">

      <div class="auth-container">

        <div class="auth-mobile-brand">
         
          <img
    src="/img/logo.png"
    alt="NIL Beauty"
    class="nil-brand-logo"
    width="110"
    height="55"
  />
          <div>
            
          </div>
        </div>

        <!-- STEP 1: PHONE -->
        <section data-forgot-step="phone">

          <div class="auth-header">
            <h2> ${u("auth.forgot-title")}</h2>
            <p>
              ${u("auth.title")}
            </p>
          </div>

          <form class="auth-form" data-forgot-phone-form>

            <div class="auth-field">
              <label for="forgot-phone">
               ${u("auth.namber")}
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
${u("auth.recoverycode")}            </button>

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
  `);return setTimeout(()=>{K(),fn()},100),t}function fn(){var h;const t=document.querySelector(".auth-page");if(!t)return;const e=m=>t.querySelector(m),a=m=>t.querySelectorAll(m),n=e("[data-forgot-phone-form]"),i=e("[data-forgot-otp-form]"),o=e("[data-forgot-reset-form]"),s=e("[data-forgot-msg]"),d=e("[data-forgot-footer]"),r=e("[data-phone-display]"),l=e("[data-resend-btn]"),v=e("[data-timer]"),N=e("[data-back-phone]");let f="",$="",B=null,x=!1;function C(m){a("[data-forgot-step]").forEach(b=>{b.style.display=b.dataset.forgotStep===m?"block":"none"}),d&&(d.style.display=m==="success"?"none":"flex"),y("")}function y(m="",b="info"){s&&(s.textContent=m,s.style.display=m?"block":"none",s.style.color=b==="error"?"#b42318":b==="success"?"#626a4e":"#111111")}function A(m,b){m&&(b?(m.dataset.originalText=m.textContent,m.disabled=!0,m.textContent=mn("auth.loading","لطفاً صبر کنید...")):(m.disabled=!1,m.textContent=m.dataset.originalText||m.textContent))}function O(){B&&(clearInterval(B),B=null)}function I(m=60){O();let b=m;l.disabled=!0;const P=()=>{if(b<=0){O(),l.disabled=!1,v.textContent="";return}v.textContent=`(${b}s)`,b--};P(),B=setInterval(P,1e3)}n==null||n.addEventListener("submit",async m=>{m.preventDefault();const b=gn(new FormData(n).get("phone")||"");if(!pn(b)){y("شماره موبایل معتبر نیست.","error");return}const P=n.querySelector("[data-submit-btn]");A(P,!0);try{await Et.sendCode(b),f=b,$="",r.textContent=b,C("otp"),I(60),setTimeout(()=>{var E;(E=i.querySelector('[name="code"]'))==null||E.focus()},100)}catch(E){y(E.message||"ارسال کد بازیابی ناموفق بود.","error")}finally{A(P,!1)}}),(h=i==null?void 0:i.querySelector('[name="code"]'))==null||h.addEventListener("input",m=>{m.target.value=Gt(m.target.value).replace(/\D/g,"").slice(0,6)}),i==null||i.addEventListener("submit",async m=>{var E;m.preventDefault();const b=Gt(new FormData(i).get("code")||"").trim();if(!/^\d{6}$/.test(b)){y("کد تأیید باید شش‌رقمی باشد.","error");return}const P=i.querySelector("[data-submit-btn]");A(P,!0);try{const M=await Et.verifyCode(f,b),H=(M==null?void 0:M.reset_token)||((E=M==null?void 0:M.data)==null?void 0:E.reset_token);if(!H)throw new Error("توکن بازیابی رمز عبور از سرور دریافت نشد.");$=H,O(),C("reset")}catch(M){y(M.message||"کد تأیید نامعتبر است.","error")}finally{A(P,!1)}}),o==null||o.addEventListener("submit",async m=>{m.preventDefault();const b=Object.fromEntries(new FormData(o)),P=String(b.password||""),E=String(b.password_confirmation||"");if(P.length<8){y("رمز عبور باید حداقل ۸ کاراکتر باشد.","error");return}if(P!==E){y("رمز عبور و تکرار آن یکسان نیستند.","error");return}if(!f||!$){y("ابتدا شماره موبایل خود را تأیید کنید.","error");return}const M=o.querySelector("[data-submit-btn]");A(M,!0);try{await Et.reset(f,$,P,E),o.reset(),$="",C("success")}catch(H){y(H.message||"تغییر رمز عبور ناموفق بود.","error")}finally{A(M,!1)}}),l==null||l.addEventListener("click",async()=>{if(!(l.disabled||x||!f)){x=!0,l.disabled=!0;try{await Et.sendCode(f),$="",i.reset(),y("کد جدید ارسال شد.","success"),I(60)}catch(m){l.disabled=!1,y(m.message||"ارسال مجدد کد ناموفق بود.","error")}finally{x=!1}}}),N==null||N.addEventListener("click",()=>{O(),f="",$="",i.reset(),C("phone")})}const he=(t="")=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),hn=()=>new URLSearchParams(window.location.search).get("booking_id");async function yn(){const t=Z()==="fa",e=hn(),a=G(`
    <main class="nil-payment-page" dir="${t?"rtl":"ltr"}">
      <div class="nil-payment-container">

        <div class="nil-payment-card">

          <div class="nil-payment-icon success">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="28"
                stroke="currentColor" stroke-width="2"/>
              <path d="M19 33L28 42L46 23"
                stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <span class="nil-payment-label">NIL BEAUTY</span>

          <h1>
            ${t?"در حال بررسی پرداخت...":"Verifying Payment..."}
          </h1>

          <p class="nil-payment-description" data-payment-description>
            ${t?"لطفاً چند لحظه منتظر بمانید تا وضعیت پرداخت بررسی شود.":"Please wait while we verify your payment."}
          </p>

          <div class="nil-payment-details" data-payment-details hidden></div>

          <div class="nil-payment-actions">
            <a href="/bookings" data-nav-link class="nil-payment-btn primary">
              ${t?"نوبت‌های من":"My Bookings"}
            </a>

            <a href="/" data-nav-link class="nil-payment-btn secondary">
              ${t?"بازگشت به صفحه اصلی":"Back to Home"}
            </a>
          </div>

        </div>

        <p class="nil-payment-footer">
          NIL BEAUTY · ${t?"زیبایی در جزئیات است":"Beauty in every detail"}
        </p>

      </div>
    </main>
  `);return setTimeout(()=>{K();const n=document.querySelector(".nil-payment-page");n&&bn(n,e,t)},100),a}async function bn(t,e,a){var s;const n=t.querySelector("h1"),i=t.querySelector("[data-payment-description]"),o=t.querySelector("[data-payment-details]");if(!e){n.textContent=a?"وضعیت پرداخت نامشخص است":"Payment Status Unknown",i.textContent=a?"شناسه نوبت در آدرس موجود نیست. لطفاً وضعیت را در نوبت‌های خود بررسی کنید.":"Booking ID is missing. Please check your bookings.";return}try{const d=await Q(`/v1/bookings/${encodeURIComponent(e)}`);if(!t.isConnected)return;const r=((s=d==null?void 0:d.data)==null?void 0:s.booking)||(d==null?void 0:d.data)||(d==null?void 0:d.booking)||d,l=String((r==null?void 0:r.payment_status)||"").toLowerCase();if(!["paid","completed","success","successful"].includes(l)){n.textContent=a?"پرداخت هنوز تأیید نشده":"Payment Not Confirmed",i.textContent=a?"هنوز پرداخت موفقی برای این نوبت ثبت نشده است. وضعیت نوبت را بررسی کنید.":"A successful payment has not been recorded for this booking.";return}n.textContent=a?"پرداخت موفق!":"Payment Successful!",i.textContent=a?"بیعانه نوبت شما با موفقیت پرداخت و ثبت شد.":"Your booking deposit has been successfully paid.",o.hidden=!1,o.innerHTML=`
      <div class="nil-payment-detail-row">
        <span>${a?"شماره نوبت":"Booking Number"}</span>
        <strong>#${he(r.id||e)}</strong>
      </div>

      <div class="nil-payment-detail-row">
        <span>${a?"وضعیت پرداخت":"Payment Status"}</span>
        <strong class="nil-payment-success-text">
          ${a?"پرداخت شده":"Paid"}
        </strong>
      </div>

      ${r.booking_date?`
        <div class="nil-payment-detail-row">
          <span>${a?"تاریخ نوبت":"Booking Date"}</span>
          <strong>${he(r.booking_date)}</strong>
        </div>
      `:""}
    `}catch(d){if(!t.isConnected)return;console.error("Payment verification display:",d),n.textContent=a?"خطا در بررسی پرداخت":"Verification Error",i.textContent=a?"امکان دریافت وضعیت پرداخت وجود ندارد. لطفاً نوبت‌های خود را بررسی کنید.":"Unable to retrieve payment status. Please check your bookings."}}async function wn(){const t=Z()==="fa",e=G(`
    <main class="nil-payment-page" dir="${t?"rtl":"ltr"}">
      <div class="nil-payment-container">

        <div class="nil-payment-card">

          <div class="nil-payment-icon failed">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="28"
                stroke="currentColor" stroke-width="2"/>
              <path d="M23 23L41 41M41 23L23 41"
                stroke="currentColor" stroke-width="3"
                stroke-linecap="round"/>
            </svg>
          </div>

          <span class="nil-payment-label">NIL BEAUTY</span>

          <h1>
            ${t?"پرداخت ناموفق":"Payment Failed"}
          </h1>

          <p class="nil-payment-description">
            ${t?"پرداخت شما انجام نشد یا فرایند پرداخت لغو شد. در صورت کسر وجه، وضعیت تراکنش را از بانک یا درگاه پیگیری کنید.":"Your payment was not completed or was cancelled. If money was deducted, check the transaction with your bank or payment provider."}
          </p>

          <div class="nil-payment-notice">
            <span class="nil-payment-notice-icon">!</span>
            <p>
              ${t?"برای اطمینان از وضعیت نوبت، ابتدا نوبت‌های خود را بررسی کنید. در صورت نیاز می‌توانید دوباره برای پرداخت اقدام کنید.":"Please check your booking status first. You may try paying again if needed."}
            </p>
          </div>

          <div class="nil-payment-actions">
            <a href="/bookings" data-nav-link class="nil-payment-btn primary">
              ${t?"بررسی نوبت‌ها":"Check My Bookings"}
            </a>

            <a href="/" data-nav-link class="nil-payment-btn secondary">
              ${t?"بازگشت به صفحه اصلی":"Back to Home"}
            </a>
          </div>

        </div>

        <p class="nil-payment-footer">
          NIL BEAUTY · ${t?"همراه شما هستیم":"We are here for you"}
        </p>

      </div>
    </main>
  `);return setTimeout(()=>K(),100),e}window.addEventListener("error",t=>console.error("🚨",t.error||t.message));window.addEventListener("unhandledrejection",t=>console.error("🚨",t.reason));const $n=[{path:"/",component:ga,title:"Nil Beauty"},{path:"/about",component:ha,title:"درباره ما"},{path:"/gallery",component:cn,title:"گالری"},{path:"/blog",component:_a,title:"بلاگ"},{path:"/blog/:id",component:Ia,title:"مقاله"},{path:"/contact",component:Ba,title:"تماس"},{path:"/faq",component:Da,title:"سوالات"},{path:"/checkout",component:za,title:"پرداخت"},{path:"/login",component:ja,title:"ورود"},{path:"/forgot-password",component:vn,title:"بازیابی رمز عبور"},{path:"/register",component:Ja,title:"ثبت‌نام"},{path:"/dashboard",component:sn,title:"داشبورد"},{path:"/payment/success",component:yn,title:"پرداخت موفق"},{path:"/payment/failed",component:wn,title:"پرداخت ناموفق"},{path:"*",component:un,title:"404"}];async function kn(){console.log("🚀 Bootstrap started");try{if(await $e(),ra(),!document.querySelector("#app"))throw new Error("#app not found");const e=new ze($n,"#app");e.start(),window.__app={router:e},window.addEventListener("pageChanged",()=>{setTimeout(()=>{Ce()},100)}),console.log("🎉 Nil Beauty initialized")}catch(t){console.error("❌ Bootstrap failed:",t);const e=document.getElementById("app");e&&(e.innerHTML=`<div style="padding:40px;color:red"><h2>خطا</h2><pre>${t.message}</pre></div>`)}}kn();
