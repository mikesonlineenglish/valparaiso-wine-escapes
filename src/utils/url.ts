/**
 * Normalizes an internal site path to the trailing-slash form required by
 * astro.config.mjs's `trailingSlash: "always"` (matches GitHub Pages' own behavior:
 * /path/index.html is served at /path/, with /path redirecting to it — a mismatch
 * costs an extra redirect on every internal link).
 *
 * Left untouched:
 *  - fragment-only links ("#experiences")
 *  - root-plus-fragment links ("/#experiences" — root already ends in "/")
 *  - external URLs (http://, https://, //, or any other URL scheme)
 *  - mailto: / tel: links
 *  - direct file paths with an extension ("/brochure.pdf", "/images/vineyard.jpg")
 *  - the root path itself ("/")
 *
 * Use this anywhere an href is built from data (nav config, tour cards, breadcrumbs,
 * footer links) rather than typed as a literal string, so trailing-slash correctness
 * can't be forgotten as new links/pages are added.
 */
export function normalizeHref(path: string): string {
  if (!path || path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }

  // Not a site-relative absolute path: protocol-relative ("//host/..."), or has a
  // URL scheme ("https:", "http:", etc.), or doesn't start with "/" at all.
  if (!path.startsWith("/") || path.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(path)) {
    return path;
  }

  if (path === "/") {
    return path;
  }

  const match = path.match(/^([^?#]*)([?#].*)?$/);
  const basePath = match ? match[1] : path;
  const suffix = match && match[2] ? match[2] : "";

  // Already trailing-slash correct (also covers "/#fragment", whose base is "/").
  if (basePath.endsWith("/")) {
    return path;
  }

  const lastSegment = basePath.slice(basePath.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) {
    // Direct file path (has an extension) — leave alone.
    return path;
  }

  return `${basePath}/${suffix}`;
}
