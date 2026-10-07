/// <reference path="../../pb_data/types.d.ts" />

/**
 * Safely retrieve an environment variable from system OS,
 * or fallback by parsing backend/.env or .env file.
 */
function getEnv(key, fallback) {
  const val = $os.getenv(key);
  if (val && val.trim().length > 0) {
    return val.trim();
  }

  const candidatePaths = ["backend/.env", ".env"];
  for (let i = 0; i < candidatePaths.length; i++) {
    try {
      const raw = $os.readFile(candidatePaths[i]);
      if (raw) {
        const text = toString(raw);
        const lines = text.split("\n");
        for (let j = 0; j < lines.length; j++) {
          const line = lines[j].trim();
          if (!line || line.startsWith("#")) continue;
          const idx = line.indexOf("=");
          if (idx !== -1) {
            const k = line.substring(0, idx).trim();
            if (k === key) {
              let v = line.substring(idx + 1).trim();
              if (
                (v.startsWith('"') && v.endsWith('"')) ||
                (v.startsWith("'") && v.endsWith("'"))
              ) {
                v = v.slice(1, -1);
              }
              return v;
            }
          }
        }
      }
    } catch (_) {}
  }

  return fallback || "";
}

/**
 * Returns structured configuration for Mayar gateway and Kickserve Pro pricing.
 */
function getMayarConfig() {
  const apiKey = getEnv("MAYAR_API_KEY", "");
  const webhookToken = getEnv("MAYAR_WEBHOOK_TOKEN", "");
  let baseUrl = getEnv("MAYAR_BASE_URL", "https://api.mayar.io");
  baseUrl = baseUrl.replace(/\/hl\/v2\/?$/, "").replace(/\/+$/, "");

  const rawPrice = getEnv("KICKSERVE_PRO_PRICE", "499000");
  const price = parseInt(rawPrice, 10) || 499000;

  return {
    apiKey,
    webhookToken,
    baseUrl,
    price,
  };
}

module.exports = {
  getEnv,
  getMayarConfig,
};
