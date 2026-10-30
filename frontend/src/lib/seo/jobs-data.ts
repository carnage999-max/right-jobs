import prisma from "@/lib/prisma";
import { getSignedDownloadUrl } from "@/lib/s3";
import { categoryByValue, JOB_CATEGORIES } from "@/lib/seo/site";

export const JOBS_PER_SITEMAP = 5000;

/** One job for its public page. Only what the page shows: no poster email, no phone number. */
export function getPublicJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      companyName: true,
      companyLogoUrl: true,
      officeImageUrl: true,
      location: true,
      workMode: true,
      type: true,
      category: true,
      description: true,
      salaryRange: true,
      salaryType: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      createdBy: { select: { idVerification: { select: { status: true } } } },
    },
  });
}

export type PublicJob = NonNullable<Awaited<ReturnType<typeof getPublicJob>>>;

export const listCardSelect = {
  id: true,
  title: true,
  companyName: true,
  location: true,
  type: true,
  workMode: true,
  category: true,
  salaryRange: true,
  salaryType: true,
  createdAt: true,
} as const;

export function getRelatedJobs(job: Pick<PublicJob, "id" | "category">, take = 6) {
  return prisma.job.findMany({ where: { isActive: true, category: job.category, id: { not: job.id } }, orderBy: { createdAt: "desc" }, take, select: listCardSelect });
}

/** Logos live in a private bucket, so the page gets a short-lived signed address. It is never put into structured data. */
export async function signedLogoUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  const key = url.split(".com/")[1];
  if (!key) return url;
  try {
    return await getSignedDownloadUrl(key);
  } catch {
    return null;
  }
}

export type CategoryStat = { value: string; label: string; slug: string; jobs: number; employers: number };

/** Active jobs and distinct employers for every category that has any. */
export async function getCategoryStats(): Promise<CategoryStat[]> {
  const pairs = await prisma.job.groupBy({ by: ["category", "companyName"], where: { isActive: true }, _count: { _all: true } });
  const byCategory = new Map<string, { jobs: number; employers: number }>();
  for (const p of pairs) {
    const cur = byCategory.get(p.category) ?? { jobs: 0, employers: 0 };
    cur.jobs += p._count._all;
    cur.employers += 1;
    byCategory.set(p.category, cur);
  }
  return JOB_CATEGORIES.filter((c) => byCategory.has(c.value)).map((c) => ({ ...c, ...byCategory.get(c.value)! }));
}

export const categoryLabel = (value: string) => categoryByValue(value)?.label ?? value;
