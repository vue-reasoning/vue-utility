import { computed } from 'vue-demi'
import type { WritableComputedRef } from 'vue-demi'

import {
  isWritableRef,
  resolveComputed,
  resolveSourceValueGetter
} from '../../reactivity'
import type { ValueSource } from '../../types'
import { noop } from '../../../common'

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
  const getSource = resolveSourceValueGetter(source)
  const getDefaultValue = resolveSourceValueGetter(defaultValue)
  return computed({
    get: () => {
      const source = getSource()
      return source === undefined ? getDefaultValue() : source
    },
    set: isWritable
      ? (value) => {
          ;(source as any).value = value
        }
      : noop
  })
}
