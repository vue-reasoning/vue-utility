import { invokeIfFunction } from '../common'

type OnCleanup = (cleanupFn: () => void) => void

export type EffectCallback = (onCleanup: OnCleanup) => void | (() => void)

export function useManualEffect(effect?: EffectCallback, immediate = false) {
  let cleanup: (() => void) | undefined
  let state = 0

  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = fn
  }

  const executeEffect = (overrideEffect?: EffectCallback) => {
    const maybeCleanup = invokeIfFunction(overrideEffect || effect, onCleanup)
    if (!cleanup && maybeCleanup) {
      cleanup = maybeCleanup
    }
    state++
  }

  const clear = () => {
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
    state = 0
  }

  const reset = (overrideFactory?: EffectCallback) => {
    clear()
    executeEffect(overrideFactory)
  }

  const mesure = () => {
    if (!state) {
      executeEffect()
    }
  }

  if (immediate) {
    executeEffect()
  }

  return {
    clear,
    reset,
    mesure
  }
}

export type UseManaualEffectReturn = ReturnType<typeof useManualEffect>
