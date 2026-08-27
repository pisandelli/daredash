import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function getModulePath(relativePath: string): string {
  const rootDir = process.cwd().endsWith('modules/daredash')
    ? process.cwd()
    : resolve(process.cwd(), 'modules/daredash')
  return resolve(rootDir, relativePath)
}

function relativeLuminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)?.map((channel) => Number.parseInt(channel, 16) / 255)
  if (!channels || channels.length !== 3) throw new Error(`Expected an opaque hex color, received ${hex}`)

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('Accessible theme profile', () => {
  const themesPath = getModulePath('runtime/assets/styles/tokens/default-theme/themes.json')
  const themes = JSON.parse(readFileSync(themesPath, 'utf8'))
  const accessible = themes.accessible
  const surface = accessible.color.bg.surface.$value

  it('keeps audited text and semantic colors at WCAG AA contrast on its opaque surface', () => {
    const textColors = [
      accessible.color.text.default.$value,
      accessible.color.text.muted.$value,
      accessible.color.primary.$value,
      accessible.color.success.$value,
      accessible.color.warning.$value,
      accessible.color.danger.$value,
      accessible.color.info.$value
    ]

    for (const color of textColors) {
      expect(contrastRatio(color, surface)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps its focus treatments distinguishable against the opaque surface', () => {
    const focusColors = [
      '#1d4ed8',
      '#1f6b37',
      '#9a4d00',
      '#c81e1e',
      '#0369a1'
    ]

    for (const color of focusColors) {
      expect(contrastRatio(color, surface)).toBeGreaterThanOrEqual(3)
    }
  })
})
