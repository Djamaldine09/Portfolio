'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * ==============   Ticker   ================
 * Duplicates its content enough times to fill the row twice over,
 * so the horizontal translation driven by scroll loops seamlessly.
 */
function Ticker({
  text,
  x,
  className,
  separator = '—',
}: {
  text: string;
  x: MotionValue<string>;
  className?: string;
  separator?: string;
}) {
  const repeated = Array.from({ length: 6 }, () => text).join(` ${separator} `);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className={`inline-flex ${className ?? ''}`}>
        <span className="pr-8">{repeated}</span>
        <span className="pr-8" aria-hidden="true">
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}

interface ScrollLineConfig {
  text: string;
  direction: 1 | -1;
  speed: number;
  className: string;
}

const LINES: ScrollLineConfig[] = [
  {
    text: 'Développeur Full-Stack',
    direction: 1,
    speed: 120,
    className: 'text-5xl md:text-7xl font-bold text-gray-900',
  },
  {
    text: 'React · Next.js · TypeScript',
    direction: -1,
    speed: 90,
    className:
      'text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent',
  },
  {
    text: 'Code propre, design soigné',
    direction: 1,
    speed: 150,
    className: 'text-5xl md:text-7xl font-bold text-gray-300',
  },
  {
    text: 'Disponible pour de nouveaux projets',
    direction: -1,
    speed: 100,
    className:
      'text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent',
  },
];

export default function ScrollTextLines() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-white"
      aria-label="Points forts"
    >
      <div className="flex flex-col gap-4 md:gap-6">
        {LINES.map((line, index) => (
          <ScrollLine
            key={index}
            text={line.text}
            direction={line.direction}
            speed={line.speed}
            className={line.className}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function ScrollLine({
  text,
  direction,
  speed,
  className,
  scrollYProgress,
}: {
  text: string;
  direction: 1 | -1;
  speed: number;
  className: string;
  scrollYProgress: MotionValue<number>;
}) {
  // Each line travels a different distance (speed) and direction as the
  // section crosses the viewport, producing the multi-speed editorial effect.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [`0px`, `${direction * speed * -1}px`]
  );
  const xPercent = useTransform(x, (value) => `calc(${value} - 25%)`);

  return <Ticker text={text} x={xPercent} className={className} />;
}