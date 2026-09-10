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

const DURATION = 1.15;
type Direction = 'next' | 'previous';

export default function FlipBook3D() {
  // Closed book: only the cover is visible.
  const [open, setOpen] = useState(false);
  // Once open, left/right are the two visible faces of the current spread.
  const [leftPage, setLeftPage] = useState(1);
  const [rightPage, setRightPage] = useState(2);
  const [turning, setTurning] = useState(false);
  const [direction, setDirection] = useState<Direction>('next');

  const canNext = open && !turning && rightPage < pages.length - 1;
  const canPrevious = open && !turning && leftPage > 1;

  const turn = (dir: Direction) => {
    if (turning) return;

    // First action opens the physical front cover.
    if (!open && dir === 'next') {
      setDirection('next');
      setTurning(true);
      window.setTimeout(() => {
        setOpen(true);
        setTurning(false);
      }, DURATION * 1000);
      return;
    }

    if (dir === 'next' && rightPage >= pages.length - 1) return;
    if (dir === 'previous' && leftPage <= 1) return;

    setDirection(dir);
    setTurning(true);

    window.setTimeout(() => {
      if (dir === 'next') {
        setLeftPage((current) => current + 2);
        setRightPage((current) => Math.min(current + 2, pages.length - 1));
      } else {
        setLeftPage((current) => Math.max(current - 2, 1));
        setRightPage((current) => Math.max(current - 2, 2));
      }
      setTurning(false);
    }, DURATION * 1000);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') turn('next');
      if (event.key === 'ArrowLeft') turn('previous');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const displayedNumber = open ? rightPage : 1;

  return (
    <section id="flipbook" className="relative overflow-hidden bg-[#e8e5e2] px-5 py-24 text-[#111] sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:gap-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.28em] text-black/45">Selected project / 06</p>
          <h2 className="mt-5 max-w-xl text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[.83] tracking-[-.07em]">Flipbook<br />3D CMS</h2>
          <p className="mt-8 max-w-lg text-base leading-7 text-black/60 sm:text-lg">A physical-looking digital booklet with a visible 3D opening, realistic page turns and responsive interaction.</p>
          <div className="mt-9 space-y-4 border-t border-black/10 pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.2em] text-black/40">Update 1.1</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-black/60">The book starts closed. Open the cover first, then turn individual sheets one by one with a visible 180° page rotation.</p>
            </div>
            <div className="flex flex-wrap gap-2">{['Real 3D Turn','CMS Ready','Touch','Keyboard','Responsive'].map((tag) => <span key={tag} className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-black/55">{tag}</span>)}</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl [perspective:2600px]">
          <div className="relative aspect-[1.42/1] w-full select-none [transform-style:preserve-3d]">
            {/* Deep book block / pages underneath */}
            <div className="absolute inset-[4%] rounded-[24px] bg-[#d8d2ca] shadow-[0_45px_100px_rgba(0,0,0,.25)] sm:rounded-[30px]" />

            {/* Open spread, only revealed after the cover has turned. */}
            {open && (
              <div className="absolute inset-y-[4%] inset-x-0 [transform-style:preserve-3d]">
                <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-[22px] bg-white shadow-[-8px_25px_45px_rgba(0,0,0,.12)] sm:rounded-l-[28px]">
                  <PageContent page={leftPage} />
                  <PageEdge side="left" />
                </div>
                <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-[22px] bg-white shadow-[8px_25px_45px_rgba(0,0,0,.12)] sm:rounded-r-[28px]">
                  <PageContent page={rightPage} />
                  <PageEdge side="right" />
                </div>
              </div>
            )}

            {/* FRONT COVER: closed initially, then visibly rotates around the spine. */}
            {!open || turning && direction === 'next' && leftPage === 1 && rightPage === 2 ? (
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: !open ? 0 : -180 }}
                transition={{ duration: DURATION, ease: [0.22, 0.65, 0.32, 1] }}
                className="absolute inset-y-[4%] right-0 z-50 w-full origin-left overflow-hidden rounded-r-[22px] bg-black shadow-[15px_30px_80px_rgba(0,0,0,.35)] [backface-visibility:hidden] [transform-style:preserve-3d] sm:rounded-r-[28px]"
              >
                <PageContent page={0} cover />
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/10 to-transparent" />
                <div className="absolute left-0 top-0 h-full w-1 bg-white/10" />
              </motion.div>
            ) : null}

            {/* Real sheet turn: the right-hand page visibly folds over the spine. */}
            {turning && open && !(direction === 'next' && leftPage === 1 && rightPage === 2) && (
              <TurningSheet
                direction={direction}
                front={direction === 'next' ? rightPage : leftPage}
                back={direction === 'next' ? Math.min(rightPage + 1, pages.length - 1) : Math.max(leftPage - 1, 1)}
              />
            )}

            <div className="pointer-events-none absolute inset-y-[4%] left-1/2 z-[80] w-[2px] -translate-x-1/2 bg-black/15 shadow-[0_0_8px_rgba(0,0,0,.12)]" />

            <div className="absolute inset-x-0 bottom-[-8%] z-[100] flex items-center justify-between px-1 sm:px-5">
              <button type="button" onClick={() => turn('previous')} disabled={!canPrevious} aria-label="Previous page" className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-xl transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30">←</button>
              <div className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold shadow-xl backdrop-blur">{String(open ? leftPage : 1).padStart(2, '0')}–{String(displayedNumber).padStart(2, '0')} / {pages.length - 1}</div>
              <button type="button" onClick={() => turn('next')} disabled={turning || (!open && false) || (open && !canNext)} aria-label={open ? 'Next page' : 'Open book'} className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-xl transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30">→</button>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between text-[10px] uppercase tracking-[.22em] text-black/35"><span>{open ? 'Turn the page / swipe / keyboard' : 'Open the book'}</span><span>Visible 3D page turn</span></div>
        </div>
      </div>
    </section>
  );
}

function TurningSheet({ front, back, direction }: { front: number; back: number; direction: Direction }) {
  const next = direction === 'next';
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      animate={{ rotateY: next ? -180 : 180 }}
      transition={{ duration: DURATION, ease: [0.22, 0.65, 0.32, 1] }}
      className={`absolute inset-y-[4%] z-[70] w-1/2 overflow-hidden bg-white shadow-[0_35px_90px_rgba(0,0,0,.32)] [transform-style:preserve-3d] [backface-visibility:hidden] ${next ? 'left-1/2 origin-left' : 'left-0 origin-right'}`}
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">
        <PageContent page={front} />
      </div>
      <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <PageContent page={back} />
      </div>
      <div className={`pointer-events-none absolute inset-y-0 w-16 transition-opacity ${next ? 'right-0 bg-gradient-to-l from-black/35 via-black/10 to-transparent' : 'left-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent'}`} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-black/15" />
    </motion.div>
  );
}

