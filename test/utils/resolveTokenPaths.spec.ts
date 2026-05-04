import { describe, it, expect, vi } from 'vitest'
import { resolveTokenPaths } from '../../src/utils'
import { resolve } from 'path'

describe('resolveTokenPaths', () => {
  it('should resolve both project and module paths correctly', () => {
    const rootDir = '/project/root'
    const tokenOption = 'my-tokens.json'
    const resolver = {
      resolve: vi.fn((path) => `/module/path/${path}`)
    }

    const result = resolveTokenPaths(rootDir, resolver, tokenOption)

    expect(result.projectPath).toBe(resolve(rootDir, 'app/assets/styles/tokens', tokenOption))
    expect(result.modulePath).toBe(`/module/path/${tokenOption}`)
    expect(resolver.resolve).toHaveBeenCalledWith(tokenOption)
  })
})
