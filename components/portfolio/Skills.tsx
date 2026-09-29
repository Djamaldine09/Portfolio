'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

const skills = [
  { title: 'Frontend', description: 'Interfaces modernes, rapides et responsives.', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'Backend', description: 'APIs robustes et architectures adaptées aux besoins.', technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'], image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'DevOps & Outils', description: 'Déploiement, versioning et automatisation.', technologies: ['Git', 'GitHub', 'Docker', 'CI/CD', 'AWS'], image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

const animatedSections = [
  {
    heading: 'BLUE',
    text: 'Une direction visuelle forte construite autour du mouvement, de la profondeur et du contraste.',
    leftImage: 'https://images.pexels.com/photos/1631661/pexels-photo-1631661.jpeg?auto=compress&cs=tinysrgb&w=1800',
    rightImage: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1800',
  },
  {
    heading: 'MOTION',
    text: 'Chaque image accompagne le scroll et se révèle progressivement depuis des directions opposées.',
    leftImage: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1800',
    rightImage: 'https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&w=1800',
  },
  {
    heading: 'PARALLAX',
    text: 'Une dernière transition laisse naturellement la page continuer vers la section Contact.',
    leftImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1800',
    rightImage: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1800',
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const animatedScrollRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { scrollYProgress } = useScroll({
    target: animatedScrollRef,
    offset: ['start start', 'end end'],
  });

  const pointer = useMotionValue(0);
  const smoothPointer = useSpring(pointer, { stiffness: 80, damping: 22, mass: 0.8 });
  const parallaxX = useTransform(smoothPointer, [-1, 1], ['-2.5%', '2.5%']);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.12 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const listener = () => setReducedMotion(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      const next = Math.min(
        animatedSections.length - 1,
        Math.floor(progress * animatedSections.length),
      );
      setActiveSection(next);
    });
  }, [scrollYProgress]);

  const current = animatedSections[activeSection];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`relative overflow-hidden py-24 transition-colors duration-500 sm:py-32 ${
        isDarkMode ? 'bg-[#0a0f0d] text-white' : 'bg-[#f4f6f2] text-[#101311]'
      }`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDarkMode
            ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.10),transparent_30%)]'
            : 'bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(132,204,22,0.08),transparent_30%)]'
        }`}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mb-14 max-w-4xl transition-all duration-1000 sm:mb-16 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="max-w-4xl text-[clamp(3.2rem,9vw,7.5rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
            Mes{' '}
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode
                  ? 'from-lime-300 via-white to-cyan-300'
                  : 'from-lime-600 via-slate-900 to-cyan-600'
              }`}
            >
              compétences
            </span>
          </h2>
          <p className={`mt-6 max-w-3xl text-lg leading-8 sm:text-xl ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Je conçois des expériences web modernes en combinant développement, animation et direction visuelle. Mes interfaces utilisent le scroll, le mouvement et le parallaxe pour donner vie aux contenus sans sacrifier les performances.
          </p>
        </div>

        <div className="mb-24 grid gap-8 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <motion.article
              key={skill.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className={`group overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-sm transition-colors duration-500 ${
                isDarkMode
                  ? 'border-white/10 bg-white/[0.04]'
                  : 'border-black/10 bg-white/75'
              }`}
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={skill.image}
                  alt={skill.title}
                  style={{ x: parallaxX, scale: 1.08 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${
                    isDarkMode
                      ? 'from-[#0a0f0d] via-[#0a0f0d]/30'
                      : 'from-[#f4f6f2] via-[#f4f6f2]/20'
                  } to-transparent`}
                />
                <span className={`absolute bottom-5 left-5 rounded-full border px-3 py-1 text-xs font-mono backdrop-blur-md ${
                  isDarkMode
                    ? 'border-white/20 bg-black/30 text-cyan-300'
                    : 'border-black/10 bg-white/75 text-cyan-700'
                }`}>0{index + 1}</span>
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-2xl font-semibold">{skill.title}</h3>
                <p className={`mt-2 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>{skill.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {skill.technologies.map((technology) => (
                    <span
                      key={technology}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        isDarkMode
                          ? 'border-cyan-400/20 bg-cyan-400/5 text-cyan-200 group-hover:border-cyan-400/40'
                          : 'border-cyan-600/15 bg-cyan-500/5 text-cyan-700 group-hover:border-cyan-600/30'
                      }`}
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mb-8">
          <div className={`mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] ${
            isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <ImageIcon className="h-4 w-4" />Animated Section
          </div>
          <h3 className={`text-4xl font-bold sm:text-5xl ${
            isDarkMode ? 'text-white' : 'text-[#101311]'
          }`}>About Parallax scroll</h3>
        </div>

        <div ref={animatedScrollRef} className="relative min-h-[300vh]">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div
              ref={animatedRef}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
              }}
              onMouseLeave={() => pointer.set(0)}
              className={`relative h-[68vh] min-h-[520px] max-h-[820px] w-full overflow-hidden rounded-none sm:rounded-[2rem] ${
                isDarkMode ? 'bg-black' : 'bg-slate-900 shadow-[0_24px_80px_rgba(15,23,42,.14)]'
              }`}
              aria-label="Animated Section About Parallax scroll"
            >
              <motion.div
                className="absolute inset-0"
                key={activeSection}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.45 }}
              >
            <motion.div
              initial={reducedMotion ? false : { y: '-100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
            >
              <motion.img
                src={current.leftImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ x: parallaxX }}
                initial={reducedMotion ? false : { scale: 1.16 }}
                animate={{ scale: 1 }}
                transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            <motion.div
              initial={reducedMotion ? false : { y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1], delay: reducedMotion ? 0 : 0.04 }}
              className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
            >
              <motion.img
                src={current.rightImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ x: parallaxX }}
                initial={reducedMotion ? false : { scale: 1.16 }}
                animate={{ scale: 1 }}
                transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-black/25" />

            <motion.div
              initial={reducedMotion ? false : { y: '-50%', opacity: 0 }}
              animate={{ y: '-50%', opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.15 }}
              className="absolute inset-x-0 top-1/2 z-10 flex w-full -translate-y-1/2 justify-center px-4 text-center"
            >
              <div className="w-full max-w-2xl">
                <h4 className="text-4xl font-black leading-none tracking-tight text-white drop-shadow-2xl sm:text-7xl md:text-8xl lg:text-9xl">{current.heading}</h4>
                <p className="mx-auto mt-4 max-w-[18rem] text-xs leading-5 text-white/75 drop-shadow-lg sm:mt-5 sm:max-w-md sm:text-base sm:leading-6">{current.text}</p>
              </div>
            </motion.div>

            <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {animatedSections.map((_, index) => (
                <span key={index} className={`h-1 rounded-full transition-all duration-500 ${index === activeSection ? 'w-10 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </motion.div>
            </div>
          </div>
        </div>

        <p className={`mt-5 text-center text-xs uppercase tracking-[0.25em] ${
          isDarkMode ? 'text-slate-600' : 'text-slate-500'
        }`}>Scroll pour découvrir · 3 transitions · puis Contact</p>
      </div>
    </section>
  );
}
