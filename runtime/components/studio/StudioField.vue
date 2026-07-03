<script setup lang="ts">

import type { StudioFieldDefinition } from '../../studio/types'
import type { TokenEditorMode } from '../../composables/useThemeEditor'

const props = defineProps<{
  field: StudioFieldDefinition
  isFocused: boolean
  isChanged: boolean
  mode: TokenEditorMode
  literalValue: string
  referenceValue: string
  resolvedValue: string
  rawValue: string
  hasReferenceTemplate: boolean
}>()

const emit = defineEmits<{
  (e: 'focusin'): void
  (e: 'setMode', mode: TokenEditorMode): void
  (e: 'setLiteralValue', value: string): void
  (e: 'setReferencePath', value: string): void
  (e: 'setReferenceExpression', value: string): void
}>()

function eventValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement | null)?.value ?? ''
}

function displayFieldLabel(field: StudioFieldDefinition): string {
  return field.label.replace(/\s*\/ Expression$/, '')
}

function fieldAcceptedInputs(field: StudioFieldDefinition): string[] {
  if (field.type === 'select') return ['preset option']
  if (field.type === 'color') return ['color literal', 'reference']
  return ['string', 'reference', 'CSS expression']
}

function fieldExampleValues(field: StudioFieldDefinition): string[] {
  const examples = new Set<string>()

  if (field.type === 'select') {
    for (const option of field.options?.slice(0, 3) ?? []) {
      examples.add(option)
    }
    return [...examples]
  }

  if (field.type === 'color') {
    examples.add('#ffffff')
    examples.add('{color.primary.600}')
  } else {
    examples.add('1rem')
    examples.add('{space.md}')

    if (field.rawDefaultValue?.includes('(')) {
      examples.add(field.rawDefaultValue)
    } else {
      examples.add('contrast-color({button.base-color})')
      examples.add('color-mix(in srgb, {color.primary.600} 80%, black)')
    }
  }

  if (field.rawDefaultValue) examples.add(field.rawDefaultValue)

  return [...examples].slice(0, 4)
}

