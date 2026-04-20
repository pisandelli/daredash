import accordion from '../assets/styles/tokens/default-theme/components/accordion.json'
import alert from '../assets/styles/tokens/default-theme/components/alert.json'
import anchor from '../assets/styles/tokens/default-theme/components/anchor.json'
import badge from '../assets/styles/tokens/default-theme/components/badge.json'
import button from '../assets/styles/tokens/default-theme/components/button.json'

export const STUDIO_COMPONENT_TOKENS = {
  accordion,
  alert,
  anchor,
  badge,
  button
} as const

export type StudioComponentTokenId = keyof typeof STUDIO_COMPONENT_TOKENS
