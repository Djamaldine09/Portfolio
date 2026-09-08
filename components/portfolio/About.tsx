'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Code2, Rocket, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PARCOURS_STATEMENT =
  "Passionné par le développement web depuis plusieurs années, j'ai acquis une solide expérience dans la création d'applications web modernes et performantes, combinant expertise technique et créativité pour livrer des solutions qui dépassent les attentes.";

const START_OPACITY = 0.15;
const SPREAD = 0.8;
const WORD_DURATION = 0.2;

interface WordProgressRange {
  start: number;
  end: number;
}

function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;
  return {
    start,
    end: Math.min(1, start + WORD_DURATION),
  };
}

function getWordOpacity(
  progress: number,
  { start, end }: WordProgressRange,
  startOpacity = START_OPACITY
): number {
  if (progress <= start) return startOpacity;
  if (progress >= end) return 1;
  const wordProgress = (progress - start) / (end - start);
  return startOpacity + (1 - startOpacity) * wordProgress;
}

function ParcoursWord({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count);
  const opacity = useTransform(progress, (latest) => getWordOpacity(latest, range));

  return (
    <motion.span style={reducedMotion ? undefined : { opacity }}>
      {children}
    </motion.span>
  );
}

function MonParcours() {
  const parcoursRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: parcoursRef,
    offset: ['start start', 'end end'],
  });
  const words = PARCOURS_STATEMENT.split(' ');

  return (
    <div ref={parcoursRef} className="relative min-h-[180vh]">
      <div className="sticky top-0 min-h-screen flex items-center py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-[2px_minmax(0,1fr)] gap-8 md:gap-10 items-start px-4">
          <div
            className="relative w-[2px] h-24 md:h-28 overflow-hidden rounded-full bg-blue-100"
            aria-hidden="true"
          >
            <motion.span
              className="absolute inset-0 block bg-gradient-to-b from-blue-600 to-cyan-600 origin-top rounded-full"
              style={{ scaleY: reducedMotion ? 1 : scrollYProgress }}
            />
          </div>

          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-blue-600/70">
              Mon parcours
            </p>
            <h3
              className="max-w-[26ch] text-2xl md:text-4xl font-bold leading-snug text-gray-900"
              aria-label={PARCOURS_STATEMENT}
            >
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <ParcoursWord
                    progress={scrollYProgress}
                    index={index}
                    count={words.length}
                    reducedMotion={Boolean(reducedMotion)}
                  >
                    {word}
                  </ParcoursWord>
                  {index < words.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(scrollYProgress, [0, 0.45], [40, -25]);
  const cardsY = useTransform(scrollYProgress, [0.05, 0.55], [50, -10]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Code2,
      title: 'Développement Web',
      description: 'Création d\'applications web modernes et performantes',
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'Solutions créatives utilisant les dernières technologies',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Travail d\'équipe et communication efficace',
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Code propre et bonnes pratiques de développement',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ y: headingY }}
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-4xl font-bold mb-4">
            À propos de{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              moi
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Développeur passionné avec plusieurs années d&apos;expérience dans la création
            d&apos;applications web modernes et performantes.
          </p>
        </motion.div>

        <motion.div style={{ y: cardsY }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-blue-200 transform ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-block p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

      </div>

      <MonParcours />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              Je suis constamment à l&apos;affût des dernières technologies et
              tendances du développement web. Mon objectif est de créer des
              expériences utilisateur exceptionnelles tout en maintenant un code
              de haute qualité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}