'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Code2, Rocket, Users, Award, type LucideIcon } from 'lucide-react';

type AboutPanel = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  stripe: string;
};

const panels: AboutPanel[] = [
  {
    number: '1',
    title: 'Développement Web',
    description:
      'Je conçois des applications web modernes, performantes et pensées pour offrir une expérience fluide sur tous les écrans.',
    icon: Code2,
    color: '#d7eee6',
    stripe: '#f5b83d',
  },
  {
    number: '2',
    title: 'Innovation',
    description:
      "J'explore les nouvelles technologies pour transformer des idées en expériences digitales créatives, utiles et interactives.",
    icon: Rocket,
    color: '#f4df9b',
    stripe: '#ef6b45',
  },
  {
    number: '3',
    title: 'Collaboration',
    description:
      "Je privilégie une communication claire et un travail d'équipe structuré pour faire avancer chaque projet efficacement.",
    icon: Users,
    color: '#f2b39b',
    stripe: '#159b65',
  },
  {
    number: '4',
    title: 'Qualité',
    description:
      'Code propre, interfaces soignées et bonnes pratiques : chaque détail compte pour construire des produits durables.',
    icon: Award,
    color: '#b9d6ed',
    stripe: '#4b75d1',
  },
];

const SLIVER = 34;
const INITIAL_BLANK = 0.10;
const REVEAL = 0.14;
const HOLD = 0.12;

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
  // The section starts completely empty. Each panel gets its own
  // scroll window and enters from the right only after the user scrolls.
  const start = INITIAL_BLANK + index * (REVEAL + HOLD);
  const end = start + REVEAL;

  // The first panel fills the viewport completely. Every following panel
  // settles one sliver from the left, while the previous panel remains
  // underneath and becomes the visible colored strip.
  const finalX = index === 0 ? '0px' : `${SLIVER}px`;
  const input: number[] = [0, start, end];
  const output: string[] = ['110vw', '110vw', finalX];

  for (let next = index + 1; next < panels.length; next += 1) {
    const nextStart = INITIAL_BLANK + next * (REVEAL + HOLD);
    input.push(nextStart);
    output.push(finalX);
  }

  const rawX = useTransform(progress, input, output, { clamp: true });
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.012), start, start + 0.025],
    [0, 0, 1],
    { clamp: true }
  );
  const smoothX = useSpring(rawX, {
    stiffness: 125,
    damping: 25,
    mass: 0.55,
  });
  const x = reducedMotion ? rawX : smoothX;
  const Icon = panel.icon;

  return (
    <motion.article
      initial={{ x: '110vw', opacity: 0 }}
      className="absolute inset-y-0 right-0 overflow-hidden border-y border-black/15"
      style={{ x, opacity, zIndex: index + 1, width: index === 0 ? '100%' : `calc(100% - ${SLIVER}px)` }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: panel.color }}
      />

      <div className="relative flex h-full min-h-[100svh] flex-col px-10 pb-16 pt-10 sm:px-16 sm:pb-20 sm:pt-12 md:px-20 lg:px-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-black text-white sm:h-14 sm:w-14">
              <Icon size={21} strokeWidth={2.2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-black sm:text-xs">
              À propos de moi
            </span>
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.28em] text-black/55">
            {String(index + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div
            className="select-none text-[clamp(12rem,48vw,31rem)] font-black leading-[0.7] tracking-[-0.11em] text-black"
            aria-hidden="true"
          >
            {panel.number}
          </div>

          <div className="mt-10 max-w-5xl sm:mt-14">
            <h2 className="max-w-5xl text-[clamp(2.7rem,9vw,7.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] text-black">
              {panel.title}
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-[1.25] tracking-[-0.02em] text-black/75 sm:mt-9 sm:text-2xl md:text-3xl">
              {panel.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.28em] text-black/55 sm:text-[10px]">
          <span>Scroll pour continuer</span>
          <span>About / {String(index + 1).padStart(2, '0')}</span>
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
      className="relative h-[520vh] bg-[#101214]"
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

        <div className="pointer-events-none absolute bottom-6 right-6 z-50 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/45 sm:bottom-9 sm:right-9">
          <span>About</span>
          <div className="h-1 w-16 overflow-hidden rounded-full bg-white/15 sm:w-20">
            <motion.div
              className="h-full origin-left bg-white/70"
              style={{ scaleX: reducedMotion ? 1 : scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
