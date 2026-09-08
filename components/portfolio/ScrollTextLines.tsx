'use client';

import { useRef, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, wrap, type MotionValue } from 'framer-motion';

/**
 * ==============   Ticker   ================
 * Repeats its content enough times to fill the row, alternating a solid
 * ("fill") and an outline ("stroke") treatment for every other repeat,
 * matching the editorial poster look.
 */
function Ticker({
  render,
  x,
  repeatCount = 14,
}: {
  render: (variant: 'fill' | 'outline', key: number) => ReactNode;
  x: MotionValue<string>;
  repeatCount?: number;
}) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="inline-flex items-center">
        {Array.from({ length: repeatCount * 2 }, (_, i) =>
          render(i % 2 === 0 ? 'fill' : 'outline', i)
        )}
      </motion.div>
    </div>
  );
}

const WORD_CLASS =
  "font-[900] uppercase tracking-tight text-6xl md:text-8xl leading-none px-6 shrink-0 [font-stretch:condensed]";

function LogoSpan({ children, variant }: { children: ReactNode; variant: 'fill' | 'outline' }) {
  return (
    <span
      className={
        'flex items-center gap-4 px-6 shrink-0 ' +
        (variant === 'fill' ? 'text-white' : 'text-white/25')
      }
    >
      {children}
    </span>
  );
}

interface LogoItem {
  src: string;
  label: string;
}

interface LineConfig {
  direction: 1 | -1;
  speed: number;
  items: LogoItem[];
}

const LOGO_ITEMS: LogoItem[] = [
  { src: '/tech/React.png', label: 'React' },
  { src: '/tech/logo-typescript.webp', label: 'TypeScript' },
  { src: '/tech/flutter-logo.png', label: 'Flutter' },
  { src: '/tech/next_js_logo.png', label: 'Next.js' },
  { src: '/tech/logo-node-js.png', label: 'Node.js' },
  { src: '/tech/javascript-js.png', label: 'Express' },
  { src: '/tech/python.png', label: 'Python' },
  { src: '/tech/laravel.png', label: 'Laravel' },
  { src: '/tech/angular.png', label: 'Angular' },
  { src: '/tech/dotnet.png', label: '.NET' },
  { src: '/tech/java.png', label: 'Java' },
];

// Split the logos into 4 groups so each scrolling line shows a different subset.
const LOGO_LINES: LogoItem[][] = [
  LOGO_ITEMS.slice(0, 3),
  LOGO_ITEMS.slice(3, 6),
  LOGO_ITEMS.slice(6, 9),
  LOGO_ITEMS.slice(9, 11),
];

const LINES: LineConfig[] = LOGO_LINES.map((group, i) => ({
  direction: (i % 2 === 0 ? 1 : -1) as 1 | -1,
  speed: 220 + i * 60,
  items: group,
}));

export default function ScrollTextLines() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden bg-[#0a0f0d]"
      aria-label="Points forts"
    >
      <div className="flex flex-col gap-2 md:gap-3">
        {LINES.map((line, index) => (
          <ScrollLine
            key={index}
            direction={line.direction}
            speed={line.speed}
            items={line.items}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function ScrollLine({
  direction,
  speed,
  items,
  scrollYProgress,
}: {
  direction: 1 | -1;
  speed: number;
  items: LogoItem[];
  scrollYProgress: MotionValue<number>;
}) {
  // Move the ticker by a large percentage of its own width as the user
  // scrolls, and wrap it back into a -100%..0% range so it always loops
  // seamlessly — the repeated content behind never runs out.
  const rawPercent = useTransform(scrollYProgress, [0, 1], [0, direction * speed]);
  const x = useTransform(rawPercent, (value) => `${wrap(-100, 0, -value)}%`);

  return (
    <Ticker
      x={x}
      render={(variant, key) => (
        <LogoSpan key={key} variant={variant}>
          {items.map((item, i) => (
            <span
              key={i}
              className={
                'flex items-center gap-3 ' + (variant === 'fill' ? 'opacity-100' : 'opacity-30')
              }
            >
              <span className="relative w-12 h-12 md:w-16 md:h-16 shrink-0">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </span>
              <span className={WORD_CLASS + ' px-0 text-4xl md:text-6xl text-white'}>
                {item.label}
              </span>
              {i < items.length - 1 && <span className="text-white/20 px-4">/</span>}
            </span>
          ))}
        </LogoSpan>
      )}
    />
  );
}