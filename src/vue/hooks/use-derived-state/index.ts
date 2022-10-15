import { watch } from 'vue-demi'
import type { Ref } from 'vue-demi'

import type { ValueSource } from '../../types'
import { isDependency } from '../../reactivity'
import { useState } from '../use-state'

export function useDerivedState<T>(): Ref<T | undefined>
export function useDerivedState<T>(source: ValueSource<T> | T): Ref<T>
export function useDerivedState<T>(source?: ValueSource<T> | T) {
  const stateRef = useState(source)

  if (isDependency(source)) {
    watch(source as ValueSource<T>, (newState) => (stateRef.value = newState))
  }

  return stateRef
}
