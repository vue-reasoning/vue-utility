import { getCurrentInstance, onUpdated } from 'vue-demi'

import { emitListener, getHandler, hasListener } from '../../options'
import type { AnyHandler } from '../../options'
import { useTick } from '../use-tick'

export interface UseListenersReturn {
  emit: {
    (event: string, ...args: any[]): void
    withOptions: (
      ignoreFormat?: boolean
    ) => (event: string, ...args: any[]) => void
  }
  has: (event: string, ignoreFormat?: boolean) => boolean
  proxy: <T extends AnyHandler = AnyHandler>(
    event: string,
    ignoreFormat?: boolean
  ) => T
  proxyIfExists: <T extends AnyHandler = AnyHandler>(
    event: string,
    ignoreFormat?: boolean
  ) => T | undefined
}

export function useListeners(
  instance = getCurrentInstance(),
  ignoreFormat = true
): UseListenersReturn {
  if (!instance) {
    throw Error('useListenerContext() called without active instance.')
  }

  const [track, trigger] = useTick()

  onUpdated(trigger, instance)

  const createEmit =
    (_ignoreFormat = ignoreFormat) =>
    (event: string, ...args: any[]) =>
      emitListener(instance, event, _ignoreFormat, ...args)

  const emit = createEmit() as UseListenersReturn['emit']

  emit.withOptions = (options) => createEmit(options)

  return {
    emit,

    has: (event, _ignoreFormat = ignoreFormat) => {
      track()
      return hasListener(instance, event, _ignoreFormat)
    },

    proxy: <T extends AnyHandler = AnyHandler>(
      event: string,
      _ignoreFormat = ignoreFormat
    ): T =>
      ((...args: any[]) =>
        emitListener(instance, event, _ignoreFormat, ...args)) as T,

    proxyIfExists: <T extends AnyHandler = AnyHandler>(
      event: string,
      _ignoreFormat = ignoreFormat
    ) => {
      track()
      return getHandler<T>(instance, event, _ignoreFormat)
    }
  }
}
