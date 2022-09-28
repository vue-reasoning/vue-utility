import { watch, watchEffect } from 'vue-demi'
import type { WatchOptionsBase, WatchOptions, WatchStopHandle } from 'vue-demi'

import type { Dependency } from './types'
import { isEffectiveDependency } from './types'
import { EffectCallback, useManualEffect } from './useManualEffect'

// Accepts a function that contains imperative, possibly effectful code.
// It's like a combination of `watch` and `watchEffect`,
// but it allows you to clean up effects in `watch` like `watchEffect`

// overload 1: no deps exists, or deps is a non-reactivity empty array
// the effect will be used as a `watchEffect`
// https://vuejs.org/api/reactivity-core.html#watcheffect
export function useEffect(
  effect: EffectCallback,
  deps?: undefined | null,
  options?: WatchOptionsBase
): WatchStopHandle

// overload 2: effect will only activate if the values in the deps list change
export function useEffect(
  effect: EffectCallback,
  deps: Dependency,
  options?: WatchOptions
): WatchStopHandle

// implementation
export function useEffect(
  effect: EffectCallback,
  deps?: Dependency | undefined | null,
  options?: WatchOptions
): WatchStopHandle {
  const effectControl = useManualEffect(effect)

  if (isEffectiveDependency(deps)) {
    return watch(deps, () => effectControl.reset(), options)
  }

  return watchEffect((onCleanup) => {
    effectControl.mesure()
    onCleanup(effectControl.clear)
  }, options)
}
