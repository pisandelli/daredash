import { describe, it, expect, vi } from 'vitest'
import { useThemeEditor } from '../../runtime/composables/useThemeEditor'
import { tokenValue } from '../../runtime/studio/tokens'
import type { StudioTabDefinition } from '../../runtime/studio/types'

vi.mock('#app', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#app')>()

  return {
    ...actual,
    useRuntimeConfig: () => ({
      public: {
        daredash: {
          prefix: 'dd'
        }
      }
    })
  }
})

describe('useThemeEditor', () => {
  const tabs: StudioTabDefinition[] = [
    {
      id: 'base',
      label: 'Base',
      navigationKind: 'foundation',
      tokenGroup: 'primitives',
      preview: {} as any,
      fields: [
        {
          path: 'color.primary.600',
          label: 'Primary 600',
          type: 'color',
          defaultValue: '#0984e3'
        },
        {
          path: 'color.error.500',
          label: 'Error 500',
          type: 'color',
          defaultValue: '#ef4444',
          rawDefaultValue: '{color.danger.500}',
          referencePath: 'color.danger.500'
        },
        {
          path: 'color.danger.500',
          label: 'Danger 500',
          type: 'color',
          defaultValue: '#ef4444'
        }
      ]
    },
    {
      id: 'button',
      label: 'Button',
      navigationKind: 'component',
      tokenGroup: 'components',
      preview: {} as any,
      fields: [
        {
          path: 'button.base-color',
          label: 'Base Color',
          type: 'color',
          defaultValue: '#0984e3'
        }
      ]
    }
  ]

  it('tracks changes and exposes preview styles', () => {
    const { values, hasChanges, previewStyle, setLiteralValue } = useThemeEditor(tabs)

    expect(hasChanges.value).toBe(false)
    expect(Object.keys(previewStyle.value).length).toBe(0)

    setLiteralValue('color.primary.600', '#000000')

    expect(hasChanges.value).toBe(true)
    expect(previewStyle.value['--dd-color-primary-600']).toBe('#000000')
  })

  it('exports delta tokens grouped by primitives/components', () => {
    const { setLiteralValue, exportTokensJson } = useThemeEditor(tabs)

    setLiteralValue('color.primary.600', '#101010')
    setLiteralValue('button.base-color', '#202020')

    const parsed = JSON.parse(exportTokensJson())

    expect(parsed.primitives).toBeDefined()
    expect(parsed.components).toBeDefined()
    expect(parsed.primitives.color.primary['600'].$value).toBe('#101010')
    expect(parsed.components.button['base-color'].$value).toBe('#202020')
  })

  it('preserves reference exports and resolves preview values from linked tokens', () => {
    const { values, previewStyle, exportTokensJson, setLiteralValue } = useThemeEditor(tabs)

    setLiteralValue('color.danger.500', '#aa0000')

    expect(values.value['color.error.500']).toBe('#aa0000')
    expect(previewStyle.value['--dd-color-danger-500']).toBe('#aa0000')
    expect(previewStyle.value['--dd-color-error-500']).toBeUndefined()

    const parsed = JSON.parse(exportTokensJson())

    expect(parsed.primitives.color.danger['500'].$value).toBe('#aa0000')
    expect(parsed.primitives.color.error).toBeUndefined()
  })

  it('can switch a literal token to reference mode for export', () => {
    const { values, exportTokensJson, setMode, setReferencePath } = useThemeEditor(tabs)

    setMode('color.primary.600', 'reference')
    setReferencePath('color.primary.600', 'success.500')

    expect(values.value['color.primary.600']).toBe(tokenValue('color.success.500'))

    const parsed = JSON.parse(exportTokensJson())

    expect(parsed.primitives.color.primary['600'].$value).toBe('{color.success.500}')
  })
})
