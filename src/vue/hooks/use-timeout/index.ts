import { computed, ref } from 'vue-demi'

import { invokeIfFunction } from '../../../common'

export function useTimeout(
  fn?: () => void,
  timeout?: number,
  immediate = false
) {
  const timeoutIdRef = ref<NodeJS.Timeout | number>()

  const createTimeout = (fn?: () => void, timeout?: number) => {
    if (!timeout) {
      invokeIfFunction(fn)
    } else {
      timeoutIdRef.value = setTimeout(() => {
        invokeIfFunction(fn)
        clear()
      }, timeout)
    }
  }

  const clear = () => {
    const { value: timeoutId } = timeoutIdRef
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutIdRef.value = undefined
    }
  }

  const reset = (overrideFn?: () => void, overrideTimeout?: number) => {
    clear()

    const currentFn = overrideFn || fn
    const currentTimeout = overrideTimeout ?? timeout
    createTimeout(currentFn, currentTimeout)

    return clear
  }

  const ensure = () => {
    if (!timeoutIdRef.value) {
      createTimeout(fn, timeout)
    }
  }

  if (immediate) {
    createTimeout(fn, timeout)
  }

  return {
    isPending: computed(() => !!timeoutIdRef.value),
    clear,
    reset,
    ensure,
    /**
     * @deprecated typo
     */
    mesure: ensure
  }
}

export type UseTimeoutReturn = ReturnType<typeof useTimeout>
