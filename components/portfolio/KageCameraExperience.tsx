'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { kicker: '01 / ENTER', title: 'Bienvenue\ndans la nuit.', body: 'Une traversée 3D immersive où la caméra avance réellement dans un paysage nocturne japonais.' },
  { kicker: '02 / CRAFT', title: 'Design qui\nprend vie.', body: 'Torii, lanternes, arbres, montagnes, nuages et brume possèdent une vraie profondeur WebGL.' },
  { kicker: '03 / EXPERIMENT', title: 'Code. 3D.\nInteraction.', body: 'Le scroll pilote la caméra tandis que le vent anime les feuilles et les nuages au loin.' },
  { kicker: '04 / WORK', title: 'Entre dans\nmes projets.', body: 'La scène se termine naturellement avant de laisser place au reste de ton portfolio.' },
];

type LeafData = { x: number; y: number; z: number; phase: number; speed: number; drift: number; size: number; rotation: number };
type CloudData = { group: any; baseX: number; speed: number; phase: number };
type ThreeState = { renderer: any; scene: any; camera: any; group: any; leaves: any; leafData: LeafData[]; clouds: CloudData[] };
type ThreeWindow = Window & { THREE?: any };

function loadThree(): Promise<any> {
  const existing = (window as ThreeWindow).THREE;
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const current = document.querySelector<HTMLScriptElement>('script[data-kage-three]');
    if (current) {
      const done = () => ((window as ThreeWindow).THREE ? resolve((window as ThreeWindow).THREE) : reject(new Error('Three.js unavailable')));
      current.addEventListener('load', done, { once: true });
      current.addEventListener('error', () => reject(new Error('Three.js failed to load')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    script.async = true;
    script.dataset.kageThree = 'true';
    script.onload = () => {
      const THREE = (window as ThreeWindow).THREE;
      THREE ? resolve(THREE) : reject(new Error('Three.js unavailable'));
    };
    script.onerror = () => reject(new Error('Unable to load Three.js'));
    document.head.appendChild(script);
  });
}

function createTorii(THREE: any, color: number) {
  const root = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05 });
  const box = (x: number, y: number, sx: number, sy: number, sz: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
    mesh.position.set(x, y, 0);
    root.add(mesh);
  };
  box(-2.05, 1.65, 0.32, 3.3, 0.34);
  box(2.05, 1.65, 0.32, 3.3, 0.34);
  box(0, 3.05, 4.8, 0.3, 0.42);
  box(0, 2.7, 4.25, 0.16, 0.32);
  box(0, 3.35, 5.15, 0.18, 0.5);
  return root;
}

function createLantern(THREE: any, withLight: boolean) {
  const root = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x17110c, roughness: 1 });
  const warm = new THREE.MeshStandardMaterial({ color: 0xffad45, emissive: 0xd86b17, emissiveIntensity: 1.5 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.55, 0.38), warm);
  body.position.y = 1.65;
  root.add(body);
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.2, 4), dark);
  top.position.y = 2.03;
  top.rotation.y = Math.PI / 4;
  root.add(top);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 6), dark);
  base.position.y = 1.32;
  root.add(base);
  if (withLight) {
    const light = new THREE.PointLight(0xffa640, 1.8, 5, 2);
    light.position.y = 1.65;
    root.add(light);
  }
  return root;
}

function createTree(THREE: any, scale: number) {
  const root = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x130d09, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x050b09, roughness: 1 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 2.4, 6), trunkMat);
  trunk.position.y = 1.2;
  root.add(trunk);
  for (let i = 0; i < 3; i += 1) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.12 - i * 0.18, 1.4, 7), leafMat);
    cone.position.y = 2 + i * 0.72;
    root.add(cone);
  }
  root.scale.setScalar(scale);
  return root;
}

