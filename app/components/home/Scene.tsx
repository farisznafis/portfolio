"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

/**
 * A GPU particle wave.
 *
 * A grid of points is displaced by layered sine waves in the vertex shader.
 * The `progress` ref (0→1, driven by page scroll) morphs amplitude, twist,
 * and the teal→amber color mix. Pointer position adds a gentle parallax tilt.
 *
 * Everything heavy lives on the GPU, so it stays smooth even with ~40k points.
 */

const COUNT_X = 200;
const COUNT_Y = 200;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uPointer;
  varying float uElevation;
  varying float uDist;

  void main() {
    vec3 pos = position;

    // Radial distance from center (for ripples + coloring)
    float d = length(pos.xy);
    uDist = d;

    // Layered travelling waves; amplitude grows with scroll progress
    float amp = 0.35 + uProgress * 1.15;
    float e =
        sin(pos.x * 1.5 + uTime * 0.8) * 0.5
      + sin(pos.y * 1.8 - uTime * 0.6) * 0.5
      + sin(d * 3.0 - uTime * 1.2) * 0.6;
    e *= amp;

    // Scroll adds a swirling twist toward the end of the journey
    float twist = uProgress * 1.4;
    float c = cos(d * twist);
    float s = sin(d * twist);
    pos.xy = mat2(c, -s, s, c) * pos.xy;

    pos.z += e;
    uElevation = e;

    // Pointer parallax - subtle tilt
    pos.x += uPointer.x * 0.3;
    pos.y += uPointer.y * 0.3;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Perspective-correct point size, a touch larger on peaks
    gl_PointSize = (14.0 + e * 6.0) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uProgress;
  varying float uElevation;
  varying float uDist;

  void main() {
    // Round, soft points
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist);

    // Color by elevation + scroll: teal in valleys → amber on peaks
    float mixv = clamp(uElevation * 0.5 + 0.5, 0.0, 1.0);
    mixv = mix(mixv, 1.0, uProgress * 0.4);
    vec3 color = mix(uColorA, uColorB, mixv);

    // Fade the far edges of the field
    float edge = smoothstep(9.0, 3.5, uDist);
    gl_FragColor = vec4(color, alpha * edge * (0.55 + uProgress * 0.35));
  }
`;

function ParticleWave({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smoothProgress = useRef(0);
  const { viewport } = useThree();

  // Build the flat grid of vertices once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT_X * COUNT_Y * 3);
    let i = 0;
    for (let ix = 0; ix < COUNT_X; ix++) {
      for (let iy = 0; iy < COUNT_Y; iy++) {
        positions[i++] = (ix / (COUNT_X - 1) - 0.5) * 16; // x
        positions[i++] = (iy / (COUNT_Y - 1) - 0.5) * 16; // y
        positions[i++] = 0; // z
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Free the GPU buffer when the scene unmounts (e.g. route change).
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#00b5a5") }, // accent teal
      uColorB: { value: new THREE.Color("#ffc700") }, // amber
    }),
    [],
  );

  useFrame((state, delta) => {
    const mat = matRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;

    // Ease scroll progress toward its target for buttery transitions
    const target = progressRef.current;
    smoothProgress.current += (target - smoothProgress.current) * Math.min(1, delta * 3);

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uProgress.value = smoothProgress.current;

    // Pointer parallax (state.pointer is normalized -1..1)
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;
    mat.uniforms.uPointer.value.set(pointer.current.x, pointer.current.y);

    // Whole field slowly tilts; scroll lifts the camera-facing angle
    pts.rotation.x = -0.9 + smoothProgress.current * 0.5 + pointer.current.y * 0.1;
    pts.rotation.z = state.clock.elapsedTime * 0.02 + pointer.current.x * 0.1;
  });

  // Keep the field filling the viewport on resize
  const scale = Math.max(1, viewport.width / 12);

  return (
    <points ref={pointsRef} geometry={geometry} scale={scale}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Scene({
  progressRef,
  active = true,
}: {
  progressRef: MutableRefObject<number>;
  /** Pause the render loop entirely when the section leaves the viewport. */
  active?: boolean;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 11], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={active ? "always" : "never"}
    >
      <ParticleWave progressRef={progressRef} />
    </Canvas>
  );
}
