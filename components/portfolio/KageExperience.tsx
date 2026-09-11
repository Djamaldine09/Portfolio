'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { kicker: '01 / INTRO', title: 'Entre dans\nmon univers.', body: 'Une expérience nocturne pensée comme une promenade à travers mon travail créatif.' },
  { kicker: '02 / CRAFT', title: 'Design, code,\nmouvement.', body: 'Je transforme les idées en interfaces précises, vivantes et mémorables.' },
  { kicker: '03 / DIGITAL', title: 'Des expériences\nqui respirent.', body: 'Motion, 3D et interaction se rencontrent pour donner du caractère aux produits.' },
  { kicker: '04 / WORK', title: 'Mes projets\nprennent vie.', body: 'Explore mes réalisations et découvre les détails qui font la différence.' },
];

export default function KageExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let smoothX = 0.5;
    let smoothY = 0.5;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = Array.from({ length: reduced ? 35 : 85 }, (_, i) => ({
      x: Math.random(), y: Math.random(), z: Math.random(), speed: 0.0002 + Math.random() * 0.0007, size: 0.4 + Math.random() * 1.8, phase: i * 1.73,
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

    const draw = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      smoothX += (pointerX - smoothX) * (reduced ? 0.03 : 0.055);
      smoothY += (pointerY - smoothY) * (reduced ? 0.03 : 0.055);

      ctx.clearRect(0, 0, w, h);
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#05070c');
      sky.addColorStop(0.5, '#090d16');
      sky.addColorStop(1, '#15100d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Moon glow.
      const moonX = w * (0.73 + (smoothX - 0.5) * 0.035);
      const moonY = h * 0.23 + (smoothY - 0.5) * 18;
      const glow = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, h * 0.3);
      glow.addColorStop(0, 'rgba(235,219,183,.28)');
      glow.addColorStop(0.25, 'rgba(184,150,106,.08)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(229,215,190,.9)';
      ctx.beginPath(); ctx.arc(moonX, moonY, Math.min(w, h) * 0.055, 0, Math.PI * 2); ctx.fill();

      // Distant mountain layers.
      const mountain = (base: number, amp: number, shift: number, fill: string) => {
        ctx.beginPath();
        ctx.moveTo(-20, h * base);
        for (let x = -20; x <= w + 20; x += 34) {
          const n = Math.sin(x * 0.006 + shift) * amp + Math.sin(x * 0.014 + shift * 2) * amp * 0.45;
          ctx.lineTo(x, h * base - n);
        }
        ctx.lineTo(w + 20, h); ctx.lineTo(-20, h); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      };
      mountain(0.69, h * 0.055, smoothX * 2, '#080b10');
      mountain(0.76, h * 0.08, smoothX * 3 + 2, '#0a0b0e');

      // A minimal glowing path / gate.
      const cx = w * 0.5 + (smoothX - 0.5) * 80;
      const horizon = h * 0.68;
      ctx.strokeStyle = 'rgba(173,123,73,.28)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - w * 0.09, h); ctx.lineTo(cx - 18, horizon); ctx.moveTo(cx + w * 0.09, h); ctx.lineTo(cx + 18, horizon); ctx.stroke();
      ctx.strokeStyle = 'rgba(202,139,74,.72)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 42, horizon); ctx.lineTo(cx - 42, horizon - 95); ctx.moveTo(cx + 42, horizon); ctx.lineTo(cx + 42, horizon - 95); ctx.moveTo(cx - 58, horizon - 95); ctx.lineTo(cx + 58, horizon - 95); ctx.stroke();
      ctx.strokeStyle = 'rgba(202,139,74,.3)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx - 58, horizon - 95); ctx.lineTo(cx + 58, horizon - 95); ctx.stroke();

      // Fireflies / rain-like particles.
      particles.forEach((p) => {
        if (!reduced) p.y += p.speed * 16;
        if (p.y > 1.05) p.y = -0.05;
        const px = (p.x + (smoothX - 0.5) * p.z * 0.12) * w;
        const py = p.y * h;
        const a = 0.12 + 0.45 * (0.5 + 0.5 * Math.sin(time * 0.001 + p.phase));
        ctx.fillStyle = `rgba(220,190,150,${a * (0.4 + p.z)})`;
        ctx.beginPath(); ctx.arc(px, py, p.size * (0.7 + p.z), 0, Math.PI * 2); ctx.fill();
      });

      // Fog bands.
      const fog = ctx.createLinearGradient(0, h * 0.55, 0, h);
      fog.addColorStop(0, 'rgba(125,132,136,0)'); fog.addColorStop(0.55, 'rgba(125,132,136,.045)'); fog.addColorStop(1, 'rgba(16,13,12,.32)');
      ctx.fillStyle = fog; ctx.fillRect(0, h * 0.48, w, h * 0.52);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('kage-experience');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
      setChapter(Math.min(chapters.length - 1, Math.floor(p * chapters.length)));
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = chapters[chapter];

  return (
    <section id="kage-experience" className="relative h-[420vh] bg-[#05070c] text-[#eee8dd]" aria-label="Expérience immersive">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.32)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75" />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-7 sm:px-10 sm:py-9 lg:px-16">
          <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.32em] text-white/55 sm:text-xs">
            <span>DJAM / DIGITAL CREATIVE</span>
            <span>Scroll to explore</span>
          </div>

          <div className="max-w-4xl pb-16 sm:pb-20 lg:pb-24">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#d1a66d] sm:text-xs">
              <span className="h-px w-8 bg-[#d1a66d]/70" /> {active.kicker}
            </div>
            <h2 key={chapter} className="whitespace-pre-line text-5xl font-light leading-[.92] tracking-[-0.055em] sm:text-7xl lg:text-[8.5rem]">{active.title}</h2>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/58 sm:text-base">{active.body}</p>
          </div>

          <div className="absolute bottom-7 right-6 flex items-end gap-5 sm:bottom-9 sm:right-10 lg:right-16">
            <div className="hidden text-right text-[9px] uppercase tracking-[0.28em] text-white/35 sm:block">Journey<br />through my work</div>
            <div className="h-20 w-px bg-white/15"><div className="w-px bg-[#d1a66d] transition-[height] duration-300" style={{ height: `${Math.max(8, progress * 100)}%` }} /></div>
            <span className="font-mono text-xs text-white/55">0{chapter + 1} / 0{chapters.length}</span>
          </div>

          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" aria-hidden="true"><span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d1a66d]" /></div>
        </div>
      </div>
    </section>
  );
}