function createMountain(THREE: any, x: number, z: number, scale: number, color: number) {
  const root = new THREE.Group();
  const mountainMaterial = new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true });
  const mountain = new THREE.Mesh(new THREE.ConeGeometry(7 * scale, 11 * scale, 32, 3), mountainMaterial);
  mountain.position.y = 5.5 * scale;
  mountain.rotation.y = 0.35;
  root.add(mountain);

  const ridge = new THREE.Mesh(
    new THREE.ConeGeometry(3.2 * scale, 5.4 * scale, 16, 2),
    new THREE.MeshStandardMaterial({ color: 0x111722, roughness: 1, flatShading: true }),
  );
  ridge.position.set(-1.7 * scale, 2.6 * scale, 1.5 * scale);
  ridge.rotation.z = -0.08;
  root.add(ridge);
  root.position.set(x, 0, z);
  return root;
}

function createCloud(THREE: any, x: number, y: number, z: number, scale: number, mobile: boolean) {
  const root = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xaeb9c7, transparent: true, opacity: mobile ? 0.085 : 0.105, depthWrite: false });
  const parts = mobile ? 3 : 5;
  for (let i = 0; i < parts; i += 1) {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.5 + (i % 2) * 0.45, mobile ? 10 : 14, mobile ? 8 : 10), material);
    sphere.position.set((i - (parts - 1) / 2) * 1.25, Math.sin(i * 1.7) * 0.35, Math.cos(i * 1.2) * 0.35);
    sphere.scale.y = 0.42 + (i % 2) * 0.08;
    root.add(sphere);
  }
  root.position.set(x, y, z);
  root.scale.setScalar(scale);
  return root;
}

function createLeaves(THREE: any, mobile: boolean, depth: number) {
  const count = mobile ? 28 : 65;
  const geometry = new THREE.PlaneGeometry(0.32, 0.16);
  const material = new THREE.MeshBasicMaterial({ color: 0x7e6b4b, transparent: true, opacity: 0.88, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const data: LeafData[] = [];
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i += 1) {
    const item: LeafData = {
      x: (Math.random() - 0.5) * 11,
      y: 0.8 + Math.random() * 7.5,
      z: -8 - Math.random() * (depth - 8),
      phase: Math.random() * Math.PI * 2,
      speed: 0.55 + Math.random() * 0.8,
      drift: 0.7 + Math.random() * 1.3,
      size: 0.55 + Math.random() * 0.8,
      rotation: Math.random() * Math.PI,
    };
    data.push(item);
    dummy.position.set(item.x, item.y, item.z);
    dummy.rotation.set(Math.random(), item.rotation, Math.random());
    dummy.scale.set(item.size, item.size, item.size);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return { mesh, data };
}

function disposeObject(object: any) {
  object.traverse((child: any) => {
    child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material: any) => material?.dispose?.());
  });
}

