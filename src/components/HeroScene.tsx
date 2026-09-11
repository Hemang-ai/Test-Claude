import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, RoundedBox, Sparkles, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { identity } from '../data/profile'
import { pointer } from '../hooks/usePointer'

const PORTRAIT_URL = `${import.meta.env.BASE_URL}${identity.headshot}`

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(230,212,255,1)')
    g.addColorStop(0.25, 'rgba(199,155,255,0.55)')
    g.addColorStop(0.6, 'rgba(123,63,228,0.18)')
    g.addColorStop(1, 'rgba(123,63,228,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

function Glow({ position, scale, opacity = 1 }: { position: [number, number, number]; scale: number; opacity?: number }) {
  const map = useGlowTexture()
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={map} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  )
}

/** The glowing violet orb from the reference, now a real emissive sphere. */
function Orb() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.position.x = -1.25 + Math.sin(t * 0.5) * 0.1 + pointer.x * -0.22
    g.position.y = 1.55 + Math.cos(t * 0.7) * 0.12 + pointer.y * 0.16
  })
  return (
    <group ref={ref} position={[-1.25, 1.55, -1.1]}>
      <mesh>
        <sphereGeometry args={[0.2, 48, 48]} />
        <meshStandardMaterial color="#e6d4ff" emissive="#c79bff" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <Glow position={[0, 0, 0]} scale={1.7} opacity={0.9} />
      <pointLight color="#c79bff" intensity={12} distance={6} decay={2} />
    </group>
  )
}

function Rings() {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (a.current) {
      a.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.35) * 0.35
      a.current.rotation.z = t * 0.25
    }
    if (b.current) {
      b.current.rotation.x = Math.PI / 2.4 + Math.cos(t * 0.28) * 0.3
      b.current.rotation.y = -t * 0.18
    }
  })
  return (
    <>
      <mesh ref={a} position={[0, 0.15, 0]}>
        <torusGeometry args={[1.42, 0.012, 16, 160]} />
        <meshStandardMaterial color="#c79bff" emissive="#a76bff" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh ref={b} position={[0, 0.15, 0]}>
        <torusGeometry args={[1.62, 0.008, 16, 160]} />
        <meshStandardMaterial color="#7b3fe4" emissive="#7b3fe4" emissiveIntensity={1.2} transparent opacity={0.7} toneMapped={false} />
      </mesh>
    </>
  )
}

function Portrait({ onReady }: { onReady?: () => void }) {
  const tex = useTexture(PORTRAIT_URL)
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.needsUpdate = true
    onReady?.()
  }, [tex, onReady])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const tx = pointer.active ? pointer.x * 0.38 : 0
    const ty = pointer.active ? pointer.y * 0.26 : 0
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, tx, 3.2, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, ty, 3.2, dt)
    const s = window.scrollY
    g.position.y = THREE.MathUtils.damp(g.position.y, -s * 0.0016, 6, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, s * 0.00025, 6, dt)
  })

  return (
    <group ref={group}>
      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.55}>
        <Glow position={[0, 0.1, -0.9]} scale={4.2} opacity={0.5} />
        <RoundedBox args={[2.95, 3.55, 0.16]} radius={0.24} smoothness={8} position={[0, 0, -0.32]}>
          <meshPhysicalMaterial
            color="#6d3fd8"
            transparent
            opacity={0.28}
            roughness={0.1}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.06}
            iridescence={0.5}
            iridescenceIOR={1.3}
            envMapIntensity={1.4}
            depthWrite={false}
          />
        </RoundedBox>
        <mesh position={[0, 0.15, 0]}>
          <circleGeometry args={[1.18, 96]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
        <Rings />
      </Float>
    </group>
  )
}

function Scene({ onReady }: { onReady?: () => void }) {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={6} color="#ffffff" position={[-4, 4, 5]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={5} color="#a76bff" position={[5, 1, 3]} scale={[3, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={3} color="#c79bff" position={[0, -5, 2]} scale={4} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={0.35} />
      <spotLight position={[-3.5, 3.5, 4.5]} intensity={45} angle={0.6} penumbra={0.9} color="#ffffff" />
      <pointLight position={[3.2, 0.6, 2.4]} intensity={28} color="#a76bff" distance={9} decay={2} />
      <pointLight position={[0, -2.6, 1.6]} intensity={10} color="#7b3fe4" distance={7} decay={2} />
      <Sparkles count={110} scale={[9, 6.5, 3]} size={2.2} speed={0.28} opacity={0.55} color="#c79bff" position={[0, 0, -1]} />
      <Orb />
      <Suspense fallback={null}>
        <Portrait onReady={onReady} />
      </Suspense>
    </>
  )
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.2], fov: 34, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
    >
      <Scene onReady={onReady} />
    </Canvas>
  )
}
