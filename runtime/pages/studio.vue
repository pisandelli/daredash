<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeEditor, TOKEN_GROUPS } from '#dd/composables/useThemeEditor'

definePageMeta({ layout: false })

const { values, hasChanges, reset, downloadTokens } = useThemeEditor()

const activeTab = ref('base')
const activeGroup = computed(() => TOKEN_GROUPS.find((g) => g.id === activeTab.value) ?? TOKEN_GROUPS[0]!)

const isDownloading = ref(false)
async function handleDownload() {
  isDownloading.value = true
  await downloadTokens()
  setTimeout(() => (isDownloading.value = false), 1200)
}
</script>

<template>
  <div class="dde-root">
    <!-- ── Header ───────────────────────────────────────────── -->
    <header class="dde-header">
      <div class="dde-header-brand">
        <span class="dde-header-logo">◈</span>
        <span class="dde-header-title">DareDash Studio</span>
        <span class="dde-header-badge">Theme Editor</span>
      </div>
      <div class="dde-header-actions">
        <button
          class="dde-btn dde-btn-ghost"
          :disabled="!hasChanges"
          type="button"
          @click="reset"
        >
          Reset
        </button>
        <button
          class="dde-btn dde-btn-primary"
          :disabled="!hasChanges || isDownloading"
          type="button"
          @click="handleDownload"
        >
          <span v-if="isDownloading">Exporting…</span>
          <span v-else>Export tokens.json</span>
        </button>
      </div>
    </header>

    <!-- ── Split pane ────────────────────────────────────────── -->
    <main class="dde-split">
      <!-- Form panel -->
      <aside class="dde-panel dde-panel-form">
        <!-- Tabs -->
        <nav class="dde-tabs" role="tablist" aria-label="Token groups">
          <button
            v-for="group in TOKEN_GROUPS"
            :key="group.id"
            role="tab"
            class="dde-tab"
            :class="{ 'dde-tab-active': activeTab === group.id }"
            :aria-selected="activeTab === group.id"
            type="button"
            @click="activeTab = group.id"
          >
            {{ group.label }}
          </button>
        </nav>

        <!-- Fields -->
        <div class="dde-fields" role="tabpanel">
          <div
            v-for="field in activeGroup.fields"
            :key="field.path"
            class="dde-field"
          >
            <label class="dde-field-label" :for="`field-${field.path}`">
              {{ field.label }}
              <code class="dde-field-path">{{ field.path }}</code>
            </label>

            <!-- Color picker -->
            <div v-if="field.type === 'color'" class="dde-color-wrapper">
              <input
                :id="`field-${field.path}`"
                v-model="values[field.path]"
                type="color"
                class="dde-color-swatch"
              />
              <input
                v-model="values[field.path]"
                type="text"
                class="dde-color-text"
                spellcheck="false"
              />
            </div>

            <!-- Select -->
            <select
              v-else-if="field.type === 'select'"
              :id="`field-${field.path}`"
              v-model="values[field.path]"
              class="dde-input"
            >
              <option
                v-for="opt in field.options"
                :key="opt"
                :value="opt"
              >
                {{ opt }}
              </option>
            </select>

            <!-- Text -->
            <input
              v-else
              :id="`field-${field.path}`"
              v-model="values[field.path]"
              type="text"
              class="dde-input"
              spellcheck="false"
            />

            <!-- Changed indicator -->
            <span
              v-if="values[field.path] !== field.defaultValue"
              class="dde-field-changed"
              title="Modified"
            >●</span>
          </div>
        </div>
      </aside>

      <!-- Preview panel -->
      <section class="dde-panel dde-panel-preview">
        <div class="dde-preview-inner">

          <!-- Buttons preview -->
          <div v-if="activeTab === 'base' || activeTab === 'button'" class="dde-preview-section">
            <h2 class="dde-preview-heading">Buttons</h2>

            <div class="dde-preview-row">
              <DdButton primary>Primary</DdButton>
              <DdButton success>Success</DdButton>
              <DdButton warning>Warning</DdButton>
              <DdButton danger>Danger</DdButton>
              <DdButton info>Info</DdButton>
            </div>

            <div class="dde-preview-row">
              <DdButton primary outline>Primary</DdButton>
              <DdButton success outline>Success</DdButton>
              <DdButton warning outline>Warning</DdButton>
              <DdButton danger outline>Danger</DdButton>
            </div>

            <div class="dde-preview-row">
              <DdButton primary ghost>Primary</DdButton>
              <DdButton success ghost>Success</DdButton>
              <DdButton danger ghost>Danger</DdButton>
            </div>

            <div class="dde-preview-row">
              <DdButton primary small>Small</DdButton>
              <DdButton primary>Regular</DdButton>
              <DdButton primary large>Large</DdButton>
            </div>

            <div class="dde-preview-row">
              <DdButton primary icon="heroicons:star" />
              <DdButton primary icon="heroicons:star">With icon</DdButton>
              <DdButton primary disabled>Disabled</DdButton>
            </div>
          </div>

          <!-- Badges preview -->
          <div v-if="activeTab === 'base' || activeTab === 'badge'" class="dde-preview-section">
            <h2 class="dde-preview-heading">Badges</h2>

            <div class="dde-preview-row">
              <DdBadge>Default</DdBadge>
              <DdBadge primary>Primary</DdBadge>
              <DdBadge success>Success</DdBadge>
              <DdBadge warning>Warning</DdBadge>
              <DdBadge danger>Danger</DdBadge>
              <DdBadge info>Info</DdBadge>
            </div>

            <div class="dde-preview-row">
              <DdBadge primary icon="heroicons:star">With icon</DdBadge>
              <DdBadge success icon="heroicons:check-circle">Success</DdBadge>
              <DdBadge danger icon="heroicons:x-circle">Danger</DdBadge>
            </div>
          </div>

          <!-- Base section shows both -->
          <div v-if="activeTab === 'base'" class="dde-preview-note">
            <p>Editing <strong>Base</strong> tokens affects both Buttons and Badges.</p>
          </div>

        </div>
      </section>
    </main>
  </div>
