<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Toaster</h2>
      <p>Fixed-position container that manages toast stacks and viewport offsets.</p>
      <div class="dd-toaster-note">
        <strong>What is token-driven here</strong>
        <span>
          This tab controls the toaster container: gap, z-index and offsets. The appearance of each notification card comes from the separate `Toast` component.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Top right stack</h3>
      <div class="dd-toaster-stage">
        <div class="dd-toaster-host dd-toaster-host-top-right">
          <div class="dd-toaster-stack">
            <DdToast title="Saved" success>
              Changes were synced successfully.
            </DdToast>
            <DdToast title="Heads up" warning>
              Review the remaining required fields.
            </DdToast>
          </div>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Bottom left stack</h3>
      <div class="dd-toaster-stage">
        <div class="dd-toaster-host dd-toaster-host-bottom-left">
          <div class="dd-toaster-stack dd-toaster-stack-reverse">
            <DdToast title="Connection lost" danger solid>
              Trying to reconnect the workspace.
            </DdToast>
            <DdToast title="Heads up" info solid>
              New release notes are available.
            </DdToast>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-toaster-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(15 23 42 / 0.1);
  background: linear-gradient(180deg, rgba(248 250 252 / 0.98), rgba(241 245 249 / 0.96));
  color: #0f172a;
}

.dd-toaster-note strong {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-toaster-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-toaster-stage {
  position: relative;
  min-height: 18rem;
  border: 1px dashed rgba(15 23 42 / 0.12);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.96), rgba(248 250 252 / 0.96));
  overflow: hidden;
}

.dd-toaster-host {
  position: absolute;
  max-width: min(22rem, calc(100% - 2rem));
}

.dd-toaster-host-top-right {
  inset-block-start: var(--dd-toaster-position-top);
  inset-inline-end: var(--dd-toaster-position-right);
}

.dd-toaster-host-bottom-left {
  inset-block-end: var(--dd-toaster-position-bottom);
  inset-inline-start: var(--dd-toaster-position-left);
}

.dd-toaster-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--dd-toaster-gap);
}

.dd-toaster-stack-reverse {
  align-items: flex-start;
  flex-direction: column-reverse;
}
</style>
