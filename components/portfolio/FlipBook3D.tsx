'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const pages = [
  { eyebrow: 'COVER', title: 'DIGITAL\nEXPERIENCES', subtitle: 'A collection of interfaces, products and visual experiments.', tone: 'from-zinc-950 via-stone-900 to-black' },
  { eyebrow: '01 / PRODUCT', title: 'MENU\nSYSTEM', subtitle: 'Clear responsive interfaces where motion supports the experience.', tone: 'from-stone-100 via-white to-stone-200', light: true },
  { eyebrow: '02 / MOTION', title: 'WEBGL\nSTUDIES', subtitle: 'Interactive visuals, shader experiments and scroll-driven storytelling.', tone: 'from-slate-950 via-indigo-950 to-black' },
  { eyebrow: '03 / FULL-STACK', title: 'BUILD\nSYSTEMS', subtitle: 'Scalable products with Next.js, TypeScript, APIs and modern UI.', tone: 'from-emerald-950 via-neutral-900 to-black' },
  { eyebrow: '04 / MOBILE', title: 'FLUTTER\nAPPS', subtitle: 'Cross-platform mobile experiences designed around real user needs.', tone: 'from-blue-950 via-slate-900 to-black' },
  { eyebrow: '05 / CMS', title: 'CONTENT\nFLOW', subtitle: 'Dynamic content structures ready for collections and editorial pages.', tone: 'from-amber-950 via-stone-900 to-black' },
  { eyebrow: '06 / INTERACTION', title: 'TOUCH\n& MOTION', subtitle: 'Interfaces that react naturally to touch, drag, hover and scroll.', tone: 'from-fuchsia-950 via-zinc-900 to-black' },
  { eyebrow: '07 / NEXT', title: 'MORE TO\nEXPLORE', subtitle: 'More experiments, products and digital experiences are always in progress.', tone: 'from-zinc-900 via-neutral-800 to-black' },
];

const DURATION = 1.7;
const EASE = [0.16, 0.7, 0.22, 1] as const;
type Direction = 'next' | 'previous';