</template>

<style>
/* ── Reset for this page ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Design tokens (local to the editor UI, NOT using v() to avoid conflict) */
:root {
  --dde-bg:          #0d0d10;
  --dde-bg-panel:    #13131a;
  --dde-bg-field:    #1a1a24;
  --dde-bg-tab:      #1e1e2a;
  --dde-border:      rgba(255 255 255 / 0.08);
  --dde-text:        #e2e4f0;
  --dde-text-muted:  #6b7095;
  --dde-text-code:   #a78bfa;
  --dde-accent:      #7c6ff7;
  --dde-accent-glow: rgba(124 111 247 / 0.25);
  --dde-success:     #22c55e;
  --dde-radius-sm:   6px;
  --dde-radius-md:   10px;
  --dde-radius-lg:   14px;
  --dde-header-h:    3.5rem;
  --dde-font:        'Inter', system-ui, -apple-system, sans-serif;
}

/* ── Root layout ────────────────────────────────────────────────────────── */
.dde-root {
  display: grid;
  grid-template-rows: var(--dde-header-h) 1fr;
  block-size: 100dvh;
  inline-size: 100dvw;
  overflow: hidden;
  background: var(--dde-bg);
  font-family: var(--dde-font);
  color: var(--dde-text);
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.dde-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 1.5rem;
  border-block-end: 1px solid var(--dde-border);
  background: rgba(13 13 16 / 0.9);
  backdrop-filter: blur(12px);
  gap: 1rem;
}

.dde-header-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.dde-header-logo {
  font-size: 1.25rem;
  color: var(--dde-accent);
  line-height: 1;
}

.dde-header-title {
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  color: var(--dde-text);
}

.dde-header-badge {
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  background: var(--dde-accent-glow);
  color: var(--dde-accent);
  border: 1px solid rgba(124 111 247 / 0.3);
}

.dde-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ── Buttons (editor UI only) ───────────────────────────────────────────── */
.dde-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding-inline: 0.875rem;
  block-size: 2rem;
  border-radius: var(--dde-radius-sm);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 140ms ease-in-out;
  white-space: nowrap;
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.dde-btn-ghost {
  background: transparent;
  color: var(--dde-text-muted);
  border-color: var(--dde-border);

  &:hover:not(:disabled) {
    background: rgba(255 255 255 / 0.05);
    color: var(--dde-text);
  }
}

.dde-btn-primary {
  background: var(--dde-accent);
  color: #fff;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--dde-accent) 85%, black);
    box-shadow: 0 0 0 3px var(--dde-accent-glow);
  }
}

/* ── Split pane ─────────────────────────────────────────────────────────── */
.dde-split {
  display: grid;
  grid-template-columns: 380px 1fr;
  overflow: hidden;
}

