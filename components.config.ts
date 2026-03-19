export interface ComponentConfig {
  /**
   * Path to the CSS module file.
   * If provided, the component will be generated using the baseComponent factory.
   */
  style?: string
  /**
   * Path to the component file (.vue or .ts).
   * If provided, this file will be registered directly.
   * Use this for complex components that don't fit the baseComponent pattern.
   */
  filePath?: string
  /**
   * Optional name for the component.
   * If not provided, the key in the configuration object will be used.
   */
  name?: string
}

export const components: Record<string, ComponentConfig> = {
  // Layout Components (Simple - Factory)
  Box: { style: './runtime/assets/styles/components/Box.module.css' },
  Center: { style: './runtime/assets/styles/components/Center.module.css' },
  Cluster: { style: './runtime/assets/styles/components/Cluster.module.css' },
  Grid: { style: './runtime/assets/styles/components/Grid.module.css' },
  Layout: { style: './runtime/assets/styles/components/Layout.module.css' },
  Stack: { style: './runtime/assets/styles/components/Stack.module.css' },
  Sidebar: { style: './runtime/assets/styles/components/Sidebar.module.css' },

  // Primitives (Simple - Factory)
  Card: {
    filePath: './runtime/components/primitives/Card/Card.ts',
    style: './runtime/assets/styles/components/Card.module.css'
  },
  // Badge: { style: './runtime/assets/styles/components/Badge.module.css' },

  Badge: {
    filePath: './runtime/components/primitives/Badge/Badge.ts',
    style: './runtime/assets/styles/components/Badge.module.css'
  },

  // Primitives (Complex - Custom File)
  Alert: {
    filePath: './runtime/components/primitives/Alert/Alert.vue',
    style: './runtime/assets/styles/components/Alert.module.css'
  },
  Button: {
    filePath: './runtime/components/primitives/Button/Button.ts',
    style: './runtime/assets/styles/components/Button.module.css'
  },
  Input: {
    filePath: './runtime/components/primitives/Form/Input.ts',
    style: './runtime/assets/styles/components/Input.module.css'
  },
  Textarea: {
    filePath: './runtime/components/primitives/Form/Textarea.ts',
    style: './runtime/assets/styles/components/Textarea.module.css'
  },
  Select: {
    filePath: './runtime/components/primitives/Form/Select.ts',
    style: './runtime/assets/styles/components/Select.module.css'
  },
  Checkbox: {
    filePath: './runtime/components/primitives/Form/Checkbox.ts',
    style: './runtime/assets/styles/components/Checkbox.module.css'
  },
  Radio: {
    filePath: './runtime/components/primitives/Form/Radio.ts',
    style: './runtime/assets/styles/components/Radio.module.css'
  },
  Toggle: {
    filePath: './runtime/components/primitives/Form/Toggle.ts',
    style: './runtime/assets/styles/components/Toggle.module.css'
  },
  InputSearch: {
    filePath: './runtime/components/primitives/Form/InputSearch.ts',
    style: './runtime/assets/styles/components/InputSearch.module.css'
  },
  InputGroup: {
    filePath: './runtime/components/primitives/Form/InputGroup.ts',
    style: './runtime/assets/styles/components/InputGroup.module.css'
  },
  FormLabel: {
    filePath: './runtime/components/primitives/Form/FormLabel.ts',
    style: './runtime/assets/styles/components/FormLabel.module.css'
  },

  // Form Wrappers (vee-validate integration)
  FormInput: {
    filePath: './runtime/components/widgets/Form/FormInput.ts'
    // Uses Input styles via composition
  },
  FormTextarea: {
    filePath: './runtime/components/widgets/Form/FormTextarea.ts'
  },
  FormSelect: {
    filePath: './runtime/components/widgets/Form/FormSelect.ts'
  },
  FormCheckbox: {
    filePath: './runtime/components/widgets/Form/FormCheckbox.ts'
  },
  FormRadio: {
    filePath: './runtime/components/widgets/Form/FormRadio.ts'
  },
  FormToggle: {
    filePath: './runtime/components/widgets/Form/FormToggle.ts'
  },
  Loading: {
    filePath: './runtime/components/primitives/Loading/Loading.ts',
    style: './runtime/assets/styles/components/Loading.module.css'
  },
  Toaster: {
    filePath: './runtime/components/primitives/Toaster/Toaster.ts',
    style: './runtime/assets/styles/components/Toaster.module.css'
  },
  Toast: {
    filePath: './runtime/components/primitives/Toaster/Toast.ts',
    style: './runtime/assets/styles/components/Toast.module.css'
  },
  VideoPlayer: {
    filePath: './runtime/components/primitives/VideoPlayer/VideoPlayer.vue',
    style: './runtime/assets/styles/components/VideoPlayer.module.css'
  },
  Accordion: {
    filePath: './runtime/components/widgets/Accordion/Accordion.ts',
    style: './runtime/assets/styles/components/Accordion.module.css'
  },
  AccordionGroup: {
    filePath: './runtime/components/widgets/Accordion/AccordionGroup.ts',
    style: './runtime/assets/styles/components/AccordionGroup.module.css'
  },
  Modal: {
    filePath: './runtime/components/widgets/Modal/Modal.ts',
    style: './runtime/assets/styles/components/Modal.module.css'
  },
  Drawer: {
    filePath: './runtime/components/widgets/Drawer/Drawer.ts',
    style: './runtime/assets/styles/components/Drawer.module.css'
  },
  Avatar: {
    filePath: './runtime/components/primitives/Avatar/Avatar.ts',
    style: './runtime/assets/styles/components/Avatar.module.css'
  },
  AvatarGroup: {
    filePath: './runtime/components/primitives/Avatar/AvatarGroup.ts',
    style: './runtime/assets/styles/components/Avatar.module.css'
  },
  Pagination: {
    filePath: './runtime/components/widgets/Pagination/Pagination.vue',
    style: './runtime/assets/styles/components/Pagination.module.css'
  },
  Table: {
    filePath: './runtime/components/widgets/Table/Table.vue',
    style: './runtime/assets/styles/components/Table.module.css'
  }
}
