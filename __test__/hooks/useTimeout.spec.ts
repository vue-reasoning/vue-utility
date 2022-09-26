import { useTimeout } from 'src'

describe('hooks > useTimeout', () => {
  it('immediate false', async () => {
    const fn = vi.fn()
    useTimeout(fn)
    expect(fn).not.toHaveBeenCalled()
  })

  it('immediate true', async () => {
    const fn = vi.fn()
    useTimeout(fn, undefined, true)
    expect(fn).toHaveBeenCalled()
  })
})
