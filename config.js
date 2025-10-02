// config.js
const CONFIG = {
  GOOGLE_SCRIPT_URL: '/.netlify/functions/gas', // use Netlify Function proxy
  HEARTBEAT_INTERVAL: 15000,
  POLLING_INTERVAL: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  USER_ID: localStorage.getItem('userId') || generateUserId()
};

function generateUserId() {
  const id = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  localStorage.setItem('userId', id);
  return id;
}
