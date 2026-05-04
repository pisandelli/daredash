<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

function focusField(path: string) {
  previewContext?.focusField(path)
}

function resolveFieldValue(path: string, fallback: string) {
  return previewContext?.resolveFieldValue(path) || fallback
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Grid</h2>
      <p>Responsive auto-fit layout for cards, media blocks and galleries.</p>
      <div class="dd-layout-note">
        <strong>How to read this preview</strong>
        <span><b>Token-driven:</b> `grid.gap` controls the spacing between items and `grid.column-min-width` controls when the layout wraps into fewer columns.</span>
        <span><b>Preview-only:</b> the sample cards, their borders and their background treatment are only host content for the grid.</span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Auto-fit columns</h3>
      <button type="button" class="dd-layout-stage" @click="focusField('grid.column-min-width')">
        <div
          class="dd-grid-stage"
          :style="{
            gap: resolveFieldValue('grid.gap', 'var(--dd-grid-gap)'),
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${resolveFieldValue('grid.column-min-width', 'var(--dd-grid-column-min-width)')}, 100%), 1fr))`
          }"
        >
          <div v-for="index in 6" :key="index" class="dd-grid-card">
            <strong>Card {{ index }}</strong>
            <span>{{ resolveFieldValue('grid.column-min-width', 'var(--dd-grid-column-min-width)') }}</span>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped>
.dd-layout-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
  color: #0f172a;
}

.dd-layout-note strong {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-layout-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-layout-note b {
  color: #0f172a;
}

.dd-layout-stage {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  text-align: left;
  cursor: pointer;
}

.dd-grid-stage {
  display: grid;
}

.dd-grid-card {
  display: grid;
  gap: 0.45rem;
  min-height: 6.5rem;
  padding: 1rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: rgba(241 245 249 / 0.9);
}

.dd-grid-card strong {
  font-size: 0.9rem;
}

.dd-grid-card span {
  font-size: 0.78rem;
  color: #64748b;
}
</style>
