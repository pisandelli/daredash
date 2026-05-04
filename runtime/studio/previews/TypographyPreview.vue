<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const fontTokens = [
  { label: 'Base', fieldPath: 'font.base' },
  { label: 'System', fieldPath: 'font.system' }
]

const fontSizeTokens = [
  { label: 'XS', fieldPath: 'font-size.xs' },
  { label: 'SM', fieldPath: 'font-size.sm' },
  { label: 'MD', fieldPath: 'font-size.md' },
  { label: 'LG', fieldPath: 'font-size.lg' },
  { label: 'XL', fieldPath: 'font-size.xl' },
  { label: 'XXL', fieldPath: 'font-size.xxl' },
  { label: 'UL', fieldPath: 'font-size.ul' }
]

const fontWeightTokens = [
  { label: 'Light', fieldPath: 'font-weight.light' },
  { label: 'Regular', fieldPath: 'font-weight.regular' },
  { label: 'Medium', fieldPath: 'font-weight.medium' },
  { label: 'Semi Bold', fieldPath: 'font-weight.semi-bold' },
  { label: 'Bold', fieldPath: 'font-weight.bold' },
  { label: 'Black', fieldPath: 'font-weight.black' }
]

const lineHeightTokens = [
  { label: 'None', fieldPath: 'line-height.none' },
  { label: 'Tight', fieldPath: 'line-height.tight' },
  { label: 'Snug', fieldPath: 'line-height.snug' },
  { label: 'Normal', fieldPath: 'line-height.normal' },
  { label: 'Relaxed', fieldPath: 'line-height.relaxed' },
  { label: 'Loose', fieldPath: 'line-height.loose' }
]

const letterSpacingTokens = [
  { label: 'Tighter', fieldPath: 'letter-spacing.tighter' },
  { label: 'Tight', fieldPath: 'letter-spacing.tight' },
  { label: 'Normal', fieldPath: 'letter-spacing.normal' },
  { label: 'Wide', fieldPath: 'letter-spacing.wide' },
  { label: 'Wider', fieldPath: 'letter-spacing.wider' },
  { label: 'Widest', fieldPath: 'letter-spacing.widest' }
]

function focusField(path: string) {
  previewContext?.focusField(path)
}

function tokenValue(path: string, fallback = '') {
  return previewContext?.resolveFieldValue(path) || fallback
}
</script>

<template>
  <section class="dd-studio-preview dd-typography-preview">
    <header class="dd-studio-preview-header">
      <h2>Typography tokens</h2>
      <p>Inspect and tune the global type primitives that components can reference.</p>
    </header>

    <aside class="dd-type-font-note">
      <strong>Font family preview</strong>
      <span>
        Changing <code>font.base</code> updates the token immediately, but the visual result depends on the font being
        installed locally or loaded by the app. If a family is unavailable, the browser falls back to the next font.
      </span>
    </aside>

    <div class="dd-type-hero" :style="{ fontFamily: tokenValue('font.base') }">
      <span>Type System</span>
      <h3>The quick brown fox jumps over the lazy dog.</h3>
      <p>
        A shared typographic scale keeps components readable, consistent and expressive across the UI library.
      </p>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Font Size</h3>
      <div class="dd-type-size-stack">
        <button
          v-for="token in fontSizeTokens"
          :key="token.fieldPath"
          type="button"
          class="dd-type-size-row"
          :title="`Edit ${token.fieldPath}`"
          @click="focusField(token.fieldPath)"
        >
          <span>{{ token.label }}</span>
          <strong :style="{ fontSize: tokenValue(token.fieldPath) }">
            Aa The quick brown fox
          </strong>
          <code>{{ tokenValue(token.fieldPath) }}</code>
        </button>
      </div>
    </div>

    <div class="dd-type-two-col">
      <div class="dd-studio-preview-block">
        <h3>Font Weight</h3>
        <div class="dd-type-token-grid">
          <button
            v-for="token in fontWeightTokens"
            :key="token.fieldPath"
            type="button"
            class="dd-type-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <strong :style="{ fontWeight: tokenValue(token.fieldPath) }">Ag</strong>
            <span>{{ token.label }}</span>
            <code>{{ tokenValue(token.fieldPath) }}</code>
          </button>
        </div>
      </div>

      <div class="dd-studio-preview-block">
        <h3>Letter Spacing</h3>
        <div class="dd-type-token-grid">
          <button
            v-for="token in letterSpacingTokens"
            :key="token.fieldPath"
            type="button"
            class="dd-type-card dd-type-tracking-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <strong :style="{ letterSpacing: tokenValue(token.fieldPath) }">TRACK</strong>
            <span>{{ token.label }}</span>
            <code>{{ tokenValue(token.fieldPath) }}</code>
          </button>
        </div>
      </div>
    </div>

    <div class="dd-type-two-col">
      <div class="dd-studio-preview-block">
        <h3>Line Height</h3>
        <div class="dd-type-token-grid">
          <button
            v-for="token in lineHeightTokens"
            :key="token.fieldPath"
            type="button"
            class="dd-type-line-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <p :style="{ lineHeight: tokenValue(token.fieldPath) }">
              Line height controls rhythm across stacked text, summaries and descriptions.
            </p>
            <span>{{ token.label }}</span>
            <code>{{ tokenValue(token.fieldPath) }}</code>
          </button>
        </div>
      </div>

      <div class="dd-studio-preview-block">
        <h3>Font Family</h3>
        <div class="dd-type-family-stack">
          <button
            v-for="token in fontTokens"
            :key="token.fieldPath"
            type="button"
            class="dd-type-family-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <span>{{ token.label }}</span>
            <strong :style="{ fontFamily: tokenValue(token.fieldPath) }">
              Sphinx of black quartz, judge my vow.
            </strong>
            <code>{{ tokenValue(token.fieldPath) }}</code>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-typography-preview {
  --type-card-border: rgba(15 23 42 / 0.08);
  --type-card-bg: linear-gradient(180deg, rgba(248 250 252 / 0.95) 0%, rgba(255 255 255 / 0.96) 100%);
}

