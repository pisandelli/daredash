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
      <h2>Box</h2>
      <p>Intrinsic spacing wrapper inspired by Every Layout's Box primitive.</p>
      <div class="dd-box-preview-note">
        <strong>How to read this preview</strong>
        <span>
          <b>Token-driven:</b> `box.gap` controls the internal padding on every side of the Box.
        </span>
        <span>
          <b>Preview-only:</b> the card shell, border, background, radius and shadow belong to the host `Card`, not to `Box`.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Padding on all sides</h3>
      <button
        type="button"
        class="dd-box-card-button"
        @click="focusField('box.gap')"
      >
        <DdCard>
          <template #header>
            <div class="dd-box-card-header">
              <strong>Box host</strong>
              <span>{{ resolveFieldValue('box.gap', 'var(--dd-box-gap)') }}</span>
            </div>
          </template>

          <div
            class="dd-box-proxy"
            :style="{ padding: resolveFieldValue('box.gap', 'var(--dd-box-gap)') }"
          >
            <div class="dd-box-proxy-content">
              <strong>Inside the Box</strong>
              <p>
                This inset spacing is the Box itself. In the Every Layout sense, the Box only owns internal padding, not contextual margin or decorative chrome.
              </p>
            </div>
          </div>

          <template #footer>
            <div class="dd-box-card-footer">
              <span>All sides or no sides</span>
            </div>
          </template>
        </DdCard>
      </button>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Nested composition</h3>
      <button
        type="button"
        class="dd-box-stack-button"
        @click="focusField('box.gap')"
      >
        <div class="dd-box-nested-shell">
          <div
            class="dd-box-proxy dd-box-proxy-muted"
            :style="{ padding: resolveFieldValue('box.gap', 'var(--dd-box-gap)') }"
          >
            <div class="dd-box-proxy-content">
              <strong>Outer Box</strong>
              <div
                class="dd-box-proxy dd-box-proxy-inner"
                :style="{ padding: resolveFieldValue('box.gap', 'var(--dd-box-gap)') }"
              >
                <div class="dd-box-proxy-content">
                  <strong>Inner Box</strong>
                  <p>The same token composes nested wrappers without introducing directional spacing rules.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped>
.dd-box-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
  color: #0f172a;
}

.dd-box-preview-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-box-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-box-card-button,
.dd-box-stack-button {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.dd-box-card-header,
.dd-box-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dd-box-card-header span,
.dd-box-card-footer span {
  font-size: 0.8rem;
  color: #64748b;
}

.dd-box-proxy {
  border-radius: 0.85rem;
  border: 1px dashed rgba(15 23 42 / 0.14);
  background: rgba(241 245 249 / 0.9);
}

.dd-box-proxy-muted {
  background: linear-gradient(180deg, rgba(255 255 255 / 0.96), rgba(248 250 252 / 0.96));
}

.dd-box-proxy-inner {
  background: rgba(255 255 255 / 0.92);
}

.dd-box-proxy-content {
  display: grid;
  gap: 0.6rem;
  color: #0f172a;
}

.dd-box-proxy-content strong {
  font-size: 0.92rem;
}

.dd-box-proxy-content p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #475569;
}

.dd-box-nested-shell {
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  padding: 1rem;
}
</style>
