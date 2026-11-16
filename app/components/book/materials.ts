/**
 * Studio: contact-hardening shadows, the softboxes foil reflects, and the
 * felt the book lies on.
 */
import * as THREE from "three";

export const NIGHT = "#0a0f11";
export const SHADOW_NEAR = 60;
export const SHADOW_FAR = 260;

/**
 * Percentage-closer soft shadows for the key light: sharp where a card
 * touches the page, wider the further the shadow falls. Patches three's
 * shadow chunk (shaders compiled afterwards pick it up) and returns the undo.
 *
 * PCSS_K = light width / (2 tan(half shadow fov)), in scene units (cm).
 */
export function installSoftShadows(low: boolean) {
  const original = THREE.ShaderChunk.shadowmap_pars_fragment;
  const pcss = /* glsl */ `
	#define PCSS_BLOCKERS ${low ? 6 : 10}
	#define PCSS_TAPS ${low ? 8 : 16}
	#define PCSS_K 13.0
	float pcssLinear( float z ) {
		return ${SHADOW_NEAR.toFixed(1)} * ${SHADOW_FAR.toFixed(1)} / ( ${SHADOW_FAR.toFixed(1)} - z * ${(SHADOW_FAR - SHADOW_NEAR).toFixed(1)} );
	}
	vec2 pcssDisk( int i, float count, float spin ) {
		float r = sqrt( ( float( i ) + 0.5 ) / count );
		float a = float( i ) * 2.39996323 + spin;
		return r * vec2( cos( a ), sin( a ) );
	}
	float pcssShadow( sampler2D depths, vec4 coord ) {
		float receiver = pcssLinear( coord.z );
		float spin = 6.2831853 * fract( 52.9829189 * fract( dot( gl_FragCoord.xy, vec2( 0.06711056, 0.00583715 ) ) ) );
		float sum = 0.0;
		float hits = 0.0;
		for ( int i = 0; i < PCSS_BLOCKERS; i ++ ) {
			float d = unpackRGBAToDepth( textureLod( depths, coord.xy + pcssDisk( i, float( PCSS_BLOCKERS ), spin ) * 0.014, 0.0 ) );
			if ( d < coord.z ) { sum += pcssLinear( d ); hits += 1.0; }
		}
		if ( hits < 0.5 ) return 1.0;
		float blocker = sum / hits;
		float penumbra = clamp( PCSS_K * ( receiver - blocker ) / ( blocker * receiver ), 0.0007, 0.02 );
		float lit = 0.0;
		for ( int i = 0; i < PCSS_TAPS; i ++ ) {
			lit += step( coord.z, unpackRGBAToDepth( textureLod( depths, coord.xy + pcssDisk( i, float( PCSS_TAPS ), spin ) * penumbra, 0.0 ) ) );
		}
		return lit / float( PCSS_TAPS );
	}
	float getShadow(`;
  THREE.ShaderChunk.shadowmap_pars_fragment = original
    .replace("float getShadow(", pcss)
    .replace(
      "#if defined( SHADOWMAP_TYPE_PCF )",
      "#if 1\n\t\t\tshadow = pcssShadow( shadowMap, shadowCoord );\n\t\t#elif defined( SHADOWMAP_TYPE_PCF )",
    );
  return () => {
    THREE.ShaderChunk.shadowmap_pars_fragment = original;
  };
}

/**
 * What the foil sees: one warm softbox where the key light is, a card
 * behind the set on the key side (flat foil mirrors it), two low cards in
 * front (standing foil mirrors those), and a faint teal bounce from the
 * right. Everything between is near black, so foil is gold only where it
 * catches a card and dark bronze elsewhere, and the line between the two
 * moves across a title as the viewer or the page moves.
 */
export function makeEnvironment(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  const disposables: { dispose(): void }[] = [];
  const panel = (dir: [number, number, number], w: number, h: number, rgb: [number, number, number]) => {
    const geometry = new THREE.PlaneGeometry(w, h);
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    material.color.setRGB(...rgb);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...dir).normalize().multiplyScalar(10);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
    disposables.push(geometry, material);
  };
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshBasicMaterial({ color: "#0a0806", side: THREE.BackSide }),
  );
  scene.add(room);
  disposables.push(room.geometry, room.material);
  const card = (azimuth: number, elevation: number, front: boolean, w: number, h: number, rgb: [number, number, number]) => {
    const az = (azimuth * Math.PI) / 180;
    const el = (elevation * Math.PI) / 180;
    panel([Math.sin(az) * Math.cos(el), Math.sin(el), (front ? 1 : -1) * Math.cos(az) * Math.cos(el)], w, h, rgb);
  };
  panel([-0.62, 0.96, 0.58], 3.2, 2.4, [20, 15, 10.5]); // key softbox
  card(-21, 41, false, 3.4, 4.6, [1.7, 1.45, 1.15]); // behind the set, key side
  card(23, 41, false, 2.2, 4.6, [0.85, 0.74, 0.6]); // behind the set, far side: dimmer, with a dark gap between
  card(-34, -36, true, 3.6, 3.4, [1.6, 1.35, 1.05]); // low in front, key side
  card(36, -34, true, 3.2, 3.4, [1.3, 1.1, 0.9]); // low in front, far side
  panel([0.95, 0.25, 0.15], 4, 6, [0.1, 0.55, 0.5]); // teal bounce
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.035);
  pmrem.dispose();
  for (const item of disposables) item.dispose();
  return target;
}

/** Charcoal wool felt, drawn as thousands of short matted fibres. */
export function makeFelt() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "#12171c";
  ctx.fillRect(0, 0, size, size);
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  ctx.lineCap = "round";
  for (let i = 0; i < 9000; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const angle = rnd() * Math.PI * 2;
    const length = 3 + rnd() * 11;
    const light = rnd() > 0.45;
    ctx.strokeStyle = light ? `rgba(70,86,98,${0.1 + rnd() * 0.2})` : `rgba(4,6,7,${0.15 + rnd() * 0.3})`;
    ctx.lineWidth = 0.5 + rnd() * 0.9;
    // Draw wrapped so the tile repeats without a seam.
    for (const ox of [0, -size, size])
      for (const oy of [0, -size, size]) {
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.quadraticCurveTo(
          x + ox + Math.cos(angle + 0.6) * length * 0.5,
          y + oy + Math.sin(angle + 0.6) * length * 0.5,
          x + ox + Math.cos(angle) * length,
          y + oy + Math.sin(angle) * length,
        );
        ctx.stroke();
      }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(110, 110);
  map.anisotropy = 8;
  const material = new THREE.MeshPhysicalMaterial({
    map,
    bumpMap: map,
    bumpScale: 0.02,
    roughness: 1,
    sheen: 1,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color("#2b3438"),
    envMapIntensity: 0.25,
  });
  return { map, material };
}

/** The spec sheet's table: a quiet centimetre grid on the night background. */
export function makeGrid() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i === 0 ? "rgba(148,166,173,0.2)" : "rgba(148,166,173,0.07)";
    const at = Math.round((i * size) / 5);
    ctx.fillRect(at, 0, 1, size);
    ctx.fillRect(0, at, size, 1);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(120, 120);
  map.anisotropy = 8;
  return { map, material: new THREE.MeshBasicMaterial({ map, toneMapped: false }) };
}
