import {
  cacheKeyofFunction,
  omit,
  partition,
  pick,
  pickBy,
  toRawType
} from 'src'
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

describe('common > omit', () => {
  const object = {
    foo: 'foo',
    bar: 'bar'
  }

  test('combined path', () => {
    expect(omit(object)).toMatchInlineSnapshot(`
      {
        "bar": "bar",
        "foo": "foo",
      }
    `)
    expect(omit(object, ['foo'], 'bar')).toMatchInlineSnapshot('{}')
  })
})

describe('common > partition', () => {
  test('array', () => {
    expect(
      partition(
        [
          { user: 'barney', age: 36, active: false },
          { user: 'fred', age: 40, active: true },
          { user: 'pebbles', age: 1, active: false }
        ],
        ({ active }) => active
      )
    ).toMatchInlineSnapshot(`
      [
        [
          {
            "active": true,
            "age": 40,
            "user": "fred",
          },
        ],
        [
          {
            "active": false,
            "age": 36,
            "user": "barney",
          },
          {
            "active": false,
            "age": 1,
            "user": "pebbles",
          },
        ],
      ]
    `)
  })

  test('object', () => {
    expect(
      partition(
        {
          foo: 1,
          bar: 2
        },
        (num) => num >= 2
      )
    ).toMatchInlineSnapshot(`
      [
        [
          2,
        ],
        [
          1,
        ],
      ]
    `)
  })
})
