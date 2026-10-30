/**
 * When a generated page may be offered to search engines. Pages that fail still work for visitors; they are
 * marked noindex and kept out of the sitemaps. Change the thresholds here (or with the environment) and every
 * template follows, with no edits to the pages themselves.
 */
const num = (name: string, fallback: number) => {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const INDEX_MIN_JOBS = num("SEO_INDEX_MIN_JOBS", 3);
export const INDEX_MIN_EMPLOYERS = num("SEO_INDEX_MIN_EMPLOYERS", 2);

export function groupIndexable(stats: { jobs: number; employers: number }): boolean {
  return stats.jobs >= INDEX_MIN_JOBS && stats.employers >= INDEX_MIN_EMPLOYERS;
}
