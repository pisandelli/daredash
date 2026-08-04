import { describe, it, expect, vi } from 'vitest'
import { resolveTokenPaths } from '../../src/utils/resolveTokenPaths'
import { resolve } from 'path'

describe('resolveTokenPaths', () => {
  it('resolves root-relative project paths before the module fallback', () => {
    const rootDir = '/project/root'
    const tokenOption = './app/assets/tokens/my-tokens.json'
    const resolver = {
      resolve: vi.fn((path) => `/module/path/${path}`)
    }

    const result = resolveTokenPaths(rootDir, resolver, tokenOption)

    expect(result.projectPath).toBe(resolve(rootDir, tokenOption))
    expect(result.projectPaths).toEqual([
      resolve(rootDir, tokenOption),
      resolve(rootDir, 'app/assets/styles/tokens', tokenOption)
    ])
    expect(result.modulePath).toBe(`/module/path/${tokenOption}`)
    expect(resolver.resolve).toHaveBeenCalledWith(tokenOption)
  })

  it('keeps absolute project token paths untouched', () => {
    const rootDir = '/project/root'
    const tokenOption = '/project/root/app/assets/tokens/my-tokens.json'
    const resolver = {
      resolve: vi.fn((path) => `/module/path/${path}`)
    }

    const result = resolveTokenPaths(rootDir, resolver, tokenOption)

    expect(result.projectPath).toBe(tokenOption)
    expect(result.projectPaths).toEqual([tokenOption])
    expect(result.modulePath).toBe(`/module/path/${tokenOption}`)
  })
})
