import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

vi.mock('../../runtime/studio/registry', () => ({
  STUDIO_TABS: []
}))

import StudioPage from '../../runtime/pages/studio.vue'

describe('DareDash Studio page with empty tabs', () => {
  it('renders a fallback state instead of crashing during SSR', async () => {
    const wrapper = await mountSuspended(StudioPage)

    expect(wrapper.text()).toContain('DareDash Studio could not load its token tabs for this build.')
    expect(wrapper.text()).toContain('Studio preview unavailable.')
  })
})
