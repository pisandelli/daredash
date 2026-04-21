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
import ClusterPreview from './previews/ClusterPreview.vue'
import GridPreview from './previews/GridPreview.vue'
import LayoutPreview from './previews/LayoutPreview.vue'
import LoadingPreview from './previews/LoadingPreview.vue'
import ProgressPreview from './previews/ProgressPreview.vue'
import StackPreview from './previews/StackPreview.vue'
import ToastPreview from './previews/ToastPreview.vue'
import ToasterPreview from './previews/ToasterPreview.vue'
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
      componentField('toast.bg-color', 'Background Color', 'color', 'Colors'),
      componentField('toast.color', 'Text Color', 'color', 'Colors'),
      componentField('toast.border-color', 'Border Color', 'color', 'Colors'),
      componentField('toast.icon-color', 'Icon Color', 'color', 'Colors'),
      componentField('toast.close-color', 'Close Color', 'color', 'Close'),
      componentField('toast.close-hover-color', 'Close Hover Color', 'color', 'Close'),
      componentField('toast.close-hover-bg', 'Close Hover Background', 'color', 'Close')
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
  })
]
