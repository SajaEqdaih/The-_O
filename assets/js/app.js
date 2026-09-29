
(function(){
"use strict";
var safeStore={get:function(k,d){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// ------------------------------------------------------------------
// Session / role resolution — single source of truth for the whole
// site. Reads the new `mada_user_session` record first (the shape a
// real auth layer will eventually write), then falls back to the
// legacy `mada_user_role` key and finally the per-page `data-role`
// attribute, so nothing already wired against those breaks.
// ------------------------------------------------------------------
var MadaSession = (function(){
  function normalizeRole(r){
    if(r === "creator") return "influencer";
    if(r === "venue") return "business";
    return r;
  }
  function get(){
    try{
      var raw = localStorage.getItem("mada_user_session");
      if(raw){
        var parsed = JSON.parse(raw);
        parsed.role = normalizeRole(parsed.role);
        return parsed;
      }
    }catch(e){}
    var legacyRole = null, name = null;
    try{ legacyRole = localStorage.getItem("mada_user_role"); }catch(e){}
    try{ name = localStorage.getItem("mada_user_name"); }catch(e){}
    var role = normalizeRole(legacyRole) || document.body.getAttribute("data-role") || "guest";
    var uid = (window.MadaDB && MadaDB.currentUid) ? MadaDB.currentUid() : null;
    return { role: role, name: name, uid: uid };
  }
  function set(session){
    try{ localStorage.setItem("mada_user_session", JSON.stringify(session)); }catch(e){}
  }
  // Business dashboard pages need a concrete businessUid to query MadaDB with.
  // Falls back to the seeded demo business so every already-wired page keeps
  // working even when nobody has gone through registration in this browser.
  function currentBusinessUid(){
    var s = get();
    return (s.role === "business" && s.uid) ? s.uid : "biz_luna";
  }
  // "Authenticated" means an explicit registration/login happened in this
  // browser — NOT merely that a page's own data-role attribute resolved a
  // role for us (that fallback exists for display purposes only, and must
  // not be able to satisfy the route guard below).
  function isAuthenticated(){
    try{
      return !!(localStorage.getItem("mada_user_session") || localStorage.getItem("mada_registered"));
    }catch(e){ return false; }
  }
  return { get: get, set: set, currentBusinessUid: currentBusinessUid, isAuthenticated: isAuthenticated };
})();
window.MadaSession = MadaSession;

// ------------------------------------------------------------------
// Auth route guarding. Explicit whitelists (not prefix-guessing) so
// public marketing/registration pages under the same business-/
// influencer- naming stay open. Fires as early as possible, before
// DOMContentLoaded, to avoid a flash of protected content.
// ------------------------------------------------------------------
var BUSINESS_PROTECTED = ["business-dashboard.html","applicants.html","business-my-offers.html","business-analytics.html","business-profile.html","business-settings.html","business-calendar.html","business-notifications.html","create-offer.html","business-onboarding.html"];
var INFLUENCER_PROTECTED = ["influencer-my-offers.html","influencer-profile.html","influencer-calendar.html","influencer-notifications.html","saved-offers.html"];

function guardRoute(){
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var needsAuth = BUSINESS_PROTECTED.indexOf(path) > -1 || INFLUENCER_PROTECTED.indexOf(path) > -1;
  if(needsAuth && !MadaSession.isAuthenticated()){
    location.replace("login.html?return=" + encodeURIComponent(path));
    return true;
  }
  return false;
}
var redirecting = guardRoute();

// ------------------------------------------------------------------
// Toast engine passthrough — the real implementation lives in
// MadaUI (ui-kit.js), which loads later on every page; this just
// gives the rest of the app a stable `showToast(message, type)`
// name to call regardless of load order.
// ------------------------------------------------------------------
window.showToast = function(message, type){
  (window.MadaUI ? MadaUI.toast : (window.toast || function(){}))(message, type || "success");
};

if(!redirecting){

// ------------------------------------------------------------------
// Save / join quick-actions on public offer cards (guest + creator).
// ------------------------------------------------------------------
document.addEventListener("click",function(e){
 var save=e.target.closest("[data-save]"); if(save){var a=safeStore.get("saved",[]),id=save.getAttribute("data-save");if(a.indexOf(id)<0)a.push(id);safeStore.set("saved",a);showToast("تم حفظ العرض","success")}
 var join=e.target.closest("[data-join]"); if(join){var j=safeStore.get("joined",[]),jid=join.getAttribute("data-join");if(j.indexOf(jid)<0)j.push(jid);safeStore.set("joined",j);showToast("تم إرسال طلب الانضمام","success")}
 var proof=e.target.closest("[data-proof]"); if(proof){var u=prompt("أدخل رابط إثبات التسليم:");if(u)showToast("تم إرسال الإثبات للمراجعة","success")}
});

// ------------------------------------------------------------------
// Theme is persisted, but the control lives inside the mobile menu / settings
// instead of floating over page content.
// ------------------------------------------------------------------
var currentTheme="light";try{currentTheme=localStorage.getItem("madaTheme")||"light"}catch(e){}
document.body.setAttribute("data-theme",currentTheme);
function toggleTheme(){
  var next=document.body.getAttribute("data-theme")==="dark"?"light":"dark";
  document.body.setAttribute("data-theme",next);
  try{localStorage.setItem("madaTheme",next)}catch(e){}
  document.dispatchEvent(new CustomEvent("theo-theme-change",{detail:{theme:next}}));
}
window.TheOTheme={toggle:toggleTheme,get:function(){return document.body.getAttribute("data-theme")||"light"}};

// ------------------------------------------------------------------
// Floating mobile navigation. The active O bubble glides between tabs.
// ------------------------------------------------------------------
var BOTTOM_NAV = {
  guest: [
    ["index.html","⌂","الرئيسية","Home"],
    ["index.html#discover","⌕","الفرص","Opportunities"],
    ["login.html","◉","دخول","Sign in"]
  ],
  influencer: [
    ["index.html","⌂","الرئيسية","Home"],
    ["index.html#discover","⌕","الفرص","Opportunities"],
    ["influencer-my-offers.html","◇","طلبات التعاون","Applications"],
    ["saved-offers.html","♡","المحفوظات","Saved"],
    ["influencer-profile.html","◉","حسابي","Profile"]
  ],
  business: [
    ["business-dashboard.html","⌂","الرئيسية","Home"],
    ["business-my-offers.html","□","تجاربي","Experiences"],
    ["applicants.html","◇","الطلبات","Applications"],
    ["business-profile.html","◉","نشاطي","Business"]
  ]
};
function injectBottomNav(){
  if(document.querySelector(".mada-bottom-nav")) return;
  var role=MadaSession.get().role,items=BOTTOM_NAV[role]; if(!items)return;
  var path=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  var hash=location.hash||"";
  function activeFor(href){
    var parts=href.split("#"), hp=parts[0].toLowerCase(), hh=parts[1]?"#"+parts[1]:"";
    if(path!==hp)return false; if(hh)return hash===hh; return !hash||hash!=="#discover";
  }
  var nav=document.createElement("nav"); nav.className="mada-bottom-nav theo-floating-nav"; nav.setAttribute("aria-label","Main navigation");
  nav.innerHTML='<span class="theo-nav-bubble" aria-hidden="true"><img src="assets/images/the-o-logo.png" alt=""></span>'+items.map(function(it,i){return '<a href="'+it[0]+'" data-index="'+i+'"'+(activeFor(it[0])?' class="active"':'')+'><span class="nav-icon">'+it[1]+'</span><small data-ar="'+it[2]+'" data-en="'+it[3]+'">'+it[2]+'</small></a>'}).join('');
  document.body.appendChild(nav); document.body.classList.add("has-mada-bottom-nav");
  function sync(){
    var lang=(document.documentElement.lang||"ar").startsWith("en")?"en":"ar";
    nav.querySelectorAll("small").forEach(function(el){el.textContent=el.dataset[lang]});
    var links=Array.from(nav.querySelectorAll("a")), active=nav.querySelector("a.active")||links[0];
    var idx=Math.max(0,links.indexOf(active)); nav.style.setProperty("--active-index",idx); nav.style.setProperty("--tab-count",links.length);
  }
  sync(); requestAnimationFrame(sync); window.addEventListener("resize",sync); document.addEventListener("mada-language-change",sync);
}

// ------------------------------------------------------------------
// Chatbot positioning & keyboard/scroll avoidance.
// The rich assistant widget itself lives in mada-chatbot.js; this
// only manages *when it should get out of the way* — an active text
// field (mobile keyboard), active scrolling, or the intro of a
// heavy form page — and restores it once things settle.
// ------------------------------------------------------------------
var HEAVY_FORM_PAGES = ["create-offer.html","business-register.html","influencer-register.html"];

function setupChatbotBehavior(){
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var inputFocused = false;
  function launcher(){ return document.querySelector(".mada-chat-launcher"); }
  function setHidden(hide){ var l=launcher(); if(l) l.classList.toggle("mada-chat-hidden", hide); }

  document.addEventListener("focusin", function(e){
    if(e.target.matches && e.target.matches("input, textarea, select")){ inputFocused = true; setHidden(true); }
  });
  document.addEventListener("focusout", function(e){
    if(e.target.matches && e.target.matches("input, textarea, select")){
      setTimeout(function(){
        var active = document.activeElement;
        if(!active || !(active.matches && active.matches("input, textarea, select"))){ inputFocused = false; setHidden(false); }
      }, 80);
    }
  });

  if(HEAVY_FORM_PAGES.indexOf(path) > -1) setHidden(true);

  var idleTimer = null;
  window.addEventListener("scroll", function(){
    if(inputFocused) return;
    setHidden(true);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function(){ if(!inputFocused) setHidden(false); }, 500);
  }, { passive: true });
}

// ------------------------------------------------------------------
// Offline / online awareness banner.
// ------------------------------------------------------------------
function setupOfflineBanner(){
  var banner = document.createElement("div");
  banner.className = "mada-offline-banner";
  banner.textContent = "أنت تعمل في وضع عدم الاتصال حالياً";
  document.body.appendChild(banner);
  function update(){
    banner.classList.toggle("show", !navigator.onLine);
    if(navigator.onLine && banner.dataset.wasOffline === "1"){
      showToast("تم استعادة الاتصال بالإنترنت","success");
      banner.dataset.wasOffline = "0";
    }
    if(!navigator.onLine) banner.dataset.wasOffline = "1";
  }
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

function boot(){
  injectBottomNav();
  setupChatbotBehavior();
  setupOfflineBanner();
}
document.addEventListener("DOMContentLoaded", boot);
// Scripts on every page run synchronously before DOMContentLoaded fires,
// but guard for the (rare) case this file loads after that event already fired.
if(document.readyState === "interactive" || document.readyState === "complete") boot();

} // end if(!redirecting)

})();
