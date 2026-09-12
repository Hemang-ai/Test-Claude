import { useFrame } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { faceUrl } from '../assets'
import { pointer } from '../hooks/usePointer'

/**
 * A stylised full-body figure of Hemang: photo face on a bobblehead, navy suit,
 * light-blue shirt. The head follows the cursor with a springy overshoot, the arm
 * nearest the cursor reaches toward it, the other arm waves when the cursor rests
 * on the figure, and the whole body leans, breathes and parallaxes on scroll.
 */

const SKIN = '#9a6b57'
const HAIR = '#17110f'
const SUIT = '#2a3858'
const SUIT_DARK = '#1f2a45'
const SHIRT = '#cfdbec'
const SHOE = '#14121a'

const HEAD_R = 0.52
const clamp = THREE.MathUtils.clamp
const damp = THREE.MathUtils.damp

/** Critically-under-damped spring for bobblehead overshoot. */
class Spring {
  v = 0
  x = 0
  constructor(public k = 60, public d = 9) {}
  update(target: number, dt: number) {
    const step = Math.min(dt, 1 / 30)
    const a = (target - this.x) * this.k - this.v * this.d
    this.v += a * step
    this.x += this.v * step
    return this.x
  }
}

/** Spherical cap on the front of the head with a planar projection of the face photo. */
function useFaceCap() {
  return useMemo(() => {
    const r = HEAD_R * 1.012
    const phiLength = Math.PI * 0.62
    const thetaStart = Math.PI * 0.14
    const thetaLength = Math.PI * 0.72
    const g = new THREE.SphereGeometry(r, 64, 64, Math.PI / 2 - phiLength / 2, phiLength, thetaStart, thetaLength)
    const pos = g.attributes.position
    const uv = g.attributes.uv as THREE.BufferAttribute
    const halfW = r * Math.sin(phiLength / 2)
    const top = r * Math.cos(thetaStart)
    const bottom = r * Math.cos(thetaStart + thetaLength)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      uv.setXY(i, x / (2 * halfW) + 0.5, (y - bottom) / (top - bottom))
    }
    uv.needsUpdate = true
    return g
  }, [])
}

function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(0,0,0,0.75)')
    g.addColorStop(0.5, 'rgba(0,0,0,0.35)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  }, [])
}

