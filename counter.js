/*  Universal Visitor Counter  |  valeriamera.com
    Counts one “visit” per browser session, no matter how many pages are viewed.
    Optional page‑level tracking runs in the background.                     */

(() => {
  /* ----------  Configuration  ---------- */
  const SITE_KEY   = 'valeriamera.com';   // CountAPI namespace
  const MAIN_KEY   = 'unique-visits';     // global counter name
  const API_BASE   = 'https://api.countapi.xyz';

  const TRACK_PAGES = true;               // flip to false to disable page stats

  /* ----------  Session flags  ---------- */
  // ── One hit per whole site visit (sessionStorage is shared across pages
  //    in the same browser tab/window, but resets when all tabs are closed).
  const SITE_SESSION_FLAG = 'vnm-site-visited';

  function pageFlag() {
    // unique but URL‑safe key like 'page-about-me'
    const cleanPath = location.pathname
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/^-+|-+$/g, '') || 'home';
    return `vnm-page-${cleanPath}-visited`;
  }

  /* ----------  CountAPI helpers ---------- */
  async function hit(namespace, key) {
    const r = await fetch(`${API_BASE}/hit/${namespace}/${key}`);
    if (!r.ok) throw new Error(`CountAPI responded ${r.status}`);
    const json = await r.json();
    return json.value;
  }

  async function get(namespace, key) {
    const r = await fetch(`${API_BASE}/get/${namespace}/${key}`);
    if (!r.ok) throw new Error(`CountAPI responded ${r.status}`);
    const json = await r.json();
    return json.value;
  }

  /* ----------  UI helpers ---------- */
  const $num = () => document.getElementById('counterNumber');

  function show(count) {
    const el = $num();
    if (el) el.textContent = count.toLocaleString();
  }

  function animate(from, to, ms = 1200) {
    const el = $num();
    if (!el) return;

    const start = performance.now();
    const delta = to - from;

    function step(t) {
      const p = Math.min((t - start) / ms, 1);        // progress 0‑1
      const eased = 1 - Math.pow(1 - p, 4);           // ease‑out quart
      el.textContent = Math.floor(from + delta * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ----------  Main flow ---------- */
  async function init() {
    show('…');                                        // loading state

    let current;
    const firstVisit = !sessionStorage.getItem(SITE_SESSION_FLAG);

    try {
      if (firstVisit) {
        current = await hit(SITE_KEY, MAIN_KEY);      // bump global counter
        sessionStorage.setItem(SITE_SESSION_FLAG, '1');
      } else {
        current = await get(SITE_KEY, MAIN_KEY);      // just fetch
      }

      // Background page‑level hit
      if (TRACK_PAGES && !sessionStorage.getItem(pageFlag())) {
        hit(SITE_KEY, pageFlag());                    // fire‑and‑forget
        sessionStorage.setItem(pageFlag(), '1');
      }

      const start = Math.max(0, current - Math.floor(Math.random() * 5 + 1));
      animate(start, current);

    } catch (e) {
      console.error('Visitor counter:', e);
      // graceful fallback: rough estimate since 2 Jul 2025 at 10 visits/day
      const days = Math.floor((Date.now() - Date.UTC(2025, 6, 2)) / 8.64e7);
      show((days * 10).toLocaleString());
    }
  }

  /* ----------  Kick off when DOM is ready ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ----------  Optional helper for your console ---------- */
  window.getSiteStats = async () => {
    const total = await get(SITE_KEY, MAIN_KEY);
    console.log('Total unique visits:', total);

    if (TRACK_PAGES) {
      const r = await get(SITE_KEY, pageFlag());
      console.log(`Current page (“${pageFlag()}”) hits:`, r);
    }
  };
})();
