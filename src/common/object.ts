import { remove } from './array'
import { cacheKeyofFunction } from './function'
import type { MaybeArray, PropertyName, ValueOf } from './types'

export { hasOwn, def } from '@vue/shared'

export const assign = Object.assign
export const extend = assign

export function mapKey<T extends object>(
  object: T | null | undefined,
  iteratee: (value: ValueOf<T>, key: keyof T, object: T) => keyof T
) {
  const result: Record<PropertyName, ValueOf<T>> = {}
  for (const key in object) {
    const value = object[key]
    result[iteratee(value, key, object) as keyof T] = value
  }
  return result
}

export function objectKeys<T extends object>(object: T) {
  return Object.keys(object) as Array<keyof T>
}

/**
 * Creates an object composed of the object properties predicate returns truthy for.
 * The predicate is invoked with two arguments: (value, key).
 */
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

/**
 * Creates an object composed of the picked object properties.
 */
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
  const hasIn = cacheKeyofFunction((key: PropertyName) => remove(paths, key))
  return pickBy(object, (_, key) => hasIn(key))
}

/**
 * Creates an object composed of the own and inherited enumerable property paths of object that are not omitted.
 */
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
  const notIn = cacheKeyofFunction((key: PropertyName) => !remove(paths, key))
  return pickBy(object, (_, key) => notIn(key))
}
