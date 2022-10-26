import { inject } from 'vue-demi'
import type { InjectionKey } from 'vue-demi'

export * from './composables'
export * from './options'
export * from './reactivity'
export * from './vnode'
export * from './types'

export function safeInject<T>(key: InjectionKey<T> | string): T | undefined {
  const EMPTY_VALUE = {} as any
  const value = inject<T>(key, EMPTY_VALUE)
  return value === EMPTY_VALUE ? undefined : value
}
