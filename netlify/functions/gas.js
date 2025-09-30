// netlify/functions/gas.js
// Proxies the browser request to Google Apps Script to avoid CORS.
export async function handler(event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby69Ngv7yflRCqkOOtRznWOtzcJDMLltSFGkdWMZmTyYYiYvBNZrIkmffXpcdQTrVqk/exec';

  try {
    let action = '';
    let payload = {};

    // Accept either form-encoded (from your helper) or JSON
    const ct = event.headers['content-type'] || '';
    if (ct.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body);
      action = params.get('action') || '';
      payload = JSON.parse(params.get('payload') || '{}');
    } else if (ct.includes('application/json')) {
      const body = JSON.parse(event.body || '{}');
      action = body.action || '';
      payload = body.payload || {};
    }

    // Always forward to GAS as form-POST (no preflight)
    const form = new URLSearchParams();
    form.append('action', action);
    form.append('payload', JSON.stringify(payload));

    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: form.toString(),
    });

    const text = await res.text(); // GAS returns JSON text
    return {
      statusCode: res.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ status: 'error', error: String(err) }),
    };
  }
}
