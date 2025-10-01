// config.js
const CONFIG = {
  GOOGLE_SCRIPT_URL: '/.netlify/functions/gas',   // ← use the Netlify function
  HEARTBEAT_INTERVAL: 15000,
  POLLING_INTERVAL: 5000,
  USER_ID: localStorage.getItem('userId') || generateUserId()
};
