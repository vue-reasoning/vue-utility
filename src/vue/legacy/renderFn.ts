import { extend, makeMap } from '../../common'
import { toHandlerKey } from '../options'
import { normalizeClass, normalizeStyle } from '../vnode'

// Copied in Vue

const skipLegacyRootLevelProps = /*#__PURE__*/ makeMap(
  'staticStyle,staticClass,directives,model,hook'
)

/**
 * Convert vnode data in v2 format to v3, only recommended for use in the render function.
 *
 * it will do the following work:
 * 1. merged "attrs", "domProps", "props" into data
 * 2. convert "on" and "nativeOn", and merged into data
 * 3. merged "staticClass" into "class"
 * 4. merged "staticStyle" info "style"
 */
export function convertLegacyProps(legacyProps: Record<string, any>) {
  const converted: Record<string, any> = {}

  for (const key in legacyProps) {
    if (key === 'attrs' || key === 'domProps' || key === 'props') {
      extend(converted, legacyProps[key])
    } else if (key === 'on' || key === 'nativeOn') {
      const listeners = legacyProps[key]
      for (const event in listeners) {
        let handlerKey = convertLegacyEventKey(event)
        if (key === 'nativeOn') handlerKey += `Native`
        const existing = converted[handlerKey]
        const incoming = listeners[event]
        if (existing !== incoming) {
          if (existing) {
            converted[handlerKey] = [].concat(existing as any, incoming as any)
          } else {
            converted[handlerKey] = incoming
          }
        }
      }
    } else if (!skipLegacyRootLevelProps(key)) {
      converted[key] = legacyProps[key]
    }
  }

  if (legacyProps.staticClass) {
    converted.class = normalizeClass([legacyProps.staticClass, converted.class])
  }
  if (legacyProps.staticStyle) {
    converted.style = normalizeStyle([legacyProps.staticStyle, converted.style])
  }

  return converted
}

export function convertLegacyEventKey(event: string): string {
  // normalize v2 event prefixes
  if (event[0] === '&') {
    event = event.slice(1) + 'Passive'
  }
  if (event[0] === '~') {
    event = event.slice(1) + 'Once'
  }
  if (event[0] === '!') {
    event = event.slice(1) + 'Capture'
  }
  return toHandlerKey(event)
}
