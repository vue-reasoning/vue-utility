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

export function getDocument(node: Node) {
  return node.ownerDocument ?? document
}
