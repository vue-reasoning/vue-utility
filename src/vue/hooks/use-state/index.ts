import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

import type { ValueSource } from '../../types'
import { resolveSourceValue } from 'src/vue/reactivity'

export function useState<T>(): Ref<T | undefined>
export function useState<T>(initialState: ValueSource<T> | T): Ref<T>
export function useState<T>(initialState?: ValueSource<T> | T) {
  return ref(resolveSourceValue(initialState))
}
