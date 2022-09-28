import type { WatchSource } from 'vue-demi'

import { isArray, isDef, isFunction, isReactivity } from '../common'

export type Dependency<T = any> = WatchSource<T> | WatchSource<T>[]

export const isEffectiveDependency = <T = any>(v: any): v is Dependency<T> =>
  isDef(v) && (isReactivity(v) || isFunction(v) || (isArray(v) && v.length > 0))
