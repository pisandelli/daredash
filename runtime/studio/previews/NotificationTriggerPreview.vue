<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Notification Trigger</h2>
      <p>Icon-only notification button with a detached count badge that does not change the button shape.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Counts</h3>
      <div class="dd-studio-preview-row">
        <DdNotificationTrigger ghost :count="0" />
        <DdNotificationTrigger ghost :count="3" />
        <DdNotificationTrigger ghost :count="120" />
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Button Variants</h3>
      <div class="dd-studio-preview-row">
        <DdNotificationTrigger primary :count="8" />
        <DdNotificationTrigger outline :count="12" />
        <DdNotificationTrigger ghost :count="2" />
      </div>
    </div>
  </section>
</template>
