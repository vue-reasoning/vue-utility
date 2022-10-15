import { useState } from 'src'

describe('hooks > useState', () => {
  it('initial value', () => {
    expect(useState(1).value).toBe(1)
    expect(useState(() => 1).value).toBe(1)
  })
})
