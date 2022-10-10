import { isVue3 } from 'vue-demi'
import type { VNode } from 'vue-demi'

export function getVNodeElement<T extends Element>(
  vnode: VNode
): T | null | undefined {
  return isVue3 ? vnode.el : (vnode as any).elm
}

export function getVNodeType(vnode: VNode): any {
  return isVue3 ? vnode.type : (vnode as any).tag
}
