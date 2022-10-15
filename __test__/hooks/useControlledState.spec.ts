import { computed, nextTick, ref } from 'vue-demi'
import { useControlledState } from 'src'

describe('hooks > useControlledState', () => {
  it('uncontrolled', async () => {
    const [mergedState] = useControlledState<number | undefined>(
      computed(() => undefined),
      1
    )

    mergedState.value = 2
    await nextTick()
    expect(mergedState.value).toBe(1)
  })

  it('controlled', async () => {
    const props = ref()
    const [mergedState, uncontrolled] = useControlledState(props, 1)

    mergedState.value = 2
    await nextTick()
    expect(mergedState.value).toBe(2)
    expect(props.value).toBe(2)
    expect(uncontrolled.value).toBe(2)
  })
})
