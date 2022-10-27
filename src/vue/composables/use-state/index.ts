import { ref, shallowRef } from 'vue-demi'
import type { Ref, ShallowRef } from 'vue-demi'

import type { ValueSource } from '../../types'
import { resolveSourceValue } from '../../reactivity'

export function useState<T>(): Ref<T | undefined>
export function useState<T>(
  initialState: ValueSource<T> | T,
  shallow?: false
): Ref<T>
export function useState<T>(
  initialState: ValueSource<T> | T,
  shallow: true
): ShallowRef<T>
export function useState<T>(
  initialState?: ValueSource<T> | T,
  shallow = false
) {
  const createRef = shallow ? shallowRef : ref
  return createRef(resolveSourceValue(initialState))
}
