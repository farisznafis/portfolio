"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { Fluid } from "./fluid";

// Mask edge on the fluid's speed: below LO stays hidden, above HI fully revealed.
// A narrow band keeps the hard, liquid edge from landonorris.com without aliasing.
const MASK_LO = 0.16;
const MASK_HI = 0.22;

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const frag = /* glsl */ `
uniform sampler2D tImage;
uniform sampler2D tFluid;
uniform vec2 uRes;
uniform vec2 uImage;
uniform vec2 uOffset;
uniform float uScale;
varying vec2 vUv;

void main() {
  // Same framing as the CSS base layer: scaled about the centre, shifted by
  // parallax (px), then background-size: cover anchored to the top.
  vec2 uv = (vUv - 0.5) / uScale + 0.5 - vec2(uOffset.x, -uOffset.y) / (uRes * uScale);
  float rs = uRes.x / uRes.y;
  float ri = uImage.x / uImage.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  vec2 imgUv = vec2((uv.x - 0.5) * s.x + 0.5, 1.0 - (1.0 - uv.y) * s.y);

  float speed = length(texture2D(tFluid, vUv).xy);
  float mask = smoothstep(${MASK_LO.toFixed(3)}, ${MASK_HI.toFixed(3)}, speed);

  vec3 color = texture2D(tImage, imgUv).rgb;
  gl_FragColor = vec4(color * mask, mask); // premultiplied alpha
}`;

/**
 * Second portrait revealed through a fluid-simulated cursor trail (WebGL).
 * Transparent everywhere else, so the CSS base layer underneath keeps its
 * own entrance and parallax. Renders only while on screen.
 */
export function FluidReveal({
  image,
  scale,
  offsetX,
  offsetY,
}: {
  image: string;
  scale: number;
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: true });
    } catch {
      return; // no WebGL: the base portrait alone is a fine fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const fluid = new Fluid(renderer, canvas.clientWidth, canvas.clientHeight);
    const uniforms = {
      tImage: { value: null as THREE.Texture | null },
      tFluid: { value: fluid.texture },
      uRes: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      uImage: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2() },
      uScale: { value: scale },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const texture = new THREE.TextureLoader().load(image, (t) => {
      const img = t.image as HTMLImageElement;
      uniforms.uImage.value.set(img.naturalWidth, img.naturalHeight);
      uniforms.tImage.value = t;
    });
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      fluid.resize(w, h);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Raw pointer in NDC; the fluid itself does the smoothing.
    const pointer = new THREE.Vector2();
    const last = new THREE.Vector2();
    const delta = new THREE.Vector2();
    let hasPointer = false;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      if (!hasPointer) last.copy(pointer); // no jump-splat on first entry
      hasPointer = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let raf = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // Clamp so a background tab doesn't explode the sim on return.
      const frame = Math.min((now - prev) / (1000 / 60), 3);
      prev = now;
      if (!visible || !uniforms.tImage.value) return;

      delta.subVectors(pointer, last);
      last.copy(pointer);
      if (!hasPointer) delta.set(0, 0);

      fluid.update(frame, pointer, delta);
      uniforms.uOffset.value.set(offsetX.get(), offsetY.get());
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      fluid.dispose();
      texture.dispose();
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
    };
  }, [image, scale, offsetX, offsetY]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
