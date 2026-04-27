import { describe, it, expect } from 'vitest'
import processedAttrs, { customAttributes } from '../../runtime/shared/utils/processedAttrs'

describe('processedAttrs utility', () => {
  it('returns an empty object when given an empty object', () => {
    expect(processedAttrs({})).toEqual({})
  })

  it('passes through standard HTML attributes as-is', () => {
    const input = { id: 'test-id', name: 'test-name', type: 'text' }
    expect(processedAttrs(input)).toEqual(input)
  })

  it('prefixes custom attributes with data-', () => {
    // 'full' and 'size' are in customAttributes
    const input = { full: true, size: 'large' }
    const expected = { 'data-full': true, 'data-size': 'large' }
    expect(processedAttrs(input)).toEqual(expected)
  })

  it('strips native Vue fallthrough attributes (class and style)', () => {
    const input = { class: 'btn', style: 'color: red', id: 'my-btn' }
    const expected = { id: 'my-btn' }
    expect(processedAttrs(input)).toEqual(expected)
  })

  it('skips attributes with strictly false values', () => {
    const input = { 'data-active': false, disabled: false, id: 'btn' }
    const expected = { id: 'btn' }
    expect(processedAttrs(input)).toEqual(expected)
  })

  it('preserves other falsy values (0, empty string, null, undefined)', () => {
    const input = {
      count: 0,
      label: '',
      meta: null,
      extra: undefined
    }
    expect(processedAttrs(input)).toEqual(input)
  })

  it('passes through attributes already starting with data-', () => {
    const input = { 'data-v-1234': '', 'data-custom': 'val' }
    expect(processedAttrs(input)).toEqual(input)
  })

  it('does not double-prefix custom attributes that already have data- prefix', () => {
    // 'full' is in customAttributes
    const input = { 'data-full': true }
    expect(processedAttrs(input)).toEqual(input)
  })

  it('handles a mix of standard, custom, and special attributes', () => {
    const input = {
      id: 'my-id',
      class: 'my-class',
      full: true,
      'data-custom': 'foo',
      active: false
    }
    const expected = {
      id: 'my-id',
      'data-full': true,
      'data-custom': 'foo'
    }
    expect(processedAttrs(input)).toEqual(expected)
  })
})
