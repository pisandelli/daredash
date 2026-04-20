<script setup lang="ts">
import { ref, computed, nextTick, provide } from 'vue'
import { useThemeEditor } from '#dd/composables/useThemeEditor'
import { STUDIO_TABS } from '../studio/registry'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../studio/interaction'
import type {
  StudioComponentCategory,
  StudioFieldDefinition,
  StudioTabDefinition
} from '../studio/types'

definePageMeta({ layout: false })

const tabs = STUDIO_TABS
const activeTabId = ref(tabs[0]?.id ?? 'base')
const componentSearch = ref('')
const isComponentPickerOpen = ref(false)

const activeTab = computed<StudioTabDefinition>(() => {
  return tabs.find((tab) => tab.id === activeTabId.value) ?? tabs[0]!
})

const foundationTabs = computed(() =>
  tabs.filter((tab) => tab.navigationKind === 'foundation')
)

const componentTabs = computed(() =>
  [...tabs]
    .filter((tab) => tab.navigationKind === 'component')
    .sort((a, b) => a.label.localeCompare(b.label))
)

const activeComponentTab = computed(() => {
  if (activeTab.value.navigationKind === 'component') return activeTab.value
  return componentTabs.value[0] ?? null
})

const filteredComponentTabs = computed(() => {
  const query = componentSearch.value.trim().toLowerCase()
  if (!query) return componentTabs.value
  return componentTabs.value.filter((tab) => tab.label.toLowerCase().includes(query))
})

const COMPONENT_CATEGORY_LABELS: Record<StudioComponentCategory, string> = {
  layout: 'Layout',
  primitive: 'Primitives',
  form: 'Forms',
  widget: 'Widgets'
}

const COMPONENT_CATEGORY_ORDER: StudioComponentCategory[] = [
  'layout',
  'primitive',
  'form',
  'widget'
]

const groupedComponentTabs = computed(() => {
  return COMPONENT_CATEGORY_ORDER
    .map((category) => ({
      category,
      label: COMPONENT_CATEGORY_LABELS[category],
      tabs: filteredComponentTabs.value.filter((tab) => tab.componentCategory === category)
    }))
    .filter((group) => group.tabs.length > 0)
})

const {
  values,
  literalValues,
  references,
  modes,
  hasChanges,
  previewStyle,
  previewCss,
  reset,
  downloadTokens,
  isFieldChanged,
  setLiteralValue,
  setReferencePath,
  setMode
} = useThemeEditor(tabs)

const isDownloading = ref(false)
async function handleDownload() {
  isDownloading.value = true
  await downloadTokens()
  setTimeout(() => (isDownloading.value = false), 1200)
}

const tabChangeCount = (tab: StudioTabDefinition) =>
  tab.fields.reduce((count, field) => {
    return isFieldChanged(field.path) ? count + 1 : count
  }, 0)

const componentChangeCount = computed(() =>
  componentTabs.value.reduce((count, tab) => count + tabChangeCount(tab), 0)
)

const groupedFields = computed(() => {
  const map = new Map<string, StudioFieldDefinition[]>()
  for (const field of activeTab.value.fields) {
    const group = field.group || 'General'
    if (!map.has(group)) map.set(group, [])
    map.get(group)!.push(field)
  }
  return Array.from(map.entries()).map(([label, fields]) => ({
    label,
    fields
  }))
})

function eventValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement | null)?.value ?? ''
}

function pathHasAny(path: string, fragments: string[]): boolean {
  return fragments.some((fragment) => path.includes(fragment))
}

