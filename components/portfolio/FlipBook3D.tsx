'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Direction = 'next' | 'previous';

type Page = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tone: string;
  light?: boolean;
};

const pages: Page[] = [
  { eyebrow: 'COVER', title: 'DIGITAL\nEXPERIENCES', subtitle: 'A collection of interfaces, products and visual experiments.', tone: 'from-zinc-950 via-stone-900 to-black' },
  { eyebrow: '01 / PRODUCT', title: 'MENU\nSYSTEM', subtitle: 'Clear responsive interfaces where motion supports the experience.', tone: 'from-stone-100 via-white to-stone-200', light: true },
  { eyebrow: '02 / MOTION', title: 'WEBGL\nSTUDIES', subtitle: 'Interactive visuals, shader experiments and scroll-driven storytelling.', tone: 'from-slate-950 via-indigo-950 to-black' },
  { eyebrow: '03 / FULL-STACK', title: 'BUILD\nSYSTEMS', subtitle: 'Scalable products with Next.js, TypeScript, APIs and modern UI.', tone: 'from-emerald-950 via-neutral-900 to-black' },
  { eyebrow: '04 / MOBILE', title: 'FLUTTER\nAPPS', subtitle: 'Cross-platform mobile experiences designed around real user needs.', tone: 'from-blue-950 via-slate-900 to-black' },
  { eyebrow: '05 / CMS', title: 'CONTENT\nFLOW', subtitle: 'Dynamic content structures ready for collections and editorial pages.', tone: 'from-amber-950 via-stone-900 to-black' },
  { eyebrow: '06 / INTERACTION', title: 'TOUCH\n& MOTION', subtitle: 'Interfaces that react naturally to touch, drag, hover and scroll.', tone: 'from-fuchsia-950 via-zinc-900 to-black' },
  { eyebrow: '07 / NEXT', title: 'MORE TO\nEXPLORE', subtitle: 'More experiments, products and digital experiences are always in progress.', tone: 'from-zinc-900 via-neutral-800 to-black' },
];

const TURN_MS = 1050;
const DRAG_TRIGGER = 72;
const EASE = [0.16, 0.7, 0.22, 1] as const;

