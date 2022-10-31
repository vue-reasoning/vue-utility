import { getCurrentInstance } from 'vue-demi'
import type { VNode } from 'vue-demi'

import { getVNodeElement } from '../../vnode'
import { useCurrentVNode } from '../use-current-vnode'
import { useTransformValue } from '../use-transform-value'

export function useCurrentElement<T extends Element = Element>(
  instance = getCurrentInstance()
) {
  return useTransformValue<VNode | undefined, T | null | undefined>(
    useCurrentVNode(instance),
    (vnode) => vnode && getVNodeElement(vnode)
  )
}
