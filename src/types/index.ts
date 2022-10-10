export * from './reactivity'

export type PropertyName = string | number | symbol

export type MaybeArray<T> = T | ReadonlyArray<T>

export type ElementOf<T> = T extends (infer E)[] ? E : never

export type ValueOf<T> = T[keyof T]
