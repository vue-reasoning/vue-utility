export type AnyFixMe = any

export type AnyObject = { [key: string]: any }

export type AnyFunction = (...args: any[]) => any

export type PropertyName = string | number | symbol

export type MaybeArray<T> = T | ReadonlyArray<T>

export type ElementOf<T> = T extends (infer E)[] ? E : never

export type ValueOf<T> = T[keyof T]

export type Fn<T = void> = () => T

export type Callback = () => void

export type Getter<T, Args extends any[] = any[]> = (...args: Args) => T

export type Setter<T> = (value: T) => void
