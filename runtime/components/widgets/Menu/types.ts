export type MenuItemActionType =
  | { type: 'link'; to: string; target?: '_blank' | '_self' | '_parent' | '_top' }
  | { type: 'action'; handler: () => void }
  | { type: 'none' }

export interface MenuBadge {
  label: string | number
  color?: string
}

export interface MenuSeparator {
  type: 'separator'
  label?: string
  icon?: string
}

export interface MenuItem {
  key: string
  label: string
  icon?: string
  badge?: MenuBadge
  disabled?: boolean
  active?: boolean
  float?: boolean
  children?: MenuEntry[]
  action: MenuItemActionType
}

export type MenuEntry = MenuItem | MenuSeparator

export function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return (entry as MenuSeparator).type === 'separator'
}
