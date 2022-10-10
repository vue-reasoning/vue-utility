import { createCommentVNode, h } from 'vue-demi'

import {
  hasArrayChildren,
  isComment,
  isElement,
  mergeProps,
  normalizeListenerKeys,
  normalizeListeners
} from 'src'

describe('vnode > is', () => {
  test('isElement', () => {
    expect(isElement(h('div'))).toBe(true)
  })
  test('isComponent', () => {
    expect(isComment(createCommentVNode(''))).toBe(true)
  })
  test('hasArrayChildren', () => {
    expect(hasArrayChildren(h('div', null, [h('span')]))).toBe(true)
    expect(hasArrayChildren(h('div', null))).toBe(false)
  })
})

describe('vnode > normalize', () => {
  test('normalizeListeners', () =>
    expect(
      normalizeListeners(
        {
          onClick: () => {}
        },
        {
          onClick: () => {}
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "onClick": [
          [Function],
          [Function],
        ],
      }
    `))

  test('normalizeListenerKeys', () =>
    expect(
      normalizeListenerKeys({
        onClick: () => {},
        onMouseLeave: () => {}
      })
    ).toMatchInlineSnapshot(`
      {
        "click": [Function],
        "mouseLeave": [Function],
      }
    `))

  test('mergeProps', () =>
    expect(
      mergeProps(
        {
          class: ['a', 'b'],
          style: {
            foo: 1,
            bar: 2
          },
          o: 1,
          onClick: () => {}
        },
        {
          class: 'c',
          style: {
            baz: 3
          },
          o: 2,
          onClick: () => {}
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "class": "a b c",
        "o": 2,
        "onClick": [
          [Function],
          [Function],
        ],
        "style": {
          "bar": 2,
          "baz": 3,
          "foo": 1,
        },
      }
    `))
})
