import { getCurrentInstance, isVue3 } from 'vue-demi'

import { proxyFunction } from '../../../common'
import { emitListener } from '../../options'
import type { AnyHandler } from '../../options'

/**
 * @param ignoreFormat Whether to ignore the event format.
 * If it is true, it will use the `caramelize` and `hyphenate` forms  to match.
 */
export function useEmitter<T extends AnyHandler = AnyHandler>(
  instance = getCurrentInstance(),
  ignoreFormat = true
): T | null {
  if (!instance) {
    return null
  }

  if (isVue3) {
    return proxyFunction(instance, 'emit') as T
  }

  return ((event, ...args) =>
    emitListener(instance, event, ignoreFormat, ...args)) as T
}
