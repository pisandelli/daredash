---
name: daredash-theme-composition
description: Operational guide for AI agents creating UI layouts, dashboards, settings pages, and theme flows in DareDash using the 4-tier surface hierarchy (canvas, subtle, surface, elevated) and semantic boolean attributes.
---

# DareDash Theme Composition & Surface Layering Guide

This skill provides step-by-step instructions and operational patterns for AI agents creating user interfaces, dashboards, forms, and custom themes with **DareDash**.

---

## 1. Core Visual Principles

1. **Token-Driven Design:** Never hardcode colors, margins, radiuses, or padding in custom CSS. Rely on JSON design tokens and `v('token.path')`.
2. **Semantic Attributes First:** Use recognized boolean attributes (`subtle`, `elevated`, `canvas`, `primary`, `success`, `outline`, `ghost`, `small`, `large`) instead of inline styles or class overrides.
3. **4-Tier Surface Hierarchy:** Establish clear visual depth by layering backgrounds from level 0 (`canvas`) up to level 3 (`surface-elevated`).

---

## 2. The 4-Tier Surface Elevation Matrix

| Level | Surface Token | Boolean Attribute | RGB Light | RGB Dark | Primary Use Cases |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | `color.bg.canvas` | `<DdLayout canvas>` | `#f5f5f5` | `#0a0a0a` | Outer app layout, page background wrapper |
| **1** | `color.bg.surface-subtle` | `<DdSidebar subtle>`, `<DdCard subtle>` | `#fafafa` | `#171717` | Recessed sidebars, secondary filter bars, nested panels |
| **2** | `color.bg.surface` | `<DdCard>` (default) | `#ffffff` | `#262626` | Standard content cards, form inputs, table containers |
| **3** | `color.bg.surface-elevated` | `<DdCard elevated>`, Overlays | `#ffffff` | `#404040` | Modals, Drawers, Popovers, Toasts, Dropdown Menus, Highlighted Cards |

---

## 3. Step-by-Step UI Construction Workflow

When asked to generate a page, flow, or dashboard using DareDash, follow this sequence:

### Step 1: Establish the Application Shell
- Wrap the view in `<dd-layout canvas>`.
- Add primary navigation via `<dd-sidebar subtle>`.
- Place main content in `<dd-box tag="main">` or `<dd-stack tag="main">`.

### Step 2: Structure Content Rhythm
- Use `<dd-stack spaced>` for vertical section rhythm.
- Use `<dd-grid>` for metric cards or multi-column summaries.
- Add `<dd-breadcrumb>` at the top of deep contextual pages.

### Step 3: Frame Cards & Content Surface Elevation
- Use standard `<dd-card>` for primary content sections (Level 2 surface).
- Use `<dd-card subtle>` for secondary or nested grouping sections (Level 1 subtle surface).
- Use `<dd-card elevated>` for callouts, active summaries, or focal points (Level 3 elevated surface).

### Step 4: Apply Semantic Attributes to Interactive Elements
- Buttons: `<dd-button primary>`, `<dd-button outline>`, `<dd-button ghost>`, `<dd-button danger>`.
- Badges: `<dd-badge success>`, `<dd-badge warning>`, `<dd-badge info>`.
- Alerts: `<dd-alert warning title="Title">Message</dd-alert>`.

---

## 4. Golden Page Template

Below is a complete, production-ready Nuxt page example demonstrating ideal surface layering and composition:

```vue
<template>
  <!-- Level 0: Outer canvas background -->
  <dd-layout canvas>
    <!-- Level 1: Recessed navigation sidebar -->
    <dd-sidebar subtle>
      <dd-menu :items="menuItems" collapsible />
    </dd-sidebar>

    <!-- Main Content Area -->
    <dd-box tag="main">
      <dd-stack spaced>
        <dd-breadcrumb :config="breadcrumbConfig" />

        <!-- Dashboard Grid -->
        <dd-grid>
          <!-- Level 2: Standard surface card -->
          <dd-card>
            <template #header>Total Users</template>
            <dd-cluster align-center between>
              <span class="text-2xl font-bold">12,450</span>
              <dd-badge success icon="heroicons:arrow-trending-up">+14%</dd-badge>
            </dd-cluster>
          </dd-card>

          <!-- Level 2: Standard surface card -->
          <dd-card>
            <template #header>Active Sessions</template>
            <dd-cluster align-center between>
              <span class="text-2xl font-bold">1,280</span>
              <dd-badge info>Live</dd-badge>
            </dd-cluster>
          </dd-card>

          <!-- Level 3: Elevated highlight card -->
          <dd-card elevated>
            <template #header>System Health</template>
            <dd-cluster align-center between>
              <span class="text-2xl font-bold">99.9%</span>
              <dd-badge success>Optimal</dd-badge>
            </dd-cluster>
          </dd-card>
        </dd-grid>

        <!-- Main Content Table Card -->
        <dd-card>
          <template #header>
            <dd-cluster between align-center>
              <h3>Recent Transactions</h3>
              <dd-button primary icon="heroicons:plus" @click="isModalOpen = true">
                Add Transaction
              </dd-button>
            </dd-cluster>
          </template>

          <dd-table :columns="tableColumns" :rows="tableRows" />
        </dd-card>
      </dd-stack>
    </dd-box>

    <!-- Level 3: Overlays automatically inherit surface-elevated -->
    <dd-modal v-model="isModalOpen" title="New Transaction">
      <dd-stack compact>
        <dd-form-input name="amount" label="Amount" placeholder="0.00" />
        <dd-form-select name="category" label="Category" :options="categoryOptions" />
      </dd-stack>
      <template #footer>
        <dd-cluster end>
          <dd-button ghost @click="isModalOpen = false">Cancel</dd-button>
          <dd-button primary @click="saveTransaction">Save</dd-button>
        </dd-cluster>
      </template>
    </dd-modal>
  </dd-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isModalOpen = ref(false)

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'heroicons:home', action: { type: 'link', to: '/' } },
  { key: 'analytics', label: 'Analytics', icon: 'heroicons:chart-bar', action: { type: 'link', to: '/analytics' } }
]

const breadcrumbConfig = {
  routes: [{ label: 'Home', to: '/' }, { label: 'Dashboard' }]
}

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'user', label: 'User' },
  { key: 'status', label: 'Status' }
]

const tableRows = [
  { id: '#1001', user: 'Alice Smith', status: 'Completed' },
  { id: '#1002', user: 'Bob Jones', status: 'Pending' }
]

const categoryOptions = [
  { value: 'sales', label: 'Sales' },
  { value: 'refund', label: 'Refund' }
]

function saveTransaction() {
  isModalOpen.value = false
}
</script>
```

---

## 5. Verification Checklist for AI Agents

Before delivering code generated with DareDash:

- [ ] Does the root wrapper use `<dd-layout canvas>`?
- [ ] Does the sidebar use `<dd-sidebar subtle>`?
- [ ] Are primary cards on standard surface level, and overlays/highlighted cards on `elevated`?
- [ ] Are semantic boolean attributes (`primary`, `success`, `warning`, `danger`, `ghost`, `outline`) used instead of made-up `variant="..."` or `color="..."` props?
- [ ] Are forms wrapped with standard `dd-stack` spacing?
- [ ] Are interactive actions wrapped in `dd-cluster` for clean alignment?
