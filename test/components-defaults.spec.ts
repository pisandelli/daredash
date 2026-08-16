import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function getModulePath(relativePath: string): string {
  const rootDir = process.cwd().endsWith('modules/daredash')
    ? process.cwd()
    : resolve(process.cwd(), 'modules/daredash')
  return resolve(rootDir, relativePath)
}

describe('default component tokens', () => {
  it('uses compact badge typography defaults', () => {
    const badgeTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/badge.json'
    )

    const badgeTokens = JSON.parse(readFileSync(badgeTokensPath, 'utf8'))

    expect(badgeTokens['font-size'].$value).toBe('{font-size.xs}')
    expect(badgeTokens.padding.inline.$value).toBe('{space.xs}')
  })

  it('uses tokenized disabled button defaults', () => {
    const buttonTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/button.json'
    )
    const buttonCssPath = getModulePath(
      'runtime/assets/styles/components/Button.module.css'
    )

    const buttonTokens = JSON.parse(readFileSync(buttonTokensPath, 'utf8'))
    const buttonCss = readFileSync(buttonCssPath, 'utf8')

    expect(buttonTokens.disabled['background-color'].$value).toBe('{color.gray.200}')
    expect(buttonTokens.disabled.color.$value).toBe('{color.gray.400}')
    expect(buttonCss).toContain("--local-disabled-background-color: v('button.disabled.background-color');")
    expect(buttonCss).toContain("--local-disabled-color: v('button.disabled.color');")
  })

  it('boosts badge contrast inside dark theme scopes', () => {
    const themesPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/themes.json'
    )

    const themes = JSON.parse(readFileSync(themesPath, 'utf8'))

    expect(themes.dark.badge['background-color'].$value).toBe('color-mix(in srgb, {badge.base-color} 24%, transparent)')
    expect(themes.dark.badge.color.$value).toBe('color-mix(in srgb, {badge.base-color} 35%, white)')
  })

  it('keeps teleported toaster content scoped to the active theme host', () => {
    const toasterComponentPath = getModulePath(
      'runtime/components/primitives/Toaster/Toaster.ts'
    )

    const toasterComponent = readFileSync(toasterComponentPath, 'utf8')

    expect(toasterComponent).toContain("closest('[data-theme]')")
    expect(toasterComponent).toContain("'data-theme': themeName.value ?? undefined")
    expect(toasterComponent).toContain('new MutationObserver(syncTheme)')
  })

  it('uses detached notification trigger badge defaults', () => {
    const notificationTriggerTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/notification-trigger.json'
    )
    const notificationTriggerCssPath = getModulePath(
      'runtime/assets/styles/components/NotificationTrigger.module.css'
    )

    const notificationTriggerTokens = JSON.parse(readFileSync(notificationTriggerTokensPath, 'utf8'))
    const notificationTriggerCss = readFileSync(notificationTriggerCssPath, 'utf8')

    expect(notificationTriggerTokens.badge['offset-inline'].$value).toBe('-0.25rem')
    expect(notificationTriggerTokens.badge['offset-block'].$value).toBe('-0.25rem')
    expect(notificationTriggerTokens.badge['min-size'].$value).toBe('1rem')
    expect(notificationTriggerTokens.badge['padding-inline'].$value).toBe('{space.xxs}')
    expect(notificationTriggerTokens.badge['border-radius'].$value).toBe('{border-radius.full}')
    expect(notificationTriggerTokens.badge['base-color'].$value).toBe('{color.danger}')
    expect(notificationTriggerTokens.badge.color.$value).toBe('contrast-color({notification-trigger.badge.base-color})')
    expect(notificationTriggerCss).toContain("v('notification-trigger.badge.offset-inline')")
    expect(notificationTriggerCss).toContain("v('notification-trigger.badge.base-color')")
    expect(notificationTriggerCss).toContain('aspect-ratio: 1;')
    expect(notificationTriggerCss).toContain('.badge[data-overflow]')
    expect(notificationTriggerCss).toContain('background-color: var(--local-badge-base-color);')
    expect(notificationTriggerCss).toContain('pointer-events: none;')
  })

  it('uses muted neutral defaults for loading feedback', () => {
    const loadingTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/loading.json'
    )

    const loadingTokens = JSON.parse(readFileSync(loadingTokensPath, 'utf8'))

    expect(loadingTokens.color.$value).toBe('{color.text.muted}')
  })

  it('uses neutral skeleton defaults for placeholder states', () => {
    const skeletonTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/skeleton.json'
    )

    const skeletonTokens = JSON.parse(readFileSync(skeletonTokensPath, 'utf8'))

    expect(skeletonTokens['background-color'].$value).toBe('{color.bg.surface-hover}')
    expect(skeletonTokens['highlight-color'].$value).toBe('{color.bg.surface}')
    expect(skeletonTokens['border-radius'].$value).toBe('{border-radius.md}')
    expect(skeletonTokens['block-size'].$value).toBe('{space.md}')
  })

  it('keeps navigational primitives tied to semantic foreground and surface tokens', () => {
    const anchorTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/anchor.json'
    )
    const breadcrumbsTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/breadcrumbs.json'
    )
    const tabsTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/tabs.json'
    )

    const anchorTokens = JSON.parse(readFileSync(anchorTokensPath, 'utf8'))
    const breadcrumbsTokens = JSON.parse(readFileSync(breadcrumbsTokensPath, 'utf8'))
    const tabsTokens = JSON.parse(readFileSync(tabsTokensPath, 'utf8'))

    expect(anchorTokens['border-color'].$value).toBe('{color.border.default}')
    expect(anchorTokens['link-color'].$value).toBe('{color.text.muted}')
    expect(anchorTokens['link-color-hover'].$value).toBe('{color.text.default}')
    expect(anchorTokens['item-bg-hover'].$value).toBe('{color.bg.surface-hover}')

    expect(breadcrumbsTokens.item.color.$value).toBe('{color.text.muted}')
    expect(breadcrumbsTokens['item-current'].color.$value).toBe('{color.text.default}')
    expect(breadcrumbsTokens.separator.color.$value).toBe('{color.text.muted}')

    expect(tabsTokens.list['border-color'].$value).toBe('{color.border.default}')
    expect(tabsTokens.trigger['base-color'].$value).toBe('{color.primary}')
    expect(tabsTokens.trigger.color.$value).toBe('{color.text.muted}')
    expect(tabsTokens.trigger.hover.color.$value).toBe('{color.text.default}')
    expect(tabsTokens.trigger.hover.bg.$value).toBe('{color.bg.surface-hover}')
  })

  it('keeps a dedicated gray ramp for neutral aliases', () => {
    const primitivesPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/primitives.json'
    )

    const primitives = JSON.parse(readFileSync(primitivesPath, 'utf8'))

    expect(primitives.color.secondary['600'].$value).toBe('#b000c3')
    expect(primitives.color.gray['600'].$value).toBe('#525252')
    expect(primitives.color.gray.$value).toBe('{color.gray.500}')
    expect(primitives.color['light-gray'].$value).toBe('{color.gray.200}')
    expect(primitives.color['dark-gray'].$value).toBe('{color.gray.600}')
    expect(primitives.color['darker-gray'].$value).toBe('{color.gray.900}')
    expect(primitives.color.text.muted.$value).toBe('{color.gray.500}')
    expect(primitives.color['border-hover'].$value).toBe('{color.gray.300}')
  })

  it('ships reusable semantic state surface tokens', () => {
    const primitivesPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/primitives.json'
    )

    const primitives = JSON.parse(readFileSync(primitivesPath, 'utf8'))

    expect(primitives.state.success.surface.$value).toBe("color-mix(in srgb, {color.success} 14%, {color.bg.surface})")
    expect(primitives.state.success['surface-hover'].$value).toBe("color-mix(in srgb, {color.success} 20%, {color.bg.surface})")
    expect(primitives.state.success.border.$value).toBe("color-mix(in srgb, {color.success} 32%, {color.border.default})")
    expect(primitives.state.success['on-surface'].$value).toBe("color-mix(in srgb, {color.success} 72%, {color.text.default})")

    expect(primitives.state.warning.surface.$value).toBe("color-mix(in srgb, {color.warning} 14%, {color.bg.surface})")
    expect(primitives.state.warning['surface-hover'].$value).toBe("color-mix(in srgb, {color.warning} 20%, {color.bg.surface})")
    expect(primitives.state.warning.border.$value).toBe("color-mix(in srgb, {color.warning} 32%, {color.border.default})")
    expect(primitives.state.warning['on-surface'].$value).toBe("color-mix(in srgb, {color.warning} 72%, {color.text.default})")

    expect(primitives.state.danger.surface.$value).toBe("color-mix(in srgb, {color.danger} 14%, {color.bg.surface})")
    expect(primitives.state.danger['surface-hover'].$value).toBe("color-mix(in srgb, {color.danger} 20%, {color.bg.surface})")
    expect(primitives.state.danger.border.$value).toBe("color-mix(in srgb, {color.danger} 32%, {color.border.default})")
    expect(primitives.state.danger['on-surface'].$value).toBe("color-mix(in srgb, {color.danger} 72%, {color.text.default})")

    expect(primitives.state.info.surface.$value).toBe("color-mix(in srgb, {color.info} 14%, {color.bg.surface})")
    expect(primitives.state.info['surface-hover'].$value).toBe("color-mix(in srgb, {color.info} 20%, {color.bg.surface})")
    expect(primitives.state.info.border.$value).toBe("color-mix(in srgb, {color.info} 32%, {color.border.default})")
    expect(primitives.state.info['on-surface'].$value).toBe("color-mix(in srgb, {color.info} 72%, {color.text.default})")
  })

  it('uses a compact default submenu indent for menu items', () => {
    const menuTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/menu.json'
    )
    const menuCssPath = getModulePath(
      'runtime/assets/styles/components/Menu.module.css'
    )

    const menuTokens = JSON.parse(readFileSync(menuTokensPath, 'utf8'))
    const menuCss = readFileSync(menuCssPath, 'utf8')
    expect(menuTokens.item.gap.$value).toBe('1px')
    expect(menuTokens.submenu['padding-inline-start'].$value).toBe('{space.xs}')
    expect(menuCss).toContain('.list {')
    expect(menuCss).toContain('gap: var(--local-item-gap);')
  })

  it('uses semantic pagination defaults that adapt better to dark themes', () => {
    const paginationTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/pagination.json'
    )

    const paginationTokens = JSON.parse(readFileSync(paginationTokensPath, 'utf8'))

    expect(paginationTokens.color.$value).toBe('{color.text.muted}')
    expect(paginationTokens['border-color'].$value).toBe('{color.border.default}')
    expect(paginationTokens['color-hover'].$value).toBe('{color.text.default}')
    expect(paginationTokens['bg-hover'].$value).toBe('{color.bg.surface-hover}')
    expect(paginationTokens['bg-active'].$value).toBe('{color.bg.surface-hover}')
    expect(paginationTokens['color-disabled'].$value).toBe('{color.text.muted}')
    expect(paginationTokens['bg-disabled'].$value).toBe('{color.bg-disabled}')
    expect(paginationTokens['border-disabled'].$value).toBe('{color.border.default}')
  })

  it('uses updated table header and cell defaults', () => {
    const tableTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/table.json'
    )

    const tableTokens = JSON.parse(readFileSync(tableTokensPath, 'utf8'))

    expect(tableTokens.header.color.$value).toBe('{color.text.default}')
    expect(tableTokens['border-color'].$value).toBe('{card.border-color}')
    expect(tableTokens.header['background-color'].$value).toBe('{color.bg.surface-hover}')
    expect(tableTokens.header['font-size'].$value).toBe('{font-size.sm}')
    expect(tableTokens.header.padding.$value).toBe('{space.sm}')
    expect(tableTokens.cell['font-size'].$value).toBe('{font-size.sm}')
    expect(tableTokens.cell.padding.$value).toBe('{space.sm}')
    expect(tableTokens.cell['border-color'].$value).toBe('{color.border.default}')
    expect(tableTokens['row-striped']['background-color'].$value).toBe('{color.bg.surface-hover}')
    expect(tableTokens.row['background-color'].$value).toBe('transparent')
    expect(tableTokens['row-hover']['background-color'].$value).toBe('{color.bg.surface-hover}')
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

  it('uses semantic menu and switch neutrals for dark-theme compatibility', () => {
    const menuTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/menu.json'
    )
    const switchTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/switch.json'
    )

    const menuTokens = JSON.parse(readFileSync(menuTokensPath, 'utf8'))
    const switchTokens = JSON.parse(readFileSync(switchTokensPath, 'utf8'))

    expect(menuTokens.item['color-disabled'].$value).toBe('{color.text.muted}')
    expect(menuTokens.item['bg-active'].$value).toBe('{color.bg.surface-hover}')
    expect(menuTokens.separator.color.$value).toBe('{color.text.muted}')
    expect(switchTokens.track['background-color'].$value).toBe('{color.text.muted}')
  })

  it('uses semantic textarea and radio neutrals for dark-theme compatibility', () => {
    const textareaTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/textarea.json'
    )
    const radioTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/radio.json'
    )
    const radioCssPath = getModulePath(
      'runtime/assets/styles/components/Radio.module.css'
    )

    const textareaTokens = JSON.parse(readFileSync(textareaTokensPath, 'utf8'))
    const radioTokens = JSON.parse(readFileSync(radioTokensPath, 'utf8'))
    const radioCss = readFileSync(radioCssPath, 'utf8')

    expect(textareaTokens.disabled['background-color'].$value).toBe('{input.disabled.background-color}')
    expect(radioTokens.border.$value).toBe('{color.border.default}')
    expect(radioTokens.disabled.border.$value).toBe('{color.border.default}')
    expect(radioTokens.disabled['dot-color'].$value).toBe('{color.text.muted}')
    expect(radioTokens.color.$value).toBe('{color.text.default}')
    expect(radioCss).toContain("--local-checked-dot-color: v('radio.checked.dot-color');")
    expect(radioCss).toContain("--local-disabled-dot-color: v('radio.disabled.dot-color');")
    expect(radioCss).toContain('background-image: radial-gradient(circle, var(--local-checked-dot-color) 0 26%, transparent 27%);')
    expect(radioCss).not.toContain('data:image/svg+xml')
  })

  it('uses a shared field shell for text field spacing and messages', () => {
    const fieldShellCssPath = getModulePath(
      'runtime/assets/styles/components/FieldShell.module.css'
    )
    const inputCssPath = getModulePath(
      'runtime/assets/styles/components/Input.module.css'
    )
    const selectCssPath = getModulePath(
      'runtime/assets/styles/components/Select.module.css'
    )
    const textareaCssPath = getModulePath(
      'runtime/assets/styles/components/Textarea.module.css'
    )
    const inputGroupCssPath = getModulePath(
      'runtime/assets/styles/components/InputGroup.module.css'
    )

    const fieldShellCss = readFileSync(fieldShellCssPath, 'utf8')
    const inputTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/input.json'
    )
    const inputTokens = JSON.parse(readFileSync(inputTokensPath, 'utf8'))
    const inputCss = readFileSync(inputCssPath, 'utf8')
    const selectCss = readFileSync(selectCssPath, 'utf8')
    const textareaCss = readFileSync(textareaCssPath, 'utf8')
    const inputGroupCss = readFileSync(inputGroupCssPath, 'utf8')

    expect(fieldShellCss).toContain(".field {\n  --local-label-font-size: v('input.label.font-size');")
    expect(fieldShellCss).toContain('gap: 0.375rem;')
    expect(fieldShellCss).toContain('min-block-size: 1.25em;')
    expect(fieldShellCss).toContain("--local-required-marker-color: v('input.required-marker.color');")
    expect(fieldShellCss).toContain("--local-counter-color: v('input.counter.color');")
    expect(inputTokens['background-color'].$value).toBe('{color.bg.surface}')
    expect(inputTokens.color.$value).toBe('{color.text.default}')
    expect(inputTokens.placeholder.color.$value).toBe('{color.text.muted}')
    expect(inputTokens.disabled['border-color'].$value).toBe('{color.border.default}')
    expect(inputTokens.icon.color.$value).toBe('{color.text.muted}')
    expect(inputTokens.counter.color.$value).toBe('{color.text.muted}')
    expect(inputTokens['required-marker'].color.$value).toBe('{color.danger}')
    expect(inputGroupCss).toContain('[data-field-shell] {')
    expect(inputGroupCss).toContain('[data-field-feedback] {')
    expect(inputGroupCss).toContain('> [data-field-shell] {')
    expect(inputGroupCss).toContain('flex: 1 1 0;')
    expect(inputGroupCss).toContain('gap: 0;')
    expect(inputCss).toContain("--local-border-color: v('input.disabled.border-color');")
    expect(inputCss).toContain("color: v('input.icon.color');")
    expect(inputCss).not.toContain('.wrapper')
    expect(selectCss).not.toContain('.wrapper')
    expect(selectCss).not.toContain('secondary-200')
    expect(textareaCss).toContain("color: v('textarea.placeholder.color');")
    expect(textareaCss).not.toContain('.wrapper')
    expect(selectCss).not.toContain("margin-block-end: v('space.xxs');")
  })

  it('uses section-specific card padding tokens with shared fallback', () => {
    const cardTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/card.json'
    )
    const cardCssPath = getModulePath(
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
    const modalTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/modal.json'
    )
    const modalCssPath = getModulePath(
      'runtime/assets/styles/components/Modal.module.css'
    )

    const modalTokens = JSON.parse(readFileSync(modalTokensPath, 'utf8'))
    const modalCss = readFileSync(modalCssPath, 'utf8')

    expect(modalTokens['background-color'].$value).toBe('{color.bg.surface-elevated}')
    expect(modalTokens.color.$value).toBe('{color.text.default}')
    expect(modalTokens.close.color.$value).toBe('{color.text.muted}')
    expect(modalTokens.close.hover.color.$value).toBe('{color.danger.600}')
    expect(modalTokens.close.hover['background-color'].$value).toBe('{color.danger.50}')
    expect(modalCss).toContain("--local-background-color: v('modal.background-color');")
    expect(modalCss).toContain("--local-color: v('modal.color');")
    expect(modalCss).toContain("--local-close-color: v('modal.close.color');")
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

  it('keeps drawer surfaces and close affordances token-driven', () => {
    const drawerTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/drawer.json'
    )
    const drawerCssPath = getModulePath(
      'runtime/assets/styles/components/Drawer.module.css'
    )

    const drawerTokens = JSON.parse(readFileSync(drawerTokensPath, 'utf8'))
    const drawerCss = readFileSync(drawerCssPath, 'utf8')

    expect(drawerTokens.bg.$value).toBe('{color.bg.surface-elevated}')
    expect(drawerTokens.color.$value).toBe('{color.text.default}')
    expect(drawerTokens.header['border-color'].$value).toBe('{card.border-color}')
    expect(drawerTokens.footer['border-color'].$value).toBe('{card.border-color}')
    expect(drawerTokens.title.color.$value).toBe('{color.text.default}')
    expect(drawerTokens.close.color.$value).toBe('{color.text.muted}')
    expect(drawerTokens.close.hover['background-color'].$value).toBe('{color.bg.surface-hover}')
    expect(drawerTokens.close.hover.color.$value).toBe('{color.text.default}')
    expect(drawerCss).toContain("--local-color: v('drawer.color');")
    expect(drawerCss).toContain("--local-title-color: v('drawer.title.color');")
    expect(drawerCss).toContain("--local-close-hover-background-color: v('drawer.close.hover.background-color');")
    expect(drawerCss).not.toContain("v('color.surface.hover')")
    expect(drawerCss).not.toContain("v('color.text')")
  })

  it('keeps switch colors token-driven and ready for theming', () => {
    const switchTokensPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/components/switch.json'
    )
    const switchCssPath = getModulePath(
      'runtime/assets/styles/components/Toggle.module.css'
    )

    const switchTokens = JSON.parse(readFileSync(switchTokensPath, 'utf8'))
    const switchCss = readFileSync(switchCssPath, 'utf8')

    expect(switchTokens.color.$value).toBe('{color.text.default}')
    expect(switchTokens.label.color.$value).toBe('{color.text.default}')
    expect(switchTokens.thumb['background-color'].$value).toBe('{color.bg.surface}')
    expect(switchTokens.track.color.$value).toBe('{color.text.inverse}')
    expect(switchTokens.track['color-active'].$value).toBe('{color.text.inverse}')
    expect(switchTokens['loading-icon'].color.$value).toBe('{color.text.muted}')
    expect(switchTokens['loading-icon']['color-active'].$value).toBe('{color.text.inverse}')
    expect(switchCss).toContain("--local-track-background-color: v('switch.track.background-color');")
    expect(switchCss).toContain("--local-track-active-background-color: v('switch.track.background-color-active');")
    expect(switchCss).toContain("--local-label-color: v('switch.label.color');")
    expect(switchCss).toContain("--local-loading-icon-color: v('switch.loading-icon.color');")
    expect(switchCss).toContain("--local-loading-icon-active-color: v('switch.loading-icon.color-active');")
    expect(switchCss).not.toContain("v('color.white')")
    expect(switchCss).not.toContain("v('color.dark-gray')")
    expect(switchCss).not.toContain('#fff')
  })

  it('ships dark, redish, and blueish theme override layers', () => {
    const themesPath = getModulePath(
      'runtime/assets/styles/tokens/default-theme/themes.json'
    )

    const themes = JSON.parse(readFileSync(themesPath, 'utf8'))

    expect(Object.keys(themes)).toEqual(['dark', 'redish', 'blueish', 'darker'])
    expect(themes.dark.color.text.default.$value).toBe('{color.gray.50}')
    expect(themes.dark.color.bg.canvas.$value).toBe('{color.gray.950}')
    expect(themes.dark.color.bg['surface-subtle'].$value).toBe('{color.gray.900}')
    expect(themes.dark.color.bg.surface.$value).toBe('{color.gray.800}')
    expect(themes.dark.color.bg['surface-elevated'].$value).toBe('{color.gray.700}')
    expect(themes.dark.color.border.default.$value).toBe('{color.gray.700}')
    expect(themes.dark.color.primary.$value).toBe('{color.primary.400}')

    expect(themes.redish.color.bg.canvas.$value).toBe('{color.danger.950}')
    expect(themes.redish.color.bg.surface.$value).toBe('{color.danger.800}')
    expect(themes.redish.color.primary.$value).toBe('{color.danger.400}')

    expect(themes.blueish.color.bg.canvas.$value).toBe('{color.primary.950}')
    expect(themes.blueish.color.bg.surface.$value).toBe('{color.primary.800}')
    expect(themes.blueish.color.primary.$value).toBe('{color.primary.400}')
    expect(themes.dark.card['background-color'].$value).toBe('{color.bg.surface}')
    expect(themes.dark.card.color.$value).toBe('{color.text.default}')
    expect(themes.dark.badge['base-color'].$value).toBe('{color.gray.300}')
    expect(themes.dark.button['base-color'].$value).toBe('{color.primary.400}')
    expect(themes.dark.button.disabled['background-color'].$value).toBe('{color.gray.800}')
    expect(themes.dark.button.disabled.color.$value).toBe('{color.text.muted}')
    expect(themes.dark.button.success.color.$value).toBe('{color.gray.50}')
    expect(themes.dark.button.warning.color.$value).toBe('{color.gray.50}')
    expect(themes.dark.button.danger.color.$value).toBe('{color.gray.50}')
    expect(themes.dark.button.info.color.$value).toBe('{color.gray.50}')
    expect(themes.dark.input['background-color'].$value).toBe('{color.bg.surface}')
    expect(themes.dark.input.color.$value).toBe('{color.text.default}')
    expect(themes.dark.select['background-color'].$value).toBe('{color.bg.surface}')
    expect(themes.dark.select.disabled['background-color'].$value).toBe('{color.gray.800}')
    expect(themes.dark.textarea.disabled['background-color'].$value).toBe('{color.gray.800}')
    expect(themes.dark.drawer.header['border-color'].$value).toBe('{card.border-color}')
    expect(themes.dark.drawer.footer['border-color'].$value).toBe('{card.border-color}')
    expect(themes.dark.drawer.title.color.$value).toBe('{color.gray.100}')
    expect(themes.dark.drawer.close.color.$value).toBe('{color.gray.300}')
    expect(themes.dark.menu.item.color.$value).toBe('{color.text.muted}')
    expect(themes.dark.menu.item['color-active'].$value).toBe('{color.text.default}')
    expect(themes.dark.menu.item['bg-active'].$value).toBe('{color.bg.surface-hover}')
    expect(themes.dark.menu.separator['border-color'].$value).toBe('{color.border.default}')
    expect(themes.dark.menu.toggle.color.$value).toBe('{color.text.muted}')
    expect(themes.dark.anchor['link-color'].$value).toBe('{color.text.muted}')
    expect(themes.dark.anchor['active-color'].$value).toBe('{color.text.default}')
    expect(themes.dark.breadcrumbs.item.color.$value).toBe('{color.text.muted}')
    expect(themes.dark.breadcrumbs.item['hover-color'].$value).toBe('{color.primary.300}')
    expect(themes.dark.tabs.trigger.color.$value).toBe('{color.text.muted}')
    expect(themes.dark.tabs.trigger.active.color.$value).toBe('{color.text.default}')
    expect(themes.dark.skeleton['background-color'].$value).toBe('{color.bg.surface-hover}')
    expect(themes.dark.switch.track['background-color'].$value).toBe('{color.text.muted}')
    expect(themes.dark.radio.border.$value).toBe('{color.border.default}')
    expect(themes.dark.radio.checked['dot-color'].$value).toBe('{color.primary.300}')
    expect(themes.dark.radio.disabled.bg.$value).toBe('{color.gray.800}')
    expect(themes.dark.toast.background.$value).toBe('{color.bg.surface-elevated}')
    expect(themes.dark.toast.color.$value).toBe('{color.text.default}')
    expect(themes.dark.toast['border-color'].$value).toBe('{color.border.default}')
    expect(themes.dark.toast['close-color'].$value).toBe('{color.text.muted}')
    expect(themes.dark.toast['close-hover-bg'].$value).toBe('{color.bg.surface-hover}')
    expect(themes.dark.popover.bg.$value).toBe('{color.bg.surface-elevated}')
    expect(themes.dark.pagination.color.$value).toBe('{color.text.muted}')
    expect(themes.dark.pagination['bg-hover'].$value).toBe('{color.bg.surface-hover}')
    expect(themes.dark.pagination['color-active'].$value).toBe('{color.text.default}')
    expect(themes.dark.pagination['border-active'].$value).toBe('{color.primary.300}')
    expect(themes.dark.pagination['bg-disabled'].$value).toBe('{color.gray.800}')
    expect(themes.dark.table['border-color'].$value).toBe('{card.border-color}')
    expect(themes.dark.table.cell['border-color'].$value).toBe('{color.border.default}')
    expect(themes.dark.table.header['background-color'].$value).toBe('{color.bg.surface-hover}')
    expect(themes.darker.button.success.color.$value).toBe('{color.gray.50}')
    expect(themes.darker.button.warning.color.$value).toBe('{color.gray.50}')
    expect(themes.darker.button.danger.color.$value).toBe('{color.gray.50}')
    expect(themes.darker.button.info.color.$value).toBe('{color.gray.50}')
  })

  it('uses table density styles to override header and cell sizing', () => {
    const tableCssPath = getModulePath(
      'runtime/assets/styles/components/Table.module.css'
    )

    const tableCss = readFileSync(tableCssPath, 'utf8')

    expect(tableCss).toContain("--local-header-font-size-base: v('table.header.font-size');")
    expect(tableCss).toContain("--local-row-bg: v('table.row.background-color');")
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
