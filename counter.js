/*  Universal Visitor Counter - Fixed Version  |  valeriamera.com
    Multiple fallback options for reliable counting                      */

(() => {
  /* ----------  Configuration  ---------- */
  const SITE_KEY   = 'valeriamera.com';
  const MAIN_KEY   = 'unique-visits';
  
  // Multiple API options (try in order)
  const API_OPTIONS = [
    'https://api.countapi.xyz',
    'https://api.counterapi.dev/v1',  // Alternative service
    // Add more as needed
  ];
  
  const TRACK_PAGES = true;
  const FALLBACK_START_DATE = new Date('2025-07-02'); // Your site launch date
  const FALLBACK_DAILY_VISITS = 10; // Estimated daily visits for fallback

  /* ----------  Session flags  ---------- */
  const SITE_SESSION_FLAG = 'vnm-site-visited';
  const LOCAL_COUNT_KEY = 'vnm-local-count'; // Local storage backup

  function pageFlag() {
    const cleanPath = location.pathname
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/^-+|-+$/g, '') || 'home';
    return `vnm-page-${cleanPath}-visited`;
  }

  /* ----------  API helpers with fallback  ---------- */
  async function tryAPI(endpoint, method = 'GET') {
    const errors = [];
    
    for (const apiBase of API_OPTIONS) {
      try {
        console.log(`Trying API: ${apiBase}`);
        
        let url, options = { method };
        
        if (apiBase.includes('countapi.xyz')) {
          // CountAPI.xyz format
          url = `${apiBase}/${endpoint}`;
        } else if (apiBase.includes('counterapi.dev')) {
          // CounterAPI.dev format (different structure)
          const parts = endpoint.split('/');
          if (parts[0] === 'hit') {
            url = `${apiBase}/${parts[1]}/${parts[2]}/increment`;
            options.method = 'POST';
          } else if (parts[0] === 'get') {
            url = `${apiBase}/${parts[1]}/${parts[2]}`;
          }
        }
        
        const response = await fetch(url, {
          ...options,
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API success with ${apiBase}:`, data);
        
        // Normalize response format
        return { 
          value: data.value || data.count || data.total || 0,
          success: true 
        };
        
      } catch (error) {
        console.warn(`❌ API ${apiBase} failed:`, error.message);
        errors.push(`${apiBase}: ${error.message}`);
        continue;
      }
    }
    
    // All APIs failed
    throw new Error(`All APIs failed: ${errors.join('; ')}`);
  }

  async function hit(namespace, key) {
    try {
      const result = await tryAPI(`hit/${namespace}/${key}`);
      
      // Store successful count locally as backup
      localStorage.setItem(LOCAL_COUNT_KEY, result.value.toString());
      localStorage.setItem(`${LOCAL_COUNT_KEY}-timestamp`, Date.now().toString());
      
      return result.value;
    } catch (error) {
      console.error('All hit APIs failed:', error.message);
      return await fallbackHit();
    }
  }

  async function get(namespace, key) {
    try {
      const result = await tryAPI(`get/${namespace}/${key}`);
      return result.value;
    } catch (error) {
      console.error('All get APIs failed:', error.message);
      return fallbackGet();
    }
  }

  /* ----------  Fallback methods  ---------- */
  function fallbackHit() {
    // Increment local counter
    const currentLocal = parseInt(localStorage.getItem(LOCAL_COUNT_KEY) || '0');
    const newCount = currentLocal + 1;
    localStorage.setItem(LOCAL_COUNT_KEY, newCount.toString());
    localStorage.setItem(`${LOCAL_COUNT_KEY}-timestamp`, Date.now().toString());
    
    console.log(`📱 Using local fallback counter: ${newCount}`);
    return newCount;
  }

  function fallbackGet() {
    // Try local storage first
    const localCount = parseInt(localStorage.getItem(LOCAL_COUNT_KEY) || '0');
    const localTimestamp = parseInt(localStorage.getItem(`${LOCAL_COUNT_KEY}-timestamp`) || '0');
    
    if (localCount > 0 && localTimestamp > 0) {
      console.log(`📱 Using local stored count: ${localCount}`);
      return localCount;
    }
    
    // Calculate rough estimate based on days since launch
    const now = new Date();
    const daysSinceLaunch = Math.floor((now - FALLBACK_START_DATE) / (1000 * 60 * 60 * 24));
    const estimatedCount = Math.max(1, daysSinceLaunch * FALLBACK_DAILY_VISITS);
    
    console.log(`📊 Using estimated count: ${estimatedCount} (${daysSinceLaunch} days × ${FALLBACK_DAILY_VISITS} visits/day)`);
    return estimatedCount;
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

  /* ----------  Enhanced init with better error handling  ---------- */
  async function init() {
    console.log('🚀 Initializing visitor counter...');
    
    // Check if counter element exists
    if (!$num()) {
      console.error('❌ Counter element #counterNumber not found in DOM');
      return;
    }
    
    show('…');

    let current;
    const firstVisit = !sessionStorage.getItem(SITE_SESSION_FLAG);
    console.log(`👤 ${firstVisit ? 'First' : 'Repeat'} visit this session`);

    try {
      if (firstVisit) {
        console.log('📈 Attempting to increment counter...');
        current = await hit(SITE_KEY, MAIN_KEY);
        sessionStorage.setItem(SITE_SESSION_FLAG, '1');
        console.log(`✅ Counter incremented to: ${current}`);
      } else {
        console.log('📊 Fetching current count...');
        current = await get(SITE_KEY, MAIN_KEY);
        console.log(`✅ Current count: ${current}`);
      }

      // Background page-level tracking
      if (TRACK_PAGES && !sessionStorage.getItem(pageFlag())) {
        console.log('📄 Tracking page visit...');
        hit(SITE_KEY, pageFlag()).catch(e => 
          console.warn('Page tracking failed:', e.message)
        );
        sessionStorage.setItem(pageFlag(), '1');
      }

      // Animate from slightly lower number for visual effect
      const start = Math.max(0, current - Math.floor(Math.random() * 5 + 1));
      animate(start, current);

    } catch (error) {
      console.error('💥 Counter initialization failed:', error);
      
      // Ultimate fallback
      const fallbackCount = fallbackGet();
      show(fallbackCount);
      console.log(`🔄 Using fallback count: ${fallbackCount}`);
    }
  }

  /* ----------  Debug helpers  ---------- */
  window.getSiteStats = async () => {
    console.log('📊 Site Statistics Debug');
    console.log('========================');
    
    try {
      const total = await get(SITE_KEY, MAIN_KEY);
      console.log('✅ Total unique visits:', total);
    } catch (error) {
      console.log('❌ API Error:', error.message);
      console.log('📱 Local count:', localStorage.getItem(LOCAL_COUNT_KEY) || 'Not set');
    }

    if (TRACK_PAGES) {
      try {
        const pageCount = await get(SITE_KEY, pageFlag());
        console.log(`✅ Current page ("${pageFlag()}") hits:`, pageCount);
      } catch (error) {
        console.log('❌ Page stats error:', error.message);
      }
    }
    
    // Session info
    console.log('Session flags:', {
      siteVisited: !!sessionStorage.getItem(SITE_SESSION_FLAG),
      pageVisited: !!sessionStorage.getItem(pageFlag())
    });
  };

  window.resetCounter = () => {
    sessionStorage.clear();
    localStorage.removeItem(LOCAL_COUNT_KEY);
    localStorage.removeItem(`${LOCAL_COUNT_KEY}-timestamp`);
    console.log('🔄 Counter reset - refresh page to test as new visitor');
  };

  window.forceCounterUpdate = () => {
    init();
  };

  /* ----------  Initialize  ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('🔧 Counter script loaded. Debug commands: getSiteStats(), resetCounter(), forceCounterUpdate()');
})();