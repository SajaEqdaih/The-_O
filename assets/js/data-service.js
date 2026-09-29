/**
 * MADA Data Service — assets/js/data-service.js
 * ------------------------------------------------------------
 * Single abstraction layer for every read/write the front-end needs.
 * Every collection name, field name and status string here is written
 * to match the eventual Firestore schema 1:1 (uid, offerId, status,
 * compensationType, budget, platformsRequired, ...). Today it persists
 * to localStorage; swapping the body of each method for a Firestore
 * SDK call later requires ZERO changes to any HTML file, because every
 * page only ever talks to `window.MadaDB`.
 *
 * Collections:
 *   users          { uid, role, name, email, phone, city, avatarUrl, verified, trustScore, followers, createdAt }
 *   offers         { offerId, businessUid, businessName, title, description, category, city,
 *                    platformsRequired[], compensationType, budget, deliverables[], rulesList[],
 *                    seatsTotal, seatsFilled, status, eventDate, imageClass, createdAt }
 *   applications   { applicationId, offerId, influencerUid, influencerName, influencerHandle,
 *                    followers, proposalNote, status, appliedAt, respondedAt,
 *                    proofUrl, proofNote, proofStatus, rating, review, completedAt }
 *   notifications  { notificationId, uid, title, body, type, read, createdAt }
 *
 * All methods are async (return Promises) even though they run against
 * localStorage today, so call-sites already look exactly like the
 * Firebase calls that will eventually replace them.
 */
