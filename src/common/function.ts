import { isFunction } from './is'
import type { PropertyName } from './types'

export function toReturnValue<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T>
export function toReturnValue<T extends Exclude<any, (...args: any[]) => any>>(
  fn: T,
  ...args: any[]
): T
export function toReturnValue(fn: unknown, ...args: any[]) {
  return isFunction(fn) ? fn(...args) : fn
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

export function invokeCallbacks<T extends any[]>(
  callbacks: T,
  ...args: Parameters<T[number]>
) {
  callbacks.forEach((cb) => cb(...args))
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

type ExtractFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

export function proxyFunction<
  T extends Record<string, any>,
  K extends ExtractFunctionKeys<T>
>(source: T, emitKey: K): T[K] {
  return ((...args: Parameters<T[K]>) => {
    return source[emitKey](...args)
  }) as T[K]
}
