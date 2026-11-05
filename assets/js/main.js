(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu ---------- */
  var btn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Flyer lightbox ---------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (tiles.length) {
    var lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML =
      '<button class="lb__btn lb__close" aria-label="Close">&#10005;</button>' +
      '<button class="lb__btn lb__prev" aria-label="Previous">&#8592;</button>' +
      '<img class="lb__img" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">' +
      '<button class="lb__btn lb__next" aria-label="Next">&#8594;</button>' +
      '<div class="lb__count" aria-live="polite"></div>';
    document.body.appendChild(lb);
    var img = lb.querySelector(".lb__img"), count = lb.querySelector(".lb__count");
    var idx = 0, opener = null;

    var show = function (i) {
      idx = (i + tiles.length) % tiles.length;
      var a = tiles[idx];
      img.src = a.getAttribute("href");
      img.alt = a.querySelector("img").alt;
      count.textContent = (idx + 1) + " / " + tiles.length;
      var nxt = new Image(); nxt.src = tiles[(idx + 1) % tiles.length].getAttribute("href");
    };
    var open = function (i, from) { opener = from; show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; lb.querySelector(".lb__close").focus(); };
    var close = function () { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (opener) opener.focus(); };

    tiles.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(i, a); });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest(".lb__close")) close();
      else if (e.target.closest(".lb__prev")) show(idx - 1);
      else if (e.target.closest(".lb__next")) show(idx + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- UI/UX cards + motion viewer ---------- */
  var grid = document.getElementById("uiux-grid");
  var projects = window.UIUX_PROJECTS;
  if (grid && projects && projects.length) {
    grid.innerHTML = "";
    projects.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "card card--ui";
      b.setAttribute("aria-label", "Open " + p.title + " in motion");
      var cover = p.cover
        ? '<img src="' + p.cover + '" alt="">'
        : '<span class="shape shape--' + p.shape + '" style="--shape:' + p.shapeColor + '"></span>';
      var hasMotion = p.media && p.media.type !== "none";
      b.innerHTML =
        '<span class="card__media" style="--tone:' + p.tone + '">' + cover +
        (hasMotion ? '<span class="play-badge">Play</span>' : "") + "</span>" +
        '<span class="card__title"></span><span class="card__desc"></span>';
      b.querySelector(".card__title").textContent = p.title;
      b.querySelector(".card__desc").textContent = p.description;
      b.style.setProperty("--tone", p.tone);
      b.querySelector(".card__media").style.background = p.tone;
      b.addEventListener("click", function () { openViewer(p, b.querySelector(".card__media"), b); });
      grid.appendChild(b);
    });
  }

  var viewer, viewerState = null;

  function buildStage(p, stage) {
    var m = p.media || { type: "demo" };
    stage.innerHTML = "";
    var timer = null;
    if (m.type === "video") {
      var v = document.createElement("video");
      v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true; v.controls = true;
      if (m.poster) v.poster = m.poster;
      if (m.webm) { var s1 = document.createElement("source"); s1.src = m.webm; s1.type = "video/webm"; v.appendChild(s1); }
      var s2 = document.createElement("source"); s2.src = m.src; s2.type = "video/mp4"; v.appendChild(s2);
      s2.addEventListener("error", function () {
        stage.innerHTML = '<div class="demo"><p style="position:static;max-width:36ch">Video not added yet.<br>Save it as <b>' + m.src + '</b> and refresh.</p></div>';
      });
      stage.appendChild(v);
      v.play && v.play().catch(function () {});
    } else if (m.type === "figma") {
      var f = document.createElement("iframe");
      f.src = m.src; f.allowFullscreen = true; f.title = p.title + " prototype";
      stage.appendChild(f);
    } else if (m.type === "scroll" && m.images && m.images.length) {
      // Long web pages / app screens inside a phone-shaped window that auto-scrolls, then moves to the next page.
      var box = document.createElement("div"); box.className = "scrollpages";
      var sdots = document.createElement("div"); sdots.className = "frames__dots";
      var simgs = [], sds = [], sc = 0, anim = null, st = null, token = 0;
      m.images.forEach(function (src, i) {
        var im = document.createElement("img"); im.src = src; im.alt = p.title + " page " + (i + 1); box.appendChild(im); simgs.push(im);
        var d = document.createElement("button"); d.setAttribute("aria-label", "Page " + (i + 1));
        d.addEventListener("click", function () { playPage(i); }); sdots.appendChild(d); sds.push(d);
      });
      stage.appendChild(box); stage.appendChild(sdots);
      if (reduce) box.style.overflowY = "auto";
      var playPage = function (i) {
        var my = ++token; clearTimeout(st); if (anim) anim.cancel();
        sc = i;
        simgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); im.style.transform = "none"; });
        sds.forEach(function (d, k) { d.classList.toggle("is-on", k === i); d.style.setProperty("--w", k < i ? "1" : "0"); });
        var im = simgs[i];
        var go = function () {
          if (my !== token || reduce) return;
          var travel = Math.max(0, im.offsetHeight - box.clientHeight);
          var dur = Math.min(18000, Math.max(5000, travel * 8));
          sdots.style.setProperty("--iv", (dur + 1800) + "ms");
          sds[i].classList.remove("is-on"); void sds[i].offsetWidth; sds[i].classList.add("is-on");
          anim = im.animate([{ transform: "translateY(0)" }, { transform: "translateY(-" + travel + "px)" }],
            { duration: dur, delay: 900, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
          anim.finished.then(function () {
            st = setTimeout(function () { if (my === token) playPage((sc + 1) % simgs.length); }, 900);
          }, function () {});
        };
        if (im.complete && im.naturalWidth) go(); else im.addEventListener("load", go, { once: true });
      };
      box.title = "Click to pause / resume"; box.style.cursor = "pointer";
      box.addEventListener("click", function () {
        if (!anim) return;
        if (anim.playState === "running") anim.pause(); else if (anim.playState === "paused") anim.play();
      });
      playPage(0);
      stage._stop = function () { token++; clearTimeout(st); if (anim) anim.cancel(); };
    } else if (m.type === "frames" && m.images && m.images.length) {
      var wrap = document.createElement("div"); wrap.className = "frames";
      var dots = document.createElement("div"); dots.className = "frames__dots";
      var iv = m.interval || 2800, cur = 0, imgs = [], ds = [];
      wrap.style.setProperty("--iv", iv + "ms");
      m.images.forEach(function (src, i) {
        var im = document.createElement("img"); im.src = src; im.alt = p.title + " screen " + (i + 1); wrap.appendChild(im); imgs.push(im);
        var d = document.createElement("button"); d.setAttribute("aria-label", "Screen " + (i + 1));
        d.addEventListener("click", function () { go(i, true); }); dots.appendChild(d); ds.push(d);
      });
      wrap.appendChild(dots); stage.appendChild(wrap);
      var go = function (n, manual) {
        imgs.forEach(function (im, i) {
          im.classList.toggle("is-on", i === n);
          im.classList.toggle("is-past", i < n);
        });
        ds.forEach(function (d, i) { d.classList.remove("is-on"); if (i === n) { void d.offsetWidth; d.classList.add("is-on"); } });
        cur = n; clearTimeout(timer);
        if (!reduce || manual) timer = setTimeout(function () { go((cur + 1) % imgs.length); }, iv);
      };
      go(0);
      stage._stop = function () { clearTimeout(timer); };
    } else {
      stage.innerHTML =
        '<div class="demo"><span class="shape shape--' + p.shape + '" style="--shape:' + p.shapeColor + '"></span>' +
        "<p>Demo animation. Add your own video, Figma prototype or screens in assets/js/projects.js</p></div>";
    }
  }

  function openViewer(p, mediaEl, opener) {
    if (!viewer) {
      viewer = document.createElement("div");
      viewer.className = "viewer";
      viewer.setAttribute("role", "dialog");
      viewer.setAttribute("aria-modal", "true");
      viewer.innerHTML =
        '<div class="viewer__scrim"></div>' +
        '<div class="viewer__panel">' +
        '<button class="viewer__close" aria-label="Close">&#10005;</button>' +
        '<div class="viewer__stage"></div>' +
        '<div class="viewer__bar"><div><h3></h3><p></p></div><div class="viewer__ctrl"><a class="viewer__open" target="_blank" rel="noopener" hidden>Open full screen</a><button type="button" data-act="replay">Replay</button></div></div>' +
        "</div>";
      document.body.appendChild(viewer);
      viewer.addEventListener("click", function (e) {
        if (e.target.classList.contains("viewer__scrim") || e.target.closest(".viewer__close")) closeViewer();
        if (e.target.closest("[data-act=replay]") && viewerState) buildStage(viewerState.p, viewer.querySelector(".viewer__stage"));
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && viewer.classList.contains("is-open")) closeViewer();
      });
    }
    var panel = viewer.querySelector(".viewer__panel");
    var stage = viewer.querySelector(".viewer__stage");
    var scrim = viewer.querySelector(".viewer__scrim");
    stage.style.setProperty("--tone", p.tone);
    viewer.querySelector("h3").textContent = p.title;
    viewer.querySelector("p").textContent = p.description;
    var isFigma = p.media && p.media.type === "figma";
    viewer.querySelector("[data-act=replay]").style.display = isFigma ? "none" : "";
    var openLink = viewer.querySelector(".viewer__open");
    openLink.hidden = !isFigma;
    if (isFigma) openLink.href = p.media.link || p.media.src;

    viewer.classList.add("is-open");
    document.body.style.overflow = "hidden";
    viewerState = { p: p, opener: opener, mediaEl: mediaEl };

    var to = panel.getBoundingClientRect(), from = mediaEl.getBoundingClientRect();
    stage.style.opacity = "0";
    if (!reduce && panel.animate) {
      var dx = from.left - to.left, dy = from.top - to.top, sx = from.width / to.width, sy = from.height / to.height;
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, fill: "backwards" });
      panel.animate(
        [{ transformOrigin: "0 0", transform: "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")", borderRadius: "20px" },
         { transformOrigin: "0 0", transform: "none", borderRadius: "24px" }],
        { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
      ).finished.then(function () { reveal(); });
    } else { reveal(); }
    function reveal() {
      buildStage(p, stage);
      if (stage.animate && !reduce) stage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 });
      stage.style.opacity = "1";
      viewer.querySelector(".viewer__close").focus();
    }
  }

  function closeViewer() {
    if (!viewerState) return;
    var panel = viewer.querySelector(".viewer__panel");
    var stage = viewer.querySelector(".viewer__stage");
    var scrim = viewer.querySelector(".viewer__scrim");
    if (stage._stop) stage._stop();
    stage.innerHTML = "";
    var st = viewerState; viewerState = null;
    var done = function () { viewer.classList.remove("is-open"); document.body.style.overflow = ""; st.opener.focus(); };
    if (!reduce && panel.animate) {
      var to = st.mediaEl.getBoundingClientRect(), from = panel.getBoundingClientRect();
      scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      panel.animate(
        [{ transformOrigin: "0 0", transform: "none" },
         { transformOrigin: "0 0", transform: "translate(" + (to.left - from.left) + "px," + (to.top - from.top) + "px) scale(" + (to.width / from.width) + "," + (to.height / from.height) + ")" }],
        { duration: 420, easing: "cubic-bezier(.5,0,.2,1)", fill: "forwards" }
      ).finished.then(function () { done(); panel.getAnimations().forEach(function (a) { a.cancel(); }); scrim.getAnimations().forEach(function (a) { a.cancel(); }); });
    } else { done(); }
  }
})();

/* ===== DARK MODE TOGGLE ===== */
(function () {
  var btn = document.querySelector(".theme-btn");
  var root = document.documentElement;
  function apply(t) {
    root.setAttribute("data-theme", t);
    if (btn) {
      btn.setAttribute("aria-pressed", String(t === "dark"));
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }
  apply(root.getAttribute("data-theme") || "light");
  if (btn) btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();
