import { ref } from 'vue'
import type { Ref } from 'vue'

import type { MaybeRef } from '../../../types'
import { createToggleControl } from '../use-toggle'

export interface BooleanControl {
  set: (value: boolean) => void
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export function createBooleanControl(state: Ref<any>): BooleanControl {
  const control = createToggleControl(
    state,
    () => true,
    () => false
  )

  return {
    set: control.set,
    setTrue: control.setDefault,
    setFalse: control.setReverse,
    toggle: control.toggle
  }
}

export function useBoolean(
  initialValue?: MaybeRef<any>
): [Ref<boolean>, BooleanControl] {
  const stateRef = ref(initialValue)
  return [stateRef, createBooleanControl(stateRef)]
}
