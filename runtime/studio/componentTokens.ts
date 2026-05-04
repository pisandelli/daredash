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
import checkbox from '../assets/styles/tokens/default-theme/components/checkbox.json'
import cluster from '../assets/styles/tokens/default-theme/components/cluster.json'
import drawer from '../assets/styles/tokens/default-theme/components/drawer.json'
import grid from '../assets/styles/tokens/default-theme/components/grid.json'
import input from '../assets/styles/tokens/default-theme/components/input.json'
import inputGroup from '../assets/styles/tokens/default-theme/components/input-group.json'
import inputSearch from '../assets/styles/tokens/default-theme/components/input-search.json'
import layout from '../assets/styles/tokens/default-theme/components/layout.json'
import loading from '../assets/styles/tokens/default-theme/components/loading.json'
import menu from '../assets/styles/tokens/default-theme/components/menu.json'
import modal from '../assets/styles/tokens/default-theme/components/modal.json'
import pagination from '../assets/styles/tokens/default-theme/components/pagination.json'
import popover from '../assets/styles/tokens/default-theme/components/popover.json'
import progress from '../assets/styles/tokens/default-theme/components/progress.json'
import radio from '../assets/styles/tokens/default-theme/components/radio.json'
import select from '../assets/styles/tokens/default-theme/components/select.json'
import sidebar from '../assets/styles/tokens/default-theme/components/sidebar.json'
import stack from '../assets/styles/tokens/default-theme/components/stack.json'
import switchComponent from '../assets/styles/tokens/default-theme/components/switch.json'
import table from '../assets/styles/tokens/default-theme/components/table.json'
import tabs from '../assets/styles/tokens/default-theme/components/tabs.json'
import textarea from '../assets/styles/tokens/default-theme/components/textarea.json'
import toast from '../assets/styles/tokens/default-theme/components/toast.json'
import toaster from '../assets/styles/tokens/default-theme/components/toaster.json'

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
  checkbox,
  cluster,
  drawer,
  grid,
  input,
  'input-group': inputGroup,
  'input-search': inputSearch,
  layout,
  loading,
  menu,
  modal,
  pagination,
  popover,
  progress,
  radio,
  select,
  sidebar,
  stack,
  switch: switchComponent,
  table,
  tabs,
  textarea,
  toast,
  toaster
} as const

export type StudioComponentTokenId = keyof typeof STUDIO_COMPONENT_TOKENS
