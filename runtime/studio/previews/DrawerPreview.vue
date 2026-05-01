<script setup lang="ts">
import { inject, ref } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)
const isOpen = ref(false)

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
      <h2>Drawer</h2>
      <p>Sliding panel shell with backdrop, header, body and footer framing.</p>
      <div class="dd-drawer-note">
        <strong>How to read this preview</strong>
        <span>
          <b>Token-driven:</b> surface, size, shadow, internal padding, title scale and backdrop treatment.
        </span>
        <span>
          <b>Preview flow:</b> use the trigger below to open a real `Drawer` instance inside the Studio sandbox and evaluate it in a more realistic context.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Live drawer flow</h3>
      <div class="dd-drawer-stage">
        <div class="dd-drawer-app" :class="{ 'dd-drawer-app-open': isOpen }">
          <div class="dd-drawer-app-header">
            <div>
              <strong>Workspace settings</strong>
              <p>Editing team-wide preferences and moderation rules.</p>
            </div>
            <div class="dd-drawer-app-pills">
              <span>General</span>
              <span>Notifications</span>
              <span>Billing</span>
            </div>
          </div>

          <div class="dd-drawer-toolbar">
            <button type="button" class="dd-drawer-trigger dd-drawer-trigger-primary" @click="isOpen = true">
              Open settings drawer
            </button>
            <button type="button" class="dd-drawer-trigger" @click="focusField('drawer.backdrop.background-color')">
              Edit backdrop
            </button>
            <button type="button" class="dd-drawer-trigger" @click="focusField('drawer.size')">
              Edit size
            </button>
          </div>

          <div class="dd-drawer-app-grid">
            <div class="dd-drawer-app-card dd-drawer-app-card-featured">
              <strong>Moderation policy</strong>
              <p>Default review flow for new design tokens and exported themes.</p>
            </div>
            <div class="dd-drawer-app-card">
              <strong>Auto-publish</strong>
              <p>Disabled until approval from owners.</p>
            </div>
            <div class="dd-drawer-app-card">
              <strong>Destinations</strong>
              <p>Nuxt app, Storybook and internal docs.</p>
            </div>
            <div class="dd-drawer-app-card">
              <strong>Audit trail</strong>
              <p>Retain snapshots for 90 days.</p>
            </div>
          </div>
        </div>

        <DdDrawer
          v-model:open="isOpen"
          title="Workspace settings"
          @click.stop
        >
          <template #default>
            <div class="dd-drawer-live-body">
              <button type="button" class="dd-drawer-hotspot-card" @click="focusField('drawer.bg')">
                <strong>Surface</strong>
                <small>Use the drawer background token to change this panel shell.</small>
              </button>
              <button type="button" class="dd-drawer-hotspot-card" @click="focusField('drawer.padding')">
                <strong>Internal spacing</strong>
                <small>Header, body and footer all inherit the shared padding token.</small>
              </button>
              <button type="button" class="dd-drawer-hotspot-card" @click="focusField('drawer.title.font-size')">
                <strong>Title hierarchy</strong>
                <small>Adjust title size and weight to fit your product voice.</small>
              </button>
            </div>
          </template>

          <template #footer>
            <div class="dd-drawer-live-footer">
              <button type="button" class="dd-drawer-action" @click="focusField('drawer.footer.border-color')">Footer border</button>
              <button type="button" class="dd-drawer-action dd-drawer-action-primary" @click="focusField('drawer.box-shadow')">Shadow</button>
            </div>
          </template>
        </DdDrawer>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Core token snapshot</h3>
      <div class="dd-drawer-grid">
        <button type="button" class="dd-drawer-token" @click="focusField('drawer.bg')">
          <span>Background</span>
          <small>{{ resolveFieldValue('drawer.bg', 'var(--dd-drawer-bg)') }}</small>
        </button>
        <button type="button" class="dd-drawer-token" @click="focusField('drawer.size')">
          <span>Size</span>
          <small>{{ resolveFieldValue('drawer.size', 'var(--dd-drawer-size)') }}</small>
        </button>
        <button type="button" class="dd-drawer-token" @click="focusField('drawer.box-shadow')">
          <span>Shadow</span>
          <small>{{ resolveFieldValue('drawer.box-shadow', 'var(--dd-drawer-box-shadow)') }}</small>
        </button>
        <button type="button" class="dd-drawer-token" @click="focusField('drawer.title.font-size')">
          <span>Title size</span>
          <small>{{ resolveFieldValue('drawer.title.font-size', 'var(--dd-drawer-title-font-size)') }}</small>
        </button>
        <button type="button" class="dd-drawer-token" @click="focusField('drawer.header.border-color')">
          <span>Header border</span>
          <small>{{ resolveFieldValue('drawer.header.border-color', 'var(--dd-drawer-header-border-color)') }}</small>
        </button>
        <button type="button" class="dd-drawer-token" @click="focusField('drawer.backdrop.filter')">
          <span>Backdrop filter</span>
          <small>{{ resolveFieldValue('drawer.backdrop.filter', 'var(--dd-drawer-backdrop-filter)') }}</small>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-drawer-note,
