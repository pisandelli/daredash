<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Operations', value: 'operations' }
]

function focusField(path: string) {
  previewContext?.focusField(path)
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Select</h2>
      <p>Inherited field shell with dropdown affordances, menu surface and option states.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Sizes</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdSelect small label="Small" :options="options" placeholder="Choose a team" />
          <button type="button" class="dd-form-link" @click="focusField('select.height')">Edit field size</button>
        </div>
        <div class="dd-form-card">
          <DdSelect label="Default" :options="options" placeholder="Choose a team" />
          <button type="button" class="dd-form-link" @click="focusField('select.indicator-padding-inline-end')">Edit indicator spacing</button>
        </div>
        <div class="dd-form-card">
          <DdSelect large label="Large" :options="options" placeholder="Choose a team" />
          <button type="button" class="dd-form-link" @click="focusField('select.font-size')">Edit large typography</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>States</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdSelect success label="Success" :options="options" model-value="engineering" />
          <button type="button" class="dd-form-link" @click="focusField('select.success-state.border-color')">Edit success state</button>
        </div>
        <div class="dd-form-card">
          <DdSelect warning="Review this choice." label="Warning" :options="options" />
          <button type="button" class="dd-form-link" @click="focusField('select.warning-state.border-color')">Edit warning state</button>
        </div>
        <div class="dd-form-card">
          <DdSelect error="A team is required." label="Error" :options="options" />
          <button type="button" class="dd-form-link" @click="focusField('select.error-state.border-color')">Edit error state</button>
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
