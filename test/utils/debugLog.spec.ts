import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debugLog, modLabel } from '../../src/utils'

describe('debugLog', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env.NODE_ENV = originalEnv
  })

  it('should log message when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    debugLog('test message')
    expect(console.log).toHaveBeenCalledWith(`${modLabel} test message`, '')
  })

  it('should not log message when NODE_ENV is not development', () => {
    process.env.NODE_ENV = 'production'
    debugLog('test message')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('should use specified log type', () => {
    process.env.NODE_ENV = 'development'
    debugLog('warn message', 'warn')
    expect(console.warn).toHaveBeenCalledWith(`${modLabel} warn message`, '')

    debugLog('error message', 'error')
    expect(console.error).toHaveBeenCalledWith(`${modLabel} error message`, '')
  })

  it('should include data if provided', () => {
    process.env.NODE_ENV = 'development'
    const data = { foo: 'bar' }
    debugLog('message with data', 'log', data)
    expect(console.log).toHaveBeenCalledWith(`${modLabel} message with data`, data)
  })

  it('should fallback to console.log if specified type does not exist (though TypeScript should prevent this)', () => {
    process.env.NODE_ENV = 'development'
    // @ts-ignore
    debugLog('invalid type message', 'invalid')
    expect(console.log).toHaveBeenCalledWith(`${modLabel} invalid type message`, '')
  })
})
