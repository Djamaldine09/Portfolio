'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowDown, Code2, Layers3, Smartphone, Sparkles } from 'lucide-react';

type TimelineItem = {
  year: string;
  label: string;
  title: string;
  description: string;
  icon: typeof Code2;
  background: string;
  accent: string;
};

const timeline: TimelineItem[] = [
  {
    year: '2026',
    label: 'PORTFOLIO',
    title: 'Construire une identité digitale',
    description:
      "Un portfolio moderne pensé comme une expérience interactive : animations au scroll, interfaces soignées et composants réutilisables avec Next.js et TypeScript.",
    icon: Sparkles,
    background: '#07110d',
    accent: '#86efac',
  },
  {
    year: '2026',
    label: 'FULL-STACK',
    title: 'Gestion des résultats',
    description:
      "Développement d'une solution complète avec frontend et backend séparés, recherche publique des résultats et expérience utilisateur pensée pour une consultation rapide.",
    icon: Layers3,
    background: '#0b1020',
    accent: '#93c5fd',
  },
  {
    year: '2026',
    label: 'MOBILE',
    title: 'Applications utiles au quotidien',
    description:
      "Exploration du développement mobile avec Flutter pour transformer des besoins concrets en applications simples, accessibles et adaptées aux utilisateurs.",
    icon: Smartphone,
    background: '#120c1f',
    accent: '#c4b5fd',
  },
  {
    year: '2026',
    label: 'NEXT STEP',
    title: 'Créer des produits plus ambitieux',
    description:
      "Continuer à progresser en architecture, UX et animations web pour concevoir des produits performants, mémorables et réellement utiles.",
    icon: Code2,
    background: '#10130b',
    accent: '#fde68a',
  },
];

export default function ScrollTimelinePro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const yearRotate = useTransform(scrollYProgress, [0, 1], [-7, 7]);
  const yearY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative min-h-[400vh]"
      aria-label="Parcours et projets"
    >
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="relative mx-auto h-[calc(100vh-5rem)] min-h-[620px] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/20">
          <div className="absolute inset-0 bg-[#070a09]" />

          {timeline.map((item, index) => {
            const Icon = item.icon;
            const start = index / timeline.length;
            const end = (index + 1) / timeline.length;
            const opacity = reducedMotion
              ? 1
              : useTransform(scrollYProgress, [start, Math.min(1, end)], [index === 0 ? 1 : 0, index === timeline.length - 1 ? 1 : 0]);
            const scale = reducedMotion
              ? 1
              : useTransform(scrollYProgress, [start, Math.min(1, end)], [0.96, 1]);

            return (
              <motion.article
                key={`${item.year}-${item.label}`}
                className="absolute inset-0 flex items-center"
                style={{
                  backgroundColor: item.background,
                  opacity,
                  scale,
                  zIndex: index + 1,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,255,255,0.08),transparent_35%)]" />
                <div className="relative grid w-full grid-cols-1 gap-10 px-7 py-10 sm:px-12 lg:grid-cols-[1fr_1.2fr] lg:px-20">
                  <div className="flex items-center">
                    <motion.div
                      style={reducedMotion ? undefined : { rotate: yearRotate, y: yearY }}
                      className="select-none font-black leading-none tracking-[-0.08em] text-[clamp(7rem,22vw,20rem)] text-white/95"
                    >
                      {item.year}
                    </motion.div>
                  </div>

                  <div className="flex max-w-2xl flex-col justify-center lg:pr-8">
                    <div className="mb-5 flex items-center gap-3" style={{ color: item.accent }}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current/30 bg-white/5">
                        <Icon size={18} />
                      </span>
                      <span className="text-xs font-bold tracking-[0.28em]">{item.label}</span>
                    </div>

                    <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      {item.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                      {item.description}
                    </p>

                    <div className="mt-10 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                      <span className="h-px w-12 bg-white/20" />
                      {String(index + 1).padStart(2, '0')} / {String(timeline.length).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}

          <div className="pointer-events-none absolute bottom-7 left-7 z-30 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 sm:left-12">
            <ArrowDown size={14} />
            Scroll pour explorer
          </div>
        </div>
      </div>
    </section>
  );
}
