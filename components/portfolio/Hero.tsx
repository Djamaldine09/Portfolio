'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Sparkles } from 'lucide-react';

const MASK_SIZE = 270;
const HERO_BACKGROUND = '/1719.png';
const HOVER_BACKGROUND = '/portrait2.png';
const PORTRAIT = '/portrait.png';

const HERO_DESCRIPTION =
  "Je conçois des applications web et mobiles modernes, robustes et interactives avec une attention particulière portée au design, à l'expérience utilisateur et aux performances.";

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function HeroTextMotion() {
  const reducedMotion = useReducedMotion();
  const segments = HERO_DESCRIPTION.split(/(\s+)/);
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const startedAt = performance.now();
    const duration = 1250;

    const tick = (now: number) => {
      const next = Math.min(1, (now - startedAt) / duration);
      setProgress(next);

      if (next < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  let characterIndex = 0;

  return (
    <motion.p
      initial={reducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label={HERO_DESCRIPTION}
      className="w-full max-w-2xl whitespace-normal break-words font-[family-name:var(--font-manrope)] text-[1.05rem] font-medium leading-7 tracking-[-0.01em] text-white/65 sm:text-xl sm:leading-8"
    >
      {segments.map((segment, segmentIndex) => {
        if (/^\s+$/.test(segment)) {
          characterIndex += segment.length;
          return segment;
        }

        const chars = [...segment];
        return (
          <span key={`word-${segmentIndex}`} className="inline">
            {chars.map((character, indexInWord) => {
              const index = characterIndex + indexInWord;
              const revealPoint =
                index / Math.max(1, HERO_DESCRIPTION.length - 1);
              const characterProgress = Math.min(
                1,
                Math.max(0, (progress - revealPoint * 0.72) / 0.28),
              );
              const settled = reducedMotion || progress >= 0.98 || characterProgress > 0.7;
              const value =
                settled
                  ? character
                  : characterProgress > 0.35
                    ? character
                    : randomChar();

              return (
                <motion.span
                  key={`char-${segmentIndex}-${indexInWord}`}
                  aria-hidden="true"
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: settled ? 'blur(0px)' : 'blur(0.5px)',
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.16,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline"
                >
                  {value}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.p>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.55 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.55 });
  const maskX = useTransform(smoothX, (value) => `calc(${value}% - ${MASK_SIZE / 2}px)`);
  const maskY = useTransform(smoothY, (value) => `calc(${value}% - ${MASK_SIZE / 2}px)`);
  const revealClipPath = useMotionTemplate`circle(${MASK_SIZE / 2}px at ${smoothX}% ${smoothY}%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    mouseY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  const handlePointerLeave = () => {
    mouseX.set(50);
    mouseY.set(50);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen w-full overflow-hidden bg-[#070a09] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(163,230,53,.12),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(34,197,94,.08),transparent_30%)]" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        animate={undefined}
        transition={reducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-1.5%] bg-no-repeat"
          style={{
            backgroundImage: `url('${HERO_BACKGROUND}')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transform: 'scale(1.01)',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-emerald-400/5 to-black/20" />
<div className="absolute inset-0 bg-black/20" />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      >
        <img
          src={PORTRAIT}
          alt=""
          className="absolute bottom-0 left-1/2 h-[86svh] w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_18px_35px_rgba(0,0,0,.32)] sm:h-[90svh]"
        />
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[25] overflow-hidden"
        style={{ clipPath: revealClipPath }}
      >
        <img
          src={HOVER_BACKGROUND}
          alt=""
          className="absolute bottom-0 left-1/2 h-[86svh] w-auto max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[90svh]"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 rounded-full border border-white/40 bg-black/5 shadow-[0_0_0_1px_rgba(255,255,255,.08),0_25px_80px_rgba(0,0,0,.28)]"
        style={{ left: maskX, top: maskY, width: MASK_SIZE, height: MASK_SIZE }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[18%] z-10 mx-auto w-full max-w-[1450px] px-5 sm:px-8 lg:px-12 sm:top-[15%]"
      >
        <h1 className="w-full max-w-6xl overflow-hidden font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.82] tracking-[-0.09em]">
          <span className="block whitespace-nowrap text-[clamp(3.2rem,14vw,13rem)] sm:text-[clamp(4.8rem,15vw,13rem)]">Djamaldine</span>
          <span className="block whitespace-nowrap text-[clamp(3.2rem,14vw,13rem)] sm:text-[clamp(4.8rem,15vw,13rem)] text-white/12 [-webkit-text-stroke:1px_rgba(255,255,255,.32)]">Moustafa</span>
        </h1>
      </div>

      <div className="relative z-30 flex min-h-screen flex-col justify-between px-5 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-12 lg:pt-32">
        <div className="mx-auto w-full max-w-[1450px] py-16 sm:py-20">
          <div className="max-w-6xl">
            <h1 className="relative z-10 w-full max-w-full overflow-hidden font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.82] tracking-[-0.09em] opacity-0">
              <span className="block whitespace-nowrap text-[clamp(3.2rem,14vw,13rem)] sm:text-[clamp(4.8rem,15vw,13rem)]">Djamaldine</span>
              <span className="block whitespace-nowrap text-[clamp(3.2rem,14vw,13rem)] sm:text-[clamp(4.8rem,15vw,13rem)] text-white/12 [-webkit-text-stroke:1px_rgba(255,255,255,.32)]">Moustafa</span>
            </h1>

            <div className="mt-8 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-[1.3fr_.7fr] md:items-end">
              <HeroTextMotion />
              <div className="flex flex-wrap gap-3 md:justify-end">
                <motion.a
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/CV-Djamaldine-Moustafa.pdf"
                  download="CV-Djamaldine-Moustafa.pdf"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-lime-200"
                >
                  Télécharger mon CV
                  <ArrowUpRight size={16} />
                </motion.a>
                <motion.button whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => scrollToSection('contact')} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10">
                  Me contacter
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex items-center gap-2">
            <motion.a whileHover={{ y: -3, scale: 1.05 }} href="https://github.com/Djamaldine09" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 backdrop-blur-md hover:text-white">
              <Github size={18} />
            </motion.a>
            <motion.a whileHover={{ y: -3, scale: 1.05 }} href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/65 backdrop-blur-md hover:text-white">
              <Linkedin size={18} />
            </motion.a>
          </div>

          <button onClick={() => scrollToSection('about')} className="group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/45 hover:text-white">
            Scroll to explore
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-transform group-hover:translate-y-1">
              <ArrowDown size={14} />
            </span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-white/35 md:hidden">
        Touchez l&apos;écran et déplacez votre doigt
      </div>
    </section>
  );
}
