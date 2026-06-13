# Amol Dabholkar — Portfolio

A fast, fully static personal portfolio for **Amol Chandrakant Dabholkar** — Software Development Engineer in Test (SDET) & Automation Test Engineer. Built with plain **HTML, CSS, and vanilla JavaScript** — no frameworks, no build step — so it deploys straight to GitHub Pages.

## ✨ Features

- Single-page site with smooth-scrolling anchor navigation and active-section highlighting
- Dark theme by default with a **light/dark toggle** (remembers your choice)
- Animated **terminal hero** that "runs the test suite", plus a cycling typing effect
- **Count-up** achievement stats, on-scroll reveal animations, and micro-interactions
- Mobile-first responsive layout with a hamburger menu
- Accessible: semantic markup, skip link, keyboard focus styles, `prefers-reduced-motion` support
- SEO + Open Graph meta tags and an inline SVG favicon
- Optional contact form via [Formspree](https://formspree.io)

## 📁 Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `styles.css` | Design system, layout, themes, animations |
| `script.js` | Theme toggle, menu, animations, count-up, form |
| `Amol_Dabholkar_Resume_SDET.pdf` | **Add this yourself** — the "Download Résumé" buttons link to it |

## 🔧 Customize

Everything is commented so it's easy to edit:

1. **GitHub handle** — search the project for `amold329-del` and replace it (in `index.html`).
2. **Résumé** — drop `Amol_Dabholkar_Resume_SDET.pdf` into the repo root (exact filename).
3. **Contact form** — create a form at Formspree, copy your endpoint, and paste it into the `action="..."` of `#contactForm` in `index.html`. Until then the form shows a helpful note instead of sending.
4. **Social preview image (optional)** — add a 1200×630 `og-image.png` and uncomment the `og:image` tag in `<head>`.
5. **Content** — edit text directly in `index.html`. Colors and fonts live in the `:root` block at the top of `styles.css`.

## 🚀 Deploy to GitHub Pages

**Option A — user site (`https://<username>.github.io`):**
1. Create a public repo named exactly `amold329-del.github.io`.
2. Upload `index.html`, `styles.css`, `script.js`, and your résumé PDF to the repo root.
3. Visit `https://amold329-del.github.io` — live in a minute or two.

**Option B — project site (any repo name):**
1. Push these files to any public repo (e.g. `portfolio`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then **Save**.
5. Your site appears at `https://amold329-del.github.io/portfolio/`.

## 🧰 Tech

HTML5 · CSS3 (custom properties, grid, flexbox) · Vanilla JavaScript (IntersectionObserver, requestAnimationFrame) · Google Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono) · Font Awesome.

---

Built with HTML, CSS & JS.
