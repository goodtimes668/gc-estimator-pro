exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: "ANTHROPIC_API_KEY not configured on server." } }),
    };
  }

  // Surface payload size — Netlify caps function request bodies at 6MB.
  const sizeMB = (event.body ? Buffer.byteLength(event.body, "utf8") : 0) / (1024 * 1024);
  console.log(`[anthropic-proxy] incoming payload: ${sizeMB.toFixed(2)} MB`);
  if (sizeMB > 5.8) {
    return {
      statusCode: 413,
      body: JSON.stringify({
        error: {
          message: `Plan images too large (${sizeMB.toFixed(1)} MB). The server caps uploads at ~6 MB. Upload one smaller sheet, or the app will downscale further.`,
        },
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: { message: "Invalid JSON body" } }) };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 24000);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);
    const text = await response.text();
    console.log(`[anthropic-proxy] upstream status: ${response.status}`);
    if (!response.ok) {
      console.log(`[anthropic-proxy] upstream error body: ${text.slice(0, 500)}`);
    }

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    clearTimeout(timer);
    console.log(`[anthropic-proxy] caught error: ${err.name} - ${err.message}`);
    if (err.name === "AbortError") {
      return {
        statusCode: 504,
        body: JSON.stringify({
          error: { message: "Analysis took too long for the server limit. Try one smaller sheet." },
        }),
      };
    }
    return {
      statusCode: 502,
      body: JSON.stringify({ error: { message: err.message || "Upstream request failed" } }),
    };
  }
};
