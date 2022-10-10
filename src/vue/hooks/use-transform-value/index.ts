import { computed, unref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export function useTransformValue<T, U>(
  inputValue: Ref<T>,
  transform: (input: T) => U
): ComputedRef<U> {
  return computed(() => transform(unref(inputValue)))
}
