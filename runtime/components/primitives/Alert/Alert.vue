<script lang="ts">
import { defineNuxtComponent } from 'nuxt/app'
export default defineNuxtComponent({
  name: 'Alert',
  inheritAttrs: false
})
</script>

<script setup lang="ts">
import { computed, useSlots, useAttrs } from 'vue'
import { Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Alert.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { useAppConfig } from '#imports'

const props = defineProps({
  /**
   * Visibility state of the alert.
   */
  modelValue: {
    type: Boolean,
    default: true
  },
  /**
   * Custom background color. Overrides the semantic variant token.
   */
  color: {
    type: String,
    default: undefined
  },
  /**
   * Title of the alert. Replaces the default slot if no slot content.
   */
  title: {
    type: String,
    default: undefined
  },
  /**
   * Show a close button to hide the alert.
   */
  closable: {
    type: Boolean,
    default: true
  },
  /**
   * Adds an icon. String specify icon name, boolean 'true' uses semantic fallback.
   */
  icon: {
    type: [Boolean, String],
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])
const slots = useSlots()

const attrs = useAttrs()
const { processedAttrs, classList } = useBaseComponent(
  attrs,
  styles,
  'Alert'
)

const alertStyle = computed(() => {
  const customStyles: Record<string, string> = {}
  if (props.color) {
    customStyles[getPrefixName('alert-base-color', { type: 'css-var-decl' })] = props.color
  }
  return customStyles
})

const isVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  isVisible.value = false
  emit('close')
}

// Check which string variance attribute we have by looking at processedAttrs keys
const semanticIcon = computed(() => {
  const appConfig = useAppConfig() as any
  const globalIcons = appConfig.daredash?.icons || {}

  // `processedAttrs` returns things like `{'data-success': ''}`
  if ('data-success' in processedAttrs.value) return globalIcons.success || 'heroicons:check-circle'
  if ('data-danger' in processedAttrs.value) return globalIcons.error || 'heroicons:x-circle'
  if ('data-error' in processedAttrs.value) return globalIcons.error || 'heroicons:x-circle'
  if ('data-warning' in processedAttrs.value) return globalIcons.warning || 'heroicons:exclamation-triangle'
  if ('data-info' in processedAttrs.value) return globalIcons.info || 'heroicons:information-circle'
  return globalIcons.info || 'heroicons:information-circle'
})

const resolvedIcon = computed(() => {
  if (typeof props.icon === 'string' && props.icon !== '') {
    return props.icon
  }
  if (props.icon === true) {
    return semanticIcon.value
  }
  return null
})
</script>

<template>
  <div v-if="isVisible" v-bind="processedAttrs" :class="classList" :style="alertStyle" role="alert">
    <div v-if="resolvedIcon" :class="styles.iconContainer">
      <Icon :name="resolvedIcon" :class="styles.icon" />
    </div>

    <div :class="styles.content">
      <div v-if="props.title || slots.title" :class="styles.title">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div v-if="slots.default" :class="styles.message">
        <slot />
      </div>
    </div>

    <button v-if="props.closable" type="button" :class="styles.close" aria-label="Close alert" @click="handleClose">
      <Icon :name="(useAppConfig() as any).daredash?.icons?.toastClose || 'heroicons:x-mark'" />
    </button>
  </div>
</template>
