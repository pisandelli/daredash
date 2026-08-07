<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'
import getPrefixName from '#dd/utils/getPrefixName'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

function focusField(path: string) {
  previewContext?.focusField(path)
}

function resolveFieldValue(path: string, fallbackCssVar: string) {
  const cssVar = getPrefixName(fallbackCssVar, { type: 'css-var' })
  return previewContext?.resolveFieldValue(path) || cssVar
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Modal</h2>
      <p>Centered dialog shell with focus on sizing, backdrop and content framing.</p>
      <div class="dd-modal-note">
        <strong>Preview scope</strong>
        <span>
          This is a controlled shell preview. The native dialog interaction is not opened inside the Studio, but the visual tokens are mirrored here.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Dialog shell</h3>
      <div class="dd-modal-stage">
        <div class="dd-modal-backdrop" @click="focusField('modal.backdrop.background-color')"></div>
        <button type="button" class="dd-modal-shell" @click="focusField('modal.border-radius')">
          <div class="dd-modal-header" :style="{ padding: resolveFieldValue('modal.padding', 'modal-padding') }">
            <div>
              <strong>Confirm publish</strong>
              <p>Review the final token delta before exporting.</p>
            </div>
            <span class="dd-modal-close" @click.stop="focusField('modal.close-size')">×</span>
          </div>
          <div class="dd-modal-body" :style="{ padding: `0 ${resolveFieldValue('modal.padding', 'modal-padding')}` }">
            <p>Body typography follows the dedicated modal body font family token.</p>
            <div class="dd-modal-card">Impacted tabs: Base, Toast, Toggle</div>
          </div>
          <div class="dd-modal-footer" :style="{ padding: resolveFieldValue('modal.padding', 'modal-padding') }">
            <button type="button" class="dd-modal-action" @click.stop="focusField('modal.padding')">Padding</button>
            <button type="button" class="dd-modal-action dd-modal-action-primary" @click.stop="focusField('modal.inline-size')">Inline size</button>
          </div>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Core token snapshot</h3>
      <div class="dd-modal-grid">
        <button type="button" class="dd-modal-token" @click="focusField('modal.inline-size')">
          <span>Inline size</span>
          <small>{{ resolveFieldValue('modal.inline-size', 'modal-inline-size') }}</small>
        </button>
        <button type="button" class="dd-modal-token" @click="focusField('modal.max-inline-size')">
          <span>Max width</span>
          <small>{{ resolveFieldValue('modal.max-inline-size', 'modal-max-inline-size') }}</small>
        </button>
        <button type="button" class="dd-modal-token" @click="focusField('modal.box-shadow')">
          <span>Shadow</span>
          <small>{{ resolveFieldValue('modal.box-shadow', 'modal-box-shadow') }}</small>
        </button>
        <button type="button" class="dd-modal-token" @click="focusField('modal.title.font-size')">
          <span>Title size</span>
          <small>{{ resolveFieldValue('modal.title.font-size', 'modal-title-font-size') }}</small>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-modal-note,
.dd-modal-token {
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
}

.dd-modal-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
}

.dd-modal-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-modal-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-modal-stage {
  position: relative;
  min-height: 22rem;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(248 250 252 / 0.98), rgba(241 245 249 / 0.96));
}

.dd-modal-backdrop {
  position: absolute;
  inset: 0;
  background: v('modal.backdrop.background-color');
  backdrop-filter: v('modal.backdrop.filter');
}

.dd-modal-shell {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  width: min(v('modal.inline-size'), calc(100% - 2rem));
  max-width: v('modal.max-inline-size');
  overflow: hidden;
  border: 0;
  border-radius: v('modal.border-radius');
  padding: 0;
  text-align: left;
  color: #0f172a;
  background: #fff;
  box-shadow: v('modal.box-shadow');
}

.dd-modal-header,
.dd-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dd-modal-header strong {
  display: block;
  font-size: v('modal.title.font-size');
  font-weight: v('modal.title.font-weight');
}

.dd-modal-header p,
.dd-modal-body p {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.86rem;
}

.dd-modal-close {
  font-size: v('modal.close-size');
  line-height: 1;
  color: #64748b;
}

.dd-modal-body {
  display: grid;
  gap: 0.85rem;
  font-family: v('modal.body.font-family');
}

.dd-modal-card {
  border-radius: 0.85rem;
  border: 1px dashed rgba(15 23 42 / 0.12);
  background: rgba(248 250 252 / 0.92);
  padding: 0.9rem 1rem;
  color: #334155;
}

.dd-modal-action {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.96);
  padding: 0.45rem 0.8rem;
  color: #334155;
}

.dd-modal-action-primary {
  background: rgba(14 165 233 / 0.12);
  color: #0f766e;
}

.dd-modal-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
}

.dd-modal-token {
  display: grid;
  gap: 0.2rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  color: #0f172a;
  text-align: left;
}

.dd-modal-token span {
  font-weight: 700;
}

.dd-modal-token small {
  color: #475569;
}
</style>
