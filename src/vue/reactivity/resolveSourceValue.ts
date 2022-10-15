import { unref } from 'vue-demi'

import { isFunction } from '../../common'
import type { ValueSource } from '../types'

export function resolveSourceValue<T>(source: ValueSource<T> | T) {
  return isFunction(source) ? source() : (unref(source) as T)
}

export function resolveSourceValueGetter<T>(source: ValueSource<T> | T) {
  return isFunction(source) ? source : () => unref(source) as T
}
