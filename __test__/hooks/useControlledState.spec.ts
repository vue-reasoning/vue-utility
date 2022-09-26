import { nextTick, ref } from 'vue-demi'
import { useControlledState } from 'src'

describe('hooks > useControlledState', () => {
  it('uncontrolled', async () => {
    const props = ref()
    const [uncontrolled, mergedState] = useControlledState(props, 1)

    mergedState.value = 2
    await nextTick()
    expect(mergedState.value).toBe(2)
    expect(uncontrolled.value).toBe(2)
    expect(props.value).toBe(undefined)
  })

  it('controlled', async () => {
    const props = ref(0)
    const [uncontrolled, mergedState] = useControlledState(props, 1, (v) => {
      props.value = v
    })

    expect(mergedState.value).toBe(0)

    mergedState.value = 2
    await nextTick()
    expect(mergedState.value).toBe(2)
    expect(uncontrolled.value).toBe(2)
    expect(props.value).toBe(2)
  })
})
