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
  return pickBy(object, (_, key) => paths.includes(key))
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
  return pickBy(object, (_, key) => !paths.includes(key))
}

/**
 * Creates an array of elements split into two groups, the first of which
 * contains elements `predicate` returns truthy for, the second of which
 * contains elements `predicate` returns falsey for. The predicate is
 * invoked with one argument: (value).
 *
 * @example ```ts
 * const users = [
 *   { 'user': 'barney',  'age': 36, 'active': false },
 *   { 'user': 'fred',    'age': 40, 'active': true },
 *   { 'user': 'pebbles', 'age': 1,  'active': false }
 * ]
 *
 * partition(users, ({ active }) => active)
 * // => objects for [['fred'], ['barney', 'pebbles']]
 * ```
 */
export function partition<T, U extends T>(
  collection: T[] | null | undefined,
  predicate: (value: U, index: number) => value is U
): [U[], Array<Exclude<T, U>>]
export function partition<T>(
  collection: T[] | null | undefined,
  predicate: (value: T, index: number) => boolean
): [T[], T[]]
export function partition<T extends object>(
  collection: T | null | undefined,
  predicate: (value: ValueOf<T>, key: keyof T) => boolean
): [ValueOf<T>[], ValueOf<T>[]]
export function partition<T>(
  collection: T | null | undefined,
  predicate: (value: unknown, key: any) => boolean
): unknown {
  const fragment = [[], []] as [any, any]
  for (const key in collection) {
    const value = collection[key]
    fragment[predicate(value, key) ? 0 : 1].push(value)
  }
  return fragment
}
