import { cacheKeyofFunction, pick, pickBy, toRawType } from 'src'
import type { PropertyName } from 'src'

describe('common > cacheKeyofFunction', () => {
  const createSchrodingerFn = <T extends PropertyName>() => {
    let cat = 0
    return (key: T) => (cat === 0 ? (cat = 1) : (cat = 0))
  }

  const cases = ['', 0, Symbol()]

  cases.forEach((caseKey) => {
    test(`${toRawType(caseKey)} key`, () => {
      const fn = cacheKeyofFunction(createSchrodingerFn<typeof caseKey>())
      expect(fn(caseKey)).toBe(fn(caseKey))
    })
  })
})

describe('common > pickBy', () => {
  const object = {
    foo: 'foo',
    bar: 'bar'
  }

  test('match key', () => {
    expect(pickBy(object, (_, key) => key === 'foo')).toMatchInlineSnapshot(`
      {
        "foo": "foo",
      }
    `)
  })

  test('match value', () => {
    expect(pickBy(object, (value) => value === 'foo')).toMatchInlineSnapshot(`
      {
        "foo": "foo",
      }
    `)
  })
})

describe('common > pick', () => {
  const object = {
    foo: 'foo',
    bar: 'bar'
  }

  test('combined path', () => {
    expect(pick(object)).toMatchInlineSnapshot('{}')
    expect(pick(object, ['foo'], 'bar')).toMatchInlineSnapshot(`
      {
        "bar": "bar",
        "foo": "foo",
      }
    `)
  })
})
