'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { kicker: '01 / ENTER', title: 'Bienvenue\ndans la nuit.', body: 'Une traversée immersive de mon univers digital — là où design, code et mouvement deviennent une seule expérience.' },
  { kicker: '02 / CRAFT', title: 'Design qui\nprend vie.', body: 'Des interfaces pensées avec précision, puis animées pour donner une vraie sensation de matière et de profondeur.' },
  { kicker: '03 / EXPERIMENT', title: 'Code. 3D.\nInteraction.', body: 'WebGL, motion, profondeur et micro-interactions se rencontrent pour créer des expériences que l’on ressent autant qu’on les regarde.' },
  { kicker: '04 / WORK', title: 'Entre dans\nmes projets.', body: 'Le voyage continue avec mes réalisations, mes expérimentations et les systèmes que je construis.' },
];

const TAU = Math.PI * 2;

type Particle = { x: number; y: number; z: number; speed: number; size: number; phase: number };
type Lantern = { x: number; y: number; z: number; sway: number; phase: number };

export default function KageExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let smoothX = 0.5;
    let smoothY = 0.5;
    let camera = 0;
    let targetCamera = 0;
    let last = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles: Particle[] = Array.from({ length: reduced ? 55 : 170 }, (_, i) => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      speed: 0.035 + Math.random() * 0.11,
      size: 0.5 + Math.random() * 2.2,
      phase: i * 1.618,
    }));
    const lanterns: Lantern[] = [
      { x: -0.72, y: 0.23, z: 0.34, sway: 0.018, phase: 0.2 },
      { x: 0.71, y: 0.18, z: 0.46, sway: 0.024, phase: 2.1 },
      { x: -0.91, y: 0.42, z: 0.63, sway: 0.015, phase: 3.7 },
      { x: 0.9, y: 0.39, z: 0.7, sway: 0.02, phase: 5.1 },
    ];

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

    const drawMountain = (w: number, h: number, base: number, amplitude: number, shift: number, fill: string) => {
      ctx.beginPath();
      ctx.moveTo(-30, h * base);
      for (let x = -30; x <= w + 30; x += 24) {
        const wave = Math.sin(x * 0.005 + shift) * amplitude + Math.sin(x * 0.013 + shift * 1.7) * amplitude * 0.35;
        ctx.lineTo(x, h * base - wave);
      }
      ctx.lineTo(w + 30, h);
      ctx.lineTo(-30, h);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };

    const drawLantern = (x: number, y: number, scale: number, alpha: number, time: number) => {
      const glow = ctx.createRadialGradient(x, y, 1, x, y, 75 * scale);
      glow.addColorStop(0, `rgba(239,177,91,${alpha * 0.32})`);
      glow.addColorStop(0.35, `rgba(198,126,58,${alpha * 0.09})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 90 * scale, y - 90 * scale, 180 * scale, 180 * scale);
      const flicker = 0.84 + Math.sin(time * 0.009 + x) * 0.08;
      ctx.fillStyle = `rgba(242,185,103,${alpha * flicker})`;
      ctx.fillRect(x - 4 * scale, y - 8 * scale, 8 * scale, 12 * scale);
      ctx.strokeStyle = `rgba(94,53,28,${alpha * 0.8})`;
      ctx.lineWidth = Math.max(1, scale * 1.2);
      ctx.strokeRect(x - 7 * scale, y - 11 * scale, 14 * scale, 18 * scale);
    };

    const draw = (time: number) => {
      const dt = Math.min((time - last) / 16.67 || 1, 2);
      last = time;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      smoothX += (pointerX - smoothX) * (reduced ? 0.025 : 0.065);
      smoothY += (pointerY - smoothY) * (reduced ? 0.025 : 0.065);
      targetCamera = progressRef.current * 0.95;
      camera += (targetCamera - camera) * (reduced ? 0.045 : 0.075);

      ctx.clearRect(0, 0, w, h);
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#02040a');
      sky.addColorStop(0.42, '#080d17');
      sky.addColorStop(0.72, '#100f12');
      sky.addColorStop(1, '#030303');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const haze = ctx.createRadialGradient(w * 0.5, h * 0.48, 0, w * 0.5, h * 0.48, h * 0.62);
      haze.addColorStop(0, 'rgba(111,128,151,.09)');
      haze.addColorStop(0.45, 'rgba(62,76,94,.025)');
      haze.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      const moonX = w * (0.72 + (smoothX - 0.5) * 0.055);
      const moonY = h * (0.205 + (smoothY - 0.5) * 0.025);
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, h * 0.28);
      moonGlow.addColorStop(0, 'rgba(236,217,179,.22)');
      moonGlow.addColorStop(0.18, 'rgba(206,172,125,.08)');
      moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(235,224,201,.92)';
      ctx.beginPath();
      ctx.arc(moonX, moonY, Math.min(w, h) * 0.048, 0, TAU);
      ctx.fill();

      drawMountain(w, h, 0.66, h * 0.055, smoothX * 2.5 + camera * 0.35, '#060910');
      drawMountain(w, h, 0.73, h * 0.075, smoothX * 3.5 + 1 + camera * 0.55, '#080a0e');
      drawMountain(w, h, 0.81, h * 0.065, smoothX * 4.8 + 3 + camera * 0.8, '#0a090b');

      const cx = w * 0.5 + (smoothX - 0.5) * 95;
      const horizon = h * 0.64;
      const cameraShift = camera * 1.05;
      const pathPulse = reduced ? 0 : Math.sin(time * 0.00045) * 0.008;
      ctx.fillStyle = 'rgba(24,20,18,.82)';
      ctx.beginPath();
      ctx.moveTo(cx - 24, horizon);
      ctx.lineTo(cx + 24, horizon);
      ctx.lineTo(cx + w * (0.22 + pathPulse), h);
      ctx.lineTo(cx - w * (0.22 + pathPulse), h);
      ctx.closePath();
      ctx.fill();

      for (let side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = horizon + (h - horizon) * t;
          const spread = 20 + t * w * 0.22;
          const x = cx + side * spread;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(132,103,77,.13)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < 10; i++) {
        const worldZ = i / 10;
        let depth = (worldZ - cameraShift) % 1;
        if (depth < 0) depth += 1;
        if (depth < 0.025) continue;
        const perspective = 1 - depth;
        const y = horizon + (h - horizon) * Math.pow(perspective, 1.42);
        const half = 10 + perspective * w * 0.18;
        const height = 24 + perspective * 128;
        const alpha = 0.055 + perspective * 0.39;
        const lean = (smoothX - 0.5) * perspective * 12;
        ctx.strokeStyle = `rgba(157,105,62,${alpha})`;
        ctx.lineWidth = Math.max(1, perspective * 4.2);
        ctx.beginPath();
        ctx.moveTo(cx - half + lean, y);
        ctx.lineTo(cx - half + lean, y - height);
        ctx.moveTo(cx + half + lean, y);
        ctx.lineTo(cx + half + lean, y - height);
        ctx.moveTo(cx - half - 10 * perspective + lean, y - height);
        ctx.lineTo(cx + half + 10 * perspective + lean, y - height);
        ctx.stroke();
        if (perspective > 0.72) {
          ctx.strokeStyle = `rgba(225,181,123,${alpha * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - half + lean, y - height + 7);
          ctx.lineTo(cx + half + lean, y - height + 7);
          ctx.stroke();
        }
      }

      lanterns.forEach((l) => {
        let depth = (l.z - cameraShift * 0.9) % 1;
        if (depth < 0) depth += 1;
        const perspective = 0.35 + (1 - depth) * 1.5;
        const drift = reduced ? 0 : Math.sin(time * 0.0009 + l.phase) * l.sway;
        const px = cx + l.x * w * (0.52 + (1 - depth) * 0.2) + (smoothX - 0.5) * depth * w * 0.12;
        const py = h * (l.y + drift + (smoothY - 0.5) * depth * 0.04) + (1 - depth) * h * 0.1;
        if (px > -100 && px < w + 100) drawLantern(px, py, 0.42 + perspective * 0.7, 0.2 + perspective * 0.38, time);
      });

      particles.forEach((p) => {
        if (!reduced) p.z -= p.speed * 0.012 * dt;
        if (p.z < 0.015) {
          p.z = 1;
          p.x = Math.random() * 2 - 1;
          p.y = Math.random() * 2 - 1;
        }
        const depth = 1 - p.z;
        const perspective = 1 + depth * 3.1;
        const px = w * 0.5 + (p.x + (smoothX - 0.5) * p.z * 0.18) * w * 0.43 * perspective;
        const py = h * 0.52 + (p.y + (smoothY - 0.5) * p.z * 0.12) * h * 0.5 * perspective;
        if (px < -20 || px > w + 20 || py < -20 || py > h + 20) return;
        const a = Math.min(0.72, 0.08 + depth * 0.55);
        ctx.fillStyle = `rgba(224,193,151,${a})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.45 + depth * 1.8), 0, TAU);
        ctx.fill();
        if (depth > 0.72 && !reduced) {
          ctx.strokeStyle = `rgba(211,184,148,${a * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - 2, py + 8 + depth * 12);
          ctx.stroke();
        }
      });

      for (let i = 0; i < 3; i++) {
        const y = h * (0.57 + i * 0.1);
        const grad = ctx.createLinearGradient(0, y, w, y);
        grad.addColorStop(0, 'rgba(139,149,153,0)');
        grad.addColorStop(0.25 + Math.sin(time * 0.0002 + i) * 0.04, 'rgba(139,149,153,.035)');
        grad.addColorStop(0.7, 'rgba(139,149,153,.02)');
        grad.addColorStop(1, 'rgba(139,149,153,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, w, h * 0.08);
      }

      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.48, h * 0.18, w * 0.5, h * 0.48, h * 0.78);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.72, 'rgba(0,0,0,.12)');
      vignette.addColorStop(1, 'rgba(0,0,0,.72)');
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
      setProgress(p);
      setChapter(Math.min(chapters.length - 1, Math.floor(p * chapters.length)));
      progressRef.current = p;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = chapters[chapter];

  return (
    <section id="kage-experience" className="relative h-[500vh] bg-[#02040a] text-[#eee8dd]" aria-label="Expérience immersive de Djam">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,transparent_20%,rgba(0,0,0,.2)_62%,rgba(0,0,0,.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/80" />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-7 sm:px-10 sm:py-9 lg:px-16">
          <div className="flex items-start justify-between text-[9px] uppercase tracking-[0.32em] text-white/45 sm:text-[10px]">
            <span>DJAM / DIGITAL CREATIVE</span>
            <span className="hidden sm:block">An immersive portfolio experience</span>
          </div>

          <div className="max-w-5xl pb-14 sm:pb-20 lg:pb-24">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#d1a66d] sm:text-xs">
              <span className="h-px w-10 bg-[#d1a66d]/70" />
              <span key={chapter}>{active.kicker}</span>
            </div>
            <h2 key={`title-${chapter}`} className="whitespace-pre-line text-[clamp(3.3rem,8vw,9.5rem)] font-light leading-[.86] tracking-[-0.065em]">{active.title}</h2>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">{active.body}</p>
          </div>

          <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between sm:bottom-9 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.25em] text-white/35">
              <span className="hidden sm:inline">Scroll to travel</span>
              <span className="h-px w-16 bg-white/15"><span className="block h-px bg-[#d1a66d] transition-[width] duration-300" style={{ width: `${Math.max(5, progress * 100)}%` }} /></span>
            </div>
            <div className="flex items-end gap-4">
              <div className="hidden text-right text-[8px] uppercase leading-4 tracking-[0.25em] text-white/30 sm:block">Journey<br />through my work</div>
              <div className="h-16 w-px bg-white/15"><div className="w-px bg-[#d1a66d] transition-[height] duration-300" style={{ height: `${Math.max(8, progress * 100)}%` }} /></div>
              <span className="font-mono text-xs text-white/55">0{chapter + 1} / 0{chapters.length}</span>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" aria-hidden="true">
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d1a66d] shadow-[0_0_18px_rgba(209,166,109,.8)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