export default function FlipBook3D() {
  const [open, setOpen] = useState(false);
  const [leftPage, setLeftPage] = useState(1);
  const [rightPage, setRightPage] = useState(2);
  const [turning, setTurning] = useState(false);
  const [direction, setDirection] = useState<Direction>('next');

  const finishTurn = () => {
    if (!turning) return;
    if (direction === 'next') {
      setLeftPage((p) => Math.min(p + 2, pages.length - 2));
      setRightPage((p) => Math.min(p + 2, pages.length - 1));
    } else {
      setLeftPage((p) => Math.max(p - 2, 1));
      setRightPage((p) => Math.max(p - 2, 2));
    }
    setTurning(false);
  };

  const turn = (dir: Direction) => {
    if (turning) return;
    if (!open && dir === 'next') {
      setDirection('next');
      setOpen(true);
      setTurning(true);
      return;
    }
    if (dir === 'next' && rightPage >= pages.length - 1) return;
    if (dir === 'previous' && leftPage <= 1) return;
    setDirection(dir);
    setTurning(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') turn('next');
      if (e.key === 'ArrowLeft') turn('previous');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const openingCover = !open && turning;
  const normalTurn = turning && !openingCover;
  const coverVisible = !open || openingCover;
  const canNext = open && !turning && rightPage < pages.length - 1;
  const canPrevious = open && !turning && leftPage > 1;

  return (
    <section id="flipbook" className="relative overflow-hidden bg-[#e8e5e2] px-5 py-24 text-[#111] sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:gap-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.28em] text-black/45">Selected project / 06</p>
          <h2 className="mt-5 max-w-xl text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[.83] tracking-[-.07em]">Flipbook<br />3D CMS</h2>
          <p className="mt-8 max-w-lg text-base leading-7 text-black/60 sm:text-lg">A physical-looking digital booklet with a visible 3D opening, realistic page turns and responsive interaction.</p>
          <div className="mt-9 space-y-4 border-t border-black/10 pt-6">
            <p className="text-xs font-medium uppercase tracking-[.2em] text-black/40">Realistic 180° page turn</p>
            <div className="flex flex-wrap gap-2">{['Real 3D Turn','180° Rotation','Page Curl','CMS Ready','Touch','Keyboard','Responsive'].map((tag) => <span key={tag} className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-black/55">{tag}</span>)}</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl [perspective:2400px]">
          <div className="relative aspect-[1.42/1] w-full select-none [transform-style:preserve-3d]">
            <div className="absolute inset-[4%] rounded-[24px] bg-[#d8d2ca] shadow-[0_45px_100px_rgba(0,0,0,.25)] sm:rounded-[30px]" />

            {open && <div className="absolute inset-y-[4%] inset-x-0 z-10 [transform-style:preserve-3d]">
              <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-[22px] bg-white shadow-[-10px_25px_45px_rgba(0,0,0,.13)] sm:rounded-l-[28px]"><PageContent page={leftPage} /><PageEdge side="left" /></div>
              <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-[22px] bg-white shadow-[10px_25px_45px_rgba(0,0,0,.13)] sm:rounded-r-[28px]"><PageContent page={rightPage} /><PageEdge side="right" /></div>
            </div>}

            {coverVisible && <motion.div
              initial={false}
              animate={{ rotateY: open ? -180 : 0 }}
              transition={{ duration: DURATION, ease: EASE }}
              onAnimationComplete={() => { if (openingCover) finishTurn(); }}
              className="absolute inset-y-[4%] right-0 z-50 w-full origin-left overflow-hidden rounded-r-[22px] bg-black shadow-[15px_30px_80px_rgba(0,0,0,.38)] [transform-style:preserve-3d] [backface-visibility:visible] sm:rounded-r-[28px]"
            >
              <PageContent page={0} cover />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/10 to-transparent" />
            </motion.div>}

            {normalTurn && <TurningSheet
              key={`${direction}-${leftPage}-${rightPage}`}
              direction={direction}
              front={direction === 'next' ? rightPage : leftPage}
              back={direction === 'next' ? Math.min(rightPage + 1, pages.length - 1) : Math.max(leftPage - 1, 1)}
              onComplete={finishTurn}
            />}

            <div className="pointer-events-none absolute inset-y-[4%] left-1/2 z-[80] w-[2px] -translate-x-1/2 bg-black/15 shadow-[0_0_8px_rgba(0,0,0,.12)]" />
            <div className="absolute inset-x-0 bottom-[-8%] z-[100] flex items-center justify-between px-1 sm:px-5">
              <button type="button" onClick={() => turn('previous')} disabled={!canPrevious} aria-label="Previous page" className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-xl transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30">←</button>
              <div className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold shadow-xl backdrop-blur">{open ? `${String(leftPage).padStart(2, '0')}–${String(rightPage).padStart(2, '0')}` : 'COVER'} / {pages.length - 1}</div>
              <button type="button" onClick={() => turn('next')} disabled={turning || (open && !canNext)} aria-label={open ? 'Next page' : 'Open book'} className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-xl transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30">→</button>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between text-[10px] uppercase tracking-[.22em] text-black/35"><span>{open ? 'Turn the page / keyboard' : 'Open the book'}</span><span>Realistic 3D paper turn</span></div>
        </div>
      </div>
    </section>
  );
}

function TurningSheet({ front, back, direction, onComplete }: { front: number; back: number; direction: Direction; onComplete: () => void }) {
  const next = direction === 'next';
  return <motion.div
    initial={{ rotateY: 0, rotateX: 0, scale: 1 }}
    animate={{ rotateY: next ? -180 : 180, rotateX: [0, -0.8, 0.5, 0], scale: [1, 1.008, 1.012, 1] }}
    transition={{ duration: DURATION, ease: EASE, rotateX: { duration: DURATION, ease: 'easeInOut' }, scale: { duration: DURATION, ease: 'easeInOut' } }}
    onAnimationComplete={onComplete}
    className={`absolute inset-y-[4%] z-[90] w-1/2 overflow-visible bg-transparent [transform-style:preserve-3d] ${next ? 'left-1/2 origin-left' : 'left-0 origin-right'}`}
  >
    <div className="absolute inset-0 overflow-hidden bg-white shadow-[0_28px_70px_rgba(0,0,0,.30)] [backface-visibility:hidden]">
      <PageContent page={front} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-black/30 via-black/8 to-transparent" />
    </div>

    <div className="absolute inset-0 overflow-hidden bg-white shadow-[0_28px_70px_rgba(0,0,0,.30)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
      <PageContent page={back} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black/30 via-black/8 to-transparent" />
    </div>

    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0.05, scaleX: 0.45 }}
      animate={{ opacity: [0.05, 0.42, 0.20, 0.05], scaleX: [0.45, 1, 0.8, 0.5] }}
      transition={{ duration: DURATION, ease: 'easeInOut' }}
      className={`pointer-events-none absolute inset-y-0 top-0 w-16 bg-gradient-to-r from-black/35 via-white/10 to-transparent mix-blend-multiply ${next ? 'right-0' : 'left-0'}`}
    />
  </motion.div>;
}

function PageContent({ page, cover = false }: { page: number; cover?: boolean }) {
  const item = pages[Math.max(0, Math.min(page, pages.length - 1))];
  const light = 'light' in item && item.light;
  return <div className={`relative h-full overflow-hidden bg-gradient-to-br ${item.tone} p-6 ${light ? 'text-black' : 'text-white'} sm:p-9 ${cover ? 'sm:p-12' : ''}`}>
    <div className={`absolute inset-0 ${light ? 'opacity-20' : 'opacity-25'} [background-image:radial-gradient(circle_at_18%_20%,white_0,transparent_25%),radial-gradient(circle_at_82%_78%,white_0,transparent_25%)]`} />
    <div className="relative flex h-full flex-col justify-between">
      <div><p className={`text-[8px] font-medium uppercase tracking-[.28em] sm:text-[10px] ${light ? 'text-black/45' : 'text-white/45'}`}>{item.eyebrow}</p><div className={`mt-5 h-px w-12 ${light ? 'bg-black/20' : 'bg-white/25'}`} /></div>
      <div><h3 className={`whitespace-pre-line text-[clamp(1.55rem,4.4vw,4rem)] font-semibold leading-[.84] tracking-[-.06em] ${cover ? 'text-[clamp(2.2rem,6vw,5.5rem)]' : ''}`}>{item.title}</h3><p className={`mt-5 max-w-[330px] text-[10px] leading-4 sm:text-xs sm:leading-5 ${light ? 'text-black/55' : 'text-white/55'}`}>{item.subtitle}</p></div>
      <div className={`flex items-end justify-between text-[8px] uppercase tracking-[.18em] sm:text-[9px] ${light ? 'text-black/35' : 'text-white/35'}`}><span>{cover ? 'Portfolio / 2026' : 'Djamaldine / 2026'}</span><span>{String(page).padStart(2, '0')}</span></div>
    </div>
  </div>;
}

function PageEdge({ side }: { side: 'left' | 'right' }) {
  return <div className={`pointer-events-none absolute inset-y-0 w-4 ${side === 'left' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent`} />;
}
