import type { Ref } from 'vue-demi'

export type MaybeRef<T> = T | Ref<T>

export type MaybeArray<T> = T | ReadonlyArray<T>

export type ElementOf<T> = T extends (infer E)[] ? E : never

export type ValueOf<T> = T[keyof T]