function createScene(THREE: any, canvas: HTMLCanvasElement, mobile: boolean, stateRef: { current: ThreeState | null }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.35));
  renderer.setClearColor(0x040608, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080a0d, mobile ? 0.038 : 0.03);

  const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 150);
  camera.position.set(0, 2.15, 8.5);

  const group = new THREE.Group();
  scene.add(group);
  scene.add(new THREE.HemisphereLight(0x9eabc5, 0x080604, 1.15));
  const moonLight = new THREE.DirectionalLight(0xdde8ff, 1.35);
  moonLight.position.set(-8, 14, 4);
  scene.add(moonLight);

  // Realistic moon: higher in the sky, with a bright core and layered atmospheric glow.
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.35, mobile ? 24 : 36, mobile ? 24 : 36),
    new THREE.MeshStandardMaterial({ color: 0xf4eee0, roughness: 0.92, metalness: 0, emissive: 0x8d877b, emissiveIntensity: 0.22 }),
  );
  moon.position.set(8, 14.5, -46);
  scene.add(moon);

  const moonGlowOuter = new THREE.Mesh(
    new THREE.SphereGeometry(5.8, mobile ? 16 : 24, mobile ? 16 : 24),
    new THREE.MeshBasicMaterial({ color: 0xbcc7d9, transparent: true, opacity: mobile ? 0.055 : 0.075, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  moonGlowOuter.position.copy(moon.position);
  scene.add(moonGlowOuter);

  const moonGlowInner = new THREE.Mesh(
    new THREE.SphereGeometry(3.65, mobile ? 16 : 24, mobile ? 16 : 24),
    new THREE.MeshBasicMaterial({ color: 0xe7dfcb, transparent: true, opacity: mobile ? 0.09 : 0.12, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  moonGlowInner.position.copy(moon.position);
  scene.add(moonGlowInner);

  const moonLightSource = new THREE.PointLight(0xdfe8ff, mobile ? 0.65 : 0.9, 34, 2);
  moonLightSource.position.copy(moon.position);
  scene.add(moonLightSource);

  const depth = mobile ? 88 : 108;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(34, depth, 1, 12), new THREE.MeshStandardMaterial({ color: 0x11100f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -depth / 2 + 10;
  group.add(ground);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(mobile ? 5.4 : 5.8, depth), new THREE.MeshStandardMaterial({ color: 0x29211b, roughness: 1 }));
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.01, ground.position.z);
  group.add(path);

  const count = mobile ? 10 : 13;
  for (let i = 0; i < count; i += 1) {
    const z = -7 - i * 7.2;
    const scale = Math.max(mobile ? 0.68 : 0.72, 1 - i * 0.018);
    const gate = createTorii(THREE, i % 3 === 0 ? 0xb45c36 : 0x8f4329);
    gate.position.z = z;
    gate.scale.setScalar(scale);
    group.add(gate);

    const left = createLantern(THREE, i < 6);
    left.position.set(-2.75, 0, z - 0.8);
    left.scale.setScalar(Math.max(0.56, 1 - i * 0.025));
    group.add(left);
    const right = createLantern(THREE, i < 6);
    right.position.set(2.75, 0, z - 0.8);
    right.scale.setScalar(Math.max(0.56, 1 - i * 0.025));
    group.add(right);

    if (i % 2 === 0) {
      const treeScale = mobile ? 1.05 : 1.25;
      const leftTree = createTree(THREE, treeScale - i * 0.02);
      leftTree.position.set(-5.1, 0, z - 1.8);
      group.add(leftTree);
      const rightTree = createTree(THREE, treeScale + 0.08 - i * 0.02);
      rightTree.position.set(5.1, 0, z - 2.2);
      group.add(rightTree);
    }
  }

  const mountainSpecs: [number, number, number, number][] = [
    [-13, -49, 1.55, 0x0b1018],
    [-3, -58, 2.25, 0x070b12],
    [9, -53, 1.85, 0x0a0e16],
    [17, -68, 2.3, 0x080b11],
  ];
  mountainSpecs.forEach(([x, z, scale, color]) => group.add(createMountain(THREE, x, z, scale, color)));

  const clouds: CloudData[] = [];
  const cloudSpecs: [number, number, number, number, number][] = [
    [-8, 8.5, -42, 1.6, 0.9],
    [6, 9.8, -50, 1.9, 0.7],
    [-3, 11.5, -62, 2.2, 0.5],
    [11, 8.2, -70, 1.7, 0.35],
  ];
  cloudSpecs.forEach(([x, y, z, scale, speed], index) => {
    const cloud = createCloud(THREE, x, y, z, scale, mobile);
    group.add(cloud);
    clouds.push({ group: cloud, baseX: x, speed, phase: index * 1.8 });
  });

  const leafSet = createLeaves(THREE, mobile, depth);
  group.add(leafSet.mesh);

  const particleCount = mobile ? 120 : 260;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = -Math.random() * depth - 4;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  group.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xc8a875, size: mobile ? 0.045 : 0.04, transparent: true, opacity: 0.32, depthWrite: false })));

  const resize = () => {
    const width = Math.max(1, canvas.clientWidth || window.innerWidth);
    const height = Math.max(1, canvas.clientHeight || window.innerHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  stateRef.current = { renderer, scene, camera, group, leaves: leafSet.mesh, leafData: leafSet.data, clouds };

  return () => {
    observer.disconnect();
    disposeObject(scene);
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = document.getElementById('kage-experience');
    if (!canvas || !section) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    let raf = 0;
    let visible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      progressRef.current = Math.min(1, Math.max(0, -rect.top / travel));
      const nextChapter = Math.min(chapters.length - 1, Math.floor(progressRef.current * chapters.length));
      setChapter((current) => (current === nextChapter ? current : nextChapter));
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateProgress();
      });
    };
    updateProgress();

    const pointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerRef.current.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.01 });
    visibilityObserver.observe(section);

    const init = async () => {
      try {
        const THREE = await loadThree();
        if (disposed) return;
        cleanup = createScene(THREE, canvas, mobile, stateRef);
        setReady(true);

        const clock = new THREE.Clock();
        const dummy = new THREE.Object3D();
        const animate = () => {
          if (disposed) return;
          const state = stateRef.current;
          if (state && visible) {
            const elapsed = clock.getElapsedTime();
            const p = progressRef.current;
            const targetZ = 8.5 - p * (mobile ? 82 : 102);
            const targetY = 2.15 + Math.sin(p * Math.PI) * 0.3;
            const targetX = pointerRef.current.x * (mobile ? 0.18 : 0.45);
            state.camera.position.x += (targetX - state.camera.position.x) * 0.055;
            state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
            state.camera.position.z += (targetZ - state.camera.position.z) * 0.08;
            state.camera.rotation.y += (pointerRef.current.x * 0.018 - state.camera.rotation.y) * 0.035;
            state.camera.rotation.x += (pointerRef.current.y * -0.008 - state.camera.rotation.x) * 0.035;

            if (!reduced) {
              state.clouds.forEach((cloud) => {
                cloud.group.position.x = cloud.baseX + Math.sin(elapsed * cloud.speed * 0.08 + cloud.phase) * 2.5;
                cloud.group.position.y += Math.sin(elapsed * 0.12 + cloud.phase) * 0.0007;
              });

              state.leafData.forEach((leaf, index) => {
                const wind = elapsed * leaf.speed + leaf.phase;
                const x = leaf.x + Math.sin(wind) * leaf.drift + elapsed * 0.18 * leaf.speed;
                const y = leaf.y + Math.sin(wind * 1.35) * 0.28;
                const z = leaf.z + Math.cos(wind * 0.7) * 0.55;
                dummy.position.set(x > 8 ? x - 16 : x, y, z);
                dummy.rotation.set(Math.sin(wind) * 0.9, Math.cos(wind * 0.8) * 1.3, leaf.rotation + wind * 1.7);
                dummy.scale.set(leaf.size, leaf.size, leaf.size);
                dummy.updateMatrix();
                state.leaves.setMatrixAt(index, dummy.matrix);
              });
              state.leaves.instanceMatrix.needsUpdate = true;
            }

            state.renderer.render(state.scene, state.camera);
          }
          raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
      } catch {
        if (!disposed) setReady(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    if (!mobile) window.addEventListener('pointermove', pointerMove, { passive: true });
    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScroll);
      if (!mobile) window.removeEventListener('pointermove', pointerMove);
      visibilityObserver.disconnect();
      cleanup?.();
    };
  }, []);

  const current = chapters[chapter];

  return (
    <section id="kage-experience" className="relative z-0 isolate h-[360vh] bg-[#040608] text-white">
      <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(3,5,8,0.08)_45%,rgba(3,5,8,0.68)_100%)]" />

        <div className="relative z-10 flex h-full items-end px-5 pb-20 sm:px-8 sm:pb-24 lg:px-16 lg:pb-28">
          <div className="w-full max-w-3xl">
            <div className="mb-5 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.38em] text-amber-200/75 sm:text-xs">
              <span className="h-px w-12 bg-amber-200/60" />
              <span>{current.kicker}</span>
            </div>
            <h2 className="max-w-3xl whitespace-pre-line text-[clamp(3.1rem,10vw,7.8rem)] font-light leading-[0.88] tracking-[-0.055em] text-white drop-shadow-2xl">
              {current.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8 lg:text-xl">
              {current.body}
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-3 sm:bottom-8 sm:right-8">
          <div className="h-1 w-20 overflow-hidden rounded-full bg-white/15 sm:w-28">
            <div className="h-full rounded-full bg-amber-200/80 transition-[width] duration-150" style={{ width: `${((chapter + 1) / chapters.length) * 100}%` }} />
          </div>
          <span className="text-[10px] tracking-[0.3em] text-white/55">SCROLL</span>
        </div>

        {!ready && <div className="pointer-events-none absolute inset-0 z-30 bg-[#040608]" />}
      </div>
    </section>
  );
}
