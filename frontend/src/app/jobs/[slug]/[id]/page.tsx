import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Building2, CheckCircle2, ChevronRight, Clock, DollarSign, FileText, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobActions } from "@/components/jobs/job-actions";
import { JobListItem } from "@/components/jobs/job-list-item";
import { JsonLd } from "@/components/json-ld";
import { buildJobPosting } from "@/lib/seo/job-schema";
import { categoryLabel, getPublicJob, getRelatedJobs, signedLogoUrl } from "@/lib/seo/jobs-data";
import { absoluteUrl, categoryByValue, jobPath, parseLocation, SITE_NAME, UUID_RE } from "@/lib/seo/site";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string; id: string }> };

const excerpt = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return { title: "Job not found", robots: { index: false, follow: false } };
  const job = await getPublicJob(id);
  if (!job) return { title: "Job not found", robots: { index: false, follow: false } };

  const loc = parseLocation(job.location);
  const place = [loc.city, loc.region].filter(Boolean).join(", ");
  const path = jobPath(job);
  const title = `${job.title}${place ? ` Job in ${place}` : " Job"} | ${job.companyName} | ${SITE_NAME}`;
  const description = excerpt(`${job.title} at ${job.companyName}${place ? ` in ${place}` : ""}. ${job.salaryRange ? `${job.salaryRange} per ${job.salaryType.replace("LY", "").toLowerCase()}. ` : ""}${job.description}`, 158);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    // A job that has closed stays reachable for people who have the link, but it leaves search results.
    robots: job.isActive ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { type: "website", url: path, title, description, siteName: SITE_NAME },
    twitter: { card: "summary", title, description },
  };
}

export default async function JobPage({ params }: Props) {
  const { slug, id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const job = await getPublicJob(id);
  if (!job) notFound();

  // One entity, one URL: any other spelling of the slug goes permanently to the canonical path.
  const path = jobPath(job);
  if (`/jobs/${slug}/${id}` !== path) permanentRedirect(path);

  const [related, logo] = await Promise.all([job.isActive ? getRelatedJobs(job) : getRelatedJobs(job, 6), signedLogoUrl(job.companyLogoUrl)]);
  const category = categoryByValue(job.category);
  const verified = job.createdBy?.idVerification?.status === "VERIFIED";
  const posting = job.isActive ? buildJobPosting({ ...job, salaryRange: job.salaryRange }, path) : { schema: null, issues: [] };
  if (job.isActive && posting.issues.length) console.warn(`[seo] JobPosting withheld for ${job.id}: ${posting.issues.join("; ")}`);

  const crumbs = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Jobs", item: absoluteUrl("/jobs") },
    ...(category ? [{ name: `${category.label} Jobs`, item: absoluteUrl(`/jobs/${category.slug}`) }] : []),
    { name: job.title, item: absoluteUrl(path) },
  ];
  const paragraphs = job.description.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {posting.schema ? <JsonLd data={posting.schema} /> : null}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })) }} />

      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1 text-sm font-semibold text-slate-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <Link href="/jobs" className="hover:text-primary">Jobs</Link>
        {category ? (
          <>
            <ChevronRight className="h-4 w-4" aria-hidden />
            <Link href={`/jobs/${category.slug}`} className="hover:text-primary">{category.label}</Link>
          </>
        ) : null}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <article className="space-y-10">
          {!job.isActive ? (
            <p role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-900">
              This position is no longer accepting applications. Similar open jobs are listed below.
            </p>
          ) : null}

          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-none rounded-xl py-1.5 px-4 text-xs font-black tracking-widest uppercase">{job.type.replace("_", " ")}</Badge>
              {job.workMode !== "ONSITE" ? <Badge className="bg-slate-100 text-slate-700 border-none rounded-xl py-1.5 px-4 text-xs font-black tracking-widest uppercase">{job.workMode === "REMOTE" ? "Remote" : "Hybrid"}</Badge> : null}
              {verified ? (
                <Badge className="bg-green-500/10 text-green-600 border-none rounded-xl py-1.5 px-4 text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" aria-hidden /> Verified Employer
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="h-24 w-24 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt={`${job.companyName} logo`} width={96} height={96} className="h-full w-full object-cover" />
                ) : (
                  <div aria-hidden className="h-full w-full bg-primary/5 flex items-center justify-center text-primary font-black text-4xl">{job.companyName[0]}</div>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">{job.title}</h1>
                <p className="flex items-center gap-3 text-primary text-2xl font-black italic tracking-tight">
                  <Building2 className="h-6 w-6" aria-hidden /> {job.companyName}
                </p>
              </div>
            </div>

            <dl className="flex flex-wrap gap-x-8 gap-y-4 border-y border-slate-100 py-8">
              <div className="space-y-1">
                <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</dt>
                <dd className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-primary" aria-hidden /> {job.workMode === "REMOTE" ? `Remote (${job.location})` : job.location}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</dt>
                <dd className="flex items-center gap-2 font-bold text-slate-900">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                  {category ? <Link href={`/jobs/${category.slug}`} className="hover:underline">{category.label}</Link> : job.category}
                </dd>
              </div>
              {job.salaryRange ? (
                <div className="space-y-1">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salary</dt>
                  <dd className="flex items-center gap-2 font-bold text-slate-900">
                    <DollarSign className="h-4 w-4 text-primary" aria-hidden /> {job.salaryRange}
                    <span className="text-slate-400 font-medium">/ {job.salaryType.replace("LY", "").toLowerCase()}</span>
                  </dd>
                </div>
              ) : null}
              <div className="space-y-1">
                <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posted</dt>
                <dd className="flex items-center gap-2 font-bold text-slate-900"><Clock className="h-4 w-4 text-primary" aria-hidden /> <time dateTime={job.createdAt.toISOString()}>{formatDate(job.createdAt)}</time></dd>
              </div>
            </dl>
          </header>

          <section aria-labelledby="desc-h" className="space-y-6">
            <h2 id="desc-h" className="text-2xl font-black tracking-tight flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" aria-hidden /> Job Description
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-slate-600">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        </article>

        {job.isActive ? <JobActions jobId={job.id} title={job.title} companyName={job.companyName} /> : <aside />}
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-h" className="mt-16 space-y-6">
          <h2 id="related-h" className="text-2xl font-black tracking-tight">
            More {category ? categoryLabel(job.category) : ""} jobs
          </h2>
          <ul className="grid gap-4">
            {related.map((r) => (
              <JobListItem key={r.id} job={r} />
            ))}
          </ul>
          {category ? (
            <p>
              <Link href={`/jobs/${category.slug}`} className="font-bold text-primary hover:underline">
                See all {category.label} jobs
              </Link>
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
