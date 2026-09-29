
(function(){
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const get=(k,d="")=>{try{return localStorage.getItem(k)||d}catch(e){return d}};
  const set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  const qs=new URLSearchParams(location.search);
  const incomingName=(qs.get("name")||"").trim();
  if(incomingName) set("mada_user_name",incomingName);
  const name=incomingName||get("mada_user_name","");
  const role=get("mada_user_role","");
  const path=(location.pathname.split("/").pop()||"index.html").toLowerCase();

  // Creator and business users may browse the public site freely.
  // Protected private pages are handled by the authentication guard in app.js.

  // Personalize any marked text.
  $$("[data-mada-name]").forEach(el=>el.textContent=name||el.dataset.fallback||"صديقنا");

  // Add a lightweight location/context bar to protected user pages.
  if((creatorPage||businessPage) && !path.includes("register")){
    const top=$(".top");
    if(top){
      const bar=document.createElement("div");
      bar.className="mada-contextbar";
      const label=creatorPage?"مساحة صانع المحتوى":"مساحة النشاط التجاري";
      const home=creatorPage?"index.html":"business-dashboard.html";
      bar.innerHTML=`<div class="container"><span>${name?`مرحبًا ${escapeHtml(name)} · `:""}${label}</span><a href="${home}">الرئيسية</a></div>`;
      top.insertAdjacentElement("afterend",bar);
    }
  }


  // Show the saved name in the top navigation too, so personalization is obvious.
  if(name){
    const topin=$(".top .topin");
    if(topin && !$(".mada-name-chip",topin)){
      const chip=document.createElement("span");
      chip.className="mada-name-chip";
      chip.textContent="مرحبًا "+name;
      topin.appendChild(chip);
    }
  }

  // Homepage personalization + interactive category filters.
  if(path==="index.html" || path===""){
    const discover=$("#discover .container");
    if(discover && name){
      const hello=document.createElement("div");
      hello.className="mada-personal-hello";
      hello.innerHTML=`<div><span class="eyebrow">مخصص لك</span><h2>مرحبًا ${escapeHtml(name)}، ما الذي ترغب في اكتشافه اليوم؟</h2><p>اختر الفئة التي تهمك، وسنعرض لك الفرص الأقرب لاهتماماتك.</p></div>`;
      discover.prepend(hello);
    }
    const cards=$$("#discover article.card");
    if(cards.length){
      const wrap=document.createElement("div");
      wrap.className="mada-mood-filter";
      wrap.setAttribute("aria-label","تصفية التجارب");
      const filters=[
        ["all","الكل"],["restaurant","أكل ومطاعم"],["cafe","قهوة وهدوء"],
        ["gym","نشاط وحركة"],["event","فعاليات"],["resort","إقامة"],["boat","بحر ومغامرة"],["desert","طلعات"]
      ];
      wrap.innerHTML=filters.map((f,i)=>`<button type="button" class="${i===0?"active":""}" data-filter="${f[0]}">${f[1]}</button>`).join("");
      const head=$("#discover .section-head");
      if(head) head.insertAdjacentElement("afterend",wrap);
      wrap.addEventListener("click",e=>{
        const b=e.target.closest("button"); if(!b)return;
        $$("button",wrap).forEach(x=>x.classList.remove("active")); b.classList.add("active");
        const f=b.dataset.filter;
        cards.forEach(c=>{
          const cls=c.querySelector(".offer-img")?.className||"";
          c.style.display=(f==="all"||cls.includes("photo-"+f))?"":"none";
        });
      });
    }
  }

  // Save buttons on public offer cards.
  $$("#discover article.card").forEach((card,i)=>{
    const body=card.querySelector(".offer-body"); if(!body)return;
    const key="mada_saved_"+i;
    const b=document.createElement("button");
    b.type="button"; b.className="mada-save-mini";
    const paint=()=>b.textContent=get(key)==="1"?"♥ محفوظ":"♡ حفظ";
    paint();
    b.addEventListener("click",()=>{
      const on=get(key)==="1"; set(key,on?"0":"1"); paint();
      showToast(on?"شِلناها من المحفوظات.":`حفظناها لك${name?" يا "+name:""} ♥`);
    });
    body.appendChild(b);
  });

  // Replace stiff empty states with a friendly nudge.
  $$(".empty,.empty-state").forEach(el=>{
    if(/لا يوجد|لا توجد|فارغ/.test(el.textContent||"")){
      el.insertAdjacentHTML("beforeend",`<p class="mada-friendly-empty">${name?name+"، ":""}لسه ما في شيء هون. خلينا نبدأ بخطوة بسيطة بدل الصفحة الفاضية.</p>`);
    }
  });

  function showToast(msg){
    let t=$("#mada-live-toast");
    if(!t){t=document.createElement("div");t.id="mada-live-toast";t.className="mada-live-toast";document.body.appendChild(t)}
    t.textContent=msg;t.classList.add("show");clearTimeout(window.__madaToast);
    window.__madaToast=setTimeout(()=>t.classList.remove("show"),3200);
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
  window.MADAExperience={showToast};
})();
