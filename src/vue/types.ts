import type { ComputedRef, Ref } from 'vue-demi'

import type { MaybeArray } from '../common'

export type MaybeRef<T> = T | Ref<T>

export type ValueSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)

export type Subscribeable<T = any> = ValueSource<T> | object | (() => void)

export type Dependency<T = unknown> = MaybeArray<Subscribeable<T>>
