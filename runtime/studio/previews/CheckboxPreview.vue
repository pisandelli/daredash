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
      <h2>Checkbox</h2>
      <p>Boolean selection control with label spacing, checked state and helper messaging.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>States</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdCheckbox label="Email me updates" />
          <button type="button" class="dd-form-link" @click="focusField('checkbox.border')">Edit idle checkbox</button>
        </div>
        <div class="dd-form-card">
          <DdCheckbox label="Feature enabled" :model-value="true" />
          <button type="button" class="dd-form-link" @click="focusField('checkbox.checked.bg')">Edit checked state</button>
        </div>
        <div class="dd-form-card">
          <DdCheckbox label="Disabled choice" disabled />
          <button type="button" class="dd-form-link" @click="focusField('checkbox.disabled.bg')">Edit disabled state</button>
        </div>
        <div class="dd-form-card">
          <DdCheckbox label="Needs review" warning="This permission is temporary." />
          <button type="button" class="dd-form-link" @click="focusField('checkbox.color')">Edit label treatment</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
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