function PageContent({ page, cover = false }: { page: number; cover?: boolean }) {
  const item = pages[Math.max(0, Math.min(page, pages.length - 1))];
  const light = 'light' in item && item.light;

  return (
    <div className={`relative h-full overflow-hidden bg-gradient-to-br ${item.tone} p-6 ${light ? 'text-black' : 'text-white'} sm:p-9 ${cover ? 'sm:p-12' : ''}`}>
      <div className={`absolute inset-0 ${light ? 'opacity-20' : 'opacity-25'} [background-image:radial-gradient(circle_at_18%_20%,white_0,transparent_25%),radial-gradient(circle_at_82%_78%,white_0,transparent_25%)]`} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className={`text-[8px] font-medium uppercase tracking-[.28em] sm:text-[10px] ${light ? 'text-black/45' : 'text-white/45'}`}>{item.eyebrow}</p>
          <div className={`mt-5 h-px w-12 ${light ? 'bg-black/20' : 'bg-white/25'}`} />
        </div>
        <div>
          <h3 className={`whitespace-pre-line text-[clamp(1.55rem,4.4vw,4rem)] font-semibold leading-[.84] tracking-[-.06em] ${cover ? 'text-[clamp(2.2rem,6vw,5.5rem)]' : ''}`}>{item.title}</h3>
          <p className={`mt-5 max-w-[330px] text-[10px] leading-4 sm:text-xs sm:leading-5 ${light ? 'text-black/55' : 'text-white/55'}`}>{item.subtitle}</p>
        </div>
        <div className={`flex items-end justify-between text-[8px] uppercase tracking-[.18em] sm:text-[9px] ${light ? 'text-black/35' : 'text-white/35'}`}>
          <span>{cover ? 'Portfolio / 2026' : 'Djamaldine / 2026'}</span>
          <span>{String(page).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

function PageEdge({ side }: { side: 'left' | 'right' }) {
  return <div className={`pointer-events-none absolute inset-y-0 w-4 ${side === 'left' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent`} />;
}
