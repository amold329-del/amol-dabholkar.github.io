/* ============================================================
   Amol Dabholkar — Portfolio
   script.js  (vanilla JS, no dependencies)
   ------------------------------------------------------------
   Hardened build:
     - Reveal runs FIRST and is fail-safe (content never stays hidden)
     - Every element lookup is guarded, so one missing node can't
       break the rest of the page
     - Works even if IntersectionObserver is unavailable
   Features: theme toggle · mobile menu · active-section nav ·
   scroll reveal · count-up stats · typing effect · terminal boot ·
   back-to-top · footer year · contact form (Formspree)
   ============================================================ */

(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  var html = document.documentElement;
  function $(id) { return document.getElementById(id); }

  /* ----------------------------------------------------------
     1. ON-SCROLL REVEAL  (runs first so nothing gets stuck hidden)
  ---------------------------------------------------------- */
  (function reveal() {
    var els = document.querySelectorAll(".reveal");
    // Reduced motion or no observer support: just show everything.
    if (REDUCED || !hasIO) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    // Opt in to the hide->reveal animation only now that JS is running.
    html.classList.add("reveal-anim");
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add("is-visible"); }, i * 70);
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { obs.observe(el); });
    // Failsafe: reveal everything after 3s even if the observer misbehaves.
    setTimeout(function () { els.forEach(function (el) { el.classList.add("is-visible"); }); }, 3000);
  })();

  /* ----------------------------------------------------------
     2. THEME TOGGLE (dark/light) with localStorage persistence
  ---------------------------------------------------------- */
  var themeToggle = $("themeToggle");
  if (themeToggle) {
    var setIcon = function (t) {
      var i = themeToggle.querySelector("i");
      if (i) i.className = (t === "light") ? "fa-solid fa-sun" : "fa-solid fa-moon";
      themeToggle.setAttribute("aria-label", (t === "light") ? "Switch to dark theme" : "Switch to light theme");
    };
    setIcon(html.getAttribute("data-theme") || "dark");
    themeToggle.addEventListener("click", function () {
      var next = (html.getAttribute("data-theme") === "light") ? "dark" : "light";
      html.setAttribute("data-theme", next);
      setIcon(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
    });
  }

  /* ----------------------------------------------------------
     3. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */
  var burger = $("navBurger");
  var navLinks = $("primary-nav");
  if (burger && navLinks) {
    var closeMenu = function () {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
    };
    var openMenu = function () {
      navLinks.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Close menu");
    };
    burger.addEventListener("click", function () {
      navLinks.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    navLinks.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ----------------------------------------------------------
     4. NAVBAR scrolled state + BACK-TO-TOP + ACTIVE SECTION
  ---------------------------------------------------------- */
  var nav = document.querySelector(".nav");
  var toTop = $("toTop");

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    });
  }

  var linkFor = {};
  document.querySelectorAll(".nav__link").forEach(function (l) {
    linkFor[l.getAttribute("href").slice(1)] = l;
  });
  if (hasIO) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (link && entry.isIntersecting) {
          document.querySelectorAll(".nav__link.is-active").forEach(function (a) {
            a.classList.remove("is-active");
            a.removeAttribute("aria-current");
          });
          link.classList.add("is-active");
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    document.querySelectorAll("main section[id]").forEach(function (s) { navObs.observe(s); });
  }

  /* ----------------------------------------------------------
     5. ANIMATED COUNT-UP STATS
  ---------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (REDUCED) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var dur = 1500, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && hasIO) {
    var cObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); o.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) { animateCount(c); });
  }

  /* ----------------------------------------------------------
     6. HERO TYPING EFFECT (cycling roles)
  ---------------------------------------------------------- */
  var typedEl = $("typed");
  var phrases = ["SDET", "Automation Architect", "API & Mobile Testing", "CI/CD"];
  if (typedEl) {
    if (REDUCED) {
      typedEl.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, del = false;
      var type = function () {
        var cur = phrases[pi];
        typedEl.textContent = cur.slice(0, ci);
        var delay = del ? 45 : 90;
        if (!del && ci === cur.length) { delay = 1400; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; delay = 350; }
        else { ci += del ? -1 : 1; }
        setTimeout(type, delay);
      };
      type();
    }
  }

  /* ----------------------------------------------------------
     7. TERMINAL "BOOT" ANIMATION
  ---------------------------------------------------------- */
  var terminal = $("terminal");
  if (terminal && !REDUCED && hasIO) {
    html.classList.add("anim-on");
    var lines = Array.prototype.slice.call(terminal.querySelectorAll(".term__line"));
    var started = false;
    var boot = function () {
      if (started) return;
      started = true;
      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add("shown"); }, 350 + i * 420);
      });
    };
    var tObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { boot(); o.disconnect(); } });
    }, { threshold: 0.3 });
    tObs.observe(terminal);
  }

  /* ----------------------------------------------------------
     8. FOOTER YEAR
  ---------------------------------------------------------- */
  var yearEl = $("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     9. CONTACT FORM (Formspree) with graceful fallback
  ---------------------------------------------------------- */
  var form = $("contactForm");
  var status = $("formStatus");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form__status";
      if (!form.checkValidity()) {
        status.textContent = "// please fill in all fields correctly";
        status.classList.add("is-err");
        return;
      }
      var action = form.getAttribute("action") || "";
      if (action.indexOf("your-form-id") !== -1) {
        status.textContent = "// add your Formspree endpoint in index.html to enable sending";
        status.classList.add("is-err");
        return;
      }
      status.textContent = "// sending…";
      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent = "\u2713 Message sent — thanks, I'll be in touch!";
            status.classList.add("is-ok");
          } else { throw new Error("bad response"); }
        })
        .catch(function () {
          status.textContent = "// something went wrong — email amold329@gmail.com instead";
          status.classList.add("is-err");
        });
    });
  }
})();
