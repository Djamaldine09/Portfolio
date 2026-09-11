'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Sparkles } from 'lucide-react';

const MASK_SIZE = 270;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.55 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.55 });
  const maskX = useTransform(smoothX, (value) => `calc(${value}% - ${MASK_SIZE / 2}px)`);
  const maskY = useTransform(smoothY, (value) => `calc(${value}% - ${MASK_SIZE / 2}px)`);

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
        animate={reducedMotion ? undefined : { scale: [1, 1.035, 1] }}
        transition={reducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image src="/avatar.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-br from-lime-300/55 via-emerald-400/20 to-cyan-400/55 mix-blend-screen" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 rounded-full border border-white/40 bg-black/5 shadow-[0_0_0_1px_rgba(255,255,255,.08),0_25px_80px_rgba(0,0,0,.28)] backdrop-blur-[2px]"
        style={{ left: maskX, top: maskY, width: MASK_SIZE, height: MASK_SIZE }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-30 flex min-h-screen flex-col justify-between px-5 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-12 lg:pt-32">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_20px_rgba(190,242,100,.8)]" />
            Available for new projects
          </div>
          <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40 md:flex">
            Hover the mask
            <Sparkles size={14} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1450px] py-16 sm:py-20">
          <div className="max-w-6xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-white/50 sm:text-base">Full Stack Developer · Madagascar</p>
            <h1 className="font-black uppercase leading-[0.82] tracking-[-0.075em]">
              <span className="block text-[clamp(4.8rem,15vw,13rem)]">Djamaldine</span>
              <span className="block text-[clamp(4.8rem,15vw,13rem)] text-white/12 [-webkit-text-stroke:1px_rgba(255,255,255,.32)]">Moustafa</span>
            </h1>

            <div className="mt-8 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-[1.3fr_.7fr] md:items-end">
              <p className="max-w-2xl text-lg leading-7 text-white/65 sm:text-xl sm:leading-8">
                Je conçois des applications web et mobiles modernes, robustes et interactives avec une attention particulière portée au design, à l&apos;expérience utilisateur et aux performances.
              </p>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <motion.button whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => scrollToSection('projects')} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-lime-200">
                  Voir mes projets
                  <ArrowUpRight size={16} />
                </motion.button>
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
