import { isReactive, nextTick, ref, watch } from 'vue-demi'
import { useMemo } from 'src'

describe('hooks > useMemo', () => {
  it('should not trigger when dependency changes, but the computed value not change', async () => {
    const foo = ref()
    const memo = useMemo(() => {
      foo.value
      return 1
    })

    let count = 0
    watch(memo, () => count++)

    foo.value = 0
    await nextTick()
    expect(count).toBe(0)
  })

  it('should track deps', async () => {
    const foo = ref()
    const dep = ref()
    const memo = useMemo(foo, dep)

    let count = 0
    watch(memo, () => {
      count++
    })

    foo.value = 0
    await nextTick()
    expect(count).toBe(0)

    dep.value = 0
    await nextTick()
    expect(count).toBe(1)
  })
})
