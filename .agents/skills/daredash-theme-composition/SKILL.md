---
name: daredash-theme-composition
description: Operational guide for AI agents creating UI layouts, dashboards, settings pages, and theme flows in DareDash using the 4-tier surface hierarchy (canvas, subtle, surface, elevated) and semantic boolean attributes.
---

# DareDash Theme Composition & Surface Layering Guide

This skill provides step-by-step instructions and operational patterns for AI agents creating user interfaces, dashboards, forms, and custom themes with **DareDash**.

---

## 1. Core Visual Principles & Conventions

1. **Token-Driven Design:** Never hardcode colors, margins, radiuses, or padding in custom CSS. Rely on JSON design tokens and `v('token.path')`.
2. **Semantic Attributes First:** Use recognized boolean attributes (`subtle`, `elevated`, `canvas`, `primary`, `success`, `outline`, `ghost`, `small`, `large`) instead of inline styles or class overrides.
3. **4-Tier Surface Hierarchy:** Establish clear visual depth by layering backgrounds from level 0 (`canvas`) up to level 3 (`surface-elevated`).
4. **Dynamic Project Component Prefixing:**
   - The `dd-` prefix (e.g. `<dd-card>`, `<dd-stack>`, `DdButton`) is the **default** component prefix shipped by DareDash.
   - However, the prefix is **fully configurable** in `nuxt.config.ts` via `daredash.prefix` (e.g., `prefix: 'acme'` results in `<acme-card>`, `<acme-stack>`, `AcmeButton`).
   - AI agents **must check `nuxt.config.ts`** or the project configuration context before outputting hardcoded `<dd-*>` tags.
   - When resolving components dynamically in JS/TS, agents **must use `getPrefixName('Card', { type: 'component' })`** instead of string concatenation.

---

## 2. The 4-Tier Surface Elevation Matrix

| Level | Surface Token | Component / Attribute | RGB Light | RGB Dark | Primary Use Cases |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | `color.bg.canvas` | `<dd-layout canvas>` | `#f5f5f5` | `#0a0a0a` | Outer application shell, root page background wrapper |
| **1** | `color.bg.surface-subtle` | `<dd-sidebar subtle>`, `<dd-card subtle>` | `#fafafa` | `#171717` | Recessed navigation sidebars, secondary filter panels, nested cards |
| **2** | `color.bg.surface` | `<dd-card>` (default) | `#ffffff` | `#262626` | Standard content cards, form inputs, data tables, main containers |
| **3** | `color.bg.surface-elevated` | `<dd-card elevated>`, Overlays | `#ffffff` | `#404040` | Modals, Drawers, Popovers, Toasts, Dropdown Menus, Highlighted Cards |

---

## 3. Step-by-Step UI Construction Workflow

When asked to generate a page, flow, or dashboard using DareDash, follow this sequence:

### Step 1: Establish the Application Shell (`dd-layout` & `dd-sidebar`)
- Wrap the main application or view inside `<dd-layout canvas>` (Level 0 canvas background). `<dd-layout>` acts as the root structural container.
- For pages requiring navigation or side panels, use `<dd-sidebar subtle>` (Level 1 recessed surface). `<dd-sidebar>` provides side-by-side layout splitting for navigation menus, filter drawers, or master-detail views.
- Place main page content in `<dd-box tag="main">` or `<dd-stack tag="main">`.

### Step 2: Structure Layout Rhythm & Horizontal Grouping (`dd-stack`, `dd-cluster`, `dd-grid`)
- **Vertical Rhythm (`dd-stack`):** Use `<dd-stack>` for standard vertical section spacing. Standard `<dd-stack>` automatically provides the optimal vertical rhythm (`gap: var(--dd-space-md)`). **Do NOT add `spaced` by default**; reserve `<dd-stack spaced>` (or `<dd-stack wide>`) specifically for views requiring large section gaps.
- **Horizontal Grouping (`dd-cluster`):** Use `<dd-cluster>` for horizontal inline elements with flex wrapping (e.g., action button groups, status badge lists, metadata tags, filter bars, card header controls).
  - *Best scenarios:* Grouping buttons in card headers (`<dd-cluster between align-center>`), action bars, form button footers (`<dd-cluster end>`), badge chips.
  - *Attributes:* Use `start`, `center`, `end`, `between`, `around`, `evenly`, `nowrap`, `stretch`, `nogap` to control alignment and wrapping.
- **Multi-column Layouts (`dd-grid`):** Use `<dd-grid>` for responsive metric cards, dashboard summaries, or multi-column media catalogs.

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

Below is a complete, production-ready Nuxt page example demonstrating ideal surface layering and component composition:

```vue
<template>
  <!-- Level 0: Outer application layout and canvas background -->
  <dd-layout canvas>
    <!-- Level 1: Recessed navigation sidebar -->
    <dd-sidebar subtle>
      <dd-menu :items="menuItems" collapsible />
    </dd-sidebar>

    <!-- Main Content Area -->
    <dd-box tag="main">
      <!-- Standard vertical rhythm without unnecessary 'spaced' -->
      <dd-stack>
        <!-- Dashboard Metric Grid -->
        <dd-grid>
          <!-- Level 2: Standard surface card -->
          <dd-card>
            <template #header>Total Users</template>
            <!-- dd-cluster for inline metric + badge alignment -->
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

- [ ] Has the project prefix been checked (defaulting to `dd-` unless configured differently in `nuxt.config.ts`)?
- [ ] Does the root structural wrapper use `<dd-layout canvas>`?
- [ ] Are navigation or side panels styled with `<dd-sidebar subtle>`?
- [ ] Is vertical spacing handled by standard `<dd-stack>` (reserving `spaced` only for large section gaps)?
- [ ] Are horizontal button bars, badge tags, and card header actions aligned using `<dd-cluster>`?
- [ ] Are primary cards on standard surface level (`<dd-card>`), and overlays/highlighted cards on `elevated` (`<dd-card elevated>`)?
- [ ] Are semantic boolean attributes (`primary`, `success`, `warning`, `danger`, `ghost`, `outline`) used instead of made-up `variant="..."` or `color="..."` props?
