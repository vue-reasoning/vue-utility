import { invokeIfFunction, isFunction } from '../../../common'

type OnCleanup = (cleanupFn: () => void) => void

export type EffectCallback = (onCleanup: OnCleanup) => void | (() => void)

export function useManualEffect(callback?: EffectCallback, immediate = false) {
  let cleanup: (() => void) | undefined
  let state = 0

  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = fn
  }

  const run = (override?: EffectCallback) => {
    const maybeCleanup = invokeIfFunction(override || callback, onCleanup)
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
    run(override)
  }

  const ensure = () => {
    if (!state) {
      run()
    }
  }

  if (immediate) {
    run()
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
