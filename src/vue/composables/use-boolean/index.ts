import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

import { createToggleControl } from '../use-toggle'
import type { MaybeRef } from '../../types'
import { always, never } from '../../../common'

export interface BooleanControl {
  set: (value: boolean) => void
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export function createBooleanControl(state: Ref<any>): BooleanControl {
  const control = createToggleControl(state, always, never)
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
