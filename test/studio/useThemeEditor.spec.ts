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
          defaultValue: '#0984e3',
          rawDefaultValue: '{color.primary.600}',
          referencePath: 'color.primary.600'
        },
        {
          path: 'button.success.color',
          label: 'Success Text',
          type: 'text',
          defaultValue: 'contrast-color(#ef4444)',
          rawDefaultValue: 'contrast-color({color.danger.500})',
          referencePath: 'color.danger.500'
        }
      ]
    }
  ]

  it('tracks changes and exposes scoped preview overrides for direct and dependent tokens', () => {
    const { hasChanges, previewStyle, previewCss, setLiteralValue } = useThemeEditor(tabs)

    expect(hasChanges.value).toBe(false)
    expect(Object.keys(previewStyle.value).length).toBe(0)
    expect(previewCss.value).toBe('')

    setLiteralValue('color.primary.600', '#000000')

    expect(hasChanges.value).toBe(true)
    expect(previewStyle.value['--dd-color-primary-600']).toBe('#000000')
    expect(previewStyle.value['--dd-button-base-color']).toBe('#000000')
    expect(previewCss.value).toContain('.dd-studio-root .dd-studio-preview-scope *')
    expect(previewCss.value).toContain('--dd-color-primary-600: #000000;')
    expect(previewCss.value).toContain('--dd-button-base-color: #000000;')
    expect(previewCss.value).not.toContain(':root')
  })

  it('exports delta tokens grouped by primitives/components', () => {
    const { setLiteralValue, setMode, exportTokensJson } = useThemeEditor(tabs)

    setLiteralValue('color.primary.600', '#101010')
    setMode('button.base-color', 'literal')
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
    expect(previewStyle.value['--dd-color-error-500']).toBe('#aa0000')

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

  it('prevents prototype pollution when exporting tokens', () => {
    const tabsWithPollution: StudioTabDefinition[] = [
      {
        id: 'hacker',
        label: 'Hacker',
        navigationKind: 'foundation',
        tokenGroup: 'primitives',
        preview: {} as any,
        fields: [
          {
            path: '__proto__.polluted',
            label: 'Polluted',
            type: 'color',
            defaultValue: 'yes'
          },
          {
            path: 'constructor.prototype.polluted',
            label: 'Polluted 2',
            type: 'color',
            defaultValue: 'yes'
          }
        ]
      }
    ]

    const { setLiteralValue, exportTokensJson } = useThemeEditor(tabsWithPollution)

    setLiteralValue('__proto__.polluted', 'hacked')
    expect(() => exportTokensJson()).toThrowError('Prototype pollution detected')
  })

  it('preserves embedded reference expressions in preview and export', () => {
    const { values, rawValueForPath, exportTokensJson, setReferencePath } = useThemeEditor(tabs)

    expect(values.value['button.success.color']).toBe('contrast-color(#ef4444)')
    expect(rawValueForPath('button.success.color')).toBe('contrast-color({color.danger.500})')

    setReferencePath('button.success.color', 'color.primary.600')

    expect(values.value['button.success.color']).toBe('contrast-color(#0984e3)')
    expect(rawValueForPath('button.success.color')).toBe('contrast-color({color.primary.600})')

    const parsed = JSON.parse(exportTokensJson())

    expect(parsed.components.button.success.color.$value).toBe('contrast-color({color.primary.600})')
  })

  it('keeps embedded reference expressions in reference mode when edited through a single input', () => {
    const { values, rawValueForPath, modes, setReferenceExpression } = useThemeEditor(tabs)

    setReferenceExpression('button.success.color', 'contrast-color({color.primary.600})')

    expect(modes.value['button.success.color']).toBe('reference')
    expect(values.value['button.success.color']).toBe('contrast-color(#0984e3)')
    expect(rawValueForPath('button.success.color')).toBe('contrast-color({color.primary.600})')
  })

  it('falls back to literal mode when the single expression input no longer matches the reference template', () => {
    const { values, modes, setReferenceExpression } = useThemeEditor(tabs)

    setReferenceExpression('button.success.color', 'color-mix(in srgb, {color.primary.600} 80%, white)')

    expect(modes.value['button.success.color']).toBe('literal')
    expect(values.value['button.success.color']).toBe('color-mix(in srgb, {color.primary.600} 80%, white)')
  })
})
