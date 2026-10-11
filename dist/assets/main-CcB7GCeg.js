(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();class Ce{constructor(e,a="#app"){this.routes=e,this.container=document.querySelector(a),this.currentPath=null,this.handlePopState=this.handlePopState.bind(this),this.handleLinkClick=this.handleLinkClick.bind(this)}start(){window.addEventListener("popstate",this.handlePopState),document.addEventListener("click",this.handleLinkClick),this.handlePopState()}stop(){window.removeEventListener("popstate",this.handlePopState),document.removeEventListener("click",this.handleLinkClick)}navigate(e,a=!0){a&&window.history.pushState({},"",e),this.resolve(e)}async resolve(e){const a=e.split("?")[0];this.currentPath=a;const n=this.matchRoute(a);if(!n){console.warn("⚠️ No route matched:",a);return}const{route:i,params:o}=n;i.title&&(document.title=i.title+" | Nil Beauty");try{this.container.innerHTML='<div class="page-loading">در حال بارگذاری...</div>';const s=await i.component(o);this.container.innerHTML=s,window.scrollTo(0,0),this.reinitWebflow(),window.dispatchEvent(new CustomEvent("pageChanged",{detail:{path:a,params:o}}))}catch(s){console.error("❌ Render failed:",s),this.container.innerHTML=`
        <div style="padding:40px;text-align:center">
          <h2>خطا در بارگذاری صفحه</h2>
          <p>${s.message}</p>
        </div>
      `}}matchRoute(e){for(const a of this.routes){const n=this.matchPath(a.path,e);if(n!==null)return{route:a,params:n}}return null}matchPath(e,a){if(e==="*")return{};const n=e.split("/").filter(Boolean),i=a.split("/").filter(Boolean);if(n.length!==i.length)return null;const o={};for(let s=0;s<n.length;s++){const d=n[s],r=i[s];if(d.startsWith(":"))o[d.slice(1)]=decodeURIComponent(r);else if(d!==r)return null}return o}handlePopState(){this.resolve(window.location.pathname)}handleLinkClick(e){const a=e.target.closest("a");if(!a)return;const n=a.getAttribute("href");n&&(n.startsWith("http")||n.startsWith("//")||n.startsWith("#")||n.startsWith("mailto:")||n.startsWith("tel:")||a.target==="_blank"||(e.preventDefault(),this.navigate(n)))}reinitWebflow(){if(!(typeof window.Webflow>"u"))try{if(window.Webflow.require){const e=window.Webflow.require("ix2");e&&e.init&&e.init()}window.Webflow.destroy(),window.Webflow.ready()}catch(e){console.warn("⚠️ Webflow reinit failed:",e)}}}let de="en",It={};const Wt=["fa","en"],ue="en",me="nil-beauty-lang";async function xe(t){try{const e=await fetch(`/lang/${t}.json`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return await e.json()}catch(e){return console.error(`❌ Failed to load ${t}.json`,e),{}}}function Ae(t,e){if(!(!t||!e))return e.split(".").reduce((a,n)=>a==null?void 0:a[n],t)}function Ie(t){var a,n,i,o;const e=document.documentElement;t==="fa"?(e.setAttribute("dir","rtl"),e.setAttribute("lang","fa"),(a=document.body)==null||a.classList.add("lang-fa"),(n=document.body)==null||n.classList.remove("lang-en")):(e.setAttribute("dir","ltr"),e.setAttribute("lang","en"),(i=document.body)==null||i.classList.add("lang-en"),(o=document.body)==null||o.classList.remove("lang-fa"))}async function Yt(t){Wt.includes(t)||(t=ue),de=t,localStorage.setItem(me,t),It=await xe(t),Ie(t),qe(),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{lang:t,translations:It}}))}async function ge(){const t=localStorage.getItem(me),e=t&&Wt.includes(t)?t:ue;await Yt(e)}function K(){return de}function g(t,e={}){const a=Ae(It,t);return a===void 0?t:String(a).replace(/\{(\w+)\}/g,(n,i)=>e[i]!==void 0?e[i]:`{${i}}`)}function qe(t=document){t.querySelectorAll("[data-i18n]").forEach(e=>{const a=e.getAttribute("data-i18n");a&&(e.textContent=g(a))}),t.querySelectorAll("[data-i18n-html]").forEach(e=>{const a=e.getAttribute("data-i18n-html");a&&(e.innerHTML=g(a))}),t.querySelectorAll("[data-i18n-placeholder]").forEach(e=>{const a=e.getAttribute("data-i18n-placeholder");a&&e.setAttribute("placeholder",g(a))}),t.querySelectorAll("[data-i18n-title]").forEach(e=>{const a=e.getAttribute("data-i18n-title");a&&e.setAttribute("title",g(a))}),t.querySelectorAll("[data-i18n-aria]").forEach(e=>{const a=e.getAttribute("data-i18n-aria");a&&e.setAttribute("aria-label",g(a))})}function Ne(t=document){t.querySelectorAll("[data-lang]").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault();const n=e.getAttribute("data-lang");n&&Wt.includes(n)&&Yt(n)})})}typeof window<"u"&&window.addEventListener("DOMContentLoaded",async()=>{await ge(),Ne()});const Pe="https://apinil.mazoryagroup.ir/api",qt="auth_token",Me="auth_user",Nt="auth_login_time",Be=10*60*1e3;function Pt(){return localStorage.getItem(qt)}function pe(){const t=Number(localStorage.getItem(Nt));if(!Number.isFinite(t)||t<=0)return!0;const e=Date.now()-t;return e<0||e>=Be}function Mt(){const t=!!localStorage.getItem(qt)||!!localStorage.getItem(Nt);localStorage.removeItem(qt),localStorage.removeItem(Me),localStorage.removeItem(Nt),t&&window.dispatchEvent(new CustomEvent("auth:expired"))}function De(){const t=Pt();return t?pe()?(Mt(),null):t:null}function Ue(t={}){const e=new URLSearchParams;return Object.entries(t).forEach(([a,n])=>{if(!(n==null||n==="")){if(Array.isArray(n)){n.forEach(i=>{i!=null&&e.append(`${a}[]`,String(i))});return}e.append(a,String(n))}}),e.toString()}function et(t,e={}){const a=Ue(e);return a?`${t}${t.includes("?")?"&":"?"}${a}`:t}function Re(t){const e=t==null?void 0:t.errors;if(!e||typeof e!="object")return null;const a=Object.values(e).flat().filter(n=>typeof n=="string");return a.length?a.join(`
`):null}function Oe(t,e){const a=Re(e)||(e==null?void 0:e.message)||(typeof(e==null?void 0:e.error)=="string"?e.error:null)||`HTTP ${t.status}`,n=new Error(a);return n.name="ApiError",n.status=t.status,n.statusCode=(e==null?void 0:e.statusCode)||t.status,n.errors=(e==null?void 0:e.errors)||null,n.response=e,n}function He(){const t=new Error("Session expired. Please login again.");return t.name="SessionExpiredError",t.status=401,t.statusCode=401,t}function ze(t){const e=String(t).split("?")[0];return["/v1/auth/register/send-code","/v1/auth/register/verify","/v1/auth/login","/v1/auth/login/phone/send-code","/v1/auth/login/phone/verify","/v1/auth/forgot-password/send-code","/v1/auth/forgot-password/verify","/v1/auth/forgot-password/reset"].includes(e)}async function jt(t,e,a=null,n={}){const i=`${Pe}${e}`,o=ze(e),s=!!Pt();if(!o&&s&&pe())throw Mt(),He();const d={Accept:"application/json",...n.headers},r=o?null:De();r&&!d.Authorization&&(d.Authorization=`Bearer ${r}`);const l={method:t.toUpperCase(),...n,headers:d};a!=null&&!["GET","HEAD"].includes(l.method)&&(a instanceof FormData?(l.body=a,delete l.headers["Content-Type"],delete l.headers["content-type"]):(l.headers["Content-Type"]=l.headers["Content-Type"]||"application/json",l.body=JSON.stringify(a)));try{const b=await fetch(i,l),A=b.headers.get("content-type")||"";let k={};if(b.status!==204&&(A.includes("application/json")?k=await b.json().catch(()=>({})):k=await b.text().catch(()=>"")?{message:b.ok?"":`HTTP ${b.status}`}:{}),b.status===401&&r&&Pt()===r&&Mt(),!b.ok)throw Oe(b,k);if(k&&typeof k=="object"&&(k.success===!1||k.is_status===!1)){const S=new Error(k.message||"API request failed.");throw S.name="ApiError",S.status=k.statusCode||b.status,S.response=k,S}return k}catch(b){throw console.error(`[NIL API] ${t.toUpperCase()} ${e}`,{message:b.message,status:b.status||null,errors:b.errors||null}),b}}const G=(t,e={})=>jt("GET",t,null,e),R=(t,e={},a={})=>jt("POST",t,e,a),ve=(t,e={},a={})=>jt("PUT",t,e,a),J={registerSendCode:(t,e,a=null)=>{const n={name:t,phone:e};return typeof a=="string"&&a.trim()&&(n.referral_code=a.trim()),R("/v1/auth/register/send-code",n)},registerVerify:(t,e)=>R("/v1/auth/register/verify",{phone:t,code:e}),loginPhoneSendCode:t=>R("/v1/auth/login/phone/send-code",{phone:t}),loginPhoneVerify:(t,e)=>R("/v1/auth/login/phone/verify",{phone:t,code:e}),loginEmail:(t,e)=>R("/v1/auth/login",{email:t,password:e}),forgotSendCode:t=>R("/v1/auth/forgot-password/send-code",{phone:t}),forgotVerify:(t,e)=>R("/v1/auth/forgot-password/verify",{phone:t,code:e}),forgotReset:(t,e,a,n)=>R("/v1/auth/forgot-password/reset",{phone:t,reset_token:e,password:a,password_confirmation:n}),logout:()=>R("/v1/auth/logout",{})},Jt={get:()=>G("/v1/auth/profile"),update:t=>ve("/v1/auth/profile",t),changePhoneSendCode:t=>R("/v1/auth/profile/change-phone/send-code",{phone:t}),changePhoneVerify:(t,e)=>R("/v1/auth/profile/change-phone/verify",{phone:t,code:e})},ut={list:(t={})=>G(et("/v1/bookings",t)),get:t=>G(`/v1/bookings/${encodeURIComponent(t)}`),create:t=>R("/v1/bookings",t),cancel:(t,e=null)=>{const a={};return e&&(a.cancellation_reason=e),R(`/v1/bookings/${encodeURIComponent(t)}/cancel`,a)},reschedule:(t,e)=>ve(`/v1/bookings/${encodeURIComponent(t)}/reschedule`,e),validateDiscount:(t,e)=>R("/v1/discount-codes/validate",{booking_id:Number(t),code:String(e).trim()}),applyDiscount:(t,e)=>R(`/v1/bookings/${encodeURIComponent(t)}/apply-discount`,e)},We={list:(t={})=>G(et("/v1/services",t)),get:t=>G(`/v1/services/${encodeURIComponent(t)}`)},Ye={check:(t=null,e,a,n=30)=>{const i={service_id:e,date:a,interval:n};return t!=null&&t!==""&&(i.staff_id=t),G(et("/v1/availability",i))},checkGeneral:(t,e,a=30)=>G(et("/v1/availability",{service_id:t,date:e,interval:a})),checkStaff:(t,e,a,n=30)=>G(et("/v1/availability",{staff_id:t,service_id:e,date:a,interval:n}))},je={deposit:(t,e={})=>R(`/v1/payments/bookings/${encodeURIComponent(t)}/deposit`,e),start:(t,e={})=>R(`/v1/payments/bookings/${encodeURIComponent(t)}/start`,e)},Ge={send:t=>R("/messages",t)},fe={subscribe:t=>R("/waiting-list",{email:t})},Bt={list:(t=null)=>G(et("/v1/gallery",{category_id:t})),categories:()=>G("/v1/gallery/categories"),get:t=>G(`/v1/gallery/${encodeURIComponent(t)}`)},Gt={list:(t={})=>G(et("/v1/blogs",t)),get:(t,e=null)=>G(et(`/v1/blogs/${encodeURIComponent(t)}`,{lang:e}))},tt="auth_token",Et="auth_user",vt="auth_login_time",he=10*60*1e3;let nt=null,St=null,Zt=!1,Ct=!1;function ye(){const t=localStorage.getItem(vt);if(!t)return null;const e=Number(t);return!Number.isFinite(e)||e<=0?null:e}function Xt(){const t=ye();return t?Math.max(0,he-(Date.now()-t)):0}function Ft(){St!==null&&(clearTimeout(St),St=null)}function Lt(){Ft(),localStorage.removeItem(tt),localStorage.removeItem(Et),localStorage.removeItem(vt),nt=null}function Vt(){var t,e;window.location.pathname!=="/login"&&((e=(t=window.__app)==null?void 0:t.router)!=null&&e.navigate?window.__app.router.navigate("/login"):window.location.replace("/login"))}function it(){const t=!!localStorage.getItem(tt)||!!localStorage.getItem(vt);Lt(),t&&window.dispatchEvent(new CustomEvent("auth:logout",{detail:{reason:"session_expired"}})),Vt()}function gt(){Ft();const t=Xt();if(t<=0){it();return}St=setTimeout(()=>{Xt()<=0?it():gt()},t)}function pt(){if(!localStorage.getItem(tt))return!1;const e=ye();return!e||e>Date.now()||Date.now()-e>=he?(it(),!1):!0}function Fe(){if(Zt)return;Zt=!0;const t=localStorage.getItem(tt),e=localStorage.getItem(Et);if(t){if(!pt())return;if(e)try{nt=JSON.parse(e)}catch{it();return}gt()}else Lt();window.addEventListener("auth:expired",()=>{it()}),document.addEventListener("visibilitychange",()=>{!document.hidden&&localStorage.getItem(tt)&&pt()&&gt()}),window.addEventListener("storage",a=>{(a.key===tt||a.key===vt)&&(localStorage.getItem(tt)?pt()&&gt():(Lt(),window.dispatchEvent(new CustomEvent("auth:logout")),Vt()))})}function Dt(t,e){Ft();const a=Date.now();localStorage.setItem(tt,t),localStorage.setItem(Et,JSON.stringify(e)),localStorage.setItem(vt,String(a)),nt=e,gt(),window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:e}}))}async function Ve(){if(!Ct){Ct=!0,console.log("🚪 Logging out...");try{await J.logout(),console.log("✅ Logout API success")}catch(t){console.warn("⚠️ Logout API failed:",t.message)}finally{Lt(),window.dispatchEvent(new CustomEvent("auth:logout")),Vt(),Ct=!1}}}function be(){if(!pt())return null;if(nt)return nt;const t=localStorage.getItem(Et);if(!t)return null;try{return nt=JSON.parse(t),nt}catch{return it(),null}}function Kt(){return pt()}function te(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ee(t){const e=window.location.pathname;return t==="/"?e==="/":e===t||e.startsWith(t+"/")}function Ke(){const t=be(),e=Kt(),a=K()==="fa",n=a?"EN":"FA",i=te((t==null?void 0:t.name)||(t==null?void 0:t.phone)||(a?"حساب کاربری":"My account")),o=[{path:"/",label:g("nav.home")},{path:"/about",label:g("nav.about")},{path:"/blog",label:g("nav.blogs")},{path:"/contact",label:g("nav.contact")}];return e&&o.push({path:"/dashboard",label:g("nav.dashboard")||(a?"داشبورد":"Dashboard")}),`
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
                class="nav-link w-inline-block ${ee(s.path)?"w--current":""}"
                data-nav-link
                ${ee(s.path)?'aria-current="page"':""}
              >
                <div class="nav-link-inner">
                  ${te(s.label)}
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
  `}function we(){const t=document.querySelector("[data-lang-switch]"),e=document.querySelector("[data-menu-button]"),a=document.querySelector("[data-nav-menu]");if(t&&!t.dataset.initialized&&(t.dataset.initialized="true",t.addEventListener("click",async i=>{var d;if(i.preventDefault(),t.disabled)return;t.disabled=!0;const s=K()==="fa"?"en":"fa";try{await Yt(s),(d=window.__app)!=null&&d.router?await window.__app.router.resolve(window.location.pathname):window.location.reload()}catch(r){console.error("❌ Language switch error:",r)}finally{t.isConnected&&(t.disabled=!1)}})),e&&a&&!e.dataset.initialized){let i=function(o){a.classList.toggle("is-open",o),e.classList.toggle("is-open",o),e.setAttribute("aria-expanded",String(o))};var n=i;e.dataset.initialized="true",e.addEventListener("click",()=>{const o=a.classList.contains("is-open");i(!o)}),a.addEventListener("click",o=>{o.target.closest("a[data-nav-link]")&&i(!1)}),e.addEventListener("keydown",o=>{o.key==="Escape"&&i(!1)}),a.addEventListener("keydown",o=>{o.key==="Escape"&&(i(!1),e.focus())})}}function Qe(){const t=K()==="fa",e=new Date().getFullYear(),a=[{href:"/",label:g("nav.home")},{href:"/about",label:g("nav.about")},{href:"/blog",label:g("nav.blogs")},{href:"/contact",label:g("nav.contact")},{href:"/faq",label:"FAQ"}];return`
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
  `}function H(t,e={}){const{navbarClass:a="navbar w-nav"}=e;return`
    <div class="page-wrap">
      <div class="${a}" data-animation="default" data-collapse="medium">
        ${Ke()}
      </div>
      ${t}
    </div>
    <div id="footer">${Qe()}</div>
  `}function W(){we()}function Tt(t,e=!0){if(!t)return"—";try{const a=new Date(t);return isNaN(a.getTime())?String(t).split("T")[0]||"—":a.toLocaleDateString(e?"fa-IR":"en-US",{calendar:e?"persian":"gregory",year:"numeric",month:"long",day:"numeric"})}catch{return"—"}}const U=(t="")=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");function $e(t){var e;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((e=t==null?void 0:t.data)==null?void 0:e.data)?t.data.data:[]}function Je(t){if(typeof t!="string"||!t.trim())return"";const e=t.trim();try{if(/^https?:\/\//i.test(e)){const o=new URL(e);return["localhost","127.0.0.1"].includes(o.hostname)&&!["localhost","127.0.0.1"].includes(location.hostname)?"":o.href}if(e.startsWith("//")||/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a="/"+e.replace(/^\/+/,""),n=new URL("/api",location.origin).origin,i=/^\/(storage|uploads)\//.test(a)?n:location.origin;return new URL(a,i).href}catch{return""}}function Ut(t,e="",a=!1){const n=Je(t);return n?`
    <img
      src="${U(n)}"
      alt="${U(e)}"
      loading="${a?"eager":"lazy"}"
      class="cover-image"
      data-home-image
    />
  `:'<div class="nil-image-placeholder">NIL</div>'}function ke(t){t.querySelectorAll("[data-home-image]").forEach(e=>{const a=()=>{if(!e.isConnected)return;const n=document.createElement("div");n.className="nil-image-placeholder",n.textContent="NIL",e.replaceWith(n)};e.addEventListener("error",a,{once:!0}),e.complete&&!e.naturalWidth&&a()})}function Ze(t,e){if(!t)return"";try{return U(Tt(t,e))}catch{return""}}async function Xe(){const t=K()==="fa",e=H(`
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
                  ${U(g("hero.tagline"))}
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
                        ${U(g("hero.title"))}
                      </h2>

                      <p class="line-height-150">
                        ${U(g("hero.description"))}
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
                ${U(g("sections.explore"))}
              </div>

              <h2>${U(g("sections.categories"))}</h2>
            </div>
          </div>

          <div class="category-wrap" data-categories-wrap>
            <div class="loading-placeholder">
              ${U(g("common.loading"))}
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
                  ${U(g("about.title"))}
                  <br>
                  ${U(g("about.title_secondary"))}
                </h2>

                <p class="mx-medium">
                  ${U(g("about.description"))}
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
                ${U(g("sections.news"))}
              </div>

              <h2>
                ${U(g("sections.latest_articles"))}
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
                ${U(g("common.loading"))}
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
                    ${U(g("cta.title"))}
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
                      placeholder="${U(g("forms.email"))}"
                      aria-label="Email"
                      required
                      data-cta-email
                    />

                    <button
                      type="submit"
                      class="cta-btn w-button"
                      data-cta-submit
                    >
                      ${U(g("buttons.subscribe"))}
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
  `);return setTimeout(()=>{const a=document.querySelector(".nil-home");a&&(W(),ta(a,t),ea(a,t),aa(a,t))},100),e}async function ta(t,e){const a=t.querySelector("[data-categories-wrap]");if(a)try{const n=await Bt.categories();if(!a.isConnected)return;const i=$e(n);if(!i.length){a.innerHTML=`
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
                ${U(o.name)}
              </div>

              ${Ut(o.image,o.name,!0)}
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
                ${Ut(r.image,r.name)}

                <div class="category-text">
                  ${U(r.name)}
                </div>
              </a>
            </div>
          `).join("")}

        </div>
      </div>
    `,ke(a)}catch(n){if(!a.isConnected)return;console.error("Home categories:",n),a.innerHTML=`
      <p class="nil-home-error">
        ${e?"خطا در بارگذاری دسته‌بندی‌ها":"Failed to load categories"}
      </p>
    `}}async function ea(t,e){const a=t.querySelector("[data-blog-list]");if(a)try{const n=await Gt.list({lang:e?"fa":"en"});if(!a.isConnected)return;const i=$e(n).slice(0,3);if(!i.length){a.innerHTML=`
        <p class="nil-home-empty">
          ${e?"مقاله‌ای موجود نیست":"No articles available"}
        </p>
      `;return}a.innerHTML=i.map(o=>{var l;const s=o.title_1||(e?"بدون عنوان":"Untitled"),d=typeof o.author=="string"?o.author:((l=o.author)==null?void 0:l.name)||"NIL",r=Ze(o.date,e);return`
        <div role="listitem" class="d-flex w-dyn-item">

          <a
            href="/blog/${encodeURIComponent(o.id)}"
            class="blog-card w-inline-block"
            data-nav-link
          >
            <div class="blog-thumb">
              ${Ut(o.image_1,s)}
            </div>

            <div class="blog-content">

              <div class="blog-data">
                <div class="blog-category">
                  ${U(d)}
                </div>

                <div class="body-small">
                  ${r}
                </div>
              </div>

              <h3 class="blog-title">
                ${U(s)}
              </h3>

            </div>
          </a>

        </div>
      `}).join(""),ke(a)}catch(n){if(!a.isConnected)return;console.error("Home blogs:",n),a.innerHTML=`
      <p class="nil-home-error">
        ${e?"خطا در بارگذاری مقالات":"Failed to load articles"}
      </p>
    `}}function aa(t,e){const a=t.querySelector("[data-cta-form]"),n=t.querySelector("[data-cta-email]"),i=t.querySelector("[data-cta-submit]"),o=t.querySelector("[data-cta-msg]");if(!a||!n||!i||a.dataset.initialized==="true")return;a.dataset.initialized="true";let s=!1;function d(r,l="info"){o&&(o.textContent=r,o.hidden=!r,o.dataset.state=l)}a.addEventListener("submit",async r=>{if(r.preventDefault(),s||!a.reportValidity())return;const l=n.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l)){d(e?"ایمیل معتبر وارد کنید":"Enter a valid email","error");return}s=!0,i.disabled=!0;const b=i.textContent;i.textContent=e?"در حال ثبت...":"Submitting...",d(e?"در حال ارسال...":"Sending...","info");try{if(await fe.subscribe(l),!a.isConnected)return;d(e?"ایمیل شما ثبت شد ✓":"Email registered ✓","success"),a.reset()}catch(A){if(!a.isConnected)return;console.error("Newsletter:",A),d(A.message||(e?"خطا در ثبت ایمیل":"Subscription failed"),"error")}finally{s=!1,i.disabled=!1,i.textContent=b}})}async function na(){const t=K()==="fa",e=H(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">${g("sections.our_story")}</div>
          <h1>${g("sections.about_us")}</h1>
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
              <h3>${g("about_us.title")}</h3>
              <p>${g("about_us.description")}</p>
            </div>
            <div class="about-bottom">
              <div class="about-image">
                <img src="/img/about-image.jpg" loading="eager" alt="About Image" class="cover-image" />
              </div>
              <div class="about-info">
                <div class="about-inner">
                  <img src="/img/ic-satisfaction.svg" loading="lazy" alt="Satisfaction" class="about-icon" />
                  <div>
                    <div class="about-head">${g("about_us.customers")}</div>
                    <div>${g("about_us.customers_description")}</div>
                  </div>
                </div>
                <div class="about-line"></div>
                <div class="about-inner">
                  <img src="/img/ic-awards.svg" loading="lazy" alt="Awards" class="about-icon" />
                  <div>
                    <div class="about-head">${g("about_us.awards")}</div>
                    <div>${g("about_us.awards_description")}</div>
                  </div>
                </div>
                <div class="about-line"></div>
                <div class="about-inner">
                  <img src="/img/ic-global.svg" loading="lazy" alt="Global" class="about-icon" />
                  <div>
                    <div class="about-head">${g("about_us.global_reach")}</div>
                    <div>${g("about_us.global_reach_description")}</div>
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
            <div class="subtitle">${g("sections.our_purpose")}</div>
            <h2>${g("sections.vision_mission")}</h2>
          </div>
        </div>
        <div class="vision-wrap">
          <div class="vision-img">
            <img src="/img/vision-image.jpg" loading="lazy" alt="Vision" class="cover-image" />
          </div>
          <div class="vision-content green">
            <div class="vision-text">
              <div class="vision-dot"></div>
              <div>${g("about_us.Innovation")}</div>
            </div>
            <div class="vision-bottom">
              <div class="vision-divider"></div>
              <p>${g("about_us.Innovation_description")}</p>
            </div>
          </div>
          <div class="vision-content brown">
            <div class="vision-text">
              <div class="vision-dot"></div>
              <div>${g("about_us.Empowering Beauty")}</div>
            </div>
            <div class="vision-bottom">
              <div class="vision-divider"></div>
              <p>${g("about_us.Empowering Beauty_description")}</p>
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
              <h3>${g("about_us.commitment")}</h3>
              <div class="data-paragraph">
                <p>${g("about_us.commitment_description")}</p>
                <p>${g("about_us.commitment_description2")}</p>
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
            <div class="subtitle">${g("sections.experts")}</div>
            <h2>${g("sections.meet_team")}</h2>
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
                  <h3 class="cta-title">${g("cta.title")}</h3>
                  <p class="body-small">${g("cta.free_shipping")}</p>
                </div>
                <div class="cta-form-block w-form">
                  <!-- ✅ div به جای form -->
                  <div class="cta-form" data-cta-form>
                    <input
                      class="cta-field w-input"
                      name="email"
                      placeholder="${g("forms.email")}"
                      type="email"
                      dir="ltr"
                      data-cta-email
                    />
                    <button
                      type="button"
                      class="cta-btn w-button"
                      data-cta-submit
                    >${g("buttons.subscribe")}</button>
                  </div>
                  <div class="form-message" data-cta-msg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `);return setTimeout(()=>{W(),ia(t),oa(t)},100),e}function ia(t){const e=document.querySelector("[data-faq-list]");if(!e)return;const a=t?[{q:"سیاست بازگشت گلومین چیست؟",a:"ما ۳۰ روز ضمانت بازگشت برای همه‌ی محصولات داریم. اگه از خرید خود راضی نیستید، لطفاً با پشتیبانی تماس بگیرید."},{q:"ارسال رایگان دارید؟",a:"بله، برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان ارسال رایگان است. برای سفارش‌های کمتر، هزینه‌ی ارسال استاندارد اعمال می‌شود."},{q:"محصولات گلومین کجا تولید می‌شوند؟",a:"ما ارسال بین‌المللی به بسیاری از کشورها داریم. هزینه و زمان ارسال بسته به مقصد متفاوت است."},{q:"چطور از محصولات مراقبت پوست گلومین استفاده کنم؟",a:"هر محصول دارای دستورالعمل استفاده روی بسته‌بندی است. برای راهنمایی کلی: ابتدا پوست را تمیز کنید، سپس سرم یا محصولات درمانی را اعمال کنید."},{q:"چطور از محصولات جدید و تخفیف‌ها باخبر بشم؟",a:"برای اطلاع از جدیدترین محصولات، تخفیف‌ها و پیشنهادات ویژه، در خبرنامه‌ی ما ثبت‌نام کنید."},{q:"اگه محصول آسیب‌دیده یا اشتباه دریافت کردم چیکار کنم؟",a:"اگه محصول آسیب‌دیده یا اشتباه دریافت کردید، لطفاً بلافاصله با پشتیبانی تماس بگیرید. شماره سفارش و جزئیات مشکل را ارسال کنید."}]:[{q:"What is Glomin's return policy?",a:"We offer a 30-day return policy on all products. If you are not satisfied with your purchase, please contact our customer support team."},{q:"Do you offer free shipping?",a:"Yes, we offer free shipping on all orders over $50. For orders below $50, standard shipping rates apply."},{q:"Where are Glomin products made?",a:"We offer international shipping to many countries. Shipping rates and delivery times vary based on the destination."},{q:"How do I use Glomin's skincare products?",a:"Each product comes with detailed usage instructions on the packaging. For general guidance, start with cleansing your skin, then apply serums or treatments as needed."},{q:"How can I stay updated on new products and promotions?",a:"To stay informed about our latest products, promotions, and exclusive offers, sign up for our newsletter on our website."},{q:"What should I do if I receive a damaged or incorrect item?",a:"If you receive a damaged or incorrect item, please contact our customer support team immediately with your order number and details."}];e.innerHTML=a.map(n=>`
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
  `).join(""),e.querySelectorAll("[data-faq-toggle]").forEach(n=>{n.addEventListener("click",()=>{const i=n.nextElementSibling,o=i.style.display!=="none";i.style.display=o?"none":"block",n.classList.toggle("active",!o)})})}function oa(t){const e=document.querySelector("[data-cta-form]");if(!e||e.dataset.initialized==="true")return;e.dataset.initialized="true";const a=e.querySelector("[data-cta-submit]"),n=e.querySelector("[data-cta-email]"),i=document.querySelector("[data-cta-msg]");if(!a||!n)return;a.addEventListener("click",async r=>{if(r.preventDefault(),r.stopPropagation(),a.disabled)return;const l=(n.value||"").trim();if(!l||!o(l)){s(i,t?"ایمیل معتبر وارد کنید":"Please enter a valid email","error");return}d(a,!0),s(i,t?"در حال ارسال...":"Sending...","info");try{const b=await fe.subscribe(l);console.log("📧 CTA subscribe response:",b),s(i,t?"ایمیل شما ثبت شد ✓":"Your email has been registered ✓","success"),n.value=""}catch(b){console.error("❌ CTA subscribe error:",b),s(i,b.message||(t?"خطا در ثبت ایمیل":"Failed to subscribe"),"error")}finally{d(a,!1)}}),n.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),a.click())});function o(r){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)}function s(r,l,b="info"){r&&(r.textContent=l,r.style.display=l?"block":"none",r.style.color=b==="error"?"#e74c3c":b==="success"?"#27ae60":"#666")}function d(r,l){r&&(r.disabled=l,l?(r.dataset.originalText=r.textContent,r.textContent="..."):r.textContent=r.dataset.originalText||"SUBSCRIBE")}}function V(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function sa(t){if(!t||typeof t!="string")return"";const e=t.trim();if(!e)return"";if(/^https?:\/\//i.test(e))try{const n=new URL(e);return["localhost","127.0.0.1"].includes(n.hostname.toLowerCase())&&!["localhost","127.0.0.1"].includes(window.location.hostname.toLowerCase())?"":n.href}catch{return""}if(e.startsWith("//"))return window.location.protocol+e;if(/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a="/api";try{const n=new URL(a,window.location.origin),i=e.startsWith("/")?e:"/"+e;return i.startsWith("/storage/")||i.startsWith("/uploads/")?new URL(i,n.origin).href:new URL(i,window.location.origin).href}catch{return""}}function ra(t,e=200){const a=String(t??"").replace(/<[^>]*>/g,"").trim();return a.length<=e?a:a.slice(0,e).trimEnd()+"..."}function la(t){var e;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((e=t==null?void 0:t.data)==null?void 0:e.data)?t.data.data:[]}function ca(t){return sa(t==null?void 0:t.image_1)}function Se(t,e="lazy"){const a=ca(t),n=V((t==null?void 0:t.title_1)||"");return a?`
    <img
      src="${V(a)}"
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
    `}function ae(t){t.querySelectorAll("[data-blog-image]").forEach(e=>{e.addEventListener("error",()=>{const a=document.createElement("div");a.className="blog-image-placeholder",a.setAttribute("aria-label",e.alt||"Blog image");const n=document.createElement("span");n.textContent="NIL",a.appendChild(n),e.replaceWith(a)},{once:!0})})}async function da(){const t=K()==="fa",e=H(`
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">
          <div class="subtitle">
            ${t?"مقالات":"BLOGS"}
          </div>

          <h1>${V(g("sections.latest_articles"))}</h1>
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
                  ${V(g("common.loading"))}
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
                ${V(g("common.loading"))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `);return setTimeout(()=>{const a=document.querySelector("[data-feature-blog]"),n=document.querySelector("[data-blog-list]");!a||!n||(W(),ua(t,a,n))},100),e}async function ua(t,e,a){const n=()=>e.isConnected&&a.isConnected;try{const i=await Gt.list({lang:t?"fa":"en"});if(!n())return;console.log("📝 Blogs response:",i);const o=la(i);if(!o.length){e.innerHTML=`
        <p>
          ${t?"مقاله‌ای موجود نیست":"No blogs available"}
        </p>
      `,a.innerHTML="";return}const s=o[0],d=o.slice(1);ma(e,s,t),ga(a,d,t),ae(e),ae(a)}catch(i){if(!n())return;console.error("❌ Blogs error:",i),e.innerHTML=`
      <p>
        ${t?"خطا در دریافت مقالات":"Failed to load articles"}
      </p>
    `,a.innerHTML=""}}function ma(t,e,a){const n=encodeURIComponent(e.id),i=V(e.title_1||(a?"بدون عنوان":"Untitled")),o=V(ra(e.description_1,200)),s=V(e.author||"NIL"),d=V(e.date?Tt(e.date,a):"");t.innerHTML=`
    <a
      href="/blog/${n}"
      class="blog-wrap w-inline-block"
      data-nav-link
    >

      <div class="feature-img">
        ${Se(e,"eager")}
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
          ${V(g("buttons.read_more"))}
        </div>

      </div>
    </a>
  `}function ga(t,e,a){if(!e.length){t.innerHTML="";return}t.innerHTML=e.map(n=>{const i=encodeURIComponent(n.id),o=V(n.title_1||(a?"بدون عنوان":"Untitled")),s=V(n.author||"NIL"),d=V(n.date?Tt(n.date,a):"");return`
      <div role="listitem" class="d-flex w-dyn-item">

        <a
          href="/blog/${i}"
          class="blog-card w-inline-block"
          data-nav-link
        >

          <div class="blog-thumb">
            ${Se(n)}
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
    `}).join("")}function Q(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function pa(t){if(!t||typeof t!="string")return"";const e=t.trim();if(!e)return"";try{if(/^https?:\/\//i.test(e)){const i=new URL(e),o=["localhost","127.0.0.1"];return o.includes(i.hostname.toLowerCase())&&!o.includes(window.location.hostname.toLowerCase())?"":i.href}if(e.startsWith("//"))return window.location.protocol+e;if(/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a=new URL("/api",window.location.origin),n=e.startsWith("/")?e:"/"+e;return n.startsWith("/storage/")||n.startsWith("/uploads/")?new URL(n,a.origin).href:new URL(n,window.location.origin).href}catch{return""}}function va(t,e){if(!t)return"";try{return Tt(t,e)||""}catch{return""}}function ne(t,e,a="lazy"){const n=pa(t);return n?`
    <img
      src="${Q(n)}"
      loading="${a}"
      alt="${Q(e)}"
      class="cover-image"
      data-blog-image
    />
  `:""}function xt(t){return t?Q(t).replace(/\r\n?/g,`
`).split(/\n\s*\n/).filter(Boolean).map(a=>`
      <p>${a.replace(/\n/g,"<br>")}</p>
    `).join(""):""}function fa(t){t.querySelectorAll("[data-blog-image]").forEach(e=>{const a=()=>{const n=document.createElement("div");n.className="blog-image-placeholder";const i=document.createElement("span");i.textContent="NIL",n.appendChild(i),e.replaceWith(n)};e.addEventListener("error",a,{once:!0}),e.complete&&e.naturalWidth===0&&a()})}async function ha(t={}){const e=K()==="fa",a=t.id??t.slug,n=H(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div
          class="blog-card align-center"
          data-blog-detail
        >
          <div class="loading-placeholder">
            ${Q(g("common.loading"))}
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="blog-single-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="blog-outer" data-blog-content>
          <div class="loading-placeholder">
            ${Q(g("common.loading"))}
          </div>
        </div>
      </div>
    </section>
  `);return setTimeout(()=>{const i=document.querySelector("[data-blog-detail]"),o=document.querySelector("[data-blog-content]");!i||!o||(W(),ya(a,e,i,o))},100),n}async function ya(t,e,a,n){const i=()=>a.isConnected&&n.isConnected,o=()=>{a.innerHTML=`
      <h2>
        ${e?"مقاله یافت نشد":"Blog not found"}
      </h2>
    `,n.innerHTML=""};if(t==null||t===""){o();return}try{const s=await Gt.get(t,e?"fa":"en");if(!i())return;console.log("📄 Blog detail response:",s);const d=(s==null?void 0:s.data)||s;if(!d||typeof d!="object"||Array.isArray(d)||!d.id){o();return}ba(a,n,d,e)}catch(s){if(!i())return;console.error("❌ Blog detail error:",s),a.innerHTML=`
      <h2 class="text-danger">
        ${e?"خطا در بارگذاری مقاله":"Failed to load article"}
      </h2>
    `,n.innerHTML=""}}function ba(t,e,a,n){const i=Q(a.title_1||a.title||(n?"بدون عنوان":"Untitled")),o=Q(a.author||"NIL"),s=Q(va(a.date,n)),d=Number(a.reading_time);t.innerHTML=`
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
          ${Q(d)}
          ${n?"دقیقه مطالعه":"min read"}
        </div>
      `:""}
    </div>
  `;let r="";if(a.image_1){const l=ne(a.image_1,a.title_1||a.title||"","eager");l&&(r+=`
        <div class="blog-main">
          ${l}
        </div>
      `)}if(r+=`
    <div class="blog-details">
      <div class="richtext w-richtext">
  `,a.description_1&&(r+=xt(a.description_1)),a.title_2&&(r+=`
      <h3>${Q(a.title_2)}</h3>
    `),a.description_2&&(r+=xt(a.description_2)),a.image_2){const l=ne(a.image_2,a.title_2||a.title_1||"Media");l&&(r+=`
        <figure
          style="max-width:1800px"
          class="w-richtext-align-fullwidth w-richtext-figure-type-image"
        >
          <div>
            ${l}
          </div>
        </figure>
      `)}a.title_3&&(r+=`
      <h3>${Q(a.title_3)}</h3>
    `),a.description_3&&(r+=xt(a.description_3)),r+=`
      </div>
    </div>
  `,e.innerHTML=r,fa(e)}function wa(t=""){const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))}function ie(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}async function $a(){const t=K()==="fa",e=H(`
    <!-- TITLE -->
    <section class="title-section">
      <div class="w-layout-blockcontainer container w-container">
        <div class="title-wrap">

          <div class="subtitle">
            ${t?"با ما در تماس باشید":"GET IN TOUCH"}
          </div>

          <h1>${ie(g("nav.contact"))}</h1>

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
                  value="${ie(g("common.submit"))}"
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
  `);return setTimeout(()=>{const a=document.querySelector("[data-contact-form]");a&&(W(),ka(a,t))},100),e}function ka(t,e){const a=t.parentElement.querySelector("[data-form-message]"),n=t.querySelector("[data-submit-btn]");let i=!1;function o(d="",r="info"){a&&(a.textContent=d,a.style.display=d?"block":"none",a.classList.remove("is-success","is-error","is-info"),a.classList.add(`is-${r}`))}function s(d){n.disabled=d,d?(n.dataset.originalText=n.value,n.value=e?"لطفاً صبر کنید...":"Please wait..."):n.value=n.dataset.originalText||(e?"ارسال پیام":"Submit")}t.addEventListener("submit",async d=>{if(d.preventDefault(),i||!t.reportValidity())return;const r=new FormData(t),l={first_name:String(r.get("first_name")||"").trim(),last_name:String(r.get("last_name")||"").trim(),email:String(r.get("email")||"").trim(),phone:wa(String(r.get("phone")||"").trim()),message:String(r.get("message")||"").trim()};if(!l.first_name||!l.email||!l.message){o(e?"لطفاً فیلدهای ضروری را تکمیل کنید.":"Please complete the required fields.","error");return}i=!0,s(!0),o(e?"در حال ارسال پیام...":"Sending message...","info");try{if(await Ge.send(l),!t.isConnected)return;o(e?"پیام شما با موفقیت ارسال شد ✓":"Your message has been sent successfully ✓","success"),t.reset()}catch(b){if(!t.isConnected)return;console.error("❌ Contact error:",b),o(b.message||(e?"خطا در ارسال پیام":"Failed to send message"),"error")}finally{i=!1,s(!1)}})}async function Sa(){const t=H(`
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
          <div class="loading-placeholder">${g("common.loading")}</div>
        </div>
      </div>
    </section>
  `);return queueMicrotask(()=>{W(),_a()}),t}async function _a(){const t=document.querySelector("[data-faq-list]");if(!t)return;const e=[{q:"What is Glomin’s return policy?",a:"We offer a 30-day return policy."},{q:"Do you offer free shipping?",a:"Yes, on orders over $50."}];t.innerHTML=e.map(a=>`
    <div class="faq w-dropdown" data-faq-item>
      <div class="question-block w-dropdown-toggle" data-faq-toggle>
        <p class="body-large color-black">${a.q}</p>
        <div class="faq-icon">+</div>
      </div>
      <nav class="answer-block w-dropdown-list" data-faq-answer style="display:none">
        <div class="faq-answer"><p>${a.a}</p></div>
      </nav>
    </div>
  `).join(""),t.querySelectorAll("[data-faq-toggle]").forEach(a=>{a.addEventListener("click",()=>{const n=a.nextElementSibling,i=n.style.display!=="none";n.style.display=i?"none":"block"})})}const at=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),X=t=>new Intl.NumberFormat("fa-IR").format(Number(t||0)),oe=t=>String(t).replace(/\d/g,e=>"۰۱۲۳۴۵۶۷۸۹"[e]);function La(t){if(!t)return"—";const e=new Date(`${String(t).slice(0,10)}T12:00:00Z`);return Number.isNaN(e.getTime())?"—":new Intl.DateTimeFormat("fa-IR-u-ca-persian",{timeZone:"UTC",year:"numeric",month:"long",day:"numeric"}).format(e)}function Ea(t){var e;return((e=t==null?void 0:t.data)==null?void 0:e.booking)||(t==null?void 0:t.data)||(t==null?void 0:t.booking)||null}function Ta(t){var a,n,i;const e=[(a=t==null?void 0:t.data)==null?void 0:a.payment_url,(n=t==null?void 0:t.data)==null?void 0:n.gateway_url,(i=t==null?void 0:t.data)==null?void 0:i.url,t==null?void 0:t.payment_url,t==null?void 0:t.gateway_url,t==null?void 0:t.url];for(const o of e)if(typeof o=="string")try{const s=new URL(o);if(s.protocol==="https:")return s.href}catch{}return null}function Ca(){const t=K()==="fa",e=(n,i)=>t?n:i;if(!Kt())return queueMicrotask(()=>{var n,i;return(i=(n=window.__app)==null?void 0:n.router)==null?void 0:i.navigate("/login")}),H(`<div class="nil-checkout-loading">${e("در حال انتقال به ورود...","Redirecting to login...")}</div>`);const a=H(`
    <main class="nil-checkout" dir="${t?"rtl":"ltr"}" data-nil-checkout>
      <div class="nil-checkout-container">
        <header class="nil-checkout-header">
          <button type="button" class="nil-checkout-back" data-checkout-back>
            ${t?"→":"←"} ${e("بازگشت به داشبورد","Back to dashboard")}
          </button>
          <div class="nil-checkout-brand">
            <span class="nil-checkout-logo">N</span><span>NIL BEAUTY</span>
          </div>
        </header>
        <section class="nil-checkout-heading">
          <span class="nil-checkout-eyebrow">SECURE CHECKOUT</span>
          <h1>${e("تکمیل رزرو","Complete your booking")}</h1>
          <p>${e("اطلاعات نوبتت رو بررسی کن و برای تکمیل رزرو بیعانه رو پرداخت کن.","Review your appointment and pay the deposit to complete your booking.")}</p>
        </section>
        <div data-checkout-content>
          <div class="nil-checkout-loading">
            <div class="nil-checkout-spinner"></div>
            ${e("در حال دریافت اطلاعات رزرو...","Loading booking details...")}
          </div>
        </div>
        <footer class="nil-checkout-footer">
          <span>✦ NIL BEAUTY STUDIO</span>
          <span>${e("رزرو آنلاین خدمات زیبایی","Online beauty booking")}</span>
        </footer>
      </div>
    </main>
  `);return setTimeout(()=>{const n=document.querySelector("[data-nil-checkout]");!n||n.dataset.initialized||(n.dataset.initialized="1",W(),xa(n,t))},100),a}async function xa(t,e){const a=u=>t.querySelector(u),n=(u,v)=>e?u:v,i=a("[data-checkout-content]"),o=new URLSearchParams(window.location.search).get("booking");let s=null,d=!1,r=!1,l=null;a("[data-checkout-back]").addEventListener("click",()=>{var u,v;(v=(u=window.__app)==null?void 0:u.router)==null||v.navigate("/dashboard")});function b(u,v=!1){var h;i.innerHTML=`
      <div class="nil-checkout-state">
        <div class="nil-checkout-state-icon">!</div>
        <h2>${n("مشکلی پیش آمد","Something went wrong")}</h2>
        <p>${at(u)}</p>
        ${v?`<button type="button" class="nil-checkout-button" data-checkout-retry>${n("تلاش مجدد","Try again")}</button>`:""}
      </div>
    `,(h=a("[data-checkout-retry]"))==null||h.addEventListener("click",A)}async function A(){if(!o||!/^\d+$/.test(o)){b(n("شناسه رزرو معتبر نیست.","Invalid booking ID."));return}i.innerHTML=`
      <div class="nil-checkout-loading">
        <div class="nil-checkout-spinner"></div>
        ${n("در حال دریافت اطلاعات رزرو...","Loading booking details...")}
      </div>
    `;try{const u=await ut.get(o);if(s=Ea(u),!s||typeof s!="object"||!s.id)throw new Error(n("اطلاعات رزرو دریافت نشد.","Booking details not found."));l=null,k()}catch(u){console.error("Checkout booking error:",u),b(u.message,!0)}}function k(){var z,F,Y,ft,ht,yt;const u=s.booking_services||s.services||[],v=Number(s.subtotal??s.total_amount??0),h=Number(s.deposit_amount??0),C=Number(s.paid_amount??0),w=s.discount_code??s.coupon_code??((z=s.discount)==null?void 0:z.code)??null,p=Number(s.discount_amount??((F=s.discount)==null?void 0:F.amount)??0),m=Math.max(0,h-C),$=s.payment_status==="paid"||m===0&&h>0,L=["cancelled","expired","rejected"].includes(s.status),_=s.status==="completed",M=!$&&!L&&!_&&m>0;i.innerHTML=`
      <div class="nil-checkout-grid">
        <section class="nil-checkout-card">
          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">✦</div>
            <div>
              <span class="nil-checkout-eyebrow">APPOINTMENT DETAILS</span>
              <h2>${n("جزئیات نوبت","Appointment details")}</h2>
            </div>
          </div>
          <div class="nil-checkout-booking-number">
            <span>${n("شماره رزرو","Booking number")}</span>
            <strong>#${oe(s.id)}</strong>
          </div>
          <div class="nil-checkout-info">
            <div class="nil-checkout-info-item">
              <span>${n("تاریخ نوبت","Appointment date")}</span>
              <strong>${La(s.booking_date)}</strong>
            </div>
            <div class="nil-checkout-info-item">
              <span>${n("ساعت شروع","Start time")}</span>
              <strong>${at(String(s.start_time||"").slice(0,5))}</strong>
            </div>
            <div class="nil-checkout-info-item">
              <span>${n("ساعت پایان","End time")}</span>
              <strong>${at(String(s.end_time||"").slice(0,5))}</strong>
            </div>
            <div class="nil-checkout-info-item">
              <span>${n("وضعیت رزرو","Booking status")}</span>
              <strong>${at(s.status||"-")}</strong>
            </div>
          </div>
          <div class="nil-checkout-divider"></div>
          <h3 class="nil-checkout-subtitle">${n("خدمات انتخاب‌شده","Selected services")}</h3>
          <div class="nil-checkout-services">
            ${u.length?u.map(j=>{var ot,st;return`
              <div class="nil-checkout-service">
                <div>
                  <strong>${at(((ot=j.service)==null?void 0:ot.name)||j.service_name||j.name||n("خدمت زیبایی","Beauty service"))}</strong>
                  <small>${oe(j.duration||((st=j.service)==null?void 0:st.duration)||0)} ${n("دقیقه","min")}</small>
                </div>
                <span>${X(j.price)} ${n("تومان","Toman")}</span>
              </div>
            `}).join(""):`<p class="nil-checkout-muted">${n("اطلاعات خدمات موجود نیست.","Service details unavailable.")}</p>`}
          </div>
        </section>

        <aside class="nil-checkout-card nil-checkout-payment">
          <div class="nil-checkout-card-title">
            <div class="nil-checkout-card-icon">◈</div>
            <div>
              <span class="nil-checkout-eyebrow">PAYMENT SUMMARY</span>
              <h2>${n("خلاصه پرداخت","Payment summary")}</h2>
            </div>
          </div>
          <div class="nil-checkout-price-row">
            <span>${n("مبلغ کل خدمات","Services total")}</span>
            <strong>${X(v)} ${n("تومان","Toman")}</strong>
          </div>
          <div class="nil-checkout-price-row">
            <span>${n("بیعانه رزرو","Booking deposit")}</span>
            <strong>${X(h)} ${n("تومان","Toman")}</strong>
          </div>
          <div class="nil-checkout-price-row">
            <span>${n("پرداخت‌شده","Already paid")}</span>
            <strong>${X(C)} ${n("تومان","Toman")}</strong>
          </div>
          <div class="nil-checkout-divider"></div>

          ${M?`
            <div class="nil-checkout-discount">
              <label for="nil-discount-code">${n("کد تخفیف داری؟","Have a discount code?")}</label>
              <div class="nil-discount-input-group">
                <input id="nil-discount-code" class="nil-discount-input" type="text"
                  maxlength="100" autocomplete="off"
                  value="${at(w||"")}"
                  placeholder="${n("کد تخفیف را وارد کنید","Enter discount code")}" />
                <button type="button" class="nil-discount-button" data-discount-apply>
                  ${n("بررسی کد","Check code")}
                </button>
              </div>
              <p class="nil-discount-message" data-discount-message role="status" aria-live="polite"></p>
            </div>
          `:""}

          ${p>0?`
            <div class="nil-checkout-price-row">
              <span>${n("تخفیف ثبت‌شده","Saved discount")}${w?` (${at(w)})`:""}</span>
              <strong>− ${X(p)} ${n("تومان","Toman")}</strong>
            </div>
          `:""}

          <div data-discount-preview></div>
          <div class="nil-checkout-total">
            <span>${n("بیعانه قابل پرداخت","Deposit due")}</span>
            <div><strong>${X(m)}</strong><small>${n("تومان","Toman")}</small></div>
          </div>

          ${$?`<div class="nil-checkout-success">✓ ${n("بیعانه پرداخت شده است.","Deposit has been paid.")}</div>`:""}
          ${L?`<div class="nil-checkout-warning">${n("این رزرو قابل پرداخت نیست.","This booking cannot be paid.")}</div>`:""}
          ${M?`
            <button type="button" class="nil-checkout-button" data-checkout-pay>
              <span>${n("پرداخت بیعانه","Pay deposit")}</span><span>${e?"←":"→"}</span>
            </button>
            <p class="nil-checkout-secure">◈ ${n("پرداخت از طریق درگاه امن بانکی","Secure payment through banking gateway")}</p>
          `:""}
          <p class="nil-checkout-error" data-payment-error hidden></p>
          <div class="nil-checkout-note">
            <strong>✦ ${n("نکته مهم","Important note")}</strong>
            <p>${n("کد تخفیف ابتدا بررسی می‌شود. مبلغ واقعی پرداخت فقط توسط سرور تعیین می‌شود.","Discount codes are validated first. The server determines the actual payment amount.")}</p>
          </div>
        </aside>
      </div>
    `,(Y=a("[data-checkout-pay]"))==null||Y.addEventListener("click",x),(ft=a("[data-discount-apply]"))==null||ft.addEventListener("click",I),(ht=a("#nil-discount-code"))==null||ht.addEventListener("keydown",j=>{j.key==="Enter"&&(j.preventDefault(),I())}),(yt=a("#nil-discount-code"))==null||yt.addEventListener("input",()=>{l=null,S();const j=a("[data-discount-message]");j&&(j.textContent="")}),S()}function S(){const u=a("[data-discount-preview]");if(u){if(!l){u.innerHTML="";return}u.innerHTML=`
      <div class="nil-checkout-divider"></div>
      <div class="nil-checkout-price-row">
        <span>${n("تخفیف پیشنهادی","Validated discount")}</span>
        <strong>− ${X(l.discount_amount)} ${n("تومان","Toman")}</strong>
      </div>
      <div class="nil-checkout-price-row">
        <span>${n("جمع خدمات پس از تخفیف (پیش‌نمایش)","Services total after discount (preview)")}</span>
        <strong>${X(l.final_amount)} ${n("تومان","Toman")}</strong>
      </div>
      <p class="nil-checkout-muted">
        ${n("این مبلغ فقط پیش‌نمایش است؛ تخفیف هنوز برای پرداخت ثبت نشده است.","Preview only: the discount has not been saved for payment.")}
      </p>
    `}}async function I(){if(r||d||!s)return;const u=a("#nil-discount-code"),v=a("[data-discount-apply]"),h=a("[data-discount-message]"),C=(u==null?void 0:u.value.trim())||"";if(l=null,S(),!C){h&&(h.textContent=n("کد تخفیف را وارد کن.","Enter a discount code."),h.classList.add("error"));return}r=!0,v&&(v.disabled=!0),u&&(u.disabled=!0),h&&(h.classList.remove("error"),h.textContent=n("در حال بررسی کد...","Checking discount code..."));try{const w=await ut.validateDiscount(s.id,C);if(!(w!=null&&w.data)||w.success===!1||w.is_status===!1)throw new Error((w==null?void 0:w.message)||n("کد معتبر نیست.","Invalid discount code."));const p=w.data;if(!Number.isFinite(Number(p.discount_amount))||!Number.isFinite(Number(p.final_amount)))throw new Error(n("مبلغ تخفیف در پاسخ سرور معتبر نیست.","Invalid discount totals in server response."));l={code:String(p.code||C),discount_amount:Number(p.discount_amount),final_amount:Number(p.final_amount)},S(),h!=null&&h.isConnected&&(h.textContent=n("کد معتبر است؛ مبلغ تخفیف در پیش‌نمایش نمایش داده شد.","Valid code. Discount shown as preview."),h.classList.remove("error"))}catch(w){h!=null&&h.isConnected&&(h.textContent=w.message||n("خطا در بررسی کد تخفیف.","Could not validate discount."),h.classList.add("error"))}finally{r=!1,v!=null&&v.isConnected&&(v.disabled=!1),u!=null&&u.isConnected&&(u.disabled=!1)}}async function x(){if(d||r||!s)return;d=!0;const u=a("[data-checkout-pay]"),v=a("[data-payment-error]");u&&(u.disabled=!0,u.textContent=n("در حال اتصال به درگاه...","Connecting to payment gateway...")),v&&(v.hidden=!0);try{const h=await je.start(s.id),C=Ta(h);if(!C)throw new Error(n("آدرس درگاه پرداخت در پاسخ سرور وجود ندارد.","Payment gateway URL is missing from the server response."));window.location.assign(C)}catch(h){console.error("Payment error:",h),v&&(v.textContent=h.message,v.hidden=!1),u&&(u.disabled=!1,u.innerHTML=`<span>${n("تلاش مجدد برای پرداخت","Retry payment")}</span><span>${e?"←":"→"}</span>`),d=!1}}await A()}const P=(t,e)=>{const a=g(t);return a&&a!==t?a:e},Rt=(t="")=>{const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))},Aa=t=>Rt(t).replace(/\D/g,""),Ia=t=>/^(09\d{9}|989\d{9})$/.test(t),se=t=>{var e,a;return(t==null?void 0:t.token)||(t==null?void 0:t.access_token)||((e=t==null?void 0:t.data)==null?void 0:e.token)||((a=t==null?void 0:t.data)==null?void 0:a.access_token)},ct=(t,e)=>{t&&(e?(t.dataset.originalText=t.textContent,t.disabled=!0,t.textContent=P("auth.loading","لطفاً صبر کنید...")):(t.disabled=!1,t.textContent=t.dataset.originalText||t.textContent))};async function qa(){const t=H(`
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
          <h2>${P("auth.login_title","خوش اومدی!")}</h2>
          <p>${P("auth.login_subtitle","برای ورود به حساب کاربری اطلاعاتت رو وارد کن.")}</p>
        </div>

        <div class="auth-tabs" data-tabs>
          <button
            type="button"
            class="auth-tab active"
            data-tab="phone"
            aria-selected="true"
          >
            ${P("auth.tab_phone","شماره موبایل")}
          </button>

          <button
            type="button"
            class="auth-tab"
            data-tab="email"
            aria-selected="false"
          >
            ${P("auth.tab_email","ایمیل")}
          </button>
        </div>

        <div class="auth-tab-content" data-tab-content="phone">
          <form class="auth-form" data-phone-form>

            <div class="auth-field">
              <label for="login-phone">
                ${P("auth.phone_label","شماره موبایل")}
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
              ${P("auth.btn_send_otp_login","ارسال کد تأیید")}
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
                ${P("auth.email_label","ایمیل")}
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
                ${P("auth.password_label","رمز عبور")}
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
              ${P("auth.btn_login","ورود به حساب")}
            </button>

            <div style="text-align:center">
              <a href="/forgot-password" data-nav-link class="auth-link-btn">
                ${P("auth.forgot_password","رمز عبورت رو فراموش کردی؟")}
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
            <h2>${P("auth.otp_label","تأیید شماره موبایل")}</h2>
            <p>
              کد ارسال‌شده به شماره
              <strong data-phone-display dir="ltr"></strong>
              را وارد کن.
            </p>
          </div>

          <form class="auth-form" data-otp-form>
            <div class="auth-field">
              <label for="login-otp">
                ${P("auth.otp_label","کد تأیید")}
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
              ${P("auth.btn_verify_login","تأیید و ورود")}
            </button>
          </form>

          <div class="auth-resend">
            <button
              type="button"
              class="auth-link-btn"
              data-resend-btn
            >
              ${P("auth.btn_resend","ارسال مجدد کد")}
            </button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:16px">
            <button
              type="button"
              class="auth-link-btn"
              data-back-btn
            >
              ${P("auth.btn_back","بازگشت و تغییر شماره")}
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
          <span>${P("auth.no_account","حساب کاربری نداری؟")}</span>
          <a href="/register" data-nav-link>
            ${P("auth.link_register","ثبت‌نام کن")}
          </a>
        </div>

      </div>
    </div>
  `);return setTimeout(()=>{W(),Na()},100),t}function Na(){var w;const t=document.querySelector(".auth-page");if(!t)return;const e=p=>t.querySelector(p),a=p=>t.querySelectorAll(p),n=e("[data-tabs]"),i=e("[data-otp-step]"),o=e("[data-main-footer]"),s=e("[data-msg]"),d=e("[data-phone-display]"),r=e("[data-resend-btn]"),l=e("[data-timer]"),b=e("[data-back-btn]"),A=e("[data-phone-form]"),k=e("[data-email-form]"),S=e("[data-otp-form]");let I="",x=null;function u(p="",m="info"){s&&(s.textContent=p,s.style.display=p?"block":"none",s.style.color=m==="error"?"#b42318":m==="success"?"#626a4e":"#111111")}function v(p){a(".auth-tab").forEach(m=>{const $=m.dataset.tab===p;m.classList.toggle("active",$),m.setAttribute("aria-selected",String($))}),a("[data-tab-content]").forEach(m=>{m.style.display=m.dataset.tabContent===p?"block":"none"}),u()}a(".auth-tab").forEach(p=>{p.addEventListener("click",()=>{v(p.dataset.tab)})});function h(p=60){x&&clearInterval(x);let m=p;r.disabled=!0;const $=()=>{if(m<=0){clearInterval(x),x=null,r.disabled=!1,l.textContent="";return}l.textContent=`(${m}s)`,m--};$(),x=setInterval($,1e3)}function C(){n.style.display="none",a("[data-tab-content]").forEach(p=>{p.style.display="none"}),o.style.display="none",i.style.display="block",d.textContent=I,h(60),u(),setTimeout(()=>{var p;(p=S.querySelector('[name="code"]'))==null||p.focus()},100)}A==null||A.addEventListener("submit",async p=>{p.preventDefault();const m=Aa(new FormData(A).get("phone")||"");if(!Ia(m)){u(P("auth.msg_invalid_phone","شماره موبایل معتبر نیست."),"error");return}const $=A.querySelector("[data-submit-btn]");ct($,!0);try{await J.loginPhoneSendCode(m),I=m,C()}catch(L){u(L.message||P("auth.msg_error_send","ارسال کد با خطا مواجه شد."),"error")}finally{ct($,!1)}}),S==null||S.addEventListener("submit",async p=>{var L;p.preventDefault();const m=Rt(new FormData(S).get("code")||"").trim();if(!/^\d{6}$/.test(m)){u(P("auth.msg_otp_incomplete","کد شش‌رقمی را وارد کن."),"error");return}const $=e("[data-otp-submit]");ct($,!0);try{const _=await J.loginPhoneVerify(I,m),M=se(_),z=(_==null?void 0:_.user)||((L=_==null?void 0:_.data)==null?void 0:L.user)||{phone:I};if(!M)throw new Error(P("auth.msg_error_verify","تأیید کد ناموفق بود."));Dt(M,z),u(P("auth.msg_login_success","ورود موفقیت‌آمیز بود."),"success"),setTimeout(()=>{var F,Y;(Y=(F=window.__app)==null?void 0:F.router)==null||Y.navigate("/dashboard")},800)}catch(_){u(_.message||P("auth.msg_error_verify","کد تأیید نامعتبر است."),"error")}finally{ct($,!1)}}),k==null||k.addEventListener("submit",async p=>{var L;p.preventDefault();const m=Object.fromEntries(new FormData(k)),$=k.querySelector("[data-submit-btn]");ct($,!0);try{const _=await J.loginEmail(m.email,m.password),M=se(_),z=(_==null?void 0:_.user)||((L=_==null?void 0:_.data)==null?void 0:L.user)||{email:m.email};if(!M)throw new Error(P("auth.msg_error_login","ورود ناموفق بود."));Dt(M,z),u(P("auth.msg_login_success","ورود موفقیت‌آمیز بود."),"success"),setTimeout(()=>{var F,Y;(Y=(F=window.__app)==null?void 0:F.router)==null||Y.navigate("/dashboard")},800)}catch(_){u(_.message||P("auth.msg_error_login","ایمیل یا رمز عبور اشتباه است."),"error")}finally{ct($,!1)}}),r==null||r.addEventListener("click",async()=>{if(!(r.disabled||!I)){r.disabled=!0;try{await J.loginPhoneSendCode(I),u(P("auth.msg_otp_resent","کد جدید ارسال شد."),"success"),h(60)}catch(p){r.disabled=!1,u(p.message||"خطا در ارسال مجدد کد.","error")}}}),b==null||b.addEventListener("click",()=>{x&&clearInterval(x),x=null,i.style.display="none",n.style.display="flex",o.style.display="flex",S.reset(),v("phone")}),(w=S==null?void 0:S.querySelector('[name="code"]'))==null||w.addEventListener("input",p=>{p.target.value=Rt(p.target.value).replace(/\D/g,"").slice(0,6)})}const D=(t,e)=>{const a=g(t);return a&&a!==t?a:e},Ot=(t="")=>{const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))},Pa=t=>Ot(t).replace(/\D/g,""),Ma=t=>/^(09\d{9}|989\d{9})$/.test(t),Ba=t=>{var e,a;return(t==null?void 0:t.token)||(t==null?void 0:t.access_token)||((e=t==null?void 0:t.data)==null?void 0:e.token)||((a=t==null?void 0:t.data)==null?void 0:a.access_token)},wt=(t,e)=>{t&&(e?(t.dataset.originalText=t.textContent,t.disabled=!0,t.textContent=D("auth.loading","لطفاً صبر کنید...")):(t.disabled=!1,t.textContent=t.dataset.originalText||t.textContent))};async function Da(){const t=H(`
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
          <h2>${D("auth.register_title","ساخت حساب کاربری")}</h2>
          <p>${D("auth.register_subtitle","برای شروع، اطلاعاتت رو وارد کن.")}</p>
        </div>

        <div data-step="phone">
          <form class="auth-form" data-phone-form>

            <div class="auth-field">
              <label for="register-name">
                ${D("auth.name_label","نام و نام خانوادگی")}
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                class="auth-input"
                placeholder="${D("auth.name_placeholder","نام و نام خانوادگی")}"
                autocomplete="name"
                required
              />
            </div>

            <div class="auth-field">
              <label for="register-phone">
                ${D("auth.phone_label","شماره موبایل")}
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
                ${D("auth.referral_label","کد معرف")}
                <span>(${D("common.optional","اختیاری")})</span>
              </label>
              <input
                id="register-referral"
                type="text"
                name="referral_code"
                class="auth-input"
                placeholder="${D("auth.referral_placeholder","مثلاً ABC123")}"
                dir="ltr"
                autocomplete="off"
              />
            </div>

            <button
              type="submit"
              class="primary-button w-button"
              data-submit-btn
            >
              ${D("auth.btn_send_otp_register","ارسال کد تأیید")}
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
                ${D("auth.otp_label","کد تأیید")}
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
              ${D("auth.btn_verify_register","تأیید و ثبت‌نام")}
            </button>
          </form>

          <div class="auth-resend">
            <button
              type="button"
              class="auth-link-btn"
              data-resend-btn
            >
              ${D("auth.btn_resend","ارسال مجدد کد")}
            </button>
            <span class="auth-timer" data-timer></span>
          </div>

          <div style="text-align:center;margin-top:16px">
            <button
              type="button"
              class="auth-link-btn"
              data-back-btn
            >
              ${D("auth.btn_back","بازگشت و ویرایش اطلاعات")}
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
          <span>${D("auth.have_account","قبلاً ثبت‌نام کردی؟")}</span>
          <a href="/login" data-nav-link>
            ${D("auth.link_login","ورود به حساب")}
          </a>
        </div>

      </div>
    </div>
  `);return setTimeout(()=>{W(),Ua()},100),t}function Ua(){var C;const t=document.querySelector(".auth-page");if(!t)return;const e=w=>t.querySelector(w),a=e('[data-step="phone"]'),n=e('[data-step="otp"]'),i=e("[data-phone-form]"),o=e("[data-otp-form]"),s=e("[data-main-footer]"),d=e("[data-msg]"),r=e("[data-phone-display]"),l=e("[data-resend-btn]"),b=e("[data-timer]"),A=e("[data-back-btn]");let k="",S="",I="",x=null;function u(w="",p="info"){d&&(d.textContent=w,d.style.display=w?"block":"none",d.style.color=p==="error"?"#b42318":p==="success"?"#626a4e":"#111111")}function v(w=60){x&&clearInterval(x);let p=w;l.disabled=!0;const m=()=>{if(p<=0){clearInterval(x),x=null,l.disabled=!1,b.textContent="";return}b.textContent=`(${p}s)`,p--};m(),x=setInterval(m,1e3)}function h(){a.style.display="none",n.style.display="block",s.style.display="none",r.textContent=k,v(60),u(),setTimeout(()=>{var w;(w=o.querySelector('[name="code"]'))==null||w.focus()},100)}i==null||i.addEventListener("submit",async w=>{w.preventDefault();const p=Object.fromEntries(new FormData(i)),m=String(p.name||"").trim(),$=Pa(p.phone||""),L=String(p.referral_code||"").trim().toUpperCase();if(!m){u("لطفاً نام خودت رو وارد کن.","error");return}if(!Ma($)){u(D("auth.msg_invalid_phone","شماره موبایل معتبر نیست."),"error");return}const _=e("[data-submit-btn]");wt(_,!0);try{await J.registerSendCode(m,$,L),S=m,k=$,I=L,h()}catch(M){u(M.message||D("auth.msg_error_send","ارسال کد با خطا مواجه شد."),"error")}finally{wt(_,!1)}}),o==null||o.addEventListener("submit",async w=>{var $;w.preventDefault();const p=Ot(new FormData(o).get("code")||"").trim();if(!/^\d{6}$/.test(p)){u(D("auth.msg_otp_incomplete","کد شش‌رقمی را وارد کن."),"error");return}const m=e("[data-otp-submit]");wt(m,!0);try{const L=await J.registerVerify(k,p),_=Ba(L),M=(L==null?void 0:L.user)||(($=L==null?void 0:L.data)==null?void 0:$.user)||{name:S,phone:k};if(!_)throw new Error(D("auth.msg_error_verify","تأیید کد ناموفق بود."));Dt(_,M),u(D("auth.msg_register_success","ثبت‌نام با موفقیت انجام شد."),"success"),setTimeout(()=>{var z,F;(F=(z=window.__app)==null?void 0:z.router)==null||F.navigate("/dashboard")},800)}catch(L){u(L.message||D("auth.msg_error_verify","کد تأیید نامعتبر است."),"error")}finally{wt(m,!1)}}),l==null||l.addEventListener("click",async()=>{if(!(l.disabled||!k)){l.disabled=!0;try{await J.registerSendCode(S,k,I),u(D("auth.msg_otp_resent","کد جدید ارسال شد."),"success"),v(60)}catch(w){l.disabled=!1,u(w.message||"خطا در ارسال مجدد کد.","error")}}}),A==null||A.addEventListener("click",()=>{x&&clearInterval(x),x=null,n.style.display="none",a.style.display="block",s.style.display="flex",o.reset(),u()}),(C=o==null?void 0:o.querySelector('[name="code"]'))==null||C.addEventListener("input",w=>{w.target.value=Ot(w.target.value).replace(/\D/g,"").slice(0,6)})}const N=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),mt=t=>String(t).replace(/\d/g,e=>"۰۱۲۳۴۵۶۷۸۹"[e]),dt=t=>new Intl.NumberFormat("fa-IR").format(Number(t||0)),_e=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],Ra=new Intl.DateTimeFormat("en-US-u-ca-persian",{timeZone:"UTC",year:"numeric",month:"numeric",day:"numeric"}),Oa=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Tehran",year:"numeric",month:"2-digit",day:"2-digit"});function Le(t,e){const a=t.formatToParts(e),n=i=>{var o;return Number((o=a.find(s=>s.type===i))==null?void 0:o.value)};return{year:n("year"),month:n("month"),day:n("day")}}function Ha({year:t,month:e,day:a}){return[String(t).padStart(4,"0"),String(e).padStart(2,"0"),String(a).padStart(2,"0")].join("-")}function Ee(){return Ha(Le(Oa,new Date))}function Qt(t){return new Date(`${String(t).slice(0,10)}T12:00:00Z`)}function re(t,e){const a=Qt(t);return a.setUTCDate(a.getUTCDate()+e),a.toISOString().slice(0,10)}function _t(t){return Le(Ra,Qt(t))}function At(t){if(!t)return"—";try{const{year:e,month:a,day:n}=_t(t);return`${mt(n)} ${_e[a-1]} ${mt(e)}`}catch{return String(t)}}function za(t=0){const e=_t(Ee()),a=e.year*12+e.month-1+t,n=Math.floor(a/12),i=(a%12+12)%12+1;let o=`${n+621}-03-15`,s=null;for(let r=0;r<380;r++){const l=_t(o);if(l.year===n&&l.month===i&&l.day===1){s=o;break}o=re(o,1)}if(!s)throw new Error("Unable to calculate Persian calendar");const d=[];for(o=s;d.length<31;){const r=_t(o);if(r.year!==n||r.month!==i)break;d.push({iso:o,day:r.day,weekday:Qt(o).getUTCDay()}),o=re(o,1)}return{year:n,month:i,days:d}}function Ht(t,e){var a,n;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((a=t==null?void 0:t.data)==null?void 0:a[e])?t.data[e]:Array.isArray((n=t==null?void 0:t.data)==null?void 0:n.data)?t.data.data:Array.isArray(t==null?void 0:t[e])?t[e]:[]}function Wa(t){var e,a,n,i;return((a=(e=t==null?void 0:t.data)==null?void 0:e.booking)==null?void 0:a.id)??((n=t==null?void 0:t.data)==null?void 0:n.id)??((i=t==null?void 0:t.booking)==null?void 0:i.id)??(t==null?void 0:t.booking_id)??null}function Ya(t){return Ht(t,"slots").filter(e=>e&&e.start_time&&e.end_time&&Array.isArray(e.staff_ids)).map(e=>({...e,start_time:String(e.start_time).slice(0,5),end_time:String(e.end_time).slice(0,5),staff_ids:[...new Set(e.staff_ids.map(Number).filter(a=>Number.isInteger(a)&&a>0))]})).filter(e=>e.staff_ids.length>0).sort((e,a)=>e.start_time.localeCompare(a.start_time)||e.end_time.localeCompare(a.end_time))}function $t(t){if(!["confirmed","pending","awaiting_payment"].includes(t.status))return!1;const a=String(t.booking_date||"").slice(0,10),n=String(t.start_time||"").slice(0,5);if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!/^\d{2}:\d{2}$/.test(n))return!1;const i=new Date(`${a}T${n}:00+03:30`);return Number.isFinite(i.getTime())&&i.getTime()-Date.now()>=24*60*60*1e3}async function ja(){if(!Kt())return queueMicrotask(()=>{var i,o;(o=(i=window.__app)==null?void 0:i.router)==null||o.navigate("/login")}),H(`
      <div class="nil-loading">
        در حال انتقال به ورود...
      </div>
    `);const t=be(),e=K()==="fa",a=(i,o)=>e?i:o,n=H(`
    <main
      class="nil-dashboard"
      data-nil-dashboard
      dir="${e?"rtl":"ltr"}"
    >
      <div class="nil-shell">

        <!-- HEADER -->
        <header class="nil-topbar">
          <div class="nil-brand">
            <div class="nil-brand-icon">N</div>
            <div>
              <strong>NIL BEAUTY</strong>
              <small>${a("پنل مشتریان","Customer dashboard")}</small>
            </div>
          </div>

          <button
            type="button"
            class="nil-icon-btn"
            data-nil-logout
            title="${a("خروج","Logout")}"
          >↪</button>
        </header>

        <!-- WELCOME -->
        <section class="nil-welcome">
          <div>
            <span class="nil-eyebrow">
              YOUR BEAUTY, YOUR TIME
            </span>

            <h1>
              ${a("سلام","Hello")}،
              ${N((t==null?void 0:t.name)||a("عزیز","there"))}
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
                ${a("خدمات دلخواهت رو انتخاب کن","Choose your favorite services")}
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

        <!-- BOOKINGS -->
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

      <!-- SELECTED SERVICES BAR -->
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
            >✕</button>
          </div>

          <div class="nil-progress">
            <span data-nil-progress="1" class="active"></span>
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
                ${a("انتخاب ساعت","Choose a time")}
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
  `);return setTimeout(()=>{const i=document.querySelector("[data-nil-dashboard]");i&&(W(),Ga(i,e))},100),n}function Ga(t,e){if(t.dataset.initialized==="1")return;t.dataset.initialized="1";const a=c=>t.querySelector(c),n=c=>[...t.querySelectorAll(c)],i=(c,f)=>e?c:f;let o=[],s=[],d=null,r=null,l=null,b=0,A=1,k=!1,S=!1,I=null,x=0;const u=a("[data-nil-modal]"),v=a("[data-nil-next]"),h=a("[data-nil-back]");function C(c="",f=!0){const E=a("[data-nil-message]");E.textContent=c,E.hidden=!c,E.classList.toggle("error",f)}function w(){let c=S;A===1&&(c||(c=!r)),A===2&&(c||(c=k||!l)),A===3&&(c||(c=!r||!l)),v.disabled=c}function p(c){A=c,C(),n("[data-nil-step]").forEach(f=>{f.hidden=Number(f.dataset.nilStep)!==c}),n("[data-nil-progress]").forEach(f=>{f.classList.toggle("active",Number(f.dataset.nilProgress)<=c)}),h.hidden=c===1,v.textContent=c===3?I?i("تأیید جابجایی","Confirm reschedule"):i("ثبت نوبت","Book now"):i("ادامه","Continue"),w()}function m(c){n("[data-nil-tab]").forEach(f=>{f.classList.toggle("active",f.dataset.nilTab===c)}),n("[data-nil-panel]").forEach(f=>{f.hidden=f.dataset.nilPanel!==c}),c==="bookings"&&ot(),c==="profile"&&st()}n("[data-nil-tab]").forEach(c=>{c.addEventListener("click",()=>{m(c.dataset.nilTab)})}),a("[data-nil-refresh]").addEventListener("click",ot),a("[data-nil-logout]").addEventListener("click",async()=>{var c,f;if(confirm(i("خارج می‌شوی؟","Log out?"))){try{await Ve()}catch(E){console.error("Logout error:",E)}(f=(c=window.__app)==null?void 0:c.router)==null||f.navigate("/login")}});async function $(){const c=a("[data-nil-services]");try{const f=await We.list();o=Ht(f,"services").filter(E=>![!1,0,"0"].includes(E.is_active)),L()}catch(f){c.innerHTML=`
        <div class="nil-empty">
          ${N(f.message)}
        </div>
      `}}function L(){const c=a("[data-nil-services]");if(!o.length){c.innerHTML=`
        <div class="nil-empty">
          ${i("خدمتی موجود نیست","No services available")}
        </div>
      `;return}c.innerHTML=o.map((f,E)=>{const T=s.some(y=>String(y.id)===String(f.id));return`
        <button
          type="button"
          class="nil-service ${T?"selected":""}"
          data-service-id="${N(f.id)}"
          aria-pressed="${T}"
        >
          <div class="nil-service-top">
            <span class="nil-service-number">
              ${String(E+1).padStart(2,"0")}
            </span>

            <span class="nil-service-check">
              ${T?"✓":"+"}
            </span>
          </div>

          <div class="nil-service-symbol">✧</div>

          <div class="nil-service-info">
            <h3>${N(f.name)}</h3>

            <p>
              ${N(f.description||i("خدمات زیبایی نیل","NIL beauty service"))}
            </p>

            <div class="nil-service-meta">
              <span>
                ◷ ${mt(f.duration||0)}
                ${i("دقیقه","min")}
              </span>

              <strong>
                ${dt(f.price)}
                ${i("تومان","Toman")}
              </strong>
            </div>
          </div>
        </button>
      `}).join(""),c.querySelectorAll("[data-service-id]").forEach(f=>{f.addEventListener("click",()=>{const E=o.find(y=>String(y.id)===f.dataset.serviceId);if(!E)return;s.some(y=>String(y.id)===String(E.id))?s=s.filter(y=>String(y.id)!==String(E.id)):s.push(E),L(),_()})})}function _(){const c=s.length;a("[data-nil-selection]").hidden=c===0,a("[data-nil-selection-count]").textContent=i(`${mt(c)} خدمت انتخاب شده`,`${c} selected services`);const f=s.reduce((E,T)=>E+Number(T.price||0),0);a("[data-nil-selection-total]").textContent=`${dt(f)} ${i("تومان","Toman")}`}a("[data-nil-continue]").addEventListener("click",M);function M(){if(!s.length)return;I=null,d=null,r=null,l=null,b=0,x++,k=!1,a("[data-nil-notes]").value="";const c=u.querySelector(".nil-dialog-header h2");c&&(c.textContent=i("رزرو نوبت","Book appointment")),u.hidden=!1,document.body.style.overflow="hidden",p(1),Y()}function z(c){var q;if(!$t(c)){alert(i("جابجایی نوبت فقط تا ۲۴ ساعت قبل امکان‌پذیر است.","Rescheduling requires at least 24 hours notice."));return}const f=c.booking_services||c.services||[];if(f.length!==1){alert(i("جابجایی نوبت چندخدمتی فعلاً پشتیبانی نمی‌شود.","Multi-service rescheduling is not supported yet."));return}const E=f[0].service_id||((q=f[0].service)==null?void 0:q.id),T=o.find(B=>String(B.id)===String(E));if(!T){alert(i("اطلاعات خدمت این نوبت پیدا نشد.","Booking service could not be found."));return}d=[...s],I=c,s=[T],r=null,l=null,b=0,x++,k=!1,a("[data-nil-notes]").value=c.notes||"";const y=u.querySelector(".nil-dialog-header h2");y&&(y.textContent=i("جابجایی نوبت","Reschedule appointment")),u.hidden=!1,document.body.style.overflow="hidden",p(1),Y()}function F(){if(S)return;x++,k=!1,I&&(s=d||[],L(),_()),I=null,d=null,r=null,l=null,u.hidden=!0,document.body.style.overflow="";const c=u.querySelector(".nil-dialog-header h2");c&&(c.textContent=i("رزرو نوبت","Book appointment")),p(1)}n("[data-nil-close]").forEach(c=>{c.addEventListener("click",F)});function Y(){var q,B;const c=a("[data-nil-calendar]");let f;try{f=za(b)}catch(O){c.textContent=O.message;return}const E=Ee(),T=e?["ش","ی","د","س","چ","پ","ج"]:["Sa","Su","Mo","Tu","We","Th","Fr"],y=(f.days[0].weekday+1)%7;c.innerHTML=`
      <div class="nil-calendar">

        <div class="nil-calendar-head">
          <button
            type="button"
            data-month-prev
            ${b===0?"disabled":""}
          >→</button>

          <div>
            <strong>
              ${_e[f.month-1]}
              ${mt(f.year)}
            </strong>

            <small>
              ${i("انتخاب تاریخ نوبت","Select a date")}
            </small>
          </div>

          <button
            type="button"
            data-month-next
          >←</button>
        </div>

        <div class="nil-weekdays">
          ${T.map(O=>`
            <span>${O}</span>
          `).join("")}
        </div>

        <div class="nil-calendar-grid">
          ${Array(y).fill("<span></span>").join("")}

          ${f.days.map(O=>{const rt=O.iso<E,lt=O.iso===E,bt=O.iso===r;return`
              <button
                type="button"
                data-calendar-date="${O.iso}"
                class="
                  ${lt?"today":""}
                  ${bt?"active":""}
                "
                ${rt?"disabled":""}
              >
                ${mt(O.day)}
                ${lt?"<i></i>":""}
              </button>
            `}).join("")}
        </div>

        <div class="nil-calendar-note">
          <span class="nil-calendar-dot"></span>
          ${i("تاریخ امروز مشخص شده است","Today is marked")}
        </div>

      </div>
    `,(q=c.querySelector("[data-month-prev]"))==null||q.addEventListener("click",()=>{b<=0||(b--,Y())}),(B=c.querySelector("[data-month-next]"))==null||B.addEventListener("click",()=>{b++,Y()}),c.querySelectorAll("[data-calendar-date]:not(:disabled)").forEach(O=>{O.addEventListener("click",()=>{r=O.dataset.calendarDate,l=null,Y(),w()})})}async function ft(){const c=a("[data-nil-times]"),f=++x;if(l=null,k=!0,w(),a("[data-nil-date-label]").textContent=At(r),c.innerHTML=`
      <div class="nil-loading">
        ${i("در حال بررسی ساعت‌های آزاد...","Checking available times...")}
      </div>
    `,s.length!==1){k=!1,w(),c.innerHTML=`
        <div class="nil-empty">
          ${i("رزرو همزمان چند خدمت نیاز به API ظرفیت ترکیبی دارد. فعلاً یک خدمت انتخاب کن.","Combined availability is required for multiple services. Please select one service.")}
        </div>
      `;return}const E=s[0];try{const T=await Ye.check(null,E.id,r,30);if(f!==x)return;const y=Ya(T);if(!y.length){c.innerHTML=`
          <div class="nil-empty">
            ${i("برای این روز ساعت آزادی پیدا نشد.","No available times for this date.")}
          </div>
        `;return}c.innerHTML=y.map((q,B)=>`
        <button
          type="button"
          class="nil-time"
          data-slot-index="${B}"
        >
          <span>
            ◷ ${N(q.start_time)}
          </span>

          <small style="
            display:block;
            margin-top:6px;
            opacity:.65;
            font-size:11px;
          ">
            ${i("تا","to")}
            ${N(q.end_time)}
          </small>
        </button>
      `).join(""),c.querySelectorAll("[data-slot-index]").forEach(q=>{q.addEventListener("click",()=>{var O;const B=y[Number(q.dataset.slotIndex)];(O=B==null?void 0:B.staff_ids)!=null&&O.length&&(l={start_time:B.start_time,end_time:B.end_time,duration:B.duration,staff_ids:B.staff_ids,staff_id:B.staff_ids[0]},c.querySelectorAll("[data-slot-index]").forEach(rt=>{rt.classList.toggle("active",rt===q)}),w())})})}catch(T){if(f!==x)return;console.error("Availability error:",T),c.innerHTML=`
        <div class="nil-empty">
          ${N(T.message||i("خطا در دریافت ساعت‌ها","Failed to load times"))}
        </div>
      `}finally{f===x&&(k=!1,w())}}function ht(){const c=s.reduce((E,T)=>E+Number(T.price||0),0),f=s.reduce((E,T)=>E+Number(T.deposit_amount||0),0);a("[data-nil-summary]").innerHTML=`
      <div class="nil-summary">

        ${s.map(E=>`
          <div class="nil-summary-row">
            <span>${N(E.name)}</span>

            <strong>
              ${dt(E.price)}
              ${i("تومان","Toman")}
            </strong>
          </div>
        `).join("")}

        <div class="nil-summary-row">
          <span>${i("تاریخ","Date")}</span>
          <strong>${At(r)}</strong>
        </div>

        <div class="nil-summary-row">
          <span>${i("ساعت شروع","Start time")}</span>
          <strong>
            ${N(l==null?void 0:l.start_time)}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>${i("ساعت پایان","End time")}</span>
          <strong>
            ${N(l==null?void 0:l.end_time)}
          </strong>
        </div>

        <div class="nil-summary-row">
          <span>${i("بیعانه","Deposit")}</span>
          <strong>
            ${dt(f)}
            ${i("تومان","Toman")}
          </strong>
        </div>

        <div class="nil-summary-row total">
          <span>${i("مبلغ کل","Total")}</span>
          <strong>
            ${dt(c)}
            ${i("تومان","Toman")}
          </strong>
        </div>

      </div>
    `}v.addEventListener("click",async()=>{if(!S){if(A===1){if(!r)return;p(2),await ft();return}if(A===2){if(!l)return;ht(),p(3);return}A===3&&(I?await j():await yt())}}),h.addEventListener("click",()=>{S||A<=1||(A===2&&(x++,k=!1,l=null),p(A-1))});async function yt(){var E,T;if(S)return;if(!r||!(l!=null&&l.staff_id)||s.length!==1){C(i("اطلاعات رزرو کامل نیست.","Booking details are incomplete."));return}S=!0,w();const c=s[0],f={booking_date:r,services:[{service_id:c.id,staff_id:l.staff_id,start_time:l.start_time}],notes:a("[data-nil-notes]").value.trim()||null};try{const y=await ut.create(f),q=Wa(y);if(!q){C(i("پاسخ سرور شناسه رزرو ندارد. قبل از تلاش مجدد، نوبت‌های من را بررسی کن.","Booking ID is missing. Check appointments before retrying."));return}s=[],r=null,l=null,L(),_(),u.hidden=!0,document.body.style.overflow="",(T=(E=window.__app)==null?void 0:E.router)==null||T.navigate(`/checkout?booking=${encodeURIComponent(q)}`)}catch(y){console.error("Booking error:",y),C(y.message||i("خطا در ثبت رزرو","Booking failed"))}finally{S=!1,w()}}async function j(){if(!(S||!I||!r||!(l!=null&&l.staff_id))){if(!$t(I)){C(i("مهلت جابجایی این نوبت تمام شده است.","The rescheduling deadline has passed."));return}S=!0,w();try{const c=await ut.reschedule(I.id,{booking_date:r,start_time:l.start_time,staff_id:l.staff_id});if((c==null?void 0:c.success)===!1||(c==null?void 0:c.is_status)===!1)throw new Error(c.message||"Reschedule failed");s=d||[],I=null,d=null,r=null,l=null,x++,k=!1,L(),_(),u.hidden=!0,document.body.style.overflow="";const f=u.querySelector(".nil-dialog-header h2");f&&(f.textContent=i("رزرو نوبت","Book appointment")),m("bookings"),alert(i("نوبت شما با موفقیت جابجا شد.","Your appointment was successfully rescheduled."))}catch(c){console.error("Reschedule error:",c),C(c.message||i("خطا در جابجایی نوبت","Unable to reschedule appointment"))}finally{S=!1,w()}}}async function ot(){const c=a("[data-nil-bookings]");c.innerHTML=`
      <div class="nil-loading">
        ${i("در حال دریافت نوبت‌ها...","Loading appointments...")}
      </div>
    `;try{const f=await ut.list(),E=Ht(f,"bookings");if(!E.length){c.innerHTML=`
          <div class="nil-empty">
            ${i("هنوز نوبتی ثبت نکردی.","No appointments yet.")}
          </div>
        `;return}const T={confirmed:i("تأیید شده","Confirmed"),awaiting_payment:i("در انتظار پرداخت","Awaiting payment"),pending:i("در انتظار","Pending"),cancelled:i("لغو شده","Cancelled"),completed:i("انجام شده","Completed")};c.innerHTML=E.map(y=>{const O=(y.booking_services||y.services||[]).map(lt=>{var bt;return((bt=lt.service)==null?void 0:bt.name)||lt.service_name||lt.name}).filter(Boolean).join(" + ")||i("نوبت زیبایی","Beauty appointment"),rt=$t(y);return`
          <article class="nil-booking-card">

            <div class="nil-booking-top">
              <div>
                <small>
                  ${At(y.booking_date)}
                </small>

                <h3>${N(O)}</h3>
              </div>

              <span class="nil-status">
                ${N(T[y.status]||y.status||"-")}
              </span>
            </div>

            <div class="nil-booking-bottom">
              <span>
                ◷ ${N(String(y.start_time||"").slice(0,5))}
              </span>

              <strong>
                ${dt(y.subtotal??y.total_amount??0)}
                ${i("تومان","Toman")}
              </strong>
            </div>

            <div class="nil-booking-actions">

              ${y.status==="awaiting_payment"?`
                <button
                  type="button"
                  data-booking-pay="${N(y.id)}"
                >
                  ${i("ادامه پرداخت","Continue payment")}
                </button>
              `:""}

              ${rt?`
                <button
                  type="button"
                  class="nil-reschedule-btn"
                  data-booking-reschedule="${N(y.id)}"
                >
                  ◷ ${i("تغییر تاریخ و ساعت","Reschedule")}
                </button>

                <button
                  type="button"
                  data-booking-cancel="${N(y.id)}"
                >
                  ${i("لغو نوبت","Cancel")}
                </button>
              `:""}

            </div>
          </article>
        `}).join(""),c.querySelectorAll("[data-booking-reschedule]").forEach(y=>{y.addEventListener("click",()=>{const q=E.find(B=>String(B.id)===y.dataset.bookingReschedule);q&&z(q)})}),c.querySelectorAll("[data-booking-pay]").forEach(y=>{y.addEventListener("click",()=>{var q,B;(B=(q=window.__app)==null?void 0:q.router)==null||B.navigate(`/checkout?booking=${encodeURIComponent(y.dataset.bookingPay)}`)})}),c.querySelectorAll("[data-booking-cancel]").forEach(y=>{y.addEventListener("click",async()=>{const q=E.find(B=>String(B.id)===y.dataset.bookingCancel);if(q){if(!$t(q)){alert(i("لغو نوبت فقط تا ۲۴ ساعت قبل امکان‌پذیر است.","Cancellation requires at least 24 hours notice."));return}if(confirm(i("آیا از لغو این نوبت مطمئن هستید؟","Are you sure you want to cancel this appointment?"))){y.disabled=!0;try{await ut.cancel(q.id),await ot(),alert(i("نوبت شما با موفقیت لغو شد.","Your appointment was cancelled successfully."))}catch(B){console.error("Cancel booking error:",B),alert(B.message||i("خطا در لغو نوبت","Cancellation failed")),y.isConnected&&(y.disabled=!1)}}}})})}catch(f){console.error("Load bookings error:",f),c.innerHTML=`
        <div class="nil-empty">
          ${N(f.message)}
        </div>
      `}}async function st(){var f,E;const c=a("[data-nil-profile]");c.innerHTML=`
      <div class="nil-loading">
        ${i("در حال بارگذاری...","Loading...")}
      </div>
    `;try{const T=await Jt.get(),y=((f=T==null?void 0:T.data)==null?void 0:f.client)||(T==null?void 0:T.data)||{};c.innerHTML=`
        <div class="nil-profile-card">

          <div class="nil-profile-head">
            <div class="nil-avatar">
              ${N(String(y.name||"?").charAt(0))}
            </div>

            <div>
              <h3>
                ${N(y.name||"-")}
              </h3>

              <p>
                ${N(y.phone||"-")}
              </p>
            </div>
          </div>

          <div class="nil-profile-field">
            <span>${i("نام","Name")}</span>
            <strong>
              ${N(y.name||"-")}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>${i("ایمیل","Email")}</span>
            <strong>
              ${N(y.email||"-")}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>${i("شماره موبایل","Phone")}</span>
            <strong>
              ${N(y.phone||"-")}
            </strong>
          </div>

          <div class="nil-profile-field">
            <span>${i("کد معرف","Referral code")}</span>
            <strong>
              ${N(y.referral_code||"-")}
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
      `,(E=c.querySelector("[data-edit-profile]"))==null||E.addEventListener("click",()=>{Te(y)})}catch(T){c.innerHTML=`
        <div class="nil-empty">
          ${N(T.message)}
        </div>
      `}}function Te(c){const f=a("[data-nil-profile]");f.innerHTML=`
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
          value="${N(c.name||"")}"
          required
        >

        <label class="nil-field-label">
          ${i("ایمیل","Email")}
        </label>

        <input
          class="nil-input"
          name="email"
          type="email"
          value="${N(c.email||"")}"
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
    `,f.querySelector("[data-profile-back]").addEventListener("click",st),f.querySelector("[data-profile-form]").addEventListener("submit",async E=>{E.preventDefault();const T=E.currentTarget,y=T.querySelector('[type="submit"]');y.disabled=!0;try{await Jt.update({name:T.elements.name.value.trim(),email:T.elements.email.value.trim()||null}),await st()}catch(q){T.querySelector("[data-profile-error]").textContent=q.message,y.disabled=!1}})}$()}function Z(t=""){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Fa(t){if(!t||typeof t!="string")return"";const e=t.trim();if(!e)return"";try{if(/^https?:\/\//i.test(e)){const i=new URL(e),o=["localhost","127.0.0.1"];return o.includes(i.hostname.toLowerCase())&&!o.includes(window.location.hostname.toLowerCase())?"":i.href}if(e.startsWith("//"))return window.location.protocol+e;if(/^[a-z][a-z0-9+.-]*:/i.test(e))return"";const a=new URL("/api",window.location.origin),n=e.startsWith("/")?e:"/"+e;return n.startsWith("/storage/")||n.startsWith("/uploads/")?new URL(n,a.origin).href:new URL(n,window.location.origin).href}catch{return""}}function le(t){var e;return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.data)?t.data:Array.isArray((e=t==null?void 0:t.data)==null?void 0:e.data)?t.data.data:[]}async function Va(){const t=K()==="fa",e=H(`
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
            ${Z(g("common.loading"))}
          </div>
        </div>

        <div class="gallery-grid" data-gallery-grid>
          <div class="loading-placeholder">
            ${Z(g("common.loading"))}
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
  `);return setTimeout(()=>{document.querySelector("[data-gallery-grid]")&&(W(),Ka(t))},100),e}function Ka(t){const e=document.querySelector("[data-gallery-filters]"),a=document.querySelector("[data-gallery-grid]"),n=document.querySelector("[data-lightbox]"),i=document.querySelector("[data-lightbox-img]");if(!e||!a||!n||!i)return;let o=null,s=0,d=null,r="";const l=n.querySelector(".gallery-lightbox-close"),b=()=>e.isConnected&&a.isConnected&&n.isConnected;async function A(){try{const v=await Bt.categories();if(!b())return;const h=le(v);e.innerHTML=`
        <button
          type="button"
          class="gallery-filter-btn active"
          data-category="all"
          aria-pressed="true"
        >
          ${t?"همه":"All"}
        </button>

        ${h.map(C=>`
          <button
            type="button"
            class="gallery-filter-btn"
            data-category="${Z(C.id)}"
            aria-pressed="false"
          >
            ${Z(C.name)}
          </button>
        `).join("")}
      `}catch(v){if(!b())return;console.error("❌ Categories error:",v),e.innerHTML=`
        <p>
          ${t?"خطا در بارگذاری دسته‌بندی‌ها":"Failed to load categories"}
        </p>
      `}}async function k(v=null){const h=++s;a.innerHTML=`
      <div class="loading-placeholder">
        ${Z(g("common.loading"))}
      </div>
    `;try{const C=await Bt.list(v);if(!b()||h!==s)return;const w=le(C);if(!w.length){a.innerHTML=`
          <div class="gallery-empty">
            <p>
              ${t?"تصویری در این دسته وجود ندارد":"No images in this category"}
            </p>
          </div>
        `;return}a.innerHTML=w.map(p=>{var _;const m=Fa(p.image),$=Z(p.title||""),L=Z(((_=p.category)==null?void 0:_.name)||"");return m?`
          <div
            class="gallery-item"
            role="button"
            tabindex="0"
            data-image="${Z(m)}"
            data-title="${$}"
            aria-label="${$||(t?"نمایش تصویر":"View image")}"
          >

            <div class="gallery-item-img">
              <img
                src="${Z(m)}"
                loading="lazy"
                alt="${$}"
              />
            </div>

            <div class="gallery-item-info">
              <h3 class="gallery-item-title">
                ${$}
              </h3>

              <div class="gallery-item-category">
                ${L}
              </div>
            </div>

          </div>
        `:""}).join("")}catch(C){if(!b()||h!==s)return;console.error("❌ Gallery error:",C),a.innerHTML=`
        <p>
          ${t?"خطا در بارگذاری گالری":"Failed to load gallery"}
        </p>
      `}}e.addEventListener("click",v=>{const h=v.target.closest("[data-category]");if(!h||!e.contains(h))return;const C=h.dataset.category;C==="all"&&o===null||C!==String(o)&&(o=C==="all"?null:C,e.querySelectorAll("[data-category]").forEach(w=>{const p=w===h;w.classList.toggle("active",p),w.setAttribute("aria-pressed",String(p))}),k(o))});function S(v,h=""){!v||!b()||(d=document.activeElement,r=document.body.style.overflow,i.src=v,i.alt=h,n.style.display="flex",document.body.style.overflow="hidden",l==null||l.focus())}function I(){n.style.display==="flex"&&(n.style.display="none",i.removeAttribute("src"),document.body.style.overflow=r,d!=null&&d.isConnected&&d.focus())}a.addEventListener("click",v=>{const h=v.target.closest(".gallery-item");!h||!a.contains(h)||S(h.dataset.image,h.dataset.title)}),a.addEventListener("keydown",v=>{if(v.key!=="Enter"&&v.key!==" ")return;const h=v.target.closest(".gallery-item");!h||!a.contains(h)||(v.preventDefault(),S(h.dataset.image,h.dataset.title))}),n.addEventListener("click",v=>{v.target.closest("[data-lightbox-close]")&&I()});const x=v=>{if(!b()){document.removeEventListener("keydown",x);return}n.style.display==="flex"&&(v.key==="Escape"&&I(),v.key==="Tab"&&(v.preventDefault(),l==null||l.focus()))};document.addEventListener("keydown",x);const u=()=>{b()||(document.body.style.overflow=r,document.removeEventListener("keydown",x),window.removeEventListener("pageChanged",u))};window.addEventListener("pageChanged",u),A(),k(null)}async function Qa(){const t=H(`
    <div class="section" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center">
      <div>
        <h1 style="font-size:6rem;margin:0">404</h1>
        <h2>${g("not_found.title")}</h2>
        <p>${g("not_found.description")}</p>
        <a href="/" class="primary-button w-button" data-nav-link>${g("not_found.back_home")}</a>
      </div>
    </div>
  `);return queueMicrotask(()=>W()),t}const Ja=(t,e)=>{const a=g(t);return a&&a!==t?a:e};function zt(t=""){const e="۰۱۲۳۴۵۶۷۸۹",a="٠١٢٣٤٥٦٧٨٩";return String(t).replace(/[۰-۹]/g,n=>String(e.indexOf(n))).replace(/[٠-٩]/g,n=>String(a.indexOf(n)))}function Za(t){return zt(t).replace(/\D/g,"")}function Xa(t){return/^(09\d{9}|989\d{9})$/.test(t)}const kt={sendCode:t=>J.forgotSendCode(t),verifyCode:(t,e)=>J.forgotVerify(t,e),reset:(t,e,a,n)=>J.forgotReset(t,e,a,n)};async function tn(){const t=H(`
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
  `);return setTimeout(()=>{W(),en()},100),t}function en(){var p;const t=document.querySelector(".auth-page");if(!t)return;const e=m=>t.querySelector(m),a=m=>t.querySelectorAll(m),n=e("[data-forgot-phone-form]"),i=e("[data-forgot-otp-form]"),o=e("[data-forgot-reset-form]"),s=e("[data-forgot-msg]"),d=e("[data-forgot-footer]"),r=e("[data-phone-display]"),l=e("[data-resend-btn]"),b=e("[data-timer]"),A=e("[data-back-phone]");let k="",S="",I=null,x=!1;function u(m){a("[data-forgot-step]").forEach($=>{$.style.display=$.dataset.forgotStep===m?"block":"none"}),d&&(d.style.display=m==="success"?"none":"flex"),v("")}function v(m="",$="info"){s&&(s.textContent=m,s.style.display=m?"block":"none",s.style.color=$==="error"?"#b42318":$==="success"?"#626a4e":"#111111")}function h(m,$){m&&($?(m.dataset.originalText=m.textContent,m.disabled=!0,m.textContent=Ja("auth.loading","لطفاً صبر کنید...")):(m.disabled=!1,m.textContent=m.dataset.originalText||m.textContent))}function C(){I&&(clearInterval(I),I=null)}function w(m=60){C();let $=m;l.disabled=!0;const L=()=>{if($<=0){C(),l.disabled=!1,b.textContent="";return}b.textContent=`(${$}s)`,$--};L(),I=setInterval(L,1e3)}n==null||n.addEventListener("submit",async m=>{m.preventDefault();const $=Za(new FormData(n).get("phone")||"");if(!Xa($)){v("شماره موبایل معتبر نیست.","error");return}const L=n.querySelector("[data-submit-btn]");h(L,!0);try{await kt.sendCode($),k=$,S="",r.textContent=$,u("otp"),w(60),setTimeout(()=>{var _;(_=i.querySelector('[name="code"]'))==null||_.focus()},100)}catch(_){v(_.message||"ارسال کد بازیابی ناموفق بود.","error")}finally{h(L,!1)}}),(p=i==null?void 0:i.querySelector('[name="code"]'))==null||p.addEventListener("input",m=>{m.target.value=zt(m.target.value).replace(/\D/g,"").slice(0,6)}),i==null||i.addEventListener("submit",async m=>{var _;m.preventDefault();const $=zt(new FormData(i).get("code")||"").trim();if(!/^\d{6}$/.test($)){v("کد تأیید باید شش‌رقمی باشد.","error");return}const L=i.querySelector("[data-submit-btn]");h(L,!0);try{const M=await kt.verifyCode(k,$),z=(M==null?void 0:M.reset_token)||((_=M==null?void 0:M.data)==null?void 0:_.reset_token);if(!z)throw new Error("توکن بازیابی رمز عبور از سرور دریافت نشد.");S=z,C(),u("reset")}catch(M){v(M.message||"کد تأیید نامعتبر است.","error")}finally{h(L,!1)}}),o==null||o.addEventListener("submit",async m=>{m.preventDefault();const $=Object.fromEntries(new FormData(o)),L=String($.password||""),_=String($.password_confirmation||"");if(L.length<8){v("رمز عبور باید حداقل ۸ کاراکتر باشد.","error");return}if(L!==_){v("رمز عبور و تکرار آن یکسان نیستند.","error");return}if(!k||!S){v("ابتدا شماره موبایل خود را تأیید کنید.","error");return}const M=o.querySelector("[data-submit-btn]");h(M,!0);try{await kt.reset(k,S,L,_),o.reset(),S="",u("success")}catch(z){v(z.message||"تغییر رمز عبور ناموفق بود.","error")}finally{h(M,!1)}}),l==null||l.addEventListener("click",async()=>{if(!(l.disabled||x||!k)){x=!0,l.disabled=!0;try{await kt.sendCode(k),S="",i.reset(),v("کد جدید ارسال شد.","success"),w(60)}catch(m){l.disabled=!1,v(m.message||"ارسال مجدد کد ناموفق بود.","error")}finally{x=!1}}}),A==null||A.addEventListener("click",()=>{C(),k="",S="",i.reset(),u("phone")})}const ce=(t="")=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),an=()=>new URLSearchParams(window.location.search).get("booking_id");async function nn(){const t=K()==="fa",e=an(),a=H(`
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
  `);return setTimeout(()=>{W();const n=document.querySelector(".nil-payment-page");n&&on(n,e,t)},100),a}async function on(t,e,a){var s;const n=t.querySelector("h1"),i=t.querySelector("[data-payment-description]"),o=t.querySelector("[data-payment-details]");if(!e){n.textContent=a?"وضعیت پرداخت نامشخص است":"Payment Status Unknown",i.textContent=a?"شناسه نوبت در آدرس موجود نیست. لطفاً وضعیت را در نوبت‌های خود بررسی کنید.":"Booking ID is missing. Please check your bookings.";return}try{const d=await G(`/v1/bookings/${encodeURIComponent(e)}`);if(!t.isConnected)return;const r=((s=d==null?void 0:d.data)==null?void 0:s.booking)||(d==null?void 0:d.data)||(d==null?void 0:d.booking)||d,l=String((r==null?void 0:r.payment_status)||"").toLowerCase();if(!["paid","completed","success","successful"].includes(l)){n.textContent=a?"پرداخت هنوز تأیید نشده":"Payment Not Confirmed",i.textContent=a?"هنوز پرداخت موفقی برای این نوبت ثبت نشده است. وضعیت نوبت را بررسی کنید.":"A successful payment has not been recorded for this booking.";return}n.textContent=a?"پرداخت موفق!":"Payment Successful!",i.textContent=a?"بیعانه نوبت شما با موفقیت پرداخت و ثبت شد.":"Your booking deposit has been successfully paid.",o.hidden=!1,o.innerHTML=`
      <div class="nil-payment-detail-row">
        <span>${a?"شماره نوبت":"Booking Number"}</span>
        <strong>#${ce(r.id||e)}</strong>
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
          <strong>${ce(r.booking_date)}</strong>
        </div>
      `:""}
    `}catch(d){if(!t.isConnected)return;console.error("Payment verification display:",d),n.textContent=a?"خطا در بررسی پرداخت":"Verification Error",i.textContent=a?"امکان دریافت وضعیت پرداخت وجود ندارد. لطفاً نوبت‌های خود را بررسی کنید.":"Unable to retrieve payment status. Please check your bookings."}}async function sn(){const t=K()==="fa",e=H(`
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
  `);return setTimeout(()=>W(),100),e}window.addEventListener("error",t=>console.error("🚨",t.error||t.message));window.addEventListener("unhandledrejection",t=>console.error("🚨",t.reason));const rn=[{path:"/",component:Xe,title:"Nil Beauty"},{path:"/about",component:na,title:"درباره ما"},{path:"/gallery",component:Va,title:"گالری"},{path:"/blog",component:da,title:"بلاگ"},{path:"/blog/:id",component:ha,title:"مقاله"},{path:"/contact",component:$a,title:"تماس"},{path:"/faq",component:Sa,title:"سوالات"},{path:"/checkout",component:Ca,title:"پرداخت"},{path:"/login",component:qa,title:"ورود"},{path:"/forgot-password",component:tn,title:"بازیابی رمز عبور"},{path:"/register",component:Da,title:"ثبت‌نام"},{path:"/dashboard",component:ja,title:"داشبورد"},{path:"/payment/success",component:nn,title:"پرداخت موفق"},{path:"/payment/failed",component:sn,title:"پرداخت ناموفق"},{path:"*",component:Qa,title:"404"}];async function ln(){console.log("🚀 Bootstrap started");try{if(await ge(),Fe(),!document.querySelector("#app"))throw new Error("#app not found");const e=new Ce(rn,"#app");e.start(),window.__app={router:e},window.addEventListener("pageChanged",()=>{setTimeout(()=>{we()},100)}),console.log("🎉 Nil Beauty initialized")}catch(t){console.error("❌ Bootstrap failed:",t);const e=document.getElementById("app");e&&(e.innerHTML=`<div style="padding:40px;color:red"><h2>خطا</h2><pre>${t.message}</pre></div>`)}}ln();
