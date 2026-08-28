// Same-origin proxy for the GoatCounter visitor counter.
// Lets the footer counter load from our own domain, so tracker/ad blockers
// (which may block goatcounter.com directly) can't hide it.
exports.handler = async () => {
  try {
    const r = await fetch("https://sunnyside.goatcounter.com/counter/TOTAL.json");
    if (!r.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "upstream " + r.status }) };
    }
    const data = await r.json();
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        // cache for 5 min so we don't hammer GoatCounter on every page load
        "cache-control": "public, max-age=300",
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: "fetch failed" }) };
  }
};
