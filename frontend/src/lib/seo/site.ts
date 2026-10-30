import { countries } from "@/lib/locations";

import { SITE_HOST, SITE_URL } from "@/lib/seo/host";

export { SITE_HOST, SITE_URL };
export const SITE_NAME = "Right Job";
export const SITE_TAGLINE = "Find the right job for you.";

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

/** Lowercase ASCII with hyphens: the only form a slug is ever stored or compared in. */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The job categories offered when posting a job. The slug is the public URL for the category page. */
export const JOB_CATEGORIES = [
  { value: "Engineering", label: "Engineering & Tech" },
  { value: "Design", label: "Design & Creative" },
  { value: "Product", label: "Product Management" },
  { value: "Marketing", label: "Marketing & Comms" },
  { value: "Management", label: "Business Management" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Sales", label: "Sales & Business Dev" },
  { value: "Finance", label: "Finance & Accounting" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Operations", label: "Operations" },
  { value: "Legal", label: "Legal & Compliance" },
  { value: "Healthcare", label: "Healthcare & Medical" },
  { value: "Education", label: "Education & Training" },
  { value: "Hospitality", label: "Hospitality & Tourism" },
  { value: "Construction", label: "Construction & Trades" },
  { value: "Logistics", label: "Logistics & Transport" },
  { value: "Arts", label: "Arts & Entertainment" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Science", label: "Data & Life Science" },
].map((c) => ({ ...c, slug: slugify(c.label) }));

export const categoryBySlug = (slug: string) => JOB_CATEGORIES.find((c) => c.slug === slug);
export const categoryByValue = (value: string) => JOB_CATEGORIES.find((c) => c.value === value);

const US_STATES = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));

export type ParsedLocation = { city: string | null; region: string | null; country: string | null };

/**
 * Jobs store their place as free text: "Portland, ME" (from a ZIP lookup) or "Lagos, Nigeria" (city and country).
 * This reads that text into city, region and a two-letter country code. Anything it can't read stays null, and
 * the pages that need a country (structured data) simply aren't emitted for that job.
 */
export function parseLocation(location: string): ParsedLocation {
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { city: null, region: null, country: null };
  const last = parts[parts.length - 1];
  const byName = countries.find((c) => c.name.toLowerCase() === last.toLowerCase());
  if (parts.length >= 2 && byName) return { city: parts[0], region: parts.length >= 3 ? parts[1] : null, country: byName.code };
  if (parts.length >= 2 && /^[A-Za-z]{2}$/.test(last) && US_STATES.has(last.toUpperCase())) return { city: parts[0], region: last.toUpperCase(), country: "US" };
  if (parts.length === 1 && byName) return { city: null, region: null, country: byName.code };
  return { city: parts[0], region: null, country: null };
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type JobPathInput = { id: string; title: string; location: string };

/** The one canonical path for a job: /jobs/{title}-{city}-{st}/{id}. The id is authoritative; the slug may change. */
export function jobSlug(job: Pick<JobPathInput, "title" | "location">): string {
  const loc = parseLocation(job.location);
  const slug = slugify([job.title, loc.city ?? "", loc.region ?? ""].filter(Boolean).join(" ")).slice(0, 90).replace(/-+$/, "");
  return slug || "job";
}

export const jobPath = (job: JobPathInput) => `/jobs/${jobSlug(job)}/${job.id}`;
