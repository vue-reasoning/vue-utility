import { Ref, watch, watchEffect, WatchOptionsBase } from 'vue-demi'
import type { WatchOptions, WatchStopHandle } from 'vue-demi'

import type {
  Dependency,
  MaybeRef,
  ResolveDependencySource,
  Subscribeable
} from '../../types'
import { useManualEffect } from '../use-manual-effect'
import { isDependency } from '../../reactivity'

export type EffectCallbackWithDependency<V = any, OV = any> = (
  onCleanup: (cleanupFn: () => void) => void,
  value: V,
  oldValue: OV
) => void | (() => void)

type SurmiseOldValue<T, Immediate> = Immediate extends true ? T | undefined : T

// Accepts a function that contains imperative, possibly effectful code.
// It's like a combination of `watch` and `watchEffect`,
// but it allows you to clean up effects in `watch` like `watchEffect`.

// scene 1: If no deps exists, or deps is a non-reactivity empty array,
// we will tracking its dependencies and re-runs it whenever the dependencies are changed.

// scene 2: If has deps, effect will only activate if the values in the deps list change

// overload: for an exact array of multiple sources
export function useEffect<
  T extends any[],
  Immediate extends Readonly<boolean> = false
>(
  effect: EffectCallbackWithDependency<
    ResolveDependencySource<T>,
    SurmiseOldValue<ResolveDependencySource<T>, Immediate>
  >,
  deps?: [...T],
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: no deps exists
export function useEffect<T extends undefined | null>(
  effect: EffectCallbackWithDependency<ResolveDependencySource<T>, T>,
  deps?: T,
  options?: WatchOptionsBase
): WatchStopHandle

// implementation
export function useEffect<
  T extends Dependency | undefined | null,
  Immediate extends Readonly<boolean> = false
>(
  effect: EffectCallbackWithDependency<
    ResolveDependencySource<T>,
    SurmiseOldValue<ResolveDependencySource<T>, Immediate>
  >,
  deps?: T,
  options?: WatchOptions<Immediate>
): WatchStopHandle {
  const effectControl = useManualEffect()

  if (isDependency(deps)) {
    return watch(
      deps,
      (value, oldValue) => {
        effectControl.reset(effect, value, oldValue)
      },
      options
    )
  }

  return watchEffect((onCleanup) => {
    effectControl.reset(effect, deps as T, deps)
    onCleanup(effectControl.clear)
  }, options)
}
