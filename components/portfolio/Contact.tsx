'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message envoyé !",
      description: "Je vous répondrai dans les plus brefs délais.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@portfolio.com',
      href: 'mailto:contact@portfolio.com',
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+33 6 12 34 56 78',
      href: 'tel:+33612345678',
    },
    {
      icon: MapPin,
      label: 'Localisation',
      value: 'Paris, France',
      href: '#',
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-4xl font-bold mb-4">
            Me{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Contacter
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discutons de votre prochain projet
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-blue-200 transform ${
                  isVisible
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <a
                    href={info.href}
                    className="flex items-start space-x-4 group-hover:scale-105 transition-transform"
                  >
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:rotate-6 transition-transform">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card
              className={`border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-500 transform ${
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-10 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <CardHeader>
                <CardTitle>Envoyez-moi un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et je vous répondrai rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nom complet
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Jean Dupont"
                        required
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jean@example.com"
                        required
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Sujet
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Proposition de collaboration"
                      required
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre projet..."
                      rows={6}
                      required
                      className="transition-all duration-300 focus:scale-105 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span>
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div
          className={`mt-16 text-center transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="border-t pt-8">
            <p className="text-gray-600">
              © 2024 Portfolio. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
