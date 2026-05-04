import type { InjectionKey } from 'vue'

export interface StudioPreviewContext {
  focusField: (path: string) => void
  resolveFieldValue: (path: string) => string
}

export const STUDIO_PREVIEW_CONTEXT_KEY: InjectionKey<StudioPreviewContext> =
  Symbol('dd-studio-preview-context')
