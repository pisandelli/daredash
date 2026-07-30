<script setup lang="ts">
import { useAttrs, resolveComponent, computed, ref, useSlots, h } from 'vue'
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
const slots = useSlots()
const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Table')

const appConfig = useAppConfig()
const globalIcons = (appConfig.daredash?.icons || {}) as Record<
  string,
  string | undefined
>

const DdLoading = resolveComponent(getPrefixName('Loading', { type: 'component' }))
type SortDirection = 'asc' | 'desc'

const sortKey = ref<string | undefined>(undefined)
const sortDirection = ref<SortDirection>('asc')

const getRowKey = (row: Record<string, any>): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return String(row[props.rowKey] || JSON.stringify(row))
}

const hasData = computed(() => props.data && props.data.length > 0)

const getSortValue = (row: Record<string, any>, key: string) => row[key]

const compareValues = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  const aDate = a instanceof Date ? a.getTime() : Date.parse(String(a))
  const bDate = b instanceof Date ? b.getTime() : Date.parse(String(b))

  if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
    return aDate - bDate
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base'
  })
}

const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  const directionMultiplier = sortDirection.value === 'asc' ? 1 : -1

  return [...props.data].sort((a, b) => {
    return compareValues(
      getSortValue(a, sortKey.value!),
      getSortValue(b, sortKey.value!)
    ) * directionMultiplier
  })
})

function getSortedData() {
  return sortedData.value
}

function toggleSort(column: TableColumn) {
  if (!column.sortable) return

  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortDirection.value = 'asc'
    return
  }

  if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
    return
  }

  sortKey.value = undefined
  sortDirection.value = 'asc'
}

function getAriaSort(column: TableColumn) {
  if (!column.sortable) return undefined
  if (sortKey.value !== column.key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

const HeaderContent = ({ column }: { column: TableColumn }) => {
  return slots[`header-${column.key}`]?.({ column }) ?? column.title
}

const CellContent = ({
  row,
  column,
  index
}: {
  row: Record<string, any>
  column: TableColumn
  index: number
}) => {
  return slots[`cell-${column.key}`]?.({
    row,
    column,
    index,
    value: row[column.key]
  }) ?? row[column.key]
}

const EmptyContent = () => {
  return slots.empty?.() ?? [
    h(Icon, { name: globalIcons.emptyTable || 'lucide:inbox', size: '2rem' }),
    h('span', 'No data available')
  ]
}

defineExpose({
  getSortedData,
  toggleSort,
  getAriaSort
})
</script>

<template>
  <div :class="[styles.wrapper, classList]" v-bind="processedAttrs">
    <table :class="styles.table">
      <thead>
        <tr :class="styles.tr">
          <th
            v-for="column in columns"
            :key="column.key"
            :class="styles.th"
            :aria-sort="column.sortable ? (sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none') : undefined"
            :style="{
              ...(column.align ? { textAlign: column.align } : {}),
              ...(column.width ? { width: column.width } : {})
            }"
            @click="column.sortable ? toggleSort(column) : undefined"
          >
            <button
              v-if="column.sortable"
              type="button"
              :class="styles.sortButton"
            >
              <span :class="styles.sortLabel">
                <HeaderContent :column="column" />
              </span>
              <span :class="styles.sortIndicator" aria-hidden="true">
                {{ sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
              </span>
            </button>
            <HeaderContent v-else :column="column" />
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Error State Hook -->
        <tr v-if="props.isInvalid" :class="[styles.tr, styles['error-row']]">
          <td :class="styles.td" :colspan="columns.length">
            <div :class="styles['empty-state']">
              <Icon :name="globalIcons.tableError || 'lucide:triangle-alert'" size="2rem" />
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
              <EmptyContent />
            </div>
          </td>
        </tr>

        <!-- Ideal State: Render rows -->
        <template v-else>
          <tr v-for="(row, rowIndex) in sortedData" :key="getRowKey(row)" :class="styles.tr">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="styles.td"
              :style="column.align ? { textAlign: column.align } : undefined"
            >
              <CellContent :row="row" :column="column" :index="rowIndex" />
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
