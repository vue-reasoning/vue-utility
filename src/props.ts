import type {
  ComponentPropsOptions,
  ExtractPropTypes,
  getCurrentInstance,
  PropType
} from 'vue-demi'
import { isArray, isFunction } from '@vue/shared'

import { emitListener, createListenerContext, isHandlerKey } from './listeners'

//
// Prop options ==================================
//

export type ComponentObjectPropsOptions = ComponentPropsOptions &
  Record<string, any>

export type FilterPropKeysByType<
  T extends ComponentObjectPropsOptions,
  U = any
> = {
  [K in keyof ExtractPropTypes<T>]: NonNullable<
    ExtractPropTypes<T>[K]
  > extends U
    ? K
    : never
}[keyof ExtractPropTypes<T>]

/**
 * Extract the listeners' props in props options,
 * and provide emit functions that can be used in the component.
 * @example
 * ```ts
 * const TooltipProps = {
 *   ...
 *   content: [String, Object],
 *   onClickOutside: Function as PropType<(event: MouseEvent) => void>,
 *   onOpen: Function as PropType<() => void>
 *   ...
 * } as const
 *
 * const TooltipListenerPropsForwarder = createListenerPropsForwarder(TooltipProps)
 *
 * // snapshot
 * TooltipListenerPropsForwarder.props = {
 *   onClickOutside: Function as PropType<(event: MouseEvent) => void>,
 *   onOpen: Function as PropType<() => void>
 * }
 *
 * // NOTE: Regardless of whether listener props are passed in the component,
 * // we will define a function to emit in forwards.
 *
 * TooltipListenerPropsForwarder.forwards = {
 *   onClickOutside: (event: MouseEvent) => void,
 *   onOpen: () => void
 * }
 * ```
 */
export function createListenerPropsForwarder<
  T extends ComponentObjectPropsOptions
>(props: T): UseListenerForwardReturn<T>
export function createListenerPropsForwarder<
  T extends ComponentObjectPropsOptions,
  K extends ExtractMeybeListenerPropKeys<T>
>(props: T, keys: K[]): UseListenerForwardReturn<T, K>
export function createListenerPropsForwarder<
  T extends ComponentObjectPropsOptions,
  K extends ExtractMeybeListenerPropKeys<T>
>(props: T, keys?: K[]): UseListenerForwardReturn<T, K> {
  const listenerKeys =
    // should its type filter it?
    keys || Object.keys(props).filter(prop => isHandlerKey(prop))

  return {
    props: listenerKeys.reduce((forwardProps, k) => {
      forwardProps[k as keyof typeof forwardProps] = props[k] as any
      return forwardProps
    }, {} as Pick<T, K>),

    forwards: (instance?: ReturnType<typeof getCurrentInstance>) => {
      const context = createListenerContext(instance!)
      if (!context) {
        console.warn(`useListenerForward() called without active instance.`)
      }

      return listenerKeys.reduce((forwards, key) => {
        forwards[key as keyof typeof forwards] = ((...args: any[]) =>
          emitListener(context, key, true, ...args)) as any
        return forwards
      }, {} as Required<ExtractPropTypes<Pick<T, K>>>)
    }
  }
}

export type ExtractMeybeListenerPropKeys<
  T extends ComponentObjectPropsOptions
> = {
  [K in keyof T]: K extends `on${string}` ? K : never
}[keyof T]

export type ExtractListenerPropKeys<T extends ComponentObjectPropsOptions> =
  FilterPropKeysByType<Pick<T, ExtractMeybeListenerPropKeys<T>>, Function>

export interface UseListenerForwardReturn<
  T extends ComponentObjectPropsOptions,
  K extends keyof T = ExtractListenerPropKeys<T>
> {
  props: Pick<T, K>
  forwards: () => Required<ExtractPropTypes<Pick<T, K>>>
}

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
  const normalizedCache = {} as NormalizePropsOptions<T>

  const getNormalizedProp = (prop: string) => {
    let normalized: NormalizePropsOption<any>
    if (prop in normalizedCache) {
      normalized = normalizedCache[prop]
    } else {
      normalized = normalizePropOptions(props[prop as keyof typeof props])
      normalizedCache[prop] = normalized
    }
    return normalized
  }

  return (defaultProps => {
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

export function withDefaultProps<T extends ComponentPropsOptions>(
  props: T
): WithDefaultProps<T>
export function withDefaultProps<
  T extends ComponentPropsOptions,
  D extends Partial<Record<keyof T, unknown>>
>(props: T, defaultProps: D): WithDefaultProps<T, D>
export function withDefaultProps<
  T extends ComponentPropsOptions,
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

/**
 * normalized props option to `ObjectPropsOption`
 * @example
 * ```ts
 * // PropConstructor
 * normalizePropOptions([String, Array]) => {
 *   type: [String, Array]
 * }
 * // PropOptions | Null
 * normalizePropOptions(null) => null
 * ```
 */
export function normalizePropOptions<
  T extends ComponentObjectPropsOptions[keyof ComponentObjectPropsOptions]
>(prop?: T): NormalizePropsOption<T> {
  return (
    isArray(prop) || isFunction(prop) ? { type: prop } : prop
  ) as NormalizePropsOption<T>
}

export type NormalizePropsOption<
  T extends
    | ComponentObjectPropsOptions[keyof ComponentObjectPropsOptions]
    | undefined
> = T extends PropType<any>
  ? {
      type: T
    }
  : T

/**
 * normalized props options to `ObjectPropsOptions`
 * @example
 * ```ts
 * // String props
 * normalizePropsOptions(['foo', 'bar']) => {
 *   foo: {},
 *   bar: {}
 * }
 * // Object props
 * normalizePropsOptions({
 *   foo: String,
 *   bar: {
 *     type: Number
 *   }
 * }) => {
 *   foo: {
 *     type: String
 *   },
 *   bar: {
 *     type: Number
 *   }
 * }
 * ```
 */
export function normalizePropsOptions<T extends ComponentPropsOptions>(
  props: T
): NormalizePropsOptions<T> {
  const normalized = {} as NormalizePropsOptions<T>

  if (isArray(props)) {
    for (let i = 0; i < props.length; i++) {
      normalized[props[i]] = {}
    }
  } else if (props) {
    for (const key in props) {
      normalized[key] = normalizePropOptions(
        props[key]
      ) as NormalizePropsOption<any>
    }
  }

  return normalized
}

export type NormalizePropsOptions<T extends ComponentPropsOptions> =
  T extends string[]
    ? Record<T[number], {}>
    : {
        [K in keyof T]: NormalizePropsOption<T[K]>
      }

//
// Prop type ==================================
//

export const definePropType = <T>(
  type?: ResolvePropTypeConstructor<T> | any[]
): PropType<T> => type as PropType<T>

type ResolvePropTypeConstructor<T> = T extends string
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
