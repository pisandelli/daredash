<script setup lang="ts">
defineProps<{
  hasChanges: boolean
  isDownloading: boolean
}>()

defineEmits<{
  (e: 'reset'): void
  (e: 'download'): void
}>()
</script>

<template>
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
        @click="$emit('reset')"
      >
        Reset
      </button>
      <button
        class="dde-btn dde-btn-primary"
        :disabled="!hasChanges || isDownloading"
        type="button"
        @click="$emit('download')"
      >
        <span v-if="isDownloading">Exporting…</span>
        <span v-else>Export tokens.json</span>
      </button>
    </div>
  </header>
</template>