export default function FlipBook3D() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0);
  const [turning, setTurning] = useState(false);
  const [direction, setDirection] = useState<Direction>('next');
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const leftPage = 1 + spread * 2;
  const rightPage = leftPage + 1;
  const canNext = open && !turning && rightPage < pages.length - 1;
  const canPrevious = open && !turning && spread > 0;

  const finishTurn = useCallback(() => {
    const wasClosed = !open;
    if (wasClosed) setOpen(true);
    setSpread((current) => {
      if (direction === 'next') return Math.min(current + 1, Math.floor((pages.length - 2) / 2));
      return Math.max(current - 1, 0);
    });
    setTurning(false);
  }, [direction, open]);

  const turn = useCallback((dir: Direction) => {
    if (turning) return;

    if (!open) {
      if (dir === 'next') {
        setDirection('next');
        setTurning(true);
      }
      return;
    }

    if (dir === 'next' && !canNext) return;
    if (dir === 'previous' && !canPrevious) return;

    setDirection(dir);
    setTurning(true);
  }, [canNext, canPrevious, open, turning]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') turn('next');
      if (event.key === 'ArrowLeft') turn('previous');
      if (event.key === 'Escape' && open && !turning) setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, turn, turning]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;

    if (!start || turning) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (Math.abs(dx) < DRAG_TRIGGER || Math.abs(dx) < Math.abs(dy)) return;
    turn(dx < 0 ? 'next' : 'previous');
  };

  const openingCover = !open && turning;
  const displayLeftPage = turning && direction === 'previous' ? leftPage - 1 : leftPage;
  const displayRightPage = turning && direction === 'next' ? rightPage + 1 : rightPage;

  return (
    <section id="flipbook" className="relative overflow-hidden bg-[#e8e5e2] px-5 py-24 text-[#111] sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-20">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[.28em] text-black/40 sm:text-xs">Selected project / 06</p>
          <h2 className="mt-5 max-w-xl text-[clamp(3.1rem,7.8vw,7rem)] font-semibold leading-[.84] tracking-[-.075em]">
            Flipbook<br />3D CMS
          </h2>
          <p className="mt-7 max-w-lg text-sm leading-6 text-black/55 sm:text-lg sm:leading-7">
            A physical-looking digital booklet inspired by the reference: soft paper shadows,
            a deep centre crease, realistic 180° turns and touch-first navigation.
          </p>
          <div className="mt-8 border-t border-black/10 pt-5">
            <p className="text-[10px] font-medium uppercase tracking-[.22em] text-black/35">Interaction</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['180° Turn', 'Page Curl', 'Drag / Swipe', 'Keyboard', 'Responsive'].map((tag) => (
                <span key={tag} className="rounded-full border border-black/10 px-3 py-1.5 text-[9px] uppercase tracking-[.16em] text-black/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <div
            className="relative [perspective:2200px]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={{ touchAction: 'pan-y' }}
          >
            <div className="relative aspect-[1.48/1] w-full [transform-style:preserve-3d]">
              <div className="absolute inset-[4%_3%_3%] rounded-[22px] bg-[#d4cec6] shadow-[0_42px_90px_rgba(0,0,0,.24)] sm:rounded-[30px]" />
              <div className="absolute inset-y-[6%] left-1/2 z-[5] w-5 -translate-x-1/2 rounded-full bg-black/[.025] blur-md" />

              {!open && !openingCover && <Cover onOpen={() => turn('next')} />}

              {open && (
                <div className="absolute inset-x-0 inset-y-[6%] z-10 [transform-style:preserve-3d]">
                  <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-[22px] bg-white shadow-[-12px_22px_45px_rgba(0,0,0,.12)] sm:rounded-l-[30px]">
                    <PageContent page={displayLeftPage} />
                    <PageEdge side="left" />
                  </div>
                  <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-[22px] bg-white shadow-[12px_22px_45px_rgba(0,0,0,.12)] sm:rounded-r-[30px]">
                    <PageContent page={displayRightPage} />
                    <PageEdge side="right" />
                  </div>
                </div>
              )}

              {openingCover && (
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -180 }}
                  transition={{ duration: TURN_MS / 1000, ease: EASE }}
                  onAnimationComplete={finishTurn}
                  className="absolute inset-y-[6%] right-0 z-50 w-full origin-left overflow-hidden rounded-r-[22px] bg-black shadow-[18px_30px_80px_rgba(0,0,0,.34)] [transform-style:preserve-3d] sm:rounded-r-[30px]"
                >
                  <PageContent page={0} cover />
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/10 to-transparent" />
                </motion.div>
              )}

              {turning && !openingCover && (
                <TurningPage
                  direction={direction}
                  front={direction === 'next' ? rightPage : leftPage}
                  back={direction === 'next' ? rightPage + 1 : leftPage - 1}
                  onComplete={finishTurn}
                />
              )}

              <div className="pointer-events-none absolute inset-y-[6%] left-1/2 z-[80] w-px -translate-x-1/2 bg-black/10 shadow-[0_0_9px_rgba(0,0,0,.18)]" />

              <div className="absolute inset-x-0 bottom-[-5%] z-[100] flex items-center justify-between px-0 sm:px-4">
                <NavButton disabled={!canPrevious} onClick={() => turn('previous')} label="Previous page">←</NavButton>
                <div className="rounded-full bg-white/95 px-4 py-2 text-[10px] font-semibold tracking-[.08em] shadow-xl backdrop-blur sm:px-5 sm:py-2.5 sm:text-xs">
                  {open ? `${String(leftPage).padStart(2, '0')}–${String(rightPage).padStart(2, '0')}` : 'COVER'} <span className="text-black/30">/ {pages.length - 1}</span>
                </div>
                <NavButton disabled={turning || (open && !canNext)} onClick={() => turn('next')} label={open ? 'Next page' : 'Open book'}>→</NavButton>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between text-[9px] uppercase tracking-[.22em] text-black/30 sm:mt-12 sm:text-[10px]">
            <span>{open ? 'Swipe / drag / keyboard' : 'Tap to open'}</span>
            <span>Realistic 3D paper turn</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cover({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open Flipbook"
      className="group absolute inset-x-[3%] inset-y-[6%] z-40 overflow-hidden rounded-[22px] bg-gradient-to-br from-zinc-950 via-stone-900 to-black text-left shadow-[18px_30px_80px_rgba(0,0,0,.38)] outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-black/40 sm:rounded-[30px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,.12),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,.08),transparent_30%)]" />
      <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-10 lg:p-12">
        <div className="flex items-center justify-between text-[8px] uppercase tracking-[.28em] text-white/45 sm:text-[10px]">
          <span>Portfolio / 2026</span>
          <span>Selected / 06</span>
        </div>
        <div>
          <div className="mb-6 h-px w-14 bg-white/25" />
          <h3 className="whitespace-pre-line text-[clamp(2.4rem,6.4vw,5.6rem)] font-semibold leading-[.82] tracking-[-.065em]">
            DIGITAL{'\n'}EXPERIENCES
          </h3>
          <p className="mt-5 max-w-md text-[10px] leading-5 text-white/50 sm:text-xs sm:leading-6">
            A collection of interfaces, products and visual experiments.
          </p>
        </div>
        <div className="flex items-end justify-between text-[8px] uppercase tracking-[.18em] text-white/35 sm:text-[9px]">
          <span>Open book</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
  );
}

function TurningPage({
  direction,
  front,
  back,
  onComplete,
}: {
  direction: Direction;
  front: number;
  back: number;
  onComplete: () => void;
}) {
  const next = direction === 'next';
  const radius = 'var(--flipbook-radius)';

  return (
    <motion.div
      initial={{ rotateY: 0, rotateX: 0, scale: 1 }}
      animate={{ rotateY: next ? -180 : 180, rotateX: [0, -1.1, .65, 0], scale: [1, 1.012, 1.018, 1] }}
      transition={{
        duration: TURN_MS / 1000,
        ease: EASE,
        rotateX: { duration: TURN_MS / 1000, ease: 'easeInOut' },
        scale: { duration: TURN_MS / 1000, ease: 'easeInOut' },
      }}
      onAnimationComplete={onComplete}
      className={`absolute inset-y-[6%] z-[90] w-1/2 overflow-visible bg-transparent [transform-style:preserve-3d] [--flipbook-radius:22px] sm:[--flipbook-radius:30px] ${next ? 'left-1/2 origin-left' : 'left-0 origin-right'}`}
    >
      <div
        className="absolute inset-0 overflow-hidden bg-white shadow-[0_30px_75px_rgba(0,0,0,.28)] [backface-visibility:hidden] [transform-style:preserve-3d]"
        style={{
          borderTopLeftRadius: next ? 0 : radius,
          borderBottomLeftRadius: next ? 0 : radius,
          borderTopRightRadius: next ? radius : 0,
          borderBottomRightRadius: next ? radius : 0,
        }}
      >
        <PageContent page={front} />
        <CurlShade side={next ? 'right' : 'left'} />
      </div>

      <div
        className="absolute inset-0 overflow-hidden bg-white shadow-[0_30px_75px_rgba(0,0,0,.28)] [backface-visibility:hidden] [transform:rotateY(180deg)] [transform-style:preserve-3d]"
        style={{
          borderTopLeftRadius: next ? radius : 0,
          borderBottomLeftRadius: next ? radius : 0,
          borderTopRightRadius: next ? 0 : radius,
          borderBottomRightRadius: next ? 0 : radius,
        }}
      >
        <PageContent page={Math.max(1, Math.min(back, pages.length - 1))} />
        <CurlShade side={next ? 'left' : 'right'} />
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: .05, scaleX: .35 }}
        animate={{ opacity: [.05, .42, .18, .05], scaleX: [.35, 1, .82, .45] }}
        transition={{ duration: TURN_MS / 1000, ease: 'easeInOut' }}
        className={`pointer-events-none absolute inset-y-0 w-20 bg-gradient-to-r from-black/35 via-white/10 to-transparent mix-blend-multiply ${next ? 'right-0' : 'left-0'}`}
      />
    </motion.div>
  );
}

