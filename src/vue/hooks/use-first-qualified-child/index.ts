import { getCurrentInstance, isVue3, onMounted, onUpdated, ref } from 'vue-demi'
import type { VNode } from 'vue-demi'

import type { MaybeRef } from '../../types'
import { findFirstQualifiedChild } from '../../vnode'
import { isDef } from '../../../common'
import { useEffect } from '../use-effect'
import { useTick } from '../use-tick'

export type ChildQualifier = (child: VNode) => boolean

export function useFirstQualifiedChild(
  instance = getCurrentInstance(),
  qualifier: MaybeRef<ChildQualifier>
) {
  const childRef = ref<VNode | null>(null)

  const updateChild = (qualifier: ChildQualifier) => {
    const child = isVue3 ? instance?.vnode : (instance as any).proxy?.$vnode
    const qualified = child && findFirstQualifiedChild(child, qualifier)
    childRef.value = isDef(qualified) ? qualified : null
  }

  // we update the child after the component update
  const [track, trigger] = useTick()

  onMounted(trigger)
  onUpdated(trigger)

  useEffect(
    (_, [qualifier]) => updateChild(qualifier as ChildQualifier),
    [qualifier, track]
  )

  return childRef
}
