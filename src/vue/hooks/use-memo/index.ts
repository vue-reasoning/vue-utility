import { watch, ref, readonly } from 'vue-demi'
import type { WatchOptions } from 'vue-demi'

import type { Dependency, ValueSource } from '../../types'
import { isDependency, resolveSourceValueGetter } from '../../reactivity'

export type useMemoOptions = Omit<WatchOptions, 'immediate'>

/**
 * Unlike normal `useMemo`, if `deps` is not passed in, we will collect all dependencies touched in the `source`
 */
export function useMemo<T>(
  source: ValueSource<T>,
  deps?: Dependency | undefined | null,
  options?: useMemoOptions
) {
  const memoRef = ref()

  if (isDependency(deps)) {
    const getter = resolveSourceValueGetter(source)
    watch(deps, () => (memoRef.value = getter()), {
      ...options,
      immediate: true
    })
  } else {
    watch(source, (value) => (memoRef.value = value), {
      ...options,
      immediate: true
    })
  }

  return readonly(memoRef)
}
