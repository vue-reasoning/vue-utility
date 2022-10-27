import { computed } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'

import type { ValueSource } from '../../types'
import { resolveSourceValueGetter } from '../../reactivity'

export function useTransformValue<T, U>(
  inputValue: ValueSource<T> | T,
  transform: (input: T) => U
): ComputedRef<U> {
  const getter = resolveSourceValueGetter(inputValue)
  return computed(() => transform(getter()))
}
