/*  Universal Visitor Counter with CORS Proxy  |  valeriamera.com
    Uses CORS proxy to bypass blocking issues                             */

(() => {
  /* ----------  Configuration  ---------- */
  const SITE_KEY   = 'valeriamera.com';
  const MAIN_KEY   = 'unique-visits';
  
  // CORS proxies to try (in order)
  const CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://proxy.cors.sh/',
  ];
  
  const COUNTAPI_BASE = 'https://api.countapi.xyz';
  const TRACK_PAGES = true;

  /* ----------  Session flags  ---------- */
  const SITE_SESSION_FLAG = 'vnm-site-visited';

  function pageFlag() {
    const cleanPath = location.pathname
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/^-+|-+$/g, '') || 'home';
    return `vnm-page-${cleanPath}-visited`;
  }

  /* ----------  CORS Proxy API helpers  ---------- */
  async function tryWithCorsProxy(endpoint) {
    const url = `${COUNTAPI_BASE}/${endpoint}`;
    const errors = [];
    
    // First try direct (in case CORS is now working)
    try {
      console.log(`Trying direct: ${url}`);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct API call successful:', data);
        return data;
      }
    } catch (error) {
      console.log('❌ Direct call failed, trying proxies...');
      errors.push(`Direct: ${error.message}`);
    }
    
    // Try each CORS proxy
    for (const proxy of CORS_PROXIES) {
      try {
        const proxiedUrl = `${proxy}${encodeURIComponent(url)}`;
        console.log(`Trying proxy: ${proxy}`);
        
        const response = await fetch(proxiedUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ Proxy success with ${proxy}:`, data);
        return data;
        
      } catch (error) {
        console.warn(`❌ Proxy ${proxy} failed:`, error.message);
        errors.push(`${proxy}: ${error.message}`);
        continue;
      }
    }
    
    throw new Error(`All methods failed: ${errors.join('; ')}`);
  }

  async function hit(namespace, key) {
    const data = await tryWithCorsProxy(`hit/${namespace}/${key}`);
    return data.value;
  }

  async function get(namespace, key) {
    const data = await tryWithCorsProxy(`get/${namespace}/${key}`);
    return data.value;
  }

  /* ----------  UI helpers  ---------- */
  const $num = () => document.getElementById('counterNumber');

  function show(count) {
    const el = $num();
    if (el) {
      if (typeof count === 'string') {
        el.textContent = count;
      } else {
        el.textContent = count.toLocaleString();
      }
    }
  }

  function animate(from, to, ms = 1200) {
    const el = $num();
    if (!el) return;

    const start = performance.now();
    const delta = to - from;

    function step(t) {
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(from + delta * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ----------  Main flow  ---------- */
  async function init() {
    console.log('🚀 Initializing universal visitor counter...');
    
    if (!$num()) {
      console.error('❌ Counter element #counterNumber not found');
      return;
    }
    
    show('…');

    let current;
    const firstVisit = !sessionStorage.getItem(SITE_SESSION_FLAG);
    console.log(`👤 ${firstVisit ? 'First' : 'Repeat'} visit this session`);

    try {
      if (firstVisit) {
        console.log('📈 Attempting to increment universal counter...');
        current = await hit(SITE_KEY, MAIN_KEY);
        sessionStorage.setItem(SITE_SESSION_FLAG, '1');
        console.log(`✅ Universal counter incremented to: ${current}`);
      } else {
        console.log('📊 Fetching current universal count...');
        current = await get(SITE_KEY, MAIN_KEY);
        console.log(`✅ Current universal count: ${current}`);
      }

      // Background page tracking
      if (TRACK_PAGES && !sessionStorage.getItem(pageFlag())) {
        console.log('📄 Tracking page visit...');
        hit(SITE_KEY, pageFlag()).catch(e => 
          console.warn('Page tracking failed:', e.message)
        );
        sessionStorage.setItem(pageFlag(), '1');
      }

      const start = Math.max(0, current - Math.floor(Math.random() * 5 + 1));
      animate(start, current);

    } catch (error) {
      console.error('💥 All counter methods failed:', error);
      show('Error loading counter');
    }
  }

  /* ----------  Debug helpers  ---------- */
  window.getSiteStats = async () => {
    console.log('📊 Universal Site Statistics');
    console.log('============================');
    
    try {
      const total = await get(SITE_KEY, MAIN_KEY);
      console.log('✅ Total unique visits (universal):', total);
      
      if (TRACK_PAGES) {
        const pageCount = await get(SITE_KEY, pageFlag());
        console.log(`✅ Current page hits:`, pageCount);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error.message);
    }
  };

  window.resetCounter = () => {
    sessionStorage.clear();
    console.log('🔄 Session cleared - refresh to test as new visitor');
  };

  /* ----------  Initialize  ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('🌍 Universal counter script loaded');
})();