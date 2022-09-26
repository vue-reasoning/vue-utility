import { isVue3, getCurrentInstance } from 'vue-demi'
import { camelize, hyphenate, isOn as isHandlerKey } from '@vue/shared'

export { camelize, hyphenate, isHandlerKey }

/**
 * @example
 * ```ts
 * camelize('xxx') -> 'Xxx'
 * ```
 */
export const upperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @example
 * ```ts
 * camelize('ZZZ') -> 'zZZ'
 * ```
 */
export const lowerFirst = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * Capitalize the first letter and add `'on'` at the top.
 *
 * @example
 * ```ts
 * toHandlerKey('eventTrigger') -> 'onEventTrigger'
 * ```
 */
export const toHandlerKey = (event: string) => {
  return event ? `on${upperFirst(event)}` : event
}

/**
 * Lowercase the first letter and remove the leading `'on'`.
 *
 * @example
 * ```ts
 * toListenerKey('onEventTrigger') -> 'eventTrigger'
 * ```
 */
export function toListenerKey(event: string) {
  if (isHandlerKey(event)) {
    event = event.slice(2)
    if (event.startsWith('-')) event = event.slice(1)
    return lowerFirst(event)
  }
  return event
}

//
// Event ==================================
//

type ExtractFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

function proxyFunction<
  T extends Record<string, any>,
  K extends ExtractFunctionKeys<T>
>(host: T, emitKey: K): T[K] {
  return ((...args: Parameters<T[K]>) => {
    return host[emitKey](...args)
  }) as T[K]
}

export interface EventParsed {
  origin: string
  camelize: string
  hyphenate: string
}

const parsedCache = new Map<string, EventParsed>()

/**
 * @example
 * ```ts
 * parseEvent('onCourierArrives') -> {
 *  origin:    'courierArrives', // like `toListenerKey`
 *  camelize:  'courierArrives',
 *  hyphenate: 'courier-arrives'
 * }
 * ```
 */
export function parseEvent(event: string) {
  if (parsedCache.has(event)) {
    return parsedCache.get(event)!
  }

  const origin = toListenerKey(event)

  if (parsedCache.has(origin)) {
    return parsedCache.get(origin)!
  }

  return {
    origin,
    camelize: camelize(origin),
    hyphenate: hyphenate(origin)
  }
}

export type ComponentInternalInstance = Pick<
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

export function createListenerContext(
  instance = getCurrentInstance()
): ListenerContext | null {
  return instance?.proxy ? normalizeListenerContext(instance.proxy) : null
}

type Handler = Function | Function[]

type AnyHandler = (...args: any[]) => void

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
  } else if (Array.isArray(handler) && handler.length) {
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
}

export const EMPTY_LISTENER_PROXY = () => {}

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

  return {
    context,
    emit,
    has: (event, overrideOptions) =>
      hasListener(context, event, overrideOptions ?? options),
    proxy: <T extends AnyHandler = AnyHandler>(
      event: string,
      overrideOptions?: EmitterOptionsType
    ): T =>
      getEmitIfHasListener(context, event, overrideOptions ?? options) ||
      // Since Vue throws an error on the listener passed in as Nullable,
      // we return it when no listener exists.
      (EMPTY_LISTENER_PROXY as T)
  }
}
