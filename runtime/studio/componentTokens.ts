import accordion from '../assets/styles/tokens/default-theme/components/accordion.json'
import alert from '../assets/styles/tokens/default-theme/components/alert.json'
import anchor from '../assets/styles/tokens/default-theme/components/anchor.json'
import avatar from '../assets/styles/tokens/default-theme/components/avatar.json'
import badge from '../assets/styles/tokens/default-theme/components/badge.json'
import breadcrumbs from '../assets/styles/tokens/default-theme/components/breadcrumbs.json'
import box from '../assets/styles/tokens/default-theme/components/box.json'
import button from '../assets/styles/tokens/default-theme/components/button.json'
import card from '../assets/styles/tokens/default-theme/components/card.json'
import center from '../assets/styles/tokens/default-theme/components/center.json'
import cluster from '../assets/styles/tokens/default-theme/components/cluster.json'
import grid from '../assets/styles/tokens/default-theme/components/grid.json'
import layout from '../assets/styles/tokens/default-theme/components/layout.json'
import stack from '../assets/styles/tokens/default-theme/components/stack.json'

export const STUDIO_COMPONENT_TOKENS = {
  accordion,
  alert,
  anchor,
  avatar,
  badge,
  breadcrumbs,
  box,
  button,
  card,
  center,
  cluster,
  grid,
  layout,
  stack
} as const

export type StudioComponentTokenId = keyof typeof STUDIO_COMPONENT_TOKENS
