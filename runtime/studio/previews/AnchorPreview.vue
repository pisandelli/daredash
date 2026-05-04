<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Anchor</h2>
      <p>Navigation component for navigating between sections of a page.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Basic</h3>
      <div class="dd-studio-preview-row" style="flex-direction: column; align-items: stretch; max-width: 250px; padding: 1.5rem; border: 1px solid var(--dd-color-gray-200); border-radius: var(--dd-border-radius-base); background-color: var(--dd-color-white);">
        <DdAnchor :items="mockItems" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mockItems = ref([
  { key: 'section1', href: '#section1', title: 'Introduction' },
  { key: 'section2', href: '#section2', title: 'Components' },
  { key: 'section3', href: '#section3', title: 'Tokens & Styling' },
  { key: 'section4', href: '#section4', title: 'Resources' }
])
</script>
