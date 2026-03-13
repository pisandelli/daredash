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
    expect(wrapper.find('details').exists()).toBe(true)
    expect(wrapper.find('summary').exists()).toBe(true)
  })

  test('applies accentColor when provided directly', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        title: 'Title',
        accentColor: 'color.danger'
      }
    })

    // Inline style should contain the variable mapped via v()
    expect(wrapper.find('details').attributes('style')).toContain(
      '--local-accent'
    )
  })

  test('AccordionGroup passes mutual exclusivity name to children when multiple is false', async () => {
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

    const detailsElements = wrapper.findAll('details')
    expect(detailsElements.length).toBe(2)

    const name1 = detailsElements[0].attributes('name')
    const name2 = detailsElements[1].attributes('name')

    expect(name1).toBeDefined()
    expect(name1).toBe(name2) // Must share the exact same generated name
  })

  test('AccordionGroup does NOT pass a shared name when multiple is true', async () => {
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

    const detailsElements = wrapper.findAll('details')

    // Since multiple is true, no internal default name should be injected
    expect(detailsElements[0].attributes('name')).toBeUndefined()
    expect(detailsElements[1].attributes('name')).toBeUndefined()
  })
})
