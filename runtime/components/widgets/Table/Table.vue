<script setup lang="ts">
import { useAttrs, resolveComponent, computed } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Table.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { Icon } from '#components'
import { useAppConfig } from '#imports'

defineOptions({
  name: 'Table',
  inheritAttrs: false,
})

import type { TableColumn } from '#dd/types/TableColumn'

interface Props {
  /**
   * Array defining the table headers and keys.
   */
  columns: TableColumn[]
  /**
   * Array of objects representing the rows.
   */
  data: Record<string, any>[]
  /**
   * Determines the unique key for each row <tr> for Vue's virtual DOM optimization. Function or string property name.
   */
  rowKey?: string | ((row: Record<string, any>) => string)
  /**
   * Shows a loading spinner and disables interaction.
   */
  loading?: boolean
  /**
   * Indicates whether the table fetch encountered an error.
   */
  isInvalid?: boolean
  /**
   * Error message to display when the table is invalid.
   */
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  data: () => [],
  rowKey: 'id',
  loading: false,
  isInvalid: false,
  errorMessage: undefined
})

const attrs = useAttrs()
const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Table')

const appConfig = useAppConfig() as any
const globalIcons = appConfig.daredash?.icons || {}

const DdLoading = resolveComponent(getPrefixName('Loading', { type: 'component' }))

const getRowKey = (row: Record<string, any>): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return String(row[props.rowKey] || JSON.stringify(row))
}

const hasData = computed(() => props.data && props.data.length > 0)
</script>

<template>
  <div :class="[styles.wrapper, classList]" v-bind="processedAttrs">
    <table :class="styles.table">
      <thead>
        <tr :class="styles.tr">
          <th v-for="column in columns" :key="column.key" :class="styles.th" :style="{
            textAlign: column.align || 'start',
            width: column.width
          }">
            <!-- Column Title -->
            <slot :name="`header-${column.key}`" :column="column">
              {{ column.title }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Error State Hook -->
        <tr v-if="props.isInvalid" :class="[styles.tr, styles['error-row']]">
          <td :class="styles.td" :colspan="columns.length">
            <div :class="styles['empty-state']">
              <Icon :name="globalIcons.tableError || 'heroicons:exclamation-triangle'" size="2rem" />
              <span>{{ props.errorMessage || 'An error occurred while fetching data.'
                }}</span>
            </div>
          </td>
        </tr>

        <!-- Loading State (Exclusive without Data) -->
        <tr v-else-if="props.loading && !hasData" :class="[styles.tr, styles['loading-row']]">
          <td :class="styles.td" :colspan="columns.length">
            <div :class="styles['loading-state']">
              <component :is="DdLoading" />
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!hasData" :class="[styles.tr, styles['empty-row']]">
          <td :class="styles.td" :colspan="columns.length">
            <div :class="styles['empty-state']">
              <!-- Empty Slot Override -->
              <slot name="empty">
                <Icon :name="globalIcons.emptyTable || 'heroicons:inbox'" size="2rem" />
                <span>No data available</span>
              </slot>
            </div>
          </td>
        </tr>

        <!-- Ideal State: Render rows -->
        <template v-else>
          <tr v-for="(row, rowIndex) in data" :key="getRowKey(row)" :class="styles.tr">
            <td v-for="column in columns" :key="column.key" :class="styles.td"
              :style="{ textAlign: column.align || 'start' }">
              <!-- Cell Scoped Slot -->
              <slot :name="`cell-${column.key}`" :row="row" :column="column" :index="rowIndex" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>

          <!-- Loading Overlay appended to end if data exists but it is updating -->
          <tr v-if="props.loading && hasData" :class="[styles.tr, styles['loading-row']]">
            <td :class="styles.td" :colspan="columns.length">
              <div :class="styles['loading-state']">
                <component :is="DdLoading" />
                <span class="sr-only">Updating table...</span>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
