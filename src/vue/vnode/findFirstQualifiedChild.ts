import {
  computed,
  getCurrentInstance,
  isVue3,
  onMounted,
  onUpdated,
  ref
} from 'vue-demi'
import type { VNode } from 'vue-demi'
import { isDef, isObject } from '../../common'
import type { MaybeArray } from '../../common'
import { findChild } from './children'
import { getVNodeElement } from './get'

export function findFirstQualifiedChild(
  vnode: MaybeArray<VNode> | undefined | null,
  qualifier: (vnode: VNode) => boolean
) {
  return findChild<VNode>(vnode, (child) => isObject(child) && qualifier(child))
}

const isRealElement = (element: Element) => element.nodeType === 1

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

export function useFirstQualifiedChild(
  instance = getCurrentInstance(),
  qualifier: (vnode: VNode) => boolean
) {
  const childRef = ref<VNode | null>(null)

  const updateChild = () => {
    const vnode = isVue3 ? instance?.vnode : (instance as any).proxy?.$vnode
    const qualified = vnode && findFirstQualifiedChild(vnode, qualifier)
    childRef.value = isDef(qualified) ? qualified : null
  }

  onMounted(updateChild)
  onUpdated(updateChild)

  updateChild()

  return childRef
}

export function useFirstQualifiedElement(
  instance = getCurrentInstance(),
  qualifier = isRealElement
) {
  const childRef = useFirstQualifiedChild(instance, (vnode) => {
    const element = getVNodeElement(vnode)
    return !!element && qualifier(element)
  })
  return computed(() =>
    childRef.value ? getVNodeElement(childRef.value) : null
  )
}