function Head({ faceCap }: { faceCap: THREE.BufferGeometry }) {
  const tex = useTexture(faceUrl)
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.needsUpdate = true
  }, [tex])
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[HEAD_R, 48, 48]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
      <mesh geometry={faceCap}>
        <meshStandardMaterial map={tex} transparent roughness={0.7} depthWrite={false} />
      </mesh>
      {/* hair: crown and back */}
      <mesh position={[0, 0.02, -0.02]}>
        <sphereGeometry args={[HEAD_R * 1.06, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshStandardMaterial color={HAIR} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.03]}>
        <sphereGeometry args={[HEAD_R * 1.06, 48, 32, Math.PI * 0.98, Math.PI * 1.04, 0, Math.PI * 0.66]} />
        <meshStandardMaterial color={HAIR} roughness={0.55} />
      </mesh>
      {/* ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * HEAD_R * 0.98, -0.02, 0]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshStandardMaterial color={SKIN} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Arm({ side, shoulder, elbow }: { side: 1 | -1; shoulder: React.RefObject<THREE.Group | null>; elbow: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={shoulder} position={[side * 0.74, 1.22, 0]}>
      <mesh position={[0, -0.36, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 6, 18]} />
        <meshStandardMaterial color={SUIT} roughness={0.85} />
      </mesh>
      <group ref={elbow} position={[0, -0.72, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.13, 0.42, 6, 18]} />
          <meshStandardMaterial color={SUIT_DARK} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={SHIRT} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.72, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function Leg({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.3, 0.1, 0]}>
      <mesh position={[0, -0.5, 0]}>
        <capsuleGeometry args={[0.2, 0.7, 6, 18]} />
        <meshStandardMaterial color={SUIT} roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <capsuleGeometry args={[0.17, 0.6, 6, 18]} />
        <meshStandardMaterial color={SUIT_DARK} roughness={0.9} />
      </mesh>
      <RoundedBox args={[0.34, 0.2, 0.6]} radius={0.08} smoothness={4} position={[0, -1.72, 0.12]}>
        <meshStandardMaterial color={SHOE} roughness={0.35} metalness={0.2} />
      </RoundedBox>
    </group>
  )
}

export function Avatar() {
  const faceCap = useFaceCap()
  const shadow = useShadowTexture()
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const shoulderR = useRef<THREE.Group>(null)
  const elbowR = useRef<THREE.Group>(null)
  const shoulderL = useRef<THREE.Group>(null)
  const elbowL = useRef<THREE.Group>(null)

  const yaw = useMemo(() => new Spring(70, 8), [])
  const pitch = useMemo(() => new Spring(70, 8), [])
  const roll = useMemo(() => new Spring(50, 7), [])
  const tmp = useMemo(
    () => ({ q: new THREE.Quaternion(), dir: new THREE.Vector3(), down: new THREE.Vector3(0, -1, 0), target: new THREE.Vector3(), rest: new THREE.Quaternion() }),
    [],
  )
  const state = useRef({ waveUntil: 1.6, lastNear: false })

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const px = pointer.active ? pointer.x : 0
    const py = pointer.active ? pointer.y : 0
    const near = pointer.active && Math.abs(px) < 0.28 && Math.abs(py) < 0.45
    if (near && !state.current.lastNear) state.current.waveUntil = t + 2.2
    state.current.lastNear = near

    // Head: springy follow with a small overshoot, plus idle micro-motion.
    if (head.current) {
      head.current.rotation.y = yaw.update(clamp(px * 0.75, -0.8, 0.8) + Math.sin(t * 0.7) * 0.03, dt)
      head.current.rotation.x = pitch.update(clamp(py * 0.4, -0.45, 0.45) + Math.sin(t * 1.1) * 0.02, dt)
      head.current.rotation.z = roll.update(-px * 0.12, dt)
    }

    // Body lean and breathing.
    if (body.current) {
      body.current.rotation.y = damp(body.current.rotation.y, px * 0.22, 4, dt)
      body.current.rotation.z = damp(body.current.rotation.z, -px * 0.05, 4, dt)
      body.current.position.y = Math.sin(t * 1.4) * 0.015
    }
    if (torso.current) torso.current.scale.set(1, 1 + Math.sin(t * 1.4) * 0.012, 1 + Math.sin(t * 1.4) * 0.02)

    // Arms: the arm on the cursor's side reaches for it; the other rests or waves.
    const reachSide: 1 | -1 = px >= 0 ? 1 : -1
    const arms: Array<{ side: 1 | -1; sh: THREE.Group | null; el: THREE.Group | null }> = [
      { side: 1, sh: shoulderR.current, el: elbowR.current },
      { side: -1, sh: shoulderL.current, el: elbowL.current },
    ]
    const waving = t < state.current.waveUntil
    for (const { side, sh, el } of arms) {
      if (!sh || !el) continue
      const isReach = pointer.active && side === reachSide && !near
      const isWave = waving && side === -reachSide
      if (isReach) {
        tmp.target.set(px * 3.2, -py * 2.4 + 0.4, 1.8)
        tmp.dir.copy(tmp.target).sub(sh.position).normalize()
        tmp.q.setFromUnitVectors(tmp.down, tmp.dir)
        sh.quaternion.slerp(tmp.q, 1 - Math.exp(-6 * dt))
        el.rotation.x = damp(el.rotation.x, -0.35, 6, dt)
        el.rotation.z = damp(el.rotation.z, 0, 6, dt)
      } else if (isWave) {
        tmp.rest.setFromEuler(new THREE.Euler(0.15, 0, side * 2.55))
        sh.quaternion.slerp(tmp.rest, 1 - Math.exp(-8 * dt))
        el.rotation.z = damp(el.rotation.z, side * (0.55 + Math.sin(t * 11) * 0.5), 14, dt)
        el.rotation.x = damp(el.rotation.x, 0, 8, dt)
      } else {
        tmp.rest.setFromEuler(new THREE.Euler(Math.sin(t * 1.4 + side) * 0.05, 0, side * 0.12))
        sh.quaternion.slerp(tmp.rest, 1 - Math.exp(-4 * dt))
        el.rotation.x = damp(el.rotation.x, -0.12, 4, dt)
        el.rotation.z = damp(el.rotation.z, side * 0.05, 4, dt)
      }
    }

    // Scroll parallax: the figure turns and rises as the page moves on.
    if (root.current) {
      const s = window.scrollY
      root.current.position.y = damp(root.current.position.y, -0.15 - s * 0.0022, 6, dt)
      root.current.rotation.y = damp(root.current.rotation.y, s * 0.0018, 6, dt)
      const sc = clamp(1 - s * 0.00035, 0.6, 1)
      root.current.scale.setScalar(damp(root.current.scale.x, sc, 6, dt))
    }
  })

  return (
    <group ref={root} position={[0, -0.15, 0]}>
      {/* floor shadow and stage ring */}
      <mesh position={[0, -1.83, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.84, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.18, 1.22, 96]} />
        <meshBasicMaterial color="#c79bff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.85, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.18, 96]} />
        <meshBasicMaterial color="#7b3fe4" transparent opacity={0.12} toneMapped={false} />
      </mesh>

      <group ref={body}>
        <Leg side={-1} />
        <Leg side={1} />

        <group ref={torso} position={[0, 0.7, 0]}>
          <RoundedBox args={[1.3, 1.3, 0.72]} radius={0.26} smoothness={6}>
            <meshStandardMaterial color={SUIT} roughness={0.85} />
          </RoundedBox>
          {/* shirt V and collar */}
          <mesh position={[0, 0.45, 0.34]}>
            <cylinderGeometry args={[0.17, 0.02, 0.5, 3, 1, false, Math.PI, Math.PI]} />
            <meshStandardMaterial color={SHIRT} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.64, 0.24]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.15, 0.035, 10, 30, Math.PI]} />
            <meshStandardMaterial color={SHIRT} roughness={0.9} />
          </mesh>
          {/* shoulders */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.62, 0.52, 0]}>
              <sphereGeometry args={[0.2, 20, 20]} />
              <meshStandardMaterial color={SUIT} roughness={0.85} />
            </mesh>
          ))}
          {/* lapels */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.24, 0.3, 0.37]} rotation={[0, 0, s * -0.35]}>
              <boxGeometry args={[0.12, 0.55, 0.02]} />
              <meshStandardMaterial color={SUIT_DARK} roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* neck */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.17, 0.2, 0.3, 20]} />
          <meshStandardMaterial color={SKIN} roughness={0.8} />
        </mesh>

        <group ref={head} position={[0, 1.92, 0]}>
          <Head faceCap={faceCap} />
        </group>

        <Arm side={1} shoulder={shoulderR} elbow={elbowR} />
        <Arm side={-1} shoulder={shoulderL} elbow={elbowL} />
      </group>
    </group>
  )
}
