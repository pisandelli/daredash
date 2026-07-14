<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Accordions</h2>
      <p>Disclosure rows, grouped behavior and accent inheritance.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Grouped (Default)</h3>
      <DdAccordionGroup>
        <DdAccordion
          title="Token-driven interaction"
          icon="lucide:sparkles"
        >
          Accordion styles are composed from border, header, content and motion tokens.
        </DdAccordion>
        <DdAccordion
          title="One open item by default"
          icon="lucide:layout-grid"
        >
          The group uses native details name behavior to keep one panel open at a time.
        </DdAccordion>
      </DdAccordionGroup>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Variants</h3>
      <div class="dd-studio-preview-stack">
        <DdAccordion
          title="Primary accent"
          primary
          icon="lucide:star"
          open
        >
          The standard primary semantic color.
        </DdAccordion>
        <DdAccordion
          title="Info accent"
          info
          icon="lucide:circle-alert"
        >
          Used to highlight neutral or educational information.
        </DdAccordion>
        <DdAccordion
          title="Success accent"
          success
          icon="lucide:circle-check"
        >
          Useful for checklist-like disclosure patterns.
        </DdAccordion>
        <DdAccordion
          title="Warning accent"
          warning
          icon="lucide:triangle-alert"
        >
          Helpful when the disclosed content changes the user's next step.
        </DdAccordion>
        <DdAccordion
          title="Danger accent"
          danger
          icon="lucide:shield-alert"
        >
          Used for destructive actions or critical privacy settings.
        </DdAccordion>
        <DdAccordion
          title="Custom accent"
          accent-color="#9333ea"
          icon="lucide:paintbrush"
        >
          An injected HEX color string bypassing the theme tokens.
        </DdAccordion>
      </div>
    </div>
  </section>
</template>
