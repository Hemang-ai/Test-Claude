import { useEffect, useState } from 'react'

/** True when the browser can create a WebGL context. Starts false so the
 *  static fallback renders on first paint and the 3D scene layers in later. */
export function useWebGL() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') ?? c.getContext('webgl')
      setOk(Boolean(gl))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}
