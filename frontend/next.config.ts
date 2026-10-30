import type { NextConfig } from "next";
import { SITE_HOST } from "./src/lib/seo/host";

/** One canonical host: if the site address uses www., the bare domain redirects to it, and the other way round. */
const alternateHost = SITE_HOST.startsWith("www.") ? SITE_HOST.slice(4) : `www.${SITE_HOST}`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    if (SITE_HOST === "localhost") return [];
    return [{ source: "/:path*", has: [{ type: "host", value: alternateHost }], destination: `https://${SITE_HOST}/:path*`, permanent: true }];
  },
  async rewrites() {
    // /sitemap-jobs-2.xml is served by /sitemaps/jobs/2, so the child sitemaps keep the names the SEO spec uses.
    return [{ source: "/sitemap-:kind(content|occupations|jobs)-:n(\\d+).xml", destination: "/sitemaps/:kind/:n" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
