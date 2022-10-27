import { isVue3, readonly } from 'vue-demi'
import type { Ref } from 'vue-demi'

import { hasOwn } from '../../../common'

export function useExposedProxy<
  T extends Record<string, any>,
  K extends keyof T
>(exposedRef: Ref<T>, exposedKeys?: K[]): Readonly<Pick<T, K>>
export function useExposedProxy<
  T extends Record<string, any>,
  K extends keyof T
>(
  exposedRef: Ref<T | undefined | null>,
  exposedKeys?: K[]
): Readonly<Partial<Pick<T, K>>>
export function useExposedProxy<
  T extends Record<string, any>,
  K extends keyof T
>(exposedRef: Ref<T | undefined | null>, exposedKeys?: K[]) {
  const exposedProxy = {} as Pick<T, K>

  const get = (key: string | symbol) => {
    const { value: exposed } = exposedRef
    if (!exposed) {
      console.error('[useExposedProxy]: `exposedRef` is not assigned.')
      return
    }
    if (!hasOwn(exposed, key)) {
      console.error(`[useExposedProxy]: "${String(key)}" is not expose.`)
      return
    }
    return exposed[key]
  }

  if (isVue3) {
    return readonly(
      new Proxy(exposedProxy, {
        get(target, key) {
          return get(key)
        }
      })
    )
  } else if (exposedKeys) {
    Object.keys(exposedKeys).forEach((key) => {
      Object.defineProperty(exposedProxy, key, {
        get() {
          return get(key)
        }
      })
    })
  }

  return readonly(exposedProxy)
}
