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
      <h2>Toaster</h2>
      <p>Fixed-position container that manages toast stacks and viewport offsets.</p>
      <div class="dd-toaster-note">
        <strong>What is token-driven here</strong>
        <span>
          This tab controls only the toaster container: `z-index`, stack `gap` and viewport offsets. The notification cards below are just host content from the separate `Toast` component.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Top-right placement</h3>
      <div class="dd-toaster-metrics">
        <button
          type="button"
          class="dd-toaster-metric"
          @click="focusField('toaster.position.top')"
        >
          <span class="dd-toaster-metric-label">Top offset</span>
          <span class="dd-toaster-metric-value">{{ resolveFieldValue('toaster.position.top', 'var(--dd-toaster-position-top)') }}</span>
        </button>
        <button
          type="button"
          class="dd-toaster-metric"
          @click="focusField('toaster.position.right')"
        >
          <span class="dd-toaster-metric-label">Right offset</span>
          <span class="dd-toaster-metric-value">{{ resolveFieldValue('toaster.position.right', 'var(--dd-toaster-position-right)') }}</span>
        </button>
        <button
          type="button"
          class="dd-toaster-metric"
          @click="focusField('toaster.gap')"
        >
          <span class="dd-toaster-metric-label">Stack gap</span>
          <span class="dd-toaster-metric-value">{{ resolveFieldValue('toaster.gap', 'var(--dd-toaster-gap)') }}</span>
        </button>
      </div>
      <div class="dd-toaster-stage">
        <div class="dd-toaster-host dd-toaster-host-top-right">
          <div class="dd-toaster-stack">
            <DdToast title="Saved" success>
              Changes were synced successfully.
            </DdToast>
            <DdToast title="Heads up" warning>
              Review the remaining required fields.
            </DdToast>
          </div>
        </div>
      </div>

      <div class="dd-toaster-actions">
        <button type="button" class="dd-toaster-action" @click="focusField('toaster.position.top')">Edit top offset</button>
        <button type="button" class="dd-toaster-action" @click="focusField('toaster.position.right')">Edit right offset</button>
        <button type="button" class="dd-toaster-action" @click="focusField('toaster.gap')">Edit stack gap</button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Bottom-left placement</h3>
      <div class="dd-toaster-metrics">
        <button
          type="button"
          class="dd-toaster-metric"
          @click="focusField('toaster.position.bottom')"
        >
          <span class="dd-toaster-metric-label">Bottom offset</span>
          <span class="dd-toaster-metric-value">{{ resolveFieldValue('toaster.position.bottom', 'var(--dd-toaster-position-bottom)') }}</span>
        </button>
        <button
          type="button"
          class="dd-toaster-metric"
          @click="focusField('toaster.position.left')"
        >
          <span class="dd-toaster-metric-label">Left offset</span>
          <span class="dd-toaster-metric-value">{{ resolveFieldValue('toaster.position.left', 'var(--dd-toaster-position-left)') }}</span>
        </button>
        <button
          type="button"
          class="dd-toaster-metric"
          @click="focusField('toaster.gap')"
        >
          <span class="dd-toaster-metric-label">Stack gap</span>
          <span class="dd-toaster-metric-value">{{ resolveFieldValue('toaster.gap', 'var(--dd-toaster-gap)') }}</span>
        </button>
      </div>
      <div class="dd-toaster-stage">
        <div class="dd-toaster-host dd-toaster-host-bottom-left">
          <div class="dd-toaster-stack dd-toaster-stack-reverse">
            <DdToast title="Connection lost" danger solid>
              Trying to reconnect the workspace.
            </DdToast>
            <DdToast title="Heads up" info solid>
              New release notes are available.
            </DdToast>
          </div>
        </div>
      </div>

      <div class="dd-toaster-actions">
        <button type="button" class="dd-toaster-action" @click="focusField('toaster.position.bottom')">Edit bottom offset</button>
        <button type="button" class="dd-toaster-action" @click="focusField('toaster.position.left')">Edit left offset</button>
        <button type="button" class="dd-toaster-action" @click="focusField('toaster.gap')">Edit stack gap</button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Container tokens</h3>
      <div class="dd-toaster-token-grid">
        <button
          type="button"
          class="dd-toaster-token"
          @click="focusField('toaster.z-index')"
        >
          <span class="dd-toaster-token-label">Z-Index</span>
          <span class="dd-toaster-token-value">{{ resolveFieldValue('toaster.z-index', 'var(--dd-toaster-z-index)') }}</span>
        </button>

        <button
          type="button"
          class="dd-toaster-token"
          @click="focusField('toaster.gap')"
        >
          <span class="dd-toaster-token-label">Stack Gap</span>
          <span class="dd-toaster-token-value">{{ resolveFieldValue('toaster.gap', 'var(--dd-toaster-gap)') }}</span>
        </button>

        <button
          type="button"
          class="dd-toaster-token"
          @click="focusField('toaster.position.top')"
        >
          <span class="dd-toaster-token-label">Top / Right</span>
          <span class="dd-toaster-token-value">
            {{ resolveFieldValue('toaster.position.top', 'var(--dd-toaster-position-top)') }}
            /
            {{ resolveFieldValue('toaster.position.right', 'var(--dd-toaster-position-right)') }}
          </span>
        </button>

        <button
          type="button"
          class="dd-toaster-token"
          @click="focusField('toaster.position.bottom')"
        >
          <span class="dd-toaster-token-label">Bottom / Left</span>
          <span class="dd-toaster-token-value">
            {{ resolveFieldValue('toaster.position.bottom', 'var(--dd-toaster-position-bottom)') }}
            /
            {{ resolveFieldValue('toaster.position.left', 'var(--dd-toaster-position-left)') }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-toaster-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(15 23 42 / 0.1);
  background: linear-gradient(180deg, rgba(248 250 252 / 0.98), rgba(241 245 249 / 0.96));
  color: #0f172a;
}

