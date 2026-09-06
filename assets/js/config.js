/* ============================================================
   valeriamera.com - everything shared by every page lives here.
   Change a page name, color, the footer text, or a link ONCE
   and every page picks it up.
   ============================================================ */
window.SITE = {
  title: 'Valeria Mera',
  url: 'https://valeriamera.com',
  author: 'Valeria Nicolette Mera',
  email: 'vnm58293@gmail.com',
  linkedin: 'https://www.linkedin.com/in/valeriamera/',
  instagram: 'https://www.instagram.com/valeriamera/',
  substack: 'https://valeriamera.substack.com/',

  // Google Analytics 4 measurement id
  gaId: 'G-EYFPGPTP0F',

  // Visitor counter (Abacus, https://abacus.jasoncameron.dev - free, no account needed)
  counterNamespace: 'valeriamera-com',

  // Footer
  footerHeading: 'Ready to Create Change Together?',
  footerText: "Whether you're looking to collaborate on climate policy, need creative content, or want to chat about making systems more human-centered, I'd love to connect.",
  disclaimer: 'Opinions expressed here are personal and not representative of the positions or policies of the EIF Program, Department of Energy, ORISE, or the U.S. Government',

  // Shared look (warm ivory background, warm near-black text)
  background: 'radial-gradient(ellipse at top left, #fdfaf4 0%, #f4eee2 40%, #ece4d6 75%)',
  colors: {
    cream: '#faf6ee',
    cream100: '#fcf9f3',
    cream200: '#f1ebe0',
    text: '#191612',
    textMuted: '#3a2e26',
    textLight: '#7a6f64',
    navText: '#2d2d2d',
  },
  fonts: {
    display: ['Marion', 'Playfair Display', 'serif'],
    body: ['Inter', 'Helvetica Neue', 'sans-serif'],
    google: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@500;600&display=swap',
  },

  /* One entry per page. The ORDER here is the order of the navigation menu.
       key     - short id. Used as <html data-page="exp"> on the page and as the
                 Tailwind color name, so text-exp / bg-exp / border-exp all work.
       label   - name shown in the menu
       url     - the html file
       color   - the page's accent (also --accent inside that page, --c-<key> everywhere)
       light / dark - lighter and darker shades of the accent
       favicon - tab icon and the little logo top-left in the nav
       emoji   - shown in the visitor counter badge
       nav     - false keeps a page out of the menu (e.g. the Paris guide)          */
  pages: [
    { key: 'home',      label: 'Home',        url: 'index.html',      color: '#ae2c78', light: '#c85a9a', dark: '#7d1f56', emoji: '🎨', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmindex.png' },
    { key: 'exp',       label: 'Experience',  url: 'work.html',       color: '#1f5b46', light: '#3a6b52', dark: '#143d2f', emoji: '🌱', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmexperience.png' },
    { key: 'story',     label: 'Writing',     url: 'writing.html',    color: '#2b48a0', light: '#5d6a8a', dark: '#1f2a48', emoji: '✍️', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmcontact.png' },
    { key: 'portfolio', label: 'Portfolio',   url: 'portfolio.html',  color: '#d9552d', light: '#e07a5a', dark: '#9c4f2b', emoji: '🦋', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmportfolio.png' },
    { key: 'world',     label: 'Background',  url: 'background.html', color: '#3a6b52', light: '#4aa876', dark: '#24483a', emoji: '🌎', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmworld.png' },
    { key: 'contact',   label: 'Connect',     url: 'contact.html',    color: '#d9574c', light: '#e88a80', dark: '#b52f2e', emoji: '🪩', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmabout.png' },
    { key: 'paris',     label: 'Paris Guide', url: 'paris.html',      color: '#1f2a48', light: '#5d6a8a', dark: '#141b30', emoji: '🥐', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmcontact.png', nav: false },
  ],
};
