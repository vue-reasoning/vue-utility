import { computed } from 'vue-demi'

import type { ValueSource } from '../types'
import { resolveSourceValueGetter } from './resolveSourceValue'

export function resolveComputed<T>(source: ValueSource<T> | T) {
  return computed(resolveSourceValueGetter(source))
}
