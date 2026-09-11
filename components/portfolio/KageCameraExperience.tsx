'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { kicker: '01 / ENTER', title: 'Bienvenue\ndans la nuit.', body: 'Une traversée 3D immersive où la caméra avance réellement dans un paysage nocturne japonais.' },
  { kicker: '02 / CRAFT', title: 'Design qui\nprend vie.', body: 'Torii, lanternes, arbres, montagnes, nuages et brume possèdent une vraie profondeur WebGL.' },
  { kicker: '03 / EXPERIMENT', title: 'Code. 3D.\nInteraction.', body: 'Le scroll pilote la caméra tandis que le vent anime les feuilles et les nuages au loin.' },
  { kicker: '04 / WORK', title: 'Entre dans\nmes projets.', body: 'La scène se termine naturellement avant de laisser place au reste de ton portfolio.' },
];

type LeafData = { x: number; y: number; z: number; phase: number; speed: number; drift: number; size: number; rotation: number };
type CloudData = { group: any; baseX: number; baseY: number; speed: number; phase: number };
type ThemePart = { material: any; night: number; day: number };
type ThreeState = { renderer: any; scene: any; camera: any; group: any; leaves: any; leafData: LeafData[]; clouds: CloudData[]; themeParts: ThemePart[]; moonMaterial: any; glowMaterial: any; glow2Material: any; moonLight: any; moonPoint: any; applyTheme: (day: boolean) => void };
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
    script.onload = () => { const THREE = (window as ThreeWindow).THREE; THREE ? resolve(THREE) : reject(new Error('Three.js unavailable')); };
    script.onerror = () => reject(new Error('Unable to load Three.js'));
    document.head.appendChild(script);
  });
}

function themeMaterial(material: any, night: number, day: number, themeParts: ThemePart[]) {
  themeParts.push({ material, night, day });
  material.color.setHex(night);
  return material;
}

function createTorii(THREE: any, color: number, themeParts: ThemePart[]) {
  const root = new THREE.Group();
  const material = themeMaterial(new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05 }), color, color, themeParts);
  const box = (x: number, y: number, sx: number, sy: number, sz: number) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material); mesh.position.set(x, y, 0); root.add(mesh); };
  box(-2.05, 1.65, 0.32, 3.3, 0.34); box(2.05, 1.65, 0.32, 3.3, 0.34); box(0, 3.05, 4.8, 0.3, 0.42); box(0, 2.7, 4.25, 0.16, 0.32); box(0, 3.35, 5.15, 0.18, 0.5);
  return root;
}

function createLantern(THREE: any, withLight: boolean, themeParts: ThemePart[]) {
  const root = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x17110c, roughness: 1 });
  const warm = themeMaterial(new THREE.MeshStandardMaterial({ color: 0xffad45, emissive: 0xd86b17, emissiveIntensity: 1.5 }), 0xffad45, 0xffc45b, themeParts);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.55, 0.38), warm); body.position.y = 1.65; root.add(body);
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.2, 4), dark); top.position.y = 2.03; top.rotation.y = Math.PI / 4; root.add(top);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 6), dark); base.position.y = 1.32; root.add(base);
  if (withLight) { const light = new THREE.PointLight(0xffa640, 1.8, 5, 2); light.position.y = 1.65; root.add(light); }
  return root;
}

