import { computed, ref } from 'vue-demi'

export function useTimeout(
  fn: () => void,
  timeout?: number,
  immediate = false
) {
  const timeoutIdRef = ref<NodeJS.Timeout | number>()

  const createTimeout = (fn: () => void, timeout?: number) => {
    if (!timeout) {
      fn()
    } else {
      timeoutIdRef.value = setTimeout(() => {
        fn()
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

  const mesure = () => {
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
    mesure
  }
}

export type UseTimeoutReturn = ReturnType<typeof useTimeout>
