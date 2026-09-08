'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * ==============   Tech logos (inline SVG, no extra deps)   ================
 */
function ReactLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

function NextLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 8l7 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 10v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function TypeScriptLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 9h5M10.5 9v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M15 15.2c.3.6.9 1 1.7 1 .9 0 1.5-.4 1.5-1.1 0-1.7-3.1-.9-3.1-3 0-1 1-1.6 2-1.6.7 0 1.3.3 1.6.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NodeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 8v8M9 10l6 4M15 10l-6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * ==============   Ticker   ================
 * Repeats its content enough times to fill the row, alternating a solid
 * ("fill") and an outline ("stroke") treatment for every other repeat,
 * matching the editorial poster look.
 */
function Ticker({
  render,
  x,
  repeatCount = 6,
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

function WordSpan({ children, variant }: { children: string; variant: 'fill' | 'outline' }) {
  return (
    <span
      className={
        WORD_CLASS +
        ' ' +
        (variant === 'fill'
          ? 'text-white'
          : 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]')
      }
    >
      {children}
    </span>
  );
}

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

interface LineConfig {
  direction: 1 | -1;
  speed: number;
  content:
    | { kind: 'text'; word: string }
    | { kind: 'logos' };
}

const LINES: LineConfig[] = [
  { direction: 1, speed: 140, content: { kind: 'text', word: 'CREATIVE' } },
  { direction: -1, speed: 110, content: { kind: 'text', word: 'DESIGN' } },
  { direction: 1, speed: 170, content: { kind: 'logos' } },
  { direction: -1, speed: 120, content: { kind: 'text', word: 'STUDIO' } },
];

const LOGO_ITEMS: { icon: (className?: string) => ReactNode; label: string }[] = [
  { icon: (c) => <ReactLogo className={c} />, label: 'React' },
  { icon: (c) => <NextLogo className={c} />, label: 'Next.js' },
  { icon: (c) => <TypeScriptLogo className={c} />, label: 'TypeScript' },
  { icon: (c) => <NodeLogo className={c} />, label: 'Node.js' },
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
      className="relative py-20 md:py-28 overflow-hidden bg-[#0a0f0d]"
      aria-label="Points forts"
    >
      <div className="flex flex-col gap-2 md:gap-3">
        {LINES.map((line, index) => (
          <ScrollLine
            key={index}
            direction={line.direction}
            speed={line.speed}
            content={line.content}
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
  content,
  scrollYProgress,
}: {
  direction: 1 | -1;
  speed: number;
  content: LineConfig['content'];
  scrollYProgress: MotionValue<number>;
}) {
  const rawX = useTransform(scrollYProgress, [0, 1], [0, direction * speed * -1]);
  const x = useTransform(rawX, (value) => `calc(${value}px - 20%)`);

  if (content.kind === 'logos') {
    return (
      <Ticker
        x={x}
        render={(variant, key) => (
          <LogoSpan key={key} variant={variant}>
            {LOGO_ITEMS.map((item, i) => (
              <span key={i} className="flex items-center gap-3">
                {item.icon('w-12 h-12 md:w-16 md:h-16')}
                <span
                  className={
                    WORD_CLASS +
                    ' px-0 text-4xl md:text-6xl ' +
                    (variant === 'fill'
                      ? 'text-white'
                      : 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]')
                  }
                >
                  {item.label}
                </span>
                {i < LOGO_ITEMS.length - 1 && <span className="text-white/20 px-4">/</span>}
              </span>
            ))}
          </LogoSpan>
        )}
      />
    );
  }

  return (
    <Ticker x={x} render={(variant, key) => <WordSpan key={key} variant={variant}>{content.word}</WordSpan>} />
  );
}