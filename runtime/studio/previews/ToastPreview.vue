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
        <span>
          Icon colors are token-driven here, but the icon glyphs themselves still come from `appConfig.daredash.icons`. Changing the actual symbol for `success`, `danger`, `error`, `warning` or `info` is not part of the current token flow yet.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Standard toasts</h3>
      <div class="dd-toast-stack">
        <div class="dd-toast-shell">
          <DdToast title="Workspace saved">
            Token updates were persisted and are ready to export.
          </DdToast>
          <div class="dd-toast-callout">
            <strong>General shell</strong>
            <span>
              Use this first toast to adjust shared surface tokens like background, text, border and close action. Those values apply to every standard toast below.
            </span>
            <span>
              `Background` accepts a plain color or a full CSS background value such as `linear-gradient(...)`.
            </span>
          </div>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.background')">Background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.color')">Text</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.icon-color')">Default icon</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.close-color')">Close</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Published successfully" success>
            The latest studio adjustments are now available to the team.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.success.icon-color')">Success icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Needs attention" warning>
            Review the pending changes before publishing this release.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.warning.icon-color')">Warning icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Connection lost" danger>
            Danger helps call attention to destructive or blocking failures.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.danger.icon-color')">Danger icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Request failed" error>
            Error mirrors the critical path and can diverge from danger when needed.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.error.icon-color')">Error icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Release notes available" info>
            Informational toasts can stay lighter while still feeling distinct.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.info.icon-color')">Info icon</button>
          </div>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Solid variants</h3>
      <div class="dd-toast-stack">
        <div class="dd-toast-shell">
          <DdToast title="Primary update" solid>
            Default solid toast without a semantic override.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.primary.background')">Primary background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.primary.color')">Primary text</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.primary.icon-color')">Primary icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Published successfully" success solid>
            Success validates semantic icon and surface treatment together.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.success.background')">Success background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.success.color')">Success text</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.success.icon-color')">Success icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Needs attention" warning solid>
            Warning toasts reuse the toast shell but change foreground rules for contrast.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.warning.background')">Warning background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.warning.color')">Warning text</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.warning.icon-color')">Warning icon</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.warning.close-hover-bg')">Warning close hover</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Connection lost" danger solid>
            Danger highlights blocking failures with a stronger semantic surface.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.danger.background')">Danger background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.danger.color')">Danger text</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.danger.icon-color')">Danger icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Connection lost" error solid>
            Error toasts help validate border, close action and semantic icon treatment.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.error.background')">Error background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.error.icon-color')">Error solid icon</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.error.icon-color')">Error default icon</button>
          </div>
        </div>

        <div class="dd-toast-shell">
          <DdToast title="Release notes available" info solid>
            Info keeps the informative blue tone with the solid card treatment.
          </DdToast>
          <div class="dd-toast-actions">
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.info.background')">Info background</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.info.color')">Info text</button>
            <button type="button" class="dd-toast-action" @click="focusField('toast.solid.info.icon-color')">Info icon</button>
          </div>
        </div>
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

.dd-toast-shell {
  display: grid;
  gap: 0.7rem;
}

.dd-toast-token {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
}

.dd-toast-token-grid {
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
}

.dd-toast-callout {
  display: grid;
  gap: 0.22rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(248 250 252 / 0.98), rgba(241 245 249 / 0.96));
}

.dd-toast-callout strong {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-toast-callout span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-toast-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.dd-toast-action {
  padding: 0.45rem 0.7rem;
  border: 1px solid rgba(15 23 42 / 0.1);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.9);
  color: #334155;
  font-size: 0.78rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;
}

.dd-toast-action:hover {
  border-color: rgba(47 155 143 / 0.35);
  background: rgba(240 253 250 / 0.96);
  color: #0f766e;
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
    box-shadow 160ms ease;
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
