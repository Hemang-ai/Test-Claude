import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import rig from '../assets/puppet/rig.json'
import { pointer } from '../hooks/usePointer'

/**
 * Cut-out puppet of Hemang built from his full-body illustration. Each layer is
 * a textured plane hinged at a real joint (neck, shoulders, hips, feet). The
 * head turns, tilts and nods toward the cursor with a springy overshoot; the arm
 * nearest the cursor lifts out of its pocket toward it; the other arm waves on
 * greeting and whenever the cursor rests on the figure; the torso leans and
 * breathes; the whole figure turns and parallaxes on scroll.
 */

type Layer = (typeof rig.layers)[number]

const files = import.meta.glob('../assets/puppet/*.png', { eager: true, import: 'default' }) as Record<string, string>
const urlFor = (file: string) => files[`../assets/puppet/${file}`]

const SCALE = rig.height / rig.image[1] // world units per source pixel
const clamp = THREE.MathUtils.clamp
const damp = THREE.MathUtils.damp

class Spring {
  v = 0
  x = 0
  constructor(
    public k = 60,
    public d = 9,
  ) {}
  update(target: number, dt: number) {
    const step = Math.min(dt, 1 / 30)
    this.v += ((target - this.x) * this.k - this.v * this.d) * step
    this.x += this.v * step
    return this.x
  }
}

function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(0,0,0,0.7)')
    g.addColorStop(0.5, 'rgba(0,0,0,0.3)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  }, [])
}

function LayerPlane({ layer }: { layer: Layer }) {
  const tex = useTexture(urlFor(layer.file))
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.needsUpdate = true
  }, [tex])
  const [bx, by, bw, bh] = layer.box
  const [px, py] = layer.pivot
  const cx = (bx + bw / 2 - px) * SCALE
  const cy = -(by + bh / 2 - py) * SCALE
  return (
    <mesh position={[cx, cy, layer.z * 0.012]}>
      <planeGeometry args={[bw * SCALE, bh * SCALE]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} alphaTest={0.02} depthWrite={false} />
    </mesh>
  )
}

export function Puppet() {
  const shadow = useShadowTexture()
  const refs = useRef<Record<string, THREE.Group | null>>({})
  const root = useRef<THREE.Group>(null)
  const yaw = useMemo(() => new Spring(70, 8), [])
  const pitch = useMemo(() => new Spring(70, 8), [])
  const roll = useMemo(() => new Spring(50, 7), [])
  const state = useRef({ waveUntil: 1.8, lastNear: false })

  const byName = useMemo(() => Object.fromEntries(rig.layers.map((l) => [l.name, l])), [])
  const children = (parent: string | null) => rig.layers.filter((l) => (l.parent ?? null) === parent)

  /** Offset of a layer's pivot from its parent's pivot (root layers hang from the feet line). */
  const offset = (l: Layer): [number, number, number] => {
    const p = l.parent ? byName[l.parent] : null
    const [px, py] = l.pivot
    const [qx, qy] = p ? p.pivot : [rig.image[0] / 2, rig.image[1] - 40]
    return [(px - qx) * SCALE, -(py - qy) * SCALE, 0]
  }

  const renderLayer = (l: Layer) => (
    <group key={l.name} ref={(g) => void (refs.current[l.name] = g)} position={offset(l)}>
      <LayerPlane layer={l} />
      {children(l.name).map(renderLayer)}
    </group>
  )

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const px = pointer.active ? pointer.x : 0
    const py = pointer.active ? pointer.y : 0
    const near = pointer.active && Math.abs(px) < 0.28 && Math.abs(py) < 0.5
    if (near && !state.current.lastNear) state.current.waveUntil = t + 2.4
    state.current.lastNear = near
    const r = refs.current

    if (r.head) {
      r.head.rotation.y = yaw.update(clamp(px * 0.42, -0.5, 0.5) + Math.sin(t * 0.7) * 0.02, dt)
      r.head.rotation.x = pitch.update(clamp(py * 0.22, -0.28, 0.28) + Math.sin(t * 1.1) * 0.012, dt)
      r.head.rotation.z = roll.update(-px * 0.16, dt)
    }

    if (r.torso) {
      r.torso.rotation.y = damp(r.torso.rotation.y, px * 0.16, 4, dt)
      r.torso.rotation.z = damp(r.torso.rotation.z, -px * 0.05, 4, dt)
      r.torso.scale.set(1, 1 + Math.sin(t * 1.4) * 0.008, 1)
    }
    if (r.legs) r.legs.rotation.z = damp(r.legs.rotation.z, px * 0.015, 3, dt)

    const reachSide: 1 | -1 = px >= 0 ? 1 : -1
    const waving = t < state.current.waveUntil
    for (const side of [1, -1] as const) {
      const arm = side === 1 ? r.armR : r.armL
      if (!arm) continue
      const isReach = pointer.active && side === reachSide && !near
      const isWave = waving && side === -reachSide
      // Rotation about z at the shoulder: positive lifts the right arm outward, negative the left.
      let z = side * 0.03 + Math.sin(t * 1.4 + side) * 0.015
      let y = 0
      if (isReach) {
        const lift = clamp(0.3 + (1 - py) * 0.4, 0.2, 1.05)
        z = side * lift
        y = -side * px * 0.3
      } else if (isWave) {
        z = side * (1.55 + Math.sin(t * 11) * 0.28)
      }
      arm.rotation.z = damp(arm.rotation.z, z, isWave ? 12 : 5, dt)
      arm.rotation.y = damp(arm.rotation.y, y, 5, dt)
    }

    if (root.current) {
      const s = window.scrollY
      const baseY = -rig.height / 2 + 0.1
      root.current.position.y = damp(root.current.position.y, baseY - s * 0.0022, 6, dt) + Math.sin(t * 1.4) * 0.006
      root.current.rotation.y = damp(root.current.rotation.y, s * 0.0015, 6, dt)
      const sc = clamp(1 - s * 0.00035, 0.6, 1)
      root.current.scale.setScalar(damp(root.current.scale.x, sc, 6, dt))
    }
  })

  return (
    <group ref={root} position={[0, -rig.height / 2 + 0.1, 0]}>
      <mesh position={[0, 0.02, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.01, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.22, 1.26, 96]} />
        <meshBasicMaterial color="#c79bff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.22, 96]} />
        <meshBasicMaterial color="#7b3fe4" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      {children(null).map(renderLayer)}
    </group>
  )
}
