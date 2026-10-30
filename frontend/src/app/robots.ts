import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account, application and admin pages are for signed-in people, and /jobs?... pages are filtered views of /jobs.
        disallow: ["/admin", "/api/", "/auth/", "/app", "/applications", "/profile", "/verify-id", "/jobs/post", "/jobs?*", "/search"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
