import type { Ref, WatchSource } from 'vue-demi'

import type { MaybeArray } from '.'

export type MaybeRef<T> = T | Ref<T>

export type Dependency<T = unknown> = MaybeArray<WatchSource<T> | object>
