'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Send,
  Sun,
  Moon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
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

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('contact-theme');
    if (savedTheme === 'light') setIsLightMode(true);
  }, []);

  const toggleTheme = () => {
    setIsLightMode((current) => {
      const next = !current;
      window.localStorage.setItem('contact-theme', next ? 'light' : 'dark');
      return next;
    });
  };

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
      className={`relative overflow-hidden px-4 py-24 transition-colors duration-500 sm:px-6 lg:px-8 lg:py-32 ${isLightMode ? "bg-[#f4f6f2] text-[#101311]" : "bg-[#050707] text-white"}`}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isLightMode ? 'Activer le mode sombre' : 'Activer le mode clair'}
        className={`absolute right-4 top-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 sm:right-6 lg:right-8 ${
          isLightMode
            ? 'border-black/10 bg-black/[0.04] text-[#101311] hover:bg-black/[0.08]'
            : 'border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]'
        }`}
      >
        {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full blur-3xl transition-opacity duration-500 ${isLightMode ? "bg-lime-300/15" : "bg-lime-400/10"}`} />
        <div className={`absolute bottom-[-18%] right-[-8%] h-[420px] w-[420px] rounded-full blur-3xl transition-opacity duration-500 ${isLightMode ? "bg-cyan-300/15" : "bg-cyan-400/10"}`} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${isLightMode ? "bg-[radial-gradient(circle_at_top,rgba(0,0,0,.04),transparent_38%)]" : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,.06),transparent_38%)]"}`} />
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

            <p className={`max-w-xl text-base leading-7 sm:text-lg sm:leading-8 ${isLightMode ? "text-black/55" : "text-white/55"}`}>
              Une idée, une collaboration ou un projet à construire ? Écrivez-moi.
              Nous pouvons commencer par une simple discussion.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
          <div
            className={`space-y-7 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
          >
            <div className={`space-y-1 border-y py-2 ${isLightMode ? "border-black/10" : "border-white/10"}`}>
              {contactInfo.map((info, index) => {
                const Icon = info.icon;

                return (
                  <a
                    key={info.label}
                    href={info.href}
                    className={`group flex items-center gap-4 border-b py-5 last:border-b-0 transition-all duration-500 hover:pl-2 ${isLightMode ? "border-black/8" : "border-white/8"} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${index * 90 + 180}ms` }}
                  >
                    <Icon className={`h-5 w-5 shrink-0 transition-colors duration-300 group-hover:text-lime-500 ${isLightMode ? "text-black/45" : "text-white/45"}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isLightMode ? "text-black/35" : "text-white/30"}`}>
                        {info.label}
                      </p>
                      <p className={`mt-1 truncate text-sm font-medium sm:text-[15px] ${isLightMode ? "text-black/75" : "text-white/80"}`}>
                        {info.value}
                      </p>
                    </div>
                    <ArrowUpRight className={`h-4 w-4 transition-transform duration-300 ${isLightMode ? "text-black/20" : "text-white/20"} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime-500"`} />
                  </a>
                );
              })}
            </div>

            <div className="pt-2">
              <p className={`text-xs font-medium uppercase tracking-[0.22em] ${isLightMode ? "text-black/35" : "text-white/30"}`}>
                Réponse
              </p>
              <p className={`mt-2 max-w-md text-sm leading-6 ${isLightMode ? "text-black/55" : "text-white/55"}`}>
                Je privilégie les échanges simples, clairs et orientés vers la
                réalisation concrète.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
            style={{ transitionDelay: '220ms' }}
          >
            <div className={`rounded-[2rem] border p-5 backdrop-blur-2xl transition-colors duration-500 sm:p-7 lg:p-8 ${isLightMode ? "border-black/10 bg-white/80 shadow-[0_28px_100px_rgba(0,0,0,.08)]" : "border-white/10 bg-white/[0.04] shadow-[0_28px_100px_rgba(0,0,0,.28)]"}`}>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-[0.22em] ${isLightMode ? "text-black/35" : "text-white/30"}`}>
                    Nouveau message
                  </p>
                  <h3 className={`mt-2 text-2xl font-semibold tracking-tight ${isLightMode ? "text-[#101311]" : "text-white"}`}>
                    Construisons quelque chose
                  </h3>
                </div>
                <div className={`hidden h-10 w-10 items-center justify-center rounded-full border sm:flex ${isLightMode ? "border-black/10 bg-black/[0.03]" : "border-white/10 bg-white/[0.04]"}`}>
                  <Send className="h-4 w-4 text-lime-500" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className={`text-xs font-medium uppercase tracking-[0.14em] ${isLightMode ? "text-black/45" : "text-white/45"}`}>
                      Nom complet
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jean Dupont"
                      required
                      className={`h-12 rounded-xl border transition-all duration-300 focus:ring-2 ${isLightMode ? "border-black/10 !bg-white !text-[#101311] !caret-lime-600 placeholder:text-black/35 focus:border-lime-500/50 focus:ring-lime-500/10" : "border-white/10 !bg-[#0b1110] !text-white !caret-lime-200 placeholder:text-white/35 focus:border-lime-300/40 focus:ring-lime-300/10 [&:-webkit-autofill]:!bg-[#0b1110] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0b1110_inset]"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className={`text-xs font-medium uppercase tracking-[0.14em] ${isLightMode ? "text-black/45" : "text-white/45"}`}>
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean@example.com"
                      required
                      className={`h-12 rounded-xl border transition-all duration-300 focus:ring-2 ${isLightMode ? "border-black/10 !bg-white !text-[#101311] !caret-lime-600 placeholder:text-black/35 focus:border-lime-500/50 focus:ring-lime-500/10" : "border-white/10 !bg-[#0b1110] !text-white !caret-lime-200 placeholder:text-white/35 focus:border-lime-300/40 focus:ring-lime-300/10 [&:-webkit-autofill]:!bg-[#0b1110] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0b1110_inset]"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className={`text-xs font-medium uppercase tracking-[0.14em] ${isLightMode ? "text-black/45" : "text-white/45"}`}>
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Proposition de collaboration"
                    required
                    className={`h-12 rounded-xl border transition-all duration-300 focus:ring-2 ${isLightMode ? "border-black/10 !bg-white !text-[#101311] !caret-lime-600 placeholder:text-black/35 focus:border-lime-500/50 focus:ring-lime-500/10" : "border-white/10 !bg-[#0b1110] !text-white !caret-lime-200 placeholder:text-white/35 focus:border-lime-300/40 focus:ring-lime-300/10 [&:-webkit-autofill]:!bg-[#0b1110] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0b1110_inset]"}`}
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
                    className={`resize-none rounded-xl border transition-all duration-300 focus:ring-2 ${isLightMode ? "border-black/10 !bg-white !text-[#101311] !caret-lime-600 placeholder:text-black/35 focus:border-lime-500/50 focus:ring-lime-500/10" : "border-white/10 !bg-[#0b1110] !text-white !caret-lime-200 placeholder:text-white/35 focus:border-lime-300/40 focus:ring-lime-300/10"}`}
                  />
                </div>

                <div className={`flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${isLightMode ? "border-black/8" : "border-white/8"}`}>
                  <p className={`max-w-sm text-xs leading-5 ${isLightMode ? "text-black/40" : "text-white/30"}`}>
                    Votre message sera traité avec attention et confidentialité.
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className={`group h-12 rounded-full px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 ${isLightMode ? "bg-[#101311] text-white shadow-[0_12px_35px_rgba(0,0,0,.12)] hover:bg-lime-600" : "bg-white text-black shadow-[0_12px_35px_rgba(255,255,255,.08)] hover:bg-lime-200"}`}
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
