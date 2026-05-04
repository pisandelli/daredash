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
      <h2>Sidebar</h2>
      <p>Responsive two-region layout primitive for side navigation and main content.</p>
      <div class="dd-sidebar-preview-note">
        <strong>How to read this preview</strong>
        <span>
          <b>Token-driven:</b> `sidebar.column-size` controls the preferred width of the side pane, `sidebar.content-size` controls the minimum readable threshold of the main pane, and `sidebar.gap` controls the space between them.
        </span>
        <span>
          <b>Preview-only:</b> the tinted panes, labels and content cards are host shells to expose the layout behavior. They are not part of the Sidebar primitive itself.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Default flow</h3>
      <button
        type="button"
        class="dd-sidebar-stage-button"
        @click="focusField('sidebar.column-size')"
      >
        <DdSidebar class="dd-sidebar-stage">
          <aside class="dd-sidebar-pane dd-sidebar-pane-side">
            <strong>Sidebar</strong>
            <span>{{ resolveFieldValue('sidebar.column-size', 'var(--dd-sidebar-column-size)') }}</span>
          </aside>
          <div class="dd-sidebar-pane dd-sidebar-pane-main">
            <strong>Main content</strong>
            <p>
              This region stays flexible until it hits the content threshold defined by `sidebar.content-size`.
            </p>
            <span>{{ resolveFieldValue('sidebar.content-size', 'var(--dd-sidebar-content-size)') }}</span>
          </div>
        </DdSidebar>
      </button>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Right-side variant</h3>
      <button
        type="button"
        class="dd-sidebar-stage-button"
        @click="focusField('sidebar.content-size')"
      >
        <DdSidebar right class="dd-sidebar-stage">
          <div class="dd-sidebar-pane dd-sidebar-pane-main">
            <strong>Body first</strong>
            <p>
              The same tokens still drive the layout when the supporting pane moves to the right.
            </p>
          </div>
          <aside class="dd-sidebar-pane dd-sidebar-pane-side">
            <strong>Right rail</strong>
            <span>same column token</span>
          </aside>
        </DdSidebar>
      </button>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Token focus</h3>
      <div class="dd-sidebar-token-grid">
        <button
          type="button"
          class="dd-sidebar-token"
          @click="focusField('sidebar.gap')"
        >
          <span class="dd-sidebar-token-label">Gap</span>
          <span class="dd-sidebar-token-value">{{ resolveFieldValue('sidebar.gap', 'var(--dd-sidebar-gap)') }}</span>
        </button>

        <button
          type="button"
          class="dd-sidebar-token"
          @click="focusField('sidebar.column-size')"
        >
          <span class="dd-sidebar-token-label">Sidebar column</span>
          <span class="dd-sidebar-token-value">{{ resolveFieldValue('sidebar.column-size', 'var(--dd-sidebar-column-size)') }}</span>
        </button>

        <button
          type="button"
          class="dd-sidebar-token"
          @click="focusField('sidebar.content-size')"
        >
          <span class="dd-sidebar-token-label">Content threshold</span>
          <span class="dd-sidebar-token-value">{{ resolveFieldValue('sidebar.content-size', 'var(--dd-sidebar-content-size)') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-sidebar-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
  color: #0f172a;
}

.dd-sidebar-preview-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-sidebar-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-sidebar-stage-button,
.dd-sidebar-token {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.dd-sidebar-stage {
  inline-size: 100%;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-sidebar-pane {
  display: grid;
  gap: 0.55rem;
  min-block-size: 8rem;
  padding: 1rem;
  border-radius: 0.95rem;
}

.dd-sidebar-pane strong {
  font-size: 0.9rem;
}

.dd-sidebar-pane span,
.dd-sidebar-pane p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: #475569;
}

.dd-sidebar-pane-side {
  background: rgba(191 219 254 / 0.45);
}

.dd-sidebar-pane-main {
  background: rgba(226 232 240 / 0.72);
}

.dd-sidebar-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 0.9rem;
}

.dd-sidebar-token {
  display: grid;
  gap: 0.28rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-sidebar-token-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.dd-sidebar-token-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}
</style>
