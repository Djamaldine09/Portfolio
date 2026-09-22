'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Code2, Rocket, Users, Award, type LucideIcon } from 'lucide-react';

type AboutPanel = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const panels: AboutPanel[] = [
  {
    number: '01',
    title: 'Développement Web',
    description:
      "Je conçois des applications web modernes, performantes et pensées pour offrir une expérience fluide sur tous les écrans.",
    icon: Code2,
    accent: 'bg-[#d8f0e7]',
  },
  {
    number: '02',
    title: 'Innovation',
    description:
      "J'explore les nouvelles technologies pour transformer des idées en expériences digitales créatives, utiles et interactives.",
    icon: Rocket,
    accent: 'bg-[#f4df9b]',
  },
  {
    number: '03',
    title: 'Collaboration',
    description:
      "Je privilégie une communication claire et un travail d'équipe structuré pour faire avancer chaque projet efficacement.",
    icon: Users,
    accent: 'bg-[#f2b39b]',
  },
  {
    number: '04',
    title: 'Qualité',
    description:
      'Code propre, interfaces soignées et bonnes pratiques : chaque détail compte pour construire des produits durables.',
    icon: Award,
    accent: 'bg-[#b9d6ed]',
  },
];

const STACK_SLIVER = 32;

function StackPanel({
  panel,
  index,
  progress,
  reducedMotion,
}: {
  panel: AboutPanel;
  index: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  reducedMotion: boolean;
}) {
  const count = panels.length;
  const start = index / count;
  const revealEnd = Math.min(1, start + 0.24);
  const targetX = -(index * STACK_SLIVER);
  const x = useTransform(
    progress,
    [start, revealEnd],
    ['100%', `${targetX}px`],
    { clamp: true }
  );
  const smoothX = useSpring(x, { stiffness: 110, damping: 24, mass: 0.65 });
  // Reduced motion keeps the same sequential scroll behavior, only without the spring.
  const panelX = reducedMotion ? x : smoothX;
  const Icon = panel.icon;

  return (
    <motion.article
      style={{ x: panelX, zIndex: index + 1 }}
      className={`absolute inset-y-0 left-0 right-0 overflow-hidden border-y border-black/10 shadow-[-18px_0_50px_rgba(0,0,0,0.08)] ${panel.accent}`}
    >
      <div className="flex h-full min-h-[100svh]">
        <div className="flex w-[18px] shrink-0 flex-col border-r border-black/15 bg-black/[0.04] sm:w-[32px] md:w-[44px]">
          <div className="flex flex-1 items-center justify-center">
            <span className="hidden text-[7rem] font-black leading-none tracking-[-0.1em] text-black sm:text-[10rem] md:text-[13rem]">
              {panel.number}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center px-6 py-20 sm:px-10 md:px-16 lg:px-24">
          <div className="w-full max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-black text-white">
                <Icon size={21} strokeWidth={2.2} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-black/55">
                À propos de moi
              </span>
            </div>

            <h2 className="max-w-4xl text-[clamp(3.5rem,14vw,8.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] text-black sm:text-[clamp(4.8rem,10vw,8.5rem)]">
              {panel.title}
            </h2>

            <p className="mt-9 max-w-2xl text-xl leading-[1.3] tracking-[-0.02em] text-black/75 sm:text-2xl md:text-3xl">
              {panel.description}
            </p>

            <div className="mt-12 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-black/45">
              <span className="h-px w-14 bg-black/35" />
              <span>Scroll pour continuer</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[400vh] bg-[#101214] text-black"
    >
      <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden">
        {panels.map((panel, index) => (
          <StackPanel
            key={panel.number}
            panel={panel}
            index={index}
            progress={scrollYProgress}
            reducedMotion={Boolean(reducedMotion)}
          />
        ))}

        <div className="pointer-events-none absolute bottom-7 right-7 z-30 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-black/45 sm:bottom-10 sm:right-10">
          <span>About</span>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-black/10">
            <motion.div
              className="h-full origin-left bg-black/70"
              style={{ scaleX: reducedMotion ? 1 : scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
