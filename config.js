// Configuration for Cash Reconciliation System
const CONFIG = {
  GOOGLE_SCRIPT_URL: '/.netlify/functions/gas',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  HEARTBEAT_INTERVAL: 15000,
  POLLING_INTERVAL: 5000
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
console.log('Config loaded:', CONFIG);
