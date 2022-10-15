import { computed, isRef, ref, watch } from 'vue-demi'
import type { Ref, ComputedRef, WatchSource } from 'vue-demi'

import type { MaybeRef } from '../../types'
import { useMemo } from '../use-memo'

export function useControlledState<T>(
  controlled: WatchSource<T>
): [Ref<T>, Ref<T | undefined>]
export function useControlledState<T>(
  controlled: WatchSource<T>,
  uncontrolled: MaybeRef<T>,
  setter?: (value: T) => void
): [Ref<T>, Ref<T>]
export function useControlledState<T>(
  controlled: WatchSource<T>,
  uncontrolled?: MaybeRef<T>,
  setter?: (value: T) => void
) {
  const controlledStateRef = useMemo(controlled)
  const uncontrolledStateRef = ref()

  if (isRef(uncontrolled)) {
    watch(
      uncontrolled,
      (uncontrolled) => (uncontrolledStateRef.value = uncontrolled),
      {
        immediate: true
      }
    )
  } else {
    uncontrolledStateRef.value = uncontrolled
  }

  const mergedStateRef = computed({
    get: () =>
      controlledStateRef.value === undefined
        ? uncontrolledStateRef.value
        : controlledStateRef.value,
    set: (v) => {
      uncontrolledStateRef.value = v as T
      setter?.(v as T)
    }
  }) as ComputedRef<T>

  return [mergedStateRef, uncontrolledStateRef]
}
