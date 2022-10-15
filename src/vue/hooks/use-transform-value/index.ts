import { computed, unref } from 'vue-demi'
import type { ComputedRef, Ref } from 'vue-demi'

export function useTransformValue<T, U>(
  inputValue: Ref<T>,
  transform: (input: T) => U
): ComputedRef<U> {
  return computed(() => transform(unref(inputValue)))
}
