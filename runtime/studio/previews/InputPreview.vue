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
      <h2>Input</h2>
      <p>Foundation text field with size variants, inline icons and validation states.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Sizes</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdInput small label="Small" placeholder="Compact entry" />
          <button type="button" class="dd-form-link" @click="focusField('input.size.small.height')">Edit small size</button>
        </div>
        <div class="dd-form-card">
          <DdInput label="Default" placeholder="Default input" />
          <button type="button" class="dd-form-link" @click="focusField('input.height')">Edit base field</button>
        </div>
        <div class="dd-form-card">
          <DdInput large label="Large" placeholder="Expanded touch target" />
          <button type="button" class="dd-form-link" @click="focusField('input.size.large.height')">Edit large size</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>States</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdInput label="Success" placeholder="Looks good" success />
          <button type="button" class="dd-form-link" @click="focusField('input.success-state.border-color')">Edit success state</button>
        </div>
        <div class="dd-form-card">
          <DdInput label="Warning" placeholder="Needs attention" warning="Double-check this value." />
          <button type="button" class="dd-form-link" @click="focusField('input.warning-state.border-color')">Edit warning state</button>
        </div>
        <div class="dd-form-card">
          <DdInput label="Error" placeholder="Required field" error="This field is required." />
          <button type="button" class="dd-form-link" @click="focusField('input.error-state.border-color')">Edit error state</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Icons and disabled</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdInput label="Search" placeholder="Search records" icon="heroicons:magnifying-glass" />
          <button type="button" class="dd-form-link" @click="focusField('input.padding.inline.start')">Edit left icon spacing</button>
        </div>
        <div class="dd-form-card">
          <DdInput label="Password" type="password" placeholder="Secure value" icon-right="heroicons:eye" />
          <button type="button" class="dd-form-link" @click="focusField('input.padding.inline.end')">Edit right icon spacing</button>
        </div>
        <div class="dd-form-card">
          <DdInput label="Disabled" placeholder="Unavailable" disabled />
          <button type="button" class="dd-form-link" @click="focusField('input.disabled.background-color')">Edit disabled state</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
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
