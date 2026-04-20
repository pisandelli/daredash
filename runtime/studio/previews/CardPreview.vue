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
      <h2>Card</h2>
      <p>Surface primitive for grouped content, framed sections and soft elevation.</p>
      <div class="dd-card-preview-note">
        <strong>What is token-driven here</strong>
        <span>
          Background, text color, border, radius, shadow and section spacing are all tokenized. The footer tint still comes from a shared surface-hover token, and the header weight comes from the typography scale rather than a dedicated card token.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Structured card</h3>
      <button
        type="button"
        class="dd-card-shell"
        @click="focusField('card.padding')"
      >
        <DdCard>
          <template #header>
            <div class="dd-card-section-meta">
              <strong>Overview</strong>
              <span>{{ resolveFieldValue('card.header.padding', 'var(--dd-card-header-padding)') }}</span>
            </div>
          </template>

          <div class="dd-card-body-content">
            <strong>Studio-ready surface</strong>
            <p>
              Cards combine spacing, borders and shadow into one composable surface. Body padding comes from `card.padding`, while shell styling comes from the core card tokens.
            </p>
          </div>

          <template #footer>
            <div class="dd-card-section-meta">
              <span>{{ resolveFieldValue('card.footer.padding', 'var(--dd-card-footer-padding)') }}</span>
              <span>{{ resolveFieldValue('card.border-radius', 'var(--dd-card-border-radius)') }}</span>
            </div>
          </template>
        </DdCard>
      </button>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Core surface tokens</h3>
      <div class="dd-card-token-grid">
        <button
          type="button"
          class="dd-card-token"
          @click="focusField('card.background-color')"
        >
          <span class="dd-card-token-label">Background</span>
          <span class="dd-card-token-value">{{ resolveFieldValue('card.background-color', 'var(--dd-card-background-color)') }}</span>
        </button>

        <button
          type="button"
          class="dd-card-token"
          @click="focusField('card.border-color')"
        >
          <span class="dd-card-token-label">Border</span>
          <span class="dd-card-token-value">{{ resolveFieldValue('card.border-color', 'var(--dd-card-border-color)') }}</span>
        </button>

        <button
          type="button"
          class="dd-card-token"
          @click="focusField('card.box-shadow')"
        >
          <span class="dd-card-token-label">Shadow</span>
          <span class="dd-card-token-value">{{ resolveFieldValue('card.box-shadow', 'var(--dd-card-box-shadow)') }}</span>
        </button>

        <button
          type="button"
          class="dd-card-token"
          @click="focusField('card.max-width')"
        >
          <span class="dd-card-token-label">Max width</span>
          <span class="dd-card-token-value">{{ resolveFieldValue('card.max-width', 'var(--dd-card-max-width)') }}</span>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Variants</h3>
      <div class="dd-card-variant-grid">
        <button
          type="button"
          class="dd-card-variant"
          @click="focusField('card.border-radius')"
        >
          <DdCard flat>
            <div class="dd-card-variant-content">
              <strong>Flat</strong>
              <span>Removes radius and shadow.</span>
            </div>
          </DdCard>
        </button>

        <button
          type="button"
          class="dd-card-variant"
          @click="focusField('card.border-width')"
        >
          <DdCard noborder>
            <div class="dd-card-variant-content">
              <strong>No border</strong>
              <span>Useful for soft surface blocks.</span>
            </div>
          </DdCard>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-card-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(15 23 42 / 0.1);
  background: linear-gradient(180deg, rgba(248 250 252 / 0.98), rgba(241 245 249 / 0.96));
  color: #0f172a;
}

.dd-card-preview-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-card-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-card-shell,
.dd-card-token,
.dd-card-variant {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.dd-card-section-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dd-card-section-meta span {
  font-size: 0.78rem;
  color: #64748b;
}

.dd-card-body-content {
  display: grid;
  gap: 0.7rem;
}

.dd-card-body-content strong,
.dd-card-variant-content strong {
  font-size: 0.95rem;
  color: inherit;
}

.dd-card-body-content p,
.dd-card-variant-content span {
  margin: 0;
  font-size: 0.87rem;
  line-height: 1.5;
  color: inherit;
  opacity: 0.78;
}

.dd-card-token-grid,
.dd-card-variant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

.dd-card-token {
  display: grid;
  gap: 0.4rem;
  min-height: 6.25rem;
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

.dd-card-token:hover,
.dd-card-variant:hover {
  border-color: rgba(47 155 143 / 0.4);
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15 23 42 / 0.08);
}

.dd-card-token-label {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.dd-card-token-value {
  font-size: 0.88rem;
  line-height: 1.45;
  color: #0f172a;
}

.dd-card-variant {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  padding: 0.55rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.dd-card-variant-content {
  display: grid;
  gap: 0.45rem;
}
</style>
