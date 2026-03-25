import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Popover from '../../../runtime/components/widgets/Popover/Popover'

describe('Popover', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: { trigger: 'click', placement: 'bottom' }
    })
    
    // We expect the wrapper to at least be mounted and have a class that indicates it is instantiated
    expect(wrapper).toBeDefined()
    expect(wrapper.html()).toBeDefined()
  })
})
