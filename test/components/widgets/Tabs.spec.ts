import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import Tabs from '../../../runtime/components/widgets/Tabs/Tabs'
import TabList from '../../../runtime/components/widgets/Tabs/TabList'
import Tab from '../../../runtime/components/widgets/Tabs/Tab'
import TabPanels from '../../../runtime/components/widgets/Tabs/TabPanels'
import TabPanel from '../../../runtime/components/widgets/Tabs/TabPanel'

describe('Tabs Widget', () => {
  it('renders tabs and changes active panel on click', async () => {
    const Wrapper = {
      template: `
        <DdTabs v-model="activeTab">
          <DdTabList>
            <DdTab value="t1">Tab 1</DdTab>
            <DdTab value="t2">Tab 2</DdTab>
          </DdTabList>
          <DdTabPanels>
            <DdTabPanel value="t1">Content 1</DdTabPanel>
            <DdTabPanel value="t2">Content 2</DdTabPanel>
          </DdTabPanels>
        </DdTabs>
      `,
      components: {
        DdTabs: Tabs,
        DdTabList: TabList,
        DdTab: Tab,
        DdTabPanels: TabPanels,
        DdTabPanel: TabPanel
      },
      setup() {
        const activeTab = ref('t1')
        return { activeTab }
      }
    }

    const wrapper = await mountSuspended(Wrapper)

    // Check initial state
    expect(wrapper.text()).toContain('Tab 1')
    expect(wrapper.text()).toContain('Tab 2')
    expect(wrapper.text()).toContain('Content 1')
    
    // Panel 2 should not exist because TabPanel renders conditionally
    expect(wrapper.text()).not.toContain('Content 2')

    const tabs = wrapper.findAll('button[role="tab"]')
    expect(tabs.length).toBe(2)
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(tabs[1].attributes('aria-selected')).toBe('false')

    // Click second tab
    await tabs[1].trigger('click')

    // Check updated state
    expect(wrapper.text()).not.toContain('Content 1')
    expect(wrapper.text()).toContain('Content 2')
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
  })

  it('renders anchor element properly when "to" or "href" is provided via useBaseComponent', async () => {
    const Wrapper = {
      template: `
        <DdTabs v-model="activeTab">
          <DdTabList>
            <DdTab value="t1" to="/home">Home Tab</DdTab>
            <DdTab value="t2" href="https://example.com">Ext Tab</DdTab>
          </DdTabList>
        </DdTabs>
      `,
      components: {
        DdTabs: Tabs,
        DdTabList: TabList,
        DdTab: Tab
      },
      setup() {
        return { activeTab: ref('t1') }
      }
    }

    const wrapper = await mountSuspended(Wrapper)
    
    // Check if it renders properly (NuxtLink might be stubbed as a custom element or <a>)
    expect(wrapper.html()).toContain('/home')
    expect(wrapper.html()).toContain('https://example.com')
  })
})
