<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeEditor, TOKEN_GROUPS } from '#dd/composables/useThemeEditor'
import styles from '#dd/styles/Studio.module.css'

definePageMeta({ layout: false })

const { values, hasChanges, reset, downloadTokens } = useThemeEditor()

const activeTab = ref('base')
const activeGroup = computed(() => TOKEN_GROUPS.find((g) => g.id === activeTab.value) ?? TOKEN_GROUPS[0]!)

const isDownloading = ref(false)
async function handleDownload() {
  isDownloading.value = true
  await downloadTokens()
  setTimeout(() => (isDownloading.value = false), 1200)
}
</script>

<template>
  <div :class="styles['dde-root']">
    <!-- ── Header ───────────────────────────────────────────── -->
    <header :class="styles['dde-header']">
      <div :class="styles['dde-header-brand']">
        <span :class="styles['dde-header-logo']">◈</span>
        <span :class="styles['dde-header-title']">DareDash Studio</span>
        <span :class="styles['dde-header-badge']">Theme Editor</span>
      </div>
      <div :class="styles['dde-header-actions']">
        <button
          :class="[styles['dde-btn'], styles['dde-btn-ghost']]"
          :disabled="!hasChanges"
          type="button"
          @click="reset"
        >
          Reset
        </button>
        <button
          :class="[styles['dde-btn'], styles['dde-btn-primary']]"
          :disabled="!hasChanges || isDownloading"
          type="button"
          @click="handleDownload"
        >
          <span v-if="isDownloading">Exporting…</span>
          <span v-else>Export tokens.json</span>
        </button>
      </div>
    </header>

    <!-- ── Split pane ────────────────────────────────────────── -->
    <main :class="styles['dde-split']">
      <!-- Form panel -->
      <aside :class="[styles['dde-panel'], styles['dde-panel-form']]">
        <!-- Tabs -->
        <nav :class="styles['dde-tabs']" role="tablist" aria-label="Token groups">
          <button
            v-for="group in TOKEN_GROUPS"
            :key="group.id"
            role="tab"
            :class="[styles['dde-tab'], { [styles['dde-tab-active']]: activeTab === group.id }]"
            :aria-selected="activeTab === group.id"
            type="button"
            @click="activeTab = group.id"
          >
            {{ group.label }}
          </button>
        </nav>

        <!-- Fields -->
        <div :class="styles['dde-fields']" role="tabpanel">
          <div
            v-for="field in activeGroup.fields"
            :key="field.path"
            :class="styles['dde-field']"
          >
            <label :class="styles['dde-field-label']" :for="`field-${field.path}`">
              {{ field.label }}
              <code :class="styles['dde-field-path']">{{ field.path }}</code>
            </label>

            <!-- Color picker -->
            <div v-if="field.type === 'color'" :class="styles['dde-color-wrapper']">
              <input
                :id="`field-${field.path}`"
                v-model="values[field.path]"
                type="color"
                :class="styles['dde-color-swatch']"
              />
              <input
                v-model="values[field.path]"
                type="text"
                :class="styles['dde-color-text']"
                spellcheck="false"
              />
            </div>

            <!-- Select -->
            <select
              v-else-if="field.type === 'select'"
              :id="`field-${field.path}`"
              v-model="values[field.path]"
              :class="styles['dde-input']"
            >
              <option
                v-for="opt in field.options"
                :key="opt"
                :value="opt"
              >
                {{ opt }}
              </option>
            </select>

            <!-- Text -->
            <input
              v-else
              :id="`field-${field.path}`"
              v-model="values[field.path]"
              type="text"
              :class="styles['dde-input']"
              spellcheck="false"
            />

            <!-- Changed indicator -->
            <span
              v-if="values[field.path] !== field.defaultValue"
              :class="styles['dde-field-changed']"
              title="Modified"
            >●</span>
          </div>
        </div>
      </aside>

      <!-- Preview panel -->
      <section :class="[styles['dde-panel'], styles['dde-panel-preview']]">
        <div :class="styles['dde-preview-inner']">

          <!-- Buttons preview -->
          <div v-if="activeTab === 'base' || activeTab === 'button'" :class="styles['dde-preview-section']">
            <h2 :class="styles['dde-preview-heading']">Buttons</h2>

            <div :class="styles['dde-preview-row']">
              <DdButton primary>Primary</DdButton>
              <DdButton success>Success</DdButton>
              <DdButton warning>Warning</DdButton>
              <DdButton danger>Danger</DdButton>
              <DdButton info>Info</DdButton>
            </div>

            <div :class="styles['dde-preview-row']">
              <DdButton primary outline>Primary</DdButton>
              <DdButton success outline>Success</DdButton>
              <DdButton warning outline>Warning</DdButton>
              <DdButton danger outline>Danger</DdButton>
            </div>

            <div :class="styles['dde-preview-row']">
              <DdButton primary ghost>Primary</DdButton>
              <DdButton success ghost>Success</DdButton>
              <DdButton danger ghost>Danger</DdButton>
            </div>

            <div :class="styles['dde-preview-row']">
              <DdButton primary small>Small</DdButton>
              <DdButton primary>Regular</DdButton>
              <DdButton primary large>Large</DdButton>
            </div>

            <div :class="styles['dde-preview-row']">
              <DdButton primary icon="heroicons:star" />
              <DdButton primary icon="heroicons:star">With icon</DdButton>
              <DdButton primary disabled>Disabled</DdButton>
            </div>
          </div>

          <!-- Badges preview -->
          <div v-if="activeTab === 'base' || activeTab === 'badge'" :class="styles['dde-preview-section']">
            <h2 :class="styles['dde-preview-heading']">Badges</h2>

            <div :class="styles['dde-preview-row']">
              <DdBadge>Default</DdBadge>
              <DdBadge primary>Primary</DdBadge>
              <DdBadge success>Success</DdBadge>
              <DdBadge warning>Warning</DdBadge>
              <DdBadge danger>Danger</DdBadge>
              <DdBadge info>Info</DdBadge>
            </div>

            <div :class="styles['dde-preview-row']">
              <DdBadge primary icon="heroicons:star">With icon</DdBadge>
              <DdBadge success icon="heroicons:check-circle">Success</DdBadge>
              <DdBadge danger icon="heroicons:x-circle">Danger</DdBadge>
            </div>
          </div>

          <!-- Base section shows both -->
          <div v-if="activeTab === 'base'" :class="styles['dde-preview-note']">
            <p>Editing <strong>Base</strong> tokens affects both Buttons and Badges.</p>
          </div>

        </div>
      </section>
    </main>
  </div>
</template>
