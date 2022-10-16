export {
  isArray,
  isDate,
  isFunction,
  isIntegerKey,
  isObject,
  isPlainObject,
  isPromise,
  isSet,
  isString,
  isSymbol,
  toRawType,
  toTypeString
} from '@vue/shared'

export function isNumber(v: any): v is number {
  return typeof v === 'number'
}

export function isTrue(v: any): v is true {
  return v === true
}

export function isFlase(v: any): v is false {
  return v === false
}

export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null
}

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}
