'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

type TimelineItem = {
  year: string;
  label: string;
  description: string;
  background: string;
  foreground: string;
};

const timeline: TimelineItem[] = [
  { year: '2025', label: '01 / WEB DEVELOPMENT', description: 'Premiers projets web avec une attention particulière portée aux interfaces modernes, au responsive design et aux expériences interactives.', background: '#A2D54C', foreground: '#111111' },
  { year: '2026', label: '02 / FULL-STACK', description: 'Développement d’applications complètes avec Next.js, TypeScript et backend séparé, notamment autour de la gestion et de la consultation des résultats.', background: '#151515', foreground: '#F7F7F7' },
  { year: '2026', label: '03 / MOBILE', description: 'Création d’expériences mobiles avec Flutter pour transformer des besoins concrets en applications simples, accessibles et efficaces.', background: '#FFFFFF', foreground: '#111111' },
  { year: '2026', label: '04 / NEXT DIRECTION', description: 'Continuer à construire des produits numériques plus ambitieux en combinant développement, motion design, UX et créativité.', background: '#FF4433', foreground: '#111111' },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
function range(value: number, from: number, to: number) {
  if (from === to) return value >= to ? 1 : 0;
  return clamp01((value - from) / (to - from));
}

function TimelinePanel({ item, index, progress, reducedMotion }: { item: TimelineItem; index: number; progress: MotionValue<number>; reducedMotion: boolean }) {
  const count = timeline.length;
  const transitionStart = index === 0 ? 0 : (index - 1) / (count - 1);
  const transitionEnd = index / (count - 1);
  const nextStart = index / (count - 1);
  const nextEnd = Math.min(1, (index + 1) / (count - 1));

  const clipLeft = useTransform(progress, (value) => {
    if (index === 0) return 0;
    const local = range(value, transitionStart, transitionEnd);
    return reducedMotion ? 100 : 100 - local * 100;
  });
  const clipPath = useTransform(clipLeft, (left) => `inset(0 0 0 ${left}%)`);

  const yearX = useTransform(progress, (value) => {
    if (index === 0) return reducedMotion ? 0 : -range(value, 0, 1 / (count - 1)) * 18;
    if (value < transitionEnd) return reducedMotion ? 0 : (1 - range(value, transitionStart, transitionEnd)) * 16;
    return reducedMotion ? 0 : -range(value, nextStart, nextEnd) * 18;
  });
  const yearRotate = useTransform(progress, (value) => {
    if (index === 0) return reducedMotion ? 0 : -range(value, 0, 1 / (count - 1)) * 34;
    if (value < transitionEnd) return reducedMotion ? 0 : (1 - range(value, transitionStart, transitionEnd)) * 10;
    return reducedMotion ? 0 : -range(value, nextStart, nextEnd) * 34;
  });
  const yearScale = useTransform(progress, (value) => {
    if (reducedMotion) return 1;
    if (index === 0) return 1 - range(value, 0, 1 / (count - 1)) * 0.02;
    return 0.98 + range(value, transitionStart, transitionEnd) * 0.02;
  });
  const yearTransformX = useTransform(yearX, (value) => `${value}%`);

  return (
    <motion.article
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundColor: item.background,
        color: item.foreground,
        clipPath: reducedMotion ? (index === 0 ? 'inset(0)' : 'inset(0 0 0 100%)') : clipPath,
        zIndex: index + 1,
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-black/10" />

        <div className="absolute left-0 top-0 w-full px-7 pt-10 sm:px-12 sm:pt-14 lg:px-20 lg:pt-16">
          <div className="max-w-[720px]">
            <p className="text-[clamp(.95rem,1.55vw,1.2rem)] font-normal leading-tight opacity-70">
              {item.label}
            </p>
            <p className="mt-4 max-w-[780px] text-[clamp(1.25rem,3vw,2.15rem)] font-normal leading-[1.03] tracking-[-0.035em]">
              {item.description}
            </p>
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute -bottom-[0.08em] left-[3%] whitespace-nowrap font-black leading-[0.72] tracking-[-0.09em] text-[clamp(12rem,42vw,34rem)]"
          style={{
            x: yearTransformX,
            rotate: yearRotate,
            scale: yearScale,
            transformOrigin: '50% 50%',
          }}
        >
          {item.year}
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function ScrollTimelinePro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  return (
    <section ref={sectionRef} id="timeline" className="relative min-h-[360vh] bg-black" aria-label="Parcours et projets">
      <div className="sticky top-0 flex h-screen items-center justify-center bg-black px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        <div className="relative h-[calc(100svh-2.5rem)] max-h-[1200px] min-h-[560px] w-full max-w-[1400px] overflow-hidden rounded-[1.35rem] bg-black sm:h-[calc(100svh-4rem)] sm:rounded-[1.5rem]">
          {timeline.map((item, index) => (
            <TimelinePanel key={`${item.label}-${index}`} item={item} index={index} progress={scrollYProgress} reducedMotion={Boolean(reducedMotion)} />
          ))}
          <div className="pointer-events-none absolute bottom-5 left-5 z-50 text-[9px] font-medium uppercase tracking-[0.25em] text-white/45 sm:bottom-7 sm:left-7">
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
