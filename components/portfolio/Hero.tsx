'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, 
  Check, 
  Copy, 
  FileText, 
  Github, 
  Linkedin, 
  Sparkles,
  Radio
} from 'lucide-react';

// Variantes d'animation orchestrées (Stagger effect)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.1, 0.25, 1] 
    },
  },
};

const techStack = ['HTML', 'TypeScript', 'Next.js', 'React', 'Tailwind', 'Node.js'];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const email = "alexandre.v@example.com";
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);
  const backgroundBlur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(14px)']);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const smoothContentY = useSpring(contentY, { stiffness: 90, damping: 24, mass: 0.6 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[200vh] bg-[#070b14]"
    >
      <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 text-slate-100 sm:px-6 lg:px-12">
        <motion.div
          aria-hidden="true"
          style={{
            scale: backgroundScale,
            filter: backgroundBlur,
            opacity: backgroundOpacity,
            backgroundImage: "url('/avatar.png')",
          }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        />
        {/* Halo cyan / bleu en arrière-plan */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/4 top-1/2 -z-10 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-600/20 blur-[130px]"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >

          {/* ======================================================== */}
          {/* COLONNE GAUCHE : Badge de profil */}
          {/* ======================================================== */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            {/* Badge signalétique sous l'avatar */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400/90 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>PROFIL ACTIF : DJAMALDINE M. — ID-3094</span>
            </motion.div>
          </motion.div>

          {/* ======================================================== */}
          {/* COLONNE DROITE : Textes, Badges & Actions */}
          {/* ======================================================== */}
          <motion.div
            style={{ y: smoothContentY, opacity: contentOpacity, scale: contentScale }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            
            {/* Status Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-medium backdrop-blur-md mb-6">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Disponible pour de nouveaux projets</span>
              </div>
            </motion.div>

            {/* Titre Principal */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-slate-100 max-w-2xl mb-6"
            >
              Concevoir des applications{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                modernes, robustes
              </span>{' '}
              & performantes.
            </motion.h1>

            {/* Sous-titre */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed mb-8"
            >
              Bonjour, je suis <span className="text-white font-medium">Djamaldine</span>. Développeur Full Stack spécialisé dans la création d'expériences web interactives, scalables et soignées.
            </motion.p>

            {/* Stack Technique (Badges interactifs) */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10"
            >
              <span className="text-xs font-mono text-slate-500 uppercase mr-1">TechStack</span>
              {techStack.map((tech) => (
                <motion.span
                  key={tech}
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-xs font-medium text-slate-300 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors shadow-sm cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Boutons d'Action (CTAs) */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('projects')}
                className="w-full sm:w-auto px-7 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Explorer mes projets</span>
                <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 h-12 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800/90 text-slate-300 hover:text-white font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Télécharger mon CV</span>
              </motion.a>
            </motion.div>

            {/* Liens Sociaux & Copie Email */}
            <motion.div
              variants={itemVariants}
              className="flex max-w-full flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>

              {/* Copie rapide d'email animée */}
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyEmail}
                className="flex max-w-full min-w-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-mono text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.div
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 text-emerald-400 font-sans"
                    >
                      <Check className="w-4 h-4" />
                      <span>Email copié !</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex min-w-0 max-w-full items-center gap-1.5"
                    >
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span className="truncate">{email}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

          </motion.div>
        </motion.div>
        </div>

        {/* 8. Indicateur Scroll Souris Animé */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          onClick={() => scrollToSection('about')}
          aria-label="Scroll vers le bas"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition-colors hover:text-cyan-400"
        >
          <div className="flex h-9 w-5 justify-center rounded-full border-2 border-slate-700 p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-1 rounded-full bg-cyan-400"
            />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