.dd-toaster-note strong {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-toaster-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-toaster-stage {
  position: relative;
  min-height: 18rem;
  border: 1px dashed rgba(15 23 42 / 0.12);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(255 255 255 / 0.96), rgba(248 250 252 / 0.96)),
    linear-gradient(90deg, rgba(148 163 184 / 0.14) 1px, transparent 1px),
    linear-gradient(0deg, rgba(148 163 184 / 0.14) 1px, transparent 1px);
  background-size: auto, 1.5rem 1.5rem, 1.5rem 1.5rem;
  overflow: hidden;
}

.dd-toaster-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.dd-toaster-host {
  position: absolute;
  max-width: min(22rem, calc(100% - 2rem));
}

.dd-toaster-host-top-right {
  inset-block-start: var(--dd-toaster-position-top);
  inset-inline-end: var(--dd-toaster-position-right);
}

.dd-toaster-host-bottom-left {
  inset-block-end: var(--dd-toaster-position-bottom);
  inset-inline-start: var(--dd-toaster-position-left);
}

.dd-toaster-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--dd-toaster-gap);
}

.dd-toaster-stack-reverse {
  align-items: flex-start;
  flex-direction: column-reverse;
}

.dd-toaster-metric,
.dd-toaster-token,
.dd-toaster-action {
  border: 1px solid rgba(15 23 42 / 0.1);
  background: rgba(255 255 255 / 0.94);
  color: #334155;
}

.dd-toaster-metric {
  display: grid;
  gap: 0.24rem;
  min-height: 4.5rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.dd-toaster-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.85rem;
}

.dd-toaster-action {
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;
}

.dd-toaster-action:hover,
.dd-toaster-metric:hover {
  border-color: rgba(47 155 143 / 0.35);
  background: rgba(240 253 250 / 0.96);
  color: #0f766e;
  box-shadow: 0 10px 22px rgba(15 23 42 / 0.08);
}

.dd-toaster-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

.dd-toaster-token {
  display: grid;
  gap: 0.4rem;
  min-height: 6.25rem;
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.dd-toaster-token:hover {
  border-color: rgba(47 155 143 / 0.4);
  box-shadow: 0 16px 30px rgba(15 23 42 / 0.08);
}

.dd-toaster-token-label {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.dd-toaster-metric-label {
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.dd-toaster-metric-value,
.dd-toaster-token-value {
  font-size: 0.88rem;
  line-height: 1.45;
  color: #0f172a;
}
</style>
