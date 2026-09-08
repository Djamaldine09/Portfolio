'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Projects from '@/components/portfolio/Projects';
import ScrollTextLines from '@/components/portfolio/ScrollTextLines';
import Skills from '@/components/portfolio/Skills';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import Navigation from '@/components/portfolio/Navigation';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0a0f0d]">
      <div className="relative z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Navigation />
        <Hero />
        <About />
        <Projects />
        <ScrollTextLines />
        <Skills />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}