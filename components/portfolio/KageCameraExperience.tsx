'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { kicker: '01 / ENTER', title: 'Bienvenue\ndans la nuit.', body: 'Une traversée immersive de mon univers digital — la caméra avance réellement dans le décor à mesure que tu scrolles.' },
  { kicker: '02 / CRAFT', title: 'Design qui\nprend vie.', body: 'Le chemin, les portiques, les lanternes et la brume défilent avec une profondeur progressive.' },
  { kicker: '03 / EXPERIMENT', title: 'Code. 3D.\nInteraction.', body: 'Scroll, perspective, parallaxe et mouvement de caméra se combinent pour donner une vraie sensation de voyage.' },
  { kicker: '04 / WORK', title: 'Entre dans\nmes projets.', body: 'Continue d’avancer pour quitter la nuit et rejoindre mes réalisations.' },
];

const TAU = Math.PI * 2;

type WorldObject = {
  z: number;
  x: number;
  y: number;
  width: number;
  height: number;
  kind: 'gate' | 'lantern' | 'tree';
  side?: -1 | 1;
  phase: number;
};

type Particle = { x: number; y: number; z: number; speed: number; size: number };

export default function KageCameraExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let last = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let smoothX = 0.5;
    let smoothY = 0.5;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const objects: WorldObject[] = [];
    for (let i = 0; i < 12; i++) {
      objects.push({ z: i * 8 + 4, x: 0, y: 0, width: 7.5 - i * 0.05, height: 8, kind: 'gate', phase: i * 0.7 });
      objects.push({ z: i * 8 + 4.5, x: -1.9, y: 1.15, width: 0.45, height: 1.1, kind: 'lantern', side: -1, phase: i * 1.2 });
      objects.push({ z: i * 8 + 5.1, x: 1.9, y: 1.2, width: 0.45, height: 1.1, kind: 'lantern', side: 1, phase: i * 1.7 });
      if (i % 2 === 0) {
        objects.push({ z: i * 8 + 6, x: -3.2, y: 1.6, width: 1.2, height: 3.8, kind: 'tree', side: -1, phase: i });
        objects.push({ z: i * 8 + 7, x: 3.2, y: 1.7, width: 1.3, height: 4.2, kind: 'tree', side: 1, phase: i + 1 });
      }
    }

    const particles: Particle[] = Array.from({ length: reduced ? 45 : 120 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 96,
      speed: 4 + Math.random() * 12,
      size: 0.5 + Math.random() * 1.8,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const move = (e: PointerEvent) => {
      pointerX = e.clientX / Math.max(window.innerWidth, 1);
      pointerY = e.clientY / Math.max(window.innerHeight, 1);
    };
    window.addEventListener('pointermove', move, { passive: true });

    const project = (x: number, y: number, z: number, w: number, h: number, cameraZ: number) => {
      const depth = z - cameraZ;
      if (depth <= 0.25) return null;
      const focal = Math.min(w, h) * 0.86;
      const horizon = h * 0.56;
      const px = w * 0.5 + (x + (smoothX - 0.5) * depth * 0.018) * focal / depth;
      const py = horizon + (y - (smoothY - 0.5) * depth * 0.012) * focal / depth;
      return { x: px, y: py, scale: focal / depth };
    };

    const drawGate = (obj: WorldObject, cameraZ: number, w: number, h: number) => {
      const p = project(obj.x, obj.y, obj.z, w, h, cameraZ);
      if (!p) return;
      const s = p.scale;
      const gateW = obj.width * s;
      const gateH = obj.height * s;
      const alpha = Math.min(0.62, Math.max(0.07, 0.7 - (obj.z - cameraZ) / 125));
      ctx.strokeStyle = `rgba(166,112,68,${alpha})`;
      ctx.lineWidth = Math.max(0.7, 2.8 * s);
      ctx.beginPath();
      ctx.moveTo(p.x - gateW, p.y);
      ctx.lineTo(p.x - gateW * 0.82, p.y - gateH);
      ctx.lineTo(p.x + gateW * 0.82, p.y - gateH);
      ctx.lineTo(p.x + gateW, p.y);
      ctx.stroke();
      ctx.strokeStyle = `rgba(214,155,91,${alpha * 0.48})`;
      ctx.lineWidth = Math.max(0.6, 1.5 * s);
      ctx.beginPath();
      ctx.moveTo(p.x - gateW * 1.12, p.y - gateH * 0.93);
      ctx.lineTo(p.x + gateW * 1.12, p.y - gateH * 0.93);
      ctx.stroke();
    };

    const drawLantern = (obj: WorldObject, cameraZ: number, w: number, h: number, time: number) => {
      const sway = reduced ? 0 : Math.sin(time * 0.0012 + obj.phase) * 0.035;
      const p = project(obj.x + sway, obj.y, obj.z, w, h, cameraZ);
      if (!p) return;
      const s = Math.max(0.35, p.scale);
      const r = Math.max(1.5, 32 * s);
      const glow = ctx.createRadialGradient(p.x, p.y - 8 * s, 0, p.x, p.y - 8 * s, r * 5);
      glow.addColorStop(0, 'rgba(242,180,94,.26)');
      glow.addColorStop(0.3, 'rgba(205,130,57,.09)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(p.x - r * 5, p.y - r * 5, r * 10, r * 10);
      ctx.fillStyle = 'rgba(241,181,99,.88)';
      ctx.fillRect(p.x - 4 * s, p.y - 13 * s, 8 * s, 13 * s);
      ctx.strokeStyle = 'rgba(84,47,25,.85)';
      ctx.lineWidth = Math.max(0.7, s);
      ctx.strokeRect(p.x - 6 * s, p.y - 16 * s, 12 * s, 18 * s);
    };

    const drawTree = (obj: WorldObject, cameraZ: number, w: number, h: number) => {
      const p = project(obj.x, obj.y, obj.z, w, h, cameraZ);
      if (!p) return;
      const s = p.scale;
      const height = obj.height * s;
      const width = obj.width * s * 2.2;
      ctx.fillStyle = 'rgba(2,7,8,.82)';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - height);
      ctx.lineTo(p.x - width, p.y);
      ctx.lineTo(p.x + width, p.y);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(p.x - Math.max(1, s * 1.8), p.y - height * 0.45, Math.max(3, s * 3.6), height * 0.45);
    };

    const draw = (time: number) => {
      const dt = Math.min((time - last) / 16.67 || 1, 2);
      last = time;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      smoothX += (pointerX - smoothX) * (reduced ? 0.025 : 0.055);
      smoothY += (pointerY - smoothY) * (reduced ? 0.025 : 0.055);

      const cameraZ = progressRef.current * 84;
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#02040a');
      sky.addColorStop(0.5, '#080d16');
      sky.addColorStop(0.78, '#100f11');
      sky.addColorStop(1, '#020202');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const moonX = w * (0.74 + (smoothX - 0.5) * 0.05);
      const moonY = h * (0.2 + (smoothY - 0.5) * 0.02);
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, h * 0.3);
      moonGlow.addColorStop(0, 'rgba(239,219,180,.2)');
      moonGlow.addColorStop(0.2, 'rgba(205,166,113,.07)');
      moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(235,224,202,.9)';
      ctx.beginPath();
      ctx.arc(moonX, moonY, Math.min(w, h) * 0.047, 0, TAU);
      ctx.fill();

      // Distant mountains shift subtly with the camera and pointer.
      for (let layer = 0; layer < 3; layer++) {
        const base = 0.63 + layer * 0.075;
        const amp = h * (0.045 + layer * 0.018);
        const shift = cameraZ * (0.008 + layer * 0.012) + smoothX * (1.8 + layer);
        ctx.fillStyle = layer === 0 ? '#060910' : layer === 1 ? '#080a0e' : '#0a090b';
        ctx.beginPath();
        ctx.moveTo(-20, h * base);
        for (let x = -20; x <= w + 20; x += 28) {
          const y = h * base - Math.sin(x * 0.006 + shift) * amp - Math.sin(x * 0.014 + shift * 1.6) * amp * 0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + 20, h);
        ctx.lineTo(-20, h);
        ctx.closePath();
        ctx.fill();
      }

      // Ground plane: two converging rails make the forward camera motion readable.
      const horizon = h * 0.56;
      const cx = w * 0.5 + (smoothX - 0.5) * 55;
      ctx.fillStyle = 'rgba(21,18,17,.88)';
      ctx.beginPath();
      ctx.moveTo(cx - 18, horizon);
      ctx.lineTo(cx + 18, horizon);
      ctx.lineTo(w * 0.74, h);
      ctx.lineTo(w * 0.26, h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(173,122,73,.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 18, horizon);
      ctx.lineTo(w * 0.26, h);
      ctx.moveTo(cx + 18, horizon);
      ctx.lineTo(w * 0.74, h);
      ctx.stroke();

      objects
        .filter((o) => o.z - cameraZ > 0.2 && o.z - cameraZ < 110)
        .sort((a, b) => b.z - cameraZ - (a.z - cameraZ))
        .forEach((o) => {
          if (o.kind === 'gate') drawGate(o, cameraZ, w, h);
          else if (o.kind === 'lantern') drawLantern(o, cameraZ, w, h, time);
          else drawTree(o, cameraZ, w, h);
        });

      particles.forEach((p) => {
        if (!reduced) p.z -= p.speed * 0.01 * dt;
        if (p.z < 0.5) {
          p.z = 96;
          p.x = Math.random() * 2 - 1;
          p.y = Math.random() * 2 - 1;
        }
        const worldZ = cameraZ + p.z;
        const projected = project(p.x * 4, p.y * 3, worldZ, w, h, cameraZ);
        if (!projected) return;
        const alpha = Math.min(0.55, 0.05 + (1 - p.z / 96) * 0.5);
        ctx.fillStyle = `rgba(221,192,153,${alpha})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, p.size * (1 + projected.scale * 0.8), 0, TAU);
        ctx.fill();
      });

      const fog = ctx.createLinearGradient(0, h * 0.52, 0, h);
      fog.addColorStop(0, 'rgba(155,160,158,0)');
      fog.addColorStop(0.55, 'rgba(155,160,158,.035)');
      fog.addColorStop(1, 'rgba(155,160,158,.12)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, h * 0.48, w, h * 0.52);

      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.15, w * 0.5, h * 0.5, h * 0.8);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.72, 'rgba(0,0,0,.12)');
      vignette.addColorStop(1, 'rgba(0,0,0,.74)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('kage-experience');
      if (!el) return;
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      progressRef.current = p;
      setProgress(p);
      setChapter(Math.min(chapters.length - 1, Math.floor(p * chapters.length)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = chapters[chapter];

  return (
    <section id="kage-experience" className="relative h-[500vh] bg-[#02040a] text-[#eee8dd]" aria-label="Expérience immersive avec caméra en mouvement">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,transparent_18%,rgba(0,0,0,.18)_62%,rgba(0,0,0,.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-7 sm:px-10 sm:py-9 lg:px-16">
          <div className="flex items-start justify-between text-[9px] uppercase tracking-[0.32em] text-white/45 sm:text-[10px]">
            <span>DJAM / DIGITAL CREATIVE</span>
            <span className="hidden sm:block">Forward camera journey</span>
          </div>

          <div className="max-w-5xl pb-14 sm:pb-20 lg:pb-24">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#d1a66d] sm:text-xs">
              <span className="h-px w-10 bg-[#d1a66d]/70" />
              <span>{active.kicker}</span>
            </div>
            <h2 className="whitespace-pre-line text-[clamp(3.3rem,8vw,9.5rem)] font-light leading-[.86] tracking-[-0.065em]">{active.title}</h2>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">{active.body}</p>
          </div>

          <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between sm:bottom-9 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.25em] text-white/35">
              <span className="hidden sm:inline">Scroll to move forward</span>
              <span className="h-px w-16 bg-white/15"><span className="block h-px bg-[#d1a66d] transition-[width] duration-300" style={{ width: `${Math.max(5, progress * 100)}%` }} /></span>
            </div>
            <div className="flex items-end gap-4">
              <div className="hidden text-right text-[8px] uppercase leading-4 tracking-[0.25em] text-white/30 sm:block">Camera<br />moving through space</div>
              <div className="h-16 w-px bg-white/15"><div className="w-px bg-[#d1a66d] transition-[height] duration-300" style={{ height: `${Math.max(8, progress * 100)}%` }} /></div>
              <span className="font-mono text-xs text-white/55">0{chapter + 1} / 0{chapters.length}</span>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" aria-hidden="true">
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d1a66d] shadow-[0_0_18px_rgba(209,166,109,.8)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
