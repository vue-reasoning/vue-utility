import { isOn } from '@vue/shared'

export { isOn as isHandlerKey } from '@vue/shared'

export const isHandlerKeyStrict = (key: string): key is `on${string}` =>
  isOn(key)
