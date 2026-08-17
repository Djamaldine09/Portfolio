'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [copied, setCopied] = useState(false);
  const email = "alexandre.v@example.com";

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
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070b14] text-slate-100 px-4 sm:px-6 lg:px-12 py-20"
    >
      {/* 1. Arrière-plan High-Tech : Grille et halos néon */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Halo cyan / bleu en arrière-plan */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/30 to-blue-600/20 blur-[130px] rounded-full pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >

          {/* ======================================================== */}
          {/* COLONNE GAUCHE : Avatar Technologique & Anneaux Framer */}
          {/* ======================================================== */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              
              {/* Cadre délimiteur HUD */}
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl pointer-events-none">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
              </div>

              {/* Anneau 1 : Rotation horaire en pointillés */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30"
              />

              {/* Anneau 2 : Rotation anti-horaire double trait */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border-2 border-transparent border-t-cyan-400/70 border-b-blue-500/60"
              />

              {/* Halo d'énergie autour du portrait */}
              <div className="absolute inset-12 rounded-full bg-cyan-500/15 blur-xl animate-pulse" />

              {/* Conteneur Portrait Avatar */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-cyan-400/40 bg-slate-900 shadow-[0_0_35px_rgba(6,182,212,0.25)]"
              >
                {/* Ligne de scan animée verticalement */}
                <motion.div
                  animate={{ y: [-240, 240] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-[0_0_12px_#22d3ee]"
                />

                <Image
                  src="/avatar.png"
                  alt="Alexandre V. Avatar"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover relative z-10 opacity-90"
                  priority
                />
              </motion.div>
            </div>

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
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
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
            <motion.div variants={itemVariants} className="flex items-center gap-3">
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
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
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
                      className="flex items-center gap-1.5"
                    >
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>{email}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* 8. Indicateur Scroll Souris Animé */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        onClick={() => scrollToSection('about')}
        aria-label="Scroll vers le bas"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <div className="w-5 h-9 border-2 border-slate-700 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-cyan-400 rounded-full"
          />
        </div>
      </motion.button>
    </section>
  );
}
