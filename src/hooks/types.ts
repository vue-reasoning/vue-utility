import { isReactive } from 'vue-demi'
import type { WatchSource } from 'vue-demi'

import { isArray, isDef, isFunction } from '../common'

export type Dependency<T = any> = WatchSource<T> | WatchSource<T>[]

export const isEffectiveDependency = <T = any>(
  v: unknown
): v is Dependency<T> =>
  isDef(v) && (isReactive(v) || isFunction(v) || (isArray(v) && v.length > 0))
