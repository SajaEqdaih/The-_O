
(function(){
 if(window.__MADA_CHAT_V4__) return; window.__MADA_CHAT_V4__=true;

 const PAGE_HELP = {
  "index.html":{ar:"أنت الآن في صفحة الاكتشاف. تقدر تتصفح الفرص مباشرة بدون تسجيل.",en:"You're on Discover. You can browse opportunities without signing up."},
  "offer-guest.html":{ar:"أنت في تفاصيل فرصة. راجع التجربة والموقع والمطلوب، وإذا ناسبتك سجّل بسرعة للتقديم.",en:"You're viewing an opportunity. Review the experience, location and requirements, then sign up quickly if you want to apply."},
  "influencer-register.html":{ar:"هذه صفحة تسجيل صانع المحتوى. البداية قصيرة: اسم، وسيلة تواصل، ومحافظة.",en:"This is creator sign-up. It starts with just your name, contact method and governorate."},
  "business-register.html":{ar:"هذه بداية حساب النشاط. ثلاث بيانات أساسية فقط، وبعدها أمشي معك خطوة خطوة.",en:"This starts a business account. Just three basic details, then I'll guide you step by step."},
  "business-onboarding.html":{ar:"هذه خريطة تجهيز النشاط. أنصحك تكمل الملف أولًا، بعدها تشوف الباقات، وبعدها تنشئ أول تجربة.",en:"This is the business setup map. Complete your business details, create your first experience, then start receiving creator applications."},
  "business-plans.html":{ar:"أنت في صفحة الباقات. المقارنة هنا على المزايا والأدوات وطريقة الاستخدام.",en:"You're on Packages. Compare the features, tools and usage level."},
  "create-offer.html":{ar:"أنت في إنشاء تجربة. خلّينا نخلي العنوان والصور والموعد والمطلوب والقواعد واضحة قبل النشر.",en:"You're creating an experience. Keep the title, images, date, requirements and rules clear before publishing."},
  "influencer-my-offers.html":{ar:"هنا تعاوناتك: الطلبات، المقبولة، القادمة والمكتملة.",en:"This is your Collaborations area: applications, accepted, upcoming and completed."},
  "applicants.html":{ar:"هنا المتقدمون على تجارب نشاطك. راجع كل طلب ثم حدّث حالته بوضوح.",en:"These are applicants to your business opportunities. Review each application and update its status clearly."},
  "how-it-works.html":{ar:"هذه أفضل صفحة لفهم The O من البداية للنهاية.",en:"This is the best page to understand The O from start to finish."}
 };

 const DATA = [
 {id:"about",q:["ما هي مدى","شو مدى","فكرة الموقع","فكرة المنصة","what is mada","about mada"],ar:"يا هلا 👋 The O منصة عُمانية تجمع فرص وتجارب من الأنشطة التجارية مع صنّاع المحتوى. الزائر يشوف الفرص أولًا بدون تسجيل، وصانع المحتوى يسجّل فقط لما يحب يقدّم، وصاحب النشاط عنده مساحة واضحة لإضافة نشاطه وإدارة التعاونات.",en:"Hi 👋 The O is an Oman-focused platform connecting business experiences with creators. Visitors browse first without signing up, creators register when they want to apply, and businesses get a clear space to manage opportunities and collaborations.",links:[["كيف تعمل The O؟","how-it-works.html"],["اكتشف الفرص","index.html#discover"]]},
 {id:"browse",q:["كيف اتصفح","وين الفرص","العروض وين","استكشف","browse","discover","opportunities","offers"],ar:"أكيد. أول ما تدخل الصفحة الرئيسية تشوف الفرص مباشرة. تقدر تفتح أي بطاقة وتشوف الصورة، المكان، التاريخ ونوع التجربة قبل ما تسجّل.",en:"Absolutely. The home page shows opportunities immediately. Open any card to see the visual, location, date and experience type before signing up.",links:[["الفرص","index.html#discover"],["البحث","search.html"]]},
 {id:"apply",q:["كيف اقدم","كيف أقدم","بدي اقدم","تقديم","انضم","apply","join"],ar:"سهل يا صديقي: افتح الفرصة → راجع المطلوب والقواعد → اضغط تقديم. إذا ما عندك حساب، التسجيل قصير جدًا وبعده ترجع تكمل على نفس المسار.",en:"Easy: open the opportunity → review requirements and rules → tap Apply. If you don't have an account, sign-up is short and then you continue.",links:[["شوف مثال فرصة","offer-guest.html"],["تسجيل صانع محتوى","influencer-register.html"]]},
 {id:"creator_signup",q:["تسجيل صانع محتوى","حساب صانع محتوى","كيف اسجل كمؤثر","مؤثر","creator register","creator signup"],ar:"يا هلا، تسجيل صانع المحتوى ما بدنا نخليه متعب. البداية فقط: الاسم، رقم الجوال أو البريد، والمحافظة. باقي الملف تقدر تكمله بعدين بهدوء.",en:"Creator sign-up is intentionally light: name, mobile or email, and governorate. You can complete the rest of your profile later.",links:[["ابدأ التسجيل","influencer-register.html"]]},
 {id:"business_signup",q:["صاحب نشاط","صاحب نشاط","عندي مطعم","عندي مقهى","عندي فندق","اضيف نشاط","أضيف نشاط","business owner","add business"],ar:"أهلًا فيك 🌟 تبدأ بثلاث بيانات فقط: اسم النشاط، نوعه، ووسيلة التواصل. بعدين The O يوضح لك الطريق: أكمل الملف → شوف الباقات → أنشئ أول تجربة.",en:"Welcome 🌟 Start with just three details: business name, type and contact method. Then The O guides you: complete profile → review packages → create your first experience.",links:[["أضف نشاطك","business-register.html"],["شوف المسار كامل","business-onboarding.html"]]},
 {id:"packages",q:["الباقات","باقة","الخطط","packages","plans"],ar:"أكيد. الباقات موجودة عشان النشاط يختار مستوى الأدوات المناسب له. كل باقة توضح عدد التجارب والأدوات والتنظيم المتاح بشكل مباشر.",en:"Packages help a business choose the right level of tools. Each package clearly explains available experiences, organization tools and features.",links:[["عرض الباقات","business-plans.html"]]},
 {id:"create",q:["انشاء عرض","إنشاء عرض","انشاء تجربة","إنشاء تجربة","اضافة فرصة","create offer","create opportunity"],ar:"خلّينا نخليها مرتبة: اسم التجربة → صور مناسبة → وصف قصير → المحافظة والولاية والمنطقة → الموعد → ما تتضمنه التجربة → المطلوب من صانع المحتوى → القواعد. وبعدها راجعها قبل النشر.",en:"Keep it organized: experience name → relevant images → short description → governorate/wilayat/area → date → what's included → creator requirements → rules. Review everything before publishing.",links:[["إنشاء تجربة","create-offer.html"]]},
 {id:"collabs",q:["طلبات التعاون","طلباتي","وين طلبي","حالة الطلب","تم قبولي","accepted","my collaborations","application status"],ar:"من «تعاوناتي» تشوف كل شيء بدون لخبطة: الطلبات قيد المراجعة، المقبولة، القادمة والمكتملة. كل بطاقة لازم توضح لك شو الخطوة التالية.",en:"My Collaborations keeps things simple: pending applications, accepted, upcoming and completed. Each item shows the next action.",links:[["طلبات التعاون","influencer-my-offers.html"]]},
 {id:"saved",q:["المحفوظة","احفظ","مفضلة","saved","favorites","bookmark"],ar:"إذا عجبتك فرصة وما بدك تقدّم الآن، احفظها. بتلاقيها لاحقًا في «المحفوظة».",en:"If you like an opportunity but aren't ready to apply, save it and return later from Saved.",links:[["المحفوظة","saved-offers.html"]]},
 {id:"rules",q:["القواعد","الشروط","المطلوب","متطلبات","deliverables","rules","requirements"],ar:"قبل أي تقديم، راجع قسمين: «المطلوب» و«القواعد». المطلوب يشرح المحتوى المتوقع، والقواعد تشرح الحضور والموعد وأي تعليمات خاصة بالتجربة.",en:"Before applying, review two sections: Requirements and Rules. Requirements explain the expected content; Rules cover attendance, timing and any special instructions.",links:[["تفاصيل فرصة","offer-guest.html"]]},
 {id:"location",q:["الموقع","المحافظة","الولاية","مسقط","صلالة","صحار","نزوى","location","governorate","wilayat"],ar:"في The O نعتمد صيغة عمانية واضحة: المحافظة → الولاية → المنطقة. هذا يخلي البحث والعرض مفهومين لصاحب النشاط وصانع المحتوى.",en:"The O uses an Oman-friendly structure: governorate → wilayat → area. This keeps locations clear for both businesses and creators.",links:[["البحث","search.html"]]},
 {id:"categories",q:["مطعم","مقهى","فندق","جيم","نادي","رياضة","فعاليات","تصنيفات","restaurant","cafe","hotel","gym","fitness","events"],ar:"The O تدعم أنواع مختلفة: مطاعم، مقاهي، فنادق، رياضة ولياقة، فعاليات وتجارب. وبالواجهة كل نوع لازم يظهر بصورة مناسبة له حتى تعرف المحتوى قبل الضغط.",en:"The O supports restaurants, cafés, hotels, fitness, events and experiences. Each category uses a matching visual so you understand it before opening.",links:[["اكتشف","index.html#discover"]]},
 {id:"notifications",q:["اشعارات","إشعارات","تنبيه","notification","alerts"],ar:"الإشعارات تساعدك ما يفوتك شيء: تحديث حالة طلب، موعد قريب، أو خطوة تحتاج منك إجراء.",en:"Notifications help you stay on track: application updates, upcoming dates, or an action you need to take.",links:[["إشعارات صانع المحتوى","influencer-notifications.html"],["إشعارات الأعمال","business-notifications.html"]]},
 {id:"calendar",q:["تقويم","مواعيد","موعدي","calendar","schedule"],ar:"التقويم يجمع المواعيد القادمة في مكان واحد، سواء كنت صانع محتوى أو صاحب نشاط.",en:"Calendar keeps upcoming dates in one place for creators and businesses.",links:[["تقويم صانع المحتوى","influencer-calendar.html"],["تقويم الأعمال","business-calendar.html"]]},
 {id:"profile",q:["حسابي","البروفايل","ملفي","profile","my account"],ar:"من حسابك تعدّل المعلومات الأساسية والموقع والمجال. نصيحتي: خليه واضح ومختصر عشان الطرف الثاني يفهمك بسرعة.",en:"Your profile lets you update basic information, location and niche. Keep it clear and concise so the other side understands you quickly.",links:[["حساب صانع المحتوى","influencer-profile.html"]]},
 {id:"business_profile",q:["ملف النشاط","بيانات النشاط","تعديل النشاط","business profile"],ar:"ملف النشاط هو واجهتك داخل The O. حط اسم واضح، وصف قصير، موقع دقيق وصور مناسبة. بعدها إنشاء التجارب يصير أسهل.",en:"Your business profile is your The O presence. Use a clear name, short description, accurate location and relevant images.",links:[["ملف النشاط","business-profile.html"]]},
 {id:"applicants",q:["المتقدمين","المتقدمون","مين قدم","طلبات صناع المحتوى","applicants","who applied"],ar:"في «المتقدمون» صاحب النشاط يشوف الطلبات المرتبطة بكل تجربة، يراجع البيانات المتاحة، وبعدها يحدد حالة الطلب بوضوح.",en:"Applicants shows creator applications for each experience. Review the available profile information and update the application status clearly.",links:[["المتقدمون","applicants.html"]]},
 {id:"dashboard",q:["لوحة الاعمال","لوحة الأعمال","داشبورد","dashboard"],ar:"لوحة الأعمال هي المركز الرئيسي لصاحب النشاط: أهم التنبيهات، التجارب، المتقدمون، المواعيد والخطوات القادمة.",en:"The business dashboard is the main hub for alerts, opportunities, applicants, dates and next steps.",links:[["لوحة الأعمال","business-dashboard.html"]]},
 {id:"analytics",q:["احصائيات","إحصائيات","تحليلات","مشاهدات","analytics","statistics","views"],ar:"التحليلات تساعد صاحب النشاط يفهم أداء التجارب: المشاهدة، التفاعل والطلبات بطريقة سهلة بدل أرقام بدون معنى.",en:"Analytics helps a business understand experience performance through views, engagement and applications in a simple way.",links:[["التحليلات","business-analytics.html"]]},
 {id:"verification",q:["توثيق","موثق","تحقق","مصداقية","اثق","أثق","verification","verified","trust"],ar:"سؤال مهم. المصداقية في The O لازم تكون واضحة: بيانات نشاط مفهومة، حالات تعاون واضحة، ومراجعة حسابات أو أنشطة عند الحاجة. شارة «موثّق» تعني أن المنصة راجعت البيانات المتاحة، وليست ضمانًا لنتيجة أي تعاون.",en:"Good question. Trust on The O comes from clear business information, transparent collaboration statuses, and account/business review where needed. A Verified badge means the platform reviewed available information; it is not a guarantee of collaboration outcomes.",links:[["كيف تعمل The O؟","how-it-works.html"]]},
 {id:"privacy",q:["خصوصية","بياناتي","مين يشوف بياناتي","privacy","my data"],ar:"خلّيك مرتاح: الحساب المفروض يطلب فقط البيانات اللازمة للتصفح والتعاون وإدارة النشاط. لا تضيف معلومات حساسة داخل الوصف العام، وعدّل البيانات الظاهرة من إعدادات الحساب.",en:"For privacy, only provide information needed for browsing, collaboration and business management. Avoid sensitive information in public descriptions and update visible profile details from settings."},
 {id:"cancel",q:["الغي الطلب","ألغي الطلب","انسحب","إلغاء","cancel","withdraw"],ar:"إذا احتجت تنسحب، افتح التعاون أولًا وشوف حالته. الخيارات تختلف حسب المرحلة، والأفضل ما تترك الطرف الثاني بدون تحديث.",en:"If you need to withdraw, open the collaboration and check its current status. Available actions depend on the stage, and it's best to keep the other side informed.",links:[["طلبات التعاون","influencer-my-offers.html"]]},
 {id:"problem",q:["مشكلة","خطأ","مش شغال","ما بفتح","error","not working","problem"],ar:"ولا يهمك. أول شيء حدّث الصفحة. إذا المشكلة في تسجيل الدخول جرّب ترجع لصفحة الدخول، وإذا في خطوة مش واضحة اسألني باسم الصفحة أو الزر اللي واقف عنده.",en:"No worries. First refresh the page. If it's a sign-in issue, return to Sign in. If a step is unclear, tell me the page or button you're on and I'll guide you.",links:[["تسجيل الدخول","login.html"],["الأسئلة الشائعة","faq.html"]]},
 {id:"language",q:["عربي","انجليزي","إنجليزي","اللغة","language","arabic","english"],ar:"الموقع كله يدعم العربية والإنجليزية، مش البوت بس. زر AR / EN يغيّر اتجاه الواجهة والنصوص المدعومة، وأنا كمان برد بنفس اللغة.",en:"The whole site supports Arabic and English—not just the assistant. Use the AR / EN switch to change interface direction and supported text, and I'll reply in the same language."},
 {id:"owner_understand",q:["انا صاحب الموقع","أنا صاحب الموقع","ادارة الموقع","إدارة الموقع","كيف افهم الموقع","site owner","platform owner","admin"],ar:"إذا أنت صاحب المنصة، الصورة عندك 4 أجزاء: 1) الزائر يكتشف، 2) صانع المحتوى يقدّم ويتابع تعاوناته، 3) صاحب النشاط ينشر التجارب ويدير الطلبات، 4) الإدارة تراجع المستخدمين والتجارب والحالات والمحتوى. صفحة «كيف تعمل The O» تعطيك المسار من البداية للنهاية.",en:"As platform owner, think of The O in four parts: 1) visitors discover, 2) creators apply and track collaborations, 3) businesses publish experiences and manage applications, 4) admins review users, opportunities, cases and content.",links:[["دليل المنصة","platform-guide.html"],["كيف تعمل The O؟","how-it-works.html"],["لوحة الإدارة","admin-overview.html"]]},
 {id:"admin",q:["الادمن","الأدمن","لوحة الادارة","لوحة الإدارة","moderation","admin dashboard"],ar:"لوحة الإدارة منفصلة عن تجربة المستخدم. منها تتابع المستخدمين، الأنشطة، التجارب، طلبات التوثيق، الحالات والمحتوى. الهدف تكون رقابة واضحة بدون ما تعقّد واجهة الزائر.",en:"Admin is separate from the user experience. It covers users, businesses, opportunities, verification, cases and content so moderation stays clear without cluttering the public site.",links:[["لوحة الإدارة","admin-overview.html"]]},
 {id:"guest",q:["لازم اسجل","هل التسجيل اجباري","بدون تسجيل","guest","do i need account"],ar:"لا يا صديقي، التصفح نفسه ما يحتاج تسجيل. سجّل فقط لما بدك تدخل في التقديم أو تستخدم ميزات حسابك.",en:"No. Browsing does not require an account. Sign up when you want to apply or use account features.",links:[["تصفح الآن","index.html#discover"]]},
 {id:"after_creator_signup",q:["بعد التسجيل شو","بعد ما اسجل","what happens after signup"],ar:"بعد تسجيل صانع المحتوى تدخل مباشرة للفرصة أو حسابك. بعدها تقدر تكمل ملفك على راحتك، تحفظ فرص، تقدّم وتتابع الحالة من «تعاوناتي».",en:"After creator sign-up, you go directly back to the opportunity or your account. You can complete your profile later, save opportunities, apply and track status from Collaborations.",links:[["طلبات التعاون","influencer-my-offers.html"]]},
 {id:"after_business_signup",q:["بعد تسجيل النشاط","بعد ما اضيف النشاط","after business signup"],ar:"بعد إضافة النشاط ما بنرميك في لوحة مليانة أشياء 😄 بنعطيك خريطة واضحة: أكمل بيانات نشاطك → أنشئ التجربة الأولى → راجع طلبات صناع المحتوى.",en:"After adding your business, we don't drop you into a confusing dashboard 😄 You get a clear map: complete your business details → create your first experience → review creator applications.",links:[["خريطة البداية","business-onboarding.html"]]},
 {id:"support",q:["مساعدة","ساعدني","دعم","تواصل","help","support"],ar:"أكيد يا عزيزي، أنا معك. قولي شو بتحاول تعمل الآن: تتصفح فرصة؟ تسجّل؟ تضيف نشاط؟ تنشئ تجربة؟ أو تتابع طلب؟ وإذا وصفت لي الزر أو الصفحة اللي واقف عندها بدلك خطوة بخطوة.",en:"Of course—I'm here with you. Tell me what you're trying to do: browse, sign up, add a business, create an experience, or track an application. If you tell me the page or button you're on, I'll guide you step by step.",links:[["كيف تعمل The O؟","how-it-works.html"],["الأسئلة الشائعة","faq.html"]]}
 ];

 const QUICK={
  guest:{ar:["اكتشاف الفرص","كيف تعمل The O؟","إنشاء حساب","أنا صاحب نشاط"],en:["Discover opportunities","How The O works","Create account","I own a business"]},
  influencer:{ar:["العثور على فرصة","طلباتي","الحجز والموعد","مساعدة أخرى"],en:["Find an opportunity","My applications","Booking & appointment","More help"]},
  business:{ar:["إضافة تجربة","طلبات صناع المحتوى","المواعيد","مساعدة أخرى"],en:["Create an experience","Creator applications","Appointments","More help"]}
 };

 let botLang="ar"; try{botLang=localStorage.getItem("mada_bot_lang")||((document.documentElement.lang||"ar").startsWith("en")?"en":"ar")}catch(e){}
 function currentLang(){return botLang}
 function setBotLang(lang){botLang=lang;try{localStorage.setItem("mada_bot_lang",lang)}catch(e){} render()}
 function norm(s){return String(s).toLowerCase().replace(/[ًٌٍَُِّْـ]/g,"").replace(/[إأآ]/g,"ا").replace(/ة/g,"ه").replace(/[^\w\u0600-\u06FF\s]/g," ").replace(/\s+/g," ").trim()}
 function score(item,q){
   const nq=norm(q); let sc=0;
   item.q.forEach(k=>{const nk=norm(k);if(nq.includes(nk))sc+=15+nk.length; else nk.split(" ").forEach(w=>{if(w.length>2&&nq.includes(w))sc+=2})});
   return sc;
 }
 function linksFor(item,lang){return (item.links||[]).map(([ar,href])=>[lang==="ar"?ar:({
   "كيف تعمل The O؟":"How The O works","اكتشف الفرص":"Discover opportunities","الفرص":"Opportunities","البحث":"Search","شوف مثال فرصة":"View an opportunity","تسجيل صانع محتوى":"Creator sign-up",
   "أضف نشاطك":"Add your business","شوف المسار كامل":"View setup map","عرض الباقات":"View packages","إنشاء تجربة":"Create opportunity","طلبات التعاون":"Applications","المحفوظة":"Saved",
   "تفاصيل فرصة":"Opportunity details","اكتشف":"Discover","إشعارات صانع المحتوى":"Creator notifications","إشعارات الأعمال":"Business notifications","تقويم صانع المحتوى":"Creator calendar",
   "تقويم الأعمال":"Business calendar","حساب صانع المحتوى":"Creator profile","ملف النشاط":"Business profile","المتقدمون":"Applicants","لوحة الأعمال":"Business dashboard",
   "التحليلات":"Analytics","تسجيل الدخول":"Sign in","الأسئلة الشائعة":"FAQ","تصفح الآن":"Browse now","لوحة الإدارة":"Admin overview","دليل المنصة":"Platform guide","خريطة البداية":"Setup map"
  }[ar]||ar),href])}

 const root=document.createElement("div");root.id="mada-assistant-root";document.body.appendChild(root);
 root.innerHTML=`
 <button class="mada-chat-launcher" type="button"><span class="mada-chat-dot">✦</span><span><b></b><small></small></span></button>
 <section class="mada-chat-panel" role="dialog">
  <div class="mada-chat-head"><div class="mada-chat-brand"><span class="mada-chat-avatar"><img src="assets/images/the-o-logo.png" alt="The O"></span><div><strong></strong><span><i class="mada-online"></i><em style="font-style:normal"></em></span></div></div>
  <div class="mada-chat-head-actions"><div class="mada-chat-lang-pills" aria-label="Assistant language"><button type="button" data-bot-lang="ar">العربية</button><button type="button" data-bot-lang="en">English</button></div><button class="mada-chat-icon-btn mada-close" type="button">✕</button></div></div>
  <div class="mada-context-tip"></div><div class="mada-chat-suggest"></div><div class="mada-chat-messages"></div>
  <div><form class="mada-chat-input"><input autocomplete="off"><button class="mada-chat-send" type="submit">➜</button></form><div class="mada-chat-mini-note"></div></div>
 </section>`;

 const panel=root.querySelector(".mada-chat-panel"),launcher=root.querySelector(".mada-chat-launcher"),msgs=root.querySelector(".mada-chat-messages"),
 suggestions=root.querySelector(".mada-chat-suggest"),input=root.querySelector("input"),form=root.querySelector("form"),close=root.querySelector(".mada-close"),
 context=root.querySelector(".mada-context-tip");

 function add(text,who="bot",links=[]){
  const row=document.createElement("div");row.className="mada-msg "+who;const b=document.createElement("div");b.className="mada-bubble";b.textContent=text;
  if(links.length){const box=document.createElement("div");box.className="mada-chat-links";links.forEach(([label,href])=>{const a=document.createElement("a");a.href=href;a.innerHTML="<span>"+label+"</span><span>↗</span>";box.appendChild(a)});b.appendChild(box)}
  row.appendChild(b);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
 }
 function reply(q){
  const lang=currentLang();add(q,"user");let best=null,bs=0;DATA.forEach(x=>{let s=score(x,q);if(s>bs){bs=s;best=x}});
  setTimeout(()=>{if(best&&bs>=4)add(lang==="ar"?best.ar:best.en,"bot",linksFor(best,lang));else add(lang==="ar"
   ?"يا هلا، فهمت إنك بدك مساعدة بس سؤالك عام شوي 😊 اكتب لي شو بتحاول تعمل أو اسم الصفحة/الزر، مثل: «كيف أقدم؟»، «عندي نشاط»، «وين تعاوناتي؟» وأنا أمشي معك خطوة خطوة."
   :"I’m with you 😊 Your question is a little broad. Tell me what you're trying to do—or the page/button you're on—such as “How do I apply?”, “I own a business”, or “Where are my collaborations?” and I’ll guide you step by step."
  ,"bot",[[lang==="ar"?"كيف تعمل The O؟":"How The O works","how-it-works.html"],[lang==="ar"?"الأسئلة الشائعة":"FAQ","faq.html"]])},160)
 }
 function render(){
  const lang=currentLang(), path=location.pathname.split("/").pop()||"index.html";
  launcher.querySelector("b").textContent=lang==="ar"?"اسأل The O":"Ask The O";
  launcher.querySelector("small").textContent=lang==="ar"?"أنا معك خطوة بخطوة":"I'm here step by step";
  root.querySelector(".mada-chat-brand strong").textContent=lang==="ar"?"صديقك في The O":"Your The O Guide";
  root.querySelector(".mada-chat-brand em").textContent=lang==="ar"?"جاهز نحكي":"Ready to chat";
  root.querySelectorAll("[data-bot-lang]").forEach(b=>b.classList.toggle("active",b.dataset.botLang===lang));
  input.placeholder=lang==="ar"?"احكيلي شو بدك تعرف...":"Tell me what you want to know...";
  root.querySelector(".mada-chat-mini-note").textContent=lang==="ar"?"اسأل بطريقتك — عن أي خطوة داخل The O":"Ask naturally — about any step inside The O";
  context.textContent=(PAGE_HELP[path]?.[lang])||(lang==="ar"?"أنا بعرف أقسام The O ومسارات التسجيل والتعاون والأعمال، واساعدك من الصفحة اللي أنت فيها.":"I know The O's sections, sign-up, collaboration and business flows, and I can guide you from the page you're on.");
  suggestions.innerHTML="";let role="guest";try{role=(window.MadaSession?.get()?.role)||localStorage.getItem("mada_user_role")||"guest"}catch(e){} if(role==="creator")role="influencer"; const qs=(QUICK[role]||QUICK.guest)[lang];qs.forEach(q=>{const b=document.createElement("button");b.type="button";b.className="mada-chat-chip";b.textContent=q;b.onclick=()=>reply(q);suggestions.appendChild(b)});
  msgs.innerHTML="";
  let savedName="";try{savedName=localStorage.getItem("mada_user_name")||""}catch(e){}
  add(lang==="ar"?(savedName?"أهلًا "+savedName+" 👋 كيف أقدر أساعدك؟":"أهلًا 👋 كيف أقدر أساعدك؟"):(savedName?"Hi "+savedName+" 👋 How can I help?":"Hi 👋 How can I help?"));
 }
 launcher.onclick=()=>{panel.classList.toggle("open");if(panel.classList.contains("open"))input.focus()};
 close.onclick=()=>panel.classList.remove("open");
 form.onsubmit=e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value="";reply(q)};
 root.querySelectorAll("[data-bot-lang]").forEach(b=>b.onclick=()=>setBotLang(b.dataset.botLang));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")panel.classList.remove("open")});
 render();
})();
