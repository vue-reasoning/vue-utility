import { camelize, hyphenate } from '../../../common'
import { convertLegacyEventKey } from '../../legacy'
import { toListenerKey } from './transform'

const optionsModifierRE = /(?:Once|Passive|Capture)$/

export interface ParsedEventOptions {
  type: string
  options: EventListenerOptions | undefined
}

export function parseEventOptions(name: string): ParsedEventOptions {
  // for Vue2
  name = convertLegacyEventKey(toListenerKey(name))

  let options: EventListenerOptions | undefined
  if (optionsModifierRE.test(name)) {
    options = {}
    let m
    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length)
      ;(options as any)[m[0].toLowerCase()] = true
    }
  }

  const type = name[2] === ':' ? name.slice(3) : hyphenate(name.slice(2))
  return {
    type,
    options
  }
}

export interface ParsedEventName {
  origin: string
  camelize: string
  hyphenate: string
}

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
export function parseEventName(event: string): ParsedEventName {
  const origin = toListenerKey(event)
  return {
    origin,
    camelize: camelize(origin),
    hyphenate: hyphenate(origin)
  }
}
