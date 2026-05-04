<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Buttons</h2>
      <p>Variants, sizes and icon behavior based on button tokens.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Semantic</h3>
      <div class="dd-studio-preview-row">
        <DdButton>Default</DdButton>
        <DdButton primary>Primary</DdButton>
        <DdButton success>Success</DdButton>
        <DdButton warning>Warning</DdButton>
        <DdButton danger>Danger</DdButton>
        <DdButton info>Info</DdButton>
      </div>
      <div class="dd-studio-preview-row">
        <DdButton primary outline>Primary</DdButton>
        <DdButton success outline>Success</DdButton>
        <DdButton warning outline>Warning</DdButton>
        <DdButton danger outline>Danger</DdButton>
      </div>
      <div class="dd-studio-preview-row">
        <DdButton primary ghost>Primary</DdButton>
        <DdButton success ghost>Success</DdButton>
        <DdButton danger ghost>Danger</DdButton>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Sizes</h3>
      <div class="dd-studio-preview-row">
        <DdButton primary tiny>Tiny</DdButton>
        <DdButton primary small>Small</DdButton>
        <DdButton primary>Regular</DdButton>
        <DdButton primary large>Large</DdButton>
        <DdButton primary xlarge>X-Large</DdButton>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Icons</h3>
      <div class="dd-studio-preview-row">
        <DdButton primary icon="heroicons:star" />
        <DdButton primary icon="heroicons:star">With icon</DdButton>
        <DdButton primary disabled>Disabled</DdButton>
      </div>
    </div>
  </section>
</template>
