'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const pages = [
  { eyebrow: '01 / COVER', title: 'DIGITAL\nEXPERIENCES', subtitle: 'A small collection of interfaces, products and visual experiments.', tone: 'from-stone-900 via-stone-800 to-black' },
  { eyebrow: '02 / PRODUCT', title: 'MENU\nSYSTEM', subtitle: 'Clear, responsive interfaces where motion supports the experience.', tone: 'from-neutral-900 via-zinc-800 to-neutral-950' },
  { eyebrow: '03 / MOTION', title: 'WEBGL\nSTUDIES', subtitle: 'Interactive visuals, shader experiments and scroll-driven storytelling.', tone: 'from-slate-900 via-indigo-950 to-black' },
  { eyebrow: '04 / FULL-STACK', title: 'BUILD\nSYSTEMS', subtitle: 'Scalable web products with Next.js, TypeScript, APIs and modern UI.', tone: 'from-emerald-950 via-neutral-900 to-black' },
  { eyebrow: '05 / MOBILE', title: 'FLUTTER\nAPPS', subtitle: 'Cross-platform mobile experiences designed around real user needs.', tone: 'from-blue-950 via-slate-900 to-black' },
  { eyebrow: '06 / CMS', title: 'CONTENT\nFLOW', subtitle: 'Dynamic content structures ready to connect projects, collections and editorial pages.', tone: 'from-amber-950 via-stone-900 to-black' },
  { eyebrow: '07 / INTERACTION', title: 'TOUCH\n& MOTION', subtitle: 'Interfaces that react naturally to touch, drag, hover and scroll.', tone: 'from-fuchsia-950 via-zinc-900 to-black' },
  { eyebrow: '08 / NEXT', title: 'MORE TO\nEXPLORE', subtitle: 'More experiments, products and digital experiences are always in progress.', tone: 'from-zinc-900 via-neutral-800 to-black' },
];

const DURATION = 0.78;

type Direction = 'next' | 'previous';

