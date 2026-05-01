import type { StudioTabDefinition } from './types'
import type { StudioComponentTokenId } from './componentTokens'
import type { StudioComponentCategory } from './types'
import BasePreview from './previews/BasePreview.vue'
import TypographyPreview from './previews/TypographyPreview.vue'
import AccordionPreview from './previews/AccordionPreview.vue'
import ButtonPreview from './previews/ButtonPreview.vue'
import BadgePreview from './previews/BadgePreview.vue'
import BreadcrumbPreview from './previews/BreadcrumbPreview.vue'
import BoxPreview from './previews/BoxPreview.vue'
import AlertPreview from './previews/AlertPreview.vue'
import AnchorPreview from './previews/AnchorPreview.vue'
import AvatarPreview from './previews/AvatarPreview.vue'
import CardPreview from './previews/CardPreview.vue'
import CenterPreview from './previews/CenterPreview.vue'
import CheckboxPreview from './previews/CheckboxPreview.vue'
import ClusterPreview from './previews/ClusterPreview.vue'
import DrawerPreview from './previews/DrawerPreview.vue'
import GridPreview from './previews/GridPreview.vue'
import InputGroupPreview from './previews/InputGroupPreview.vue'
import InputPreview from './previews/InputPreview.vue'
import InputSearchPreview from './previews/InputSearchPreview.vue'
import LayoutPreview from './previews/LayoutPreview.vue'
import LoadingPreview from './previews/LoadingPreview.vue'
import MenuPreview from './previews/MenuPreview.vue'
import ModalPreview from './previews/ModalPreview.vue'
import PaginationPreview from './previews/PaginationPreview.vue'
import PopoverPreview from './previews/PopoverPreview.vue'
import ProgressPreview from './previews/ProgressPreview.vue'
import RadioPreview from './previews/RadioPreview.vue'
import SelectPreview from './previews/SelectPreview.vue'
import StackPreview from './previews/StackPreview.vue'
import TablePreview from './previews/TablePreview.vue'
import TabsPreview from './previews/TabsPreview.vue'
import TextareaPreview from './previews/TextareaPreview.vue'
import ToastPreview from './previews/ToastPreview.vue'
import ToasterPreview from './previews/ToasterPreview.vue'
import TogglePreview from './previews/TogglePreview.vue'
import {
  primitiveStudioFields,
  rawTokenValue,
  tokenReference,
  tokenValue,
  typographyStudioFields
} from './tokens'
import type { StudioFieldDefinition } from './types'

function foundationTab(tab: StudioTabDefinition): StudioTabDefinition {
  return tab
}

function componentTab(
  id: StudioComponentTokenId,
  category: StudioComponentCategory,
  tab: Omit<StudioTabDefinition, 'id' | 'navigationKind' | 'tokenGroup'>
): StudioTabDefinition {
  return {
    id,
    navigationKind: 'component',
    tokenGroup: 'components',
    componentCategory: category,
    ...tab
  }
}

function componentField(
  path: string,
  label: string,
  type: StudioFieldDefinition['type'],
  group: string,
  fallback?: string
): StudioFieldDefinition {
  return {
    path,
    label,
    type,
    defaultValue: tokenValue(path, fallback),
    rawDefaultValue: rawTokenValue(path),
    referencePath: tokenReference(path),
    group
  }
}

function toastSemanticIconField(variant: string, label: string): StudioFieldDefinition {
  return componentField(`toast.${variant}.icon-color`, `${label} Icon Color`, 'color', 'Semantic Icons')
}

function toastSolidVariantFields(variant: string, label: string): StudioFieldDefinition[] {
  return [
    componentField(`toast.solid.${variant}.background`, `${label} Background`, 'text', `Solid ${label}`),
    componentField(`toast.solid.${variant}.color`, `${label} Text`, 'color', `Solid ${label}`),
    componentField(`toast.solid.${variant}.icon-color`, `${label} Icon`, 'color', `Solid ${label}`),
    componentField(`toast.solid.${variant}.close-hover-bg`, `${label} Close Hover`, 'color', `Solid ${label}`)
  ]
}

