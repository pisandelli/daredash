<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Progress</h2>
      <p>Linear progress bar with semantic indicators, labels and tooltip treatment.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Sizes</h3>
      <div class="dd-progress-stack">
        <DdProgress label="Tiny" tiny :value="28" />
        <DdProgress label="Small" small :value="42" />
        <DdProgress label="Regular" :value="58" />
        <DdProgress label="Large" large :value="72" />
        <DdProgress label="XLarge" xlarge :value="86" />
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Semantic</h3>
      <div class="dd-progress-stack">
        <DdProgress label="Primary" primary :value="64" />
        <DdProgress label="Success" success :value="79" />
        <DdProgress label="Warning" warning :value="51" />
        <DdProgress label="Danger" danger :value="34" />
        <DdProgress label="Info" info :value="90" />
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Indeterminate</h3>
      <div class="dd-progress-stack">
        <DdProgress label="Background sync" indeterminate />
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-progress-stack {
  display: grid;
  gap: 1rem;
}
</style>
