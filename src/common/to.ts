import { isFunction } from './is'

export { toNumber, toRawType, toTypeString } from '@vue/shared'

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
