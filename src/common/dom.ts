import { isObject, isUndef } from './is'

export function isWindow(value: unknown): value is Window {
  return isObject(value) && !!value.window
}

export function getWindow(node: Node | Window): Window & typeof globalThis {
  if (isUndef(node)) {
    return window
  }

  if (!isWindow(node)) {
    const ownerDocument = node.ownerDocument
    return ownerDocument ? ownerDocument.defaultView || window : window
  }

  return node as Window & typeof globalThis
}

export function isHTMLElement(value: any): value is HTMLElement {
  return value instanceof getWindow(value).HTMLElement
}

export function isElement(value: any): value is Element {
  return value instanceof getWindow(value).Element
}

export function isNode(value: any): value is Node {
  return value instanceof getWindow(value).Node
}
