export type StudioContrastStatus = 'aaa' | 'aa' | 'fail' | 'indeterminate'

export interface StudioContrastResult {
  ratio: number | null
  status: StudioContrastStatus
}

function parseColor(value: string): [number, number, number] | null {
  const hex = value.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1]
  if (hex) {
    const expanded = hex.length === 3 ? [...hex].map((channel) => `${channel}${channel}`).join('') : hex
    return [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16)) as [number, number, number]
  }

  const rgb = value.trim().match(/^rgb\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)\s*\)$/i)
  if (!rgb) return null
  return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
}

function luminance(color: [number, number, number]): number {
  const [red, green, blue] = color.map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function studioContrast(foreground: string, background: string): StudioContrastResult {
  const foregroundColor = parseColor(foreground)
  const backgroundColor = parseColor(background)
  if (!foregroundColor || !backgroundColor) return { ratio: null, status: 'indeterminate' }

  const [lighter, darker] = [luminance(foregroundColor), luminance(backgroundColor)].sort((a, b) => b - a)
  const ratio = (lighter + 0.05) / (darker + 0.05)
  return {
    ratio,
    status: ratio >= 7 ? 'aaa' : ratio >= 4.5 ? 'aa' : 'fail'
  }
}
