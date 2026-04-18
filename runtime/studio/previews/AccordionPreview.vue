<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Accordions</h2>
      <p>Disclosure rows, grouped behavior and accent inheritance.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Grouped</h3>
      <DdAccordionGroup accent-color="color.primary.600">
        <DdAccordion
          title="Token-driven interaction"
          icon="heroicons:sparkles"
        >
          Accordion styles are composed from border, header, content and motion tokens.
        </DdAccordion>
        <DdAccordion
          title="One open item by default"
          icon="heroicons:squares-2x2"
        >
          The group uses native details name behavior to keep one panel open at a time.
        </DdAccordion>
        <DdAccordion
          title="Accent-aware states"
          icon="heroicons:paint-brush"
        >
          Hover and open states inherit the accent color while preserving local component tokens.
        </DdAccordion>
      </DdAccordionGroup>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Variants</h3>
      <div class="dd-studio-preview-stack">
        <DdAccordion
          title="Success accent"
          accent-color="color.success.600"
          icon="heroicons:check-circle"
          open
        >
          Useful for checklist-like disclosure patterns.
        </DdAccordion>
        <DdAccordion
          title="Warning accent"
          accent-color="color.warning.600"
          icon="heroicons:exclamation-triangle"
        >
          Helpful when the disclosed content changes the user's next step.
        </DdAccordion>
      </div>
    </div>
  </section>
</template>
