import * as Vue from 'vue'
import { isVue3, getCurrentInstance, onMounted, onUpdated, ref } from 'vue-demi'
import type { VNode } from 'vue-demi'
import {
  isArray,
  normalizeClass as SharedNormalizeClass,
  normalizeStyle as SharedNormalizeStyle
} from '@vue/shared'

import { isHandlerKey, toHandlerKey, toListenerKey } from './listeners'
import * as V2VnodeMethods from './vnode.v2'
import { isFlase, isUndef } from './common'

export { parseStringStyle, stringifyStyle } from '@vue/shared'
export type { NormalizedStyle } from '@vue/shared'

export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

export function isElement(vnode: VNode) {
  return isVue3
    ? vnode.shapeFlag & ShapeFlags.ELEMENT
    : V2VnodeMethods.isElement(vnode)
}

export function isComponent(vnode: VNode) {
  return isVue3
    ? vnode.shapeFlag & ShapeFlags.COMPONENT
    : V2VnodeMethods.isComponent(vnode)
}

export function isComment(vnode: VNode) {
  return isVue3 ? vnode.type === Vue.Comment : V2VnodeMethods.isComment(vnode)
}

export function isFragment(vnode: VNode) {
  return isVue3 && vnode.type === Vue.Fragment
}

export function isText(vnode: VNode) {
  return isVue3 ? vnode.type === Vue.Text : V2VnodeMethods.isText(vnode)
}

export function hasArrayChildren(vnode: VNode) {
  return isVue3
    ? vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN
    : !!vnode.children?.length
}

export const cloneVNode = isVue3 ? Vue.cloneVNode : V2VnodeMethods.cloneVNode

//
// props ==================================
//

export function mergeProps(
  ...args: (Record<string, any> | undefined | null)[]
) {
  const ret: Record<string, any> = {}
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i]
    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class])
        }
      } else if (key === 'style') {
        ret.style = normalizeStyle([ret.style, toMerge.style])
      } else if (isHandlerKey(key)) {
        Object.assign(ret, normalizeListeners(ret, toMerge))
      } else if (key !== '') {
        ret[key] = toMerge[key]
      }
    }
  }
  return ret
}

export function normalizeClass(...classes: unknown[]): string {
  return SharedNormalizeClass(classes)
}

export function normalizeStyle(...styles: unknown[]) {
  return SharedNormalizeStyle(styles)
}

export function normalizeListeners(
  ...args: (Record<string, any> | undefined)[]
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
        ret[key] = existing
          ? ([] as Function[]).concat(existing, incoming).flat()
          : incoming
      }
    }
  }
  return ret
}

export function normalizeHandlerKeys(listeners: Record<string, any>) {
  return Object.keys(listeners).reduce((normalized, event) => {
    normalized[toHandlerKey(event)] = listeners[event]
    return normalized
  }, {} as Record<string, any>)
}

export function normalizeListenerKeys(listeners: Record<string, any>) {
  return Object.keys(listeners).reduce((normalized, event) => {
    normalized[toListenerKey(event)] = listeners[event]
    return normalized
  }, {} as Record<string, any>)
}

export function normalizeProps(props: Record<string, any>) {
  return mergeProps([props])
}

//
// Hooks ==================================
//

const isRealElement = (element: HTMLElement) => element.nodeType === 1

export function getVNodeElement<T extends Element>(
  vnode: VNode
): T | null | undefined {
  return isVue3 ? vnode.el : (vnode as any).elm
}

export function useFirstQualifiedElement(
  instance = getCurrentInstance(),
  qualifier = isRealElement
) {
  const elementRef = ref<HTMLElement>()

  const isQualifiedChild = (vnode: VNode) => {
    const el = getVNodeElement<HTMLElement>(vnode)
    return !!el && qualifier(el)
  }

  const updateElement = () => {
    if (isVue3) {
      const vnode = instance?.vnode
      const qualifiedChild =
        vnode && findFirstQualifiedChild([vnode], isQualifiedChild)
      elementRef.value = qualifiedChild
        ? getVNodeElement<HTMLElement>(qualifiedChild)!
        : undefined
    } else {
      // because Vue2 supports element hoisting for HOC, so we can do this
      const element = instance?.proxy?.$el
      elementRef.value = element && qualifier(element) ? element : undefined
    }
  }

  onMounted(updateElement)
  onUpdated(updateElement)

  if (isVue3 ? instance?.isMounted : (instance as any)?._isMounted) {
    updateElement()
  }

  return elementRef
}

export function findFirstQualifiedChild(
  children: VNode[] | undefined,
  qualifier: (vnode: VNode) => boolean
): VNode | null {
  if (!children) return null

  let i: VNode | null
  for (const child of children) {
    if (qualifier(child)) return child
    if (isVue3) {
      if (
        child.component?.subTree &&
        (i = findFirstQualifiedChild([child.component.subTree], qualifier))
      ) {
        return i
      }
    }
    if (
      hasArrayChildren(child) &&
      (i = findFirstQualifiedChild(child.children as VNode[], qualifier))
    ) {
      return i
    }
  }

  return null
}
