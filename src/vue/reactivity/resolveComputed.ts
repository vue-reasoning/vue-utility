import { computed, unref } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'

import { isFunction } from '../../common'
import type { ValueSource } from '../types'

export function resolveComputed<T>(source: ValueSource<T> | T): ComputedRef<T> {
  return computed(
    isFunction(source) ? source : () => unref(source)
  ) as ComputedRef<T>
}
