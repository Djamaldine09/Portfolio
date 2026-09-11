'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  {
    kicker: '01 / ENTER',
    title: 'Bienvenue\ndans la nuit.',
    body: 'Une vraie scène WebGL 3D : la caméra avance dans un chemin de torii, lanternes, arbres, montagne et brume à mesure que tu scrolles.',
  },
  {
    kicker: '02 / CRAFT',
    title: 'Design qui\nprend vie.',
    body: 'Chaque élément possède une profondeur réelle. Les objets se rapprochent, grandissent et passent devant la caméra au lieu de simuler une simple parallaxe.',
  },
  {
    kicker: '03 / EXPERIMENT',
    title: 'Code. 3D.\nInteraction.',
    body: 'La souris apporte une légère parallaxe et le scroll pilote directement la position de la caméra dans la scène.',
  },
  {
    kicker: '04 / WORK',
    title: 'Entre dans\nmes projets.',
    body: 'Continue de scroller pour sortir du temple et rejoindre les réalisations du portfolio.',
  },
];

type ThreeState = {
  renderer: any;
  scene: any;
  camera: any;
  group: any;
};

type ThreeWindow = Window & { THREE?: any };

function loadThree(): Promise<any> {
  const existing = (window as ThreeWindow).THREE;
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    const current = document.querySelector<HTMLScriptElement>('script[data-kage-three]');
    if (current) {
      current.addEventListener('load', () => resolve((window as ThreeWindow).THREE));
      current.addEventListener('error', () => reject(new Error('Three.js failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    script.async = true;
    script.dataset.kageThree = 'true';
    script.onload = () => {
      const THREE = (window as ThreeWindow).THREE;
      if (THREE) resolve(THREE);
      else reject(new Error('Three.js is unavailable'));
    };
    script.onerror = () => reject(new Error('Unable to load Three.js'));
    document.head.appendChild(script);
  });
}

function createTorii(THREE: any, color = 0x9a4f2f) {
  const root = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.08 });

  const post = (x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
    mesh.position.set(x, y, z);
    root.add(mesh);
  };

  post(-2.05, 1.65, 0, 0.34, 3.3, 0.34);
  post(2.05, 1.65, 0, 0.34, 3.3, 0.34);
  post(0, 3.1, 0, 4.8, 0.32, 0.42);
  post(0, 2.72, 0, 4.25, 0.18, 0.32);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.22, 0.58), material);
  cap.position.y = 3.38;
  root.add(cap);

  return root;
}

function createLantern(THREE: any) {
  const root = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x23160e, roughness: 0.9 });
  const warm = new THREE.MeshStandardMaterial({ color: 0xffad45, emissive: 0xd76b17, emissiveIntensity: 1.7 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.55, 0.38), warm);
  body.position.y = 1.7;
  root.add(body);

  const top = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.2, 4), dark);
  top.position.y = 2.08;
  top.rotation.y = Math.PI / 4;
  root.add(top);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 6), dark);
  base.position.y = 1.36;
  root.add(base);

  const light = new THREE.PointLight(0xffa640, 2.3, 6, 2);
  light.position.set(0, 1.7, 0.15);
  root.add(light);

  return root;
}

function createTree(THREE: any, scale = 1) {
  const root = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x17100b, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x06110e, roughness: 1 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 2.4, 7), trunkMat);
  trunk.position.y = 1.2;
  root.add(trunk);

  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.15 - i * 0.18, 1.45, 7), leafMat);
    cone.position.y = 2.0 + i * 0.75;
    root.add(cone);
  }

  root.scale.setScalar(scale);
  return root;
}

function createMountain(THREE: any, x: number, z: number, scale: number, color: number) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true });
  const mountain = new THREE.Mesh(new THREE.ConeGeometry(7 * scale, 7 * scale, 7), material);
  mountain.position.set(x, 3.5 * scale, z);
  return mountain;
}

