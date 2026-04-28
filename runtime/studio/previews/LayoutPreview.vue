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
      <h2>Layout</h2>
      <p>Page shell primitive for stacking header, body and footer regions.</p>
      <div class="dd-layout-note">
        <strong>How to read this preview</strong>
        <span><b>Token-driven:</b> `layout.header-height`, `layout.gap` and `layout.footer-height` control the shell rhythm between regions.</span>
        <span><b>Preview-only:</b> the tinted header, body and footer blocks are just guides for the three layout slots.</span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Shell rhythm</h3>
      <button type="button" class="dd-layout-stage" @click="focusField('layout.gap')">
        <div class="dd-shell">
          <div class="dd-shell-section dd-shell-header" :style="{ minBlockSize: resolveFieldValue('layout.header-height', 'var(--dd-layout-header-height)') }">
            <strong>Header</strong>
            <span>{{ resolveFieldValue('layout.header-height', 'var(--dd-layout-header-height)') }}</span>
          </div>
          <div class="dd-shell-gap" :style="{ blockSize: resolveFieldValue('layout.gap', 'var(--dd-layout-gap)') }" />
          <div class="dd-shell-section dd-shell-body">
            <strong>Body</strong>
            <span>Main flexible region</span>
          </div>
          <div class="dd-shell-gap" :style="{ blockSize: resolveFieldValue('layout.gap', 'var(--dd-layout-gap)') }" />
          <div class="dd-shell-section dd-shell-footer" :style="{ minBlockSize: resolveFieldValue('layout.footer-height', 'var(--dd-layout-footer-height)') }">
            <strong>Footer</strong>
            <span>{{ resolveFieldValue('layout.footer-height', 'var(--dd-layout-footer-height)') }}</span>
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

.dd-shell {
  display: grid;
  gap: 0;
}

.dd-shell-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 0.95rem;
}

.dd-shell-header {
  background: rgba(191 219 254 / 0.55);
}

.dd-shell-body {
  min-block-size: 8rem;
  background: rgba(226 232 240 / 0.75);
}

.dd-shell-footer {
  background: rgba(187 247 208 / 0.52);
}

.dd-shell-section strong {
  font-size: 0.9rem;
}

.dd-shell-section span {
  font-size: 0.78rem;
  color: #475569;
}

.dd-shell-gap {
  inline-size: 100%;
}
</style>
