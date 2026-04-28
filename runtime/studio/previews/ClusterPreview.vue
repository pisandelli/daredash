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
      <h2>Cluster</h2>
      <p>Inline grouping primitive for pills, actions and wrapped collections.</p>
      <div class="dd-layout-note">
        <strong>How to read this preview</strong>
        <span><b>Token-driven:</b> `cluster.gap`, `cluster.narrow.gap` and `cluster.wide.gap` control the spacing between inline siblings.</span>
        <span><b>Preview-only:</b> the chips, their fill color and their rounded shape are just host elements so the spacing is easy to compare.</span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Base cluster</h3>
      <button type="button" class="dd-layout-stage" @click="focusField('cluster.gap')">
        <div class="dd-cluster-row" :style="{ gap: resolveFieldValue('cluster.gap', 'var(--dd-cluster-gap)') }">
          <span v-for="label in ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']" :key="label" class="dd-layout-chip">{{ label }}</span>
        </div>
      </button>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Variants</h3>
      <div class="dd-layout-grid">
        <button type="button" class="dd-layout-card" @click="focusField('cluster.narrow.gap')">
          <strong>Narrow</strong>
          <div class="dd-cluster-row" :style="{ gap: resolveFieldValue('cluster.narrow.gap', 'var(--dd-cluster-narrow-gap)') }">
            <span v-for="label in ['One', 'Two', 'Three', 'Four']" :key="label" class="dd-layout-chip dd-layout-chip-tight">{{ label }}</span>
          </div>
        </button>
        <button type="button" class="dd-layout-card" @click="focusField('cluster.wide.gap')">
          <strong>Wide</strong>
          <div class="dd-cluster-row" :style="{ gap: resolveFieldValue('cluster.wide.gap', 'var(--dd-cluster-wide-gap)') }">
            <span v-for="label in ['North', 'South', 'East', 'West']" :key="label" class="dd-layout-chip">{{ label }}</span>
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

.dd-layout-stage,
.dd-layout-card {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  text-align: left;
  cursor: pointer;
}

.dd-layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
}

.dd-layout-card {
  display: grid;
  gap: 0.8rem;
}

.dd-cluster-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.dd-layout-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(226 232 240 / 0.75);
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 600;
}

.dd-layout-chip-tight {
  padding-inline: 0.6rem;
}
</style>
