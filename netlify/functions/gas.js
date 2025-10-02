
// netlify/functions/gas.js
const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbwK1HgzVul54WtkboHV5OTr8Cqm-ZNeghvyLhsf1akxvsUdlao1UiZIM_BLJ-eiErwP3A/exec"; // replace if desired

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "OK" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: "Method Not Allowed" }),
    };
  }

  let raw = event.body || "";
  if (event.isBase64Encoded) raw = Buffer.from(raw, "base64").toString("utf8");

  let action, payload;
  try {
    const p = new URLSearchParams(raw);
    action = p.get("action") || "ping";
    const pr = p.get("payload");
    payload = pr ? JSON.parse(pr) : {};
  } catch {
    try {
      const j = JSON.parse(raw);
      action = j.action || "ping";
      payload = j.payload || {};
    } catch {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: false, error: "Bad request body" }),
      };
    }
  }

  const out = new URLSearchParams();
  out.append("action", action);
  out.append("payload", JSON.stringify(payload));

  try {
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: out.toString(),
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { success: false, error: "Non-JSON response from Apps Script", raw: text }; }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: String(err) }),
    };
  }
};