function createScene(THREE: any, canvas: HTMLCanvasElement, reduced: boolean, stateRef: { current: ThreeState | null }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x030509, 1);
  renderer.shadowMap.enabled = !reduced;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080a0d, 0.035);

  const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 160);
  camera.position.set(0, 2.2, 8.5);
  camera.lookAt(0, 2.0, -12);

  const group = new THREE.Group();
  scene.add(group);

  scene.add(new THREE.HemisphereLight(0x9eabc5, 0x080604, 1.25));
  const moonLight = new THREE.DirectionalLight(0xdde8ff, 1.7);
  moonLight.position.set(-8, 14, 4);
  moonLight.castShadow = !reduced;
  scene.add(moonLight);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xe8dfc7 })
  );
  moon.position.set(8, 11, -46);
  scene.add(moon);

  const moonGlow = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0x8b8171, transparent: true, opacity: 0.08 })
  );
  moonGlow.position.copy(moon.position);
  scene.add(moonGlow);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 150, 1, 20),
    new THREE.MeshStandardMaterial({ color: 0x11100f, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -55);
  ground.receiveShadow = !reduced;
  group.add(ground);

  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(5.8, 150),
    new THREE.MeshStandardMaterial({ color: 0x29211b, roughness: 1 })
  );
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.012, -55);
  group.add(path);

  for (let i = 0; i < 16; i++) {
    const gate = createTorii(THREE, i % 3 === 0 ? 0xb45c36 : 0x8f4329);
    gate.position.set(0, 0, -8 - i * 7.2);
    const s = Math.max(0.72, 1 - i * 0.018);
    gate.scale.setScalar(s);
    gate.rotation.y = Math.sin(i * 1.7) * 0.018;
    group.add(gate);

    const leftLantern = createLantern(THREE);
    leftLantern.position.set(-2.9, 0, -8.8 - i * 7.2);
    leftLantern.scale.setScalar(Math.max(0.55, 1 - i * 0.025));
    group.add(leftLantern);

    const rightLantern = createLantern(THREE);
    rightLantern.position.set(2.9, 0, -8.8 - i * 7.2);
    rightLantern.scale.setScalar(Math.max(0.55, 1 - i * 0.025));
    group.add(rightLantern);

    if (i % 2 === 0) {
      const leftTree = createTree(THREE, 1.35 - i * 0.025);
      leftTree.position.set(-5.2 - (i % 4) * 0.4, 0, -10 - i * 7.2);
      group.add(leftTree);

      const rightTree = createTree(THREE, 1.5 - i * 0.025);
      rightTree.position.set(5.3 + (i % 3) * 0.35, 0, -12 - i * 7.2);
      group.add(rightTree);
    }
  }

  group.add(createMountain(THREE, -11, -56, 1.7, 0x090d13));
  group.add(createMountain(THREE, 1, -62, 2.2, 0x070a10));
  group.add(createMountain(THREE, 13, -58, 1.8, 0x090b10));

  const particleCount = reduced ? 250 : 650;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = -Math.random() * 115;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xc8a875, size: 0.035, transparent: true, opacity: 0.48, depthWrite: false })
  );
  group.add(particles);

  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  stateRef.current = { renderer, scene, camera, group };
  return () => {
    window.removeEventListener('resize', resize);
    renderer.dispose();
    stateRef.current = null;
  };
}

export default function KageCameraExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<ThreeState | null>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const init = async () => {
      try {
        const THREE = await loadThree();
        if (disposed) return;
        cleanup = createScene(THREE, canvas, reduced, stateRef);
        setReady(true);

        const animate = () => {
          const state = stateRef.current;
          if (!state) return;

          const targetZ = 8.5 - progressRef.current * 112;
          const targetY = 2.2 + Math.sin(progressRef.current * Math.PI) * 0.32;
          const targetX = pointerRef.current.x * 0.55;

          state.camera.position.x += (targetX - state.camera.position.x) * (reduced ? 0.025 : 0.06);
          state.camera.position.y += (targetY - state.camera.position.y) * (reduced ? 0.025 : 0.055);
          state.camera.position.z += (targetZ - state.camera.position.z) * (reduced ? 0.08 : 0.075);
          state.camera.rotation.y += ((pointerRef.current.x * 0.025) - state.camera.rotation.y) * 0.04;
          state.camera.rotation.x += ((pointerRef.current.y * -0.012) - state.camera.rotation.x) * 0.04;
          state.group.rotation.y += ((pointerRef.current.x * 0.012) - state.group.rotation.y) * 0.03;

          state.renderer.render(state.scene, state.camera);
          raf = requestAnimationFrame(animate);
        };

        raf = requestAnimationFrame(animate);
      } catch {
        setReady(false);
      }
    };

    const pointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerRef.current.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    };

    window.addEventListener('pointermove', pointerMove, { passive: true });
    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', pointerMove);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const section = document.getElementById('kage-experience');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const raw = Math.min(1, Math.max(0, -rect.top / travel));
      progressRef.current = raw;
      setProgress(raw);
      setChapter(Math.min(chapters.length - 1, Math.floor(raw * chapters.length)));
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const current = chapters[chapter];

  return (
    <section id="kage-experience" className="relative h-[460vh] bg-[#030509] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Expérience 3D interactive" />

        {!ready && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(214,155,91,.18),transparent_30%),linear-gradient(180deg,#080b11,#030303)]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,transparent_25%,rgba(0,0,0,.12)_60%,rgba(0,0,0,.78)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#020202] via-transparent to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-12 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
          <div className="max-w-3xl transition-all duration-500">
            <div className="mb-6 flex items-center gap-4 text-[10px] font-semibold tracking-[0.35em] text-[#d39a5b] sm:text-xs">
              <span className="h-px w-12 bg-[#d39a5b]/70" />
              <span>{current.kicker}</span>
            </div>
            <h2 className="whitespace-pre-line text-[clamp(3.7rem,10vw,8rem)] font-extralight leading-[.82] tracking-[-.07em] text-white drop-shadow-[0_8px_35px_rgba(0,0,0,.45)]">
              {current.title}
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/80 sm:text-xl sm:leading-9">
              {current.body}
            </p>
          </div>

          <div className="mt-8 flex items-end justify-between gap-6">
            <div className="flex gap-2" aria-hidden="true">
              {chapters.map((_, index) => (
                <span key={index} className={`h-0.5 transition-all duration-500 ${index === chapter ? 'w-14 bg-[#d39a5b]' : 'w-5 bg-white/25'}`} />
              ))}
            </div>
            <div className="text-right text-[10px] uppercase tracking-[0.28em] text-white/45">
              Scroll / {String(Math.round(progress * 100)).padStart(2, '0')}%
            </div>
          </div>
        </div>

        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/35 sm:flex">
          <span className="[writing-mode:vertical-rl]">Kage Experience</span>
          <span className="h-20 w-px bg-white/15" />
        </div>
      </div>
    </section>
  );
}
