import type { Component } from 'vue'

export type StudioFieldType = 'color' | 'text' | 'select'

export interface StudioFieldDefinition {
  path: string
  label: string
  type: StudioFieldType
  defaultValue: string
  referencePath?: string
  rawDefaultValue?: string
  options?: string[]
  description?: string
  group?: string
}

export type StudioTokenGroup = 'primitives' | 'components'
export type StudioNavigationKind = 'foundation' | 'component'

export interface StudioTabDefinition {
  id: string
  label: string
  navigationKind: StudioNavigationKind
  tokenGroup: StudioTokenGroup
  fields: StudioFieldDefinition[]
  preview: Component
}
