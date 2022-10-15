export function createPromise<T = void>(): {
  resolve: (resolvedData: T | PromiseLike<T>) => void
  promise: Promise<T>
} {
  let resolve: (resolvedData: T | PromiseLike<T>) => void = () => {}
  const promise = new Promise<T>((r) => (resolve = r))
  return {
    resolve,
    promise
  }
}
