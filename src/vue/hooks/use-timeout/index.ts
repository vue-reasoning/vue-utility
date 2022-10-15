import { computed, ref } from 'vue-demi'

import { invokeIfFunction } from '../../../common'

export function useTimeout(
  callback?: () => void,
  ms?: number,
  immediate = false
) {
  const timeoutIdRef = ref<NodeJS.Timeout | number>()

  const createTimeout = (callback?: () => void, ms?: number) => {
    if (!ms) {
      invokeIfFunction(callback)
    } else {
      timeoutIdRef.value = setTimeout(() => {
        invokeIfFunction(callback)
        clear()
      }, ms)
    }
  }

  const clear = () => {
    const { value: timeoutId } = timeoutIdRef
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutIdRef.value = undefined
    }
  }

  const reset = (overrideCallback?: () => void, overrideMs?: number) => {
    clear()

    const finalCallback = overrideCallback || callback
    const finalMs = overrideMs ?? ms

    createTimeout(finalCallback, finalMs)
    return clear
  }

  const ensure = () => {
    if (!timeoutIdRef.value) {
      createTimeout(callback, ms)
    }
  }

  if (immediate) {
    createTimeout(callback, ms)
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
