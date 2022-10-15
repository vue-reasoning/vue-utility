import { isReactive, isRef, Ref } from 'vue-demi'
import { isArray, isFunction } from '../../common'
import type { Dependency } from '../types'

export function isReactivity(v: any): v is Ref<any> {
  return isRef(v) || isReactive(v)
}

export function isDependency<T = unknown>(dep: unknown): dep is Dependency<T> {
  return isReactivity(dep) || isFunction(dep) || (isArray(dep) && !!dep.length)
}
