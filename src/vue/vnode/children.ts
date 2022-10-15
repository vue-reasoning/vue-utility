import type { VNode } from 'vue'
import { isVue3 } from 'vue-demi'

import { isUndef, toArray } from '../../common'
import type { MaybeArray } from '../../common'
import { hasArrayChildren } from './is'

export type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void

export function forEachChildren(
  vnode: MaybeArray<VNode> | undefined | null,
  callbackfn: (child: VNodeChildAtom, breakEach: () => void) => void
) {
  if (!vnode) return

  let isBreaked = false

  const breakEach = () => (isBreaked = true)

  const each = (children: VNode[]) => {
    for (const child of children) {
      if (isUndef(child)) continue

      callbackfn(child, breakEach)
      if (isBreaked) return

      if (isVue3) {
        if (child.component?.subTree) {
          each([child.component.subTree])
          continue
        }
      }
      if (hasArrayChildren(child)) {
        each(child.children as VNode[])
      }
    }
  }

  each(toArray(vnode))
}

export function findChild<T extends VNodeChildAtom>(
  vnode: MaybeArray<VNode> | undefined | null,
  predicate: (child: VNodeChildAtom) => child is T
): T | null
export function findChild<T extends VNodeChildAtom>(
  vnode: MaybeArray<VNode> | undefined | null,
  predicate: (child: VNodeChildAtom) => boolean
): T | null
export function findChild<T extends VNodeChildAtom = VNodeChildAtom>(
  vnode: MaybeArray<VNode> | undefined | null,
  predicate: (child: VNodeChildAtom) => boolean
): T | null {
  let ret: T | null = null

  forEachChildren(vnode, (child, breakEach) => {
    if (predicate(child)) {
      ret = child as T
      breakEach()
    }
  })

  return ret
}
