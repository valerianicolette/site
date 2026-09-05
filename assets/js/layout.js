/* Builds the shared parts of every page from assets/js/config.js:
   Tailwind colors, CSS variables, fonts, favicon, analytics (right away, in <head>)
   and the nav + footer (inserted into <body> once the page has loaded).
   Edit the nav/footer markup here; edit names, colors and text in config.js. */
(() => {
  'use strict';
  const S = window.SITE;
  const html = document.documentElement;
  const key = html.dataset.page || 'home';
  const page = S.pages.find((p) => p.key === key) || S.pages[0];
  const home = S.pages.find((p) => p.key === 'home') || S.pages[0];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  /* ---------- Tailwind config (the CDN script must be loaded before this file) ---------- */
  const colors = {
    cream: { DEFAULT: S.colors.cream, 100: S.colors.cream100, 200: S.colors.cream200 },
    ink: { DEFAULT: S.colors.text, muted: S.colors.textMuted },
    index: { light: home.light, DEFAULT: home.color, dark: home.dark }, // alias kept for index.html
    accent: '#046ec3', // used on the portfolio page
    theme: { light: 'var(--accent-light)', DEFAULT: 'var(--accent)', dark: 'var(--accent-dark)' }, // current page's color
  };
  S.pages.forEach((p) => { colors[p.key] = { light: p.light, DEFAULT: p.color, dark: p.dark }; });
  if (window.tailwind) {
    window.tailwind.config = {
      theme: {
        extend: {
          fontFamily: { display: S.fonts.display, body: S.fonts.body },
          colors,
          backgroundImage: { hero: S.background },
        },
      },
    };
  }

  /* ---------- CSS variables ---------- */
  const st = html.style;
  st.setProperty('--accent', page.color);
  st.setProperty('--accent-light', page.light);
  st.setProperty('--accent-dark', page.dark);
  S.pages.forEach((p) => {
    st.setProperty(`--c-${p.key}`, p.color);
    st.setProperty(`--c-${p.key}-light`, p.light);
    st.setProperty(`--c-${p.key}-dark`, p.dark);
  });
  st.setProperty('--cream', S.colors.cream);
  st.setProperty('--text', S.colors.text);
  st.setProperty('--text-muted', S.colors.textMuted);
  st.setProperty('--nav-text', S.colors.navText);
  st.setProperty('--font-display', S.fonts.display.map((f) => `'${f}'`).join(', '));
  st.setProperty('--font-body', S.fonts.body.map((f) => `'${f}'`).join(', '));

  /* ---------- <head> extras: hover colors, fonts, favicon, icons, analytics ---------- */
  const hoverCss = S.pages.map((p) => `.text-${p.key}:hover{color:var(--c-${p.key})}`).join('\n');
  document.head.insertAdjacentHTML('beforeend', `
    <style id="page-colors">${hoverCss}</style>
    <link href="${esc(S.fonts.google)}" rel="stylesheet">
    <link rel="icon" href="${esc(page.favicon)}" type="image/png">`);
  // Scripts have to be created with createElement to actually run
  const addScript = (src, onload) => {
    const el = document.createElement('script');
    el.src = src; el.async = true; if (onload) el.onload = onload;
    document.head.appendChild(el);
  };
  addScript('https://unpkg.com/lucide@0.545.0/dist/umd/lucide.min.js', () => {
    if (document.readyState !== 'loading' && window.lucide) window.lucide.createIcons();
  });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(S.gaId)}`);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', S.gaId);

  /* ---------- Nav + mobile menu ---------- */
  const navLinks = (extra) => S.pages.filter((p) => p.nav !== false).map((p) =>
    `<a href="${esc(p.url)}" class="nav-link text-${p.key}"${p.key === page.key ? ' aria-current="page"' : ''}${extra}>${esc(p.label)}</a>`
  ).join('\n');

  const NAV = `
    <a href="#main" class="skip-link">Skip to content</a>
    <nav class="fixed top-0 left-0 w-full z-20 py-5 px-6 md:px-12 flex items-center justify-between bg-cream/60 backdrop-blur-md border-b border-cream-200" aria-label="Main">
      <a href="index.html" class="home-icon block w-12 h-12 hover:rotate-12 transition-all duration-300" aria-label="Home">
        <img src="${esc(page.favicon)}" alt="" width="48" height="48" class="object-cover">
      </a>
      <div class="hidden md:flex space-x-8 text-sm tracking-wide uppercase font-medium">
        ${navLinks('')}
      </div>
      <button type="button" class="md:hidden hamburger flex flex-col justify-center items-center w-6 h-6 space-y-1" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobileMenu">
        <span class="block w-5 h-0.5 bg-current"></span>
        <span class="block w-5 h-0.5 bg-current"></span>
        <span class="block w-5 h-0.5 bg-current"></span>
      </button>
    </nav>
    <div id="mobileMenu" class="mobile-menu fixed top-0 left-0 w-full h-screen bg-cream/95 backdrop-blur-md z-10 md:hidden">
      <div class="flex flex-col items-center justify-center h-full space-y-8 text-lg tracking-wide uppercase font-medium">
        ${navLinks('')}
      </div>
    </div>`;

  /* ---------- Footer ---------- */
  const k = page.key;
  const FOOTER = `
    <footer id="contact" class="py-24 bg-cream fade relative">
      <div class="max-w-4xl mx-auto text-center space-y-12 px-6 md:px-0">
        <div class="space-y-4">
          <h3 class="font-display text-2xl md:text-3xl">${esc(S.footerHeading)}</h3>
          <p class="text-ink-muted max-w-2xl mx-auto">${esc(S.footerText)}</p>
        </div>
        <div class="flex justify-center space-x-10">
          <a href="mailto:${esc(S.email)}" aria-label="Email" class="social-icon"><i data-lucide="mail"></i></a>
          <a href="${esc(S.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon"><i data-lucide="linkedin"></i></a>
          <a href="${esc(S.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon"><i data-lucide="instagram"></i></a>
          <a href="${esc(S.substack)}" target="_blank" rel="noopener noreferrer" aria-label="Substack" class="social-icon"><i data-lucide="newspaper"></i></a>
        </div>
        <p class="text-sm text-[#6d6d67]">Want to stay in the loop? Subscribe via Substack for updates.</p>
        <form action="${esc(S.substack)}api/v1/free?nojs=true" method="POST" target="_blank"
              class="max-w-lg mx-auto flex border border-${k} focus-within:ring-2 focus-within:ring-${k} rounded-lg overflow-hidden">
          <input type="hidden" name="first_url" value="${esc(S.substack)}">
          <input type="hidden" name="first_referrer" value="">
          <label for="footer-email" class="sr-only">Email address</label>
          <input id="footer-email" type="email" name="email" placeholder="Your email" autocomplete="email" required
                 class="flex-grow px-5 py-3 bg-transparent placeholder-[#706f6a] focus:outline-none min-w-0">
          <button type="submit" class="px-4 sm:px-6 py-3 bg-${k} text-white font-medium hover:bg-${k}/90 transition-colors flex items-center justify-center flex-shrink-0">Subscribe</button>
        </form>
        <div class="flex flex-col items-center justify-center w-full gap-2 text-sm text-[#6d6d67]">
          <p>© <span id="year"></span> ${esc(S.author)}</p>
          <span class="text-xs max-w-xl">Site designed and coded by yours truly.<br>${esc(S.disclaimer)}</span>
        </div>
      </div>
      <div class="visitor-counter" id="visitorCounter" hidden>
        <span class="counter-icon" aria-hidden="true">${page.emoji || ''}</span>
        <span>Visitors:</span>
        <span class="counter-number" id="counterNumber">…</span>
      </div>
    </footer>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', NAV);
    const main = document.getElementById('main');
    if (main) main.insertAdjacentHTML('afterend', FOOTER);
    else document.body.insertAdjacentHTML('beforeend', FOOTER);
    document.body.dataset.counterNs = S.counterNamespace;
  });
})();
