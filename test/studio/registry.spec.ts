import { describe, it, expect } from 'vitest'
import { flattenTokens, resolveTokenValue } from '../../src/utils/tokens'
import { STUDIO_TABS } from '../../runtime/studio/registry'
import primitives from '../../runtime/assets/styles/tokens/default-theme/primitives.json'
import {
  STUDIO_COMPONENT_TOKENS,
  type StudioComponentTokenId
} from '../../runtime/studio/componentTokens'

describe('DareDash Studio registry', () => {
  it('maps every field path to a real token', () => {
    const rawTokens = {
      primitives,
      components: STUDIO_COMPONENT_TOKENS
    }
    const flat = flattenTokens(rawTokens)
    const fields = STUDIO_TABS.flatMap((tab) => tab.fields)

    for (const field of fields) {
      const resolved = resolveTokenValue(flat, field.path)
      expect(resolved, `Missing token path: ${field.path}`).not.toBeNull()
    }
  })

  it('keeps the base tab focused on non-typographic primitives', () => {
    const baseTab = STUDIO_TABS.find((tab) => tab.id === 'base')

    expect(baseTab).toBeDefined()
    expect(baseTab!.fields.some((field) => field.path.startsWith('font-size.'))).toBe(false)
    expect(baseTab!.fields.some((field) => field.path.startsWith('font-weight.'))).toBe(false)
    expect(baseTab!.fields.some((field) => field.path === 'space.md')).toBe(true)
    expect(baseTab!.fields.some((field) => field.path === 'shadow.md')).toBe(true)
    expect(baseTab!.fields.some((field) => field.path === 'transition.base')).toBe(true)
    expect(baseTab!.fields.some((field) => field.path === 'max-width')).toBe(true)
  })

  it('keeps typography primitives in the typography foundation tab', () => {
    const typographyTab = STUDIO_TABS.find((tab) => tab.id === 'typography')

    expect(typographyTab).toBeDefined()
    expect(typographyTab!.navigationKind).toBe('foundation')
    expect(typographyTab!.fields.some((field) => field.path === 'font.base')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'font-size.md')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'font-weight.bold')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'line-height.normal')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'letter-spacing.wide')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'space.md')).toBe(false)
  })

  it('preserves primitive alias metadata for studio fields', () => {
    const baseTab = STUDIO_TABS.find((tab) => tab.id === 'base')
    const errorAlias = baseTab?.fields.find((field) => field.path === 'color.error.500')
    const borderAlias = baseTab?.fields.find((field) => field.path === 'color.border.default')

    expect(errorAlias?.referencePath).toBe('color.danger.500')
    expect(borderAlias?.referencePath).toBe('color.light-gray')
  })

  it('keeps every component tab backed by a shared token source', () => {
    const componentTabs = STUDIO_TABS.filter((tab) => tab.navigationKind === 'component')

    for (const tab of componentTabs) {
      expect(STUDIO_COMPONENT_TOKENS[tab.id as StudioComponentTokenId]).toBeDefined()
    }
  })

  it('keeps every shared component token exposed by a studio tab', () => {
    const componentTabIds = new Set(
      STUDIO_TABS
        .filter((tab) => tab.navigationKind === 'component')
        .map((tab) => tab.id)
    )

    for (const componentId of Object.keys(STUDIO_COMPONENT_TOKENS) as StudioComponentTokenId[]) {
      expect(componentTabIds.has(componentId)).toBe(true)
    }
  })

  it('keeps the primitive studio category complete for current tokenized components', () => {
    const primitiveTabIds = STUDIO_TABS
      .filter((tab) => tab.navigationKind === 'component' && tab.componentCategory === 'primitive')
      .map((tab) => tab.id)
      .sort()

    expect(primitiveTabIds).toEqual([
      'alert',
      'avatar',
      'badge',
      'breadcrumbs',
      'button',
      'card',
      'loading',
      'progress',
      'toast',
      'toaster'
    ])
  })

  it('keeps the form studio category complete for current tokenized components', () => {
    const formTabIds = STUDIO_TABS
      .filter((tab) => tab.navigationKind === 'component' && tab.componentCategory === 'form')
      .map((tab) => tab.id)
      .sort()

    expect(formTabIds).toEqual([
      'checkbox',
      'input',
      'input-group',
      'input-search',
      'radio',
      'select',
      'switch',
      'textarea'
    ])
  })

  it('keeps the widget studio category complete for current tokenized components', () => {
    const widgetTabIds = STUDIO_TABS
      .filter((tab) => tab.navigationKind === 'component' && tab.componentCategory === 'widget')
      .map((tab) => tab.id)
      .sort()

    expect(widgetTabIds).toEqual([
      'accordion',
      'anchor',
      'drawer',
      'menu',
      'modal',
      'pagination',
      'popover',
      'table',
      'tabs'
    ])
  })

  it('registers accordion with preserved token references', () => {
    const accordionTab = STUDIO_TABS.find((tab) => tab.id === 'accordion')
    const headerPadding = accordionTab?.fields.find((field) => field.path === 'accordion.header.padding')
    const contentPadding = accordionTab?.fields.find((field) => field.path === 'accordion.content.padding')

    expect(accordionTab).toBeDefined()
    expect(accordionTab!.navigationKind).toBe('component')
    expect(headerPadding?.referencePath).toBe('space.md')
    expect(contentPadding?.referencePath).toBe('accordion.header.padding')
  })

  it('registers avatar with preserved token references', () => {
    const avatarTab = STUDIO_TABS.find((tab) => tab.id === 'avatar')
    const avatarSize = avatarTab?.fields.find((field) => field.path === 'avatar.size')
    const avatarBackground = avatarTab?.fields.find((field) => field.path === 'avatar.background-color')

    expect(avatarTab).toBeDefined()
    expect(avatarTab!.navigationKind).toBe('component')
    expect(avatarSize?.referencePath).toBe('space.sl')
    expect(avatarBackground?.referencePath).toBe('color.primary.100')
  })

  it('registers breadcrumbs with preserved token references', () => {
    const breadcrumbsTab = STUDIO_TABS.find((tab) => tab.id === 'breadcrumbs')
    const fontSizeField = breadcrumbsTab?.fields.find((field) => field.path === 'breadcrumbs.font-size')
    const gapField = breadcrumbsTab?.fields.find((field) => field.path === 'breadcrumbs.gap')
    const hoverField = breadcrumbsTab?.fields.find((field) => field.path === 'breadcrumbs.item.hover-color')

    expect(breadcrumbsTab).toBeDefined()
    expect(breadcrumbsTab!.navigationKind).toBe('component')
    expect(fontSizeField?.referencePath).toBe('font-size.sm')
    expect(gapField?.referencePath).toBe('space.xs')
    expect(hoverField?.referencePath).toBe('color.primary')
  })

  it('registers card with preserved token references', () => {
    const cardTab = STUDIO_TABS.find((tab) => tab.id === 'card')
    const backgroundField = cardTab?.fields.find((field) => field.path === 'card.background-color')
    const radiusField = cardTab?.fields.find((field) => field.path === 'card.border-radius')
    const headerPaddingField = cardTab?.fields.find((field) => field.path === 'card.header.padding')

    expect(cardTab).toBeDefined()
    expect(cardTab!.navigationKind).toBe('component')
    expect(backgroundField?.referencePath).toBe('color.bg.surface')
    expect(radiusField?.referencePath).toBe('border-radius.lg')
    expect(headerPaddingField?.referencePath).toBe('space.lg')
  })

  it('registers center with preserved token references', () => {
    const centerTab = STUDIO_TABS.find((tab) => tab.id === 'center')
    const gapField = centerTab?.fields.find((field) => field.path === 'center.gap')
    const maxWidthField = centerTab?.fields.find((field) => field.path === 'center.max-width')

    expect(centerTab).toBeDefined()
    expect(centerTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
    expect(maxWidthField?.referencePath).toBe('max-width')
  })

  it('registers checkbox with preserved token references', () => {
    const checkboxTab = STUDIO_TABS.find((tab) => tab.id === 'checkbox')
    const sizeField = checkboxTab?.fields.find((field) => field.path === 'checkbox.size')
    const checkedBgField = checkboxTab?.fields.find((field) => field.path === 'checkbox.checked.bg')

    expect(checkboxTab).toBeDefined()
    expect(checkboxTab!.navigationKind).toBe('component')
    expect(sizeField?.defaultValue).toBe('1.25rem')
    expect(checkedBgField?.referencePath).toBe('color.primary.600')
  })

  it('registers cluster with preserved token references', () => {
    const clusterTab = STUDIO_TABS.find((tab) => tab.id === 'cluster')
    const gapField = clusterTab?.fields.find((field) => field.path === 'cluster.gap')

    expect(clusterTab).toBeDefined()
    expect(clusterTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })

  it('registers drawer with preserved token references', () => {
    const drawerTab = STUDIO_TABS.find((tab) => tab.id === 'drawer')
    const backgroundField = drawerTab?.fields.find((field) => field.path === 'drawer.bg')
    const shadowField = drawerTab?.fields.find((field) => field.path === 'drawer.box-shadow')

    expect(drawerTab).toBeDefined()
    expect(drawerTab!.navigationKind).toBe('component')
    expect(backgroundField?.referencePath).toBe('color.white')
    expect(shadowField?.referencePath).toBe('shadow.xl')
  })

  it('registers grid with preserved token references', () => {
    const gridTab = STUDIO_TABS.find((tab) => tab.id === 'grid')
    const gapField = gridTab?.fields.find((field) => field.path === 'grid.gap')

    expect(gridTab).toBeDefined()
    expect(gridTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })

  it('registers layout structure tokens', () => {
    const layoutTab = STUDIO_TABS.find((tab) => tab.id === 'layout')
    const gapField = layoutTab?.fields.find((field) => field.path === 'layout.gap')

    expect(layoutTab).toBeDefined()
    expect(layoutTab!.navigationKind).toBe('component')
    expect(gapField?.defaultValue).toBe('0')
  })

  it('registers loading with preserved token references', () => {
    const loadingTab = STUDIO_TABS.find((tab) => tab.id === 'loading')
    const colorField = loadingTab?.fields.find((field) => field.path === 'loading.color')
    const iconSizeField = loadingTab?.fields.find((field) => field.path === 'loading.icon-size')

    expect(loadingTab).toBeDefined()
    expect(loadingTab!.navigationKind).toBe('component')
    expect(colorField?.referencePath).toBe('color.secondary')
    expect(iconSizeField?.referencePath).toBe('space.xl')
  })

  it('registers menu with preserved token references', () => {
    const menuTab = STUDIO_TABS.find((tab) => tab.id === 'menu')
    const activeField = menuTab?.fields.find((field) => field.path === 'menu.item.bg-active')
    const floatField = menuTab?.fields.find((field) => field.path === 'menu.float.shadow')

    expect(menuTab).toBeDefined()
    expect(menuTab!.navigationKind).toBe('component')
    expect(activeField?.referencePath).toBe('color.primary.50')
    expect(floatField?.referencePath).toBe('shadow.lg')
  })

  it('registers modal with preserved token references', () => {
    const modalTab = STUDIO_TABS.find((tab) => tab.id === 'modal')
    const radiusField = modalTab?.fields.find((field) => field.path === 'modal.border-radius')
    const shadowField = modalTab?.fields.find((field) => field.path === 'modal.box-shadow')

    expect(modalTab).toBeDefined()
    expect(modalTab!.navigationKind).toBe('component')
    expect(radiusField?.referencePath).toBe('border-radius.xl')
    expect(shadowField?.referencePath).toBe('card.box-shadow')
  })

  it('registers pagination with preserved token references', () => {
    const paginationTab = STUDIO_TABS.find((tab) => tab.id === 'pagination')
    const colorField = paginationTab?.fields.find((field) => field.path === 'pagination.color')
    const activeField = paginationTab?.fields.find((field) => field.path === 'pagination.color-active')

    expect(paginationTab).toBeDefined()
    expect(paginationTab!.navigationKind).toBe('component')
    expect(colorField?.referencePath).toBe('color.dark-gray')
    expect(activeField?.referencePath).toBe('color.primary')
  })

  it('registers popover with preserved token references', () => {
    const popoverTab = STUDIO_TABS.find((tab) => tab.id === 'popover')
    const backgroundField = popoverTab?.fields.find((field) => field.path === 'popover.bg')
    const shadowField = popoverTab?.fields.find((field) => field.path === 'popover.shadow')

    expect(popoverTab).toBeDefined()
    expect(popoverTab!.navigationKind).toBe('component')
    expect(backgroundField?.referencePath).toBe('color.bg.surface')
    expect(shadowField?.referencePath).toBe('shadow.md')
  })

  it('registers input with preserved token references', () => {
    const inputTab = STUDIO_TABS.find((tab) => tab.id === 'input')
    const lineHeightField = inputTab?.fields.find((field) => field.path === 'input.line-height')
    const warningField = inputTab?.fields.find((field) => field.path === 'input.warning-state.border-color')

    expect(inputTab).toBeDefined()
    expect(inputTab!.navigationKind).toBe('component')
    expect(lineHeightField?.referencePath).toBe('line-height.normal')
    expect(warningField?.referencePath).toBe('color.warning')
  })

  it('registers input group with preserved token references', () => {
    const inputGroupTab = STUDIO_TABS.find((tab) => tab.id === 'input-group')
    const borderField = inputGroupTab?.fields.find((field) => field.path === 'input-group.border-radius')
    const addonField = inputGroupTab?.fields.find((field) => field.path === 'input-group.addon.font-size')

    expect(inputGroupTab).toBeDefined()
    expect(inputGroupTab!.navigationKind).toBe('component')
    expect(borderField?.referencePath).toBe('input.border-radius')
    expect(addonField?.referencePath).toBe('input.font-size')
  })

  it('registers input search with preserved token references', () => {
    const inputSearchTab = STUDIO_TABS.find((tab) => tab.id === 'input-search')
    const primaryField = inputSearchTab?.fields.find((field) => field.path === 'input-search.button.background-color')
    const neutralField = inputSearchTab?.fields.find((field) => field.path === 'input-search.button.neutral.background-color')

    expect(inputSearchTab).toBeDefined()
    expect(inputSearchTab!.navigationKind).toBe('component')
    expect(primaryField?.referencePath).toBe('button.primary.base-color')
    expect(neutralField?.referencePath).toBe('color.secondary-100')
  })

  it('registers progress with preserved token references', () => {
    const progressTab = STUDIO_TABS.find((tab) => tab.id === 'progress')
    const trackField = progressTab?.fields.find((field) => field.path === 'progress.background-color')
    const indicatorField = progressTab?.fields.find((field) => field.path === 'progress.indicator.background-color')

    expect(progressTab).toBeDefined()
    expect(progressTab!.navigationKind).toBe('component')
    expect(trackField?.referencePath).toBe('color.light-gray')
    expect(indicatorField?.referencePath).toBe('color.primary')
  })

  it('registers toast with preserved token references', () => {
    const toastTab = STUDIO_TABS.find((tab) => tab.id === 'toast')
    const paddingField = toastTab?.fields.find((field) => field.path === 'toast.padding')
    const shadowField = toastTab?.fields.find((field) => field.path === 'toast.box-shadow')
    const iconField = toastTab?.fields.find((field) => field.path === 'toast.icon-color')
    const successIconField = toastTab?.fields.find((field) => field.path === 'toast.success.icon-color')
    const backgroundField = toastTab?.fields.find((field) => field.path === 'toast.background')
    const solidDangerField = toastTab?.fields.find((field) => field.path === 'toast.solid.danger.background')
    const solidWarningTextField = toastTab?.fields.find((field) => field.path === 'toast.solid.warning.color')

    expect(toastTab).toBeDefined()
    expect(toastTab!.navigationKind).toBe('component')
    expect(paddingField?.referencePath).toBe('space.md')
    expect(shadowField?.referencePath).toBe('card.box-shadow')
    expect(backgroundField?.referencePath).toBe('color.white')
    expect(iconField?.referencePath).toBe('color.info')
    expect(successIconField?.referencePath).toBe('color.success')
    expect(solidDangerField?.referencePath).toBe('color.danger')
    expect(solidWarningTextField?.referencePath).toBe('color.text.default')
  })

  it('registers stack with preserved token references', () => {
    const stackTab = STUDIO_TABS.find((tab) => tab.id === 'stack')
    const gapField = stackTab?.fields.find((field) => field.path === 'stack.gap')

    expect(stackTab).toBeDefined()
    expect(stackTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })

  it('registers radio with preserved token references', () => {
    const radioTab = STUDIO_TABS.find((tab) => tab.id === 'radio')
    const sizeField = radioTab?.fields.find((field) => field.path === 'radio.size')
    const dotField = radioTab?.fields.find((field) => field.path === 'radio.checked.dot-color')

    expect(radioTab).toBeDefined()
    expect(radioTab!.navigationKind).toBe('component')
    expect(sizeField?.referencePath).toBe('checkbox.size')
    expect(dotField?.referencePath).toBe('color.primary.600')
  })

  it('registers select with preserved token references', () => {
    const selectTab = STUDIO_TABS.find((tab) => tab.id === 'select')
    const lineHeightField = selectTab?.fields.find((field) => field.path === 'select.line-height')
    const hoverField = selectTab?.fields.find((field) => field.path === 'select.hover.border-color')

    expect(selectTab).toBeDefined()
    expect(selectTab!.navigationKind).toBe('component')
    expect(lineHeightField?.referencePath).toBe('input.line-height')
    expect(hoverField?.referencePath).toBe('color.border-hover')
  })

  it('registers switch with preserved token references', () => {
    const switchTab = STUDIO_TABS.find((tab) => tab.id === 'switch')
    const focusField = switchTab?.fields.find((field) => field.path === 'switch.focus')
    const activeField = switchTab?.fields.find((field) => field.path === 'switch.track.background-color-active')
    const warningField = switchTab?.fields.find((field) => field.path === 'switch.warning.track.background-color-active')

    expect(switchTab).toBeDefined()
    expect(switchTab!.navigationKind).toBe('component')
    expect(focusField?.referencePath).toBe('input.focus.box-shadow')
    expect(activeField?.referencePath).toBe('color.success')
    expect(warningField?.referencePath).toBe('color.warning')
  })

  it('registers textarea with preserved token references', () => {
    const textareaTab = STUDIO_TABS.find((tab) => tab.id === 'textarea')
    const labelField = textareaTab?.fields.find((field) => field.path === 'textarea.label.color')
    const successField = textareaTab?.fields.find((field) => field.path === 'textarea.success-state.border-color')

    expect(textareaTab).toBeDefined()
    expect(textareaTab!.navigationKind).toBe('component')
    expect(labelField?.referencePath).toBe('input.label.color')
    expect(successField?.referencePath).toBe('color.success')
  })

  it('registers table with preserved token references', () => {
    const tableTab = STUDIO_TABS.find((tab) => tab.id === 'table')
    const colorField = tableTab?.fields.find((field) => field.path === 'table.color')
    const borderField = tableTab?.fields.find((field) => field.path === 'table.border-color')
    const borderWidthField = tableTab?.fields.find((field) => field.path === 'table.border-width')
    const headerField = tableTab?.fields.find((field) => field.path === 'table.header.background-color')
    const headerColorField = tableTab?.fields.find((field) => field.path === 'table.header.color')
    const cellBorderField = tableTab?.fields.find((field) => field.path === 'table.cell.border-color')
    const cellBorderWidthField = tableTab?.fields.find((field) => field.path === 'table.cell.border-width')

    expect(tableTab).toBeDefined()
    expect(tableTab!.navigationKind).toBe('component')
    expect(colorField?.referencePath).toBe('color.text.default')
    expect(borderField?.referencePath).toBe('color.secondary.100')
    expect(borderWidthField?.defaultValue).toBe('1px')
    expect(headerField?.referencePath).toBe('color.secondary.50')
    expect(headerColorField?.referencePath).toBe('color.dark-gray')
    expect(cellBorderField?.referencePath).toBe('table.border-color')
    expect(cellBorderWidthField?.referencePath).toBe('table.border-width')
  })

  it('registers tabs with preserved token references', () => {
    const tabsTab = STUDIO_TABS.find((tab) => tab.id === 'tabs')
    const paddingField = tabsTab?.fields.find((field) => field.path === 'tabs.trigger.padding')
    const indicatorField = tabsTab?.fields.find((field) => field.path === 'tabs.trigger.indicator.color')

    expect(tabsTab).toBeDefined()
    expect(tabsTab!.navigationKind).toBe('component')
    expect(paddingField?.referencePath).toBe('tabs.trigger.size.regular.padding')
    expect(indicatorField?.referencePath).toBe('color.primary')
  })

  it('registers toaster with preserved token references', () => {
    const toasterTab = STUDIO_TABS.find((tab) => tab.id === 'toaster')
    const zIndexField = toasterTab?.fields.find((field) => field.path === 'toaster.z-index')
    const gapField = toasterTab?.fields.find((field) => field.path === 'toaster.gap')

    expect(toasterTab).toBeDefined()
    expect(toasterTab!.navigationKind).toBe('component')
    expect(zIndexField?.referencePath).toBe('z-index.9')
    expect(gapField?.referencePath).toBe('space.sm')
  })

  it('registers box with preserved token references', () => {
    const boxTab = STUDIO_TABS.find((tab) => tab.id === 'box')
    const gapField = boxTab?.fields.find((field) => field.path === 'box.gap')

    expect(boxTab).toBeDefined()
    expect(boxTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })
})
