export function safeIdentity<T>(value: T): T {
  return value
}

export interface Identity {
  (): undefined
  <T>(value: T): T
}

export const identity = safeIdentity as Identity
