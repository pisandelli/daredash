import { describe, expect, test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { h, nextTick } from 'vue'

import AccordionGroup from './AccordionGroup'
import Accordion from './Accordion'

const waitForRender = async (wrapper?: any) => {
  await nextTick()
  await flushPromises()
  await nextTick()
}

const forceComponentUpdates = async (components: Array<any | undefined>) => {
  for (const component of components) {
    component?.vm?.$forceUpdate?.()
  }
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('AccordionGroup & Accordion', () => {
  test('renders Accordion item properly', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        title: 'Accordion Title'
      },
      slots: {
        default: () => 'Accordion Content'
      }
    })

    expect(wrapper.html()).toContain('Accordion Title')
    expect(wrapper.html()).toContain('Accordion Content')
    expect(wrapper.find('button[aria-expanded]').exists()).toBe(true)
    expect(wrapper.find('div[role="region"]').exists()).toBe(true)
  })

  test('applies accentColor when provided directly', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        title: 'Title',
        accentColor: 'color.danger'
      }
    })

    // Inline style should bind the public accordion accent token override.
    expect(wrapper.attributes('style')).toContain(
      '--dd-accordion-accent-color: color.danger;'
    )
  })

  test('toggles standalone accordion state on click', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        title: 'Toggle me'
      }
    })

    const button = wrapper.find('button[aria-expanded]')
    expect(button.attributes('aria-expanded')).toBe('false')

    await button.trigger('click')
    await waitForRender(wrapper)
    wrapper.vm?.$forceUpdate?.()
    await waitForRender(wrapper)

    expect(wrapper.find('button[aria-expanded]').attributes('aria-expanded')).toBe('true')
  })

  test('AccordionGroup mutually excludes items when multiple is false', async () => {
    const wrapper = await mountSuspended(AccordionGroup, {
      props: {
        multiple: false
      },
      slots: {
        default: () => [
          h(Accordion, { title: 'First' }),
          h(Accordion, { title: 'Second' })
        ]
      }
    })

    const buttons = wrapper.findAll('button[aria-expanded]')
    expect(buttons.length).toBe(2)

    let firstButton = buttons[0]
    let secondButton = buttons[1]

    // Initially both closed
    expect(firstButton!.attributes('aria-expanded')).toBe('false')
    expect(secondButton!.attributes('aria-expanded')).toBe('false')

    // Click first
    await firstButton!.trigger('click')
    let accordionItems = wrapper.findAllComponents(Accordion)
    await forceComponentUpdates(accordionItems)
    firstButton = wrapper.findAll('button[aria-expanded]')[0]
    secondButton = wrapper.findAll('button[aria-expanded]')[1]
    expect(firstButton!.attributes('aria-expanded')).toBe('true')
    expect(secondButton!.attributes('aria-expanded')).toBe('false')

    // Click second - first should close
    await secondButton!.trigger('click')
    accordionItems = wrapper.findAllComponents(Accordion)
    await forceComponentUpdates(accordionItems)
    firstButton = wrapper.findAll('button[aria-expanded]')[0]
    secondButton = wrapper.findAll('button[aria-expanded]')[1]
    expect(firstButton!.attributes('aria-expanded')).toBe('false')
    expect(secondButton!.attributes('aria-expanded')).toBe('true')
  })

  test('AccordionGroup allows multiple items to be open when multiple is true', async () => {
    const wrapper = await mountSuspended(AccordionGroup, {
      props: {
        multiple: true
      },
      slots: {
        default: () => [
          h(Accordion, { title: 'First' }),
          h(Accordion, { title: 'Second' })
        ]
      }
    })

    const buttons = wrapper.findAll('button[aria-expanded]')
    let firstButton = buttons[0]
    let secondButton = buttons[1]

    // Click first
    await firstButton!.trigger('click')
    let accordionItems = wrapper.findAllComponents(Accordion)
    await forceComponentUpdates(accordionItems)
    firstButton = wrapper.findAll('button[aria-expanded]')[0]
    secondButton = wrapper.findAll('button[aria-expanded]')[1]
    expect(firstButton!.attributes('aria-expanded')).toBe('true')
    expect(secondButton!.attributes('aria-expanded')).toBe('false')

    // Click second - first should STAY open
    await secondButton!.trigger('click')
    accordionItems = wrapper.findAllComponents(Accordion)
    await forceComponentUpdates(accordionItems)
    firstButton = wrapper.findAll('button[aria-expanded]')[0]
    secondButton = wrapper.findAll('button[aria-expanded]')[1]
    expect(firstButton!.attributes('aria-expanded')).toBe('true')
    expect(secondButton!.attributes('aria-expanded')).toBe('true')
  })

  test('preserves defaultOpen for grouped accordions', async () => {
    const wrapper = await mountSuspended(AccordionGroup, {
      slots: {
        default: () => [
          h(Accordion, { title: 'First', defaultOpen: true }),
          h(Accordion, { title: 'Second' })
        ]
      }
    })

    await waitForRender(wrapper)

    const buttons = wrapper.findAll('button[aria-expanded]')
    expect(buttons[0]?.attributes('aria-expanded')).toBe('true')
    expect(buttons[1]?.attributes('aria-expanded')).toBe('false')
  })
})
