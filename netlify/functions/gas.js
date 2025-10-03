// netlify/functions/gas.js
export const handler = async (event) => {
  // CORS (harmless even on same-origin)
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  const GAS_URL =
    process.env.GAS_WEBAPP_URL ||
    'https://script.google.com/macros/s/AKfycby69Ngv7yflRCqkOOtRznWOtzcJDMLltSFGkdWMZmTyYYiYvBNZrIkmffXpcdQTrVqk/exec';

  try {
    // IMPORTANT: forward the body AS-IS and keep urlencoded content-type
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: event.body,
    });

    const text = await res.text(); // GAS returns JSON text
    return {
      statusCode: res.status,
      headers: { ...cors, 'content-type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ status: 'error', error: String(err) }),
    };
  }
};
