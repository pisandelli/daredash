import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('default component tokens', () => {
  it('uses compact table padding defaults', () => {
    const tableTokensPath = resolve(
      process.cwd(),
      'runtime/assets/styles/tokens/default-theme/components/table.json'
    )

    const tableTokens = JSON.parse(readFileSync(tableTokensPath, 'utf8'))

    expect(tableTokens.header.padding.$value).toBe('{space.xs}')
    expect(tableTokens.cell.padding.$value).toBe('{space.xs}')
    expect(tableTokens.header['background-color'].$value).toBe('{color.secondary.200}')
    expect(tableTokens.header['text-transform'].$value).toBe('none')
  })

  it('keeps select field spacing aligned with input spacing', () => {
    const inputCssPath = resolve(
      process.cwd(),
      'runtime/assets/styles/components/Input.module.css'
    )
    const selectCssPath = resolve(
      process.cwd(),
      'runtime/assets/styles/components/Select.module.css'
    )
    const textareaCssPath = resolve(
      process.cwd(),
      'runtime/assets/styles/components/Textarea.module.css'
    )

    const inputCss = readFileSync(inputCssPath, 'utf8')
    const selectCss = readFileSync(selectCssPath, 'utf8')
    const textareaCss = readFileSync(textareaCssPath, 'utf8')

    expect(inputCss).toContain(".wrapper {\n  --local-label-font-size: v('input.label.font-size');")
    expect(inputCss).toContain('gap: 0.375rem;')
    expect(selectCss).toContain('gap: 0.375rem;')
    expect(selectCss).not.toContain("margin-block-end: v('space.xxs');")
    expect(selectCss).toContain("--local-label-font-size: v('select.label.font-size');")
    expect(selectCss).toContain("--local-label-font-weight: v('select.label.font-weight');")
    expect(selectCss).toContain("--local-label-color: v('select.label.color');")
    expect(textareaCss).toContain("--local-label-font-size: v('textarea.label.font-size');")
    expect(textareaCss).toContain("--local-label-font-weight: v('textarea.label.font-weight');")
    expect(textareaCss).toContain("--local-label-color: v('textarea.label.color');")
  })

  it('uses section-specific card padding tokens with shared fallback', () => {
    const cardTokensPath = resolve(
      process.cwd(),
      'runtime/assets/styles/tokens/default-theme/components/card.json'
    )
    const cardCssPath = resolve(
      process.cwd(),
      'runtime/assets/styles/components/Card.module.css'
    )

    const cardTokens = JSON.parse(readFileSync(cardTokensPath, 'utf8'))
    const cardCss = readFileSync(cardCssPath, 'utf8')

    expect(cardTokens.body.padding.$value).toBe('{card.padding}')
    expect(cardCss).toContain("--local-header-padding: v('card.header.padding', var(--local-padding));")
    expect(cardCss).toContain("--local-body-padding: v('card.body.padding', var(--local-padding));")
    expect(cardCss).toContain("--local-footer-padding: v('card.footer.padding', var(--local-padding));")
  })
})
