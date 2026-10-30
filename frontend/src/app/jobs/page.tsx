import type { Metadata } from "next";
import Link from "next/link";
import { JobsExplorer } from "@/components/jobs/jobs-explorer";
import { JsonLd } from "@/components/json-ld";
import prisma from "@/lib/prisma";
import { getCategoryStats, listCardSelect, signedLogoUrl } from "@/lib/seo/jobs-data";
import { absoluteUrl, jobPath, SITE_NAME } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Every filter or search combination is a different URL; they all point back to /jobs and stay out of the index.
  const filtered = Object.values(await searchParams).some((v) => v !== undefined && v !== "");
  return {
    title: { absolute: `Jobs: Find Open Positions Near You | ${SITE_NAME}` },
    description: `Browse open jobs from verified employers on ${SITE_NAME}. Filter by category and employment type, see pay and location, and apply in minutes.`,
    alternates: { canonical: "/jobs" },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function JobsPage() {
  const [rows, categories] = await Promise.all([
    prisma.job.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 40, select: { ...listCardSelect, companyLogoUrl: true } }),
    getCategoryStats(),
  ]);

  // Logos are in a private bucket, so each gets a short-lived signed address, as the jobs API does.
  const jobs = await Promise.all(rows.map(async (j) => ({ ...j, companyLogoUrl: await signedLogoUrl(j.companyLogoUrl) })));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Open jobs",
          itemListElement: jobs.map((j, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(jobPath(j)), name: j.title })),
        }}
      />
      <JobsExplorer initialJobs={JSON.parse(JSON.stringify(jobs))} />
      {categories.length > 0 ? (
        <nav aria-label="Browse by category" className="container mx-auto px-4 pb-16 max-w-7xl">
          <h2 className="mb-3 text-xl font-black tracking-tight">Browse jobs by category</h2>
          <ul className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/jobs/${c.slug}`} className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary hover:text-primary">
                  {c.label} <span className="ml-2 text-slate-400">{c.jobs}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
