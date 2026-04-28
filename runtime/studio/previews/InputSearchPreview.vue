<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

function focusField(path: string) {
  previewContext?.focusField(path)
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Input Search</h2>
      <p>Search field pattern combining an inherited Input surface with a tokenized action button.</p>
      <div class="dd-form-note">
        <strong>How to read this preview</strong>
        <span><b>Token-driven here:</b> the group shell and the search button variants.</span>
        <span><b>Inherited elsewhere:</b> the text field half still follows the `Input` tokens.</span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Button variants</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdInputSearch placeholder="Search workspace" button-label="Search" />
          <button type="button" class="dd-form-link" @click="focusField('input-search.button.background-color')">Edit primary action</button>
        </div>
        <div class="dd-form-card">
          <DdInputSearch placeholder="Search active users" button-label="Apply" success />
          <button type="button" class="dd-form-link" @click="focusField('input-search.button.success.background-color')">Edit success action</button>
        </div>
        <div class="dd-form-card">
          <DdInputSearch placeholder="Delete by keyword" button-label="Remove" danger />
          <button type="button" class="dd-form-link" @click="focusField('input-search.button.danger.background-color')">Edit danger action</button>
        </div>
        <div class="dd-form-card">
          <DdInputSearch placeholder="Quick filter" button-label="Filter" neutral />
          <button type="button" class="dd-form-link" @click="focusField('input-search.button.neutral.background-color')">Edit neutral action</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-form-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
}

.dd-form-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-form-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-form-note b {
  color: #0f172a;
}

.dd-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.dd-form-card {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-form-link {
  justify-self: start;
  padding: 0;
  border: 0;
  background: transparent;
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
