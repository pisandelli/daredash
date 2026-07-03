<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { StudioTabDefinition, StudioComponentCategory } from '../../studio/types'
import type { TokenEditorMode } from '../../composables/useThemeEditor'
import StudioField from './StudioField.vue'

const props = defineProps<{
  foundationTabs: StudioTabDefinition[]
  activeTabId: string
  activeTab: StudioTabDefinition
  componentSearch: string
  groupedComponentTabs: { category: StudioComponentCategory; label: string; tabs: StudioTabDefinition[] }[]
  componentChangeCount: number
  groupedFields: { label: string; fields: any[] }[]
  focusedFieldPath: string

  modes: Record<string, TokenEditorMode>
  literalValues: Record<string, string>
  values: Record<string, string>
  references: Record<string, string>

  // Functions for derived data
  tabChangeCount: (tab: StudioTabDefinition) => number
  isFieldChanged: (path: string) => boolean
  rawValueForPath: (path: string) => string
  hasReferenceTemplate: (path: string) => boolean
}>()

const emit = defineEmits<{
  (e: 'selectTab', tab: StudioTabDefinition): void
  (e: 'update:componentSearch', val: string): void
  (e: 'focusin', path: string): void

  (e: 'setMode', path: string, mode: TokenEditorMode): void
  (e: 'setLiteralValue', path: string, value: string): void
  (e: 'setReferencePath', path: string, value: string): void
  (e: 'setReferenceExpression', path: string, value: string): void
}>()

const isComponentPickerOpen = ref(false)
const componentSearchInput = ref<HTMLInputElement | null>(null)

function toggleComponentPicker(): void {
  isComponentPickerOpen.value = !isComponentPickerOpen.value
  if (isComponentPickerOpen.value) {
    emit('update:componentSearch', '')

    nextTick(() => {
      componentSearchInput.value?.focus()

      const activeOption = document.querySelector('.dde-component-option-active') as HTMLElement | null
      activeOption?.scrollIntoView({
        block: 'start',
        inline: 'nearest'
      })
    })
  }
}

function handleSelectTab(tab: StudioTabDefinition) {
  emit('selectTab', tab)
  isComponentPickerOpen.value = false
}
</script>

<template>
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
        @click="handleSelectTab(tab)"
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
            ref="componentSearchInput"
            :value="componentSearch"
            class="dde-component-search"
            type="search"
            placeholder="Search components..."
            autocomplete="off"
            @input="$emit('update:componentSearch', ($event.target as HTMLInputElement).value)"
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
                @click="handleSelectTab(tab)"
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
        <h3 class="dde-field-group-title">
          <span>{{ group.label }}</span>
          <span class="dde-field-group-count">{{ group.fields.length }}</span>
        </h3>
        <div class="dde-field-group-body">
          <StudioField
            v-for="field in group.fields"
            :key="field.path"
            :field="field"
            :is-focused="focusedFieldPath === field.path"
            :is-changed="isFieldChanged(field.path)"
            :mode="modes[field.path] ?? 'literal'"
            :literal-value="literalValues[field.path] ?? ''"
            :reference-value="references[field.path] ?? ''"
            :resolved-value="values[field.path] ?? ''"
            :raw-value="rawValueForPath(field.path)"
            :has-reference-template="hasReferenceTemplate(field.path)"
            @focusin="$emit('focusin', field.path)"
            @set-mode="(mode) => $emit('setMode', field.path, mode)"
            @set-literal-value="(val) => $emit('setLiteralValue', field.path, val)"
            @set-reference-path="(val) => $emit('setReferencePath', field.path, val)"
            @set-reference-expression="(val) => $emit('setReferenceExpression', field.path, val)"
          />
        </div>
      </section>
    </div>
  </aside>
</template>
