import { camelize, hyphenate } from '@vue/shared'

import { cacheKeyofFunction } from '../../../common'
import { isHandlerKey } from './is'

export { camelize, hyphenate }

/**
 * @example
 * ```ts
 * camelize('xxx') -> 'Xxx'
 * ```
 */
export const upperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @example
 * ```ts
 * camelize('ZZZ') -> 'zZZ'
 * ```
 */
export const lowerFirst = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * Capitalize the first letter and add `'on'` at the top.
 *
 * @example
 * ```ts
 * toHandlerKey('eventTrigger') -> 'onEventTrigger'
 * ```
 */
export const toHandlerKey = cacheKeyofFunction((event: string) => {
  return event ? `on${upperFirst(event)}` : event
})

/**
 * Lowercase the first letter and remove the leading `'on'`.
 *
 * @example
 * ```ts
 * toListenerKey('onEventTrigger') -> 'eventTrigger'
 * ```
 */
export const toListenerKey = cacheKeyofFunction((event: string) => {
  if (isHandlerKey(event)) {
    event = event.slice(2)
    if (event.startsWith('-')) {
      event = event.slice(1)
    }
    return lowerFirst(event)
  }
  return event
})

/**
 * @example
 * ```ts
 * parseEvent('onCourierArrives') -> {
 *  origin:    'courierArrives', // like `toListenerKey`
 *  camelize:  'courierArrives',
 *  hyphenate: 'courier-arrives'
 * }
 * ```
 */
export const parseEvent = cacheKeyofFunction<string, EventParsed>(
  (event: string) => {
    const origin = toListenerKey(event)
    return {
      origin,
      camelize: camelize(origin),
      hyphenate: hyphenate(origin)
    }
  }
)

export interface EventParsed {
  origin: string
  camelize: string
  hyphenate: string
}
