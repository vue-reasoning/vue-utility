import type { ComputedRef, Ref } from 'vue-demi'
import type { MaybeArray } from '../common'

export type MaybeRef<T> = T | Ref<T>

export type SubscribeSource<T> = Ref<T> | ComputedRef<T> | (() => T)

export type Subscribeable<T> = SubscribeSource<T> | object | (() => void)

export type Dependency<T = unknown> = MaybeArray<Subscribeable<T>>
