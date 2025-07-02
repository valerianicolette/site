// Universal Website Counter - External File Version
// Save this as: counter.js (or visitor-counter.js)

(function() {
  // Configuration
  const SITE_KEY = 'valeriamera.com';
  const MAIN_COUNTER = 'total-visits'; // Fresh counter - starts at 0
  const API_BASE = 'https://api.countapi.xyz';
  
  // Optional: Track individual pages for your analytics (hidden from users)
  const TRACK_INDIVIDUAL_PAGES = true; // Set to false if you don't want page-specific tracking
  
  // Get current page identifier for optional individual tracking
  const getCurrentPageKey = () => {
    const path = window.location.pathname;
    // Clean up the path to create a valid key
    return path.replace(/[^a-zA-Z0-9]/g, '-').replace(/^-+|-+$/g, '') || 'home';
  };
  
  // Prevent multiple increments per session
  const SESSION_KEY = 'vnm-session-' + Date.now();
  const SITE_SESSION_KEY = 'vnm-site-visited';
  const hasVisitedSiteThisSession = sessionStorage.getItem(SITE_SESSION_KEY);
  
  async function incrementMainCounter() {
    try {
      const response = await fetch(`${API_BASE}/hit/${SITE_KEY}/${MAIN_COUNTER}`);
      const data = await response.json();
      
      if (data.value !== undefined) {
        return data.value;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Main counter API error:', error);
      throw error;
    }
  }
  
  async function getCurrentCount() {
    try {
      const response = await fetch(`${API_BASE}/get/${SITE_KEY}/${MAIN_COUNTER}`);
      const data = await response.json();
      
      if (data.value !== undefined) {
        return data.value;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Get counter API error:', error);
      throw error;
    }
  }
  
  async function trackPageVisit() {
    if (!TRACK_INDIVIDUAL_PAGES) return;
    
    try {
      const pageKey = getCurrentPageKey();
      const pageSessionKey = `vnm-page-${pageKey}-visited`;
      
      // Only track once per page per session
      if (!sessionStorage.getItem(pageSessionKey)) {
        await fetch(`${API_BASE}/hit/${SITE_KEY}/page-${pageKey}`);
        sessionStorage.setItem(pageSessionKey, 'true');
        
        // Optional: Log for your analytics (remove in production)
        console.log(`Page tracked: ${pageKey}`);
      }
    } catch (error) {
      console.error('Page tracking error:', error);
      // Don't let page tracking errors affect main counter
    }
  }
  
  async function getCounterValue() {
    try {
      let count;
      
      // Only increment main counter once per site visit session
      if (!hasVisitedSiteThisSession) {
        count = await incrementMainCounter();
        sessionStorage.setItem(SITE_SESSION_KEY, 'true');
        
        // Track individual page in background
        trackPageVisit();
      } else {
        // Just get current count without incrementing
        count = await getCurrentCount();
      }
      
      return count;
    } catch (error) {
      console.error('Counter error:', error);
      return getEstimatedCount();
    }
  }
  
  function getEstimatedCount() {
    // Fallback estimation
    const siteStartDate = new Date('2025-07-02'); // Today - fresh start
    const daysSinceLaunch = Math.floor((Date.now() - siteStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const estimatedDailyVisits = 10; // Conservative estimate for new counter
    return Math.max(0, daysSinceLaunch * estimatedDailyVisits);
  }
  
  function updateCounterDisplay(count) {
    const counterElement = document.getElementById('counterNumber');
    if (counterElement) {
      counterElement.textContent = count.toLocaleString();
    }
  }
  
  function showLoadingState() {
    const counterElement = document.getElementById('counterNumber');
    if (counterElement) {
      counterElement.textContent = '...';
    }
  }
  
  function animateCounter(start, end, duration = 1200) {
    const counterElement = document.getElementById('counterNumber');
    if (!counterElement) return;
    
    const startTime = performance.now();
    const difference = end - start;
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + difference * easeOutQuart);
      
      counterElement.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  function addVisualEffects(isNewVisit) {
    const counter = document.getElementById('visitorCounter');
    if (!counter) return;
    
    if (isNewVisit) {
      counter.classList.add('new-visit');
      setTimeout(() => {
        counter.classList.remove('new-visit');
      }, 800);
    }
    
    counter.classList.add('counter-loaded');
  }
  
  async function initializeCounter() {
    // Show loading state immediately
    showLoadingState();
    
    try {
      const isNewSiteVisit = !hasVisitedSiteThisSession;
      const count = await getCounterValue();
      
      // Animate from 0 or slightly lower number
      const startNumber = Math.max(0, count - Math.floor(Math.random() * 5 + 1));
      animateCounter(startNumber, count);
      
      // Visual effects
      setTimeout(() => {
        addVisualEffects(isNewSiteVisit);
      }, 600);
      
      // Debug info (remove in production)
      console.log(`Fresh counter - Site visits: ${count} ${isNewSiteVisit ? '(new visit)' : '(returning this session)'}`);
      
    } catch (error) {
      console.error('Failed to initialize counter:', error);
      updateCounterDisplay(getEstimatedCount());
    }
  }
  
  function initializeWithRetry(maxRetries = 3) {
    let attempts = 0;
    
    async function attempt() {
      try {
        await initializeCounter();
      } catch (error) {
        attempts++;
        if (attempts < maxRetries) {
          console.log(`Counter initialization failed, retrying... (${attempts}/${maxRetries})`);
          setTimeout(attempt, 1000 * attempts);
        } else {
          console.error('Counter initialization failed after all retries');
          updateCounterDisplay(getEstimatedCount());
        }
      }
    }
    
    attempt();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeWithRetry());
  } else {
    initializeWithRetry();
  }
  
  // Optional: Expose function to manually get page stats (for your analytics)
  window.getPageStats = async function() {
    if (!TRACK_INDIVIDUAL_PAGES) {
      console.log('Individual page tracking is disabled');
      return;
    }
    
    try {
      const pageKey = getCurrentPageKey();
      const response = await fetch(`${API_BASE}/get/${SITE_KEY}/page-${pageKey}`);
      const data = await response.json();
      console.log(`Page "${pageKey}" visits:`, data.value || 0);
      return data.value || 0;
    } catch (error) {
      console.error('Error getting page stats:', error);
      return 0;
    }
  };
  
  // Optional: Get all site stats (for your analytics dashboard)
  window.getSiteStats = async function() {
    try {
      const mainCount = await getCurrentCount();
      console.log('Total site visits:', mainCount);
      
      if (TRACK_INDIVIDUAL_PAGES) {
        console.log('Call getPageStats() to see individual page data');
      }
      
      return mainCount;
    } catch (error) {
      console.error('Error getting site stats:', error);
      return 0;
    }
  };
  
})();