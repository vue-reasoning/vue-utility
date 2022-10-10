import { unref } from 'vue'
import type { Ref } from 'vue'

import type { MaybeRef } from '../../../types'
import { useState } from '../use-state'

export interface ToggleControl<T> {
  set: (value: T) => void
  setDefault: () => void
  setReverse: () => void
  toggle: () => void
}

export function createToggleControl<T, U>(
  state: Ref<T | U>,
  getDefaultValue: () => T,
  getReverseValue: () => U
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
  initialValue?: MaybeRef<any>
): [Ref<boolean>, ToggleControl<boolean>]

export function useToggle<T, U>(
  defaultValue: MaybeRef<T>,
  reverseValue: MaybeRef<U>
): [Ref<T | U>, ToggleControl<T | U>]

export function useToggle<T, U>(
  defaultValue = false as unknown as MaybeRef<T>,
  reverseValue?: MaybeRef<U>
): [Ref<T | U>, ToggleControl<T | U>] {
  const isBoolean = arguments.length <= 1

  const getDefaultValue = () => {
    const value = unref(defaultValue)
    return isBoolean ? !!value : value
  }

  const getReverseValue = () => {
    const value = unref(reverseValue)
    return isBoolean ? !!value : (value as U)
  }

  const stateRef = useState<T | U | boolean>(getDefaultValue, true)

  return [
    stateRef as Ref<T | U>,
    createToggleControl(stateRef, getDefaultValue, getReverseValue)
  ]
}