export default function FlipBook3D() {
  const [spread, setSpread] = useState(0);
  const [direction, setDirection] = useState<Direction>('next');
  const [turning, setTurning] = useState(false);

  const maxSpread = pages.length - 2;
  const leftIndex = spread;
  const rightIndex = spread + 1;

  const turn = (dir: Direction) => {
    if (turning) return;
    if (dir === 'next' && spread >= maxSpread) return;
    if (dir === 'previous' && spread <= 0) return;
    setDirection(dir);
    setTurning(true);
  };

  useEffect(() => {
    if (!turning) return;
    const timer = window.setTimeout(() => {
      setSpread((current) => direction === 'next' ? Math.min(current + 2, maxSpread) : Math.max(current - 2, 0));
      setTurning(false);
    }, DURATION * 1000);
    return () => window.clearTimeout(timer);
  }, [turning, direction, maxSpread]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') turn('next');
      if (event.key === 'ArrowLeft') turn('previous');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const nextLeft = Math.min(spread + 2, pages.length - 2);
  const nextRight = Math.min(spread + 3, pages.length - 1);
  const prevLeft = Math.max(spread - 2, 0);
  const prevRight = Math.max(spread - 1, 1);

  return (
    <section id="flipbook" className="relative overflow-hidden bg-[#e8e5e2] px-5 py-24 text-[#111] sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.28em] text-black/45">Selected project / 06</p>
          <h2 className="mt-5 max-w-xl text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[.83] tracking-[-.07em]">Flipbook<br />3D CMS</h2>
          <p className="mt-8 max-w-lg text-base leading-7 text-black/60 sm:text-lg">A realistic digital booklet with true 3D page turns, responsive interaction and CMS-ready content architecture.</p>
          <div className="mt-9 space-y-4 border-t border-black/10 pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.2em] text-black/40">Update 1.1</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-black/60">Pages are structured for dynamic content, with smooth turns, touch navigation and keyboard controls.</p>
            </div>
            <div className="flex flex-wrap gap-2">{['3D Page Turn','CMS Ready','Touch','Keyboard','Responsive'].map((tag) => <span key={tag} className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-black/55">{tag}</span>)}</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl [perspective:2200px]">
          <div className="relative aspect-[1.45/1] w-full select-none [transform-style:preserve-3d]">
            <div className="absolute inset-y-[4%] left-0 w-1/2 overflow-hidden rounded-l-[22px] bg-white shadow-[0_28px_70px_rgba(0,0,0,.22)] [transform:rotateY(4deg)] [transform-origin:right_center] sm:rounded-l-[28px]">
              <PageContent page={direction === 'previous' && turning ? prevLeft : leftIndex} side="left" />
            </div>
            <div className="absolute inset-y-[4%] right-0 w-1/2 overflow-hidden rounded-r-[22px] bg-white shadow-[0_28px_70px_rgba(0,0,0,.22)] [transform:rotateY(-4deg)] [transform-origin:left_center] sm:rounded-r-[28px]">
              <PageContent page={direction === 'next' && turning ? nextRight : rightIndex} side="right" />
            </div>

            {turning && direction === 'next' && (
              <TurnPage front={rightIndex} back={nextLeft} direction="next" />
            )}
            {turning && direction === 'previous' && (
              <TurnPage front={leftIndex} back={prevRight} direction="previous" />
            )}

            <div className="pointer-events-none absolute inset-y-[4%] left-1/2 z-50 w-px -translate-x-1/2 bg-black/15" />

            <div className="absolute inset-x-0 bottom-[-7%] z-[70] flex items-center justify-between px-2 sm:px-6">
              <button type="button" onClick={() => turn('previous')} disabled={turning || spread === 0} aria-label="Previous page" className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-xl transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30">←</button>
              <div className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold shadow-xl backdrop-blur">{String(spread + 1).padStart(2,'0')}–{String(Math.min(spread + 2, pages.length)).padStart(2,'0')} / {pages.length}</div>
              <button type="button" onClick={() => turn('next')} disabled={turning || spread >= maxSpread} aria-label="Next page" className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-xl transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30">→</button>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between text-[10px] uppercase tracking-[.22em] text-black/35"><span>Swipe / click / keyboard</span><span>Real 3D page turn</span></div>
        </div>
      </div>
    </section>
  );
}

function TurnPage({ front, back, direction }: { front: number; back: number; direction: Direction }) {
  const next = direction === 'next';
  return (
    <motion.div
      initial={{ rotateY: next ? 0 : 0 }}
      animate={{ rotateY: next ? -180 : 180 }}
      transition={{ duration: DURATION, ease: [0.22, 0.61, 0.36, 1] }}
      className={`absolute inset-y-[4%] z-40 w-1/2 overflow-hidden bg-white shadow-[0_35px_90px_rgba(0,0,0,.3)] [transform-style:preserve-3d] [backface-visibility:hidden] ${next ? 'left-1/2 origin-left' : 'left-0 origin-right'}`}
      style={{ perspective: 2200 }}
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">
        <PageContent page={front} side={next ? 'right' : 'left'} />
      </div>
      <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <PageContent page={back} side={next ? 'left' : 'right'} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent opacity-60" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent opacity-50" />
    </motion.div>
  );
}

function PageContent({ page, side }: { page: number; side: 'left' | 'right' }) {
  const item = pages[Math.max(0, Math.min(page, pages.length - 1))];
  return (
    <div className={`relative h-full overflow-hidden bg-gradient-to-br ${item.tone} p-5 text-white sm:p-8`}>
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_26%),radial-gradient(circle_at_80%_80%,white_0,transparent_24%)]" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
      <div className="relative flex h-full flex-col justify-between">
        <div><p className="text-[8px] font-medium uppercase tracking-[.28em] text-white/45 sm:text-[10px]">{item.eyebrow}</p><div className="mt-5 h-px w-12 bg-white/25" /></div>
        <div className={side === 'left' ? 'opacity-80' : ''}><h3 className="whitespace-pre-line text-[clamp(1.45rem,4vw,3.4rem)] font-semibold leading-[.86] tracking-[-.055em]">{item.title}</h3><p className="mt-4 max-w-[270px] text-[10px] leading-4 text-white/55 sm:text-xs sm:leading-5">{item.subtitle}</p></div>
        <div className="flex items-end justify-between text-[8px] uppercase tracking-[.18em] text-white/35 sm:text-[9px]"><span>Portfolio / 2026</span><span>{String(page + 1).padStart(2,'0')}</span></div>
      </div>
    </div>
  );
}
