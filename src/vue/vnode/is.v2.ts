import { isDef, isObject, isString } from '../../common'

export function isElement(vnode: any): boolean {
  return isObject(vnode) && isDef(vnode.tag) && !isComponent(vnode)
}

export function isComponent(vnode: any): boolean {
  return (
    isObject(vnode) && (vnode.componentOptions || !isAsyncPlaceholder(vnode))
  )
}

export function isComment(vnode: any): boolean {
  return isObject(vnode) && vnode.isComment
}

export function isText(vnode: any): boolean {
  return isString(vnode) || (isObject(vnode) && !vnode.tag && !isComment(vnode))
}

export function isAsyncPlaceholder(vnode: any): boolean {
  return isObject(vnode) && vnode.isComment && vnode.asyncFactory
}