function createTree(THREE: any, scale: number, themeParts: ThemePart[], mobile: boolean) {
  const root = new THREE.Group();
  const trunkMat = themeMaterial(new THREE.MeshStandardMaterial({ color: 0x130d09, roughness: 0.96, metalness: 0 }), 0x130d09, 0x4d2e1c, themeParts);
  const barkMat = themeMaterial(new THREE.MeshStandardMaterial({ color: 0x24150d, roughness: 1 }), 0x24150d, 0x6b4327, themeParts);
  const foliageDark = themeMaterial(new THREE.MeshStandardMaterial({ color: 0x03100a, roughness: 0.98 }), 0x03100a, 0x174a26, themeParts);
  const foliageMid = themeMaterial(new THREE.MeshStandardMaterial({ color: 0x06180d, roughness: 0.98 }), 0x06180d, 0x246336, themeParts);
  const foliageLight = themeMaterial(new THREE.MeshStandardMaterial({ color: 0x0a2112, roughness: 0.96 }), 0x0a2112, 0x397842, themeParts);

  // Organic trunk: several tapered segments with tiny bends so the silhouette never looks perfectly manufactured.
  const trunk = new THREE.Group();
  const trunkSegments = mobile ? 3 : 4;
  let trunkX = 0;
  let trunkZ = 0;
  for (let i = 0; i < trunkSegments; i += 1) {
    const t = i / trunkSegments;
    const height = 1.05 + Math.random() * 0.12;
    const radiusTop = 0.09 - t * 0.035;
    const radiusBottom = 0.22 - t * 0.04;
    const segment = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(0.045, radiusTop), radiusBottom, height, 8, 2), i === 0 ? trunkMat : barkMat);
    segment.position.set(trunkX, i * 0.98 + height * 0.5, trunkZ);
    segment.rotation.z = (Math.random() - 0.5) * 0.055;
    segment.rotation.x = (Math.random() - 0.5) * 0.035;
    trunkX += (Math.random() - 0.5) * 0.055;
    trunkZ += (Math.random() - 0.5) * 0.045;
    trunk.add(segment);
  }
  root.add(trunk);

  // Smooth foliage volumes plus curved branches: no cones and no faceted icosahedrons.
  const foliageGeometry = new THREE.SphereGeometry(1, mobile ? 8 : 12, mobile ? 6 : 9);
  const twigGeometry = new THREE.SphereGeometry(1, mobile ? 6 : 8, mobile ? 5 : 6);

  const addBranch = (baseY: number, angle: number, length: number, droop: number, material: any, branchIndex: number) => {
    const outward = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    const side = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
    const base = new THREE.Vector3(trunkX * 0.5, baseY, trunkZ * 0.5);
    const end = base.clone().add(outward.clone().multiplyScalar(length)).add(side.clone().multiplyScalar((Math.random() - 0.5) * 0.34));
    end.y -= droop;
    const mid = base.clone().add(outward.clone().multiplyScalar(length * (0.42 + Math.random() * 0.08))).add(side.clone().multiplyScalar((Math.random() - 0.5) * 0.28));
    mid.y -= droop * 0.28;
    const curve = new THREE.CatmullRomCurve3([base, mid, end]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, mobile ? 5 : 7, mobile ? 0.055 : 0.065, 5, false), barkMat));

    const tuftCount = mobile ? 2 : 3;
    for (let k = 0; k < tuftCount; k += 1) {
      const t = (k + 0.35) / tuftCount;
      const point = curve.getPointAt(Math.min(0.96, t));
      const tuft = new THREE.Mesh(foliageGeometry, k === 0 && branchIndex % 2 === 0 ? foliageLight : material);
      const width = (0.62 - t * 0.18) * (0.9 + Math.random() * 0.2);
      const height = (0.42 - t * 0.10) * (0.9 + Math.random() * 0.2);
      tuft.position.copy(point);
      tuft.position.y += 0.04 + Math.random() * 0.08;
      tuft.scale.set(width, height, width * (0.72 + Math.random() * 0.18));
      tuft.rotation.set((Math.random() - 0.5) * 0.35, angle + Math.PI * 0.5 + (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.35);
      root.add(tuft);

      if (!mobile && k === tuftCount - 1) {
        const twigStart = point.clone().add(outward.clone().multiplyScalar(0.05));
        const twigEnd = twigStart.clone().add(outward.clone().multiplyScalar(0.42 + Math.random() * 0.18)).add(side.clone().multiplyScalar((Math.random() - 0.5) * 0.25));
        twigEnd.y += 0.06 - Math.random() * 0.14;
        const twigCurve = new THREE.CatmullRomCurve3([twigStart, twigStart.clone().lerp(twigEnd, 0.5), twigEnd]);
        root.add(new THREE.Mesh(new THREE.TubeGeometry(twigCurve, 4, 0.035, 4, false), barkMat));
        const twigTip = new THREE.Mesh(twigGeometry, foliageLight);
        twigTip.position.copy(twigEnd);
        twigTip.scale.set(0.22, 0.14, 0.18);
        twigTip.rotation.y = angle;
        root.add(twigTip);
      }
    }
  };

  const tiers = mobile ? 4 : 5;
  for (let i = 0; i < tiers; i += 1) {
    const t = i / (tiers - 1);
    const y = 2.0 + t * 3.55;
    const width = (1.75 - t * 1.22) * (0.92 + Math.random() * 0.14);
    const branches = mobile ? 3 : 4;
    const phase = Math.random() * Math.PI * 2;
    for (let j = 0; j < branches; j += 1) {
      const angle = phase + (j / branches) * Math.PI * 2;
      const length = width * (0.86 + Math.random() * 0.22);
      const droop = (0.16 + (1 - t) * 0.28) * (0.8 + Math.random() * 0.35);
      addBranch(y + (Math.random() - 0.5) * 0.18, angle, length, droop, j % 3 === 0 ? foliageMid : foliageDark, j);
    }
  }

  // Asymmetric crown and loose upper shoots avoid the artificial Christmas-tree cone.
  const crown = new THREE.Mesh(foliageGeometry, foliageLight);
  crown.position.set(trunkX + (Math.random() - 0.5) * 0.16, 5.65 + Math.random() * 0.18, trunkZ + (Math.random() - 0.5) * 0.16);
  crown.scale.set(0.48 + Math.random() * 0.16, 0.82 + Math.random() * 0.2, 0.46 + Math.random() * 0.15);
  crown.rotation.set((Math.random() - 0.5) * 0.18, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.18);
  root.add(crown);

  const shoots = mobile ? 2 : 4;
  for (let i = 0; i < shoots; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const shoot = new THREE.Mesh(twigGeometry, i % 2 ? foliageMid : foliageLight);
    shoot.position.set(Math.cos(angle) * (0.28 + Math.random() * 0.25), 5.95 + Math.random() * 0.55, Math.sin(angle) * (0.28 + Math.random() * 0.25));
    shoot.scale.set(0.22 + Math.random() * 0.12, 0.14 + Math.random() * 0.1, 0.2 + Math.random() * 0.1);
    shoot.rotation.set(Math.random() * 0.35, angle, Math.random() * 0.35);
    root.add(shoot);
  }

  root.rotation.y = Math.random() * Math.PI * 2;
  root.rotation.z = (Math.random() - 0.5) * 0.035;
  root.scale.setScalar(scale);
  return root;
}

