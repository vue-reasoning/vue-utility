import * as Vue from 'vue'
import { isVue3, VNode } from 'vue-demi'

import { ShapeFlags } from './shapeFlags'
import {
  isElement as V2IsElement,
  isComponent as V2IsComponent,
  isComment as V2IsCommt,
  isText as V2IsText
} from './is.v2'

export function isElement(vnode: VNode) {
  return isVue3 ? !!(vnode.shapeFlag & ShapeFlags.ELEMENT) : V2IsElement(vnode)
}

export function isComponent(vnode: VNode) {
  return isVue3
    ? !!(vnode.shapeFlag & ShapeFlags.COMPONENT)
    : V2IsComponent(vnode)
}

export function isComment(vnode: VNode) {
  return isVue3 ? vnode.type === Vue.Comment : V2IsCommt(vnode)
}

export function isFragment(vnode: VNode) {
  return isVue3 && vnode.type === Vue.Fragment
}

export function isText(vnode: VNode) {
  return isVue3 ? vnode.type === Vue.Text : V2IsText(vnode)
}

export function hasArrayChildren(vnode: VNode) {
  return isVue3
    ? !!(vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN)
    : !!vnode.children?.length
}
