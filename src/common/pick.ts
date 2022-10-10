import type { MaybeArray, PropertyName } from '../types'
import { cacheKeyofFunction } from '.'
import { pickBy } from './pickBy'

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
  const hasIn = cacheKeyofFunction((key: PropertyName) => {
    const index = paths.indexOf(key)
    if (index !== -1) {
      paths.splice(index, 1)
      return true
    }
    return false
  })
  return pickBy(object, (_, key) => hasIn(key))
}
