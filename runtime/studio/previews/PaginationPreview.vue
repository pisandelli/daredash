<script setup lang="ts">
import { inject, ref } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)
const page = ref(3)

function focusField(path: string) {
  previewContext?.focusField(path)
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Pagination</h2>
      <p>Page controls with hover, active, disabled and compact density states.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Default interaction</h3>
      <div class="dd-pagination-shell">
        <DdPagination v-model="page" :total="120" :page-size="10" />
        <div class="dd-pagination-actions">
          <button type="button" class="dd-pagination-action" @click="focusField('pagination.color')">Base color</button>
          <button type="button" class="dd-pagination-action" @click="focusField('pagination.border-hover')">Hover border</button>
          <button type="button" class="dd-pagination-action" @click="focusField('pagination.color-active')">Active state</button>
          <button type="button" class="dd-pagination-action" @click="focusField('pagination.radius')">Radius</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Variants</h3>
      <div class="dd-pagination-stack">
        <DdPagination simple :total="96" :page-size="12" :model-value="2" />
        <DdPagination compact :total="96" :page-size="12" :model-value="4" />
        <DdPagination small disabled :total="96" :page-size="12" :model-value="1" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-pagination-shell,
.dd-pagination-stack {
  display: grid;
  gap: 1rem;
}

.dd-pagination-shell {
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-pagination-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.dd-pagination-action {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.96);
  padding: 0.45rem 0.8rem;
  color: #0f766e;
}
</style>
