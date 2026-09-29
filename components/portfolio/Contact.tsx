'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
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
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Message envoyé !',
      description: 'Je vous répondrai dans les plus brefs délais.',
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
      className="relative overflow-hidden bg-[#050707] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.06),transparent_38%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div
          className={`mb-14 transition-all duration-1000 sm:mb-16 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-[clamp(3.2rem,9vw,7.5rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
                Me{' '}
                <span className="bg-gradient-to-r from-lime-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  contacter
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Une idée, une collaboration ou un projet à construire ? Écrivez-moi.
              Nous pouvons commencer par une simple discussion.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <div
            className={`space-y-4 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,.24)] backdrop-blur-xl sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/35">
                    Disponibilité
                  </p>
                  <p className="mt-2 text-lg font-semibold">Ouvert aux collaborations</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.9)]" />
                  Disponible
                </span>
              </div>

              <div className="space-y-3">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;

                  return (
                    <a
                      key={info.label}
                      href={info.href}
                      className={`group flex items-center gap-4 rounded-2xl border border-white/8 bg-black/10 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06] ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                      style={{ transitionDelay: `${index * 90 + 180}ms` }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                        <Icon className="h-5 w-5 text-white/80 transition-colors group-hover:text-lime-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                          {info.label}
                        </p>
                        <p className="mt-1 truncate text-sm font-medium text-white/78 sm:text-[15px]">
                          {info.value}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime-200" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-cyan-300/[0.06] p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/30">
                Réponse
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
                Je privilégie les échanges simples, clairs et orientés vers la
                réalisation concrète.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
            style={{ transitionDelay: '220ms' }}
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_100px_rgba(0,0,0,.28)] backdrop-blur-2xl sm:p-7 lg:p-8">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/30">
                    Nouveau message
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    Construisons quelque chose
                  </h3>
                </div>
                <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] sm:flex">
                  <Send className="h-4 w-4 text-lime-200" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                      Nom complet
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jean Dupont"
                      required
                      className="h-12 rounded-xl border-white/10 bg-black/15 text-white placeholder:text-white/25 transition-all duration-300 focus:border-lime-300/40 focus:ring-2 focus:ring-lime-300/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean@example.com"
                      required
                      className="h-12 rounded-xl border-white/10 bg-black/15 text-white placeholder:text-white/25 transition-all duration-300 focus:border-lime-300/40 focus:ring-2 focus:ring-lime-300/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Proposition de collaboration"
                    required
                    className="h-12 rounded-xl border-white/10 bg-black/15 text-white placeholder:text-white/25 transition-all duration-300 focus:border-lime-300/40 focus:ring-2 focus:ring-lime-300/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Décrivez votre projet..."
                    rows={7}
                    required
                    className="resize-none rounded-xl border-white/10 bg-black/15 text-white placeholder:text-white/25 transition-all duration-300 focus:border-lime-300/40 focus:ring-2 focus:ring-lime-300/10"
                  />
                </div>

                <div className="flex flex-col gap-4 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-xs leading-5 text-white/30">
                    Votre message sera traité avec attention et confidentialité.
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="group h-12 rounded-full bg-white px-6 text-sm font-semibold text-black shadow-[0_12px_35px_rgba(255,255,255,.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-200 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        Envoi…
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Envoyer
                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
