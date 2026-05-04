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
export type StudioComponentCategory = 'layout' | 'primitive' | 'form' | 'widget'
export type StudioPreviewMode = 'real' | 'guided'

export interface StudioTabDefinition {
  id: string
  label: string
  navigationKind: StudioNavigationKind
  tokenGroup: StudioTokenGroup
  componentCategory?: StudioComponentCategory
  previewMode?: StudioPreviewMode
  previewMessage?: string
  fields: StudioFieldDefinition[]
  preview: Component
}
