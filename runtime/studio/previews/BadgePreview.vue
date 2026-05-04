<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Badges</h2>
      <p>Typography, spacing and semantic variants.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Semantic</h3>
      <div class="dd-studio-preview-row">
        <DdBadge>Default</DdBadge>
        <DdBadge primary>Primary</DdBadge>
        <DdBadge success>Success</DdBadge>
        <DdBadge warning>Warning</DdBadge>
        <DdBadge danger>Danger</DdBadge>
        <DdBadge info>Info</DdBadge>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>With icon</h3>
      <div class="dd-studio-preview-row">
        <DdBadge primary icon="heroicons:star">Featured</DdBadge>
        <DdBadge success icon="heroicons:check-circle">Success</DdBadge>
        <DdBadge danger icon="heroicons:x-circle">Danger</DdBadge>
      </div>
    </div>
  </section>
</template>
