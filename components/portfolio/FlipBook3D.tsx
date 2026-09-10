'use client';

import { useState } from 'react';

const pages = [
  {
    eyebrow: '01 / COVER',
    title: 'DIGITAL\nEXPERIENCES',
    subtitle: 'A small collection of interfaces, products and visual experiments.',
    tone: 'from-stone-900 via-stone-800 to-black',
  },
  {
    eyebrow: '02 / PRODUCT',
    title: 'MENU\nSYSTEM',
    subtitle: 'Designing clear, responsive interfaces where motion supports the experience.',
    tone: 'from-neutral-900 via-zinc-800 to-neutral-950',
  },
  {
    eyebrow: '03 / MOTION',
    title: 'WEBGL\nSTUDIES',
    subtitle: 'Interactive visuals, shader experiments and scroll-driven storytelling for the modern web.',
    tone: 'from-slate-900 via-indigo-950 to-black',
  },
  {
    eyebrow: '04 / BUILD',
    title: 'FROM IDEA\nTO PRODUCT',
    subtitle: 'Frontend, full-stack and mobile development with a focus on craft, speed and usability.',
    tone: 'from-emerald-950 via-neutral-900 to-black',
  },
];

export default function FlipBook3D() {
  const [page, setPage] = useState(0);

  const next = () => setPage((current) => Math.min(current + 1, pages.length - 1));
  const previous = () => setPage((current) => Math.max(current - 1, 0));

  return (
    <section id="flipbook" className="relative overflow-hidden bg-[#e8e5e2] px-5 py-24 text-[#111] sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-black/45">Selected project / 06</p>
          <h2 className="mt-5 max-w-xl text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.83] tracking-[-0.07em]">
            Flipbook<br />
            3D CMS
          </h2>
          <p className="mt-8 max-w-lg text-base leading-7 text-black/60 sm:text-lg">
            A realistic 3D page-turning experience for menus, catalogs, portfolios and editorial content — built as a responsive interactive component.
          </p>

          <div className="mt-9 space-y-4 border-t border-black/10 pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">Update 1.1</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-black/60">
                CMS-ready architecture lets collections drive the pages dynamically, making the experience easy to reuse across projects.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['3D Motion', 'CMS Ready', 'Touch', 'Keyboard', 'Responsive'].map((tag) => (
                <span key={tag} className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-black/55">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-3xl [perspective:1800px]">
          <div className="relative aspect-[1.45/1] w-full">
            <div className="absolute left-1/2 top-1/2 h-[92%] w-[47%] -translate-x-full -translate-y-1/2 rounded-l-2xl bg-white shadow-2xl [transform:rotateY(9deg)] [transform-origin:right_center] sm:rounded-l-3xl">
              <PageContent page={Math.max(0, page - 1)} side="left" />
            </div>

            <div className="absolute left-1/2 top-1/2 h-[92%] w-[47%] -translate-y-1/2 rounded-r-2xl bg-white shadow-2xl [transform:rotateY(-9deg)] [transform-origin:left_center] sm:rounded-r-3xl">
              <PageContent page={page} side="right" />
            </div>

            <div className="absolute left-1/2 top-1/2 z-30 h-[92%] w-px -translate-x-1/2 -translate-y-1/2 bg-black/15" />

            <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between px-4 sm:px-8">
              <button
                type="button"
                onClick={previous}
                disabled={page === 0}
                aria-label="Previous page"
                className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-35"
              >
                ←
              </button>

              <div className="rounded-full bg-white/95 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur">
                {String(page + 1).padStart(2, '0')} — {String(pages.length).padStart(2, '0')}
              </div>

              <button
                type="button"
                onClick={next}
                disabled={page === pages.length - 1}
                aria-label="Next page"
                className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-35"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-black/35">
            <span>Click / tap to turn pages</span>
            <span>Interactive prototype</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageContent({ page, side }: { page: number; side: 'left' | 'right' }) {
  const item = pages[page];

  return (
    <div className={`relative h-full overflow-hidden rounded-inherit bg-gradient-to-br ${item.tone} p-5 text-white sm:p-8`}>
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_26%),radial-gradient(circle_at_80%_80%,white_0,transparent_24%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/45 sm:text-[10px]">{item.eyebrow}</p>
          <div className="mt-5 h-px w-12 bg-white/25" />
        </div>

        <div className={side === 'left' ? 'opacity-80' : ''}>
          <h3 className="whitespace-pre-line text-[clamp(1.45rem,4vw,3.4rem)] font-semibold leading-[0.86] tracking-[-0.055em]">
            {item.title}
          </h3>
          <p className="mt-4 max-w-[270px] text-[10px] leading-4 text-white/55 sm:text-xs sm:leading-5">
            {item.subtitle}
          </p>
        </div>

        <div className="flex items-end justify-between text-[8px] uppercase tracking-[0.18em] text-white/35 sm:text-[9px]">
          <span>Portfolio / 2026</span>
          <span>{String(page + 1).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
