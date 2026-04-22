/**
 * Sanitizes a URL to prevent Cross-Site Scripting (XSS) attacks by blocking 'javascript:' URIs.
 *
 * @param href - The URL to sanitize.
 * @returns The sanitized URL or 'about:blank' if the URL is dangerous.
 */
export function sanitizeHref(href: string): string
export function sanitizeHref(href: string | undefined): string | undefined
export function sanitizeHref(href?: string): string | undefined {
  if (!href) return href

  // Remove whitespace and control characters that could be used to bypass 'javascript:' check
  const normalizedHref = href.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase()

  if (normalizedHref.startsWith('javascript:')) {
    return 'about:blank'
  }

  return href
}
