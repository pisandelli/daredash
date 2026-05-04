import { describe, it, expect } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormInput from '../../../runtime/components/widgets/Form/FormInput'
import Input from '../../../runtime/components/primitives/Form/Input'

describe('FormInput Wrapper', () => {
  it('forwards base input attrs and syncs the model value', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        components: {
          FormInput,
          DdInput: Input
        },
        setup() {
          const email = ref('initial@example.com')
          return { email }
        },
        template: `
          <FormInput
            v-model="email"
            name="email"
            label="Email"
            type="email"
            placeholder="Type your email"
          />
        `
      })
    )

    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('email')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('placeholder')).toBe('Type your email')
    expect((input.element as HTMLInputElement).value).toBe('initial@example.com')

    await input.setValue('updated@example.com')

    expect((wrapper.vm as unknown as { email: string }).email).toBe(
      'updated@example.com'
    )
  })
})
