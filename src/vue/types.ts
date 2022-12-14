import type { ComputedRef, Ref } from 'vue-demi'

import type { MaybeArray } from '../common'

export type MaybeRef<T> = T | Ref<T>

export type ValueSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)

export type Subscribeable<T = any> = ValueSource<T> | object

export type Dependency<T = unknown> = MaybeArray<Subscribeable<T>>

export type ResolveDependencySource<T> = T extends any[]
  ? {
      [K in keyof T]: ResolveDependencySource<T[K]>
    }
  : T extends ValueSource<infer R>
  ? R
  : T
