import { ref, Ref, unref } from 'vue-demi'

import type { MaybeRef } from '../../types'
import { isFunction } from '../../../common'

export function useState<T>(): Ref<T | undefined>
export function useState<T>(initialState: MaybeRef<T> | (() => T)): Ref<T>
export function useState<T>(initialState?: MaybeRef<T> | (() => T)) {
  return ref(isFunction(initialState) ? initialState() : unref(initialState))
}
