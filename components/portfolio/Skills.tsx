'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Blend, Box, CircleDot, Columns2, Grid2X2, Image as ImageIcon, Layers3, MousePointer2, Move3D, PanelTop, Sparkles } from 'lucide-react';

const skills = [
  { title: 'Frontend', description: 'Interfaces modernes, rapides et responsives.', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'Backend', description: 'APIs robustes et architectures adaptées aux besoins.', technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'], image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'DevOps & Outils', description: 'Déploiement, versioning et automatisation.', technologies: ['Git', 'GitHub', 'Docker', 'CI/CD', 'AWS'], image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

const revealStyles = [
  { label: 'Curtain', icon: PanelTop }, { label: 'Double curtain', icon: Columns2 }, { label: 'Triple curtain', icon: Layers3 }, { label: 'Split columns', icon: Columns2 },
  { label: 'Split rows', icon: CircleDot }, { label: 'Bi-parting doors', icon: Move3D }, { label: '2×2 grid', icon: Grid2X2 }, { label: 'Clip reveal', icon: Box },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.12 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
                <motion.img src={skill.image} alt={skill.title} style={{ y: imageY, scale: imageScale }} className="absolute inset-0 h-[116%] w-full object-cover" />
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

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400"><ImageIcon className="h-4 w-4" />Animated Section</div>
            <h3 className="text-3xl font-bold sm:text-4xl">About Parallax scroll</h3>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">Customize every part of the experience with flexible controls:</p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                ['Sections', 'Add up to 10 sections, custom heading text, left/right or top/bottom images, seamless infinite loop between sections.'],
                ['Layout', 'Side-by-side or stacked layout with responsive split behavior.'],
                ['Typography', 'Font family, size, weight, style, letter spacing, line height and text color control.'],
                ['Divider', 'Toggle divider on/off with adjustable color and thickness, adapting to horizontal or vertical layout.'],
                ['Overlay', 'Adjustable opacity, direction control (top, bottom, both) and improved text readability over images.'],
                ['Animation', 'Transition speed, easing style selection and smooth continuous looping transitions.'],
                ['Interaction', 'Scroll navigation, touch swipe, keyboard navigation with arrow/page keys and continuous loop navigation.'],
                ['Styling', 'Clean, full-viewport layout designed for an immersive presentation.'],
              ].map(([title, description], index) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.07]">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold text-white">{title}</h4>
                    <span className="font-mono text-[10px] text-slate-600">0{index + 1}</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
              <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-[-8%]"><img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Développement web et animation" className="h-full w-full object-cover" /></motion.div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-cyan-950/70" />
              <div className="absolute inset-0 flex items-center justify-center"><div className="rounded-2xl border border-white/20 bg-black/30 px-6 py-5 text-center shadow-2xl backdrop-blur-xl"><Blend className="mx-auto mb-3 h-7 w-7 text-cyan-300" /><p className="font-mono text-sm text-cyan-200">SCROLL / REVEAL / PARALLAX</p><p className="mt-1 text-xs text-slate-400">Motion pensé pour le web</p></div></div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2"><MousePointer2 className="h-4 w-4 text-cyan-400" />Scroll scrub</span>
          <span className="inline-flex items-center gap-2"><Move3D className="h-4 w-4 text-cyan-400" />Parallax X / Y</span>
          <span className="inline-flex items-center gap-2"><Box className="h-4 w-4 text-cyan-400" />Responsive</span>
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-400" />Reduced motion</span>
        </div>
      </div>
    </section>
  );
}
