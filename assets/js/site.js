/* Shared behaviour for every page: icons, scroll-in animations, mobile menu,
   copyright year, smooth anchor scrolling, and the visitor counter. */
(() => {
  'use strict';

  /* ---------- Mobile menu (the nav is inserted by layout.js) ---------- */
  function initMenu() {
    const menu = document.getElementById('mobileMenu');
    const burger = document.querySelector('.hamburger');

    function setMenu(open) {
      if (!menu || !burger) return;
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    }
    if (burger) burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
    if (menu) {
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
      document.addEventListener('click', (e) => {
        if (menu.classList.contains('open') && !e.target.closest('nav') && !e.target.closest('#mobileMenu')) setMenu(false);
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    }
    // Kept for any page content that still calls these inline
    window.toggleMobileMenu = () => setMenu(!menu.classList.contains('open'));
    window.closeMobileMenu = () => setMenu(false);
  }

  /* ---------- Visitor counter (Abacus: free counter API, no account) ---------- */
  function initCounter() {
    const badge = document.getElementById('visitorCounter');
    const num = document.getElementById('counterNumber');
    const ns = document.body.dataset.counterNs;
    if (!badge || !num || !ns) return;

    const base = `https://abacus.jasoncameron.dev`;
    const key = 'visits';
    let counted = false;
    try { counted = sessionStorage.getItem('vm-counted') === '1'; } catch (_) {}

    // Count each browser session once; other page views just read the total.
    const url = counted ? `${base}/get/${ns}/${key}` : `${base}/hit/${ns}/${key}`;
    fetch(url, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (typeof data.value !== 'number') throw new Error('bad response');
        num.textContent = data.value.toLocaleString();
        badge.hidden = false;
        if (!counted) {
          badge.classList.add('new-visit');
          try { sessionStorage.setItem('vm-counted', '1'); } catch (_) {}
        }
      })
      .catch(() => { badge.hidden = true; });
  }

  /* ---------- On load ---------- */
  window.addEventListener('DOMContentLoaded', () => {
    initMenu();
    if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade, .fade-up').forEach((el) => observer.observe(el));

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    initCounter();
  });
})();
