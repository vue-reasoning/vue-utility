import { computed, getCurrentInstance, unref } from 'vue-demi'

import type { MaybeRef } from '../../types'
import { getVNodeElement } from '../../vnode'
import { useFirstQualifiedChild } from '../use-first-qualified-child'

export type ElementQualifier = (element: Element) => boolean

const isRealElement = (element: Element) => element.nodeType === 1

export function useFirstQualifiedElement(
  instance = getCurrentInstance(),
  qualifier: MaybeRef<ElementQualifier> = isRealElement
) {
  const childRef = useFirstQualifiedChild(instance, (child) => {
    const element = getVNodeElement(child)
    return !!element && unref(qualifier)(element)
  })

  return computed(() =>
    childRef.value ? getVNodeElement(childRef.value) : null
  )
}
