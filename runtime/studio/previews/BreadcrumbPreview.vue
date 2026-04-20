<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const baseRoutes = [
  { label: 'Home', href: '#', icon: 'i-lucide-house' },
  { label: 'Library', href: '#' },
  { label: 'Navigation', href: '#' },
  { label: 'Breadcrumbs' }
]

const compactRoutes = [
  { label: 'Docs', href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Studio' }
]

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
      <h2>Breadcrumbs</h2>
      <p>Route trail, separator tone and emphasis for the current page.</p>
      <div class="dd-breadcrumb-preview-note">
        <strong>What to look at</strong>
        <span>
          This primitive is mostly typographic. Focus on item color, hover color, separator color, spacing between pieces and the stronger treatment of the current item.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Default trail</h3>
      <div
        role="button"
        tabindex="0"
        class="dd-breadcrumb-card"
        @click="focusField('breadcrumbs.item.color')"
        @click.capture.prevent
        @keydown.enter.prevent="focusField('breadcrumbs.item.color')"
        @keydown.space.prevent="focusField('breadcrumbs.item.color')"
      >
        <DdBreadcrumb :config="{ routes: baseRoutes }" />
        <div class="dd-breadcrumb-meta">
          <span>{{ resolveFieldValue('breadcrumbs.font-size', 'var(--dd-breadcrumbs-font-size)') }}</span>
          <span>{{ resolveFieldValue('breadcrumbs.gap', 'var(--dd-breadcrumbs-gap)') }}</span>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Custom separator</h3>
      <div
        role="button"
        tabindex="0"
        class="dd-breadcrumb-card"
        @click="focusField('breadcrumbs.separator.color')"
        @click.capture.prevent
        @keydown.enter.prevent="focusField('breadcrumbs.separator.color')"
        @keydown.space.prevent="focusField('breadcrumbs.separator.color')"
      >
        <DdBreadcrumb :config="{ separator: '/', routes: compactRoutes }" />
        <div class="dd-breadcrumb-meta">
          <span>{{ resolveFieldValue('breadcrumbs.separator.color', 'var(--dd-breadcrumbs-separator-color)') }}</span>
          <span>{{ resolveFieldValue('breadcrumbs.item-current.font-weight', 'var(--dd-breadcrumbs-item-current-font-weight)') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-breadcrumb-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(59 130 246 / 0.15);
  background: linear-gradient(180deg, rgba(239 246 255 / 0.96), rgba(219 234 254 / 0.92));
  color: #0f172a;
}

.dd-breadcrumb-preview-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0369a1;
}

.dd-breadcrumb-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-breadcrumb-card {
  display: grid;
  gap: 0.9rem;
  width: 100%;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.dd-breadcrumb-card:hover {
  border-color: rgba(47 155 143 / 0.4);
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15 23 42 / 0.08);
}

.dd-breadcrumb-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.dd-breadcrumb-meta span {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(241 245 249 / 0.9);
  color: #475569;
  font-size: 0.76rem;
}
</style>
