import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JobListItem } from "@/components/jobs/job-list-item";
import { JsonLd } from "@/components/json-ld";
import prisma from "@/lib/prisma";
import { groupIndexable } from "@/lib/seo/index-policy";
import { getCategoryStats, listCardSelect } from "@/lib/seo/jobs-data";
import { absoluteUrl, categoryBySlug, jobPath, SITE_NAME, UUID_RE } from "@/lib/seo/site";

type Props = { params: Promise<{ slug: string }> };

async function loadCategory(slug: string) {
  const category = categoryBySlug(slug);
  if (!category) return null;
  const jobs = await prisma.job.findMany({ where: { isActive: true, category: category.value }, orderBy: { createdAt: "desc" }, take: 60, select: listCardSelect });
  const employers = new Map<string, number>();
  const places = new Map<string, number>();
  for (const j of jobs) {
    employers.set(j.companyName, (employers.get(j.companyName) ?? 0) + 1);
    places.set(j.location, (places.get(j.location) ?? 0) + 1);
  }
  const top = (m: Map<string, number>, n: number) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  return { category, jobs, employers: employers.size, topEmployers: top(employers, 8), topPlaces: top(places, 8) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (UUID_RE.test(slug)) return { robots: { index: false, follow: true } };
  const data = await loadCategory(slug);
  if (!data) return { title: "Not found", robots: { index: false, follow: false } };
  const { category, jobs } = data;
  const indexable = groupIndexable({ jobs: jobs.length, employers: data.employers });
  const title = `${category.label} Jobs | ${SITE_NAME}`;
  const description = jobs.length
    ? `Browse ${jobs.length} open ${category.label.toLowerCase()} jobs from ${data.employers} employer${data.employers === 1 ? "" : "s"} on ${SITE_NAME}. See pay, location and how to apply.`
    : `${category.label} jobs on ${SITE_NAME}. New openings are posted here as employers add them.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/jobs/${category.slug}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { type: "website", url: `/jobs/${category.slug}`, title, description, siteName: SITE_NAME },
  };
}

export default async function JobsSlugPage({ params }: Props) {
  const { slug } = await params;

  // Old links used /jobs/{id}. They go permanently to the canonical job URL.
  if (UUID_RE.test(slug)) {
    const job = await prisma.job.findUnique({ where: { id: slug }, select: { id: true, title: true, location: true } });
    if (!job) notFound();
    permanentRedirect(jobPath(job));
  }

  const data = await loadCategory(slug);
  if (!data) notFound();
  const { category, jobs, topEmployers, topPlaces } = data;
  const stats = await getCategoryStats();

  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Jobs", item: absoluteUrl("/jobs") },
          { "@type": "ListItem", position: 3, name: `${category.label} Jobs`, item: absoluteUrl(`/jobs/${category.slug}`) },
        ],
      },
      ...(jobs.length ? [{ "@type": "ItemList", name: `${category.label} Jobs`, itemListElement: jobs.map((j, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(jobPath(j)), name: j.title })) }] : []),
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      <JsonLd data={json} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-slate-500">
        <Link href="/" className="hover:text-primary">Home</Link> / <Link href="/jobs" className="hover:text-primary">Jobs</Link> / <span className="text-slate-900">{category.label}</span>
      </nav>

      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">{category.label} Jobs</h1>
        <p className="max-w-3xl text-lg font-medium text-slate-600">
          {jobs.length > 0
            ? `${jobs.length} open ${category.label.toLowerCase()} job${jobs.length === 1 ? "" : "s"} from ${data.employers} employer${data.employers === 1 ? "" : "s"}, newest first.`
            : `There are no open ${category.label.toLowerCase()} jobs right now. New openings appear here as employers post them.`}
        </p>
      </header>

      {jobs.length > 0 ? (
        <ul className="grid gap-4" aria-label={`${category.label} jobs`}>
          {jobs.map((job) => (
            <JobListItem key={job.id} job={job} />
          ))}
        </ul>
      ) : (
        <p>
          <Link href="/jobs" className="font-bold text-primary hover:underline">Browse all jobs</Link>
        </p>
      )}

      {topEmployers.length > 0 || topPlaces.length > 0 ? (
        <section className="grid gap-8 md:grid-cols-2" aria-label="Who is hiring and where">
          {topEmployers.length > 0 ? (
            <div>
              <h2 className="mb-3 text-xl font-black tracking-tight">Employers hiring</h2>
              <ul className="space-y-1 font-semibold text-slate-600">
                {topEmployers.map(([name, count]) => (
                  <li key={name}>{name} <span className="text-slate-400">({count})</span></li>
                ))}
              </ul>
            </div>
          ) : null}
          {topPlaces.length > 0 ? (
            <div>
              <h2 className="mb-3 text-xl font-black tracking-tight">Where the jobs are</h2>
              <ul className="space-y-1 font-semibold text-slate-600">
                {topPlaces.map(([name, count]) => (
                  <li key={name}>{name} <span className="text-slate-400">({count})</span></li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {stats.filter((s) => s.slug !== category.slug).length > 0 ? (
        <section aria-labelledby="more-cats">
          <h2 id="more-cats" className="mb-3 text-xl font-black tracking-tight">Other kinds of work</h2>
          <ul className="flex flex-wrap gap-3">
            {stats
              .filter((s) => s.slug !== category.slug)
              .map((s) => (
                <li key={s.slug}>
                  <Link href={`/jobs/${s.slug}`} className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary hover:text-primary">
                    {s.label} <span className="ml-2 text-slate-400">{s.jobs}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
