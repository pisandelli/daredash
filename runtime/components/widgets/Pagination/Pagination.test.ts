import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Pagination from './Pagination.vue'

describe('Pagination Widget', () => {
  it('renders correct number of pages based on total and pageSize', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        total: 50,
        pageSize: 10,
        modelValue: 1
      }
    })

    // total: 50, pageSize: 10 => 5 pages. Plus Next and Prev buttons => 7 buttons total
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(7)

    // Check aria labels
    expect(buttons[0]!.attributes('aria-label')).toBe('Previous page')
    expect(buttons[6]!.attributes('aria-label')).toBe('Next page')
    expect(buttons[1]!.text()).toBe('1')
    expect(buttons[5]!.text()).toBe('5')
  })

  it('emits update:modelValue with the correct page number when a page is clicked', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        total: 50,
        pageSize: 10,
        modelValue: 1
      }
    })

    const buttons = wrapper.findAll('button')
    // Click page 3
    await buttons[3]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
  })

  it('emits update:modelValue with previous/next page when navigation buttons are clicked', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        total: 50,
        pageSize: 10,
        modelValue: 3
      }
    })

    const buttons = wrapper.findAll('button')
    const prevButton = buttons[0]!
    const nextButton = buttons[6]!

    await prevButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])

    await nextButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([4])
  })

  it('disables previous button on first page and next button on last page', async () => {
    // Test First Page
    const firstPageWrapper = await mountSuspended(Pagination, {
      props: { total: 50, pageSize: 10, modelValue: 1 }
    })

    let buttons = firstPageWrapper.findAll('button')
    // prev string disabled check
    expect(buttons[0]!.attributes('disabled')).toBeDefined()
    expect(buttons[6]!.attributes('disabled')).toBeUndefined()

    // Test Last Page
    const lastPageWrapper = await mountSuspended(Pagination, {
      props: { total: 50, pageSize: 10, modelValue: 5 }
    })

    buttons = lastPageWrapper.findAll('button')
    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
    expect(buttons[6]!.attributes('disabled')).toBeDefined()
  })

  it('renders data attributes using useBaseComponent for styling variants', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        total: 50,
        small: true,
        compact: true,
        simple: true,
        disabled: true
      }
    })

    // The component wrapper should have the data- variants injected
    expect(wrapper.attributes('data-small')).toBeDefined()
    expect(wrapper.attributes('data-compact')).toBeDefined()
    expect(wrapper.attributes('data-simple')).toBeDefined()

    // Disabled is mapped as a Vue prop and cascaded down to all buttons dynamically
    const buttons = wrapper.findAll('button')
    buttons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined()
    })
  })
})
