'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ITEM_WIDTH = 380;
const GAP = 32;

const techLogos: Record<string, string> = {
  'Next.js 15': '/tech/next_js_logo.png',
  'Next.js': '/tech/next_js_logo.png',
  TypeScript: '/tech/logo-typescript.webp',
  Flutter: '/tech/flutter-logo.png',
  Firebase: '/tech/firebase.svg',
  React: '/tech/react_dark.svg',
  'Node.js': '/tech/logo-node-js.png',
  Express: '/tech/expressjs.svg',
  'Express.js': '/tech/expressjs.svg',
  JWT: '/tech/jwt.svg',
  Laravel: '/tech/laravel.png',
  Java: '/tech/java.png',
  Python: '/tech/python.png',
  Angular: '/tech/angular.png',
  '.NET': '/tech/dotnet.png',
  JavaScript: '/tech/javascript-js.png',
  'Tailwind CSS': '/tech/tailwindcss.svg',
  TailwindCSS: '/tech/tailwindcss.svg',
  MongoDB: '/tech/mongodb-icon-dark.svg',
};

const projects = [
  {
    title: 'Exam Mada — Gestion des examens nationaux',
    description: 'Plateforme complète pour organiser les examens nationaux, gérer les candidats, les résultats, les paiements et les centres.',
    image: 'https://raw.githubusercontent.com/Djamaldine09/frontend/main/public/logo/logo-app.png',
    tags: ['Next.js 15', 'TypeScript', 'React', 'Express.js', 'JWT', 'Tailwind CSS', 'MongoDB'],
    color: 'from-cyan-600 to-teal-600',
    github: 'https://github.com/Djamaldine09/frontend',
    demo: 'https://exammada.site',
  },
  {
    title: 'Exam Mada — Application mobile candidat',
    description: 'Application Flutter dédiée aux candidats pour consulter les examens, résultats, paiements et documents de leur parcours.',
    image: '/projects/Application-ExamMada.png',
    imagePosition: 'center 25%',
    tags: ['Flutter', 'Firebase', 'Express.js', 'MongoDB'],
    color: 'from-indigo-600 to-cyan-600',
    github: 'https://github.com/Djamaldine09/Exam-Mada',
    demo: 'https://exammada.site',
  },
  {
    title: 'Ticket Place — Gestion et réservation de tickets',
    description: 'Plateforme de gestion et réservation de tickets avec authentification sécurisée, QR codes et notifications en temps réel.',
    image: 'https://raw.githubusercontent.com/Djamaldine09/e-ticket/main/uploads/0beeb1eb-a633-419f-b01c-0fa03087eddc.png',
    tags: ['Next.js 16', 'TypeScript', 'Spring Boot', 'Java', 'MySQL', 'JWT', 'Tailwind CSS', 'WebSocket'],
    color: 'from-violet-600 to-indigo-600',
    github: 'https://github.com/Djamaldine09/e-ticket',
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
    <section id="projects" className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Mes{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Projets
          </span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
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
                className="group shrink-0 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-cyan-500/50 bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ width: `${ITEM_WIDTH}px` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: project.imagePosition ?? 'center' }}
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
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                      Technologies utilisées
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => {
                        const logo = techLogos[tag];
                        return (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-2.5 py-1"
                          >
                            {logo ? (
                              <img
                                src={logo}
                                alt=""
                                className="w-4 h-4 object-contain"
                              />
                            ) : null}
                            <span>{tag}</span>
                          </Badge>
                        );
                      })}
                    </div>
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