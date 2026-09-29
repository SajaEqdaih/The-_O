/**
 * MADA UI Kit — assets/js/ui-kit.js
 * ------------------------------------------------------------
 * Shared, dependency-free UI primitives used across every page:
 *   MadaUI.toast(message, type)                 success | error | warning | info
 *   MadaUI.confirm({ title, body, confirmLabel, cancelLabel, danger })  -> Promise<boolean>
 *   MadaUI.skeleton(container, { rows, height })  paints shimmer placeholders
 *   MadaUI.animateCount(el, target, opts)         number counter animation
 *   MadaUI.previewImage(inputEl, targetEl)        FileReader instant preview
 *   MadaUI.stars(container, { value, editable, onChange })  star rating widget
 *
 * Include once, after data-service.js, before the page's own inline script.
 * Ripple + touch-scale feedback on .btn/.card is wired automatically.
 */
(function (global) {
  "use strict";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // ---------------------------------------------------------------
  // Toast manager
  // ---------------------------------------------------------------
  var toastHost;
  function ensureToastHost() {
    if (toastHost) return toastHost;
    toastHost = el("div", "mada-toast-host");
    toastHost.setAttribute("aria-live", "polite");
    toastHost.setAttribute("role", "status");
    document.body.appendChild(toastHost);
    return toastHost;
  }

  var ICONS = { success: "✓", error: "!", warning: "!", info: "i" };

  function toast(message, type) {
    type = type && ICONS[type] ? type : "success";
    var host = ensureToastHost();
    var t = el("div", "mada-toast mada-toast-" + type);
    t.innerHTML = '<span class="mada-toast-ic">' + ICONS[type] + '</span><span class="mada-toast-msg"></span>';
    t.querySelector(".mada-toast-msg").textContent = message;
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    var remove = function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 220);
    };
    var timer = setTimeout(remove, 3200);
    t.addEventListener("click", function () { clearTimeout(timer); remove(); });
    return t;
  }

  // Back-compat with the old inline window.toast(text) helper.
  global.toast = function (msg) { toast(msg, "success"); };

  // ---------------------------------------------------------------
  // Confirmation modal (accessible, promise-based)
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // Mobile modal history trap: pushes a history entry when a modal
  // opens so the hardware/gesture back button closes the modal
  // instead of leaving the page. Shared by confirmModal & openDialog.
  // ---------------------------------------------------------------
  function withHistoryTrap(finalize){
    var pushed = false;
    try{ history.pushState({ madaModal: true }, ""); pushed = true; }catch(e){}
    var pendingArg;
    function onPopState(){ window.removeEventListener("popstate", onPopState); finalize(pendingArg); }
    if(pushed) window.addEventListener("popstate", onPopState);
    return function requestClose(arg){
      pendingArg = arg;
      if(pushed && history.state && history.state.madaModal){
        pushed = false; // about to be consumed by the resulting popstate
        history.back();
      } else {
        window.removeEventListener("popstate", onPopState);
        finalize(arg);
      }
    };
  }

  function confirmModal(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var overlay = el("div", "mada-modal-overlay");
      var card = el("div", "mada-modal-card" + (opts.danger ? " danger" : ""));
      card.setAttribute("role", "alertdialog");
      card.setAttribute("aria-modal", "true");
      card.innerHTML =
        '<h3 class="mada-modal-title"></h3>' +
        '<p class="mada-modal-body"></p>' +
        '<div class="mada-modal-actions">' +
        '<button type="button" class="btn light mada-modal-cancel"></button>' +
        '<button type="button" class="btn ' + (opts.danger ? "red" : "primary") + ' mada-modal-confirm"></button>' +
        "</div>";
      card.querySelector(".mada-modal-title").textContent = opts.title || "تأكيد";
      card.querySelector(".mada-modal-body").textContent = opts.body || "هل أنت متأكد من إتمام هذا الإجراء؟";
      card.querySelector(".mada-modal-cancel").textContent = opts.cancelLabel || "إلغاء";
      card.querySelector(".mada-modal-confirm").textContent = opts.confirmLabel || "تأكيد";
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      document.body.classList.add("mada-modal-open");
      requestAnimationFrame(function () { overlay.classList.add("show"); });

      function close(result) {
        overlay.classList.remove("show");
        document.body.classList.remove("mada-modal-open");
        setTimeout(function () { overlay.remove(); }, 180);
        resolve(result);
      }
      var requestClose = withHistoryTrap(close);
      card.querySelector(".mada-modal-cancel").addEventListener("click", function () { requestClose(false); });
      card.querySelector(".mada-modal-confirm").addEventListener("click", function () { requestClose(true); });
      overlay.addEventListener("click", function (e) { if (e.target === overlay) requestClose(false); });
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { requestClose(false); document.removeEventListener("keydown", esc); }
      });
      card.querySelector(".mada-modal-confirm").focus();
    });
  }

  // Generic dismissible dialog with custom body content (used for proof-of-delivery, forms, etc).
  function openDialog(opts) {
    opts = opts || {};
    var overlay = el("div", "mada-modal-overlay");
    var card = el("div", "mada-modal-card mada-modal-wide");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    var closeBtn = el("button", "mada-modal-x", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "إغلاق");
    var title = el("h3", "mada-modal-title", opts.title || "");
    var body = el("div", "mada-modal-custom-body");
    if (typeof opts.render === "function") opts.render(body);
    card.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    document.body.classList.add("mada-modal-open");
    requestAnimationFrame(function () { overlay.classList.add("show"); });

    function close() {
      overlay.classList.remove("show");
      document.body.classList.remove("mada-modal-open");
      setTimeout(function () { overlay.remove(); }, 180);
      document.body.classList.remove("mada-modal-open");
      if (typeof opts.onClose === "function") opts.onClose();
    }
    var requestClose = withHistoryTrap(close);
    closeBtn.addEventListener("click", function(){ requestClose(); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) requestClose(); });
    return { close: requestClose, body: body };
  }

  // ---------------------------------------------------------------
  // Skeleton loading placeholders
  // ---------------------------------------------------------------
  function skeleton(container, opts) {
    opts = opts || {};
    var rows = opts.rows || 3;
    container.innerHTML = "";
    container.setAttribute("aria-busy", "true");
    for (var i = 0; i < rows; i++) {
      var line = el("div", "mada-skel-card");
      line.innerHTML = '<div class="mada-skel mada-skel-img"></div><div class="mada-skel mada-skel-line w70"></div><div class="mada-skel mada-skel-line w40"></div>';
      container.appendChild(line);
    }
    return function clear() { container.setAttribute("aria-busy", "false"); };
  }

  // ---------------------------------------------------------------
  // Number counter animation
  // ---------------------------------------------------------------
  function animateCount(target, endValue, opts) {
    opts = opts || {};
    var duration = opts.duration || 900;
    var decimals = opts.decimals || 0;
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = start + (endValue - start) * eased;
      target.textContent = (opts.prefix || "") + value.toFixed(decimals) + (opts.suffix || "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateCountersIn(root) {
    var nodes = (root || document).querySelectorAll("[data-count-to]");
    if (!nodes.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var node = entry.target;
        animateCount(node, parseFloat(node.getAttribute("data-count-to")), {
          decimals: parseInt(node.getAttribute("data-count-decimals") || "0", 10),
          prefix: node.getAttribute("data-count-prefix") || "",
          suffix: node.getAttribute("data-count-suffix") || ""
        });
        io.unobserve(node);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  // ---------------------------------------------------------------
  // Image upload preview
  // ---------------------------------------------------------------
  function previewImage(inputEl, targetEl) {
    inputEl.addEventListener("change", function () {
      var file = inputEl.files && inputEl.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) { toast("الرجاء اختيار ملف صورة", "error"); return; }
      var reader = new FileReader();
      reader.onload = function (e) {
        if (targetEl.tagName === "IMG") targetEl.src = e.target.result;
        else targetEl.style.backgroundImage = "url(" + e.target.result + ")";
        targetEl.classList.add("has-image");
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------------------------------------------------------------
  // Star rating widget
  // ---------------------------------------------------------------
  function stars(container, opts) {
    opts = opts || {};
    var value = opts.value || 0;
    container.classList.add("mada-stars");
    container.setAttribute("role", opts.editable ? "radiogroup" : "img");
    container.innerHTML = "";
    for (var i = 1; i <= 5; i++) {
      var s = el("span", "mada-star" + (i <= value ? " filled" : ""), "★");
      (function (i, s) {
        if (opts.editable) {
          s.setAttribute("role", "radio");
          s.setAttribute("tabindex", "0");
          s.addEventListener("click", function () {
            value = i;
            Array.from(container.children).forEach(function (c, idx) { c.classList.toggle("filled", idx < value); });
            if (typeof opts.onChange === "function") opts.onChange(value);
          });
        }
      })(i, s);
      container.appendChild(s);
    }
  }

  // ---------------------------------------------------------------
  // Ripple / press feedback delegated to every .btn and .card
  // ---------------------------------------------------------------
  document.addEventListener("pointerdown", function (e) {
    var target = e.target.closest(".btn, .card, .my-offer-card, .filter-chip");
    if (!target) return;
    var rect = target.getBoundingClientRect();
    var ripple = el("span", "mada-ripple");
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
    var prevPosition = getComputedStyle(target).position;
    if (prevPosition === "static") target.style.position = "relative";
    target.classList.add("mada-ripple-host");
    target.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 600);
  }, { passive: true });

  // ---------------------------------------------------------------
  // Site-wide confirmation guards (logout, delete, disconnect...)
  // Any element anywhere in the app can opt in just by adding the
  // matching data-attribute — no per-page JS required.
  // ---------------------------------------------------------------
  document.addEventListener("click", function (e) {
    var logoutLink = e.target.closest("[data-logout]");
    if (logoutLink) {
      e.preventDefault();
      confirmModal({
        title: "تسجيل الخروج",
        body: "هل تريد تسجيل الخروج من حسابك؟",
        confirmLabel: "تسجيل الخروج"
      }).then(function (ok) {
        if (ok) window.location.href = logoutLink.getAttribute("href") || "index.html";
      });
      return;
    }
    var dangerAction = e.target.closest("[data-confirm-danger]");
    if (dangerAction) {
      e.preventDefault();
      confirmModal({
        title: dangerAction.getAttribute("data-confirm-title") || "تأكيد الإجراء",
        body: dangerAction.getAttribute("data-confirm-danger"),
        danger: true,
        confirmLabel: dangerAction.getAttribute("data-confirm-label") || "تأكيد"
      }).then(function (ok) {
        if (ok) toast(dangerAction.getAttribute("data-confirm-success") || "تم تنفيذ الإجراء", "success");
      });
    }
  });

  global.MadaUI = {
    toast: toast,
    confirm: confirmModal,
    openDialog: openDialog,
    skeleton: skeleton,
    animateCount: animateCount,
    animateCountersIn: animateCountersIn,
    previewImage: previewImage,
    stars: stars
  };

  document.addEventListener("DOMContentLoaded", function () { animateCountersIn(document); });
})(window);
