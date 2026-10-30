import prisma from "@/lib/prisma";
import { groupIndexable } from "@/lib/seo/index-policy";
import { getCategoryStats, JOBS_PER_SITEMAP } from "@/lib/seo/jobs-data";
import { absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

/** The sitemap index. Each kind of page has its own child sitemaps, so one can be regenerated without the rest. */
export async function GET() {
  const [jobCount, categories] = await Promise.all([prisma.job.count({ where: { isActive: true } }), getCategoryStats()]);
  const children = ["content-1"];
  if (categories.some((c) => groupIndexable(c))) children.push("occupations-1");
  for (let n = 1; n <= Math.ceil(jobCount / JOBS_PER_SITEMAP); n++) children.push(`jobs-${n}`);
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children
    .map((c) => `  <sitemap><loc>${absoluteUrl(`/sitemap-${c}.xml`)}</loc><lastmod>${now}</lastmod></sitemap>`)
    .join("\n")}\n</sitemapindex>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
}
