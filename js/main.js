/* Shaabaz Kitchen — small effects, no libraries needed. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- Year in footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Scroll fade-in ---- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Cursor ripple (mouse move + tap) ---- */
  if (!reduce) {
    var layer = document.createElement("div");
    layer.className = "ripple-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    var spawn = function (x, y, big) {
      var r = document.createElement("span");
      r.className = big ? "ripple big" : "ripple";
      r.style.left = x + "px";
      r.style.top = y + "px";
      layer.appendChild(r);
      r.addEventListener("animationend", function () { r.remove(); });
    };

    var last = 0, lx = 0, ly = 0;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var dot = null;
    if (finePointer) {
      dot = document.createElement("div");
      dot.className = "cursor-dot";
      dot.setAttribute("aria-hidden", "true");
      document.body.appendChild(dot);
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (dot) {
        dot.style.left = e.clientX + "px";
        dot.style.top = e.clientY + "px";
        dot.classList.add("on");
      }
      var now = performance.now();
      var dist = Math.hypot(e.clientX - lx, e.clientY - ly);
      if (now - last > 70 && dist > 24) {
        spawn(e.clientX, e.clientY, false);
        last = now; lx = e.clientX; ly = e.clientY;
      }
    }, { passive: true });

    window.addEventListener("pointerdown", function (e) {
      spawn(e.clientX, e.clientY, true);
    }, { passive: true });

    document.addEventListener("mouseleave", function () { if (dot) dot.classList.remove("on"); });

    if (dot) {
      document.querySelectorAll("a, button, .tab, input, select, textarea").forEach(function (el) {
        el.addEventListener("mouseenter", function () { dot.classList.add("hover"); });
        el.addEventListener("mouseleave", function () { dot.classList.remove("hover"); });
      });
    }
  }

  /* ---- Photos: if images/photos/<name> exists, show it in the photo spot ---- */
  document.querySelectorAll("[data-photo]").forEach(function (el) {
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url("' + el.getAttribute("data-photo") + '")';
      el.classList.add("has-photo");
    };
    img.src = el.getAttribute("data-photo");
  });

  /* ---- Menu tabs ---- */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".menu-panel").forEach(function (p) {
        p.hidden = p.id !== tab.getAttribute("aria-controls");
        if (!p.hidden) p.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      });
    });
  });
  // category photo tiles on the menu page open their tab
  document.querySelectorAll(".cat-tile[data-tab]").forEach(function (tile) {
    tile.addEventListener("click", function () {
      var t = document.querySelector('.tab[aria-controls="' + tile.getAttribute("data-tab") + '"]');
      if (t) t.click();
    });
  });
  // open a tab from the link, e.g. menus.html#wedding
  if (location.hash) {
    var t = document.querySelector('.tab[aria-controls="' + location.hash.slice(1) + '"]');
    if (t) t.click();
  }

  /* ---- Enquiry form -> opens WhatsApp with the details filled in ---- */
  var form = document.getElementById("enquiry");
  if (form) {
    var pick = new URLSearchParams(location.search).get("package");
    if (pick && form.message) form.message.value = "I'm interested in: " + pick;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = "Hi Shaabaz Kitchen! I'd like to enquire about catering.%0A" +
        "Name: " + encodeURIComponent(d.get("name") || "") + "%0A" +
        "Phone: " + encodeURIComponent(d.get("phone") || "") + "%0A" +
        "Event: " + encodeURIComponent(d.get("event") || "") + "%0A" +
        "Date: " + encodeURIComponent(d.get("date") || "") + "%0A" +
        "Guests: " + encodeURIComponent(d.get("guests") || "") + "%0A" +
        "Delivery/collection: " + encodeURIComponent(d.get("get") || "") + "%0A" +
        "Message: " + encodeURIComponent(d.get("message") || "");
      var num = form.getAttribute("data-whatsapp");
      window.open("https://wa.me/" + num + "?text=" + msg, "_blank", "noopener");
    });
  }
})();
