'use client';

import { useEffect, useRef, useState } from 'react';
import { Code2, Rocket, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
        <div
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
            Développeur passionné avec plusieurs années d'expérience dans la création
            d'applications web modernes et performantes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
        </div>

        <div
          className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Mon parcours</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Passionné par le développement web depuis plusieurs années, j'ai acquis
              une solide expérience dans la création d'applications web modernes et
              performantes. Mon approche combine expertise technique et créativité
              pour livrer des solutions qui dépassent les attentes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Je suis constamment à l'affût des dernières technologies et
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
