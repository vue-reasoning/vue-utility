import { ref, Ref } from 'vue-demi'

import { isFunction } from '../common'

export function useState<T>(): Ref<T>
export function useState<T>(
  initialState?: T,
  treatInitialAsFactory?: false
): Ref<T>
export function useState<T>(
  initialState: T | (() => T),
  treatInitialAsFactory: true
): Ref<T>
export function useState<T>(
  initialState?: unknown,
  treatInitialAsFactory = false
): Ref<T> {
  return ref(
    treatInitialAsFactory && isFunction(initialState)
      ? initialState()
      : initialState
  )
}
