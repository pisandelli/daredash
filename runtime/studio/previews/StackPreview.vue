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
      <h2>Stack</h2>
      <p>Vertical spacing primitive for sections, forms and content flows.</p>
      <div class="dd-layout-note">
        <strong>How to read this preview</strong>
        <span><b>Token-driven:</b> `stack.gap`, `stack.compact.gap` and `stack.spaced.gap` control the vertical distance between siblings.</span>
        <span><b>Preview-only:</b> the row blocks are only markers so the spacing is easy to compare across variants.</span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Variants</h3>
      <div class="dd-stack-grid">
        <button type="button" class="dd-stack-card" @click="focusField('stack.compact.gap')">
          <strong>Compact</strong>
          <div class="dd-stack-column" :style="{ gap: resolveFieldValue('stack.compact.gap', 'var(--dd-stack-compact-gap)') }">
            <div class="dd-stack-item" v-for="item in 3" :key="`compact-${item}`">Row {{ item }}</div>
          </div>
        </button>
        <button type="button" class="dd-stack-card" @click="focusField('stack.gap')">
          <strong>Base</strong>
          <div class="dd-stack-column" :style="{ gap: resolveFieldValue('stack.gap', 'var(--dd-stack-gap)') }">
            <div class="dd-stack-item" v-for="item in 3" :key="`base-${item}`">Row {{ item }}</div>
          </div>
        </button>
        <button type="button" class="dd-stack-card" @click="focusField('stack.spaced.gap')">
          <strong>Spaced</strong>
          <div class="dd-stack-column" :style="{ gap: resolveFieldValue('stack.spaced.gap', 'var(--dd-stack-spaced-gap)') }">
            <div class="dd-stack-item" v-for="item in 3" :key="`spaced-${item}`">Row {{ item }}</div>
          </div>
        </button>
      </div>
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

.dd-stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

.dd-stack-card {
  display: grid;
  gap: 0.8rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  text-align: left;
  cursor: pointer;
}

.dd-stack-column {
  display: flex;
  flex-direction: column;
}

.dd-stack-item {
  display: flex;
  align-items: center;
  min-height: 3rem;
  padding-inline: 0.85rem;
  border-radius: 0.9rem;
  background: rgba(226 232 240 / 0.75);
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 600;
}
</style>
