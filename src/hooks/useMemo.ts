import { watch, ref, isRef, readonly } from 'vue-demi'
import type { WatchSource, WatchOptions } from 'vue-demi'

import { isFunction } from '../common'
import type { Dependency } from './types'
import { isEffectiveDependency } from './types'

export type useMemoOptions = Omit<WatchOptions, 'immediate'>

export function useMemo<T>(
  source: WatchSource<T>,
  deps?: Dependency | undefined | null,
  options?: useMemoOptions
) {
  const memoRef = ref()

  if (isEffectiveDependency(deps)) {
    const getter = isFunction(source)
      ? source
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
    // https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiWatch.ts#L212
    watch(source, (newest) => (memoRef.value = newest), {
      ...options,
      immediate: true
    })
  }

  return readonly(memoRef)
}
