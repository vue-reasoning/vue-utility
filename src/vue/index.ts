import { inject, InjectionKey } from 'vue-demi'

export * from './hooks'
export * from './options'
export * from './vnode'

export function safeInject<T>(key: InjectionKey<T> | string): T | undefined {
  const EMPTY_VALUE = {} as any
  const value = inject<T>(key, EMPTY_VALUE)
  return value === EMPTY_VALUE ? undefined : value
}
