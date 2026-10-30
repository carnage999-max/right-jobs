import prisma from "@/lib/prisma";
import { groupIndexable } from "@/lib/seo/index-policy";
import { getCategoryStats, JOBS_PER_SITEMAP } from "@/lib/seo/jobs-data";
import { absoluteUrl, jobPath } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

type Entry = { path: string; lastmod?: Date };

function render(entries: Entry[]) {
  const body = entries
    .map((e) => `  <url><loc>${absoluteUrl(e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod.toISOString()}</lastmod>` : ""}</url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/** Reached as /sitemap-{kind}-{n}.xml (see the rewrite in next.config.ts). Only pages that are allowed in the index appear here. */
export async function GET(_req: Request, { params }: { params: Promise<{ kind: string; n: string }> }) {
  const { kind, n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 1) return new Response("Not found", { status: 404 });

  let entries: Entry[] = [];
  if (kind === "jobs") {
    // lastmod is the job's last real change (updatedAt), never the time the sitemap was built.
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * JOBS_PER_SITEMAP,
      take: JOBS_PER_SITEMAP,
      select: { id: true, title: true, location: true, updatedAt: true },
    });
    if (jobs.length === 0 && page > 1) return new Response("Not found", { status: 404 });
    entries = jobs.map((j) => ({ path: jobPath(j), lastmod: j.updatedAt }));
  } else if (kind === "occupations" && page === 1) {
    const stats = await getCategoryStats();
    entries = stats.filter((c) => groupIndexable(c)).map((c) => ({ path: `/jobs/${c.slug}` }));
  } else if (kind === "content" && page === 1) {
    entries = ["/", "/jobs", "/about", "/pricing", "/security", "/trust-safety", "/careers", "/contact", "/privacy", "/terms", "/cookies"].map((path) => ({ path }));
  } else {
    return new Response("Not found", { status: 404 });
  }

  return new Response(render(entries), { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
}