function referencePlaceholder(field: StudioFieldDefinition): string {
  if (field.referencePath) return field.referencePath

  const pathParts = field.path.split('.')
  const root = pathParts[0] ?? ''
  const semanticColor = pathParts.find((part) =>
    ['primary', 'secondary', 'accent', 'success', 'danger', 'error', 'warning', 'info'].includes(part)
  )

  if (field.type === 'color' || field.path.includes('color')) {
    return semanticColor ? `color.${semanticColor}.500` : 'color.primary.500'
  }

  switch (root) {
    case 'font':
      return 'font.base'
    case 'font-size':
      return 'font-size.md'
    case 'font-weight':
      return 'font-weight.bold'
    case 'line-height':
      return 'line-height.normal'
    case 'letter-spacing':
      return 'letter-spacing.wide'
    case 'border-radius':
      return 'border-radius.md'
    case 'border-width':
      return 'border-width.sm'
    case 'transition':
      return 'transition.base'
    case 'shadow':
      return 'shadow.md'
    case 'space':
      return 'space.md'
    default:
      break
  }

  if (pathHasAny(field.path, ['font-size', 'icon-size'])) return 'font-size.md'
  if (pathHasAny(field.path, ['font-weight'])) return 'font-weight.bold'
  if (pathHasAny(field.path, ['line-height'])) return 'line-height.normal'
  if (pathHasAny(field.path, ['letter-spacing'])) return 'letter-spacing.wide'
  if (pathHasAny(field.path, ['border-radius'])) return 'border-radius.md'
  if (pathHasAny(field.path, ['border-width'])) return 'border-width.sm'
  if (pathHasAny(field.path, ['transition'])) return 'transition.base'
  if (pathHasAny(field.path, ['shadow'])) return 'shadow.md'
  if (pathHasAny(field.path, ['padding', 'gap', 'height', 'size'])) return 'space.md'

  return 'token.path'
}

function selectTab(tab: StudioTabDefinition): void {
  activeTabId.value = tab.id
  isComponentPickerOpen.value = false
}

function toggleComponentPicker(): void {
  isComponentPickerOpen.value = !isComponentPickerOpen.value
  if (isComponentPickerOpen.value) componentSearch.value = ''
}

async function focusField(path: string) {
  const ownerTab = tabs.find((tab) => tab.fields.some((field) => field.path === path))
  if (ownerTab && ownerTab.id !== activeTabId.value) {
    activeTabId.value = ownerTab.id
  }

  await nextTick()

  const target = document.getElementById(`field-${path}`) as HTMLElement | null
  if (!target) return

  target.closest('.dde-field')?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  })

  requestAnimationFrame(() => {
    target.focus({ preventScroll: true })
  })
}

provide(STUDIO_PREVIEW_CONTEXT_KEY, {
  focusField,
  resolveFieldValue: (path: string) => values.value[path] ?? ''
})
</script>

