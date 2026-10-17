import { BRAND_NAME, SITE_EMAIL } from "@/lib/site";

/**
 * Maintenance mode is ON unless `MAINTENANCE_MODE=off` is set. While it is on,
 * the middleware answers every page and API request with a 503 and this page,
 * sets no cookies of its own and tells the browser to drop the ones it holds.
 *
 * To bring the site back: set `MAINTENANCE_MODE=off` in Vercel and redeploy,
 * or flip the default below.
 */
export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE !== "off";
}

/** Seconds a client or crawler should wait before trying again. */
export const MAINTENANCE_RETRY_AFTER = 3600;

export const MAINTENANCE_HTML = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Wartungsarbeiten · ${BRAND_NAME}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    background: #0b0d12; color: #e6e8ee; padding: 16px; box-sizing: border-box; }
  main { max-width: 32rem; text-align: center; }
  h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
  p { margin: .25rem 0 1rem; line-height: 1.5; color: #a9afbd; }
  a { color: #8ab4ff; }
  hr { border: 0; border-top: 1px solid #262b36; margin: 1.5rem 0; }
</style>
</head>
<body>
<main>
  <h1>Wartungsarbeiten</h1>
  <p>Diese Website ist vorübergehend nicht erreichbar. Bitte versuchen Sie es später erneut.</p>
  <hr>
  <h1 lang="en">Under maintenance</h1>
  <p lang="en">This website is temporarily unavailable. Please check back later.</p>
  <p><a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>
</main>
</body>
</html>
`;
