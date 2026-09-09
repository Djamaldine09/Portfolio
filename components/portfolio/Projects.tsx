'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ITEM_WIDTH = 380;
const GAP = 32;

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Plateforme e-commerce complète avec paiement intégré et gestion des stocks',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Supabase'],
    color: 'from-blue-600 to-cyan-600',
    github: '#',
    demo: '#',
  },
  {
    title: 'Task Management App',
    description: 'Application de gestion de tâches collaborative avec notifications en temps réel',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    color: 'from-purple-600 to-pink-600',
    github: '#',
    demo: '#',
  },
  {
    title: 'Portfolio CMS',
    description: 'Système de gestion de contenu pour portfolios créatifs',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Next.js', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
    color: 'from-emerald-600 to-teal-600',
    github: '#',
    demo: '#',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Tableau de bord analytique avec visualisations de données en temps réel',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Vue.js', 'D3.js', 'Express', 'Redis'],
    color: 'from-orange-600 to-red-600',
    github: '#',
    demo: '#',
  },
  {
    title: 'Social Media App',
    description: 'Application sociale avec messagerie instantanée et partage de contenu',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
    color: 'from-sky-600 to-indigo-600',
    github: '#',
    demo: '#',
  },
  {
    title: 'Learning Platform',
    description: "Plateforme d'apprentissage en ligne avec système de quiz interactifs",
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Next.js', 'Supabase', 'TailwindCSS', 'Stripe'],
    color: 'from-blue-600 to-violet-600',
    github: '#',
    demo: '#',
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
      }
      setViewportWidth(window.innerWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // How far the track needs to travel so its last item ends flush
  // with the right edge of the viewport (accounting for left padding).
  const totalDistance = Math.max(trackWidth - viewportWidth, 0);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <section id="projects" className="bg-gradient-to-br from-slate-50 to-white">
      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Mes{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Projets
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez une sélection de mes réalisations récentes
        </p>
      </div>

      {/* Scroll-driven horizontal gallery */}
      <div ref={containerRef} className="relative overflow-x-clip" style={{ height: `${projects.length * 70}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-x-clip">
          <motion.div
            ref={trackRef}
            className="flex pl-4 sm:pl-[calc((100vw-1280px)/2+16px)] pr-4 sm:pr-[calc((100vw-1280px)/2+16px)]"
            style={{ x, gap: `${GAP}px` }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="group shrink-0 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ width: `${ITEM_WIDTH}px` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-0 group-hover:opacity-40 mix-blend-multiply transition-opacity duration-300`}
                  />
                  <span className="absolute top-3 left-3 text-xs font-mono text-white/90 bg-black/30 backdrop-blur px-2 py-1 rounded">
                    0{index + 1}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group/btn hover:border-blue-600 hover:text-blue-600"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                        Code
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 bg-gradient-to-r ${project.color} hover:opacity-90`}
                      asChild
                    >
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}