<template>
  <div class="dd-studio-root">
    <component
      :is="'style'"
      v-if="previewCss"
      type="text/css"
      v-text="previewCss"
    />

    <header class="dde-header">
      <div class="dde-header-brand">
        <span class="dde-header-logo">◈</span>
        <div class="dde-header-title">
          <span>DareDash Studio</span>
          <small>Theme Editor</small>
        </div>
      </div>
      <div class="dde-header-actions">
        <button
          class="dde-btn dde-btn-ghost"
          :disabled="!hasChanges"
          type="button"
          @click="reset"
        >
          Reset
        </button>
        <button
          class="dde-btn dde-btn-primary"
          :disabled="!hasChanges || isDownloading"
          type="button"
          @click="handleDownload"
        >
          <span v-if="isDownloading">Exporting…</span>
          <span v-else>Export tokens.json</span>
        </button>
      </div>
    </header>

    <main class="dde-split">
      <aside class="dde-panel dde-panel-form">
        <nav class="dde-tabs" role="tablist" aria-label="Token groups">
          <button
            v-for="tab in foundationTabs"
            :key="tab.id"
            role="tab"
            class="dde-tab"
            :class="{ 'dde-tab-active': activeTabId === tab.id }"
            :aria-selected="activeTabId === tab.id"
            type="button"
            @click="selectTab(tab)"
          >
            <span>{{ tab.label }}</span>
            <span v-if="tabChangeCount(tab)" class="dde-tab-badge">
              {{ tabChangeCount(tab) }}
            </span>
          </button>
          <div class="dde-component-picker">
            <button
              type="button"
              class="dde-tab dde-component-trigger"
              :class="{ 'dde-tab-active': activeTab.navigationKind === 'component' }"
              :aria-expanded="isComponentPickerOpen"
              aria-haspopup="listbox"
              @click="toggleComponentPicker"
            >
              <span>Components</span>
              <span v-if="componentChangeCount" class="dde-tab-badge">
                {{ componentChangeCount }}
              </span>
              <span class="dde-component-trigger-icon">⌄</span>
            </button>

            <div
              v-if="isComponentPickerOpen"
              class="dde-component-menu"
            >
              <input
                v-model="componentSearch"
                class="dde-component-search"
                type="search"
                placeholder="Search components..."
                autocomplete="off"
              />
              <div class="dde-component-list" role="listbox">
                <div
                  v-for="group in groupedComponentTabs"
                  :key="group.category"
                  class="dde-component-group"
                >
                  <p class="dde-component-separator">
                    {{ group.label }}
                  </p>
                  <button
                    v-for="tab in group.tabs"
                    :key="tab.id"
                    type="button"
                    class="dde-component-option"
                    :class="{ 'dde-component-option-active': activeTabId === tab.id }"
                    role="option"
                    :aria-selected="activeTabId === tab.id"
                    @click="selectTab(tab)"
                  >
                    <span class="dde-component-option-label">
                      {{ tab.label }}
                      <span
                        v-if="activeTabId === tab.id"
                        class="dde-component-selected-dot"
                        aria-hidden="true"
                      />
                    </span>
                    <span v-if="tabChangeCount(tab)" class="dde-tab-badge">
                      {{ tabChangeCount(tab) }}
                    </span>
                  </button>
                </div>
                <p
                  v-if="!groupedComponentTabs.length"
                  class="dde-component-empty"
                >
                  No components found.
                </p>
              </div>
            </div>
          </div>
        </nav>

        <div class="dde-fields" role="tabpanel">
          <section
            v-for="group in groupedFields"
            :key="group.label"
            class="dde-field-group"
          >
            <h3 class="dde-field-group-title">{{ group.label }}</h3>
            <div class="dde-field-group-body">
              <div
                v-for="field in group.fields"
                :key="field.path"
                class="dde-field"
                :data-field-path="field.path"
              >
                <label class="dde-field-label" :for="`field-${field.path}`">
                  <span>{{ field.label }}</span>
                  <code class="dde-field-path">{{ field.path }}</code>
                </label>
                <p v-if="field.description" class="dde-field-desc">
                  {{ field.description }}
                </p>

                <div
                  v-if="field.type !== 'select'"
                  class="dde-field-mode"
                  role="tablist"
                  :aria-label="`${field.label} input mode`"
                >
                  <button
                    type="button"
                    class="dde-field-mode-option"
                    :class="{ 'dde-field-mode-option-active': modes[field.path] === 'literal' }"
                    :aria-selected="modes[field.path] === 'literal'"
                    @click="setMode(field.path, 'literal')"
                  >
                    Literal
                  </button>
                  <button
                    type="button"
                    class="dde-field-mode-option"
                    :class="{ 'dde-field-mode-option-active': modes[field.path] === 'reference' }"
                    :aria-selected="modes[field.path] === 'reference'"
                    @click="setMode(field.path, 'reference')"
                  >
                    Reference
                  </button>
                </div>

                <div
                  v-if="field.type === 'color' && modes[field.path] !== 'reference'"
                  class="dde-color-wrapper"
                >
                  <input
                    :value="literalValues[field.path]"
                    type="color"
                    class="dde-color-swatch"
                    @input="setLiteralValue(field.path, eventValue($event))"
                  />
                  <input
                    :id="`field-${field.path}`"
                    :value="literalValues[field.path]"
                    type="text"
                    class="dde-color-text dde-field-focus-target"
                    spellcheck="false"
                    @input="setLiteralValue(field.path, eventValue($event))"
                  />
                </div>

                <div
                  v-else-if="field.type === 'color' && modes[field.path] === 'reference'"
                  class="dde-reference-stack"
                >
                  <div class="dde-color-wrapper dde-color-wrapper-readonly">
                    <input
                      :value="values[field.path]"
                      type="color"
                      class="dde-color-swatch"
                      disabled
                    />
                    <input
                      type="text"
                      class="dde-color-text dde-color-text-readonly"
                      :value="values[field.path]"
                      readonly
                    />
                  </div>
                  <input
                    :id="`field-${field.path}`"
                    :value="references[field.path]"
                    type="text"
                    class="dde-input dde-field-focus-target"
                    spellcheck="false"
                    :placeholder="referencePlaceholder(field)"
                    @input="setReferencePath(field.path, eventValue($event))"
                  />
                </div>

                <select
                  v-else-if="field.type === 'select'"
                  :id="`field-${field.path}`"
                  :value="literalValues[field.path]"
                  class="dde-input dde-field-focus-target"
                  @change="setLiteralValue(field.path, eventValue($event))"
                >
                  <option
                    v-for="opt in field.options"
                    :key="opt"
                    :value="opt"
                  >
                    {{ opt }}
                  </option>
                </select>

                <input
                  v-else-if="modes[field.path] !== 'reference'"
                  :id="`field-${field.path}`"
                  :value="literalValues[field.path]"
                  type="text"
                  class="dde-input dde-field-focus-target"
                  spellcheck="false"
                  @input="setLiteralValue(field.path, eventValue($event))"
                />

                <div
                  v-else
                  class="dde-reference-stack"
                >
                  <input
                    type="text"
                    class="dde-input dde-input-readonly"
                    :value="values[field.path]"
                    readonly
                  />
                  <input
                    :id="`field-${field.path}`"
                    :value="references[field.path]"
                    type="text"
                    class="dde-input dde-field-focus-target"
                    spellcheck="false"
                    :placeholder="referencePlaceholder(field)"
                    @input="setReferencePath(field.path, eventValue($event))"
                  />
                </div>

                <div
                  v-if="references[field.path] || field.referencePath"
                  class="dde-field-meta"
                >
                  <span class="dde-field-meta-badge">Reference</span>
                  <code>{{ references[field.path] || field.referencePath }}</code>
                </div>

                <span
                  v-if="isFieldChanged(field.path)"
                  class="dde-field-changed"
                  title="Modified"
                >●</span>
              </div>
            </div>
          </section>
        </div>
      </aside>

      <section class="dde-panel dde-panel-preview">
        <div class="dde-preview-canvas">
          <div class="dd-studio-preview-scope" :style="previewStyle">
            <component :is="activeTab.preview" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
