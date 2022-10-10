import type { PropertyName } from '../types'
import { isFunction } from './is'

export * from './is'
export * from './mapKeys'
export * from './omit'
export * from './pick'
export * from './pickBy'
export * from './to'

export { hasChanged, hasOwn, remove, def } from '@vue/shared'

export const assign = Object.assign

export function noop() {}

export function always() {
  return true
}

export function never() {
  return false
}

export function cacheKeyofFunction<T extends PropertyName, U = any>(
  fn: (key: T) => U,
  ignoreNullable = false
): (key: T) => U {
  const cache: Record<T, U> = Object.create(null)
  return (key: T) => {
    const hit = cache[key]
    if (ignoreNullable && key in cache) {
      return hit
    }
    return hit || (cache[key] = fn(key))
  }
}

export function invokeIfFunction<T>(
  fn: T,
  ...args: any[]
): T extends (...args: any[]) => any ? ReturnType<T> : void
export function invokeIfFunction(fn: unknown, ...args: unknown[]) {
  if (isFunction(fn)) {
    return fn(...args)
  }
}
