<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Skeleton</h2>
      <p>Loading placeholders for cards, list rows and profile summaries.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Lines</h3>
      <div class="dd-skeleton-card">
        <DdStack compact>
          <DdSkeleton width="28%" height="1.25rem" />
          <DdSkeleton width="100%" />
          <DdSkeleton width="82%" />
          <DdSkeleton width="68%" />
        </DdStack>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Profile card</h3>
      <div class="dd-skeleton-card">
        <DdCluster>
          <DdSkeleton circle width="3rem" height="3rem" />
          <DdStack compact class="dd-skeleton-copy">
            <DdSkeleton width="34%" height="1rem" />
            <DdSkeleton width="56%" />
          </DdStack>
        </DdCluster>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Static block</h3>
      <div class="dd-skeleton-card">
        <DdSkeleton :animated="false" width="100%" height="5rem" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-skeleton-card {
  padding: 1.5rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-skeleton-copy {
  flex: 1;
}
</style>
