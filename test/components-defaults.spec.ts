import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('default component tokens', () => {
  it('uses compact badge typography defaults', () => {
    const badgeTokensPath = resolve(
      process.cwd(),
      'runtime/assets/styles/tokens/default-theme/components/badge.json'
    )

    const badgeTokens = JSON.parse(readFileSync(badgeTokensPath, 'utf8'))

    expect(badgeTokens['font-size'].$value).toBe('{font-size.xs}')
    expect(badgeTokens.padding.inline.$value).toBe('{space.xs}')
  })

  it('uses a compact default submenu indent for menu items', () => {
    const menuTokensPath = resolve(
      process.cwd(),
      'runtime/assets/styles/tokens/default-theme/components/menu.json'
    )

    const menuTokens = JSON.parse(readFileSync(menuTokensPath, 'utf8'))

    expect(menuTokens.submenu['padding-inline-start'].$value).toBe('{space.xs}')
  })

  it('uses updated table header and cell defaults', () => {
    const tableTokensPath = resolve(
      process.cwd(),
      'runtime/assets/styles/tokens/default-theme/components/table.json'
    )

    const tableTokens = JSON.parse(readFileSync(tableTokensPath, 'utf8'))

    expect(tableTokens.header.color.$value).toBe('{color.darker-gray}')
    expect(tableTokens.header['background-color'].$value).toBe('{color.secondary.100}')
    expect(tableTokens.header['font-size'].$value).toBe('{font-size.sm}')
    expect(tableTokens.header.padding.$value).toBe('{space.sm}')
    expect(tableTokens.cell['font-size'].$value).toBe('{font-size.sm}')
    expect(tableTokens.cell.padding.$value).toBe('{space.sm}')
    expect(tableTokens['row-hover']['background-color'].$value).toBe('{color.primary.50}')
    expect(tableTokens.header['text-transform'].$value).toBe('none')
    expect(tableTokens.density.large.header['font-size'].$value).toBe('{font-size.base}')
    expect(tableTokens.density.large.header.padding.$value).toBe('{space.md}')
    expect(tableTokens.density.large.cell['font-size'].$value).toBe('{font-size.base}')
    expect(tableTokens.density.large.cell.padding.$value).toBe('{space.md}')
    expect(tableTokens.density.comfortable.header['font-size'].$value).toBe('{table.header.font-size}')
    expect(tableTokens.density.comfortable.header.padding.$value).toBe('{table.header.padding}')
    expect(tableTokens.density.comfortable.cell['font-size'].$value).toBe('{table.cell.font-size}')
    expect(tableTokens.density.comfortable.cell.padding.$value).toBe('{table.cell.padding}')
    expect(tableTokens.density.compact.header['font-size'].$value).toBe('{font-size.xs}')
    expect(tableTokens.density.compact.header.padding.$value).toBe('{space.xxs}')
    expect(tableTokens.density.compact.cell['font-size'].$value).toBe('{font-size.xs}')
    expect(tableTokens.density.compact.cell.padding.$value).toBe('{space.xxs}')
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

  it('uses modal body as the effective scroll container', () => {
    const modalCssPath = resolve(
      process.cwd(),
      'runtime/assets/styles/components/Modal.module.css'
    )

    const modalCss = readFileSync(modalCssPath, 'utf8')

    expect(modalCss).toContain('display: flex;')
    expect(modalCss).toContain('flex-direction: column;')
    expect(modalCss).toContain('block-size: 100%;')
    expect(modalCss).toContain('min-block-size: 0;')
    expect(modalCss).toContain('flex: 1 1 auto;')
    expect(modalCss).toContain('overflow-y: auto;')
    expect(modalCss).toContain('.modal:not([open])')
    expect(modalCss).toContain('display: none;')
    expect(modalCss).toContain('.modal[open]')
  })

  it('uses table density styles to override header and cell sizing', () => {
    const tableCssPath = resolve(
      process.cwd(),
      'runtime/assets/styles/components/Table.module.css'
    )

    const tableCss = readFileSync(tableCssPath, 'utf8')

    expect(tableCss).toContain("--local-header-font-size-base: v('table.header.font-size');")
    expect(tableCss).toContain("--local-header-font-size: var(--local-header-font-size-base);")
    expect(tableCss).toContain("--local-cell-font-size-base: v('table.cell.font-size');")
    expect(tableCss).toContain("--local-cell-font-size: var(--local-cell-font-size-base);")
    expect(tableCss).toContain(".wrapper[data-large]")
    expect(tableCss).toContain(".wrapper[data-comfortable]")
    expect(tableCss).toContain(".wrapper[data-compact]")
    expect(tableCss).toContain("font-size: var(--local-header-font-size);")
    expect(tableCss).toContain("font-size: var(--local-cell-font-size);")
    expect(tableCss).toContain("--local-header-padding: var(--local-density-large-header-padding);")
    expect(tableCss).toContain("--local-cell-padding: var(--local-density-compact-cell-padding);")
  })
})
