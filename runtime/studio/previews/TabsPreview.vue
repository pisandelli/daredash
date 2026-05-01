<script setup lang="ts">
import { inject, ref } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)
const activeTab = ref('overview')
const activeVerticalTab = ref('tokens')

function focusField(path: string) {
  previewContext?.focusField(path)
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Tabs</h2>
      <p>Trigger list, active indicator and panel spacing across horizontal and vertical layouts.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Horizontal</h3>
      <div class="dd-tabs-shell">
        <DdTabs v-model="activeTab">
          <DdTabList>
            <DdTab value="overview">Overview</DdTab>
            <DdTab value="tokens">Tokens</DdTab>
            <DdTab value="history">History</DdTab>
          </DdTabList>
          <DdTabPanels>
            <DdTabPanel value="overview">Shared foundation controls for the active studio context.</DdTabPanel>
            <DdTabPanel value="tokens">Token mapping for the selected component.</DdTabPanel>
            <DdTabPanel value="history">Release notes and registry coverage checks.</DdTabPanel>
          </DdTabPanels>
        </DdTabs>
        <div class="dd-tabs-actions">
          <button type="button" class="dd-tabs-action" @click="focusField('tabs.list.border-color')">List border</button>
          <button type="button" class="dd-tabs-action" @click="focusField('tabs.trigger.padding')">Trigger padding</button>
          <button type="button" class="dd-tabs-action" @click="focusField('tabs.trigger.active.color')">Active color</button>
          <button type="button" class="dd-tabs-action" @click="focusField('tabs.trigger.indicator.color')">Indicator</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Vertical and sizes</h3>
      <div class="dd-tabs-shell">
        <DdTabs v-model="activeVerticalTab" vertical indicator="dot">
          <DdTabList>
            <DdTab value="tokens" small>Tokens</DdTab>
            <DdTab value="states">States</DdTab>
            <DdTab value="export" large>Export</DdTab>
          </DdTabList>
          <DdTabPanels>
            <DdTabPanel value="tokens">Use the panel padding token to control this content breathing room.</DdTabPanel>
            <DdTabPanel value="states">Hover and active styles stay on the trigger level.</DdTabPanel>
            <DdTabPanel value="export">Indicator type can change without changing the token contract.</DdTabPanel>
          </DdTabPanels>
        </DdTabs>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-tabs-shell {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-tabs-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.dd-tabs-action {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.96);
  padding: 0.45rem 0.8rem;
  color: #0f766e;
}
</style>