/* ── Base panel ─────────────────────────────────────────────────────────── */
.dde-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Form panel ─────────────────────────────────────────────────────────── */
.dde-panel-form {
  border-inline-end: 1px solid var(--dde-border);
  background: var(--dde-bg-panel);
}

.dde-tabs {
  display: flex;
  padding-inline: 1rem;
  padding-block-start: 0.75rem;
  gap: 0.25rem;
  border-block-end: 1px solid var(--dde-border);
  background: var(--dde-bg-panel);
  flex-shrink: 0;
}

.dde-tab {
  padding-inline: 0.875rem;
  padding-block: 0.5rem;
  border-radius: var(--dde-radius-sm) var(--dde-radius-sm) 0 0;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--dde-text-muted);
  transition: all 140ms ease-in-out;
  position: relative;

  &:hover {
    color: var(--dde-text);
    background: rgba(255 255 255 / 0.04);
  }

  &.dde-tab-active {
    color: var(--dde-accent);
    background: var(--dde-bg-tab);

    &::after {
      content: '';
      position: absolute;
      inset-block-end: -1px;
      inset-inline: 0;
      block-size: 2px;
      background: var(--dde-accent);
      border-radius: 2px 2px 0 0;
    }
  }
}

.dde-fields {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  scrollbar-width: thin;
  scrollbar-color: rgba(255 255 255 / 0.1) transparent;
}

.dde-field {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.375rem 0.5rem;
  align-items: center;
  position: relative;
}

.dde-field-label {
  grid-column: 1;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--dde-text);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dde-field-path {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--dde-text-code);
  opacity: 0.7;
}

.dde-field-changed {
  grid-column: 2;
  grid-row: 1;
  font-size: 0.5rem;
  color: var(--dde-accent);
  align-self: start;
  padding-block-start: 0.15rem;
}

.dde-input {
  grid-column: 1 / -1;
  block-size: 2rem;
  padding-inline: 0.625rem;
  background: var(--dde-bg-field);
  border: 1px solid var(--dde-border);
  border-radius: var(--dde-radius-sm);
  color: var(--dde-text);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.78rem;
  transition: border-color 140ms ease-in-out;
  inline-size: 100%;
  min-inline-size: 0;

  &:focus {
    outline: none;
    border-color: var(--dde-accent);
    box-shadow: 0 0 0 3px var(--dde-accent-glow);
  }

  option {
    background: var(--dde-bg-field);
    color: var(--dde-text);
  }
}

.dde-color-wrapper {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dde-color-swatch {
  flex-shrink: 0;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: var(--dde-radius-sm);
  border: 1px solid var(--dde-border);
  padding: 0.15rem;
  background: var(--dde-bg-field);
  cursor: pointer;

  &::-webkit-color-swatch-wrapper { padding: 0; border-radius: 4px; }
  &::-webkit-color-swatch { border: none; border-radius: 4px; }
  &::-moz-color-swatch { border: none; border-radius: 4px; }
}

.dde-color-text {
  flex: 1;
  min-inline-size: 0;
  block-size: 2rem;
  padding-inline: 0.625rem;
  background: var(--dde-bg-field);
  border: 1px solid var(--dde-border);
  border-radius: var(--dde-radius-sm);
  color: var(--dde-text);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.78rem;
  transition: border-color 140ms ease-in-out;

  &:focus {
    outline: none;
    border-color: var(--dde-accent);
    box-shadow: 0 0 0 3px var(--dde-accent-glow);
  }
}

/* ── Preview panel ──────────────────────────────────────────────────────── */
.dde-panel-preview {
  overflow-y: auto;
  background:
    radial-gradient(ellipse 60% 40% at 70% 20%, rgba(124 111 247 / 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 50% 30% at 30% 80%, rgba(99 210 255 / 0.04) 0%, transparent 60%),
    #f4f5f7;

  scrollbar-width: thin;
  scrollbar-color: rgba(0 0 0 / 0.1) transparent;
}

.dde-preview-inner {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  min-block-size: 100%;
}

.dde-preview-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dde-preview-heading {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8a93a8;
  padding-block-end: 0.5rem;
  border-block-end: 1px solid rgba(0 0 0 / 0.08);
}

.dde-preview-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.dde-preview-note {
  margin-block-start: auto;
  padding: 0.875rem 1rem;
  background: rgba(124 111 247 / 0.08);
  border: 1px solid rgba(124 111 247 / 0.2);
  border-radius: var(--dde-radius-md);
  font-size: 0.8rem;
  color: #6b7095;
  line-height: 1.5;

  strong { color: var(--dde-accent); }
}
</style>