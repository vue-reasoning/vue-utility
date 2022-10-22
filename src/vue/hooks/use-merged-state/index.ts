import { computed } from 'vue-demi'
import type { WritableComputedRef } from 'vue-demi'

import { isWritableRef, resolveComputed, resolveRef } from '../../reactivity'
import type { ValueSource } from '../../types'

type NonUndef<T> = T extends undefined ? never : T

export type MergedState<T, U> = U extends undefined
  ? T | U | undefined
  : NonUndef<T | U>
export type MergedStateRef<T, U = undefined> = WritableComputedRef<
  MergedState<T, U>
>

export function useMergedState<T, U = undefined>(
  source: ValueSource<T>
): MergedStateRef<T, U>
export function useMergedState<T, U>(
  source: ValueSource<T>,
  defaultValue: ValueSource<U> | U
): MergedStateRef<T, U>
export function useMergedState<T, U>(
  source: ValueSource<T>,
  defaultValue?: ValueSource<U> | U
) {
  const isWritable = isWritableRef(source)
  const sourceRef = isWritable ? source : resolveRef(source)
  const defaultValueRef = resolveComputed(defaultValue)
  return computed({
    get: () => {
      const { value: source } = sourceRef
      return source === undefined ? defaultValueRef.value : source
    },
    set: (value) => {
      ;(sourceRef as any).value = value
    }
  })
}