function createMountain(THREE: any, x: number, z: number, scale: number, color: number, themeParts: ThemePart[]) {
  const root = new THREE.Group();
  const mountainMat = themeMaterial(new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }), color, 0x5f7891, themeParts);
  const ridgeMat = themeMaterial(new THREE.MeshStandardMaterial({ color: 0x111722, roughness: 1, flatShading: true }), 0x111722, 0x7892a8, themeParts);
  const mountain = new THREE.Mesh(new THREE.ConeGeometry(7 * scale, 11 * scale, 32, 3), mountainMat); mountain.position.y = 5.5 * scale; mountain.rotation.y = 0.35; root.add(mountain);
  const ridge = new THREE.Mesh(new THREE.ConeGeometry(3.2 * scale, 5.4 * scale, 16, 2), ridgeMat); ridge.position.set(-1.7 * scale, 2.6 * scale, 1.5 * scale); ridge.rotation.z = -0.08; root.add(ridge);
  root.position.set(x, 0, z); return root;
}

function createCloud(THREE: any, x: number, y: number, z: number, scale: number, mobile: boolean, themeParts: ThemePart[]) {
  const root = new THREE.Group();
  const material = themeMaterial(new THREE.MeshBasicMaterial({ color: 0xb9c3cf, transparent: true, opacity: mobile ? 0.07 : 0.09, depthWrite: false }), 0x7e8794, 0xffffff, themeParts);
  const puffs = mobile ? 3 : 5;
  for (let i = 0; i < puffs; i += 1) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1, mobile ? 8 : 12, mobile ? 6 : 8), material);
    puff.position.set((i - (puffs - 1) / 2) * 1.25 + (Math.random() - 0.5) * 0.4, Math.sin(i) * 0.35, (Math.random() - 0.5) * 0.5);
    puff.scale.set(1.5 + Math.random() * 0.7, 0.55 + Math.random() * 0.35, 0.8 + Math.random() * 0.4);
    root.add(puff);
  }
  root.position.set(x, y, z); root.scale.setScalar(scale); return root;
}

