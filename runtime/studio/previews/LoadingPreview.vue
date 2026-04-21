<script setup lang="ts">
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Loading</h2>
      <p>Centered status primitive for pending states and async boundaries.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Default</h3>
      <div class="dd-loading-card">
        <DdLoading label="Loading data..." />
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Custom content</h3>
      <div class="dd-loading-card">
        <DdLoading icon="svg-spinners:ring-resize">
          <span>Syncing workspace changes</span>
        </DdLoading>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-loading-card {
  display: grid;
  justify-items: center;
  padding: 1.5rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}
</style>
