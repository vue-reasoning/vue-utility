import { watch, ref, isRef, readonly } from 'vue-demi'
import type { WatchOptions } from 'vue-demi'

import { isFunction } from '../../../common'
import type { Dependency, SubscribeSource } from '../../types'
import { isDependency } from '../../reactivity'

export type useMemoOptions = Omit<WatchOptions, 'immediate'>

/**
 * Unlike normal `useMemo`, if `deps` is not passed in, we will collect all dependencies touched in the `source`
 */
export function useMemo<T>(
  source: SubscribeSource<T>,
  deps?: Dependency | undefined | null,
  options?: useMemoOptions
) {
  const memoRef = ref()

  if (isDependency(deps)) {
    const stateRef = ref()
    // The reason we don't share getters is
    // that we want to follow Vue's internal handling of specific values
    // https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiWatch.ts#L212
    const getter = isFunction(source)
      ? source
      : isRef(source)
      ? () => source.value
      : () => source
    watch(deps, () => (stateRef.value = getter()), {
      immediate: true
    })
    watch(stateRef, () => (memoRef.value = stateRef.value), {
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
