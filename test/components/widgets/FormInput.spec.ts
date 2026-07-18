import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormInput from '../../../runtime/components/widgets/Form/FormInput'
import FormSelect from '../../../runtime/components/widgets/Form/FormSelect'
import FormTextarea from '../../../runtime/components/widgets/Form/FormTextarea'

describe('FormInput Wrapper', () => {
  it('forwards base input attrs and syncs the model value', async () => {
    const wrapper = await mountSuspended(FormInput, {
      props: {
        name: 'email',
        modelValue: 'initial@example.com'
      },
      attrs: {
        label: 'Email',
        type: 'email',
        placeholder: 'Type your email'
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('email')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('placeholder')).toBe('Type your email')
    expect((input.element as HTMLInputElement).value).toBe('initial@example.com')

    await input.setValue('updated@example.com')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('renders FormInput label inside the shared field shell', async () => {
    const wrapper = await mountSuspended(FormInput, {
      props: {
        name: 'email'
      },
      attrs: {
        label: 'Email'
      }
    })

    const shell = wrapper.find('[data-field-shell]')

    expect(shell.exists()).toBe(true)
    expect(wrapper.findAll('label')).toHaveLength(1)
    expect(shell.find('label').text()).toContain('Email')
  })

  it('renders FormSelect label inside the shared field shell', async () => {
    const wrapper = await mountSuspended(FormSelect, {
      props: {
        name: 'status'
      },
      attrs: {
        label: 'Status',
        options: [{ label: 'Active', value: 'active' }]
      }
    })

    const shell = wrapper.find('[data-field-shell]')

    expect(shell.exists()).toBe(true)
    expect(wrapper.findAll('label')).toHaveLength(1)
    expect(shell.find('label').text()).toContain('Status')
  })

  it('renders FormTextarea label inside the shared field shell', async () => {
    const wrapper = await mountSuspended(FormTextarea, {
      props: {
        name: 'bio'
      },
      attrs: {
        label: 'Bio'
      }
    })

    const shell = wrapper.find('[data-field-shell]')

    expect(shell.exists()).toBe(true)
    expect(wrapper.findAll('label')).toHaveLength(1)
    expect(shell.find('label').text()).toContain('Bio')
  })
})