function fieldInfoAriaLabel(field: StudioFieldDefinition): string {
  return `Show help for ${displayFieldLabel(field)}`
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

function currentReferencePath(field: StudioFieldDefinition, referenceValue: string): string {
  return referenceValue || field.referencePath || ''
}

function currentReferenceRelation(field: StudioFieldDefinition, referenceValue: string): string {
  const referencePath = currentReferencePath(field, referenceValue)
  if (!referencePath) return field.path
  return `${field.path} -> ${referencePath}`
}

function isDetachedFromDefaultReference(field: StudioFieldDefinition, mode: TokenEditorMode): boolean {
  return Boolean(field.referencePath) && mode !== 'reference'
}

function referenceSummaryLabel(field: StudioFieldDefinition, mode: TokenEditorMode): string {
  if (isDetachedFromDefaultReference(field, mode)) return 'Detached from default'
  if (mode === 'reference') return 'Inherits from'
  if (field.referencePath) return 'Default reference'
  return 'Reference'
}

function resolvedValueLabel(field: StudioFieldDefinition): string {
  if (field.type === 'color') return 'Resolved color'
  return 'Resolved value'
}

function referenceSuggestions(field: StudioFieldDefinition): string[] {
  return [...new Set(
    [field.referencePath, referencePlaceholder(field)]
      .map((value) => value?.trim() ?? '')
      .filter(Boolean)
  )]
}

function applyReference(field: StudioFieldDefinition, referencePath: string): void {
  emit('setReferencePath', referencePath)
  emit('setMode', 'reference')
}

function referenceSuggestionLabel(field: StudioFieldDefinition, suggestion: string): string {
  if (field.referencePath === suggestion) return `Use default: ${suggestion}`
  return `Use ${suggestion}`
}

function usesSingleExpressionReferenceInput(mode: TokenEditorMode, hasReferenceTemplate: boolean): boolean {
  return mode === 'reference' && hasReferenceTemplate
}
</script>

<template>
  <div
    class="dde-field"
    :class="{ 'dde-field-focused': isFocused }"
    :data-field-path="field.path"
    @focusin="$emit('focusin')"
  >
    <div class="dde-field-head">
      <label class="dde-field-label" :for="`field-${field.path}`">
        <span>{{ displayFieldLabel(field) }}</span>
        <code class="dde-field-path">{{ field.path }}</code>
      </label>
      <div class="dde-field-info">
        <button
          type="button"
          class="dde-field-info-trigger"
          :aria-label="fieldInfoAriaLabel(field)"
        >
          i
        </button>
        <div class="dde-field-info-tooltip" role="tooltip">
          <div class="dde-field-info-section">
            <span class="dde-field-info-title">Accepted input</span>
            <div class="dde-field-info-chips">
              <code
                v-for="accepted in fieldAcceptedInputs(field)"
                :key="`${field.path}-accepted-${accepted}`"
                class="dde-field-info-chip"
              >
                {{ accepted }}
              </code>
            </div>
          </div>

          <div class="dde-field-info-section">
            <span class="dde-field-info-title">Examples</span>
            <div class="dde-field-info-chips">
              <code
                v-for="example in fieldExampleValues(field)"
                :key="`${field.path}-example-${example}`"
                class="dde-field-info-chip"
              >
                {{ example }}
              </code>
            </div>
          </div>

          <div
            v-if="field.referencePath"
            class="dde-field-info-section"
          >
            <span class="dde-field-info-title">Default reference</span>
            <code class="dde-field-info-inline">{{ '{' + field.referencePath + '}' }}</code>
          </div>

          <div
            v-if="field.rawDefaultValue"
            class="dde-field-info-section"
          >
            <span class="dde-field-info-title">Default value</span>
            <code class="dde-field-info-inline">{{ field.rawDefaultValue }}</code>
          </div>

          <p
            v-if="field.description"
            class="dde-field-info-note"
          >
            {{ field.description }}
          </p>
        </div>
      </div>
    </div>
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
        :class="{ 'dde-field-mode-option-active': mode === 'literal' }"
        :aria-selected="mode === 'literal'"
        title="Edit the token with a raw CSS value"
        @click="$emit('setMode', 'literal')"
      >
        Literal
      </button>
      <button
        type="button"
        class="dde-field-mode-option"
        :class="{ 'dde-field-mode-option-active': mode === 'reference' }"
        :aria-selected="mode === 'reference'"
        title="Point this token to another token path"
        @click="$emit('setMode', 'reference')"
      >
        Reference
      </button>
    </div>

    <div
      v-if="field.type === 'color' && mode !== 'reference'"
      class="dde-color-wrapper"
    >
      <input
        :value="literalValue"
        type="color"
        class="dde-color-swatch"
        @input="$emit('setLiteralValue', eventValue($event))"
      />
      <input
        :id="`field-${field.path}`"
        :value="literalValue"
        type="text"
        class="dde-color-text dde-field-focus-target"
        spellcheck="false"
        @input="$emit('setLiteralValue', eventValue($event))"
      />
    </div>

    <div
      v-else-if="field.type === 'color' && mode === 'reference'"
      class="dde-reference-stack"
    >
      <div class="dde-color-wrapper dde-color-wrapper-readonly">
        <input
          :value="resolvedValue"
          type="color"
          class="dde-color-swatch"
          disabled
        />
        <input
          type="text"
          class="dde-color-text dde-color-text-readonly"
          :value="resolvedValue"
          readonly
        />
      </div>
      <input
        :id="`field-${field.path}`"
        :value="referenceValue"
        type="text"
        class="dde-input dde-field-focus-target"
        spellcheck="false"
        :placeholder="referencePlaceholder(field)"
        @input="$emit('setReferencePath', eventValue($event))"
      />
    </div>

    <select
      v-else-if="field.type === 'select'"
      :id="`field-${field.path}`"
      :value="literalValue"
      class="dde-input dde-field-focus-target"
      @change="$emit('setLiteralValue', eventValue($event))"
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
      v-else-if="usesSingleExpressionReferenceInput(mode, hasReferenceTemplate)"
      :id="`field-${field.path}`"
      :value="rawValue"
      type="text"
      class="dde-input dde-field-focus-target"
      spellcheck="false"
      @input="$emit('setReferenceExpression', eventValue($event))"
    />

    <input
      v-else-if="mode !== 'reference'"
      :id="`field-${field.path}`"
      :value="literalValue"
      type="text"
      class="dde-input dde-field-focus-target"
      spellcheck="false"
      @input="$emit('setLiteralValue', eventValue($event))"
    />

    <div
      v-else
      class="dde-reference-stack"
    >
      <input
        type="text"
        class="dde-input dde-input-readonly"
        :value="resolvedValue"
        readonly
      />
      <input
        :id="`field-${field.path}`"
        :value="referenceValue"
        type="text"
        class="dde-input dde-field-focus-target"
        spellcheck="false"
        :placeholder="referencePlaceholder(field)"
        @input="$emit('setReferencePath', eventValue($event))"
      />
    </div>

    <div
      v-if="referenceValue || field.referencePath"
      class="dde-field-meta"
    >
      <span class="dde-field-meta-badge">
        {{ referenceSummaryLabel(field, mode) }}
      </span>
      <div class="dde-field-meta-panel">
        <div class="dde-field-meta-row">
          <span class="dde-field-meta-key">Relation</span>
          <code class="dde-field-meta-value">
            {{ currentReferenceRelation(field, referenceValue) }}
          </code>
        </div>
        <div
          v-if="mode === 'reference'"
          class="dde-field-meta-row"
        >
          <span class="dde-field-meta-key">{{ resolvedValueLabel(field) }}</span>
          <code class="dde-field-meta-value">
            {{ resolvedValue }}
          </code>
        </div>
        <p
          v-else-if="field.referencePath"
          class="dde-field-meta-hint"
        >
          This field started as a reference, but it is currently using a literal value.
        </p>
        <div
          v-if="referenceSuggestions(field).length"
          class="dde-field-actions"
        >
          <button
            v-for="suggestion in referenceSuggestions(field)"
            :key="`${field.path}-${suggestion}`"
            type="button"
            class="dde-field-action"
            :disabled="mode === 'reference' && currentReferencePath(field, referenceValue) === suggestion"
            @click="applyReference(field, suggestion)"
          >
            {{ referenceSuggestionLabel(field, suggestion) }}
          </button>
        </div>
      </div>
    </div>

    <span
      v-if="isChanged"
      class="dde-field-changed"
      title="Modified"
    >●</span>
  </div>
</template>