function createLeaves(THREE: any, mobile: boolean) {
  const group = new THREE.Group();
  const count = mobile ? 80 : 150;
  const geometry = new THREE.PlaneGeometry(0.16, 0.09);
  const material = new THREE.MeshBasicMaterial({ color: 0x9c6a38, transparent: true, opacity: 0.82, side: THREE.DoubleSide, depthWrite: false });
  const data: LeafData[] = [];
  for (let i = 0; i < count; i += 1) {
    const leaf = new THREE.Mesh(geometry, material);
    const item = { x: (Math.random() - 0.5) * 20, y: 0.4 + Math.random() * 6.2, z: -2 - Math.random() * 46, phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.7, drift: 0.4 + Math.random() * 0.8, size: 0.65 + Math.random() * 1.35, rotation: Math.random() * Math.PI * 2 };
    leaf.position.set(item.x, item.y, item.z); leaf.scale.setScalar(item.size); leaf.rotation.z = item.rotation; group.add(leaf); data.push(item);
  }
  return { group, data };
}

function createMoonTexture(THREE: any) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) return null;
  ctx.fillStyle = '#f4ead0'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i += 1) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 4 + Math.random() * 18;
    ctx.fillStyle = `rgba(105,105,105,${0.08 + Math.random() * 0.15})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function createMoonGlowTexture(THREE: any) {
  const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d'); if (!ctx) return null;
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64); gradient.addColorStop(0, 'rgba(255,247,215,0.72)'); gradient.addColorStop(0.2, 'rgba(255,230,160,0.3)'); gradient.addColorStop(1, 'rgba(255,220,130,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function createSkyTexture(THREE: any) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#050814'); g.addColorStop(0.45, '#0d1830'); g.addColorStop(0.7, '#334e68'); g.addColorStop(0.86, '#d47a5a'); g.addColorStop(1, '#f2a35c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
  const halo = ctx.createRadialGradient(256, 420, 12, 256, 420, 190); halo.addColorStop(0, 'rgba(255,195,110,0.42)'); halo.addColorStop(1, 'rgba(255,160,80,0)'); ctx.fillStyle = halo; ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function disposeObject(THREE: any, object: any) {
  object.traverse((child: any) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material: any) => {
        Object.keys(material).forEach((key) => {
          const value = material[key];
          if (value && value.isTexture) value.dispose();
        });
        material.dispose();
      });
    }
  });
}

function createScene(THREE: any, canvas: HTMLCanvasElement, mobile: boolean, day: boolean): ThreeState {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.8)); renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(day ? 0x9db3c6 : 0x050814, day ? 0.018 : 0.024);
  const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 160); camera.position.set(0, 2.5, 6.5);
  const group = new THREE.Group(); scene.add(group);
  const themeParts: ThemePart[] = [];
  const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 20), new THREE.MeshBasicMaterial({ map: createSkyTexture(THREE), side: THREE.BackSide, fog: false })); sky.rotation.y = Math.PI; scene.add(sky);
  const moonMaterial = new THREE.MeshStandardMaterial({ map: createMoonTexture(THREE), color: 0xf7edd0, roughness: 0.88, metalness: 0.02, emissive: 0x8b6f45, emissiveIntensity: 0.12 });
  const moon = new THREE.Mesh(new THREE.SphereGeometry(2.65, mobile ? 20 : 32, mobile ? 16 : 24), moonMaterial); moon.position.set(7.0, 20.8, -44); scene.add(moon);
  const glowTexture = createMoonGlowTexture(THREE);
  const glowMaterial = new THREE.SpriteMaterial({ map: glowTexture, color: 0xffd68a, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow = new THREE.Sprite(glowMaterial); glow.scale.set(11, 11, 1); glow.position.copy(moon.position); scene.add(glow);
  const glow2Material = new THREE.SpriteMaterial({ map: glowTexture, color: 0xffb35c, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow2 = new THREE.Sprite(glow2Material); glow2.scale.set(22, 22, 1); glow2.position.copy(moon.position); scene.add(glow2);
  const moonLight = new THREE.DirectionalLight(0xffe2b7, 1.4); moonLight.position.copy(moon.position); scene.add(moonLight);
  const moonPoint = new THREE.PointLight(0xffb86b, 0.55, 80, 2); moonPoint.position.copy(moon.position); scene.add(moonPoint);
  const hemi = new THREE.HemisphereLight(day ? 0xbad4e8 : 0x18233d, day ? 0x405a45 : 0x020305, day ? 1.2 : 0.42); scene.add(hemi);
  const fill = new THREE.DirectionalLight(day ? 0xffd7ad : 0x6077a8, day ? 1.5 : 0.25); fill.position.set(-10, 16, 10); scene.add(fill);
  const toriiCount = mobile ? 10 : 13;
  for (let i = 0; i < toriiCount; i += 1) { const torii = createTorii(THREE, 0x611a19, themeParts); torii.position.set((Math.random() - 0.5) * 4.4, 0, -4 - i * 4.2); torii.scale.setScalar(0.82 + Math.random() * 0.2); group.add(torii); const lanternL = createLantern(THREE, i % 3 === 0, themeParts); lanternL.position.set(-2.45, 0, torii.position.z + 0.1); group.add(lanternL); const lanternR = createLantern(THREE, false, themeParts); lanternR.position.set(2.45, 0, torii.position.z + 0.1); group.add(lanternR); }
  const treeCount = mobile ? 16 : 28;
  for (let i = 0; i < treeCount; i += 1) { const side = i % 2 === 0 ? -1 : 1; const tree = createTree(THREE, 0.7 + Math.random() * 0.5, themeParts, mobile); tree.position.set(side * (3.8 + Math.random() * 3.8), 0, -3 - Math.random() * 52); group.add(tree); }
  const mountains = [[-13, -49, 1.55, 0x0b1018], [-3, -58, 2.25, 0x070b12], [9, -53, 1.85, 0x0a0e16], [17, -68, 2.3, 0x080b11]];
  mountains.forEach(([x, z, s, c]) => group.add(createMountain(THREE, x as number, z as number, s as number, c as number, themeParts)));
  const clouds: CloudData[] = [];
  const cloudSpecs = [[-8, 10, -18, 1.7], [7, 13, -27, 2.2], [-5, 16, -38, 2.6], [10, 8, -47, 2.4]];
  cloudSpecs.forEach(([x, y, z, s], index) => { const cloud = createCloud(THREE, x as number, y as number, z as number, s as number, mobile, themeParts); group.add(cloud); clouds.push({ group: cloud, baseX: x as number, baseY: y as number, speed: 0.04 + index * 0.012, phase: index * 1.4 }); });
  const leafSet = createLeaves(THREE, mobile); group.add(leafSet.group);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 150), new THREE.MeshStandardMaterial({ color: day ? 0x304936 : 0x050b09, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.04, -44); group.add(floor);
  const applyTheme = (isDay: boolean) => {
    themeParts.forEach(({ material, night, day: dayColor }) => material.color.setHex(isDay ? dayColor : night));
    scene.fog.color.setHex(isDay ? 0x9db3c6 : 0x050814); scene.fog.density = isDay ? 0.018 : 0.024;
    hemi.color.setHex(isDay ? 0xbad4e8 : 0x18233d); hemi.groundColor.setHex(isDay ? 0x405a45 : 0x020305); hemi.intensity = isDay ? 1.2 : 0.42;
    fill.color.setHex(isDay ? 0xffd7ad : 0x6077a8); fill.intensity = isDay ? 1.5 : 0.25;
    moonMaterial.color.setHex(isDay ? 0xffd59b : 0xf7edd0); moonMaterial.emissive.setHex(isDay ? 0xffa24a : 0x8b6f45); moonMaterial.emissiveIntensity = isDay ? 0.38 : 0.12;
    glowMaterial.color.setHex(isDay ? 0xff9b3d : 0xffd68a); glowMaterial.opacity = isDay ? 0.24 : 0.35; glow2Material.color.setHex(isDay ? 0xff7b24 : 0xffb35c); glow2Material.opacity = isDay ? 0.11 : 0.16;
    moonLight.color.setHex(isDay ? 0xffb26a : 0xffe2b7); moonLight.intensity = isDay ? 2.4 : 1.4; moonPoint.color.setHex(isDay ? 0xff8c38 : 0xffb86b); moonPoint.intensity = isDay ? 0.8 : 0.55;
    floor.material.color.setHex(isDay ? 0x304936 : 0x050b09);
  };
  applyTheme(day);
  return { renderer, scene, camera, group, leaves: leafSet.group, leafData: leafSet.data, clouds, themeParts, moonMaterial, glowMaterial, glow2Material, moonLight, moonPoint, applyTheme };
}

export default function KageCameraExperience() {
  const sectionRef = useRef<HTMLElement | null>(null); const canvasRef = useRef<HTMLCanvasElement | null>(null); const [active, setActive] = useState(0);
  useEffect(() => {
    const section = sectionRef.current; const canvas = canvasRef.current; if (!section || !canvas) return;
    let state: ThreeState | null = null; let raf = 0; let scrollRaf = 0; let mounted = true; let visible = true; let targetScroll = 0; let currentScroll = 0; let targetX = 0; let currentX = 0;
    const mobile = window.matchMedia('(max-width: 767px)').matches; const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDay = () => !document.documentElement.classList.contains('dark');
    const syncTheme = () => state?.applyTheme(isDay());
    loadThree().then((THREE) => {
      if (!mounted) return; const day = isDay(); state = createScene(THREE, canvas, mobile, day);
      const resize = () => { if (!state) return; const width = Math.max(1, canvas.clientWidth); const height = Math.max(1, canvas.clientHeight); state.camera.aspect = width / height; state.camera.updateProjectionMatrix(); state.renderer.setSize(width, height, false); };
      resize();
      const updateScroll = () => { scrollRaf = 0; const rect = section.getBoundingClientRect(); const max = Math.max(1, section.offsetHeight - window.innerHeight); targetScroll = Math.min(1, Math.max(0, -rect.top / max)); setActive(Math.min(chapters.length - 1, Math.floor(targetScroll * chapters.length))); };
      const onScroll = () => { if (!scrollRaf) scrollRaf = window.requestAnimationFrame(updateScroll); };
      const onPointer = (event: PointerEvent) => { if (mobile) return; targetX = (event.clientX / window.innerWidth - 0.5) * 0.55; };
      const tick = (time: number) => { raf = window.requestAnimationFrame(tick); if (!state || !visible) return; currentScroll += (targetScroll - currentScroll) * 0.075; currentX += (targetX - currentX) * 0.06; const depth = currentScroll * 46; state.camera.position.z = 6.5 - depth; state.camera.position.y = 2.5 + Math.sin(currentScroll * Math.PI) * 0.35; state.camera.position.x = currentX * (0.8 + currentScroll * 1.8); state.camera.rotation.x = -0.02 + currentScroll * 0.012; state.camera.rotation.y = currentX * 0.16; state.group.position.x = Math.sin(currentScroll * Math.PI * 2.4) * 0.18; state.group.position.y = Math.sin(time * 0.0003) * 0.015;
        state.leafData.forEach((leaf, i) => { const mesh = state!.leaves.children[i]; mesh.position.x = leaf.x + Math.sin(time * 0.001 * leaf.speed + leaf.phase) * leaf.drift; mesh.position.y = leaf.y + Math.sin(time * 0.0015 * leaf.speed + leaf.phase) * 0.28; mesh.rotation.z = leaf.rotation + Math.sin(time * 0.0012 * leaf.speed + leaf.phase) * 0.7; });
        state.clouds.forEach((cloud) => { cloud.group.position.x = cloud.baseX + Math.sin(time * cloud.speed + cloud.phase) * 1.3; cloud.group.position.y = cloud.baseY + Math.sin(time * cloud.speed * 0.7 + cloud.phase) * 0.25; });
        state.renderer.render(state.scene, state.camera);
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.01 }); observer.observe(section);
      const themeObserver = new MutationObserver(syncTheme); themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', resize); window.addEventListener('pointermove', onPointer, { passive: true }); updateScroll(); tick(0);
      const cleanup = () => { observer.disconnect(); themeObserver.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onPointer); cancelAnimationFrame(raf); if (scrollRaf) cancelAnimationFrame(scrollRaf); if (state) { disposeObject(THREE, state.scene); state.renderer.dispose(); } };
      (canvas as any).__kageCleanup = cleanup;
    }).catch(() => {});
    return () => { mounted = false; const cleanup = (canvas as any).__kageCleanup; if (cleanup) cleanup(); };
  }, []);
  return <section ref={sectionRef} className="relative h-[420vh] overflow-clip bg-black"><div className="sticky top-0 h-screen overflow-hidden"><canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Kage camera 3D experience" /><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.58)_100%)]" /><div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" /><div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-6xl items-end justify-between gap-8 px-6 pb-10 md:px-10"><div className="max-w-xl text-white"><p className="mb-4 text-[10px] font-semibold tracking-[0.35em] text-white/55">{chapters[active].kicker}</p><h2 className="whitespace-pre-line text-4xl font-semibold leading-[0.92] tracking-[-0.04em] md:text-7xl">{chapters[active].title}</h2><p className="mt-5 max-w-md text-sm leading-6 text-white/60 md:text-base">{chapters[active].body}</p></div><div className="hidden items-center gap-3 text-[10px] tracking-[0.3em] text-white/45 md:flex"><span>SCROLL</span><span className="h-px w-16 bg-white/20" /></div></div></div></section>;
}
