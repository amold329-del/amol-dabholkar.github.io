/* ============================================================
   Amol Dabholkar — Portfolio
   script.js  (vanilla JS, no dependencies)
   ------------------------------------------------------------
   Features:
     1.  Theme toggle (dark/light) with localStorage persistence
     2.  Mobile hamburger menu
     3.  Navbar scrolled state + active-section highlight
     4.  On-scroll reveal animations (IntersectionObserver)
     5.  Animated count-up stats
     6.  Hero typing effect (cycling roles)
     7.  Terminal "boot" animation
     8.  Back-to-top button
     9.  Footer year
     10. Contact form (Formspree) with graceful fallback
   ============================================================ */

(function () {
  "use strict";

  // Respect users who prefer less motion
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  /* ----------------------------------------------------------
     1. THEME TOGGLE
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");

  function setThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    if (theme === "light") {
      icon.className = "fa-solid fa-sun";
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    } else {
      icon.className = "fa-solid fa-moon";
      themeToggle.setAttribute("aria-label", "Switch to light theme");
    }
  }
  // Sync icon with whatever the no-FOUC head script already applied
  setThemeIcon(html.getAttribute("data-theme") || "dark");

  themeToggle.addEventListener("click", function () {
    const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    setThemeIcon(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked — ignore */ }
  });

  /* ----------------------------------------------------------
     2. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("primary-nav");

  function closeMenu() {
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }
  function openMenu() {
    navLinks.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
  }

  burger.addEventListener("click", function () {
    navLinks.classList.contains("is-open") ? closeMenu() : openMenu();
  });
  // Close after tapping a link, or pressing Escape
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ----------------------------------------------------------
     3. NAVBAR scrolled state + ACTIVE SECTION highlight
  ---------------------------------------------------------- */
  const nav = document.querySelector(".nav");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const linkFor = {};
  document.querySelectorAll(".nav__link").forEach(function (l) {
    linkFor[l.getAttribute("href").slice(1)] = l;
  });

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
    toggleToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight the section currently in view
  const navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const link = linkFor[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav__link.is-active").forEach(function (a) {
          a.classList.remove("is-active");
          a.removeAttribute("aria-current");
        });
        link.classList.add("is-active");
        link.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach(function (s) { navObserver.observe(s); });

  /* ----------------------------------------------------------
     4. ON-SCROLL REVEAL ANIMATIONS
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  if (REDUCED) {
    // Show everything immediately
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // small stagger for groups entering together
          setTimeout(function () { entry.target.classList.add("is-visible"); }, i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------
     5. ANIMATED COUNT-UP STATS
  ---------------------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1500;

    if (REDUCED) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { countObserver.observe(c); });

  /* ----------------------------------------------------------
     6. HERO TYPING EFFECT (cycling roles)
  ---------------------------------------------------------- */
  const typedEl = document.getElementById("typed");
  const phrases = ["SDET", "Automation Architect", "API & Mobile Testing", "CI/CD"];

  if (typedEl) {
    if (REDUCED) {
      typedEl.textContent = phrases[0];
    } else {
      let pIndex = 0, cIndex = 0, deleting = false;
      function type() {
        const current = phrases[pIndex];
        typedEl.textContent = current.slice(0, cIndex);
        let delay = deleting ? 45 : 90;

        if (!deleting && cIndex === current.length) {
          delay = 1400;            // pause at full word
          deleting = true;
        } else if (deleting && cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          delay = 350;
        } else {
          cIndex += deleting ? -1 : 1;
        }
        setTimeout(type, delay);
      }
      type();
    }
  }

  /* ----------------------------------------------------------
     7. TERMINAL "BOOT" ANIMATION (reveal lines one by one)
  ---------------------------------------------------------- */
  const terminal = document.getElementById("terminal");
  if (terminal && !REDUCED) {
    html.classList.add("anim-on"); // CSS hides lines until .shown is added
    const lines = Array.from(terminal.querySelectorAll(".term__line"));
    let started = false;

    function bootTerminal() {
      if (started) return;
      started = true;
      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add("shown"); }, 350 + i * 420);
      });
    }
    // Start when the terminal scrolls into view (it's above the fold, so this fires on load)
    const termObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { bootTerminal(); obs.disconnect(); }
      });
    }, { threshold: 0.3 });
    termObserver.observe(terminal);
  }

  /* ----------------------------------------------------------
     8. BACK-TO-TOP BUTTON
  ---------------------------------------------------------- */
  const toTop = document.getElementById("toTop");
  function toggleToTop() {
    toTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
  });

  /* ----------------------------------------------------------
     9. FOOTER YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     10. CONTACT FORM (Formspree) with graceful fallback
  ---------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form__status";

      // Basic validation
      if (!form.checkValidity()) {
        status.textContent = "// please fill in all fields correctly";
        status.classList.add("is-err");
        return;
      }

      const action = form.getAttribute("action") || "";
      // If the Formspree endpoint hasn't been set yet, guide the owner instead of failing.
      if (action.indexOf("your-form-id") !== -1) {
        status.textContent = "// add your Formspree endpoint in index.html to enable sending";
        status.classList.add("is-err");
        return;
      }

      status.textContent = "// sending…";
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent = "✓ Message sent — thanks, I'll be in touch!";
            status.classList.add("is-ok");
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch(function () {
          status.textContent = "// something went wrong — email amold329@gmail.com instead";
          status.classList.add("is-err");
        });
    });
  }
})();
