import { isFunction } from '@vue/shared'
import type { MaybeArray, ValueOf } from './types'

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
  isSymbol,
  hasChanged,
  hasOwn,
  def,
  toTypeString,
  toRawType
} from '@vue/shared'

export function noop() {}

export function always() {
  return true
}

export function never() {
  return false
}

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

export function invokeIfFunction<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T>
export function invokeIfFunction<
  T extends Exclude<any, (...args: any[]) => any>
>(fn: T, ...args: any[]): void
export function invokeIfFunction(fn: unknown, ...args: any[]) {
  if (isFunction(fn)) {
    return fn(...args)
  }
}

export type PropertyName = string | number | symbol

export function cacheKeyofFunction<T extends PropertyName, R = any>(
  fn: (key: T) => R,
  ignoreNullable = false
): (key: T) => R {
  const cache: Record<T, R> = Object.create(null)
  return (key: T) => {
    const hit = cache[key]
    if (ignoreNullable && key in cache) {
      return hit
    }
    return hit || (cache[key] = fn(key))
  }
}

export function pickBy<T extends object>(
  object: T,
  predicate: (value: ValueOf<T>, key: keyof T) => boolean
): Partial<T> {
  const picks: Partial<T> = {}
  for (const key in object) {
    if (predicate(object[key], key)) {
      picks[key] = object[key]
    }
  }
  return picks
}

export function pick<T extends object, U extends keyof T>(
  object: T,
  ...props: Array<MaybeArray<U>>
): Pick<T, U>
export function pick<T extends object>(
  object: T,
  ...props: Array<MaybeArray<PropertyName>>
): Partial<T>
export function pick<T extends object>(
  object: T,
  ...props: Array<MaybeArray<PropertyName>>
): Partial<T> {
  const paths = props.flat()
  const hasIn = cacheKeyofFunction((key: PropertyName) => {
    const index = paths.indexOf(key)
    if (index !== -1) {
      paths.splice(index, 1)
      return true
    }
    return false
  })
  return pickBy(object, (_, key) => hasIn(key))
}

export function omit<T extends object, K extends PropertyName[]>(
  object: T,
  ...props: K
): Pick<T, Exclude<keyof T, K[number]>>
export function omit<T extends object, K extends keyof T>(
  object: T,
  ...props: Array<MaybeArray<K>>
): Omit<T, K>
export function omit<T extends object>(
  object: T,
  ...props: Array<MaybeArray<PropertyName>>
): Partial<T> {
  const paths = props.flat()
  const notIn = cacheKeyofFunction((key: PropertyName) => {
    const index = paths.indexOf(key)
    if (index !== -1) {
      paths.splice(index, 1)
      return false
    }
    return true
  })
  return pickBy(object, (_, key) => notIn(key))
}
