import {
  getCurrentInstance,
  isVue3,
  onMounted,
  onUpdated,
  ref,
  watch
} from 'vue-demi'
import type { Ref, VNode } from 'vue-demi'

import type { MaybeRef } from '../../types'
import { findFirstQualifiedChild } from '../../vnode'
import { always } from '../../../common'
import { useTick } from '../use-tick'

export type ChildQualifier = (child: VNode) => boolean

export function useFirstQualifiedChild<T extends VNode>(
  instance = getCurrentInstance(),
  qualifier: MaybeRef<ChildQualifier> = always
) {
  const childRef = ref(null) as Ref<T | null>

  const getRootChild = () =>
    isVue3 ? instance?.vnode : (instance as any).proxy?.$vnode

  const updateChild = (qualifier: ChildQualifier) => {
    const child = getRootChild()
    childRef.value = child ? findFirstQualifiedChild<T>(child, qualifier) : null
  }

  // we update the child after the component update
  const [track, trigger] = useTick()

  onMounted(trigger)
  onUpdated(trigger)

  watch(
    [qualifier, track],
    ([qualifier]) => {
      updateChild(qualifier as ChildQualifier)
    },
    {
      immediate: true
    }
  )

  return childRef
}
