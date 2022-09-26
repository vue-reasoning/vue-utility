import { invokeIfFunction } from '../common'

export type CleanupFn = () => void
export type EffectFn = () => any

export function useManualEffect(effect?: EffectFn, immediate = false) {
  let cleanupFn: (() => void) | void
  let state = 0

  const executeEffect = (overrideEffect?: EffectFn) => {
    cleanupFn = invokeIfFunction(overrideEffect || effect)
    state++
  }

  const clear = () => {
    if (cleanupFn) {
      cleanupFn()
      cleanupFn = undefined
    }
    state = 0
  }

  const reset = (overrideFactory?: EffectFn) => {
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
