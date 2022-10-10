import type { MaybeArray, PropertyName } from '../types'
import { cacheKeyofFunction } from '.'
import { pickBy } from './pickBy'

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
