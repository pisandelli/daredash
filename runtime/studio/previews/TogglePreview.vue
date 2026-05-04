<script setup lang="ts">
import { inject, reactive } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const toggleState = reactive({
  small: true,
  default: true,
  large: true,
  xlarge: true,
  idle: false,
  active: true,
  loading: true,
  disabled: false,
  primary: true,
  success: true,
  warning: true,
  danger: true,
  info: true,
  slot: true
})

function focusField(path: string) {
  previewContext?.focusField(path)
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Toggle</h2>
      <p>Switch control for binary settings, loading feedback and semantic active tracks.</p>
      <div class="dd-form-note">
        <strong>How to read this preview</strong>
        <span><b>Token-driven here:</b> default switch geometry, thumb styling, base track colors and disabled behavior.</span>
        <span><b>Token-driven per variant:</b> `primary`, `success`, `warning`, `danger` and `info` now have their own active-track tokens.</span>
        <span><b>Not tokenized yet:</b> checked/unchecked inner content and the loading icon come from slots/runtime behavior, not from theme tokens.</span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Sizes</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-small" small label="Small" v-model="toggleState.small" />
          <button type="button" class="dd-form-link" @click="focusField('switch.font-size')">Edit small scale</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-default" label="Default" v-model="toggleState.default" />
          <button type="button" class="dd-form-link" @click="focusField('switch.track.height')">Edit default geometry</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-large" large label="Large" v-model="toggleState.large" />
          <button type="button" class="dd-form-link" @click="focusField('switch.track.width')">Edit large width</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-xlarge" xlarge label="XLarge" v-model="toggleState.xlarge" />
          <button type="button" class="dd-form-link" @click="focusField('switch.thumb.size')">Edit thumb size</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Core behavior</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-idle" label="Email alerts" v-model="toggleState.idle" />
          <button type="button" class="dd-form-link" @click="focusField('switch.track.background-color')">Edit idle track</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-active" label="Realtime sync" v-model="toggleState.active" />
          <button type="button" class="dd-form-link" @click="focusField('switch.track.background-color-active')">Edit active track</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-loading" label="Saving..." v-model="toggleState.loading" loading />
          <button type="button" class="dd-form-link" @click="focusField('switch.transition')">Edit motion and loading context</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-disabled" label="Disabled" v-model="toggleState.disabled" disabled />
          <button type="button" class="dd-form-link" @click="focusField('switch.disabled.opacity')">Edit disabled state</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Semantic attrs</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-primary" label="Primary state" v-model="toggleState.primary" data-primary />
          <button type="button" class="dd-form-link" @click="focusField('switch.primary.track.background-color-active')">Edit primary active track</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-success" label="Success state" v-model="toggleState.success" data-success />
          <button type="button" class="dd-form-link" @click="focusField('switch.success.track.background-color-active')">Edit success active track</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-warning" label="Warning state" v-model="toggleState.warning" data-warning />
          <button type="button" class="dd-form-link" @click="focusField('switch.warning.track.background-color-active')">Edit warning active track</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-danger" label="Danger state" v-model="toggleState.danger" data-danger />
          <button type="button" class="dd-form-link" @click="focusField('switch.danger.track.background-color-active')">Edit danger active track</button>
        </div>
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-info" label="Info state" v-model="toggleState.info" data-info />
          <button type="button" class="dd-form-link" @click="focusField('switch.info.track.background-color-active')">Edit info active track</button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Slot content</h3>
      <div class="dd-form-grid">
        <div class="dd-form-card">
          <DdToggle id="studio-toggle-slot" label="With inner labels" v-model="toggleState.slot">
            <template #checked>ON</template>
            <template #unchecked>OFF</template>
          </DdToggle>
          <button type="button" class="dd-form-link" @click="focusField('switch.font-size')">Content is runtime-driven, scale still follows the toggle size</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-form-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.15);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.96), rgba(224 242 254 / 0.9));
}

.dd-form-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-form-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-form-note b {
  color: #0f172a;
}

.dd-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.dd-form-card {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-form-link {
  justify-self: start;
  padding: 0;
  border: 0;
  background: transparent;
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
