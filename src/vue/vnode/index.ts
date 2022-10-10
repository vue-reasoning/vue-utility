import * as Vue from 'vue'
import { getCurrentInstance, isVue3, onMounted, onUpdated, ref } from 'vue-demi'
import type { VNode } from 'vue-demi'

import { isArray, isObject } from '../../common'
import { findChild } from './children'
import { getVNodeElement } from './get'
import {
  normalizeClass,
  normalizeListeners,
  normalizeProps,
  normalizeStyle
} from './normalize'
import type { MaybeArray } from 'src/types'

export * from './children'
export * from './get'
export * from './shapeFlags'
export * from './is'
export * from './normalize'

export const mergeProps = normalizeProps

export const cloneVNode = isVue3
  ? Vue.cloneVNode
  : function cloneVNode(
      vnode: any,
      extraProps: Record<string, any> | null = {},
      mergeRef = false
    ): any {
      if (!vnode) return
      if (!extraProps) {
        extraProps = {}
      }

      const cloned = new vnode.constructor(
        vnode.tag,
        vnode.data,
        vnode.children,
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions,
        vnode.asyncFactory
      )

      const data = { ...cloned.data }
      const componentOptions = cloned.componentOptions

      data.scopedSlots = {
        ...data.scopedSlots,
        ...extraProps.scopedSlots
      }
      data.class = normalizeClass(data.class, extraProps.class)
      data.staticClass = normalizeClass(
        data.staticClass,
        extraProps.staticClass
      )
      data.style = normalizeStyle(data.style, extraProps.style)
      data.staticStyle = normalizeClass(
        data.staticStyle,
        extraProps.staticStyle
      )
      data.props = { ...data.props, ...extraProps.props }
      data.attrs = { ...data.attrs, ...extraProps.attrs }
      data.domProps = { ...data.domProps, ...extraProps.domProps }
      data.directives = [
        ...(data.directives || []),
        ...(extraProps.directives || [])
      ]
      data.on = normalizeListeners(data.on, extraProps.on, extraProps.nativeOn)

      data.key = data.key ?? extraProps.key
      cloned.key = cloned.key ?? extraProps.key

      if (componentOptions) {
        componentOptions.propsData = { ...(componentOptions.propsData || {}) }
        componentOptions.listeners = { ...(componentOptions.listeners || {}) }
        componentOptions.propsData = {
          ...componentOptions.propsData,
          ...extraProps.props
        }
        componentOptions.listeners = normalizeListeners(
          componentOptions.listeners as any,
          extraProps.on
        )
        if (extraProps.children) {
          componentOptions.children = extraProps.children
        }
      }

      cloned.data = data
      cloned.componentOptions = componentOptions

      const { ref } = cloned
      cloned.ref = extraProps.ref
        ? mergeRef && ref
          ? isArray(ref)
            ? ref.concat(extraProps.ref)
            : [ref, extraProps.ref]
          : extraProps.ref
        : ref

      return cloned
    }

export function findFirstQualifiedChild(
  vnode: MaybeArray<VNode> | undefined | null,
  qualifier: (vnode: VNode) => boolean
) {
  return findChild<VNode>(vnode, (child) => isObject(child) && qualifier(child))
}

export function findFirstQualifiedElement<T extends Element>(
  children: VNode[] | undefined | null,
  qualifier: (element: Element) => boolean
): T | null | undefined {
  const child = findFirstQualifiedChild(children, (child) => {
    const element = getVNodeElement(child)
    return !!element && qualifier(element)
  })
  return child && getVNodeElement(child)
}

const isRealElement = (element: Element) => element.nodeType === 1

export function useFirstQualifiedElement(
  instance = getCurrentInstance(),
  qualifier = isRealElement
) {
  const elementRef = ref<HTMLElement | null>()

  const updateElement = () => {
    const vnode = isVue3 ? instance?.vnode : (instance as any).proxy?.$vnode
    elementRef.value = findFirstQualifiedElement(vnode, qualifier)
  }

  onMounted(updateElement)
  onUpdated(updateElement)

  if (isVue3 ? instance?.isMounted : (instance as any)?._isMounted) {
    updateElement()
  }

  return elementRef
}
