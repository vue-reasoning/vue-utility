import { getCurrentInstance, isVue3 } from 'vue-demi'

import { isArray, noop, proxyFunction, upperFirst } from '../../../common'
import { parseEvent, toHandlerKey } from './transform'

export * from './isHandlerKey'
export * from './transform'

type ComponentInternalInstance = Pick<
  NonNullable<ReturnType<typeof getCurrentInstance>>,
  'proxy'
>

interface LegacyComponentInstanceParital {
  $listeners?: Record<string, Function | Function[]>
}

type CompatComponentPublicInstance = NonNullable<
  ComponentInternalInstance['proxy']
> &
  LegacyComponentInstanceParital

export type ListenerContext = {
  emit: CompatComponentPublicInstance['$emit']
  props: CompatComponentPublicInstance['$props']
  listeners?: Record<string, Function | Function[]>
}

export type CompatListenerContext =
  | ListenerContext
  | Pick<CompatComponentPublicInstance, '$emit' | '$props' | '$listeners'>

export function createListenerContext(
  instance = getCurrentInstance()
): ListenerContext | null {
  return instance?.proxy ? normalizeListenerContext(instance.proxy) : null
}

function normalizeListenerContext(ctx: CompatListenerContext): ListenerContext {
  if ('emit' in ctx) {
    return ctx
  }
  return {
    emit: proxyFunction(ctx, '$emit'),
    props: ctx.$props,
    listeners: ctx.$listeners
  }
}

export interface EmitterOptions {
  /**
   * Whether to ignore the event format.
   *
   * If it is true, it will use the `caramelize` and `hyphenate` forms  to match.
   * Otherwise, it will use the form after eliminating the on.
   *
   * @default false
   */
  ignoreFormat?: boolean
}

export type EmitterOptionsType = boolean | EmitterOptions | null | undefined

export type Handler = Function | Function[]

export function normalizeHandler(
  ...handlers: Array<Handler | null | undefined>
) {
  return handlers.reduce<Function[]>((normalized, handler) => {
    if (handler && (isArray(handler) || !normalized.includes(handler))) {
      return normalized.concat(handler).flat()
    }
    return normalized
  }, [])
}

type AnyHandler = (...args: any[]) => void

export function getEmitIfHasListener<T extends AnyHandler = AnyHandler>(
  ctx: CompatListenerContext,
  event: string,
  options?: EmitterOptionsType
): T | undefined {
  const context = normalizeListenerContext(ctx)
  const parsed = parseEvent(event)

  let handler: Handler | undefined
  let props: Record<string, any> | undefined

  if (isVue3 && (props = context.props)) {
    handler =
      props[toHandlerKey(parsed.origin)] ||
      props[toHandlerKey(parsed.camelize)] ||
      props[toHandlerKey(upperFirst(parsed.hyphenate))]
  } else if ((props = context.listeners)) {
    handler = props[parsed.origin]
    // ignore formatting
    const ignoreFormat = !!(typeof options === 'boolean'
      ? options
      : options?.ignoreFormat)
    if (
      ignoreFormat &&
      (!handler || (Array.isArray(handler) && handler.length === 0))
    ) {
      handler = props[parsed.camelize] || props[upperFirst(parsed.hyphenate)]
    }
  }

  if (typeof handler === 'function') {
    return handler as T
  } else if (isArray(handler) && handler.length) {
    return ((...args) =>
      (handler as Function[]).forEach((handler) => handler(...args))) as T
  }
}

export function hasListener(
  ctx: CompatListenerContext,
  event: string,
  options?: EmitterOptionsType
) {
  return !!getEmitIfHasListener(ctx, event, options)
}

export function emitListener(
  ctx: CompatListenerContext,
  event: string,
  options?: EmitterOptionsType,
  ...args: any[]
) {
  getEmitIfHasListener(ctx, event, options)?.(...args)
}

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
