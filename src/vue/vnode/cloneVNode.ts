import * as Vue from 'vue'
import { isVue3 } from 'vue-demi'

import { isArray } from '../../common'
import { normalizeClass, normalizeListeners, normalizeStyle } from './normalize'

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
