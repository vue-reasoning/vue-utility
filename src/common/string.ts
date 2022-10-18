export { camelize, hyphenate } from '@vue/shared'

export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function lowerFirst(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function isNullOrEmpty(str: string) {
  return !str || !str.trim()
}
