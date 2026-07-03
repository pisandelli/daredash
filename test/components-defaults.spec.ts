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
  })
})
