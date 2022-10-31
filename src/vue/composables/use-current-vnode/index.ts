import {
  ComputedRef,
  getCurrentInstance,
  isVue3,
  onMounted,
  onUpdated,
  VNode
} from 'vue-demi'

import { useMemo } from '../use-memo'
import { useTick } from '../use-tick'

export function useCurrentVNode<T extends VNode = VNode>(
  instance = getCurrentInstance()
): ComputedRef<T | undefined> {
  const [track, trigger] = useTick()

  const vnodeRef = useMemo<T | undefined>(
    () => (isVue3 ? instance?.vnode : (instance as any).proxy?.$vnode),
    track
  )

  onMounted(trigger, instance)
  onUpdated(trigger, instance)

  return vnodeRef
}
