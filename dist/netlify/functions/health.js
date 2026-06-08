exports.handler = async function () {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const keyTail = hasKey ? process.env.ANTHROPIC_API_KEY.slice(-4) : null;
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      version: "v3-2026-06-08",
      keyConfigured: hasKey,
      keyEndsWith: keyTail,
      time: new Date().toISOString(),
    }),
  };
};
