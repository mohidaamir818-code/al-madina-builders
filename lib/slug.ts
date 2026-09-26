/** Convert a title (and optional location) into a URL-safe slug. */
export function titleToSlug(title: string, location = "") {
  const base = `${title} ${location}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "property";
}

/** Ensure every slug in a list is unique by appending location words when needed. */
export function uniqueSlug(candidate: string, used: Set<string>, fallbackExtra = "listing") {
  let slug = candidate;
  let n = 2;
  while (used.has(slug)) {
    slug = `${candidate}-${fallbackExtra}${n > 2 ? `-${n}` : ""}`.replace(/-+/g, "-");
    n += 1;
  }
  used.add(slug);
  return slug;
}
