<script setup lang="ts">
import { useAttrs, resolveComponent, computed, ref, useSlots, h, type HTMLAttributes } from 'vue'
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

type Row = Record<string, any>
type RowClassValue = HTMLAttributes['class']
type RowAttrsValue = Omit<HTMLAttributes, 'class'> & {
  class?: RowClassValue
}
type RowClassResolver = RowClassValue | ((row: Row, index: number) => RowClassValue)
type RowAttrsResolver = RowAttrsValue | ((row: Row, index: number) => RowAttrsValue | undefined)
type TableMessages = Partial<{
  empty: string
  loading: string
  updating: string
  error: string
}>
type TableStateIcons = Partial<{
  empty: string
  loading: string
  error: string
}>

interface Props {
  /**
   * Array defining the table headers and keys.
   */
  columns: TableColumn[]
  /**
   * Array of objects representing the rows.
   */
  data: Row[]
  /**
   * Determines the unique key for each row <tr> for Vue's virtual DOM optimization. Function or string property name.
   */
  rowKey?: string | ((row: Row) => string)
  /**
   * Static class value or resolver applied directly to each data row <tr>.
   */
  rowClass?: RowClassResolver
  /**
   * Static attrs object or resolver applied directly to each data row <tr>.
   */
  rowAttrs?: RowAttrsResolver
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
  /**
   * Custom copy for the built-in table states.
   */
  messages?: TableMessages
  /**
   * Custom icons for the built-in empty and error states.
   */
  icons?: TableStateIcons
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  data: () => [],
  rowKey: 'id',
  loading: false,
  isInvalid: false,
  errorMessage: undefined,
  messages: () => ({}),
  icons: () => ({})
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

const getRowKey = (row: Row): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return String(row[props.rowKey] || JSON.stringify(row))
}

const hasData = computed(() => props.data && props.data.length > 0)
const resolvedMessages = computed(() => ({
  empty: props.messages?.empty || 'No data available',
  loading: props.messages?.loading || 'Loading table...',
  updating: props.messages?.updating || 'Updating table...',
  error: props.messages?.error || 'An error occurred while fetching data.'
}))
const loadingLabel = computed(() =>
  hasData.value
    ? (props.messages?.updating || resolvedMessages.value.loading)
    : resolvedMessages.value.loading
)

const getSortValue = (row: Row, key: string) => row[key]

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
  row: Row
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
    h(Icon, {
      name: props.icons?.empty || globalIcons.emptyTable || 'lucide:inbox',
      size: '2rem'
    }),
    h('span', resolvedMessages.value.empty)
  ]
}

const ErrorContent = () => {
  return slots.error?.() ?? [
    h(Icon, {
      name: props.icons?.error || globalIcons.tableError || 'lucide:triangle-alert',
      size: '2rem'
    }),
    h('span', props.errorMessage || resolvedMessages.value.error)
  ]
}

function getRowClass(row: Row, index: number): RowClassValue {
  return typeof props.rowClass === 'function'
    ? props.rowClass(row, index)
    : props.rowClass
}

function getRowAttrs(row: Row, index: number): RowAttrsValue {
  return typeof props.rowAttrs === 'function'
    ? props.rowAttrs(row, index) || {}
    : props.rowAttrs || {}
}

function getDataRowAttrs(row: Row, index: number): RowAttrsValue {
  const rowAttrs = getRowAttrs(row, index)
  const { class: _rowAttrsClass, ...restAttrs } = rowAttrs

  return restAttrs
}

function getDataRowClass(row: Row, index: number): RowClassValue[] {
  return [
    styles.tr,
    getRowAttrs(row, index).class,
    getRowClass(row, index)
  ]
}

defineExpose({
  getSortedData,
  toggleSort,
  getAriaSort,
  getDataRowAttrs,
  getDataRowClass
})
</script>

<template>
  <div
    :class="[styles.wrapper, classList]"
    :data-loading-overlay="props.loading && hasData ? '' : undefined"
    :aria-busy="props.loading ? 'true' : 'false'"
    v-bind="processedAttrs"
  >
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
              <ErrorContent />
            </div>
          </td>
        </tr>

        <!-- Loading State (Exclusive without Data) -->
        <tr v-else-if="props.loading && !hasData" :class="[styles.tr, styles['loading-row']]">
          <td :class="styles.td" :colspan="columns.length">
            <div :class="styles['loading-state']">
              <slot v-if="slots.loading" name="loading" />
              <component
                :is="DdLoading"
                v-else
                :label="loadingLabel"
                :icon="props.icons?.loading"
              />
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
          <tr
            v-for="(row, rowIndex) in sortedData"
            :key="getRowKey(row)"
            :class="getDataRowClass(row, rowIndex)"
            v-bind="getDataRowAttrs(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="styles.td"
              :style="column.align ? { textAlign: column.align } : undefined"
            >
              <CellContent :row="row" :column="column" :index="rowIndex" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div
      v-if="props.loading && hasData"
      :class="styles['loading-overlay']"
      aria-live="polite"
    >
      <div :class="styles['loading-state']">
        <slot v-if="slots.loading" name="loading" />
        <component
          :is="DdLoading"
          v-else
          :label="loadingLabel"
          :icon="props.icons?.loading"
        />
      </div>
    </div>
  </div>
</template>
