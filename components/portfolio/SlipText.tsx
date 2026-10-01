'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type SlipTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

export default function SlipText({
  text,
  className = '',
  delay = 0.12,
  stagger = 0.035,
}: SlipTextProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <motion.p
      aria-label={text}
      initial="hidden"
      animate="visible"
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: reducedMotion
            ? undefined
            : {
                delayChildren: delay,
                staggerChildren: stagger,
              },
        },
      }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: {
                y: '115%',
                opacity: 0,
                rotateX: -28,
                filter: 'blur(5px)',
              },
              visible: {
                y: '0%',
                opacity: 1,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: reducedMotion ? 0 : 0.62,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      )).reduce<React.ReactNode[]>((result, word, index) => {
        result.push(word);
        if (index < words.length - 1) {
          result.push(
            <span key={`space-${index}`} aria-hidden="true">
              {'\u00a0'}
            </span>,
          );
        }
        return result;
      }, [])}
    </motion.p>
  );
}
