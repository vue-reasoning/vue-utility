import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

import type { ValueSource } from '../types'
import { resolveSourceValue } from './resolveSourceValue'

export function resolveRef<T>(source: ValueSource<T> | T): Ref<T> {
  return ref(resolveSourceValue(source)) as Ref<T>
}
