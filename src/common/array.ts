import { isArray, isDef } from './is'
import type { MaybeArray } from './types'

export function toArray<T>(value?: MaybeArray<T>): Array<T> {
  return isDef(value) ? (isArray(value) ? value : ([value] as Array<T>)) : []
}

export function remove<T>(arr: T[], el: T): boolean {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
    return true
  }
  return false
}

export function nth<T>(array: T[], i: number): T | undefined {
  const length = array.length
  if (!length) {
    return undefined
  }
  return array[i < 0 ? length + i : i]
}

export function last<T>(array: T[]): T | undefined {
  return nth(array, -1)
}

export function toTrueObj<T extends string>(strings: T[]) {
  return strings.reduce((acc, str) => {
    acc[str] = true
    return acc
  }, {} as Record<T, true>)
}
