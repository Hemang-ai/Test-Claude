import { useEffect } from 'react'

/** Viewport-normalised pointer position in [-1, 1], shared by the hero scene
 *  and the text parallax so both react to the same cursor. */
export const pointer = { x: 0, y: 0, active: false }

export function usePointerTracking() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.active = true
    }
    const leave = () => {
      pointer.active = false
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])
}
