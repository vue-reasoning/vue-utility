import { computed, defineComponent, inject, provide } from 'vue-demi'
import type { ComputedRef, DefineComponent, InjectionKey, Ref } from 'vue-demi'

import { definePropOptions } from '../../options'

export interface UseContextValue<T> {
  (): ComputedRef<T | undefined>
  (defaultValue: T, treatDefaultAsFactory?: false): ComputedRef<T>
  (defaultValue: T | (() => T), treatDefaultAsFactory: true): ComputedRef<T>
}

interface ProviderProps<T> {
  value: T
}

export interface Context<T = any> {
  Provider: DefineComponent<ProviderProps<T>>
  Consumer: DefineComponent
  useContextValue: UseContextValue<T>
}

export interface UseContext {
  <T>(context: Context<T>): ComputedRef<T | undefined>
  <T>(
    context: Context<T>,
    defaultValue: T,
    treatDefaultAsFactory?: false
  ): ComputedRef<T>
  <T>(
    context: Context<T>,
    defaultValue: T | (() => T),
    treatDefaultAsFactory: true
  ): ComputedRef<T>
}

export const useContext = ((context) => context.useContextValue()) as UseContext

export function createContext<T = any>(defaultValue?: T): Context<T> {
  const contextKey = Symbol() as InjectionKey<Ref<T>>

  const useContextValue = inject.bind(
    null,
    contextKey
  ) as Context<T>['useContextValue']

  const Provider = defineComponent({
    name: 'Provider',
    props: {
      value: definePropOptions<T>().def(defaultValue).isRequired
    },
    setup(props, { slots }) {
      provide(
        contextKey,
        computed(
          () => (props as ProviderProps<T>).value ?? defaultValue
        ) as ComputedRef<T>
      )
      return () => slots.default?.()
    }
  })

  const Consumer = defineComponent({
    name: 'Consumer',
    setup(_, { slots }) {
      const valueRef = useContextValue()
      return () => slots.default?.(valueRef.value)
    }
  })

  return {
    Provider,
    Consumer,
    useContextValue
  } as unknown as Context<T>
}
