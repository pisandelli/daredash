<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/DateRange.module.css'

export interface DateRangeValue { start: string; end: string }
export interface DateRangePreset { label: string; getRange: (today: Date) => DateRangeValue }

defineOptions({ name: 'DateRange', inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: DateRangeValue | null
  /** Calendar month to display when the panel opens. Accepts an ISO date. */
  initialDate?: string
  locale?: string
  weekStartsOn?: number
  /** Number of years available before and after the displayed year. */
  yearRange?: number
  presets?: DateRangePreset[] | false
  disabled?: boolean
}>(), { modelValue: null, initialDate: undefined, locale: undefined, weekStartsOn: undefined, yearRange: 30, presets: undefined, disabled: false })

const emit = defineEmits<{ 'update:modelValue': [value: DateRangeValue]; confirm: [value: DateRangeValue]; reset: [] }>()
const attrs = useAttrs()
const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'DateRange')
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLDivElement | null>(null)
const draft = ref<DateRangeValue | null>(props.modelValue ? { ...props.modelValue } : null)
const cursor = ref(startOfMonth(parseDate(props.initialDate) || new Date()))

const resolvedLocale = computed(() => props.locale || (import.meta.client ? navigator.language : 'en-US'))
const isPortuguese = computed(() => resolvedLocale.value.toLowerCase().startsWith('pt'))
const copy = computed(() => isPortuguese.value ? {
  presets: 'Períodos pré-definidos', last90: 'Últimos 90 dias', last30: 'Últimos 30 dias', last7: 'Últimos 7 dias', thisMonth: 'Este mês', lastMonth: 'Mês passado', thisYear: 'Este ano', next7: 'Próximos 7 dias', next30: 'Próximos 30 dias', next90: 'Próximos 90 dias', chooseEnd: 'Selecione a data final', chooseRange: 'Selecione uma data inicial e final', reset: 'Resetar', cancel: 'Cancelar', confirm: 'Confirmar'
} : {
  presets: 'Preset periods', last90: 'Last 90 days', last30: 'Last 30 days', last7: 'Last 7 days', thisMonth: 'This month', lastMonth: 'Last month', thisYear: 'This year', next7: 'Next 7 days', next30: 'Next 30 days', next90: 'Next 90 days', chooseEnd: 'Choose the end date', chooseRange: 'Select a start and end date', reset: 'Reset', cancel: 'Cancel', confirm: 'Confirm'
})
const defaultPresets = computed<DateRangePreset[]>(() => [
  { label: copy.value.last90, getRange: (today) => rangeDays(today, -89, 0) },
  { label: copy.value.last30, getRange: (today) => rangeDays(today, -29, 0) },
  { label: copy.value.last7, getRange: (today) => rangeDays(today, -6, 0) },
  { label: copy.value.thisMonth, getRange: (today) => ({ start: iso(startOfMonth(today)), end: iso(endOfMonth(today)) }) },
  { label: copy.value.lastMonth, getRange: (today) => { const d = addMonths(today, -1); return { start: iso(startOfMonth(d)), end: iso(endOfMonth(d)) } } },
  { label: copy.value.thisYear, getRange: (today) => ({ start: `${today.getFullYear()}-01-01`, end: `${today.getFullYear()}-12-31` }) },
  { label: copy.value.next7, getRange: (today) => rangeDays(today, 1, 7) },
  { label: copy.value.next30, getRange: (today) => rangeDays(today, 1, 30) },
  { label: copy.value.next90, getRange: (today) => rangeDays(today, 1, 90) }
])
const presetItems = computed(() => props.presets === false ? [] : props.presets || defaultPresets.value)
const months = computed(() => [cursor.value, addMonths(cursor.value, 1)])
const monthOptions = computed(() => Array.from({ length: 12 }, (_, month) => ({ value: month, label: new Intl.DateTimeFormat(resolvedLocale.value, { month: 'long' }).format(new Date(2026, month, 1)) })))
// Native select menus provide their own scroll affordance for this configurable range.
const normalizedYearRange = computed(() => Math.max(0, Math.floor(props.yearRange)))
const yearOptions = computed(() => Array.from(
  { length: normalizedYearRange.value * 2 + 1 },
  (_, index) => cursor.value.getFullYear() - normalizedYearRange.value + index
))
const selectedPreset = computed(() => presetItems.value.find(item => equalRange(item.getRange(today()), draft.value))?.label)

