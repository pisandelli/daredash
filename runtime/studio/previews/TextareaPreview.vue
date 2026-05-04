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
      <h2>Textarea</h2>
      <p>Multiline field with inherited input styling, content states and vertical resize behavior.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Core behavior</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdTextarea label="Message" placeholder="Write a longer message" rows="4" />
          <button type="button" class="dd-form-link" @click="focusField('textarea.min-height')">Edit minimum height</button>
        </div>
        <div class="dd-form-card">
          <DdTextarea label="With counter" placeholder="Document the release notes" rows="4" max-length="140" model-value="Ready for QA review." />
          <button type="button" class="dd-form-link" @click="focusField('textarea.resize')">Edit resize behavior</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>States</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdTextarea success label="Success" rows="4" model-value="Looks complete." />
          <button type="button" class="dd-form-link" @click="focusField('textarea.success-state.border-color')">Edit success state</button>
        </div>
        <div class="dd-form-card">
          <DdTextarea warning="This summary needs more detail." label="Warning" rows="4" />
          <button type="button" class="dd-form-link" @click="focusField('textarea.warning-state.border-color')">Edit warning state</button>
        </div>
        <div class="dd-form-card">
          <DdTextarea error="Description is required." label="Error" rows="4" />
          <button type="button" class="dd-form-link" @click="focusField('textarea.error-state.border-color')">Edit error state</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
