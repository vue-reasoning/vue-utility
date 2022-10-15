import { computed } from 'vue-demi'
import type { Ref, WritableComputedRef } from 'vue-demi'

import type { MaybeRef, ValueSource } from '../../types'
import { useMemo } from '../use-memo'
import { useMergedState } from '../use-merged-state'
import { useDerivedState } from '../use-derived-state'
import { isWritableRef } from 'src/vue/reactivity'

export function useControlledState<T>(
  controlled: ValueSource<T>
): [Ref<T>, Ref<T | undefined>]
export function useControlledState<T>(
  controlled: ValueSource<T>,
  uncontrolled: MaybeRef<T | undefined>
): [Ref<T>, Ref<T>]
export function useControlledState<T>(
  controlled: ValueSource<T>,
  uncontrolled?: MaybeRef<T | undefined>
) {
  const controlledStateRef = useMemo(controlled)
  const uncontrolledStateRef = useDerivedState(uncontrolled)

  const isWritable = isWritableRef(controlled)

  return [
    useMergedState(
      computed({
        get: () => controlledStateRef.value,
        set: (v) => {
          uncontrolledStateRef.value = v as T
          if (isWritable) {
            ;(controlled as WritableComputedRef<T>).value = v
          }
        }
      }),
      uncontrolledStateRef.value
    ),
    uncontrolledStateRef
  ]
}
