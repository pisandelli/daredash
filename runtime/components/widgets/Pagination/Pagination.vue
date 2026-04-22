<script setup lang="ts">
import { computed, useAttrs, resolveComponent } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Pagination.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { Icon } from '#components'
import { useAppConfig } from '#imports'

defineOptions({
  name: 'Pagination',
  inheritAttrs: false,
})

/**
 * Props mapping to data flow.
 * UI states (small, simple, disabled, compact) are managed as boolean attributes handled by useBaseComponent.
 */
interface Props {
  /**
   * Disables the entire pagination component
   */
  disabled?: boolean
  /**
   * Total number of data items
   */
  total?: number
  /**
   * Current page number (v-model)
   */
  modelValue?: number
  /**
   * Number of data items per page
   */
  pageSize?: number
  /**
   * Number of pages to show before/after the current page
   */
  siblingCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  total: 0,
  modelValue: 1,
  pageSize: 10,
  siblingCount: 1,
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()

const attrs = useAttrs()

// Use the base component architecture for attribute processing
const { processedAttrs, classList } = useBaseComponent(
  attrs,
  styles,
  'Pagination'
)

const DdCluster = resolveComponent(
  getPrefixName('Cluster', { type: 'component' })
)

const appConfig = useAppConfig()
const globalIcons = appConfig.daredash?.icons || {}

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize) || 1
})

const currentPage = computed({
  get: () => props.modelValue,
  set: (val) => {
    let validPage = val
    if (val < 1) validPage = 1
    if (val > totalPages.value) validPage = totalPages.value

    if (validPage !== props.modelValue) {
      emit('update:modelValue', validPage)
    }
  },
})

const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value === totalPages.value)

const onPrev = () => {
  if (!isFirstPage.value) {
    currentPage.value -= 1
  }
}

const onNext = () => {
  if (!isLastPage.value) {
    currentPage.value += 1
  }
}

const onPage = (page: number) => {
  currentPage.value = page
}

// Logic to generate the pagination sequence (incorporating ellipses)
const DOTS = '...'
const paginationRange = computed(() => {
  const totalPageCount = totalPages.value
  const siblingCount = props.siblingCount

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const totalPageNumbers = siblingCount + 5

  // If the number of pages is less than the page numbers we want to show in our component
  if (totalPageNumbers >= totalPageCount) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage.value - siblingCount, 1)
  const rightSiblingIndex = Math.min(
    currentPage.value + siblingCount,
    totalPageCount
  )

  // We do not want to show dots if there is only one position left after/before the left/right page count 
  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

  const firstPageIndex = 1
  const lastPageIndex = totalPageCount

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, DOTS, totalPageCount]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPageCount - rightItemCount + 1 + i
    )
    return [firstPageIndex, DOTS, ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
  }

  return []
})
</script>

<template>
  <nav aria-label="pagination" :class="classList" v-bind="processedAttrs">
    <component :is="DdCluster" tag="ul" :class="styles.list">
      <!-- Previous Button -->
      <li :class="[styles.item, styles.prev]">
        <button type="button" :class="styles.button" :disabled="isFirstPage || props.disabled"
          aria-label="Previous page" @click="onPrev">
          <Icon :name="globalIcons.paginationPrev || 'heroicons:chevron-left'" :class="styles.icon" />
        </button>
      </li>

      <!-- Page Numbers / Ellipses -->
      <li v-for="(page, index) in paginationRange" :key="index" :class="[
        styles.item,
        styles.page,
        page === DOTS ? styles.dots : ''
      ]" :data-active="page === currentPage || undefined">
        <span v-if="page === DOTS" :class="styles.ellipsis">{{ DOTS }}</span>
        <button v-else type="button" :class="styles.button" :disabled="props.disabled" :aria-label="`Page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined" @click="onPage(page as number)">
          {{ page }}
        </button>
      </li>

      <!-- Next Button -->
      <li :class="[styles.item, styles.next]">
        <button type="button" :class="styles.button" :disabled="isLastPage || props.disabled" aria-label="Next page"
          @click="onNext">
          <Icon :name="globalIcons.paginationNext || 'heroicons:chevron-right'" :class="styles.icon" />
        </button>
      </li>
    </component>
  </nav>
</template>
