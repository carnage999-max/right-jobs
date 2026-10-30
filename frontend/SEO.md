# SEO implementation notes

Implements the first phases of the Right Job SEO Engineering Specification (foundation and jobs engine, plus category pages).

## Public URLs

| Page | URL | Index policy |
|---|---|---|
| Job | `/jobs/{title}-{city}-{st}/{job-id}` | Index while the job is open. A closed job stays reachable, is `noindex`, and has no JobPosting data |
| Old job link | `/jobs/{job-id}` | 308 to the canonical job URL (a wrong slug also redirects) |
| Category | `/jobs/{category-slug}` | Index only when it meets `SEO_INDEX_MIN_JOBS` and `SEO_INDEX_MIN_EMPLOYERS` |
| All jobs | `/jobs` | Index; any `/jobs?...` view is `noindex` and canonical to `/jobs` |

The job id is authoritative. The slug is derived from the title and location and can change.

## Structured data

`src/lib/seo/job-schema.ts` builds `JobPosting` for open jobs only. It is **withheld** (and the reason logged as `[seo] JobPosting withheld`) when Google's required fields can't be filled honestly: no readable country for an on-site job, no eligible country for a remote job, a very short description or title. Salary is emitted only when the range has a `$` sign, so the currency is never guessed.

## Sitemaps

`/sitemap.xml` is an index of `/sitemap-content-1.xml`, `/sitemap-occupations-1.xml` and `/sitemap-jobs-{n}.xml` (5,000 jobs each). Closed jobs, thin categories and `noindex` pages are never listed; a job's `lastmod` is its last real change.

## Known gaps (need data-model work)

- `Job.location` is free text ("Portland, ME" or "Lagos, Nigeria"). City, state and occupation x city pages need structured location fields first.
- No `validThrough`, no job status beyond `isActive` (filled / expired / paused are not separate), no company table, no salary numbers (the range is text).
- Indexing API notifications, salary pages, company pages, comparison pages and content/market reports are not built.
