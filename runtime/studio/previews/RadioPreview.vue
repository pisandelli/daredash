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
      <h2>Radio</h2>
      <p>Exclusive choice control with shared spacing, selected dot styling and disabled behavior.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Group states</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdRadio name="plan-a" value="starter" label="Starter" model-value="starter" />
          <DdRadio name="plan-a" value="pro" label="Pro" model-value="starter" />
          <button type="button" class="dd-form-link" @click="focusField('radio.checked.dot-color')">Edit selected dot</button>
        </div>
        <div class="dd-form-card">
          <DdRadio name="plan-b" value="monthly" label="Monthly" />
          <DdRadio name="plan-b" value="yearly" label="Yearly" warning="Best for annual contracts." />
          <button type="button" class="dd-form-link" @click="focusField('radio.border')">Edit idle radio</button>
        </div>
        <div class="dd-form-card">
          <DdRadio name="plan-c" value="archived" label="Archived" disabled />
          <button type="button" class="dd-form-link" @click="focusField('radio.disabled.bg')">Edit disabled state</button>
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
