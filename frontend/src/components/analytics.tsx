"use client";

import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a product event to Google Analytics, if it is installed. */
export function trackEvent(event: string, params: Record<string, string | number> = {}) {
  if (typeof window !== "undefined") window.gtag?.("event", event, params);
}

/** Google Analytics 4. Nothing loads until NEXT_PUBLIC_GA_ID is set. */
export function Analytics({ gaId }: { gaId?: string }) {
  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
