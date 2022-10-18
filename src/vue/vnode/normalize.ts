import {
  normalizeClass as SharedNormalizeClass,
  normalizeStyle as SharedNormalizeStyle
} from '@vue/shared'

import { isArray, mapKey } from '../../common'
import { isHandlerKey, normalizeHandler, toListenerKey } from '../options'

export function normalizeClass(...classes: unknown[]): string {
  return SharedNormalizeClass(classes)
}

export function normalizeStyle(...styles: unknown[]) {
  return SharedNormalizeStyle(styles)
}

export function normalizeListeners(
  ...args: (Record<string, any> | undefined | null)[]
) {
  const ret: Record<string, Function[]> = {}
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i]
    for (let key in toMerge) {
      const existing = ret[key]
      const incoming = toMerge[key]
      if (
        incoming &&
        existing !== incoming &&
        !(isArray(existing) && existing.includes(incoming))
      ) {
        ret[key] = normalizeHandler(existing, incoming)
      }
    }
  }
  return ret
}

export function normalizeProps(
  ...props: Array<Record<string, any> | undefined | null>
) {
  const ret: Record<string, any> = {}
  for (let i = 0; i < props.length; i++) {
    const toMerge = props[i]
    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass(ret.class, toMerge.class)
        }
      } else if (key === 'style') {
        ret.style = normalizeStyle(ret.style, toMerge.style)
      } else if (isHandlerKey(key)) {
        ret[key] = normalizeHandler(ret[key], toMerge[key])
      } else if (key !== '') {
        ret[key] = toMerge[key]
      }
    }
  }
  return ret
}

export function normalizeListenerKeys(props: Record<string, any>) {
  return mapKey(props, (_, key) => toListenerKey(key))
}
