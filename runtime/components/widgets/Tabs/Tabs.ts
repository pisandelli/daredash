import { defineNuxtComponent } from 'nuxt/app'
import { h, provide, ref, computed, watch, type Ref } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Tabs.module.css'

export const TabsContextKey = Symbol('TabsContext')

export interface TabsContext {
  activeTab: Ref<string | number | undefined>
  vertical: Ref<boolean>
  manualActivation: Ref<boolean>
  indicatorType: Ref<'underline' | 'dot'>
  registerTab: (id: string | number) => void
  unregisterTab: (id: string | number) => void
  selectTab: (id: string | number | undefined) => void
  selectNextTab: (currentId: string | number) => void
  selectPrevTab: (currentId: string | number) => void
  selectFirstTab: () => void
  selectLastTab: () => void
  closeTab: (id: string | number) => void
}

export default defineNuxtComponent({
  name: 'DdTabs',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: undefined
    },
    vertical: {
      type: Boolean,
      default: false
    },
    manualActivation: {
      type: Boolean,
      default: false
    },
    indicator: {
      type: String as () => 'underline' | 'dot',
      default: 'underline'
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, attrs, emit }) {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Tabs')

    const internalActiveTab = ref(props.modelValue)
    const tabsList = ref<(string | number)[]>([])

    watch(() => props.modelValue, (newVal) => {
      internalActiveTab.value = newVal
    })

    const selectTab = (id: string | number | undefined) => {
      internalActiveTab.value = id
      emit('update:modelValue', id)
    }

    const registerTab = (id: string | number) => {
      if (!tabsList.value.includes(id)) {
        tabsList.value.push(id)
        if (internalActiveTab.value === undefined && tabsList.value.length === 1) {
          selectTab(id)
        }
      }
    }

    const unregisterTab = (id: string | number) => {
      const index = tabsList.value.indexOf(id)
      if (index !== -1) {
        tabsList.value.splice(index, 1)
      }
    }

    const selectNextTab = (currentId: string | number) => {
      const index = tabsList.value.indexOf(currentId)
      if (index !== -1 && index < tabsList.value.length - 1) {
        selectTab(tabsList.value[index + 1])
      } else if (tabsList.value.length > 0) {
        selectTab(tabsList.value[0])
      }
    }

    const selectPrevTab = (currentId: string | number) => {
      const index = tabsList.value.indexOf(currentId)
      if (index > 0) {
        selectTab(tabsList.value[index - 1])
      } else if (tabsList.value.length > 0) {
        selectTab(tabsList.value[tabsList.value.length - 1])
      }
    }

    const selectFirstTab = () => {
      if (tabsList.value.length > 0) selectTab(tabsList.value[0])
    }

    const selectLastTab = () => {
      if (tabsList.value.length > 0) selectTab(tabsList.value[tabsList.value.length - 1])
    }

    const closeTab = (id: string | number) => {
      emit('close', id)
      const index = tabsList.value.indexOf(id)
      if (internalActiveTab.value === id && index !== -1) {
        if (tabsList.value.length > 1) {
          if (index < tabsList.value.length - 1) {
            selectTab(tabsList.value[index + 1])
          } else {
            selectTab(tabsList.value[index - 1])
          }
        } else {
          selectTab(undefined)
        }
      }
    }

    provide(TabsContextKey, {
      activeTab: computed(() => internalActiveTab.value),
      vertical: computed(() => props.vertical),
      manualActivation: computed(() => props.manualActivation),
      indicatorType: computed(() => props.indicator),
      registerTab,
      unregisterTab,
      selectTab,
      selectNextTab,
      selectPrevTab,
      selectFirstTab,
      selectLastTab,
      closeTab
    } as TabsContext)

    return () => {
      return h(
        'div',
        {
          ...processedAttrs.value,
          class: [classList.value],
          'data-vertical': props.vertical ? '' : undefined
        },
        slots.default?.()
      )
    }
  }
})
