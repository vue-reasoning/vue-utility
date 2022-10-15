import { computed } from 'vue-demi'
import type { Ref } from 'vue-demi'

import { isWritableRef, resolveComputed, resolveRef } from '../../reactivity'
import type { ValueSource } from '../../types'

export function useMergedState<T>(
  source: ValueSource<T>,
  defaultValue: ValueSource<T> | T
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
      ;(sourceRef as Ref<T>).value = value
    }
  })
}