.dd-studio-root {
  --studio-bg: #0f1115;
  --studio-panel: #151821;
  --studio-panel-soft: #1b1f2a;
  --studio-field: #1e2431;
  --studio-border: rgba(255 255 255 / 0.08);
  --studio-text: #eef0f7;
  --studio-text-muted: #8a93a8;
  --studio-text-code: #9ad0c2;
  --studio-accent: #2f9b8f;
  --studio-accent-glow: rgba(47 155 143 / 0.28);
  --studio-radius-sm: 6px;
  --studio-radius-md: 10px;
  --studio-radius-lg: 14px;
  --studio-header-h: 3.75rem;
  --studio-font: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --studio-code-font: 'JetBrains Mono', 'Fira Code', monospace;

  display: grid;
  grid-template-rows: var(--studio-header-h) 1fr;
  min-block-size: 100dvh;
  inline-size: 100%;
  overflow: hidden;
  background: var(--studio-bg);
  font-family: var(--studio-font);
  color: var(--studio-text);
}

.dde-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 1.5rem;
  border-block-end: 1px solid var(--studio-border);
  background: rgba(15 17 21 / 0.9);
  backdrop-filter: blur(12px);
  gap: 1rem;
}

.dde-header-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dde-header-logo {
  font-size: 1.25rem;
  color: var(--studio-accent);
  line-height: 1;
}

.dde-header-title {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}

.dde-header-title small {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--studio-text-muted);
}

.dde-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dde-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding-inline: 0.875rem;
  block-size: 2rem;
  border-radius: var(--studio-radius-sm);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 140ms ease-in-out;
  white-space: nowrap;
  border: 1px solid transparent;
}

.dde-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.dde-btn-ghost {
  background: transparent;
  color: var(--studio-text-muted);
  border-color: var(--studio-border);
}

.dde-btn-ghost:hover:not(:disabled) {
  background: rgba(255 255 255 / 0.05);
  color: var(--studio-text);
}

.dde-btn-primary {
  background: var(--studio-accent);
  color: #fff;
}

.dde-btn-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--studio-accent) 85%, black);
  box-shadow: 0 0 0 3px var(--studio-accent-glow);
}

.dde-split {
  display: grid;
  grid-template-columns: 380px 1fr;
  block-size: calc(100dvh - var(--studio-header-h));
  min-block-size: 0;
  overflow: hidden;
}

.dde-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-block-size: 0;
}

.dde-panel-form {
  border-inline-end: 1px solid var(--studio-border);
  background: var(--studio-panel);
}

.dde-tabs {
  display: flex;
  padding-inline: 1rem;
  padding-block-start: 0.75rem;
  gap: 0.35rem;
  border-block-end: 1px solid var(--studio-border);
  background: var(--studio-panel);
  flex-shrink: 0;
  flex-wrap: nowrap;
  position: relative;
  z-index: 4;
}

.dde-tab {
  flex: 0 0 auto;
  padding-inline: 0.78rem;
  padding-block: 0.45rem;
  border-radius: var(--studio-radius-sm) var(--studio-radius-sm) 0 0;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--studio-text-muted);
  transition: all 140ms ease-in-out;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.dde-tab:hover {
  color: var(--studio-text);
  background: rgba(255 255 255 / 0.04);
}

