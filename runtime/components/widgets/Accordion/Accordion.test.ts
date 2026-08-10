import { describe, expect, test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'

import AccordionGroup from './AccordionGroup'
import Accordion from './Accordion'

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

    const firstButton = buttons[0]
    const secondButton = buttons[1]

    // Initially both closed
    expect(firstButton!.attributes('aria-expanded')).toBe('false')
    expect(secondButton!.attributes('aria-expanded')).toBe('false')

    // Click first
    await firstButton!.trigger('click')
    expect(firstButton!.attributes('aria-expanded')).toBe('true')
    expect(secondButton!.attributes('aria-expanded')).toBe('false')

    // Click second - first should close
    await secondButton!.trigger('click')
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
    const firstButton = buttons[0]
    const secondButton = buttons[1]

    // Click first
    await firstButton!.trigger('click')
    expect(firstButton!.attributes('aria-expanded')).toBe('true')
    expect(secondButton!.attributes('aria-expanded')).toBe('false')

    // Click second - first should STAY open
    await secondButton!.trigger('click')
    expect(firstButton!.attributes('aria-expanded')).toBe('true')
    expect(secondButton!.attributes('aria-expanded')).toBe('true')
  })
})
