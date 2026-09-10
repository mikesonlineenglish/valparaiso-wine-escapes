/**
 * Formats a CLP amount unambiguously for display — always shows the currency code
 * (never a bare "$", which an English-speaking traveller would misread as USD) and
 * uses the locale's thousands separator with no decimal places (CLP has none).
 *
 * Single shared implementation so every price on the site renders the same way —
 * pass a different `locale` (e.g. "ru") to get that locale's formatting from the
 * same helper, with no second implementation to keep in sync.
 */
export function formatPrice(amount: number, locale: string = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}
