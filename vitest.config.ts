import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    reporters: 'dot',
    deps: {
      inline: ['vue-demi']
    }
  }
})