.dd-drawer-token {
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
}

.dd-drawer-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
}

.dd-drawer-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-drawer-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-drawer-stage {
  position: relative;
  min-height: 24rem;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background:
    radial-gradient(circle at top left, rgba(14 165 233 / 0.12), transparent 26%),
    linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-drawer-app {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: start;
  gap: 1rem;
  padding: 1.15rem;
  transition: filter 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}

.dd-drawer-app-open {
  filter: saturate(0.8);
}

.dd-drawer-app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.dd-drawer-app-header strong {
  display: block;
  font-size: 1rem;
  color: #0f172a;
}

.dd-drawer-app-header p {
  margin: 0.2rem 0 0;
  max-width: 28rem;
  color: #64748b;
  font-size: 0.86rem;
}

.dd-drawer-app-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dd-drawer-app-pills span {
  border: 1px solid rgba(15 23 42 / 0.06);
  border-radius: 999px;
  background: rgba(255 255 255 / 0.86);
  padding: 0.35rem 0.7rem;
  color: #475569;
  font-size: 0.78rem;
}

.dd-drawer-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.dd-drawer-trigger {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(255 255 255 / 0.88);
  padding: 0.5rem 0.9rem;
  color: #334155;
}

.dd-drawer-trigger-primary {
  background: rgba(14 165 233 / 0.12);
  color: #0f766e;
}

.dd-drawer-app-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: calc(100% - min(100%, var(--dd-drawer-size)) + 2rem);
}

.dd-drawer-app-card {
  min-height: 5.4rem;
  border: 1px solid rgba(15 23 42 / 0.06);
  border-radius: 1rem;
  background: rgba(255 255 255 / 0.78);
  box-shadow: 0 10px 30px rgba(15 23 42 / 0.05);
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.dd-drawer-app-card-featured {
  grid-column: 1 / -1;
}

.dd-drawer-app-card strong {
  display: block;
  color: #0f172a;
  font-size: 0.92rem;
}

.dd-drawer-app-card p {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.45;
}

.dd-drawer-hotspot-card {
  display: grid;
  gap: 0.2rem;
  width: 100%;
  border-radius: 0.8rem;
  border: 1px dashed rgba(15 23 42 / 0.12);
  background: rgba(248 250 252 / 0.92);
  padding: 0.9rem 1rem;
  color: #334155;
  text-align: left;
}

.dd-drawer-hotspot-card strong {
  font-size: 0.88rem;
  color: #0f172a;
}

.dd-drawer-hotspot-card small {
  color: #64748b;
}

.dd-drawer-live-body {
  display: grid;
  gap: 0.8rem;
}

.dd-drawer-live-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dd-drawer-footer {
  border-top: var(--dd-drawer-footer-border-width) var(--dd-drawer-footer-border-style) var(--dd-drawer-footer-border-color);
}

.dd-drawer-action {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.9);
  padding: 0.45rem 0.8rem;
  color: #334155;
}

.dd-drawer-action-primary {
  background: rgba(14 165 233 / 0.12);
  color: #0f766e;
}

.dd-drawer-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
}

.dd-drawer-token {
  display: grid;
  gap: 0.2rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  color: #0f172a;
  text-align: left;
}

.dd-drawer-token span {
  font-weight: 700;
}

.dd-drawer-token small {
  color: #475569;
}

@media (max-width: 820px) {
  .dd-drawer-app-grid {
    grid-template-columns: 1fr;
    max-width: calc(100% - min(100%, var(--dd-drawer-size)) + 1rem);
  }

  .dd-drawer-app-header {
    flex-direction: column;
  }

  .dd-drawer-app-pills {
    justify-content: flex-start;
  }
}
</style>
