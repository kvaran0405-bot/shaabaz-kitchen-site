/* Shaabaz Kitchen: effects. No libraries. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Opening curtain ---- */
  var loader = document.querySelector(".loader");
  var hideLoader = function () { if (loader) loader.classList.add("done"); };
  if (reduce) hideLoader();
  else {
    try { if (sessionStorage.getItem("sk-seen")) hideLoader(); sessionStorage.setItem("sk-seen", "1"); } catch (e) {}
    window.addEventListener("load", function () { setTimeout(hideLoader, 700); });
    setTimeout(hideLoader, 2500);
  }

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle"), links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Photos: if images/photos/<name> exists, show it ---- */
  $$("[data-photo]").forEach(function (el) {
    var src = el.getAttribute("data-photo"), img = new Image();
    img.onload = function () { el.style.backgroundImage = 'url("' + src + '")'; el.classList.add("has-photo"); };
    img.src = src;
  });

  /* ---- Background videos: show once playing; hide if the file is missing or motion is reduced ---- */
  $$(".bg-video").forEach(function (v) {
    var hide = function () { v.pause(); v.style.display = "none"; };
    if (reduce) { hide(); return; }
    v.addEventListener("playing", function () { v.classList.add("playing"); });
    var srcs = $$("source", v), failed = 0;
    srcs.forEach(function (src) { src.addEventListener("error", function () { if (++failed === srcs.length) hide(); }); });
  });

  /* ---- Fade in on scroll ---- */
  var items = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add("in"); });

  /* ---- Left rail: section number + dots ---- */
  var scenes = $$("[data-scene]"), num = document.getElementById("rail-num"), dots = $$("#rail-dots i");
  var setScene = function (i) {
    if (num) num.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
    dots.forEach(function (d, j) { d.classList.toggle("on", j === i); });
  };
  setScene(0);
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setScene(scenes.indexOf(e.target)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    scenes.forEach(function (s) { so.observe(s); });
  }

  /* ---- Scroll progress bar + soft parallax on backgrounds ---- */
  var bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
  var bgs = $$(".scene-bg"), ticking = false;
  var onScroll = function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    if (!reduce) bgs.forEach(function (bg) {
      var r = bg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) bg.style.transform = "translateY(" + (r.top * -0.12).toFixed(1) + "px) scale(1.15)";
    });
    ticking = false;
  };
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---- Numbers count up ---- */
  $$("[data-count]").forEach(function (el) {
    var target = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "";
    if (reduce || !("IntersectionObserver" in window)) return;
    var co = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; co.disconnect();
      var t0 = performance.now(), keep = el.textContent;
      var step = function (t) {
        var p = Math.min(1, (t - t0) / 1600), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString() + suf;
        if (p < 1) requestAnimationFrame(step); else el.textContent = keep;
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    co.observe(el);
  });

  /* ---- Golden embers rising in the hero ---- */
  var cv = document.querySelector(".embers");
  if (cv && !reduce) {
    var ctx = cv.getContext("2d"), parts = [], W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1);
    var size = function () { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener("resize", size);
    var make = function (fresh) { return { x: Math.random() * W, y: fresh ? H + 10 : Math.random() * H, r: Math.random() * 1.8 + .6, s: Math.random() * .5 + .2, w: Math.random() * 2 * Math.PI, a: Math.random() * .6 + .3 }; };
    for (var i = 0; i < 55; i++) parts.push(make(false));
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p, k) {
        p.y -= p.s; p.w += .02; p.x += Math.sin(p.w) * .3;
        if (p.y < -10) parts[k] = make(true);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = "rgba(226,182,90," + (p.a * Math.min(1, p.y / H + .2)).toFixed(2) + ")";
        ctx.shadowColor = "rgba(226,182,90,.8)"; ctx.shadowBlur = 6; ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---- Fanned photo slider ---- */
  $$("[data-fan]").forEach(function (fan) {
    var cards = $$(".fan-card", fan), dotsBox = fan.nextElementSibling, cur = 0, n = cards.length, timer;
    var dotEls = cards.map(function (_, i) {
      var b = document.createElement("button"); b.setAttribute("aria-label", "Show dish " + (i + 1));
      b.addEventListener("click", function () { go(i); restart(); }); dotsBox.appendChild(b); return b;
    });
    var go = function (i) {
      cur = (i + n) % n;
      cards.forEach(function (c, j) {
        var d = j - cur; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        c.setAttribute("data-pos", Math.abs(d) <= 2 ? String(d) : "hide");
      });
      dotEls.forEach(function (b, j) { b.classList.toggle("on", j === cur); });
    };
    cards.forEach(function (c, j) { c.addEventListener("click", function () { go(j); restart(); }); });
    var restart = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(cur + 1); }, 3800); };
    var sx = null;
    fan.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    fan.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); restart(); } sx = null; });
    go(0); restart();
  });

  /* ---- Mouse effects: biryani steam, gold dot, tilt cards, magnetic buttons ---- */
  if (!reduce) {
    /* Hot dum-biryani steam: soft puffs rise and fade behind the mouse (or a finger tap) */
    var sc = document.createElement("canvas"); sc.className = "steam-cursor"; sc.setAttribute("aria-hidden", "true");
    document.body.appendChild(sc);
    var sx2 = sc.getContext("2d"), puffs = [], MAX = fine ? 90 : 40, sdpr = Math.min(2, devicePixelRatio || 1), running = false;
    var sres = function () { sc.width = innerWidth * sdpr; sc.height = innerHeight * sdpr; sx2.setTransform(sdpr, 0, 0, sdpr, 0, 0); };
    sres(); addEventListener("resize", sres);
    // one soft white blob, drawn once and stamped for every puff
    var blob = document.createElement("canvas"); blob.width = blob.height = 64;
    var bctx = blob.getContext("2d"), grd = bctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,250,240,.55)"); grd.addColorStop(.45, "rgba(255,248,235,.22)"); grd.addColorStop(1, "rgba(255,248,235,0)");
    bctx.fillStyle = grd; bctx.fillRect(0, 0, 64, 64);
    var tick = function () {
      sx2.clearRect(0, 0, innerWidth, innerHeight);
      var alive = [];
      puffs.forEach(function (p) {
        p.life++;
        if (p.life > p.max) return;
        p.sway += .05; p.x += p.vx + Math.sin(p.sway) * .45; p.y += p.vy; p.vy *= .995; p.r += p.grow;
        var t = p.life / p.max, a = t < .2 ? t / .2 : 1 - (t - .2) / .8;
        sx2.globalAlpha = Math.max(0, a) * .75;
        sx2.drawImage(blob, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        alive.push(p);
      });
      puffs = alive; sx2.globalAlpha = 1;
      if (puffs.length) requestAnimationFrame(tick); else running = false;
    };
    var puff = function (x, y, n, power) {
      for (var i = 0; i < n; i++) {
        if (puffs.length >= MAX) puffs.shift();
        puffs.push({ x: x + (Math.random() - .5) * 14, y: y + (Math.random() - .5) * 8, r: 10 + Math.random() * 14,
          vx: (Math.random() - .5) * .5, vy: -(.6 + Math.random() * .9) * power, life: 0, max: 70 + Math.random() * 50,
          sway: Math.random() * 6.283, grow: .35 + Math.random() * .35 });
      }
      if (!running) { running = true; requestAnimationFrame(tick); }
    };
    var lastT = 0, lx = 0, ly = 0, dot = null;
    if (fine) { dot = document.createElement("div"); dot.className = "cursor-dot"; dot.setAttribute("aria-hidden", "true"); document.body.appendChild(dot); }
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (dot) { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; dot.classList.add("on"); }
      var now = performance.now(), dist = Math.hypot(e.clientX - lx, e.clientY - ly);
      if (now - lastT > 40 && dist > 8) { puff(e.clientX, e.clientY, dist > 40 ? 2 : 1, 1); lastT = now; lx = e.clientX; ly = e.clientY; }
    }, { passive: true });
    addEventListener("pointerdown", function (e) { puff(e.clientX, e.clientY, 7, 1.4); }, { passive: true });
    document.addEventListener("mouseleave", function () { if (dot) dot.classList.remove("on"); });
    if (dot) $$("a, button, input, select, textarea").forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("hover"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("hover"); });
    });
    if (fine) {
      $$(".tilt").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          el.style.transform = "perspective(900px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 7).toFixed(2) + "deg) translateY(-4px)";
        });
        el.addEventListener("mouseleave", function () { el.style.transform = ""; });
      });
      $$(".magnetic").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + "px)";
        });
        el.addEventListener("mouseleave", function () { el.style.transform = ""; });
      });
    }
  }

  /* ---- Menu tabs ---- */
  var tabs = $$(".tab");
  var openTab = function (id) {
    var t = document.querySelector('.tab[aria-controls="' + id + '"]'); if (!t) return;
    tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); });
    $$(".menu-panel").forEach(function (p) {
      p.hidden = p.id !== id;
      if (!p.hidden) $$(".reveal", p).forEach(function (el) { el.classList.add("in"); });
    });
  };
  tabs.forEach(function (t) { t.addEventListener("click", function () { openTab(t.getAttribute("aria-controls")); }); });
  $$(".cat-tile[data-tab]").forEach(function (tile) { tile.addEventListener("click", function () { openTab(tile.getAttribute("data-tab")); }); });
  if (location.hash && tabs.length) {
    var id = location.hash.slice(1);
    if (document.getElementById(id)) { openTab(id); var ml = document.getElementById("menu-list"); if (ml) setTimeout(function () { ml.scrollIntoView(); }, 50); }
  }

  /* ---- Enquiry form -> WhatsApp ---- */
  var form = document.getElementById("enquiry");
  if (form) {
    var pick = new URLSearchParams(location.search).get("package");
    if (pick && form.message) form.message.value = "I'm interested in: " + pick;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form), lines = ["Hi Shaabaz Kitchen! I'd like to enquire about catering.",
        "Name: " + (d.get("name") || ""), "Phone: " + (d.get("phone") || ""), "Menu: " + (d.get("event") || ""),
        "Date: " + (d.get("date") || ""), "Guests: " + (d.get("guests") || ""), "Delivery/collection: " + (d.get("get") || ""),
        "Message: " + (d.get("message") || "")];
      window.open("https://wa.me/" + form.getAttribute("data-whatsapp") + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }
})();