(function (global) {
  "use strict";

  var DB_KEY = "mada_db_v1";
  var LATENCY = 120; // ms — simulated network latency, remove/tune once on real Firebase

  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function now() {
    return new Date().toISOString();
  }

  function delay(value) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(value);
      }, LATENCY);
    });
  }

  function load() {
    try {
      var raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function save(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("MadaDB: failed to persist", e);
    }
  }

  function seed() {
    var offers = [
      {
        offerId: "off_1001",
        businessUid: "biz_luna",
        businessName: "Luna Restaurant",
        title: "تجربة عشاء خاصة لشخصين",
        description: "عشاء تجريبي كامل يشمل الأطباق الرئيسية والحلا، مناسب لمحتوى فيديو وصور دافئة.",
        category: "مطاعم",
        city: "بوشر",
        platformsRequired: ["Content platform", "TikTok"],
        compensationType: "barter",
        budget: 0,
        deliverables: ["2 ستوري", "ريل واحد"],
        rulesList: ["ذكر اسم المطعم في الوصف", "تسليم المحتوى خلال 5 أيام"],
        seatsTotal: 4,
        seatsFilled: 1,
        status: "published",
        eventDate: "2026-08-22",
        imageClass: "photo-restaurant",
        createdAt: now()
      },
      {
        offerId: "off_1002",
        businessUid: "biz_brew",
        businessName: "Brew & Co",
        title: "جلسة تصوير قهوة الصباح",
        description: "زيارة صباحية لتجربة قائمة المشروبات الجديدة وتصويرها بأسلوب هادئ.",
        category: "مقاهي",
        city: "مسقط",
        platformsRequired: ["Content platform"],
        compensationType: "barter",
        budget: 0,
        deliverables: ["3 صور", "ستوري واحد"],
        rulesList: ["التصوير خلال ساعات الصباح", "الوسم الرسمي للمقهى"],
        seatsTotal: 6,
        seatsFilled: 4,
        status: "published",
        eventDate: "2026-09-02",
        imageClass: "photo-cafe",
        createdAt: now()
      },
      {
        offerId: "off_1003",
        businessUid: "biz_pulse",
        businessName: "Pulse Gym",
        title: "تحدي أسبوع في النادي",
        description: "أسبوع اشتراك مجاني مقابل توثيق التمارين اليومية ومشاركة تجربة صادقة.",
        category: "رياضة",
        city: "صلالة",
        platformsRequired: ["Content platform", "YouTube"],
        compensationType: "commission",
        budget: 45,
        deliverables: ["فيديو تلخيصي", "5 ستوري يومي"],
        rulesList: ["الالتزام بالحضور اليومي", "نشر الفيديو النهائي خلال أسبوعين"],
        seatsTotal: 3,
        seatsFilled: 0,
        status: "published",
        eventDate: "2026-09-10",
        imageClass: "photo-gym",
        createdAt: now()
      },
      {
        offerId: "off_1004",
        businessUid: "biz_dunes",
        businessName: "Dunes Resort",
        title: "إقامة نهاية أسبوع",
        description: "إقامة ليلتين مقابل حزمة محتوى متكاملة عن المنتجع ومرافقه.",
        category: "منتجعات",
        city: "صحار",
        platformsRequired: ["Content platform", "TikTok", "YouTube"],
        compensationType: "barter",
        budget: 0,
        deliverables: ["فيديو جولة", "4 ستوري", "منشور واحد"],
        rulesList: ["حجز مسبق مطلوب", "تسليم خلال أسبوع من المغادرة"],
        seatsTotal: 2,
        seatsFilled: 2,
        status: "published",
        eventDate: "2026-09-18",
        imageClass: "photo-resort",
        createdAt: now()
      }
    ];

    var applications = [
      {
        applicationId: "app_5001",
        offerId: "off_1001",
        influencerUid: "inf_sara",
        influencerName: "سارة الهاشمية",
        influencerHandle: "@sara.oman",
        followers: 48200,
        proposalNote: "أعمل محتوى مطاعم بأسلوب سينمائي وأقدر أسلم خلال 3 أيام.",
        status: "pending",
        appliedAt: now(),
        proofUrl: "",
        proofNote: "",
        proofStatus: "not_submitted",
        rating: null,
        review: ""
      }
    ];

    var users = [
      { uid: "inf_sara", role: "influencer", name: "سارة الهاشمية", email: "sara@example.com", phone: "9200 0000", city: "مسقط", avatarUrl: "", verified: true, trustScore: 92, followers: 48200, createdAt: now() },
      { uid: "biz_luna", role: "business", name: "Luna Restaurant", email: "luna@example.com", phone: "9211 1111", city: "بوشر", avatarUrl: "", verified: true, trustScore: 88, followers: 0, createdAt: now() }
    ];

    var notifications = [
      { notificationId: uid("ntf"), uid: "inf_sara", title: "تم استلام طلبك", body: "تم إرسال طلبك لتجربة Luna Restaurant وهو الآن قيد المراجعة.", type: "application", read: false, createdAt: now() },
      { notificationId: uid("ntf"), uid: "biz_luna", title: "متقدم جديد", body: "سارة الهاشمية تقدمت لعرض تجربة عشاء خاصة لشخصين.", type: "applicant", read: false, createdAt: now() }
    ];

    return { offers: offers, applications: applications, users: users, notifications: notifications, meta: { seededAt: now(), version: 1 } };
  }

  function ensureDb() {
    var db = load();
    if (!db) {
      db = seed();
      save(db);
    }
    // Backfill any collections older seeds might be missing.
    ["offers", "applications", "users", "notifications"].forEach(function (k) {
      if (!Array.isArray(db[k])) db[k] = [];
    });
    return db;
  }

  function currentUid() {
    try {
      return localStorage.getItem("mada_current_uid") || "inf_sara";
    } catch (e) {
      return "inf_sara";
    }
  }

  function setCurrentUid(u) {
    try {
      localStorage.setItem("mada_current_uid", u);
    } catch (e) {}
  }

  // ---------------------------------------------------------------
  // Offers
  // ---------------------------------------------------------------
  function getOffers(filters) {
    var db = ensureDb();
    var list = db.offers.slice();
    filters = filters || {};
    if (filters.city) list = list.filter(function (o) { return o.city === filters.city; });
    if (filters.platform) list = list.filter(function (o) { return o.platformsRequired.indexOf(filters.platform) > -1; });
    if (filters.compensationType) list = list.filter(function (o) { return o.compensationType === filters.compensationType; });
    if (filters.category) list = list.filter(function (o) { return o.category === filters.category; });
    if (filters.status) list = list.filter(function (o) { return o.status === filters.status; });
    if (filters.businessUid) list = list.filter(function (o) { return o.businessUid === filters.businessUid; });
    if (filters.search) {
      var q = filters.search.trim().toLowerCase();
      list = list.filter(function (o) {
        return (o.title + " " + o.description + " " + o.businessName).toLowerCase().indexOf(q) > -1;
      });
    }
    list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return delay(list);
  }

  function getOffer(offerId) {
    var db = ensureDb();
    var found = db.offers.find(function (o) { return o.offerId === offerId; }) || null;
    return delay(found);
  }

  function createOffer(data) {
    var db = ensureDb();
    var offer = Object.assign({
      offerId: uid("off"),
      seatsFilled: 0,
      status: "published",
      createdAt: now()
    }, data);
    db.offers.unshift(offer);
    save(db);
    return delay(offer);
  }

  function updateOffer(offerId, patch) {
    var db = ensureDb();
    var idx = db.offers.findIndex(function (o) { return o.offerId === offerId; });
    if (idx === -1) return delay(null);
    db.offers[idx] = Object.assign({}, db.offers[idx], patch);
    save(db);
    return delay(db.offers[idx]);
  }

  function deleteOffer(offerId) {
    var db = ensureDb();
    db.offers = db.offers.filter(function (o) { return o.offerId !== offerId; });
    save(db);
    return delay(true);
  }

  // ---------------------------------------------------------------
  // Applications
  // ---------------------------------------------------------------
  function getApplicants(offerId) {
    var db = ensureDb();
    var list = db.applications.filter(function (a) { return a.offerId === offerId; });
    list.sort(function (a, b) { return new Date(b.appliedAt) - new Date(a.appliedAt); });
    return delay(list);
  }

  function getApplicationsByUser(influencerUid) {
    var db = ensureDb();
    var list = db.applications
      .filter(function (a) { return a.influencerUid === influencerUid; })
      .map(function (a) {
        var offer = db.offers.find(function (o) { return o.offerId === a.offerId; });
        return Object.assign({}, a, { offer: offer || null });
      });
    list.sort(function (a, b) { return new Date(b.appliedAt) - new Date(a.appliedAt); });
    return delay(list);
  }

  function createApplication(data) {
    var db = ensureDb();
    var existing = db.applications.find(function (a) {
      return a.offerId === data.offerId && a.influencerUid === data.influencerUid;
    });
    if (existing) return delay(existing);
    var application = Object.assign({
      applicationId: uid("app"),
      status: "pending",
      appliedAt: now(),
      proofUrl: "",
      proofNote: "",
      proofStatus: "not_submitted",
      rating: null,
      review: ""
    }, data);
    db.applications.unshift(application);
    var offerIdx = db.offers.findIndex(function (o) { return o.offerId === data.offerId; });
    if (offerIdx > -1) db.offers[offerIdx].seatsFilled = (db.offers[offerIdx].seatsFilled || 0) + 1;
    save(db);
    createNotification({
      uid: db.offers[offerIdx] ? db.offers[offerIdx].businessUid : null,
      title: "متقدم جديد",
      body: (data.influencerName || "مؤثر") + " تقدم لعرضك.",
      type: "applicant"
    });
    return delay(application);
  }

  function updateApplicationStatus(applicationId, status, extra) {
    var db = ensureDb();
    var idx = db.applications.findIndex(function (a) { return a.applicationId === applicationId; });
    if (idx === -1) return delay(null);
    db.applications[idx] = Object.assign({}, db.applications[idx], { status: status, respondedAt: now() }, extra || {});
    save(db);
    var statusLabel = { accepted: "تم قبول طلبك", rejected: "لم يتم قبول طلبك", negotiating: "هناك تفاوض على طلبك", completed: "تم اعتماد تسليمك" }[status];
    createNotification({
      uid: db.applications[idx].influencerUid,
      title: statusLabel || "تحديث على طلبك",
      body: "تحديث حالة طلبك لعرض رقم " + db.applications[idx].offerId,
      type: "status"
    });
    return delay(db.applications[idx]);
  }

  function submitProof(applicationId, proofUrl, proofNote) {
    return updateApplicationStatus(applicationId, "in_review", {
      proofUrl: proofUrl,
      proofNote: proofNote || "",
      proofStatus: "submitted"
    });
  }

  function submitRating(applicationId, rating, review) {
    var db = ensureDb();
    var idx = db.applications.findIndex(function (a) { return a.applicationId === applicationId; });
    if (idx === -1) return delay(null);
    db.applications[idx] = Object.assign({}, db.applications[idx], { rating: rating, review: review || "", status: "completed", completedAt: now() });
    save(db);
    return delay(db.applications[idx]);
  }

  // ---------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------
  function getUserProfile(userUid) {
    var db = ensureDb();
    var found = db.users.find(function (u) { return u.uid === userUid; }) || null;
    return delay(found);
  }

  function updateUserProfile(userUid, patch) {
    var db = ensureDb();
    var idx = db.users.findIndex(function (u) { return u.uid === userUid; });
    if (idx === -1) {
      db.users.push(Object.assign({ uid: userUid, createdAt: now() }, patch));
    } else {
      db.users[idx] = Object.assign({}, db.users[idx], patch);
    }
    save(db);
    return delay(true);
  }

  // ---------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------
  function getNotifications(userUid) {
    var db = ensureDb();
    var list = db.notifications.filter(function (n) { return n.uid === userUid; });
    list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return delay(list);
  }

  function createNotification(data) {
    if (!data.uid) return delay(null);
    var db = ensureDb();
    var notif = Object.assign({ notificationId: uid("ntf"), read: false, createdAt: now() }, data);
    db.notifications.unshift(notif);
    save(db);
    return delay(notif);
  }

  function markNotificationRead(notificationId) {
    var db = ensureDb();
    var idx = db.notifications.findIndex(function (n) { return n.notificationId === notificationId; });
    if (idx === -1) return delay(false);
    db.notifications[idx].read = true;
    save(db);
    return delay(true);
  }

  // ---------------------------------------------------------------
  // Aggregate stats (for dashboards / analytics counters)
  // ---------------------------------------------------------------
  function getBusinessStats(businessUid) {
    var db = ensureDb();
    var offers = db.offers.filter(function (o) { return o.businessUid === businessUid; });
    var offerIds = offers.map(function (o) { return o.offerId; });
    var apps = db.applications.filter(function (a) { return offerIds.indexOf(a.offerId) > -1; });
    return delay({
      totalOffers: offers.length,
      activeOffers: offers.filter(function (o) { return o.status === "published"; }).length,
      totalApplicants: apps.length,
      accepted: apps.filter(function (a) { return a.status === "accepted" || a.status === "completed"; }).length,
      completed: apps.filter(function (a) { return a.status === "completed"; }).length,
      avgRating: (function () {
        var rated = apps.filter(function (a) { return typeof a.rating === "number"; });
        if (!rated.length) return 0;
        return Math.round((rated.reduce(function (s, a) { return s + a.rating; }, 0) / rated.length) * 10) / 10;
      })()
    });
  }

  function getPlatformStats() {
    var db = ensureDb();
    return delay({
      totalOffers: db.offers.length,
      totalUsers: db.users.length,
      totalApplications: db.applications.length,
      openDisputes: 0
    });
  }

  function resetDb() {
    save(seed());
    return delay(true);
  }

  global.MadaDB = {
    // offers
    getOffers: getOffers,
    getOffer: getOffer,
    createOffer: createOffer,
    updateOffer: updateOffer,
    deleteOffer: deleteOffer,
    // applications
    getApplicants: getApplicants,
    getApplicationsByUser: getApplicationsByUser,
    createApplication: createApplication,
    updateApplicationStatus: updateApplicationStatus,
    submitProof: submitProof,
    submitRating: submitRating,
    // users
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    currentUid: currentUid,
    setCurrentUid: setCurrentUid,
    // notifications
    getNotifications: getNotifications,
    createNotification: createNotification,
    markNotificationRead: markNotificationRead,
    // stats
    getBusinessStats: getBusinessStats,
    getPlatformStats: getPlatformStats,
    // utility
    resetDb: resetDb
  };
})(window);
