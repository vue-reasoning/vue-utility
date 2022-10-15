import { ref, unref } from 'vue-demi'
import type { Ref } from 'vue-demi'

import { isFunction } from '../../common'
import type { ValueSource } from '../types'

export function resolveRef<T>(source: ValueSource<T> | T): Ref<T> {
  return ref(isFunction(source) ? source() : unref(source)) as Ref<T>
}
