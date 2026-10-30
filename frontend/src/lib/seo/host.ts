// Kept free of project imports: next.config.ts reads this file, and the config loader can't resolve the "@/" alias.
const DEFAULT_URL = "https://rightjob.net";

/**
 * The public address of the site, made safe: a bare domain gets https://, paths and trailing slashes are
 * dropped, and anything that isn't a URL falls back to the real domain, so a typo in the environment can't
 * break the build or point canonical tags at the wrong place.
 */
function normalize(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return DEFAULT_URL;
  try {
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).origin;
  } catch {
    return DEFAULT_URL;
  }
}

export const SITE_URL = normalize(process.env.NEXT_PUBLIC_APP_URL);
export const SITE_HOST = new URL(SITE_URL).hostname;
