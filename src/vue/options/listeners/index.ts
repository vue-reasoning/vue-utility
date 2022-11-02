import { getCurrentInstance, isVue3 } from 'vue-demi'

import { camelize, hyphenate, invokeCallbacks, isArray } from '../../../common'
import { isHandlerKey } from './isHandlerKey'
import { toHandlerKey, toListenerKey } from './transform'

export * from './isHandlerKey'
export * from './parse'
export * from './transform'

export type Handler = Function | Function[]

export function normalizeHandler(
  ...handlers: Array<Handler | null | undefined>
) {
  return handlers.reduce<Function[]>((normalized, handler) => {
    if (handler && (isArray(handler) || !normalized.includes(handler))) {
      return normalized.concat(handler).flat()
    }
    return normalized
  }, [])
}

export type AnyHandler = (event: string, ...args: any[]) => void

/**
 * @param ignoreFormat Whether to ignore the event format.
 * If it is true, it will use the `caramelize` and `hyphenate` forms  to match.
 */
export function getHandler<T extends AnyHandler = AnyHandler>(
  instance = getCurrentInstance(),
  event: string,
  ignoreFormat = true
) {
  if (!instance) {
    return null
  }

  let handler: T | T[] | undefined
  let props: Record<string, any> | null

  if (isVue3) {
    props = instance.vnode.props
    event = isHandlerKey(event) ? event : toHandlerKey(event)
  } else {
    props = (instance.proxy as any).$listeners
    event = toListenerKey(event)
  }

  if (!props) {
    return null
  }

  handler = props[event]
  if (!handler && ignoreFormat) {
    handler = props[camelize(event)] || props[hyphenate(event)]
  }

  return handler
    ? isArray(handler) && handler.length
      ? (invokeCallbacks as any).bind(null, handler)
      : handler
    : null
}

export function hasListener(
  instance = getCurrentInstance(),
  event: string,
  ignoreFormat = true
) {
  return !!getHandler(instance, event, ignoreFormat)
}

export function emitListener(
  instance = getCurrentInstance(),
  event: string,
  ignoreFormat = true,
  ...args: any[]
) {
  getHandler(instance, event, ignoreFormat)?.(...args)
}
