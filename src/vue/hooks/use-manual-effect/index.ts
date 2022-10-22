import { ref } from 'vue-demi'

import { invoke, isDef, isFunction } from '../../../common'
import { useTransformValue } from '../use-transform-value'

export type OnCleanup = (cleanupFn: () => void) => void

export type EffectCallback = (
  onCleanup: OnCleanup,
  ...args: any[]
) => void | (() => void)

export function useManualEffect(cb?: EffectCallback, immediate = false) {
  let args: any[] = []
  let cleanup: (() => void) | undefined

  const stateRef = ref(0)

  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = fn
  }

  const run = () => {
    const maybeCleanup = invoke(cb, onCleanup, ...args)
    if (!cleanup && maybeCleanup) {
      cleanup = maybeCleanup
    }
    stateRef.value++
  }

  const clear = () => {
    invoke(cleanup)
    cleanup = undefined
    stateRef.value = 0
  }

  const reset = (overrideCb?: EffectCallback, ...overrideArgs: any[]) => {
    if (isDef(overrideCb)) {
      cb = overrideCb
      args = overrideArgs
    }

    clear()
    run()
  }

  const ensure = () => {
    if (!stateRef.value) {
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
    hasEffect: useTransformValue(stateRef, Boolean),
    /**
     * @deprecated typo
     */
    mesure: ensure
  }
}

export type UseManaualEffectReturn = ReturnType<typeof useManualEffect>
