import Script from "next/script";

/**
 * DebugBear Real User Monitoring (Web Vitals). `afterInteractive` avoids blocking
 * LCP. Production requires explicit opt-in (`NEXT_PUBLIC_DEBUGBEAR_RUM_ENABLED=1`) so
 * third-party telemetry is a conscious deploy decision (GDPR / ePrivacy alignment).
 * Local/staging: set `NEXT_PUBLIC_DEBUGBEAR_RUM=1`. Disclose DebugBear in privacy policy.
 *
 * @see https://www.debugbear.com/docs/real-user-monitoring
 */
const BOOTSTRAP = `(function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/UkKOIydJAjmu.js";o.head.appendChild(scr);}})()`;

function envFlagTrue(value: string | undefined): boolean {
  const v = value?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function rumEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return envFlagTrue(process.env.NEXT_PUBLIC_DEBUGBEAR_RUM_ENABLED);
  }
  return envFlagTrue(process.env.NEXT_PUBLIC_DEBUGBEAR_RUM);
}

export function DebugBearRum() {
  if (!rumEnabled()) return null;

  return (
    <Script id="debugbear-rum-bootstrap" strategy="afterInteractive">
      {BOOTSTRAP}
    </Script>
  );
}
