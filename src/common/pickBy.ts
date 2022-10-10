import type { ValueOf } from '../types'

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
