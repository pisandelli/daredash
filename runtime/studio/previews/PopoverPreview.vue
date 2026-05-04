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
      <h2>Popover</h2>
      <p>Floating bubble surface with arrow, content padding and viewport layering.</p>
      <div class="dd-popover-note">
        <strong>Preview scope</strong>
        <span>
          Placement and trigger behavior stay runtime-driven. This shell focuses on the floating panel styling itself.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Floating panel shell</h3>
      <div class="dd-popover-stage">
        <button type="button" class="dd-popover-trigger" @click="focusField('popover.padding')">Trigger</button>
        <button type="button" class="dd-popover-shell" @click="focusField('popover.bg')">
          <div class="dd-popover-arrow" @click.stop="focusField('popover.arrow-size')"></div>
          <div class="dd-popover-header" @click.stop="focusField('popover.border-color')">Popover title</div>
          <div class="dd-popover-content" :style="{ padding: resolveFieldValue('popover.padding', 'var(--dd-popover-padding)') }">
            <p>Use this shell to tune the panel surface, text color, border and arrow geometry.</p>
            <div class="dd-popover-actions">
              <span @click.stop="focusField('popover.color')">Text</span>
              <span @click.stop="focusField('popover.shadow')">Shadow</span>
              <span @click.stop="focusField('popover.z-index')">Z-Index</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-popover-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
}

.dd-popover-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-popover-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-popover-stage {
  position: relative;
  min-height: 16rem;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  padding: 1.5rem;
}

.dd-popover-trigger {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.96);
  padding: 0.55rem 0.95rem;
  color: #334155;
}

.dd-popover-shell {
  position: absolute;
  inset-block-start: 4.3rem;
  inset-inline-start: 2rem;
  width: min(18rem, calc(100% - 3rem));
  border: 0;
  padding: 0;
  text-align: left;
  overflow: visible;
  color: var(--dd-popover-color);
  background: transparent;
  filter: drop-shadow(0 10px 15px rgb(0 0 0 / 0.1));
}

.dd-popover-arrow {
  position: absolute;
  inset-block-start: calc(var(--dd-popover-arrow-size) / -2);
  inset-inline-start: 1.3rem;
  width: var(--dd-popover-arrow-size);
  height: var(--dd-popover-arrow-size);
  background: var(--dd-popover-bg);
  border: 1px solid var(--dd-popover-border-color);
  transform: rotate(45deg);
}

.dd-popover-header {
  padding: var(--dd-popover-padding);
  font-weight: 700;
  border: 1px solid var(--dd-popover-border-color);
  border-bottom: 0;
  border-radius: var(--dd-popover-border-radius) var(--dd-popover-border-radius) 0 0;
  background: var(--dd-popover-bg);
}

.dd-popover-content {
  display: grid;
  gap: 0.8rem;
  border: 1px solid var(--dd-popover-border-color);
  border-radius: 0 0 var(--dd-popover-border-radius) var(--dd-popover-border-radius);
  background: var(--dd-popover-bg);
  box-shadow: var(--dd-popover-shadow);
}

.dd-popover-content p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: inherit;
}

.dd-popover-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.dd-popover-actions span {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.8);
  padding: 0.3rem 0.65rem;
  color: #0f766e;
}
</style>
