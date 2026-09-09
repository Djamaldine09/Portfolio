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
      className="relative min-h-[200vh] w-full max-w-[100vw] overflow-x-hidden bg-[#070b14]"
    >
      <div className="sticky top-0 flex min-h-screen w-full max-w-[100vw] items-center justify-center overflow-hidden px-4 py-20 text-slate-100 sm:px-6 lg:px-12">

        {/* Fond glassmorphisme avec gradient animé */}
        <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(6,182,212,0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.22), transparent 55%), radial-gradient(circle at 50% 100%, rgba(139,92,246,0.18), transparent 60%)',
                'radial-gradient(circle at 30% 70%, rgba(6,182,212,0.25), transparent 55%), radial-gradient(circle at 70% 20%, rgba(59,130,246,0.22), transparent 55%), radial-gradient(circle at 50% 0%, rgba(139,92,246,0.18), transparent 60%)',
                'radial-gradient(circle at 20% 30%, rgba(6,182,212,0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.22), transparent 55%), radial-gradient(circle at 50% 100%, rgba(139,92,246,0.18), transparent 60%)',
              ],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
          />
          {/* Voile de verre pour l'effet glassmorphisme */}
          <div className="absolute inset-0 bg-[#070b14]/40 backdrop-blur-3xl" />
          {/* Grain léger pour la profondeur */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070b14]/20 to-[#070b14]" />
        </div>

        <div className="relative z-10 mx-auto min-w-0 w-full max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid min-w-0 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8"
        >

          {/* ======================================================== */}
          {/* COLONNE GAUCHE : Badge de profil */}
          {/* ======================================================== */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            {/* Carte glassmorphisme */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-3xl font-bold text-cyan-300 backdrop-blur-xl">
                  DM
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Djamaldine M.</p>
                  <p className="text-sm text-slate-400">Développeur Full Stack</p>
                </div>
              </div>
            </motion.div>

            {/* Badge signalétique */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 flex max-w-full items-center gap-2 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-mono text-cyan-400/90 shadow-sm"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 animate-ping" />
              <span className="truncate">PROFIL ACTIF : DJAMALDINE M. — ID-3094</span>
            </motion.div>
          </motion.div>

          {/* ======================================================== */}
          {/* COLONNE DROITE : Textes, Badges & Actions */}
          {/* ======================================================== */}
          <motion.div
            style={{ y: smoothContentY, opacity: contentOpacity, scale: contentScale }}
            className="min-w-0 lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            
            {/* Status Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md mb-6">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span className="break-words">Disponible pour de nouveaux projets</span>
              </div>
            </motion.div>

            {/* Titre Principal */}
            <motion.h1 
              variants={itemVariants}
              className="max-w-full break-words text-4xl font-bold leading-[1.15] tracking-tight text-slate-100 mb-6 sm:text-5xl lg:max-w-2xl lg:text-6xl"
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
              className="max-w-full break-words text-base leading-relaxed text-slate-400 mb-8 sm:text-lg sm:max-w-xl"
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

        {/* Indicateur Scroll Souris Animé */}
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