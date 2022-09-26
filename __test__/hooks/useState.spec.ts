import { useState } from 'src'

describe('hooks > useState', () => {
  it('initial value', () => {
    expect(useState(1).value).toBe(1)
  })

  it('initial value factory', () => {
    expect(typeof useState(() => 1).value).toBe('function')
    expect(useState(() => 1, true).value).toBe(1)
  })
})