watch(() => props.modelValue, value => { if (!isOpen()) draft.value = value ? { ...value } : null }, { deep: true })

function parseDate(value?: string) { if (!value) return null; const date = new Date(`${value}T12:00:00`); return Number.isNaN(date.getTime()) ? null : date }
function iso(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
function today() { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), date.getDate()) }
function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1) }
function endOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0) }
function addMonths(date: Date, amount: number) { return new Date(date.getFullYear(), date.getMonth() + amount, 1) }
function rangeDays(date: Date, start: number, end: number) { const a = new Date(date); a.setDate(date.getDate() + start); const b = new Date(date); b.setDate(date.getDate() + end); return { start: iso(a), end: iso(b) } }
function equalRange(a: DateRangeValue, b: DateRangeValue | null) { return !!b && a.start === b.start && a.end === b.end }
function isOpen() { return !!panel.value?.matches(':popover-open') }
function daysFor(month: Date) {
  const weekStartsOn = props.weekStartsOn ?? localeWeekStart()
  const offset = (startOfMonth(month).getDay() - weekStartsOn + 7) % 7
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - offset)
  return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date })
}
function localeWeekStart() { const locale = new Intl.Locale(resolvedLocale.value) as Intl.Locale & { getWeekInfo?: () => { firstDay: number } }; return locale.getWeekInfo?.().firstDay === 7 ? 0 : (locale.getWeekInfo?.().firstDay ?? 7) }
function weekdayLabels() { const base = new Date(2023, 0, 1 + (props.weekStartsOn ?? localeWeekStart())); return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(resolvedLocale.value, { weekday: 'short' }).format(new Date(2023, 0, base.getDate() + index)).replace(/\./g, '')) }
function monthLabel(month: Date) {
  const monthName = new Intl.DateTimeFormat(resolvedLocale.value, { month: 'long' }).format(month)
  return `${monthName} ${month.getFullYear()}`
}
function formatSelectedDate(value: string) {
  const date = parseDate(value)
  if (!date) return value
  const month = new Intl.DateTimeFormat(resolvedLocale.value, { month: 'short' })
    .format(date)
    .replace(/\./g, '')
  return `${String(date.getDate()).padStart(2, '0')} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`
}
const selectionSummary = computed(() => {
  if (!draft.value?.start) return null
  if (!draft.value.end || draft.value.start === draft.value.end) return formatSelectedDate(draft.value.start)
  return `${formatSelectedDate(draft.value.start)} – ${formatSelectedDate(draft.value.end)}`
})
function position() { if (!trigger.value || !panel.value) return; const rect = trigger.value.getBoundingClientRect(); const width = panel.value.offsetWidth; panel.value.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - panel.value.offsetHeight - 16)}px`; panel.value.style.left = `${Math.max(16, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 16))}px` }
async function open() { if (props.disabled || !panel.value) return; draft.value = props.modelValue ? { ...props.modelValue } : null; cursor.value = startOfMonth(parseDate(props.initialDate) || parseDate(props.modelValue?.start) || new Date()); panel.value.showPopover(); await nextTick(); position(); window.addEventListener('resize', position) }
function close() { panel.value?.hidePopover(); window.removeEventListener('resize', position) }
function onToggle(event: Event) { if ((event as { newState?: string }).newState === 'closed') window.removeEventListener('resize', position) }
function pick(date: Date) { const value = iso(date); if (!draft.value || draft.value.end) { draft.value = { start: value, end: '' }; return } if (value < draft.value.start) draft.value = { start: value, end: draft.value.start }; else draft.value = { start: draft.value.start, end: value } }
function isStart(date: Date, month: Date) { return iso(date) === draft.value?.start && date.getMonth() === month.getMonth() }
function isEnd(date: Date, month: Date) { return iso(date) === draft.value?.end && date.getMonth() === month.getMonth() }
function isTrail(date: Date, month: Date) {
  const value = iso(date)
  const inRange = !!draft.value?.start && !!draft.value.end && value >= draft.value.start && value <= draft.value.end
  return inRange && !isStart(date, month) && !isEnd(date, month)
}
function confirm() { if (!draft.value?.start || !draft.value.end) return; const value = { ...draft.value }; emit('update:modelValue', value); emit('confirm', value); close() }
function reset() { draft.value = null; emit('reset') }
function choosePreset(preset: DateRangePreset) { draft.value = preset.getRange(today()) }
function updateMonth(event: Event) { cursor.value = new Date(cursor.value.getFullYear(), Number((event.target as HTMLSelectElement).value), 1) }
function updateYear(event: Event) { cursor.value = new Date(Number((event.target as HTMLSelectElement).value), cursor.value.getMonth(), 1) }
</script>

<template>
  <div :class="classList" v-bind="processedAttrs">
    <span ref="trigger" :class="styles.trigger" @click="open"><slot><button type="button" :disabled="disabled">Select date range</button></slot></span>
    <div ref="panel" popover="auto" :class="styles.panel" @toggle="onToggle">
      <div :class="styles.body">
        <aside v-if="presetItems.length" :class="styles.presets"><p :class="styles.presetsTitle">{{ copy.presets }}</p><div :class="styles.presetList"><button v-for="preset in presetItems" :key="preset.label" type="button" :class="styles.preset" :data-active="selectedPreset === preset.label || undefined" @click="choosePreset(preset)">{{ preset.label }}</button></div></aside>
        <section :class="styles.calendarArea" aria-label="Date range calendar">
          <div :class="styles.selectors"><select :value="cursor.getMonth()" :class="styles.select" aria-label="Month" @change="updateMonth"><option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option></select><select :value="cursor.getFullYear()" :class="styles.select" aria-label="Year" @change="updateYear"><option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option></select></div>
          <div :class="styles.calendarNav"><button type="button" :class="styles.navButton" aria-label="Previous month" @click="cursor = addMonths(cursor, -1)">‹</button><span></span><button type="button" :class="styles.navButton" aria-label="Next month" @click="cursor = addMonths(cursor, 1)">›</button></div>
          <div :class="styles.months"><section v-for="month in months" :key="month.toISOString()"><p :class="styles.monthTitle">{{ monthLabel(month) }}</p><div :class="styles.weekdays"><span v-for="day in weekdayLabels()" :key="day">{{ day }}</span></div><div :class="styles.days"><button v-for="day in daysFor(month)" :key="day.toISOString()" type="button" :class="styles.day" :data-outside="day.getMonth() !== month.getMonth() || undefined" :data-start="isStart(day, month) || undefined" :data-end="isEnd(day, month) || undefined" :data-between="isTrail(day, month) || undefined" :aria-label="day.toLocaleDateString(resolvedLocale)" @click="pick(day)">{{ day.getDate() }}</button></div></section></div>
          <p :class="styles.hint">{{ selectionSummary || copy.chooseRange }}</p>
        </section>
      </div>
      <footer :class="styles.footer"><button type="button" :class="styles.footerButton" @click="reset">{{ copy.reset }}</button><div :class="styles.actions"><button type="button" :class="styles.footerButton" @click="close">{{ copy.cancel }}</button><button type="button" :class="[styles.footerButton, styles.confirm]" :disabled="!draft?.start || !draft?.end" @click="confirm">{{ copy.confirm }}</button></div></footer>
    </div>
  </div>
</template>