.dd-type-hero,
.dd-type-font-note,
.dd-type-card,
.dd-type-line-card,
.dd-type-family-card,
.dd-type-size-row {
  border: 1px solid var(--type-card-border);
  background: var(--type-card-bg);
  color: #0f172a;
}

.dd-type-font-note {
  display: grid;
  gap: 0.35rem;
  padding: 0.95rem 1rem;
  border-color: rgba(47 155 143 / 0.24);
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(47 155 143 / 0.1), rgba(255 255 255 / 0.96));
}

.dd-type-font-note strong {
  color: #0f172a;
  font-size: 0.86rem;
}

.dd-type-font-note span {
  color: #475569;
  font-size: 0.82rem;
  line-height: 1.55;
}

.dd-type-font-note code {
  color: #0f766e;
  font-weight: 800;
}

.dd-type-hero {
  display: grid;
  gap: 0.65rem;
  padding: clamp(1rem, 3vw, 2rem);
  border-radius: 20px;
  background:
    radial-gradient(circle at 10% 10%, rgba(47 155 143 / 0.16), transparent 34%),
    linear-gradient(135deg, #f8fafc 0%, #ffffff 52%, #eff6ff 100%);
}

.dd-type-hero span {
  color: #2f9b8f;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.dd-type-hero h3 {
  margin: 0;
  max-inline-size: 13ch;
  color: #0f172a;
  font-size: clamp(2rem, 5vw, 4.25rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.dd-type-hero p {
  margin: 0;
  max-inline-size: 44rem;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.65;
}

.dd-type-size-stack,
.dd-type-family-stack {
  display: grid;
  gap: 0.85rem;
}

.dd-type-size-row {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) minmax(8rem, auto);
  gap: 1rem;
  align-items: center;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.dd-type-size-row span,
.dd-type-card span,
.dd-type-line-card span,
.dd-type-family-card span {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dd-type-size-row strong {
  min-inline-size: 0;
  overflow: hidden;
  color: #0f172a;
  line-height: 1.05;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dd-type-two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.dd-type-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.85rem;
}

.dd-type-card,
.dd-type-line-card,
.dd-type-family-card {
  display: grid;
  gap: 0.55rem;
  padding: 0.9rem;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.dd-type-card strong {
  font-size: 2.35rem;
  line-height: 0.95;
}

.dd-type-tracking-card strong {
  font-size: 1.1rem;
  line-height: 1;
}

.dd-type-line-card p {
  margin: 0;
  color: #0f172a;
  font-size: 0.88rem;
}

.dd-type-family-card strong {
  color: #0f172a;
  font-size: 1.1rem;
  line-height: 1.35;
}

.dd-type-size-row code,
.dd-type-card code,
.dd-type-line-card code,
.dd-type-family-card code {
  min-inline-size: 0;
  color: #64748b;
  font-size: 0.68rem;
  line-height: 1.35;
  word-break: break-word;
}

.dd-type-size-row:focus-visible,
.dd-type-card:focus-visible,
.dd-type-line-card:focus-visible,
.dd-type-family-card:focus-visible {
  outline: 2px solid rgba(47 155 143 / 0.45);
  outline-offset: 2px;
}

@media (max-width: 960px) {
  .dd-type-two-col {
    grid-template-columns: 1fr;
  }

  .dd-type-size-row {
    grid-template-columns: 1fr;
  }
}
</style>
