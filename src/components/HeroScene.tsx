import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { pointer } from '../hooks/usePointer'
import { Puppet } from './Puppet'

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

/** The glowing violet orb from the reference, drifting behind the figure. */
function Orb() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.position.x = -1.15 + Math.sin(t * 0.5) * 0.1 + pointer.x * -0.25
    g.position.y = 2.25 + Math.cos(t * 0.7) * 0.12 + pointer.y * 0.16 - window.scrollY * 0.001
  })
  return (
    <group ref={ref} position={[-1.15, 2.25, -1.6]}>
      <mesh>
        <sphereGeometry args={[0.2, 48, 48]} />
        <meshStandardMaterial color="#c79bff" emissive="#a76bff" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      <Glow position={[0, 0, 0]} scale={1.9} opacity={0.9} />
      <pointLight color="#c79bff" intensity={14} distance={7} decay={2} />
    </group>
  )
}

function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.()
  }, [onReady])
  return null
}

function Scene({ onReady }: { onReady?: () => void }) {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} color="#ffffff" position={[-4, 4, 5]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={5} color="#a76bff" position={[5, 1, 3]} scale={[3, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={3} color="#c79bff" position={[0, -5, 2]} scale={4} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={0.5} />
      <spotLight position={[-3.5, 5, 5]} intensity={70} angle={0.7} penumbra={0.9} color="#fff4ea" />
      <pointLight position={[3.4, 1.5, 2.6]} intensity={30} color="#a76bff" distance={10} decay={2} />
      <pointLight position={[0, -2.2, 2.2]} intensity={12} color="#7b3fe4" distance={7} decay={2} />
      <Sparkles count={120} scale={[7, 8, 3]} size={2.2} speed={0.28} opacity={0.55} color="#c79bff" position={[0, 0.2, -1.2]} />
      <Glow position={[0, 0.3, -2.2]} scale={5.5} opacity={0.45} />
      <Orb />
      <Suspense fallback={null}>
        <Puppet />
        <Ready onReady={onReady} />
      </Suspense>
    </>
  )
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 8.8], fov: 30, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
    >
      <Scene onReady={onReady} />
    </Canvas>
  )
}
