import type { ExtractPropTypes, getCurrentInstance } from 'vue-demi'

import { isHandlerKey, useListeners } from '../listeners'
import type { ComponentObjectPropsOptions } from './normalize'

export type ExtractListenerPropKeys<T extends ComponentObjectPropsOptions> = {
  [K in keyof T]: K extends `on${string}` ? K : never
}[keyof T]

export function extractListenerPropKeys<T extends ComponentObjectPropsOptions>(
  props: T
): ExtractListenerPropKeys<T>[] {
  return Object.keys(props).filter((key) =>
    isHandlerKey(key)
  ) as ExtractListenerPropKeys<T>[]
}

export interface UseListenerForwardReturn<
  T extends ComponentObjectPropsOptions,
  K extends keyof T = ExtractListenerPropKeys<T>
> {
  props: Pick<T, K>
  forwards: () => Required<ExtractPropTypes<Pick<T, K>>>
}

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
  K extends ExtractListenerPropKeys<T>
>(props: T, keys: K[]): UseListenerForwardReturn<T, K>
export function createListenerPropsForwarder<
  T extends ComponentObjectPropsOptions,
  K extends ExtractListenerPropKeys<T>
>(props: T, keys?: K[]): UseListenerForwardReturn<T, K> {
  const listenerKeys = keys ?? extractListenerPropKeys(props)

  return {
    props: listenerKeys.reduce((forwardProps, k) => {
      forwardProps[k as keyof typeof forwardProps] = props[k] as any
      return forwardProps
    }, {} as Pick<T, K>),

    forwards: (instance?: ReturnType<typeof getCurrentInstance>) => {
      const listeners = useListeners(instance, true)

      return listenerKeys.reduce((forwards, key) => {
        forwards[key as keyof typeof forwards] = listeners.proxy(key) as any
        return forwards
      }, {} as Required<ExtractPropTypes<Pick<T, K>>>)
    }
  }
}
