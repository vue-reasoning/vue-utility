import { isReactive, isReadonly, isRef } from 'vue-demi'
import type { Ref } from 'vue-demi'

import { isArray, isFunction } from '../../common'
import type { Dependency } from '../types'

export function isWritableRef<T = unknown>(v: unknown): v is Ref<T> {
  return isRef(v) && !isReadonly(v)
}

export function isDependency<T = unknown>(dep: unknown): dep is Dependency<T> {
  return (
    isRef(dep) ||
    isReactive(dep) ||
    isFunction(dep) ||
    (isArray(dep) && !!dep.length)
  )
}
