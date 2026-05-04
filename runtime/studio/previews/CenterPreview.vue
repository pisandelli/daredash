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
      <h2>Center</h2>
      <p>Layout primitive for constrained width and balanced inline breathing room.</p>
      <div class="dd-center-preview-note">
        <strong>How to read this preview</strong>
        <span>
          <b>Token-driven:</b> `center.max-width` defines the readable measure and `center.gap` defines the inline padding inside that measure.
        </span>
        <span>
          <b>Preview-only:</b> the dashed frame, tint and helper labels belong to the preview host, not to `Center` itself.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Centered measure</h3>
      <button
        type="button"
        class="dd-center-frame"
        @click="focusField('center.max-width')"
      >
        <div class="dd-center-outer">
          <div
            class="dd-center-inner"
            :style="{
              maxInlineSize: resolveFieldValue('center.max-width', 'var(--dd-center-max-width)'),
              paddingInline: resolveFieldValue('center.gap', 'var(--dd-center-gap)')
            }"
          >
            <DdCard>
              <template #header>
                <div class="dd-center-card-meta">
                  <strong>Centered content</strong>
                  <span>{{ resolveFieldValue('center.max-width', 'var(--dd-center-max-width)') }}</span>
                </div>
              </template>

              <div class="dd-center-content">
                <strong>Readable line length</strong>
                <p>
                  This is the typical role of Center: keep content from stretching too wide while still preserving side padding on smaller viewports.
                </p>
              </div>

              <template #footer>
                <div class="dd-center-card-meta">
                  <span>{{ resolveFieldValue('center.gap', 'var(--dd-center-gap)') }}</span>
                  <span>inline padding</span>
                </div>
              </template>
            </DdCard>
          </div>
        </div>
      </button>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Token focus</h3>
      <div class="dd-center-token-grid">
        <button
          type="button"
          class="dd-center-token"
          @click="focusField('center.max-width')"
        >
          <span class="dd-center-token-label">Max width</span>
          <span class="dd-center-token-value">{{ resolveFieldValue('center.max-width', 'var(--dd-center-max-width)') }}</span>
        </button>

        <button
          type="button"
          class="dd-center-token"
          @click="focusField('center.gap')"
        >
          <span class="dd-center-token-label">Inline padding</span>
          <span class="dd-center-token-value">{{ resolveFieldValue('center.gap', 'var(--dd-center-gap)') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-center-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
  color: #0f172a;
}

.dd-center-preview-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-center-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-center-frame,
.dd-center-token {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.dd-center-outer {
  border: 1px dashed rgba(15 23 42 / 0.14);
  border-radius: 1rem;
  background:
    linear-gradient(90deg, rgba(148 163 184 / 0.08) 0, rgba(148 163 184 / 0.08) 50%, transparent 50%, transparent 100%);
  background-size: 3rem 100%;
  padding: 1rem;
}

.dd-center-inner {
  margin-inline: auto;
  width: 100%;
}

.dd-center-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dd-center-card-meta span {
  font-size: 0.78rem;
  color: #64748b;
}

.dd-center-content {
  display: grid;
  gap: 0.7rem;
}

.dd-center-content strong {
  font-size: 0.95rem;
  color: inherit;
}

.dd-center-content p {
  margin: 0;
  font-size: 0.87rem;
  line-height: 1.55;
  color: inherit;
  opacity: 0.78;
}

.dd-center-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

.dd-center-token {
  display: grid;
  gap: 0.4rem;
  min-height: 6rem;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.dd-center-frame:hover .dd-center-outer,
.dd-center-token:hover {
  border-color: rgba(47 155 143 / 0.4);
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15 23 42 / 0.08);
}

.dd-center-token-label {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.dd-center-token-value {
  font-size: 0.88rem;
  line-height: 1.45;
  color: #0f172a;
}
</style>
