import { ref, shallowRef } from 'vue-demi'
import type { Ref, ShallowRef } from 'vue-demi'

import type { ValueSource } from '../types'
import { resolveSourceValue } from './resolveSourceValue'

export function resolveRef<T>(
  source: ValueSource<T> | T,
  shallow?: false
): Ref<T>
export function resolveRef<T>(
  source: ValueSource<T> | T,
  shallow: true
): ShallowRef<T>
export function resolveRef<T>(source: ValueSource<T> | T, shallow = false) {
  const createRef = shallow ? shallowRef : ref
  return createRef(resolveSourceValue(source))
}
