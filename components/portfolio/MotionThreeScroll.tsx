'use client';

import { useEffect, useRef } from 'react';
import { cancelFrame, frame, motionValue, scroll, transformValue } from 'motion';
import { threeEffect } from 'motion/three';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MINT = '#a3e635';

function createLogoShapes() {
  const left = new THREE.Shape();
  left.moveTo(9.587, 9);
  left.lineTo(4.57, 0);
  left.lineTo(0, 0);
  left.lineTo(3.917, 7.028);
  left.bezierCurveTo(4.524, 8.117, 6.039, 9, 7.301, 9);

  const middle = new THREE.Shape();
  middle.moveTo(10.443, 9);
  middle.lineTo(15.013, 9);
  middle.lineTo(9.997, 0);
  middle.lineTo(5.427, 0);

  const right = new THREE.Shape();
  right.moveTo(15.841, 9);
  right.lineTo(20.411, 9);
  right.lineTo(16.494, 1.972);
  right.bezierCurveTo(15.887, 0.883, 14.372, 0, 13.11, 0);
  right.lineTo(10.825, 0);

  const dot = new THREE.Shape();
  dot.absarc(23.079, 6.75, 2.285, 0, Math.PI * 2);

  return [left, middle, right, dot];
}

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
    let geometry: THREE.ExtrudeGeometry | null = null;
    let wireGeometry: THREE.EdgesGeometry | null = null;
    let wireMaterial: THREE.LineDashedMaterial | null = null;
    let fillMaterial: THREE.MeshPhysicalMaterial | null = null;
    let environmentTarget: THREE.WebGLRenderTarget | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let cancelScroll: (() => void) | undefined;
    let cleanupWireEffect: (() => void) | undefined;
    let cleanupFillEffect: (() => void) | undefined;
    let cleanupLogoEffect: (() => void) | undefined;
    let stopped = false;

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
      renderer.toneMappingExposure = 1.1;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
      camera.position.set(0, 0.6, 7.5);
      camera.lookAt(0, 0, 0);

      pmrem = new THREE.PMREMGenerator(renderer);
      environmentTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = environmentTarget.texture;

      geometry = new THREE.ExtrudeGeometry(createLogoShapes(), {
        depth: 1.6,
        bevelEnabled: false,
        curveSegments: 12,
      });
      geometry.center();
      geometry.scale(4 / 25.364, 4 / 25.364, 4 / 25.364);

      const logo = new THREE.Group();
      scene.add(logo);

      wireMaterial = new THREE.LineDashedMaterial({
        color: MINT,
        transparent: true,
        dashSize: 0,
        gapSize: 1,
      });

      wireGeometry = new THREE.EdgesGeometry(geometry, 20);
      const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
      wire.computeLineDistances();

      const distances = wire.geometry.attributes.lineDistance.array as ArrayLike<number>;
      const wireLength = distances[distances.length - 1] ?? 1;
      wireMaterial.gapSize = wireLength * 10;
      logo.add(wire);

      fillMaterial = new THREE.MeshPhysicalMaterial({
        color: MINT,
        metalness: 1,
        roughness: 0.15,
        transparent: true,
        opacity: 0,
      });

      const fill = new THREE.Mesh(geometry, fillMaterial);
      logo.add(fill);

      const progress = motionValue(0);
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      const drawn = transformValue(() => clamp(progress.get() / 0.6));
      const filled = transformValue(() => clamp((progress.get() - 0.5) / 0.4));

      cleanupWireEffect = threeEffect(wireMaterial, {
        dashSize: transformValue(() => wireLength * drawn.get()),
        opacity: transformValue(() => 1 - filled.get() * 0.9),
      });

      cleanupFillEffect = threeEffect(fillMaterial, { opacity: filled });

      cleanupLogoEffect = threeEffect(logo, {
        rotateY: transformValue(() => -50 + progress.get() * 70),
        rotateX: transformValue(() => 25 - progress.get() * 25),
        rotateZ: transformValue(() => progress.get() * 4),
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
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);

      const render = () => {
        if (stopped || !renderer || !scene || !camera) return;
        renderer.render(scene, camera);
      };

      frame.render(render, true);

      return () => {
        stopped = true;
        cancelScroll?.();
        cleanupWireEffect?.();
        cleanupFillEffect?.();
        cleanupLogoEffect?.();
        resizeObserver.disconnect();
        cancelFrame(render);

        environmentTarget?.dispose();
        pmrem?.dispose();
        geometry?.dispose();
        wireGeometry?.dispose();
        wireMaterial?.dispose();
        fillMaterial?.dispose();
        renderer?.dispose();
      };
    } catch (error) {
      console.error('Motion Three scroll effect failed to initialise:', error);

      return () => {
        stopped = true;
        cancelScroll?.();
        cleanupWireEffect?.();
        cleanupFillEffect?.();
        cleanupLogoEffect?.();
        environmentTarget?.dispose();
        pmrem?.dispose();
        geometry?.dispose();
        wireGeometry?.dispose();
        wireMaterial?.dispose();
        fillMaterial?.dispose();
        renderer?.dispose();
      };
    }
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
              Motion / Three.js
            </p>
            <h2 className="max-w-xl font-[family-name:var(--font-inter-tight)] text-3xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Scroll to draw
            </h2>
          </div>

          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">
            03 / 06
          </span>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,.11),transparent_32%)]" />

          <div className="relative w-full max-w-[760px]">
            <canvas
              ref={canvasRef}
              aria-label="Animation 3D contrôlée par le défilement"
              className="mx-auto block aspect-[3/2] w-full max-w-[680px]"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-px max-w-[520px] bg-gradient-to-r from-transparent via-lime-300/30 to-transparent" />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1450px] items-end justify-between gap-6">
          <p className="max-w-xs font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/35">
            Une forme 3D se dessine progressivement pendant ton scroll.
          </p>

          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
              Scroll interaction
            </p>
            <p className="mt-1 text-xs text-white/50">Motion + Three.js</p>
          </div>
        </div>
      </div>
    </section>
  );
}
