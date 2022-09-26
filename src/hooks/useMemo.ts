import { watch, ref, isRef, readonly } from 'vue-demi'
import type { WatchSource, WatchOptions, ComputedGetter } from 'vue-demi'

import { isDef, isFunction } from '../common'

export type useMemoDependency = WatchSource | WatchSource[]
export type useMemoOptions = Omit<WatchOptions, 'immediate'>

export function useMemo<T>(
  source: WatchSource<T>,
  deps?: useMemoDependency,
  options?: useMemoOptions
) {
  const memoRef = ref()

  if (isDef(deps)) {
    const getter = isFunction(source)
      ? (source as ComputedGetter<any>)
      : isRef(source)
      ? () => source.value
      : () => source
    watch(deps, () => (memoRef.value = getter()), {
      ...options,
      immediate: true
    })
  } else {
    // The reason we don't share getters is
    // that we want to follow Vue's internal handling of specific values
    watch(source, (newest) => (memoRef.value = newest), {
      ...options,
      immediate: true
    })
  }

  return readonly(memoRef)
}
