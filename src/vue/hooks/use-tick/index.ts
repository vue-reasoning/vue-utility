import { ref } from 'vue-demi'

/**
 * The simplest dependency tracker and trigger
 *
 * @returns [track, trigger]
 */
export function useTick() {
  const tickRef = ref(0)

  const track = () => tickRef.value
  const trigger = () => tickRef.value++

  return [track, trigger]
}
