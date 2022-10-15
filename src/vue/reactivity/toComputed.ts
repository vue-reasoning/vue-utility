import { computed, unref } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'

import { isFunction } from '../../common'
import type { SubscribeSource } from '../types'

export function toComputed<T>(source: SubscribeSource<T>): ComputedRef<T> {
  return computed(isFunction(source) ? source : () => unref(source))
}
