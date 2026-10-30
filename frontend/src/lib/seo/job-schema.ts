import { absoluteUrl, parseLocation } from "@/lib/seo/site";

type JobForSchema = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  workMode: "ONSITE" | "HYBRID" | "REMOTE";
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  description: string;
  salaryRange: string | null;
  salaryType: "YEARLY" | "MONTHLY" | "WEEKLY" | "HOURLY";
  createdAt: Date;
};

const escapeHtml = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain text to the small HTML Google accepts in a description: paragraphs, with everything escaped. */
export function descriptionHtml(text: string): string {
  return text
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}

const EMPLOYMENT: Record<JobForSchema["type"], string> = { FULL_TIME: "FULL_TIME", PART_TIME: "PART_TIME", CONTRACT: "CONTRACTOR", INTERNSHIP: "INTERN" };
const UNIT: Record<JobForSchema["salaryType"], string> = { YEARLY: "YEAR", MONTHLY: "MONTH", WEEKLY: "WEEK", HOURLY: "HOUR" };

/** "$50,000 - $70,000", "$25/hr" or "$60k" to numbers. Only a range with a $ sign is read, so the currency is never guessed. */
export function parseSalary(range: string | null): { min: number; max: number } | null {
  if (!range || !range.includes("$")) return null;
  const nums = [...range.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(k)?/gi)].map((m) => Number(m[1].replace(/,/g, "")) * (m[2] ? 1000 : 1)).filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return null;
  return { min: Math.min(nums[0], nums[nums.length - 1]), max: Math.max(nums[0], nums[nums.length - 1]) };
}

export type JobPostingResult = { schema: Record<string, unknown> | null; issues: string[] };

/**
 * JobPosting structured data for one open job, or nothing. It is built only from what the visible page says, and
 * it is withheld (with the reasons) when Google's required fields can't be filled honestly, for example when the
 * job's country can't be read. Malformed markup is worse than none.
 */
export function buildJobPosting(job: JobForSchema, path: string): JobPostingResult {
  const issues: string[] = [];
  const loc = parseLocation(job.location);
  const remote = job.workMode === "REMOTE";

  if (job.title.trim().length < 3) issues.push("title is too short");
  if (job.description.trim().length < 30) issues.push("description is too short");
  if (!job.companyName.trim()) issues.push("hiring organization is missing");
  if (!loc.country) issues.push(remote ? "remote job has no eligible country" : "job location has no country");
  if (issues.length) return { schema: null, issues };

  const salary = parseSalary(job.salaryRange);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionHtml(job.description),
    datePosted: job.createdAt.toISOString(),
    employmentType: EMPLOYMENT[job.type],
    identifier: { "@type": "PropertyValue", name: job.companyName, value: job.id },
    hiringOrganization: { "@type": "Organization", name: job.companyName },
    url: absoluteUrl(path),
    ...(remote
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: loc.country } }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              ...(loc.city ? { addressLocality: loc.city } : {}),
              ...(loc.region ? { addressRegion: loc.region } : {}),
              addressCountry: loc.country,
            },
          },
        }),
    ...(salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: { "@type": "QuantitativeValue", ...(salary.min === salary.max ? { value: salary.min } : { minValue: salary.min, maxValue: salary.max }), unitText: UNIT[job.salaryType] },
          },
        }
      : {}),
  };
  return { schema, issues };
}
