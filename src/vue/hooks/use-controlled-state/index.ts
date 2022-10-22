import { computed, Ref } from 'vue-demi'
import type { WritableComputedRef } from 'vue-demi'

import type { MaybeRef, ValueSource } from '../../types'
import { useMemo } from '../use-memo'
import { useMergedState } from '../use-merged-state'
import type { MergedState, MergedStateRef } from '../use-merged-state'
import { useDerivedState } from '../use-derived-state'
import { isWritableRef } from '../../reactivity'

export function useControlledState<T, U = undefined>(
  controlled: ValueSource<T>
): [MergedStateRef<T, U>, Ref<MergedState<T, U>>]
export function useControlledState<T, U>(
  controlled: ValueSource<T>,
  uncontrolled: MaybeRef<U>
): [MergedStateRef<T, U>, Ref<U>]
export function useControlledState<T, U>(
  controlled: ValueSource<T>,
  uncontrolled?: MaybeRef<U>
) {
  const controlledStateRef = useMemo(controlled)
  const uncontrolledStateRef = useDerivedState(uncontrolled)

  const isWritable = isWritableRef(controlled)

  return [
    useMergedState(
      computed({
        get: () => controlledStateRef.value,
        set: (v) => {
          uncontrolledStateRef.value = v
          if (isWritable) {
            ;(controlled as WritableComputedRef<T>).value = v
          }
        }
      }),
      uncontrolledStateRef.value
    ),
    uncontrolledStateRef
  ] as const
}
