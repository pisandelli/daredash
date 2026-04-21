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
      <h2>Toast</h2>
      <p>Visual tokens for the individual notification card.</p>
      <div class="dd-toast-preview-note">
        <strong>How this differs from Toaster</strong>
        <span>
          This tab styles the toast itself: surface, spacing, icon and close action. Positioning and stack offsets still belong to the separate `Toaster` container.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Standard toasts</h3>
      <div class="dd-toast-stack">
        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.bg-color')"
        >
          <DdToast title="Workspace saved">
            Token updates were persisted and are ready to export.
          </DdToast>
        </button>

        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.icon-color')"
        >
          <DdToast title="Published successfully" success>
            The latest studio adjustments are now available to the team.
          </DdToast>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Solid variants</h3>
      <div class="dd-toast-stack">
        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.bg-color')"
        >
          <DdToast title="Primary update" solid>
            Default solid toast without a semantic override.
          </DdToast>
        </button>

        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.icon-color')"
        >
          <DdToast title="Published successfully" success solid>
            Success validates semantic icon and surface treatment together.
          </DdToast>
        </button>

        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.close-hover-bg')"
        >
          <DdToast title="Needs attention" warning solid>
            Warning toasts reuse the toast shell but change foreground rules for contrast.
          </DdToast>
        </button>

        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.border-color')"
        >
          <DdToast title="Connection lost" danger solid>
            Danger highlights blocking failures with a stronger semantic surface.
          </DdToast>
        </button>

        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.close-color')"
        >
          <DdToast title="Connection lost" error solid>
            Error toasts help validate border, close action and semantic icon treatment.
          </DdToast>
        </button>

        <button
          type="button"
          class="dd-toast-shell"
          @click="focusField('toast.color')"
        >
          <DdToast title="Release notes available" info solid>
            Info keeps the informative blue tone with the solid card treatment.
          </DdToast>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Core token snapshot</h3>
      <div class="dd-toast-token-grid">
        <button
          type="button"
          class="dd-toast-token"
          @click="focusField('toast.padding')"
        >
          <span class="dd-toast-token-label">Padding</span>
          <span class="dd-toast-token-value">{{ resolveFieldValue('toast.padding', 'var(--dd-toast-padding)') }}</span>
        </button>

        <button
          type="button"
          class="dd-toast-token"
          @click="focusField('toast.border-radius')"
        >
          <span class="dd-toast-token-label">Radius</span>
          <span class="dd-toast-token-value">{{ resolveFieldValue('toast.border-radius', 'var(--dd-toast-border-radius)') }}</span>
        </button>

        <button
          type="button"
          class="dd-toast-token"
          @click="focusField('toast.box-shadow')"
        >
          <span class="dd-toast-token-label">Shadow</span>
          <span class="dd-toast-token-value">{{ resolveFieldValue('toast.box-shadow', 'var(--dd-toast-box-shadow)') }}</span>
        </button>

        <button
          type="button"
          class="dd-toast-token"
          @click="focusField('toast.font-family')"
        >
          <span class="dd-toast-token-label">Font</span>
          <span class="dd-toast-token-value">{{ resolveFieldValue('toast.font-family', 'var(--dd-toast-font-family)') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-toast-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(15 23 42 / 0.1);
  background: linear-gradient(180deg, rgba(248 250 252 / 0.98), rgba(241 245 249 / 0.96));
  color: #0f172a;
}

.dd-toast-preview-note strong {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-toast-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-toast-stack,
.dd-toast-token-grid {
  display: grid;
  gap: 1rem;
}

.dd-toast-shell,
.dd-toast-token {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.dd-toast-token-grid {
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
}

.dd-toast-token {
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

.dd-toast-shell:hover,
.dd-toast-token:hover {
  transform: translateY(-1px);
}

.dd-toast-token:hover {
  border-color: rgba(47 155 143 / 0.4);
  box-shadow: 0 16px 30px rgba(15 23 42 / 0.08);
}

.dd-toast-token-label {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.dd-toast-token-value {
  font-size: 0.88rem;
  line-height: 1.45;
  color: #0f172a;
}
</style>
