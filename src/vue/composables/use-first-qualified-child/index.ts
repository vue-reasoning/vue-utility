import { getCurrentInstance, unref } from 'vue-demi'
import type { VNode } from 'vue-demi'

import type { MaybeRef } from '../../types'
import { findFirstQualifiedChild } from '../../vnode'
import { always } from '../../../common'
import { useCurrentVNode } from '../use-current-vnode'
import { useMemo } from '../use-memo'

export type ChildQualifier = (child: VNode) => boolean

export function useFirstQualifiedChild<T extends VNode>(
  instance = getCurrentInstance(),
  qualifier: MaybeRef<ChildQualifier> = always
) {
  const currentVNodeRef = useCurrentVNode<T>(instance)
  return useMemo(
    () => findFirstQualifiedChild(currentVNodeRef.value, unref(qualifier)),
    [currentVNodeRef, qualifier]
  )
}
