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
  {
    year: '2025',
    label: '01 / WEB DEVELOPMENT',
    description:
      'Premiers projets web avec une attention particulière portée aux interfaces modernes, au responsive design et aux expériences interactives.',
    background: '#A2D54C',
    foreground: '#111111',
  },
  {
    year: '2026',
    label: '02 / FULL-STACK',
    description:
      'Développement d’applications complètes avec Next.js, TypeScript et backend séparé, notamment autour de la gestion et de la consultation des résultats.',
    background: '#151515',
    foreground: '#F7F7F7',
  },
  {
    year: '2026',
    label: '03 / MOBILE',
    description:
      'Création d’expériences mobiles avec Flutter pour transformer des besoins concrets en applications simples, accessibles et efficaces.',
    background: '#FFFFFF',
    foreground: '#111111',
  },
  {
    year: '2026',
    label: '04 / NEXT DIRECTION',
    description:
      'Continuer à construire des produits numériques plus ambitieux en combinant développement, motion design, UX et créativité.',
    background: '#FF4433',
    foreground: '#111111',
  },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function range(value: number, from: number, to: number) {
  if (from === to) return value >= to ? 1 : 0;
  return clamp01((value - from) / (to - from));
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function TimelinePanel({
  item,
  index,
  progress,
  reducedMotion,
}: {
  item: TimelineItem;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const count = timeline.length;
  const step = 1 / (count - 1);

  const transitionStart = index === 0 ? 0 : (index - 1) * step;
  const transitionEnd = index * step;
  const nextStart = index * step;
  const nextEnd = Math.min(1, (index + 1) * step);

  const clipLeft = useTransform(progress, (value) => {
    if (index === 0) return 0;

    const local = range(value, transitionStart, transitionEnd);

    if (reducedMotion) return 100;

    return 100 - local * 100;
  });

  const clipPath = useTransform(
    clipLeft,
    (left) => `inset(0 0 0 ${left}%)`,
  );

  /*
   * The year enters from the right in a 3D flip, settles in the center,
   * then flips out to the left as the next panel takes over.
   */
  const yearX = useTransform(progress, (value) => {
    if (reducedMotion) return '0%';

    // First panel only has an exit animation.
    if (index === 0) {
      const t = easeInOutCubic(range(value, 0, step));
      return `${-18 * t}%`;
    }

    // Every following panel enters from the right.
    if (value <= transitionEnd) {
      const t = easeInOutCubic(range(value, transitionStart, transitionEnd));
      return `${18 * (1 - t)}%`;
    }

    // Intermediate panels then exit to the left.
    if (index < count - 1) {
      const t = easeInOutCubic(range(value, nextStart, nextEnd));
      return `${-18 * t}%`;
    }

    return '0%';
  });

  const yearRotate = useTransform(progress, (value) => {
    if (reducedMotion) return 0;

    if (index === 0) {
      const t = easeInOutCubic(range(value, 0, step));
      return -42 * t;
    }

    if (value <= transitionEnd) {
      const t = easeInOutCubic(range(value, transitionStart, transitionEnd));
      return 42 * (1 - t);
    }

    if (index < count - 1) {
      const t = easeInOutCubic(range(value, nextStart, nextEnd));
      return -42 * t;
    }

    return 0;
  });

  const yearRotateY = useTransform(progress, (value) => {
    if (reducedMotion) return 0;

    if (index === 0) {
      const t = easeInOutCubic(range(value, 0, step));
      return 55 * t;
    }

    if (value <= transitionEnd) {
      const t = easeInOutCubic(range(value, transitionStart, transitionEnd));
      return -55 * (1 - t);
    }

    if (index < count - 1) {
      const t = easeInOutCubic(range(value, nextStart, nextEnd));
      return 55 * t;
    }

    return 0;
  });

  const yearScale = useTransform(progress, (value) => {
    if (reducedMotion) return 1;

    let t = 0;

    if (index === 0) {
      t = easeInOutCubic(range(value, 0, step));
    } else if (value <= transitionEnd) {
      t = easeInOutCubic(range(value, transitionStart, transitionEnd));
    } else if (index < count - 1) {
      t = easeInOutCubic(range(value, nextStart, nextEnd));
    }

    return 1 - Math.sin(t * Math.PI) * 0.14;
  });

  const yearScaleX = useTransform(progress, (value) => {
    if (reducedMotion) return 1;

    let t = 0;

    if (index === 0) {
      t = easeInOutCubic(range(value, 0, step));
    } else if (value <= transitionEnd) {
      t = easeInOutCubic(range(value, transitionStart, transitionEnd));
    } else if (index < count - 1) {
      t = easeInOutCubic(range(value, nextStart, nextEnd));
    }

    return 1 - Math.sin(t * Math.PI) * 0.08;
  });

  const yearScaleY = useTransform(progress, (value) => {
    if (reducedMotion) return 1;

    let t = 0;

    if (index === 0) {
      t = easeInOutCubic(range(value, 0, step));
    } else if (value <= transitionEnd) {
      t = easeInOutCubic(range(value, transitionStart, transitionEnd));
    } else if (index < count - 1) {
      t = easeInOutCubic(range(value, nextStart, nextEnd));
    }

    return 1 + Math.sin(t * Math.PI) * 0.04;
  });

  return (
    <motion.article
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundColor: item.background,
        color: item.foreground,
        clipPath: reducedMotion
          ? index === 0
            ? 'inset(0)'
            : 'inset(0 0 0 100%)'
          : clipPath,
        zIndex: index + 1,
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-black/10" />

        <div className="absolute left-0 top-0 w-full px-6 pt-8 sm:px-12 sm:pt-14 lg:px-20 lg:pt-16">
          <div className="max-w-[720px]">
            <p className="text-[clamp(.8rem,1.55vw,1.2rem)] font-normal leading-tight opacity-70">
              {item.label}
            </p>

            <p className="mt-4 max-w-[780px] text-[clamp(1.1rem,3vw,2.15rem)] font-normal leading-[1.03] tracking-[-0.035em]">
              {item.description}
            </p>
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-[-0.025em] left-0 w-full overflow-visible px-0 text-center whitespace-nowrap font-black leading-[0.72] tracking-[-0.08em] text-[clamp(5rem,24vw,34rem)] sm:text-[clamp(8rem,27vw,34rem)]"
          style={{
            x: yearX,
            rotate: yearRotate,
            rotateY: yearRotateY,
            scale: yearScale,
            scaleX: yearScaleX,
            scaleY: yearScaleY,
            transformPerspective: 1000,
            transformOrigin: '50% 50%',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative min-h-[360vh] bg-black"
      aria-label="Parcours et projets"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center bg-black px-3 py-3 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        <div className="relative h-[calc(100svh-1.5rem)] max-h-[1200px] min-h-[520px] w-full max-w-[1400px] overflow-hidden rounded-[1.2rem] bg-black sm:h-[calc(100svh-4rem)] sm:min-h-[560px] sm:rounded-[1.5rem]">
          {timeline.map((item, index) => (
            <TimelinePanel
              key={`${item.label}-${index}`}
              item={item}
              index={index}
              progress={scrollYProgress}
              reducedMotion={Boolean(reducedMotion)}
            />
          ))}

          <div className="pointer-events-none absolute bottom-4 left-4 z-50 text-[8px] font-medium uppercase tracking-[0.25em] text-black/60 sm:bottom-7 sm:left-7 sm:text-[9px]">
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
