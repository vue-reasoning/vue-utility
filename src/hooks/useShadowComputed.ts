import {
  computed,
  ComputedRef,
  DebuggerOptions,
  WritableComputedRef
} from 'vue-demi'

import { isFunction } from '../common'

export type ShadowComputedGetter<T> = (shadow: T | null) => T
export type ShadowComputedSetter<T> = (v: T) => void

export interface WritableShadowComputedOptions<T> {
  get: ShadowComputedGetter<T>
  set: ShadowComputedSetter<T>
}

// It is almost the same as computed 
// but caches the last value and passes it to the getter function.
export function useShadowComputed<T>(
  getter: ShadowComputedGetter<T>,
  debugOptions?: DebuggerOptions
): ComputedRef<T>
export function useShadowComputed<T>(
  getter: (shadow: T | null) => T,
  debugOptions?: DebuggerOptions
): WritableComputedRef<T>
export function useShadowComputed<T>(
  getterOrOptions: ShadowComputedGetter<T> | WritableShadowComputedOptions<T>,
  debugOptions?: DebuggerOptions
) {
  let shadow: T | null = null

  const onlyGetter = isFunction(getterOrOptions)

  const getter = onlyGetter ? getterOrOptions : getterOrOptions.get
  const setter = onlyGetter ? null : getterOrOptions.set

  return computed(
    {
      get: () => {
        const main = getter(shadow)
        shadow = main
        return main
      },
      set: setter as any // allow error reporting
    },
    debugOptions
  )
}