function CurlShade({ side }: { side: 'left' | 'right' }) {
  return (
    <>
      <div className={`pointer-events-none absolute inset-y-0 w-24 ${side === 'right' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/30 via-black/5 to-transparent`} />
      <div className={`pointer-events-none absolute top-0 h-full w-px ${side === 'right' ? 'right-0' : 'left-0'} bg-white/30`} />
    </>
  );
}

function PageContent({ page, cover = false }: { page: number; cover?: boolean }) {
  const item = pages[Math.max(0, Math.min(page, pages.length - 1))];
  const light = Boolean(item.light);

  return (
    <div className={`relative h-full overflow-hidden bg-gradient-to-br ${item.tone} p-5 ${light ? 'text-black' : 'text-white'} sm:p-8 ${cover ? 'sm:p-11' : ''}`}>
      <div className={`pointer-events-none absolute inset-0 ${light ? 'opacity-15' : 'opacity-20'} bg-[radial-gradient(circle_at_18%_20%,white_0,transparent_28%),radial-gradient(circle_at_82%_78%,white_0,transparent_30%)]`} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className={`text-[7px] font-medium uppercase tracking-[.28em] sm:text-[9px] ${light ? 'text-black/40' : 'text-white/40'}`}>
            {item.eyebrow}
          </p>
          <div className={`mt-3 h-px w-10 sm:mt-5 sm:w-12 ${light ? 'bg-black/15' : 'bg-white/20'}`} />
        </div>

        <div>
          <h3 className={`whitespace-pre-line text-[clamp(1.45rem,4.15vw,4rem)] font-semibold leading-[.84] tracking-[-.065em] ${cover ? 'text-[clamp(2.1rem,5.9vw,5.4rem)]' : ''}`}>
            {item.title}
          </h3>
          <p className={`mt-4 max-w-[32rem] text-[9px] leading-4 sm:mt-6 sm:text-xs sm:leading-5 ${light ? 'text-black/55' : 'text-white/50'}`}>
            {item.subtitle}
          </p>
        </div>

        <div className={`flex items-end justify-between text-[7px] uppercase tracking-[.2em] sm:text-[9px] ${light ? 'text-black/35' : 'text-white/35'}`}>
          <span>Digital experiences</span>
          <span>{String(page).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

function PageEdge({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 w-10 ${side === 'left' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/12 via-black/5 to-transparent`}
    />
  );
}

function NavButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/95 text-lg shadow-xl backdrop-blur transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-25 sm:h-12 sm:w-12"
    >
      {children}
    </button>
  );
}
