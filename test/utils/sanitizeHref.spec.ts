import { describe, it, expect } from 'vitest'
import { sanitizeHref } from '../../runtime/shared/utils/sanitizeHref'

describe('sanitizeHref', () => {
  it('allows safe http URLs', () => {
    expect(sanitizeHref('http://example.com')).toBe('http://example.com')
  })

  it('allows safe https URLs', () => {
    expect(sanitizeHref('https://example.com')).toBe('https://example.com')
  })

  it('allows relative paths', () => {
    expect(sanitizeHref('/path/to/page')).toBe('/path/to/page')
    expect(sanitizeHref('./path')).toBe('./path')
    expect(sanitizeHref('../path')).toBe('../path')
  })

  it('allows hash links', () => {
    expect(sanitizeHref('#section')).toBe('#section')
  })

  it('blocks javascript: URIs', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBe('about:blank')
  })

  it('blocks case-insensitive javascript: URIs', () => {
    expect(sanitizeHref('javaScript:alert(1)')).toBe('about:blank')
    expect(sanitizeHref('JAVASCRIPT:alert(1)')).toBe('about:blank')
  })

  it('blocks javascript: URIs with leading/trailing whitespace', () => {
    expect(sanitizeHref(' javascript:alert(1)')).toBe('about:blank')
    expect(sanitizeHref('javascript:alert(1) ')).toBe('about:blank')
    expect(sanitizeHref('\tjavascript:alert(1)\n')).toBe('about:blank')
  })

  it('blocks javascript: URIs with bypass attempts using control characters', () => {
    // Some browsers ignore \r, \n, \t in protocols
    expect(sanitizeHref('java\nscript:alert(1)')).toBe('about:blank')
    expect(sanitizeHref('java\rscript:alert(1)')).toBe('about:blank')
    expect(sanitizeHref('java\tscript:alert(1)')).toBe('about:blank')
  })

  it('handles undefined and empty strings', () => {
    expect(sanitizeHref(undefined)).toBe(undefined)
    expect(sanitizeHref('')).toBe('')
  })
})
