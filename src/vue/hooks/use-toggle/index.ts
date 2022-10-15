import { unref } from 'vue-demi'
import type { Ref } from 'vue-demi'

import { useState } from '../use-state'
import type { MaybeRef } from '../../types'
import { safeIdentity } from '../../../common'
import type { Fn, Getter, Setter } from '../../../common'

export interface ToggleControl<T> {
  set: Setter<T>
  setDefault: Fn
  setReverse: Fn
  toggle: Fn
}

export function createToggleControl<T, U>(
  state: Ref<T | U>,
  getDefaultValue: Getter<T>,
  getReverseValue: Getter<U>
): ToggleControl<T | U> {
  return {
    set: (value) => (state.value = value),
    setDefault: () => (state.value = getDefaultValue()),
    setReverse: () => (state.value = getReverseValue()),
    toggle: () => {
      const defaultValue = getDefaultValue()
      state.value =
        state.value === defaultValue ? getReverseValue() : defaultValue
    }
  }
}

export function useToggle(
  defaultValue?: MaybeRef<any>
): [Ref<boolean>, ToggleControl<boolean>]

export function useToggle<T, U>(
  defaultValue: MaybeRef<T>,
  reverseValue: MaybeRef<U>
): [Ref<T | U>, ToggleControl<T | U>]

export function useToggle<T, U>(
  defaultValue = false as unknown as MaybeRef<T>,
  reverseValue?: MaybeRef<U>
): [Ref<T | U>, ToggleControl<T | U>] {
  const asBoolean = arguments.length <= 1
  const transform = asBoolean ? Boolean : safeIdentity

  const getDefaultValue = () => transform(unref(defaultValue))
  const getReverseValue = () => transform(unref(reverseValue))

  const stateRef = useState(getDefaultValue)

  return [
    stateRef as Ref<T | U>,
    createToggleControl(stateRef, getDefaultValue, getReverseValue)
  ]
}
