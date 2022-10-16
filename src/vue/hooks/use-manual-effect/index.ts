import { ref } from 'vue-demi'

import { invokeIfFunction, isFunction } from '../../../common'
import { useTransformValue } from '../use-transform-value'

export type OnCleanup = (cleanupFn: () => void) => void

export type EffectCallback = (onCleanup: OnCleanup) => void | (() => void)

export function useManualEffect(callback?: EffectCallback, immediate = false) {
  let cleanup: (() => void) | undefined
  const stateRef = ref(0)

  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = fn
  }

  const run = (callback?: EffectCallback) => {
    const maybeCleanup = invokeIfFunction(callback, onCleanup)
    if (!cleanup && maybeCleanup) {
      cleanup = maybeCleanup
    }
    stateRef.value++
  }

  const clear = () => {
    isFunction(cleanup) && cleanup()
    cleanup = undefined
    stateRef.value = 0
  }

  const reset = (override?: EffectCallback) => {
    clear()
    run(override ?? callback)
  }

  const ensure = () => {
    if (!stateRef.value) {
      run(callback)
    }
  }

  if (immediate) {
    run(callback)
  }

  return {
    clear,
    reset,
    ensure,
    hasEffect: useTransformValue(stateRef, Boolean),
    /**
     * @deprecated typo
     */
    mesure: ensure
  }
}

export type UseManaualEffectReturn = ReturnType<typeof useManualEffect>
