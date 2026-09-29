
(function(){
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const path=(location.pathname.split("/").pop()||"index.html").toLowerCase();

  // Mobile menu on every normal header
  const topin=$(".top .topin");
  const nav=topin?.querySelector(".nav");
  if(topin && nav && !topin.querySelector(".mada-mobile-menu-btn")){
    const menuBtn=document.createElement("button");
    menuBtn.type="button";
    menuBtn.className="mada-mobile-menu-btn";
    menuBtn.setAttribute("aria-label","فتح القائمة");
    menuBtn.setAttribute("aria-expanded","false");
    menuBtn.innerHTML="<span></span><span></span><span></span>";

    const overlay=document.createElement("div");
    overlay.className="mada-mobile-overlay";
    overlay.innerHTML='<div class="mada-mobile-sheet" role="dialog" aria-label="القائمة"><div class="mada-sheet-head"><strong>القائمة</strong><button type="button" class="mada-sheet-close" aria-label="إغلاق">×</button></div><nav class="mada-sheet-links"></nav></div>';
    document.body.appendChild(overlay);

    const links=overlay.querySelector(".mada-sheet-links");
    Array.from(nav.querySelectorAll("a")).forEach(a=>{
      const c=a.cloneNode(true); links.appendChild(c);
    });

    // Move useful top actions into the mobile sheet as cloned actions.
    Array.from(topin.children).forEach(el=>{
      if(el===nav || el.classList?.contains("brand") || el.classList?.contains("mada-mobile-menu-btn")) return;
      if(el.matches?.("a,button,.mada-site-lang,.mada-name-chip")){
        const c=el.cloneNode(true);
        c.classList.add("mada-sheet-action");
        links.appendChild(c);
      }
    });

    const theme=document.createElement("button");
    theme.type="button"; theme.className="mada-sheet-action theo-theme-menu";
    const paintTheme=()=>{const dark=document.body.getAttribute("data-theme")==="dark"; const en=(document.documentElement.lang||"ar").startsWith("en"); theme.textContent=(dark?"☀ ":"☾ ")+(en?(dark?"Light mode":"Dark mode"):(dark?"الوضع الفاتح":"الوضع الداكن"));};
    theme.addEventListener("click",()=>{window.TheOTheme?.toggle();paintTheme()});
    document.addEventListener("mada-language-change",paintTheme); document.addEventListener("theo-theme-change",paintTheme);
    paintTheme(); links.appendChild(theme);

    topin.appendChild(menuBtn);
    const open=()=>{overlay.classList.add("open");document.body.classList.add("mada-menu-open");menuBtn.setAttribute("aria-expanded","true")};
    const close=()=>{overlay.classList.remove("open");document.body.classList.remove("mada-menu-open");menuBtn.setAttribute("aria-expanded","false")};
    menuBtn.addEventListener("click",open);
    overlay.querySelector(".mada-sheet-close").addEventListener("click",close);
    overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
    links.addEventListener("click",e=>{if(e.target.closest("a"))close()});
  }

  // NOTE: the persistent, role-aware bottom navigation shell is now
  // built once in assets/js/app.js (injectBottomNav) for every
  // qualifying role on every page — not just influencer-prefixed
  // ones — so it is intentionally not duplicated here.

  // Prevent large fixed inline widths from breaking mobile.
  $$("[style]").forEach(el=>{
    const st=el.getAttribute("style")||"";
    if(/width:\s*[5-9]\d\dpx|width:\s*\d{4,}px|min-width:\s*[4-9]\d\dpx/i.test(st)){
      el.style.maxWidth="100%";
    }
  });
})();
