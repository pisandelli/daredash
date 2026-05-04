<script setup lang="ts">
import { inject } from 'vue'
import type { MenuEntry } from '../../components/widgets/Menu/types'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const sidebarItems: MenuEntry[] = [
  { key: 'overview', label: 'Overview', icon: 'heroicons:squares-2x2', active: true, action: { type: 'none' } },
  { key: 'analytics', label: 'Analytics', icon: 'heroicons:chart-bar', badge: { label: 3 }, action: { type: 'none' } },
  { type: 'separator', label: 'Workspace' },
  {
    key: 'projects',
    label: 'Projects',
    icon: 'heroicons:folder',
    children: [
      { key: 'alpha', label: 'Alpha roadmap', action: { type: 'none' } },
      { key: 'beta', label: 'Beta release', action: { type: 'none' } }
    ],
    action: { type: 'none' }
  },
  { key: 'settings', label: 'Settings', icon: 'heroicons:cog-6-tooth', action: { type: 'none' } }
]

const floatingItems: MenuEntry[] = [
  { key: 'docs', label: 'Documentation', action: { type: 'none' } },
  {
    key: 'resources',
    label: 'Resources',
    float: true,
    children: [
      { key: 'guides', label: 'Guides', action: { type: 'none' } },
      { key: 'tokens', label: 'Token glossary', action: { type: 'none' } }
    ],
    action: { type: 'none' }
  },
  { key: 'support', label: 'Support', disabled: true, action: { type: 'none' } }
]

function focusField(path: string) {
  previewContext?.focusField(path)
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Menu</h2>
      <p>Navigation widget with item states, separators, floating panels and collapsible chrome.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Vertical sidebar</h3>
      <div class="dd-menu-shell">
        <DdMenu :items="sidebarItems" toggle-button collapsible active-key="overview" />
        <div class="dd-menu-actions">
          <button type="button" class="dd-menu-action" @click="focusField('menu.width')">Width</button>
          <button type="button" class="dd-menu-action" @click="focusField('menu.item.bg-active')">Active item</button>
          <button type="button" class="dd-menu-action" @click="focusField('menu.separator.border-color')">Separator</button>
          <button type="button" class="dd-menu-action" @click="focusField('menu.toggle.icon-size')">Toggle</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Floating sub-menu</h3>
      <div class="dd-menu-shell dd-menu-shell-inline">
        <DdMenu :items="floatingItems" orientation="horizontal" active-key="docs" />
        <p class="dd-menu-help">
          Use the float tokens to tune the panel surface that appears for nested flyouts.
        </p>
        <div class="dd-menu-actions">
          <button type="button" class="dd-menu-action" @click="focusField('menu.float.bg')">Float background</button>
          <button type="button" class="dd-menu-action" @click="focusField('menu.float.border-color')">Float border</button>
          <button type="button" class="dd-menu-action" @click="focusField('menu.float.shadow')">Float shadow</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-menu-shell {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-menu-shell-inline {
  align-items: start;
}

.dd-menu-help {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.5;
  color: #64748b;
}

.dd-menu-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.dd-menu-action {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.96);
  padding: 0.45rem 0.8rem;
  color: #0f766e;
}
</style>
