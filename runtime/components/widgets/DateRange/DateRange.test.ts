import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DateRange from './DateRange.vue'

describe('DateRange', () => {
  it('uses initialDate as the displayed period and renders an arbitrary trigger slot', async () => {
    const wrapper = await mountSuspended(DateRange, {
      props: { initialDate: '2026-08-12' },
      slots: { default: '<button type="button">August 2026</button>' }
    })
    expect(wrapper.text()).toContain('August 2026')
    expect((wrapper.find('select[aria-label="Year"]').element as HTMLSelectElement).value).toBe('2026')
    expect(wrapper.findAll('select[aria-label="Year"] option')).toHaveLength(61)
    expect(wrapper.findAll('select[aria-label="Year"] option')[0]!.text()).toBe('1996')
    expect(wrapper.findAll('select[aria-label="Year"] option')[60]!.text()).toBe('2056')
  })

  it('configures the number of years shown on either side of the current year', async () => {
    const wrapper = await mountSuspended(DateRange, { props: { initialDate: '2026-08-12', yearRange: 2 } })
    const options = wrapper.findAll('select[aria-label="Year"] option')

    expect(options).toHaveLength(5)
    expect(options[0]!.text()).toBe('2024')
    expect(options[4]!.text()).toBe('2028')
  })

  it('clamps a negative yearRange to the displayed year', async () => {
    const wrapper = await mountSuspended(DateRange, { props: { initialDate: '2026-08-12', yearRange: -3 } })
    const options = wrapper.findAll('select[aria-label="Year"] option')

    expect(options).toHaveLength(1)
    expect(options[0]!.text()).toBe('2026')
  })

  it('emits only a completed range when confirmed', async () => {
    const wrapper = await mountSuspended(DateRange, { props: { initialDate: '2026-08-01' } })
    const days = wrapper.findAll('button').filter(button => /^\d+$/.test(button.text()))
    await days[7]!.trigger('click')
    await days[12]!.trigger('click')
    await wrapper.findAll('button').find(button => button.text() === 'Confirm')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual({ start: '2026-08-02', end: '2026-08-07' })
  })

  it('marks the selected endpoints and the dates between them for the range trail', async () => {
    const wrapper = await mountSuspended(DateRange, { props: { initialDate: '2026-08-01' } })
    const days = wrapper.findAll('button').filter(button => /^\d+$/.test(button.text()))
    await days[7]!.trigger('click')
    await days[12]!.trigger('click')

    expect(wrapper.findAll('[data-start]').length).toBe(1)
    expect(wrapper.findAll('[data-end]').length).toBe(1)
    expect(wrapper.findAll('[data-between]').length).toBe(4)
    expect(wrapper.text()).toContain('02 Aug 2026 – 07 Aug 2026')
    expect(wrapper.text()).not.toContain('Select a start and end date')
  })

  it('shows a single selected date instead of the selection instruction', async () => {
    const wrapper = await mountSuspended(DateRange, { props: { initialDate: '2026-08-01' } })
    const days = wrapper.findAll('button').filter(button => /^\d+$/.test(button.text()))
    await days[7]!.trigger('click')

    expect(wrapper.text()).toContain('02 Aug 2026')
    expect(wrapper.text()).not.toContain('Select a start and end date')
  })

  it('renders a duplicated endpoint in the adjacent month as trail, not a second endpoint', async () => {
    const wrapper = await mountSuspended(DateRange, {
      props: { initialDate: '2026-08-01', modelValue: { start: '2026-08-01', end: '2026-08-31' } }
    })
    const augustEnd = wrapper.findAll('button').find(button => button.text() === '31' && button.attributes('data-end') !== undefined)
    const repeatedEnd = wrapper.findAll('button').find(button => button.text() === '31' && button.attributes('data-between') !== undefined)

    expect(augustEnd).toBeTruthy()
    expect(repeatedEnd).toBeTruthy()
    expect(wrapper.findAll('[data-end]').length).toBe(1)
  })

  it('uses the requested locale for labels and removes weekday punctuation', async () => {
    const wrapper = await mountSuspended(DateRange, { props: { initialDate: '2026-08-01', locale: 'pt-BR' } })
    expect(wrapper.text()).toContain('Períodos pré-definidos')
    expect(wrapper.text()).toContain('Próximos 90 dias')
    expect(wrapper.text()).toContain('agosto 2026')
    expect(wrapper.text()).not.toContain('agosto de 2026')
    expect(wrapper.findAll('div').find(element => element.text().includes('dom.seg.ter'))).toBeUndefined()
  })
})
