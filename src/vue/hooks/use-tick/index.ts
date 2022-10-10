import { ref } from 'vue-demi'

export function useTick() {
  const tickRef = ref(0)

  const track = () => {
    tickRef.value
  }
  const trigger = () => {
    tickRef.value++
  }

  return [track, trigger]
}
