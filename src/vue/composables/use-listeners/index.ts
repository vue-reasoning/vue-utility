import { getCurrentInstance } from 'vue-demi'

import { noop } from '../../../common'
import {
  createListenerContext,
  emitListener,
  getEmitIfHasListener,
  hasListener,
  ListenerContext
} from '../../options'
import type { AnyHandler, EmitterOptionsType } from '../../options'

export interface UseListenersReturn<Event extends string = string> {
  context: ListenerContext
  emit: {
    (event: Event, ...args: any[]): void
    withOptions: (
      overrideOptions?: EmitterOptionsType
    ) => (event: Event, ...args: any[]) => void
  }
  has: (event: Event, overrideOptions?: EmitterOptionsType) => boolean
  proxy: <T extends AnyHandler = AnyHandler>(
    event: string,
    overrideOptions?: EmitterOptionsType
  ) => T
  proxyIfExists: <T extends AnyHandler = AnyHandler>(
    event: string,
    overrideOptions?: EmitterOptionsType
  ) => T | undefined
}

export function useListeners<Event extends string = string>(
  instance = getCurrentInstance(),
  options: EmitterOptionsType = true
): UseListenersReturn<Event> {
  const context = createListenerContext(instance!)
  if (!context) {
    throw Error('useListenerContext() called without active instance.')
  }

  const createEmit =
    (overrideOptions?: EmitterOptionsType) =>
    (event: Event, ...args: any[]) =>
      emitListener(context, event, overrideOptions ?? options, ...args)

  const emit = createEmit() as UseListenersReturn<Event>['emit']

  emit.withOptions = (options) => createEmit(options)

  const proxyIfExists = <T extends AnyHandler = AnyHandler>(
    event: string,
    overrideOptions?: EmitterOptionsType
  ) => getEmitIfHasListener<T>(context, event, overrideOptions ?? options)

  return {
    context,
    emit,
    has: (event, overrideOptions) =>
      hasListener(context, event, overrideOptions ?? options),
    proxy: <T extends AnyHandler = AnyHandler>(
      event: string,
      overrideOptions?: EmitterOptionsType
    ): T =>
      proxyIfExists<T>(event, overrideOptions) ||
      // Since Vue throws an error on the listener passed in as Nullable,
      // we return it when no listener exists.
      (noop as T),
    proxyIfExists
  }
}
