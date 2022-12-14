import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  treeshake: true,
  format: ['cjs', 'esm'],
  dts: true,
  external: ['vue', 'vue-demi']
}
