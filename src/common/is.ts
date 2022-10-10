import { isArray, isFunction } from '@vue/shared'
import { isReactive, isRef, Ref } from 'vue-demi'

import type { Dependency } from '../types'

export {
  isArray,
  isDate,
  isFunction,
  isIntegerKey,
  isObject,
  isPlainObject,
  isPromise,
  isSet,
  isString,
  isSymbol
} from '@vue/shared'

export function isTrue(v: any): v is true {
  return v === true
}

export function isFlase(v: any): v is false {
  return v === false
}

export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null
}

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}

export function isReactivity(v: any): v is Ref<any> {
  return isRef(v) || isReactive(v)
}

export function isValidDependency<T = unknown>(
  dep: unknown
): dep is Dependency<T> {
  return (
    isRef(dep) ||
    isReactive(dep) ||
    isFunction(dep) ||
    (isArray(dep) && !!dep.length)
  )
}
