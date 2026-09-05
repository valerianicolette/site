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

  // Shared look
  background: 'radial-gradient(ellipse at top left, #fefdfb 0%, #f5f1eb 40%, #f0ece6 75%)',
  colors: {
    cream: '#f7f7f4',
    cream100: '#f9f9f6',
    cream200: '#f0f0eb',
    text: '#22221f',
    textMuted: '#4a4a45',
    navText: '#262626',
  },
  fonts: {
    display: ['Playfair Display', 'serif'],
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
    { key: 'home',      label: 'Home',        url: 'index.html',      color: '#ad1457', light: '#cd729a', dark: '#dc2626', emoji: '🎨', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmindex.png' },
    { key: 'exp',       label: 'Experience',  url: 'work.html',       color: '#2e7d32', light: '#6ca46f', dark: '#246428', emoji: '🌱', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmexperience.png' },
    { key: 'story',     label: 'Writing',     url: 'writing.html',    color: '#1976d2', light: '#5d9fdf', dark: '#135ea8', emoji: '✍️', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmcontact.png' },
    { key: 'portfolio', label: 'Portfolio',   url: 'portfolio.html',  color: '#6B2060', light: '#9B4F8E', dark: '#4A1542', emoji: '🦋', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmportfolio.png' },
    { key: 'world',     label: 'Background',  url: 'background.html', color: '#4caf50', light: '#81c784', dark: '#357a38', emoji: '🌎', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmworld.png' },
    { key: 'contact',   label: 'Connect',     url: 'contact.html',    color: '#E0295D', light: '#f06292', dark: '#b71c4a', emoji: '🪩', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmabout.png' },
    { key: 'paris',     label: 'Paris Guide', url: 'paris.html',      color: '#004aac', light: '#0257c5', dark: '#053c85', emoji: '🥐', favicon: 'https://valerianicolette.wordpress.com/wp-content/uploads/2025/07/vmcontact.png', nav: false },
  ],
};
