import { isArray } from '@vue/shared'

export function noop() {}

export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null
}

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}

export type PropertyName = string | number | symbol

type MaybeArray<T> = T | ReadonlyArray<T>

export function pick<T extends object, U extends keyof T>(
  object: T,
  ...props: Array<MaybeArray<keyof T>>
): Pick<T, U>
export function pick<T extends object>(
  object: T,
  ...props: Array<MaybeArray<PropertyName>>
): Partial<T>
export function pick<T extends object>(
  object: T,
  ...props: Array<MaybeArray<PropertyName>>
): Partial<T> {
  if (!object) {
    return {}
  }
  const picks: Partial<T> = {}
  const pickByHasIn = (prop: keyof T) => {
    if (prop in object) {
      picks[prop] = object[prop]
    }
  }

  return props.reduce((picks, prop) => {
    if (isArray(prop)) {
      prop.forEach(pickByHasIn)
    } else {
      pickByHasIn(prop as keyof T)
    }
    return picks
  }, picks)
}

export function partition<T, U extends T = T>(
  collection: T | null | undefined,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): [U, Omit<T, keyof U>] {
  type Result = [U, Exclude<T, U>]

  if (!collection) {
    return [] as unknown as Result
  }

  const getSource = () => (isArray(collection) ? [] : {})
  const ret = [getSource(), getSource()] as Result

  for (const key in collection) {
    const value = collection[key] as any
    ret[predicate(value, key as keyof T) ? 0 : 1][key as keyof Result[number]] =
      value
  }

  return ret
}
