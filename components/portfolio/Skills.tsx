'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Blend, Box, CircleDot, Columns2, Grid2X2, Image as ImageIcon, Layers3, MousePointer2, Move3D, PanelTop, Sparkles } from 'lucide-react';

const skills = [
  { title: 'Frontend', description: 'Interfaces modernes, rapides et responsives.', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'Backend', description: 'APIs robustes et architectures adaptées aux besoins.', technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'], image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'DevOps & Outils', description: 'Déploiement, versioning et automatisation.', technologies: ['Git', 'GitHub', 'Docker', 'CI/CD', 'AWS'], image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

const revealStyles = [
  { label: 'Curtain', icon: PanelTop }, { label: 'Double curtain', icon: Columns2 }, { label: 'Triple curtain', icon: Layers3 }, { label: 'Split columns', icon: Columns2 },
  { label: 'Split rows', icon: CircleDot }, { label: 'Bi-parting doors', icon: Move3D }, { label: '2×2 grid', icon: Grid2X2 }, { label: 'Clip reveal', icon: Box },
];

const animatedSections = [
  { heading: 'Creative interfaces', text: 'Des interfaces pensées pour raconter une histoire à travers le mouvement et la profondeur.', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { heading: 'Parallax experiences', text: 'Le contenu se déplace à des vitesses différentes pour créer une sensation de profondeur naturelle.', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { heading: 'Smooth interactions', text: 'Scroll, swipe et clavier pilotent la navigation avec des transitions continues et sans fin.', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { heading: 'Responsive by design', text: 'La composition passe naturellement du split horizontal à une présentation empilée sur mobile.', image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1600' },
];

const featureGroups = [
  ['Sections', 'Jusqu’à 10 sections, titres personnalisés, images gauche/droite ou haut/bas et boucle infinie.'],
  ['Layout', 'Mise en page côte à côte ou empilée avec comportement responsive.'],
  ['Typography', 'Famille, taille, graisse, style, espacement des lettres, hauteur de ligne et couleur.'],
  ['Divider', 'Séparateur activable avec couleur et épaisseur réglables, adapté à l’orientation.'],
  ['Overlay', 'Opacité réglable et direction haut, bas ou les deux pour garder le texte lisible.'],
  ['Animation', 'Vitesse, easing et transitions fluides en boucle continue.'],
  ['Interaction', 'Molette, swipe tactile, flèches, touches PageUp/PageDown et navigation circulaire.'],
  ['Styling', 'Composition propre, immersive et pensée pour occuper tout le viewport.'],
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const animatedRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const wheelLock = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [showDivider, setShowDivider] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.55);
  const [speed, setSpeed] = useState(0.8);
  const [reducedMotion, setReducedMotion] = useState(false);

  const pointer = useMotionValue(0);
  const smoothPointer = useSpring(pointer, { stiffness: 80, damping: 22, mass: 0.8 });
  const imageShift = useTransform(smoothPointer, [-1, 1], ['-5%', '5%']);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.12 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const listener = () => setReducedMotion(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const goTo = useCallback((direction: number) => {
    setActiveSection((current) => (current + direction + animatedSections.length) % animatedSections.length);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!animatedRef.current || !animatedRef.current.matches(':hover')) return;
      if (['ArrowRight', 'PageDown', 'ArrowDown'].includes(event.key)) { event.preventDefault(); goTo(1); }
      if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(event.key)) { event.preventDefault(); goTo(-1); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goTo]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (wheelLock.current || Math.abs(event.deltaY) < 8) return;
    wheelLock.current = true;
    goTo(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLock.current = false; }, reducedMotion ? 120 : speed * 700);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;
    const horizontalDirection = dx < 0 ? 1 : -1;
    const verticalDirection = dy < 0 ? 1 : -1;
    goTo(isHorizontal ? horizontalDirection : verticalDirection);
  };

  const current = animatedSections[activeSection];

  return (
    <section id="skills" ref={sectionRef} className="relative overflow-hidden bg-[#0a0f0d] py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mb-16 max-w-4xl transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400"><Sparkles className="h-4 w-4" />Mon savoir-faire</div>
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">Mes <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">Compétences</span></h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">Je conçois des expériences web modernes en combinant développement, animation et direction visuelle. Mes interfaces utilisent le scroll, le mouvement et le parallaxe pour donner vie aux contenus sans sacrifier les performances.</p>
        </div>

        <div className="mb-24 grid gap-8 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <motion.article key={skill.title} initial={{ opacity: 0, y: 50 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.7, delay: index * 0.15 }} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-sm">
              <div className="relative h-64 overflow-hidden">
                <motion.img src={skill.image} alt={skill.title} style={{ y: imageShift, scale: 1.08 }} className="absolute inset-0 h-[116%] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d]/30 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-mono text-cyan-300 backdrop-blur-md">0{index + 1}</span>
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-2xl font-semibold">{skill.title}</h3>
                <p className="mt-2 text-slate-400">{skill.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">{skill.technologies.map((technology) => <span key={technology} className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-sm text-cyan-200 transition-colors group-hover:border-cyan-400/40">{technology}</span>)}</div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400"><ImageIcon className="h-4 w-4" />Animated Section</div>
            <h3 className="text-4xl font-bold sm:text-5xl">About Parallax scroll</h3>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><MousePointer2 className="h-4 w-4" />Scroll / Swipe / Keyboard</div>
        </div>

        <div
          ref={animatedRef}
          tabIndex={0}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
          }}
          onMouseLeave={() => pointer.set(0)}
          className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${isHorizontal ? 'min-h-[620px] lg:min-h-[680px]' : 'min-h-[760px]'}`}
          aria-label="Animated Section About Parallax scroll"
        >
          <motion.div
            className={`absolute inset-0 flex ${isHorizontal ? 'flex-row' : 'flex-col'}`}
            animate={isHorizontal ? { x: `${-activeSection * 100}%` } : { y: `${-activeSection * 100}%` }}
            transition={reducedMotion ? { duration: 0 } : { duration: speed, ease: [0.22, 1, 0.36, 1] }}
          >
            {animatedSections.map((item, index) => (
              <article key={item.heading} className={`relative min-w-full min-h-full ${isHorizontal ? 'w-full' : 'h-full'} flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-stretch`}>
                <motion.div style={{ x: isHorizontal ? imageShift : 0, y: isHorizontal ? 0 : imageShift }} className={`${isHorizontal ? 'w-1/2' : 'h-1/2 w-full'} relative shrink-0 overflow-hidden`}>
                  <motion.img src={item.image} alt={item.heading} className="absolute inset-[-6%] h-[112%] w-[112%] object-cover" animate={{ scale: activeSection === index ? 1 : 1.06 }} transition={{ duration: reducedMotion ? 0 : speed + 0.2 }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(${isHorizontal ? '90deg' : '180deg'}, rgba(0,0,0,${overlayOpacity}), transparent 70%)` }} />
                </motion.div>
                <div className={`${isHorizontal ? 'w-1/2' : 'h-1/2 w-full'} flex shrink-0 flex-col justify-center bg-[#101613] p-8 sm:p-12 lg:p-16`}>
                  <span className="mb-5 font-mono text-xs tracking-[0.3em] text-cyan-400">0{index + 1} / 0{animatedSections.length}</span>
                  <motion.h4 key={`${item.heading}-${activeSection}`} initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : speed * 0.7 }} className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{item.heading}</motion.h4>
                  <motion.p key={`${item.text}-${activeSection}`} initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : speed * 0.8, delay: reducedMotion ? 0 : 0.08 }} className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">{item.text}</motion.p>
                </div>
              </article>
            ))}
          </motion.div>

          {showDivider && <div className={`pointer-events-none absolute bg-cyan-300/50 ${isHorizontal ? 'bottom-0 left-1/2 top-0 w-px' : 'left-0 right-0 top-1/2 h-px'}`} />}
          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-300 backdrop-blur-xl">Infinite loop</div>
          <div className="absolute bottom-5 left-5 flex gap-2">
            {animatedSections.map((_, index) => <button key={index} type="button" aria-label={`Go to section ${index + 1}`} onClick={() => setActiveSection(index)} className={`h-1.5 rounded-full transition-all ${index === activeSection ? 'w-9 bg-cyan-300' : 'w-2 bg-white/30 hover:bg-white/60'}`} />)}
          </div>
          <div className="absolute bottom-5 right-5 flex gap-2">
            <button type="button" onClick={() => goTo(-1)} className="rounded-full border border-white/15 bg-black/40 p-3 backdrop-blur-xl transition hover:bg-white/10" aria-label="Previous section"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => goTo(1)} className="rounded-full border border-white/15 bg-black/40 p-3 backdrop-blur-xl transition hover:bg-white/10" aria-label="Next section"><ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="pointer-events-none absolute right-5 top-5 hidden gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 lg:flex"><ArrowUp className="h-3 w-3" />Arrow keys<ArrowDown className="h-3 w-3" /></div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2">Layout
              <select value={isHorizontal ? 'horizontal' : 'vertical'} onChange={(e) => setIsHorizontal(e.target.value === 'horizontal')} className="rounded-lg border border-white/10 bg-[#101613] px-2 py-1 text-slate-200 outline-none"><option value="horizontal">Side-by-side</option><option value="vertical">Stacked</option></select>
            </label>
            <label className="flex items-center gap-2">Divider <input type="checkbox" checked={showDivider} onChange={(e) => setShowDivider(e.target.checked)} /></label>
            <label className="flex items-center gap-2">Overlay <input type="range" min="0" max="1" step="0.05" value={overlayOpacity} onChange={(e) => setOverlayOpacity(Number(e.target.value))} /></label>
            <label className="flex items-center gap-2">Speed <input type="range" min="0.35" max="1.5" step="0.05" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
          </div>
          <span className="font-mono text-cyan-300">{activeSection + 1} / {animatedSections.length}</span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureGroups.map(([title, description], index) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"><div className="mb-2 flex justify-between"><h4 className="font-semibold">{title}</h4><span className="font-mono text-[10px] text-slate-600">0{index + 1}</span></div><p className="text-sm leading-6 text-slate-400">{description}</p></div>)}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400"><ImageIcon className="h-4 w-4" />Scroll Reveal + Parallax</div>
            <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">Les animations de révélation, le scroll scrub et le parallaxe donnent de la profondeur à la section tout en restant fluides, responsives et respectueux de la réduction des mouvements.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{revealStyles.map(({ label, icon: Icon }, index) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40"><Icon className="mb-3 h-5 w-5 text-cyan-400" /><span className="text-xs leading-4 text-slate-300">{label}</span><span className="mt-2 block font-mono text-[10px] text-slate-600">0{index + 1}</span></div>)}</div>
          </div>
          <div className="relative mx-auto w-full max-w-xl"><div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/10 blur-3xl" /><div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl"><motion.img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Développement web et animation" className="h-full w-full object-cover" style={{ x: imageShift }} /><div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-cyan-950/70" /><div className="absolute inset-0 flex items-center justify-center"><div className="rounded-2xl border border-white/20 bg-black/30 px-6 py-5 text-center shadow-2xl backdrop-blur-xl"><Blend className="mx-auto mb-3 h-7 w-7 text-cyan-300" /><p className="font-mono text-sm text-cyan-200">SCROLL / REVEAL / PARALLAX</p><p className="mt-1 text-xs text-slate-400">Motion pensé pour le web</p></div></div></div></div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-sm text-slate-400"><span className="inline-flex items-center gap-2"><MousePointer2 className="h-4 w-4 text-cyan-400" />Scroll scrub</span><span className="inline-flex items-center gap-2"><Move3D className="h-4 w-4 text-cyan-400" />Parallax X / Y</span><span className="inline-flex items-center gap-2"><Box className="h-4 w-4 text-cyan-400" />Responsive</span><span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-400" />Reduced motion</span></div>
      </div>
    </section>
  );
}
