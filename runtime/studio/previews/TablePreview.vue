<script setup lang="ts">
import { inject } from 'vue'
import type { TableColumn } from '#dd/types/TableColumn'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const columns: TableColumn[] = [
  { key: 'name', title: 'Project' },
  { key: 'owner', title: 'Owner' },
  { key: 'status', title: 'Status', align: 'center' }
]

const rows = [
  { id: '1', name: 'Studio shell', owner: 'Design system', status: 'Ready', intent: 'success' },
  { id: '2', name: 'Toast polish', owner: 'UX', status: 'Review', intent: 'warning' },
  { id: '3', name: 'Widget coverage', owner: 'Docs', status: 'Queued', intent: 'info' }
]

function focusField(path: string) {
  previewContext?.focusField(path)
}

function badgeClass(intent: string) {
  return `dd-table-badge-${intent}`
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Table</h2>
      <p>Data grid surface covering header treatment, row states and empty/error messaging.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Default, even and odd stripes</h3>
      <div class="dd-table-stack">
        <div class="dd-table-shell">
          <div class="dd-table-shell-label">Default</div>
          <DdTable :columns="columns" :data="rows">
            <template #cell-status="{ row }">
              <button type="button" class="dd-table-badge" :class="badgeClass(row.intent)" @click="focusField('table.color')">
                {{ row.status }}
              </button>
            </template>
          </DdTable>
        </div>

        <div class="dd-table-shell">
          <div class="dd-table-shell-label">Even stripes</div>
          <DdTable striped :columns="columns" :data="rows">
            <template #cell-status="{ row }">
              <button type="button" class="dd-table-badge" :class="badgeClass(row.intent)" @click="focusField('table.row-striped.background-color')">
                {{ row.status }}
              </button>
            </template>
          </DdTable>
        </div>

        <div class="dd-table-shell">
          <div class="dd-table-shell-label">Odd stripes</div>
          <DdTable striped-odd :columns="columns" :data="rows">
            <template #cell-status="{ row }">
              <button type="button" class="dd-table-badge" :class="badgeClass(row.intent)" @click="focusField('table.row-striped.background-color')">
                {{ row.status }}
              </button>
            </template>
          </DdTable>
        </div>
      </div>
      <div class="dd-table-actions">
        <button type="button" class="dd-table-action" @click="focusField('table.color')">Body text</button>
        <button type="button" class="dd-table-action" @click="focusField('table.header.color')">Header text</button>
        <button type="button" class="dd-table-action" @click="focusField('table.header.background-color')">Header background</button>
        <button type="button" class="dd-table-action" @click="focusField('table.cell.padding')">Cell padding</button>
        <button type="button" class="dd-table-action" @click="focusField('table.row-striped.background-color')">Striped row</button>
        <button type="button" class="dd-table-action" @click="focusField('table.row-hover.background-color')">Hover row</button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Feedback states</h3>
      <div class="dd-table-stack">
        <DdTable :columns="columns" :data="[]" />
        <DdTable :columns="columns" :data="[]" is-invalid error-message="Failed to load records for this workspace." />
      </div>
    </div>
  </section>
</template>

<style scoped>
.dd-table-stack {
  display: grid;
  gap: 1rem;
}

.dd-table-shell {
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-table-shell-label {
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.9rem;
}

.dd-table-action {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 999px;
  background: rgba(248 250 252 / 0.96);
  padding: 0.45rem 0.8rem;
  color: #0f766e;
}

.dd-table-badge {
  border: 0;
  border-radius: 999px;
  padding: 0.28rem 0.7rem;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.dd-table-badge-success {
  background: rgba(34 197 94 / 0.12);
  color: #15803d;
}

.dd-table-badge-warning {
  background: rgba(245 158 11 / 0.12);
  color: #b45309;
}

.dd-table-badge-info {
  background: rgba(59 130 246 / 0.12);
  color: #1d4ed8;
}
</style>
