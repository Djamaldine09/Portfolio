'use client';

import { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUpRight, 
  Check, 
  Copy, 
  FileText, 
  Github, 
  Linkedin, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const email = "contact@example.com";

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
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 transition-colors"
    >
      {/* 1. Arrière-plan moderne : Grille + Dégradés diffus */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="flex flex-col items-center text-center">

          {/* 2. Badge de statut (Disponible) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950/30 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
              Disponible pour de nouveaux projets
            </span>
          </div>

          {/* 3. Titre principal avec dégradé et typographie percutante */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl leading-[1.15] mb-6">
            Concevoir des applications{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              modernes, robustes
            </span>{' '}
            & performantes.
          </h1>

          {/* 4. Sous-titre */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Bonjour, je suis <span className="font-semibold text-slate-900 dark:text-white">Alexandre</span>. 
            Développeur Full Stack spécialisé dans la création d'expériences web interactives et scalables.
          </p>

          {/* 5. Badges Stack Technique */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs font-medium text-slate-600 dark:text-slate-400">
            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'].map((tech) => (
              <span 
                key={tech} 
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* 6. Call to Actions (Boutons principaux) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto h-12 px-7 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 dark:text-blue-600 group-hover:rotate-12 transition-transform" />
              Explorer mes projets
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Button>

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-medium shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 gap-2"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Télécharger mon CV
            </a>
          </div>

          {/* 7. Réseaux & Action Rapide Email */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil GitHub"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil LinkedIn"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* Bouton de copie rapide d'email avec feedback */}
            <button
              onClick={handleCopyEmail}
              aria-label="Copier l'adresse email"
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Email copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{email}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 8. Indicateur de scroll minimaliste */}
      <button
        onClick={() => scrollToSection('about')}
        aria-label="Faire défiler vers le bas"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer group"
      >
        <span className="text-[11px] tracking-wider uppercase font-semibold text-slate-400/80 group-hover:text-slate-600 dark:group-hover:text-slate-300">
          Découvrir
        </span>
        <div className="w-6 h-10 border-2 border-slate-300 dark:border-slate-700 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce mt-1" />
        </div>
      </button>
    </section>
  );
}
