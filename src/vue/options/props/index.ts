import type { ExtractPropTypes } from 'vue-demi'

import type { ValueOf } from '../../../common'
import type { ComponentObjectPropsOptions } from './normalize'

export * from './define'
export * from './normalize'
export * from './forwardListenerProps'

export type ExtractPropsKeysByType<
  T extends ComponentObjectPropsOptions,
  U = any
> = Required<ExtractPropTypes<T>> extends infer E
  ? {
      [K in keyof E]: E[K] extends U ? K : never
    }[keyof E]
  : never

export type ExtractPropType<T> = ValueOf<
  ExtractPropTypes<{
    prop: T
  }>
>

export type ExtractInternalPropTypes<T> = ExtractPropTypes<T>

// because Vue automatically normalizes Boolean props, it is not required for external
export type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends {
    required: true
  }
    ? K
    : never
}[keyof T]

type A = PublicRequiredKeys<{
  a: {
    required: true
  }
}>

export type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>

export type ExtractPublicPropTypes<T> = {
  [K in keyof Pick<T, PublicRequiredKeys<T>>]: ExtractPropType<T[K]>
} & {
  [K in keyof Pick<T, PublicOptionalKeys<T>>]?: ExtractPropType<T[K]>
}