.dde-tab.dde-tab-active {
  color: var(--studio-accent);
  background: var(--studio-panel-soft);
}

.dde-tab.dde-tab-active::after {
  content: '';
  position: absolute;
  inset-block-end: -1px;
  inset-inline: 0;
  block-size: 2px;
  background: var(--studio-accent);
  border-radius: 2px 2px 0 0;
}

.dde-tab-badge {
  min-inline-size: 1.35rem;
  padding-inline: 0.4rem;
  block-size: 1.1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  background: rgba(255 255 255 / 0.08);
  color: var(--studio-text);
}

.dde-component-picker {
  position: relative;
  min-inline-size: 0;
}

.dde-component-trigger {
  padding-inline-end: 0.65rem;
}

.dde-component-trigger-icon {
  color: var(--studio-text-muted);
  font-size: 0.9rem;
  line-height: 1;
  transform: translateY(-0.05rem);
}

.dde-component-menu {
  position: absolute;
  inset-block-start: calc(100% + 0.5rem);
  inset-inline-end: 0;
  inline-size: min(18rem, calc(100vw - 2rem));
  padding: 0.6rem;
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius-md);
  background: #11151e;
  box-shadow: 0 18px 45px rgba(0 0 0 / 0.32);
}

.dde-component-search {
  inline-size: 100%;
  block-size: 2.2rem;
  padding-inline: 0.7rem;
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius-sm);
  background: var(--studio-field);
  color: var(--studio-text);
  font-family: inherit;
  font-size: 0.82rem;
}

.dde-component-search:focus {
  outline: none;
  border-color: var(--studio-accent);
  box-shadow: 0 0 0 3px var(--studio-accent-glow);
}

.dde-component-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-block-size: 16rem;
  overflow-y: auto;
  margin-block-start: 0.55rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255 255 255 / 0.14) transparent;
}

.dde-component-list::-webkit-scrollbar {
  inline-size: 0.45rem;
}

.dde-component-list::-webkit-scrollbar-track {
  background: transparent;
}

.dde-component-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255 255 255 / 0.14);
}

.dde-component-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255 255 255 / 0.22);
}

.dde-component-group {
  display: grid;
  gap: 0.2rem;
}

.dde-component-separator {
  margin: 0;
  padding: 0.2rem 0.45rem 0.45rem;
  border-bottom: 1px solid var(--studio-border);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--studio-text-muted);
}

.dde-component-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  inline-size: 100%;
  min-block-size: 2.25rem;
  padding-inline: 0.65rem;
  border: 0;
  border-radius: var(--studio-radius-sm);
  background: transparent;
  color: var(--studio-text-muted);
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.dde-component-option-label {
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
  gap: 0.45rem;
}

.dde-component-selected-dot {
  flex: 0 0 auto;
  inline-size: 0.42rem;
  block-size: 0.42rem;
  border-radius: 999px;
  background: var(--studio-accent);
  box-shadow: 0 0 0 3px rgba(47 155 143 / 0.14);
}

.dde-component-option:hover,
.dde-component-option-active {
  background: rgba(255 255 255 / 0.06);
  color: var(--studio-text);
}

.dde-component-option-active {
  color: var(--studio-accent);
}

.dde-component-empty {
  margin: 0;
  padding: 0.8rem 0.5rem;
  color: var(--studio-text-muted);
  font-size: 0.8rem;
}

.dde-fields {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255 255 255 / 0.14) transparent;
}

.dde-fields::-webkit-scrollbar {
  inline-size: 0.45rem;
}

.dde-fields::-webkit-scrollbar-track {
  background: transparent;
}

.dde-fields::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255 255 255 / 0.14);
}

.dde-fields::-webkit-scrollbar-thumb:hover {
  background: rgba(255 255 255 / 0.22);
}

.dde-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dde-field-group-title {
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--studio-text-muted);
}

.dde-field-group-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dde-field {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.5rem 0.75rem;
  align-items: center;
  position: relative;
  padding: 0.85rem;
  border: 1px solid rgba(255 255 255 / 0.05);
  border-radius: var(--studio-radius-md);
  background: rgba(255 255 255 / 0.02);
}

.dde-field-label {
  grid-column: 1;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--studio-text);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dde-field-path {
  font-size: 0.7rem;
  font-family: var(--studio-code-font);
  color: var(--studio-text-code);
  opacity: 0.8;
}

