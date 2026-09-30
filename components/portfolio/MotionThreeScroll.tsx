'use client';

import { useEffect, useRef } from 'react';
import { cancelFrame, frame, motionValue, scroll, transformValue } from 'motion';
import { threeEffect } from 'motion/three';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MINT = '#a3e635';
const NAME = 'Djamaldine®';

export default function MotionThreeScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;

    if (!canvas || !track) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let geometry: TextGeometry | null = null;
    let wireGeometry: THREE.EdgesGeometry | null = null;
    let wireMaterial: THREE.LineDashedMaterial | null = null;
    let fillMaterial: THREE.MeshPhysicalMaterial | null = null;
    let glowMaterial: THREE.MeshBasicMaterial | null = null;
    let environmentTarget: THREE.WebGLRenderTarget | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let cancelScroll: (() => void) | undefined;
    let cleanupWireEffect: (() => void) | undefined;
    let cleanupFillEffect: (() => void) | undefined;
    let cleanupTextEffect: (() => void) | undefined;
    let cleanupGlowEffect: (() => void) | undefined;
    let stopped = false;

    const dispose = () => {
      stopped = true;
      cancelScroll?.();
      cleanupWireEffect?.();
      cleanupFillEffect?.();
      cleanupTextEffect?.();
      cleanupGlowEffect?.();

      environmentTarget?.dispose();
      pmrem?.dispose();
      geometry?.dispose();
      wireGeometry?.dispose();
      wireMaterial?.dispose();
      fillMaterial?.dispose();
      glowMaterial?.dispose();
      renderer?.dispose();
    };

    const init = async () => {
      try {
        const width = Math.max(canvas.clientWidth, 1);
        const height = Math.max(canvas.clientHeight, 1);

        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
        camera.position.set(0, 0.05, width < 520 ? 9.4 : 8.1);
        camera.lookAt(0, 0, 0);

        pmrem = new THREE.PMREMGenerator(renderer);
        environmentTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = environmentTarget.texture;

        scene.add(new THREE.AmbientLight(0xffffff, 0.22));

        const keyLight = new THREE.DirectionalLight(0xeaffb0, 2.3);
        keyLight.position.set(4, 5, 7);
        scene.add(keyLight);

        const rimLight = new THREE.PointLight(0x94ff2e, 14, 14);
        rimLight.position.set(-4, -1.2, 3.5);
        scene.add(rimLight);

        const font = await new FontLoader().loadAsync('/fonts/helvetiker_bold.typeface.json');

        if (stopped) return;

        geometry = new TextGeometry(NAME, {
          font,
          size: 1.28,
          depth: 0.42,
          curveSegments: 10,
          bevelEnabled: true,
          bevelThickness: 0.045,
          bevelSize: 0.028,
          bevelSegments: 3,
        });

        geometry.computeBoundingBox();

        const bounds = geometry.boundingBox;
        const textWidth = bounds ? bounds.max.x - bounds.min.x : 8;
        const fitScale = Math.min(1, 6.75 / textWidth);
        geometry.scale(fitScale, fitScale, fitScale);
        geometry.center();

        const text = new THREE.Group();
        text.position.set(0, -0.2, 0);
        scene.add(text);

        wireGeometry = new THREE.EdgesGeometry(geometry, 15);
        wireMaterial = new THREE.LineDashedMaterial({
          color: MINT,
          transparent: true,
          opacity: 0.95,
          dashSize: 0,
          gapSize: 1,
          toneMapped: false,
        });

        const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
        wire.computeLineDistances();

        const distances = wire.geometry.attributes.lineDistance.array as ArrayLike<number>;
        const wireLength = distances[distances.length - 1] ?? 1;
        wireMaterial.gapSize = wireLength * 12;
        text.add(wire);

        fillMaterial = new THREE.MeshPhysicalMaterial({
          color: MINT,
          metalness: 0.95,
          roughness: 0.16,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          transparent: true,
          opacity: 0,
        });

        const fill = new THREE.Mesh(geometry, fillMaterial);
        text.add(fill);

        glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x6eff00,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const glow = new THREE.Mesh(geometry.clone(), glowMaterial);
        glow.scale.setScalar(1.006);
        text.add(glow);

        const progress = motionValue(0);
        const clamp = (value: number) => Math.min(1, Math.max(0, value));
        const drawn = transformValue(() => clamp(progress.get() / 0.58));
        const filled = transformValue(() => clamp((progress.get() - 0.44) / 0.42));

        cleanupWireEffect = threeEffect(wireMaterial, {
          dashSize: transformValue(() => wireLength * drawn.get()),
          opacity: transformValue(() => drawn.get() * (0.98 - filled.get() * 0.86)),
        });

        cleanupFillEffect = threeEffect(fillMaterial, {
          opacity: transformValue(() => filled.get() * 0.92),
        });

        cleanupGlowEffect = threeEffect(glowMaterial, {
          opacity: transformValue(() => filled.get() * 0.045),
        });

        cleanupTextEffect = threeEffect(text, {
          rotateY: transformValue(() => -48 + progress.get() * 62),
          rotateX: transformValue(() => 16 - progress.get() * 16),
          rotateZ: transformValue(() => -2 + progress.get() * 2),
          scale: transformValue(() => 0.9 + progress.get() * 0.1),
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          progress.set(1);
        } else {
          cancelScroll = scroll((value) => progress.set(value), {
            target: track,
          });
        }

        const resize = () => {
          if (!renderer || !camera) return;

          const nextWidth = Math.max(canvas.clientWidth, 1);
          const nextHeight = Math.max(canvas.clientHeight, 1);

          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.setSize(nextWidth, nextHeight, false);
          camera.aspect = nextWidth / nextHeight;
          camera.position.z = nextWidth < 520 ? 9.4 : 8.1;
          camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const render = () => {
          if (stopped || !renderer || !scene || !camera) return;

          rimLight.position.x = -4 + Math.sin(performance.now() * 0.00045) * 1.2;
          renderer.render(scene, camera);
        };

        frame.render(render, true);

        return () => {
          resizeObserver.disconnect();
          cancelFrame(render);
          dispose();
        };
      } catch (error) {
        console.error('Djamaldine 3D effect failed to initialise:', error);
        dispose();
      }
    };

    void init();

    return () => {
      dispose();
    };
  }, []);

  return (
    <section
      id="motion-three"
      ref={trackRef}
      className="relative h-[320vh] w-full overflow-clip bg-[#050806] text-white"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1450px] items-start justify-between gap-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-lime-300/60">
              Identity / Three.js
            </p>
            <h2 className="max-w-xl font-[family-name:var(--font-inter-tight)] text-3xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Djamaldine in 3D
            </h2>
          </div>

          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">
            03 / 06
          </span>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-[900px]">
            <canvas
              ref={canvasRef}
              aria-label="Le nom Djamaldine en 3D animé au scroll"
              className="relative mx-auto block aspect-[16/7] w-full max-w-[860px]"
            />
          </div>
        </div>

        <div className="mx-auto h-8 w-full max-w-[1450px]" aria-hidden="true" />
      </div>
    </section>
  );
}
