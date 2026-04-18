<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Alerts</h2>
      <p>Base tokens, title styles and semantic colors.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Semantic</h3>
      <div class="dd-studio-preview-stack">
        <DdAlert primary closable icon title="Primary alert">
          Use primary tokens for emphasis.
        </DdAlert>
        <DdAlert success closable icon title="Success alert">
          Everything went as planned.
        </DdAlert>
        <DdAlert warning closable icon title="Warning alert">
          Watch for changes to this flow.
        </DdAlert>
        <DdAlert danger closable icon title="Danger alert">
          Something needs your attention.
        </DdAlert>
        <DdAlert info closable icon title="Info alert">
          Useful background context for users.
        </DdAlert>
      </div>
    </div>
  </section>
</template>
