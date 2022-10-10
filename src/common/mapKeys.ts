import type { PropertyName, ValueOf } from '../types'

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
