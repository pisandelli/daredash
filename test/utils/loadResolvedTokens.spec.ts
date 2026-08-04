import { describe, it, expect, vi } from 'vitest'
import { mkdtemp, mkdir, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { loadResolvedTokens } from '../../src/utils/loadResolvedTokens'

describe('loadResolvedTokens', () => {
  it('merges custom project tokens over the default theme tokens', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'daredash-tokens-'))
    const defaultDir = join(rootDir, 'module-default')
    const customFile = join(rootDir, 'app/assets/tokens/custom-theme.tokens.json')

    await mkdir(defaultDir, { recursive: true })
    await mkdir(join(rootDir, 'app/assets/tokens'), { recursive: true })

    await writeFile(join(defaultDir, 'index.json'), JSON.stringify({
      color: {
        primary: { $value: '#111111' }
      },
      button: {
        'border-radius': { $value: '4px' },
        padding: { $value: '12px' }
      }
    }))

    await writeFile(customFile, JSON.stringify({
      button: {
        'border-radius': { $value: '999px' }
      }
    }))

    const result = await loadResolvedTokens(
      {
        options: {
          rootDir
        }
      } as any,
      {
        resolve: vi.fn((path) => join(rootDir, 'module-fallback', path))
      } as any,
      {
        tokenOption: './app/assets/tokens/custom-theme.tokens.json',
        defaultTokensPath: defaultDir
      }
    )

    expect(result.sourcePath).toBe(customFile)
    expect(result.mergedWithDefaults).toBe(true)
    expect(result.tokens.button['border-radius'].$value).toBe('999px')
    expect(result.tokens.button.padding.$value).toBe('12px')
    expect(result.tokens.color.primary.$value).toBe('#111111')
  })
})