export const STUDIO_TABS: StudioTabDefinition[] = [
  foundationTab({
    id: 'base',
    label: 'Base',
    navigationKind: 'foundation',
    tokenGroup: 'primitives',
    preview: BasePreview,
    fields: primitiveStudioFields()
  }),
  foundationTab({
    id: 'typography',
    label: 'Typography',
    navigationKind: 'foundation',
    tokenGroup: 'primitives',
    preview: TypographyPreview,
    fields: typographyStudioFields()
  }),
  componentTab('accordion', 'widget', {
    label: 'Accordion',
    preview: AccordionPreview,
    fields: [
      componentField('accordion.accent-color', 'Accent Color', 'color', 'Core'),
      componentField('accordion.border-width', 'Border Width', 'text', 'Core'),
      componentField('accordion.border-color', 'Border Color', 'color', 'Core'),
      componentField('accordion.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('accordion.header.background-color', 'Header Background', 'color', 'Header'),
      componentField('accordion.header.background-color-hover', 'Header Hover Background', 'color', 'Header'),
      componentField('accordion.header.padding', 'Header Padding', 'text', 'Header'),
      componentField('accordion.header.font-family', 'Header Font Family', 'text', 'Header'),
      componentField('accordion.header.font-size', 'Header Font Size', 'text', 'Header'),
      componentField('accordion.header.font-weight', 'Header Font Weight', 'text', 'Header'),
      componentField('accordion.header.icon-size', 'Header Icon Size', 'text', 'Header'),
      componentField('accordion.header.chevron-size', 'Chevron Size', 'text', 'Header'),
      componentField('accordion.header.gap', 'Header Gap', 'text', 'Header'),
      componentField('accordion.header.title-gap', 'Title Gap', 'text', 'Header'),
      componentField('accordion.content.padding', 'Content Padding', 'text', 'Content'),
      componentField('accordion.content.background-color', 'Content Background', 'color', 'Content'),
      componentField('accordion.content.font-family', 'Content Font Family', 'text', 'Content')
    ]
  }),
  componentTab('drawer', 'widget', {
    label: 'Drawer',
    preview: DrawerPreview,
    fields: [
      componentField('drawer.bg', 'Background', 'color', 'Core'),
      componentField('drawer.box-shadow', 'Box Shadow', 'text', 'Core'),
      componentField('drawer.z-index', 'Z-Index', 'text', 'Core'),
      componentField('drawer.padding', 'Padding', 'text', 'Core'),
      componentField('drawer.size', 'Drawer Size', 'text', 'Core'),
      componentField('drawer.close-size', 'Close Size', 'text', 'Header'),
      componentField('drawer.title.font-size', 'Title Font Size', 'text', 'Header'),
      componentField('drawer.title.font-weight', 'Title Font Weight', 'text', 'Header'),
      componentField('drawer.header.border-color', 'Header Border Color', 'color', 'Header'),
      componentField('drawer.header.border-style', 'Header Border Style', 'text', 'Header'),
      componentField('drawer.header.border-width', 'Header Border Width', 'text', 'Header'),
      componentField('drawer.footer.border-color', 'Footer Border Color', 'color', 'Footer'),
      componentField('drawer.footer.border-style', 'Footer Border Style', 'text', 'Footer'),
      componentField('drawer.footer.border-width', 'Footer Border Width', 'text', 'Footer'),
      componentField('drawer.backdrop.background-color', 'Backdrop Background', 'text', 'Backdrop'),
      componentField('drawer.backdrop.filter', 'Backdrop Filter', 'text', 'Backdrop')
    ]
  }),
  componentTab('button', 'primitive', {
    label: 'Button',
    preview: ButtonPreview,
    fields: [
      componentField('button.base-color', 'Base Color', 'color', 'Core'),
      componentField('button.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('button.font-family', 'Font Family', 'text', 'Core'),
      componentField('button.font-weight', 'Font Weight', 'text', 'Core', '500'),
      {
        path: 'button.text-transform',
        label: 'Text Transform',
        type: 'select',
        options: ['uppercase', 'none', 'capitalize', 'lowercase'],
        defaultValue: tokenValue('button.text-transform'),
        rawDefaultValue: rawTokenValue('button.text-transform'),
        referencePath: tokenReference('button.text-transform'),
        group: 'Core'
      },
      componentField('button.sizes.tiny.height', 'Height (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.tiny.padding', 'Padding (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.tiny.font-size', 'Font Size (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.tiny.icon-size', 'Icon Size (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.small.height', 'Height (small)', 'text', 'Sizes'),
      componentField('button.sizes.small.padding', 'Padding (small)', 'text', 'Sizes'),
      componentField('button.sizes.small.font-size', 'Font Size (small)', 'text', 'Sizes'),
      componentField('button.sizes.small.icon-size', 'Icon Size (small)', 'text', 'Sizes'),
      componentField('button.sizes.regular.height', 'Height (regular)', 'text', 'Sizes'),
      componentField('button.sizes.regular.padding', 'Padding (regular)', 'text', 'Sizes'),
      componentField('button.sizes.regular.font-size', 'Font Size (regular)', 'text', 'Sizes'),
      componentField('button.sizes.regular.icon-size', 'Icon Size (regular)', 'text', 'Sizes'),
      componentField('button.sizes.large.height', 'Height (large)', 'text', 'Sizes'),
      componentField('button.sizes.large.padding', 'Padding (large)', 'text', 'Sizes'),
      componentField('button.sizes.large.font-size', 'Font Size (large)', 'text', 'Sizes'),
      componentField('button.sizes.large.icon-size', 'Icon Size (large)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.height', 'Height (xlarge)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.padding', 'Padding (xlarge)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.font-size', 'Font Size (xlarge)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.icon-size', 'Icon Size (xlarge)', 'text', 'Sizes'),
      componentField('button.primary.base-color', 'Primary Color', 'color', 'Semantic'),
      componentField('button.success.base-color', 'Success Color', 'color', 'Semantic'),
      componentField('button.warning.base-color', 'Warning Color', 'color', 'Semantic'),
      componentField('button.danger.base-color', 'Danger Color', 'color', 'Semantic', '#ef4444'),
      componentField('button.info.base-color', 'Info Color', 'color', 'Semantic')
    ]
  }),
  componentTab('badge', 'primitive', {
    label: 'Badge',
    preview: BadgePreview,
    fields: [
      componentField('badge.base-color', 'Base Color', 'color', 'Core'),
      componentField('badge.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('badge.font-size', 'Font Size', 'text', 'Typography'),
      componentField('badge.font-weight', 'Font Weight', 'text', 'Typography'),
      componentField('badge.letter-spacing', 'Letter Spacing', 'text', 'Typography'),
      {
        path: 'badge.text-transform',
        label: 'Text Transform',
        type: 'select',
        options: ['none', 'uppercase', 'capitalize', 'lowercase'],
        defaultValue: tokenValue('badge.text-transform'),
        rawDefaultValue: rawTokenValue('badge.text-transform'),
        referencePath: tokenReference('badge.text-transform'),
        group: 'Typography'
      },
      componentField('badge.icon-size', 'Icon Size', 'text', 'Typography'),
      componentField('badge.gap', 'Gap', 'text', 'Spacing'),
      componentField('badge.padding.inline', 'Padding Inline', 'text', 'Spacing'),
      componentField('badge.padding.block', 'Padding Block', 'text', 'Spacing'),
      componentField('badge.primary.base-color', 'Primary Color', 'color', 'Semantic', '#0984e3'),
      componentField('badge.success.base-color', 'Success Color', 'color', 'Semantic'),
      componentField('badge.warning.base-color', 'Warning Color', 'color', 'Semantic'),
      componentField('badge.danger.base-color', 'Danger Color', 'color', 'Semantic', '#ef4444'),
      componentField('badge.info.base-color', 'Info Color', 'color', 'Semantic')
    ]
  }),
  componentTab('breadcrumbs', 'primitive', {
    label: 'Breadcrumbs',
    preview: BreadcrumbPreview,
    fields: [
      componentField('breadcrumbs.font-size', 'Font Size', 'text', 'Typography'),
      componentField('breadcrumbs.font-family', 'Font Family', 'text', 'Typography'),
      componentField('breadcrumbs.gap', 'Gap', 'text', 'Spacing'),
      componentField('breadcrumbs.item.color', 'Item Color', 'color', 'Items'),
      componentField('breadcrumbs.item.hover-color', 'Item Hover Color', 'color', 'Items'),
      componentField('breadcrumbs.item-current.color', 'Current Item Color', 'color', 'Current'),
      componentField('breadcrumbs.item-current.font-weight', 'Current Item Weight', 'text', 'Current', '700'),
      componentField('breadcrumbs.separator.color', 'Separator Color', 'color', 'Separator')
    ]
  }),
  componentTab('card', 'primitive', {
    label: 'Card',
    preview: CardPreview,
    fields: [
      componentField('card.background-color', 'Background Color', 'color', 'Core'),
      componentField('card.color', 'Text Color', 'color', 'Core'),
      componentField('card.border-color', 'Border Color', 'color', 'Core'),
      componentField('card.border-width', 'Border Width', 'text', 'Core'),
      componentField('card.border-style', 'Border Style', 'text', 'Core'),
      componentField('card.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('card.box-shadow', 'Box Shadow', 'text', 'Core'),
      componentField('card.max-width', 'Max Width', 'text', 'Layout'),
      componentField('card.padding', 'Body Padding', 'text', 'Layout'),
      componentField('card.header.padding', 'Header Padding', 'text', 'Header'),
      componentField('card.header.border-color', 'Header Border Color', 'color', 'Header'),
      componentField('card.header.border-width', 'Header Border Width', 'text', 'Header'),
      componentField('card.footer.padding', 'Footer Padding', 'text', 'Footer'),
      componentField('card.footer.border-color', 'Footer Border Color', 'color', 'Footer'),
      componentField('card.footer.border-width', 'Footer Border Width', 'text', 'Footer')
    ]
  }),
  componentTab('center', 'layout', {
    label: 'Center',
    preview: CenterPreview,
    fields: [
      componentField('center.gap', 'Inline Padding', 'text', 'Layout'),
      componentField('center.max-width', 'Max Width', 'text', 'Layout')
    ]
  }),
  componentTab('cluster', 'layout', {
    label: 'Cluster',
    preview: ClusterPreview,
    fields: [
      componentField('cluster.gap', 'Base Gap', 'text', 'Layout'),
      componentField('cluster.narrow.gap', 'Narrow Gap', 'text', 'Variants'),
      componentField('cluster.wide.gap', 'Wide Gap', 'text', 'Variants')
    ]
  }),
  componentTab('grid', 'layout', {
    label: 'Grid',
    preview: GridPreview,
    fields: [
      componentField('grid.column-min-width', 'Column Min Width', 'text', 'Layout'),
      componentField('grid.gap', 'Gap', 'text', 'Layout')
    ]
  }),
  componentTab('layout', 'layout', {
    label: 'Layout',
    preview: LayoutPreview,
    fields: [
      componentField('layout.header-height', 'Header Height', 'text', 'Structure'),
      componentField('layout.gap', 'Section Gap', 'text', 'Structure'),
      componentField('layout.footer-height', 'Footer Height', 'text', 'Structure')
    ]
  }),
  componentTab('loading', 'primitive', {
    label: 'Loading',
    preview: LoadingPreview,
    fields: [
      componentField('loading.animation', 'Animation', 'text', 'Core'),
      componentField('loading.color', 'Color', 'color', 'Core'),
      componentField('loading.font-family', 'Font Family', 'text', 'Typography'),
      componentField('loading.icon-size', 'Icon Size', 'text', 'Core'),
      componentField('loading.gap', 'Gap', 'text', 'Spacing')
    ]
  }),
  componentTab('progress', 'primitive', {
    label: 'Progress',
    preview: ProgressPreview,
    fields: [
      componentField('progress.background-color', 'Track Color', 'color', 'Core'),
      componentField('progress.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('progress.indicator.background-color', 'Indicator Color', 'color', 'Indicator'),
      componentField('progress.indicator.transition', 'Indicator Transition', 'text', 'Indicator'),
      componentField('progress.indicator.primary.base-color', 'Primary Indicator', 'color', 'Semantic'),
      componentField('progress.indicator.success.base-color', 'Success Indicator', 'color', 'Semantic'),
      componentField('progress.indicator.warning.base-color', 'Warning Indicator', 'color', 'Semantic'),
      componentField('progress.indicator.danger.base-color', 'Danger Indicator', 'color', 'Semantic'),
      componentField('progress.indicator.info.base-color', 'Info Indicator', 'color', 'Semantic'),
      componentField('progress.label.font-family', 'Label Font Family', 'text', 'Label'),
      componentField('progress.label.font-size', 'Label Font Size', 'text', 'Label'),
      componentField('progress.label.color', 'Label Color', 'color', 'Label'),
      componentField('progress.tooltip.background-color', 'Tooltip Background', 'color', 'Tooltip'),
      componentField('progress.tooltip.color', 'Tooltip Color', 'color', 'Tooltip'),
      componentField('progress.tooltip.font-size', 'Tooltip Font Size', 'text', 'Tooltip'),
      componentField('progress.tooltip.border-radius', 'Tooltip Radius', 'text', 'Tooltip'),
      componentField('progress.tooltip.padding', 'Tooltip Padding', 'text', 'Tooltip'),
      componentField('progress.tooltip.z-index', 'Tooltip Z-Index', 'text', 'Tooltip'),
      componentField('progress.height.tiny', 'Height (tiny)', 'text', 'Sizes'),
      componentField('progress.height.small', 'Height (small)', 'text', 'Sizes'),
      componentField('progress.height.regular', 'Height (regular)', 'text', 'Sizes'),
      componentField('progress.height.large', 'Height (large)', 'text', 'Sizes'),
      componentField('progress.height.xlarge', 'Height (xlarge)', 'text', 'Sizes')
    ]
  }),
  componentTab('toast', 'primitive', {
    label: 'Toast',
    preview: ToastPreview,
    fields: [
      componentField('toast.padding', 'Padding', 'text', 'Core'),
      componentField('toast.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('toast.font-family', 'Font Family', 'text', 'Typography'),
      componentField('toast.box-shadow', 'Box Shadow', 'text', 'Core'),
      componentField('toast.cluster-gap', 'Content Gap', 'text', 'Layout'),
      componentField('toast.close-size', 'Close Size', 'text', 'Close'),
      componentField('toast.background', 'Background', 'text', 'Colors'),
      componentField('toast.color', 'Text Color', 'color', 'Colors'),
      componentField('toast.border-color', 'Border Color', 'color', 'Colors'),
      componentField('toast.icon-color', 'Icon Color', 'color', 'Colors'),
      toastSemanticIconField('success', 'Success'),
      toastSemanticIconField('warning', 'Warning'),
      toastSemanticIconField('danger', 'Danger'),
      toastSemanticIconField('error', 'Error'),
      toastSemanticIconField('info', 'Info'),
      componentField('toast.close-color', 'Close Color', 'color', 'Close'),
      componentField('toast.close-hover-color', 'Close Hover Color', 'color', 'Close'),
      componentField('toast.close-hover-bg', 'Close Hover Background', 'color', 'Close'),
      ...toastSolidVariantFields('primary', 'Primary'),
      ...toastSolidVariantFields('success', 'Success'),
      ...toastSolidVariantFields('warning', 'Warning'),
      ...toastSolidVariantFields('danger', 'Danger'),
      ...toastSolidVariantFields('error', 'Error'),
      ...toastSolidVariantFields('info', 'Info')
    ]
  }),
  componentTab('stack', 'layout', {
    label: 'Stack',
    preview: StackPreview,
    fields: [
      componentField('stack.gap', 'Base Gap', 'text', 'Layout'),
      componentField('stack.compact.gap', 'Compact Gap', 'text', 'Variants'),
      componentField('stack.spaced.gap', 'Spaced Gap', 'text', 'Variants')
    ]
  }),
  componentTab('box', 'layout', {
    label: 'Box',
    preview: BoxPreview,
    fields: [
      componentField('box.gap', 'All-Sides Padding', 'text', 'Core')
    ]
  }),
  componentTab('toaster', 'primitive', {
    label: 'Toaster',
    preview: ToasterPreview,
    fields: [
      componentField('toaster.z-index', 'Z-Index', 'text', 'Core'),
      componentField('toaster.gap', 'Toast Gap', 'text', 'Core'),
      componentField('toaster.position.top', 'Top Offset', 'text', 'Position'),
      componentField('toaster.position.right', 'Right Offset', 'text', 'Position'),
      componentField('toaster.position.bottom', 'Bottom Offset', 'text', 'Position'),
      componentField('toaster.position.left', 'Left Offset', 'text', 'Position')
    ]
  }),
  componentTab('alert', 'primitive', {
    label: 'Alert',
    preview: AlertPreview,
    fields: [
      componentField('alert.base-color', 'Base Color', 'color', 'Core'),
      componentField('alert.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('alert.padding', 'Padding', 'text', 'Core'),
      componentField('alert.gap', 'Gap', 'text', 'Core'),
      componentField('alert.font-family', 'Font Family', 'text', 'Typography'),
      componentField('alert.font-size', 'Font Size', 'text', 'Typography'),
      componentField('alert.line-height', 'Line Height', 'text', 'Typography'),
      componentField('alert.icon-size', 'Icon Size', 'text', 'Typography'),
      componentField('alert.title.font-weight', 'Title Weight', 'text', 'Title'),
      componentField('alert.title.font-size', 'Title Size', 'text', 'Title'),
      componentField('alert.close.size', 'Close Size', 'text', 'Close'),
      componentField('alert.close.opacity', 'Close Opacity', 'text', 'Close'),
      componentField('alert.close.hover-opacity', 'Close Hover Opacity', 'text', 'Close'),
      componentField('alert.primary.base-color', 'Primary Color', 'color', 'Semantic'),
      componentField('alert.success.base-color', 'Success Color', 'color', 'Semantic'),
      componentField('alert.warning.base-color', 'Warning Color', 'color', 'Semantic'),
      componentField('alert.danger.base-color', 'Danger Color', 'color', 'Semantic', '#ef4444'),
      componentField('alert.error.base-color', 'Error Color', 'color', 'Semantic', '#ef4444'),
      componentField('alert.info.base-color', 'Info Color', 'color', 'Semantic')    ]
  }),
  componentTab('anchor', 'widget', {
    label: 'Anchor',
    preview: AnchorPreview,
    fields: [
      componentField('anchor.active-font-weight', 'Active Font Weight', 'text', 'Typography'),
      componentField('anchor.font-family', 'Font Family', 'text', 'Typography'),
      componentField('anchor.font-size', 'Font Size', 'text', 'Typography'),
      componentField('anchor.active-color', 'Active Color', 'color', 'Core'),
      componentField('anchor.border-color', 'Border Color', 'color', 'Core'),
      componentField('anchor.indicator-color', 'Indicator Color', 'color', 'Core'),
      componentField('anchor.indicator-width', 'Indicator Width', 'text', 'Core'),
      componentField('anchor.link-color', 'Link Color', 'color', 'Core'),
      componentField('anchor.link-color-hover', 'Link Hover Color', 'color', 'Core'),
      componentField('anchor.indicator-color-hover', 'Indicator Hover', 'color', 'Core'),
      componentField('anchor.item-bg-hover', 'Hover Background', 'color', 'Core'),
      componentField('anchor.item-radius', 'Item Radius', 'text', 'Core'),
      componentField('anchor.padding-inline', 'Padding Inline', 'text', 'Spacing'),
      componentField('anchor.padding-block', 'Padding Block', 'text', 'Spacing')
    ]
  }),
  componentTab('menu', 'widget', {
    label: 'Menu',
    preview: MenuPreview,
    fields: [
      componentField('menu.bg', 'Background', 'color', 'Core'),
      componentField('menu.border-color', 'Border Color', 'color', 'Core'),
      componentField('menu.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('menu.width', 'Expanded Width', 'text', 'Core'),
      componentField('menu.width-collapsed', 'Collapsed Width', 'text', 'Core'),
      componentField('menu.transition', 'Transition', 'text', 'Core'),
      componentField('menu.z-index', 'Z-Index', 'text', 'Core'),
      componentField('menu.item.padding-block', 'Item Padding Block', 'text', 'Items'),
      componentField('menu.item.padding-inline', 'Item Padding Inline', 'text', 'Items'),
      componentField('menu.item.border-radius', 'Item Radius', 'text', 'Items'),
      componentField('menu.item.color', 'Item Color', 'color', 'Items'),
      componentField('menu.item.color-active', 'Item Active Color', 'color', 'Items'),
      componentField('menu.item.color-disabled', 'Item Disabled Color', 'color', 'Items'),
      componentField('menu.item.bg-hover', 'Item Hover Background', 'color', 'Items'),
      componentField('menu.item.bg-active', 'Item Active Background', 'color', 'Items'),
      componentField('menu.item.icon-size', 'Item Icon Size', 'text', 'Items'),
      componentField('menu.item.font-size', 'Item Font Size', 'text', 'Items'),
      componentField('menu.item.font-weight', 'Item Font Weight', 'text', 'Items'),
      componentField('menu.item.font-weight-active', 'Item Active Weight', 'text', 'Items'),
      componentField('menu.separator.color', 'Separator Color', 'color', 'Separator'),
      componentField('menu.separator.font-size', 'Separator Font Size', 'text', 'Separator'),
      componentField('menu.separator.font-weight', 'Separator Font Weight', 'text', 'Separator'),
      componentField('menu.separator.letter-spacing', 'Separator Letter Spacing', 'text', 'Separator'),
      componentField('menu.separator.border-color', 'Separator Border Color', 'color', 'Separator'),
      componentField('menu.separator.padding-block', 'Separator Padding', 'text', 'Separator'),
      componentField('menu.float.bg', 'Float Background', 'color', 'Float'),
      componentField('menu.float.border-color', 'Float Border Color', 'color', 'Float'),
      componentField('menu.float.shadow', 'Float Shadow', 'text', 'Float'),
      componentField('menu.float.border-radius', 'Float Radius', 'text', 'Float'),
      componentField('menu.float.min-width', 'Float Min Width', 'text', 'Float'),
      componentField('menu.float.z-index', 'Float Z-Index', 'text', 'Float'),
      componentField('menu.toggle.color', 'Toggle Color', 'color', 'Toggle'),
      componentField('menu.toggle.bg-hover', 'Toggle Hover Background', 'color', 'Toggle'),
      componentField('menu.toggle.border-radius', 'Toggle Radius', 'text', 'Toggle'),
      componentField('menu.toggle.icon-size', 'Toggle Icon Size', 'text', 'Toggle')
    ]
  }),
  componentTab('modal', 'widget', {
    label: 'Modal',
    preview: ModalPreview,
    fields: [
      componentField('modal.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('modal.box-shadow', 'Box Shadow', 'text', 'Core'),
      componentField('modal.inline-size', 'Inline Size', 'text', 'Core'),
      componentField('modal.max-inline-size', 'Max Inline Size', 'text', 'Core'),
      componentField('modal.z-index', 'Z-Index', 'text', 'Core'),
      componentField('modal.close-size', 'Close Size', 'text', 'Header'),
      componentField('modal.backdrop.filter', 'Backdrop Filter', 'text', 'Backdrop'),
      componentField('modal.backdrop.background-color', 'Backdrop Background', 'text', 'Backdrop'),
      componentField('modal.title.font-size', 'Title Font Size', 'text', 'Header'),
      componentField('modal.title.font-weight', 'Title Font Weight', 'text', 'Header'),
      componentField('modal.body.font-family', 'Body Font Family', 'text', 'Body'),
      componentField('modal.padding', 'Padding', 'text', 'Core')
    ]
  }),
  componentTab('pagination', 'widget', {
    label: 'Pagination',
    preview: PaginationPreview,
    fields: [
      componentField('pagination.font-size', 'Font Size', 'text', 'Core'),
      componentField('pagination.color', 'Color', 'color', 'Core'),
      componentField('pagination.bg', 'Background', 'text', 'Core'),
      componentField('pagination.border-color', 'Border Color', 'color', 'Core'),
      componentField('pagination.color-hover', 'Hover Color', 'color', 'Hover'),
      componentField('pagination.bg-hover', 'Hover Background', 'text', 'Hover'),
      componentField('pagination.border-hover', 'Hover Border', 'color', 'Hover'),
      componentField('pagination.color-active', 'Active Color', 'color', 'Active'),
      componentField('pagination.bg-active', 'Active Background', 'text', 'Active'),
      componentField('pagination.border-active', 'Active Border', 'color', 'Active'),
      componentField('pagination.color-disabled', 'Disabled Color', 'color', 'Disabled'),
      componentField('pagination.bg-disabled', 'Disabled Background', 'color', 'Disabled'),
      componentField('pagination.border-disabled', 'Disabled Border', 'color', 'Disabled'),
      componentField('pagination.size', 'Default Size', 'text', 'Sizing'),
      componentField('pagination.size-small', 'Small Size', 'text', 'Sizing'),
      componentField('pagination.radius', 'Radius', 'text', 'Sizing')
    ]
  }),
  componentTab('popover', 'widget', {
    label: 'Popover',
    preview: PopoverPreview,
    fields: [
      componentField('popover.bg', 'Background', 'color', 'Core'),
      componentField('popover.border-color', 'Border Color', 'color', 'Core'),
      componentField('popover.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('popover.shadow', 'Shadow', 'text', 'Core'),
      componentField('popover.padding', 'Padding', 'text', 'Core'),
      componentField('popover.arrow-size', 'Arrow Size', 'text', 'Core'),
      componentField('popover.color', 'Text Color', 'color', 'Core'),
      componentField('popover.z-index', 'Z-Index', 'text', 'Core')
    ]
  }),
  componentTab('avatar', 'primitive', {
    label: 'Avatar',
    preview: AvatarPreview,
    fields: [
      componentField('avatar.size', 'Base Size', 'text', 'Core'),
      componentField('avatar.overlap', 'Group Overlap', 'text', 'Core'),
      componentField('avatar.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('avatar.background-color', 'Background Color', 'color', 'Colors'),
      componentField('avatar.color', 'Text Color', 'color', 'Colors'),
      componentField('avatar.font-size', 'Font Size', 'text', 'Typography'),
      componentField('avatar.font-weight', 'Font Weight', 'text', 'Typography', '500'),
      componentField('avatar.sm.size', 'Small Size', 'text', 'Sizes'),
      componentField('avatar.sm.font-size', 'Small Font Size', 'text', 'Sizes'),
      componentField('avatar.lg.size', 'Large Size', 'text', 'Sizes'),
      componentField('avatar.lg.font-size', 'Large Font Size', 'text', 'Sizes')
    ]
  }),
  componentTab('checkbox', 'form', {
    label: 'Checkbox',
    preview: CheckboxPreview,
    fields: [
      componentField('checkbox.size', 'Size', 'text', 'Core'),
      componentField('checkbox.gap', 'Gap', 'text', 'Core'),
      componentField('checkbox.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('checkbox.bg', 'Background', 'color', 'Colors'),
      componentField('checkbox.border', 'Border Color', 'color', 'Colors'),
      componentField('checkbox.hover.border', 'Hover Border', 'color', 'States'),
      componentField('checkbox.checked.bg', 'Checked Background', 'color', 'States'),
      componentField('checkbox.checked.border', 'Checked Border', 'color', 'States'),
      componentField('checkbox.disabled.bg', 'Disabled Background', 'color', 'States'),
      componentField('checkbox.disabled.border', 'Disabled Border', 'color', 'States'),
      componentField('checkbox.transition', 'Transition', 'text', 'States'),
      componentField('checkbox.font-size', 'Label Font Size', 'text', 'Label'),
      componentField('checkbox.color', 'Label Color', 'color', 'Label'),
      componentField('checkbox.line-height', 'Label Line Height', 'text', 'Label')
    ]
  }),
  componentTab('input', 'form', {
    label: 'Input',
    preview: InputPreview,
    fields: [
      componentField('input.background-color', 'Background Color', 'color', 'Core'),
      componentField('input.height', 'Height', 'text', 'Core'),
      componentField('input.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('input.border-width', 'Border Width', 'text', 'Core'),
      componentField('input.border-style', 'Border Style', 'text', 'Core'),
      componentField('input.border-color', 'Border Color', 'color', 'Core'),
      componentField('input.color', 'Text Color', 'color', 'Core'),
      componentField('input.font-family', 'Font Family', 'text', 'Typography'),
      componentField('input.font-size', 'Font Size', 'text', 'Typography'),
      componentField('input.font-weight', 'Font Weight', 'text', 'Typography'),
      componentField('input.line-height', 'Line Height', 'text', 'Typography'),
      componentField('input.placeholder.color', 'Placeholder Color', 'color', 'Typography'),
      componentField('input.padding.inline.start', 'Padding Inline Start', 'text', 'Spacing'),
      componentField('input.padding.inline.end', 'Padding Inline End', 'text', 'Spacing'),
      componentField('input.padding.block.start', 'Padding Block Start', 'text', 'Spacing'),
      componentField('input.padding.block.end', 'Padding Block End', 'text', 'Spacing'),
      componentField('input.size.small.height', 'Small Height', 'text', 'Sizes'),
      componentField('input.size.small.font-size', 'Small Font Size', 'text', 'Sizes'),
      componentField('input.size.small.padding-inline', 'Small Padding Inline', 'text', 'Sizes'),
      componentField('input.size.large.height', 'Large Height', 'text', 'Sizes'),
      componentField('input.size.large.font-size', 'Large Font Size', 'text', 'Sizes'),
      componentField('input.size.large.padding-inline', 'Large Padding Inline', 'text', 'Sizes'),
      componentField('input.label.color', 'Label Color', 'color', 'Label'),
      componentField('input.label.font-size', 'Label Font Size', 'text', 'Label'),
      componentField('input.label.font-weight', 'Label Font Weight', 'text', 'Label'),
      componentField('input.focus.border-color', 'Focus Border Color', 'color', 'Focus'),
      componentField('input.focus.box-shadow', 'Focus Box Shadow', 'text', 'Focus'),
      componentField('input.focus.outline', 'Focus Outline', 'text', 'Focus'),
      componentField('input.disabled.background-color', 'Disabled Background', 'color', 'Disabled'),
      componentField('input.disabled.color', 'Disabled Text', 'color', 'Disabled'),
      componentField('input.disabled.cursor', 'Disabled Cursor', 'text', 'Disabled'),
      componentField('input.error-state.border-color', 'Error Border', 'color', 'Validation'),
      componentField('input.warning-state.border-color', 'Warning Border', 'color', 'Validation'),
      componentField('input.success-state.border-color', 'Success Border', 'color', 'Validation'),
      componentField('input.error-label.font-family', 'Error Font Family', 'text', 'Messages'),
      componentField('input.error-label.font-weight', 'Error Font Weight', 'text', 'Messages'),
      componentField('input.error-label.color', 'Error Color', 'color', 'Messages'),
      componentField('input.error-label.font-size', 'Error Font Size', 'text', 'Messages'),
      componentField('input.warning-label.color', 'Warning Color', 'color', 'Messages')
    ]
  }),
  componentTab('input-group', 'form', {
    label: 'Input Group',
    preview: InputGroupPreview,
    fields: [
      componentField('input-group.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('input-group.border-color', 'Border Color', 'color', 'Core'),
      componentField('input-group.border-width', 'Border Width', 'text', 'Core'),
      componentField('input-group.border-style', 'Border Style', 'text', 'Core'),
      componentField('input-group.addon.background-color', 'Addon Background', 'color', 'Addon'),
      componentField('input-group.addon.color', 'Addon Color', 'color', 'Addon'),
      componentField('input-group.addon.border-color', 'Addon Border Color', 'color', 'Addon'),
      componentField('input-group.addon.font-size', 'Addon Font Size', 'text', 'Addon'),
      componentField('input-group.addon.padding-inline', 'Addon Padding Inline', 'text', 'Addon')
    ]
  }),
  componentTab('input-search', 'form', {
    label: 'Input Search',
    preview: InputSearchPreview,
    fields: [
      componentField('input-search.group.border-radius', 'Group Border Radius', 'text', 'Group'),
      componentField('input-search.group.border-color', 'Group Border Color', 'color', 'Group'),
      componentField('input-search.group.border-width', 'Group Border Width', 'text', 'Group'),
      componentField('input-search.group.border-style', 'Group Border Style', 'text', 'Group'),
      componentField('input-search.button.background-color', 'Button Background', 'color', 'Button'),
      componentField('input-search.button.color', 'Button Text Color', 'color', 'Button'),
      componentField('input-search.button.border-radius', 'Button Radius', 'text', 'Button'),
      componentField('input-search.button.hover-background-color', 'Button Hover Background', 'text', 'Button'),
      componentField('input-search.button.icon-size', 'Button Icon Size', 'text', 'Button'),
      componentField('input-search.button.font-size', 'Button Font Size', 'text', 'Button'),
      componentField('input-search.button.font-weight', 'Button Font Weight', 'text', 'Button'),
      componentField('input-search.button.padding-inline', 'Button Padding Inline', 'text', 'Button'),
      componentField('input-search.button.success.background-color', 'Success Background', 'color', 'Semantic'),
      componentField('input-search.button.success.hover-background-color', 'Success Hover', 'text', 'Semantic'),
      componentField('input-search.button.danger.background-color', 'Danger Background', 'color', 'Semantic'),
      componentField('input-search.button.danger.hover-background-color', 'Danger Hover', 'text', 'Semantic'),
      componentField('input-search.button.neutral.background-color', 'Neutral Background', 'color', 'Semantic'),
      componentField('input-search.button.neutral.color', 'Neutral Text', 'color', 'Semantic'),
      componentField('input-search.button.neutral.hover-background-color', 'Neutral Hover', 'color', 'Semantic')
    ]
  }),
  componentTab('radio', 'form', {
    label: 'Radio',
    preview: RadioPreview,
    fields: [
      componentField('radio.size', 'Size', 'text', 'Core'),
      componentField('radio.gap', 'Gap', 'text', 'Core'),
      componentField('radio.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('radio.bg', 'Background', 'color', 'Colors'),
      componentField('radio.border', 'Border Color', 'color', 'Colors'),
      componentField('radio.hover.border', 'Hover Border', 'color', 'States'),
      componentField('radio.checked.border', 'Checked Border', 'color', 'States'),
      componentField('radio.checked.dot-color', 'Checked Dot Color', 'color', 'States'),
      componentField('radio.checked.dot-color-svg', 'Checked Dot Color SVG', 'text', 'States'),
      componentField('radio.disabled.bg', 'Disabled Background', 'color', 'States'),
      componentField('radio.disabled.border', 'Disabled Border', 'color', 'States'),
      componentField('radio.disabled.dot-color-svg', 'Disabled Dot SVG', 'text', 'States'),
      componentField('radio.transition', 'Transition', 'text', 'States'),
      componentField('radio.font-size', 'Label Font Size', 'text', 'Label'),
      componentField('radio.color', 'Label Color', 'color', 'Label'),
      componentField('radio.line-height', 'Label Line Height', 'text', 'Label')
    ]
  }),
  componentTab('select', 'form', {
    label: 'Select',
    preview: SelectPreview,
    fields: [
      componentField('select.indicator-padding-inline-end', 'Indicator Padding End', 'text', 'Core'),
      componentField('select.height', 'Height', 'text', 'Core'),
      componentField('select.background-color', 'Background Color', 'color', 'Core'),
      componentField('select.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('select.border-width', 'Border Width', 'text', 'Core'),
      componentField('select.border-style', 'Border Style', 'text', 'Core'),
      componentField('select.border-color', 'Border Color', 'color', 'Core'),
      componentField('select.color', 'Text Color', 'color', 'Core'),
      componentField('select.font-family', 'Font Family', 'text', 'Typography'),
      componentField('select.font-size', 'Font Size', 'text', 'Typography'),
      componentField('select.font-weight', 'Font Weight', 'text', 'Typography'),
      componentField('select.line-height', 'Line Height', 'text', 'Typography'),
      componentField('select.transition', 'Transition', 'text', 'Typography'),
      componentField('select.padding.inline.start', 'Padding Inline Start', 'text', 'Spacing'),
      componentField('select.padding.inline.end', 'Padding Inline End', 'text', 'Spacing'),
      componentField('select.padding.block.start', 'Padding Block Start', 'text', 'Spacing'),
      componentField('select.padding.block.end', 'Padding Block End', 'text', 'Spacing'),
      componentField('select.label.color', 'Label Color', 'color', 'Label'),
      componentField('select.label.font-size', 'Label Font Size', 'text', 'Label'),
      componentField('select.label.font-weight', 'Label Font Weight', 'text', 'Label'),
      componentField('select.hover.border-color', 'Hover Border Color', 'color', 'Focus'),
      componentField('select.focus.border-color', 'Focus Border Color', 'color', 'Focus'),
      componentField('select.focus.box-shadow', 'Focus Box Shadow', 'text', 'Focus'),
      componentField('select.focus.outline', 'Focus Outline', 'text', 'Focus'),
      componentField('select.disabled.background-color', 'Disabled Background', 'color', 'Disabled'),
      componentField('select.disabled.color', 'Disabled Text', 'color', 'Disabled'),
      componentField('select.disabled.cursor', 'Disabled Cursor', 'text', 'Disabled'),
      componentField('select.disabled.border-color', 'Disabled Border', 'color', 'Disabled'),
      componentField('select.error-state.border-color', 'Error Border', 'color', 'Validation'),
      componentField('select.success-state.border-color', 'Success Border', 'color', 'Validation'),
      componentField('select.warning-state.border-color', 'Warning Border', 'color', 'Validation'),
      componentField('select.error-label.font-family', 'Error Font Family', 'text', 'Messages'),
      componentField('select.error-label.font-weight', 'Error Font Weight', 'text', 'Messages'),
      componentField('select.error-label.color', 'Error Color', 'color', 'Messages'),
      componentField('select.error-label.font-size', 'Error Font Size', 'text', 'Messages'),
      componentField('select.arrow.color', 'Arrow Color', 'color', 'Arrow'),
      componentField('select.arrow.size', 'Arrow Size', 'text', 'Arrow'),
      componentField('select.menu.background-color', 'Menu Background', 'color', 'Menu'),
      componentField('select.menu.border-radius', 'Menu Radius', 'text', 'Menu'),
      componentField('select.menu.box-shadow', 'Menu Shadow', 'text', 'Menu'),
      componentField('select.menu.z-index', 'Menu Z-Index', 'text', 'Menu'),
      componentField('select.option.padding', 'Option Padding', 'text', 'Options'),
      componentField('select.option.hover-background-color', 'Option Hover Background', 'color', 'Options'),
      componentField('select.option.selected-background-color', 'Selected Background', 'color', 'Options')
    ]
  }),
  componentTab('switch', 'form', {
    label: 'Toggle',
    preview: TogglePreview,
    fields: [
      componentField('switch.font-size', 'Base Font Size', 'text', 'Core'),
      componentField('switch.transition', 'Transition', 'text', 'Core'),
      componentField('switch.thumb.size', 'Thumb Size', 'text', 'Thumb'),
      componentField('switch.thumb.background-color', 'Thumb Background', 'color', 'Thumb'),
      componentField('switch.thumb.box-shadow', 'Thumb Shadow', 'text', 'Thumb'),
      componentField('switch.thumb.translate-x', 'Thumb Translate X', 'text', 'Thumb'),
      componentField('switch.track.width', 'Track Width', 'text', 'Track'),
      componentField('switch.track.height', 'Track Height', 'text', 'Track'),
      componentField('switch.track.padding', 'Track Padding', 'text', 'Track'),
      componentField('switch.track.border-radius', 'Track Radius', 'text', 'Track'),
      componentField('switch.track.background-color', 'Track Background', 'color', 'Track'),
      componentField('switch.track.background-color-active', 'Track Active Background', 'color', 'Track'),
      componentField('switch.primary.track.background-color-active', 'Primary Active Background', 'color', 'Semantic'),
      componentField('switch.success.track.background-color-active', 'Success Active Background', 'color', 'Semantic'),
      componentField('switch.warning.track.background-color-active', 'Warning Active Background', 'color', 'Semantic'),
      componentField('switch.danger.track.background-color-active', 'Danger Active Background', 'color', 'Semantic'),
      componentField('switch.info.track.background-color-active', 'Info Active Background', 'color', 'Semantic'),
      componentField('switch.focus', 'Focus Ring', 'text', 'States'),
      componentField('switch.disabled.opacity', 'Disabled Opacity', 'text', 'Disabled'),
      componentField('switch.disabled.cursor', 'Disabled Cursor', 'text', 'Disabled')
    ]
  }),
  componentTab('textarea', 'form', {
    label: 'Textarea',
    preview: TextareaPreview,
    fields: [
      componentField('textarea.background-color', 'Background Color', 'color', 'Core'),
      componentField('textarea.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('textarea.border-width', 'Border Width', 'text', 'Core'),
      componentField('textarea.border-style', 'Border Style', 'text', 'Core'),
      componentField('textarea.border-color', 'Border Color', 'color', 'Core'),
      componentField('textarea.color', 'Text Color', 'color', 'Core'),
      componentField('textarea.font-family', 'Font Family', 'text', 'Typography'),
      componentField('textarea.font-size', 'Font Size', 'text', 'Typography'),
      componentField('textarea.font-weight', 'Font Weight', 'text', 'Typography'),
      componentField('textarea.padding.inline.start', 'Padding Inline Start', 'text', 'Spacing'),
      componentField('textarea.padding.inline.end', 'Padding Inline End', 'text', 'Spacing'),
      componentField('textarea.padding.block.start', 'Padding Block Start', 'text', 'Spacing'),
      componentField('textarea.padding.block.end', 'Padding Block End', 'text', 'Spacing'),
      componentField('textarea.label.color', 'Label Color', 'color', 'Label'),
      componentField('textarea.label.font-size', 'Label Font Size', 'text', 'Label'),
      componentField('textarea.label.font-weight', 'Label Font Weight', 'text', 'Label'),
      componentField('textarea.focus.border-color', 'Focus Border Color', 'color', 'Focus'),
      componentField('textarea.focus.box-shadow', 'Focus Box Shadow', 'text', 'Focus'),
      componentField('textarea.focus.outline', 'Focus Outline', 'text', 'Focus'),
      componentField('textarea.disabled.background-color', 'Disabled Background', 'color', 'Disabled'),
      componentField('textarea.disabled.color', 'Disabled Text', 'color', 'Disabled'),
      componentField('textarea.disabled.cursor', 'Disabled Cursor', 'text', 'Disabled'),
      componentField('textarea.disabled.border-color', 'Disabled Border', 'color', 'Disabled'),
      componentField('textarea.error-state.border-color', 'Error Border', 'color', 'Validation'),
      componentField('textarea.success-state.border-color', 'Success Border', 'color', 'Validation'),
      componentField('textarea.warning-state.border-color', 'Warning Border', 'color', 'Validation'),
      componentField('textarea.error-label.font-family', 'Error Font Family', 'text', 'Messages'),
      componentField('textarea.error-label.font-weight', 'Error Font Weight', 'text', 'Messages'),
      componentField('textarea.error-label.color', 'Error Color', 'color', 'Messages'),
      componentField('textarea.error-label.font-size', 'Error Font Size', 'text', 'Messages'),
      componentField('textarea.min-height', 'Minimum Height', 'text', 'Layout'),
      componentField('textarea.resize', 'Resize Mode', 'text', 'Layout')
    ]
  }),
  componentTab('table', 'widget', {
    label: 'Table',
    preview: TablePreview,
    fields: [
      componentField('table.width', 'Width', 'text', 'Core'),
      componentField('table.color', 'Text Color', 'color', 'Core'),
      componentField('table.border-color', 'Border Color', 'color', 'Core'),
      componentField('table.border-width', 'Border Width', 'text', 'Core'),
      componentField('table.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('table.border-collapse', 'Border Collapse', 'text', 'Core'),
      componentField('table.header.background-color', 'Header Background', 'color', 'Header'),
      componentField('table.header.color', 'Header Color', 'color', 'Header'),
      componentField('table.header.font-family', 'Header Font Family', 'text', 'Header'),
      componentField('table.header.font-weight', 'Header Font Weight', 'text', 'Header'),
      componentField('table.header.text-transform', 'Header Transform', 'text', 'Header'),
      componentField('table.header.text-align', 'Header Align', 'text', 'Header'),
      componentField('table.header.padding', 'Header Padding', 'text', 'Header'),
      componentField('table.cell.padding', 'Cell Padding', 'text', 'Cell'),
      componentField('table.cell.border-color', 'Cell Border Color', 'color', 'Cell'),
      componentField('table.cell.border-width', 'Cell Border Width', 'text', 'Cell'),
      componentField('table.cell.text-align', 'Cell Align', 'text', 'Cell'),
      componentField('table.row-striped.background-color', 'Striped Row Background', 'color', 'Rows'),
      componentField('table.row-hover.background-color', 'Hover Row Background', 'color', 'Rows'),
      componentField('table.empty-state.color', 'Empty State Color', 'color', 'Feedback'),
      componentField('table.error-state.background-color', 'Error Background', 'color', 'Feedback'),
      componentField('table.error-state.color', 'Error Text', 'color', 'Feedback')
    ]
  }),
  componentTab('tabs', 'widget', {
    label: 'Tabs',
    preview: TabsPreview,
    fields: [
      componentField('tabs.list.border-color', 'List Border Color', 'color', 'List'),
      componentField('tabs.list.border-width', 'List Border Width', 'text', 'List'),
      componentField('tabs.list.gap', 'List Gap', 'text', 'List'),
      componentField('tabs.list.padding', 'List Padding', 'text', 'List'),
      componentField('tabs.trigger.base-color', 'Trigger Base Color', 'color', 'Trigger'),
      componentField('tabs.trigger.padding', 'Trigger Padding', 'text', 'Trigger'),
      componentField('tabs.trigger.font-family', 'Trigger Font Family', 'text', 'Trigger'),
      componentField('tabs.trigger.font-size', 'Trigger Font Size', 'text', 'Trigger'),
      componentField('tabs.trigger.font-weight', 'Trigger Font Weight', 'text', 'Trigger'),
      componentField('tabs.trigger.color', 'Trigger Color', 'color', 'Trigger'),
      componentField('tabs.trigger.bg', 'Trigger Background', 'text', 'Trigger'),
      componentField('tabs.trigger.border-width', 'Trigger Border Width', 'text', 'Trigger'),
      componentField('tabs.trigger.border-radius', 'Trigger Radius', 'text', 'Trigger'),
      componentField('tabs.trigger.icon-size', 'Trigger Icon Size', 'text', 'Trigger'),
      componentField('tabs.trigger.hover.color', 'Hover Color', 'color', 'Hover'),
      componentField('tabs.trigger.hover.bg', 'Hover Background', 'text', 'Hover'),
      componentField('tabs.trigger.active.color', 'Active Color', 'color', 'Active'),
      componentField('tabs.trigger.active.border-color', 'Active Border Color', 'color', 'Active'),
      componentField('tabs.trigger.active.bg', 'Active Background', 'text', 'Active'),
      componentField('tabs.trigger.indicator.color', 'Indicator Color', 'color', 'Indicator'),
      componentField('tabs.trigger.indicator.size', 'Indicator Size', 'text', 'Indicator'),
      componentField('tabs.trigger.size.small.padding', 'Small Padding', 'text', 'Sizes'),
      componentField('tabs.trigger.size.small.font-size', 'Small Font Size', 'text', 'Sizes'),
      componentField('tabs.trigger.size.regular.padding', 'Regular Padding', 'text', 'Sizes'),
      componentField('tabs.trigger.size.regular.font-size', 'Regular Font Size', 'text', 'Sizes'),
      componentField('tabs.trigger.size.large.padding', 'Large Padding', 'text', 'Sizes'),
      componentField('tabs.trigger.size.large.font-size', 'Large Font Size', 'text', 'Sizes'),
      componentField('tabs.panel.padding', 'Panel Padding', 'text', 'Panel')
    ]
  })
]