.dde-field-desc {
  grid-column: 1 / -1;
  font-size: 0.78rem;
  color: var(--studio-text-muted);
  margin: -0.1rem 0 0.1rem;
}

.dde-field-mode {
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  inline-size: fit-content;
  padding: 0.2rem;
  border-radius: 999px;
  border: 1px solid var(--studio-border);
  background: rgba(255 255 255 / 0.03);
}

.dde-field-mode-option {
  border: 0;
  background: transparent;
  color: var(--studio-text-muted);
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background-color 140ms ease, color 140ms ease;
}

.dde-field-mode-option:hover {
  color: var(--studio-text);
}

.dde-field-mode-option-active {
  background: rgba(47 155 143 / 0.18);
  color: var(--studio-text);
}

.dde-field-meta {
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: -0.05rem;
  color: var(--studio-text-muted);
  font-size: 0.72rem;
}

.dde-field-meta-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-block-size: 1.3rem;
  padding-inline: 0.45rem;
  border-radius: 999px;
  background: rgba(47 155 143 / 0.14);
  color: #7ee0d5;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dde-field-meta code {
  font-family: var(--studio-code-font);
  color: var(--studio-text-code);
  font-size: 0.72rem;
}

.dde-field-changed {
  grid-column: 2;
  grid-row: 1;
  font-size: 0.5rem;
  color: var(--studio-accent);
  align-self: start;
  padding-block-start: 0.2rem;
}

.dde-input {
  grid-column: 1 / -1;
  block-size: 2.15rem;
  padding-inline: 0.625rem;
  background: var(--studio-field);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius-sm);
  color: var(--studio-text);
  font-family: var(--studio-code-font);
  font-size: 0.84rem;
  transition: border-color 140ms ease-in-out;
  inline-size: 100%;
  min-inline-size: 0;
}

.dde-input:focus {
  outline: none;
  border-color: var(--studio-accent);
  box-shadow: 0 0 0 3px var(--studio-accent-glow);
}

.dde-input option {
  background: var(--studio-field);
  color: var(--studio-text);
}

.dde-color-wrapper {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.dde-color-wrapper-readonly {
  opacity: 0.92;
}

.dde-color-swatch {
  flex-shrink: 0;
  inline-size: 2.15rem;
  block-size: 2.15rem;
  border-radius: var(--studio-radius-sm);
  border: 1px solid var(--studio-border);
  padding: 0.15rem;
  background: var(--studio-field);
  cursor: pointer;
}

.dde-color-swatch::-webkit-color-swatch-wrapper {
  padding: 0;
  border-radius: 4px;
}

.dde-color-swatch::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.dde-color-swatch::-moz-color-swatch {
  border: none;
  border-radius: 4px;
}

.dde-color-text {
  flex: 1;
  min-inline-size: 0;
  block-size: 2.15rem;
  padding-inline: 0.625rem;
  background: var(--studio-field);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius-sm);
  color: var(--studio-text);
  font-family: var(--studio-code-font);
  font-size: 0.84rem;
  transition: border-color 140ms ease-in-out;
}

.dde-color-text-readonly,
.dde-input-readonly {
  opacity: 0.82;
  cursor: default;
}

.dde-color-text:focus {
  outline: none;
  border-color: var(--studio-accent);
  box-shadow: 0 0 0 3px var(--studio-accent-glow);
}

.dde-reference-stack {
  grid-column: 1 / -1;
  display: grid;
  gap: 0.6rem;
}

.dde-panel-preview {
  overflow-y: auto;
  background:
    radial-gradient(ellipse 60% 40% at 70% 20%, rgba(47 155 143 / 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 30% at 30% 80%, rgba(0 149 199 / 0.05) 0%, transparent 60%),
    #f4f6f9;
}

.dde-preview-canvas {
  padding: 2rem;
  min-block-size: 100%;
}

.dd-studio-preview-scope {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #ffffff;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 24px 60px rgba(15 23 42 / 0.08);
}

.dd-studio-preview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dd-studio-preview-header h2 {
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  color: #0f172a;
}

.dd-studio-preview-header p {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.dd-studio-preview-block {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.dd-studio-preview-block h3 {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94a3b8;
}

.dd-studio-preview-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.dd-studio-preview-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 1024px) {
  .dde-split {
    grid-template-columns: 1fr;
  }

  .dde-panel-form {
    border-inline-end: none;
    border-block-end: 1px solid var(--studio-border);
  }
}
</style>
