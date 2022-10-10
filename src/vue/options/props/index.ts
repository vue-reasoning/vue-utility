import type { ExtractPropTypes } from 'vue-demi'

import type { ComponentObjectPropsOptions } from './normalize'

export * from './define'
export * from './normalize'

export type ExtractPropsKeysByType<
  T extends ComponentObjectPropsOptions,
  U = any
> = Required<ExtractPropTypes<T>> extends infer E
  ? {
      [K in keyof E]: E[K] extends U ? K : never
    }[keyof E]
  : never
