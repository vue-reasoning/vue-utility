import type { PropType } from 'vue-demi'

import { normalizePropOptions } from './normalize'
import type {
  ComponentObjectPropsOptions,
  NormalizePropsOption
} from './normalize'
import { cacheKeyofFunction } from '../../../common'

/**
 * Create a factory function for props that can override their default props.
 * @example
 * ```ts
 * const withButtonProps = createPropsFactory({
 *   type: String,
 *   size: {
 *     type: String,
 *     default: 'biggest'
 *   }
 * })
 *
 * const PrimaryButtonProps = withButtonProps({
 *   type: 'primary',
 *   size: 'medium'
 * })
 *
 * // snapshot
 * PrimaryButtonProps = {
 *   type: {
 *     type: String,
 *     default: 'primary'
 *   },
 *   size: {
 *     type: String,
 *     default: 'medium'
 *   }
 * }
 * ```
 */
export function createPropsFactory<T extends ComponentObjectPropsOptions>(
  props: T
) {
  const getNormalizedProp = (prop: string) => normalizePropOptions(props[prop])

  return ((defaultProps) => {
    if (!defaultProps) {
      return props
    }

    return Object.keys(props).reduce<any>((merged, prop) => {
      if (prop in defaultProps) {
        merged[prop] = {
          ...getNormalizedProp(prop),
          default: defaultProps[prop]
        }
      } else {
        merged[prop] = props[prop]
      }
      return merged
    }, {})
  }) as PropsFactory<T>
}

export interface PropsFactory<T extends ComponentObjectPropsOptions> {
  // overload 1: without passing default props, props will be returned as is
  (): T
  // overload 2: merge default props and props
  <D extends Partial<Record<keyof T, unknown>>>(
    defaultProps: D
  ): WithDefaultProps<T, D>
  // implement
  <D extends Partial<Record<keyof T, unknown>>>(defaultProps?: D):
    | T
    | WithDefaultProps<T, D>
}

export function withDefaultProps<T extends ComponentObjectPropsOptions>(
  props: T
): WithDefaultProps<T>
export function withDefaultProps<
  T extends ComponentObjectPropsOptions,
  D extends Partial<Record<keyof T, unknown>>
>(props: T, defaultProps: D): WithDefaultProps<T, D>
export function withDefaultProps<
  T extends ComponentObjectPropsOptions,
  D extends Partial<Record<keyof T, unknown>>
>(props: T, defaultProps?: D): WithDefaultProps<T, D> {
  return createPropsFactory(props)(defaultProps) as WithDefaultProps<T, D>
}

export type WithDefaultProps<
  T extends ComponentObjectPropsOptions,
  D extends Partial<Record<keyof T, unknown>> = {}
> = {
  [P in keyof T]-?: unknown extends D[P]
    ? T[P]
    : NormalizePropsOption<T[P]> extends Record<string, unknown>
    ? Omit<NormalizePropsOption<T[P]>, 'default'> & {
        default: D[P]
      }
    : {
        type: null
        default: D[P]
      }
}

export const definePropType = <T>(
  type?: ResolvePropConstructor<T> | any[] | true | null
) => type as PropType<T>

export interface PropOptionsDefinition<T> {
  type: PropType<T>
  required?: boolean
  default?: unknown
  isRequired: this & { required: true }
  def: <U = unknown>(value: U) => this & { default: U }
}

export const definePropOptions = <T>(
  type?: ResolvePropConstructor<T> | any[] | true | null
) => {
  const descriptors: PropertyDescriptorMap &
    ThisType<PropOptionsDefinition<T>> = {
    isRequired: {
      get() {
        this.required = true
        return this
      }
    },
    def: {
      value(value: any) {
        this.default = value
        return this
      }
    }
  }

  return Object.defineProperties(
    { type: definePropType(type) } as PropOptionsDefinition<T>,
    descriptors
  )
}

export type ResolvePropConstructor<T> = T extends string
  ? StringConstructor
  : T extends number
  ? NumberConstructor
  : T extends symbol
  ? SymbolConstructor
  : T extends bigint
  ? BigIntConstructor
  : T extends Function
  ? FunctionConstructor
  : T extends any[]
  ? ArrayConstructor
  : T extends null
  ? null
  : T extends object
  ? ObjectConstructor
  : any
