import { invokeIfFunction, isFunction } from '../../../common'

export type OnCleanup = (cleanupFn: () => void) => void

export type EffectCallback = (onCleanup: OnCleanup) => void | (() => void)

export function useManualEffect(callback?: EffectCallback, immediate = false) {
  let cleanup: (() => void) | undefined
  let state = 0

  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = fn
  }

  const run = (callback?: EffectCallback) => {
    const maybeCleanup = invokeIfFunction(callback, onCleanup)
    if (!cleanup && maybeCleanup) {
      cleanup = maybeCleanup
    }
    state++
  }

  const clear = () => {
    isFunction(cleanup) && cleanup()
    cleanup = undefined
    state = 0
  }

  const reset = (override?: EffectCallback) => {
    clear()
    run(override ?? callback)
  }

  const ensure = () => {
    if (!state) {
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
    /**
     * @deprecated typo
     */
    mesure: ensure
  }
}

export type UseManaualEffectReturn = ReturnType<typeof useManualEffect>
