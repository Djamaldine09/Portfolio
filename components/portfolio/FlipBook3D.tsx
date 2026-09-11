'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const features = [
  'Image or video support',
  'Top and bottom curve controls',
  'Inward and outward bend direction',
  'Optional scroll-based animation',
  'Fast, Natural, Premium, and Custom animation styles',
  'Responsive curve based on component width',
  'Corner radius control',
  'Image focal point controls',
  'Overlay color and opacity',
  'Padding controls',
  'Works as a hero/media section layer in Framer',
];

const useCases = [
  'Hero sections',
  'Transitions',
  'Editorial layouts',
  'Product pages',
  'Cycling sites',
  'Sport brands',
  'Portfolios',
  'Landing pages',
];

export default function FlipBook3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const topCurve = useTransform(scrollYProgress, [0, 0.5, 1], [0, -22, 0]);
  const bottomCurve = useTransform(scrollYProgress, [0, 0.5, 1], [0, 22, 0]);

  return (
    <section
      ref={sectionRef}
      id="scroll-bend"
      className="relative overflow-hidden bg-[#e8e5e2] px-5 py-20 text-[#111] sm:px-10 sm:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-8 sm:mb-14">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.28em] text-black/40 sm:text-xs">
              Portfolio / Scroll Bend Section
            </p>
            <h2 className="mt-5 text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[.8] tracking-[-.08em]">
              SCROLL
              <br />
              BEND
            </h2>
          </div>
          <p className="hidden max-w-xs pb-2 text-right text-[10px] uppercase leading-5 tracking-[.18em] text-black/35 sm:block">
            Fluid media section
            <br />
            with responsive curves
          </p>
        </div>

        <div className="relative px-1 py-10 sm:px-4 sm:py-14">
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative h-[55vh] min-h-[360px] max-h-[720px] overflow-hidden rounded-[28px] shadow-[0_38px_100px_rgba(0,0,0,.24)] sm:rounded-[42px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-slate-900 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_35%,rgba(92,103,180,.5),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(255,255,255,.13),transparent_32%),radial-gradient(ellipse_at_90%_85%,rgba(255,255,255,.08),transparent_28%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white sm:p-10 lg:p-14">
              <div className="flex items-center justify-between text-[8px] uppercase tracking-[.25em] text-white/45 sm:text-[10px]">
                <span>Fluid media / 01</span>
                <span>Scroll animation</span>
              </div>

              <div>
                <p className="mb-4 text-[9px] uppercase tracking-[.25em] text-white/45 sm:text-xs">
                  Premium curved section
                </p>
                <h3 className="max-w-5xl text-[clamp(2.8rem,7vw,7.5rem)] font-semibold leading-[.8] tracking-[-.07em]">
                  SMOOTH
                  <br />
                  CURVED MEDIA
                </h3>
                <p className="mt-6 max-w-2xl text-xs leading-5 text-white/55 sm:text-base sm:leading-7">
                  Create smooth curved media sections directly in Framer. Add an image or video,
                  shape the top and bottom edges, control the bend direction, and animate the media
                  naturally as the section enters the viewport.
                </p>
              </div>

              <div className="flex items-center justify-between text-[8px] uppercase tracking-[.2em] text-white/35 sm:text-[9px]">
                <span>Scroll to bend</span>
                <span>Responsive width</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: topCurve }}
            className="pointer-events-none absolute left-[-10%] right-[-10%] top-[-4px] h-24 rounded-[50%] bg-[#e8e5e2] sm:h-32"
          />
          <motion.div
            style={{ y: bottomCurve }}
            className="pointer-events-none absolute bottom-[-4px] left-[-10%] right-[-10%] h-24 rounded-[50%] bg-[#e8e5e2] sm:h-32"
          />
        </div>

        <div className="mt-12 grid gap-12 border-t border-black/10 pt-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.25em] text-black/40">
              About Scroll Bend Section
            </p>
            <p className="mt-5 text-sm leading-6 text-black/60 sm:text-base sm:leading-7">
              Scroll Bend Section lets you create smooth curved media sections directly in Framer.
              Add an image or video, adjust the top and bottom bend, choose inward or outward curves,
              set corner radius, crop position, overlay, padding, and optional scroll animation.
            </p>
            <p className="mt-5 text-sm leading-6 text-black/60 sm:text-base sm:leading-7">
              Perfect for hero sections, transitions, editorial layouts, product pages, cycling sites,
              sport brands, portfolios, and landing pages that need a more fluid section edge than a
              standard rectangle.
            </p>

            <button
              type="button"
              className="mt-7 inline-flex items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-[10px] font-medium uppercase tracking-[.18em] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[8px] text-white">
                ▶
              </span>
              Watch video how to use it
            </button>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.25em] text-black/40">Features</p>
            <div className="mt-5 grid border-t border-black/10 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.025 }}
                  className="flex min-h-16 items-start gap-3 border-b border-black/10 py-4 pr-5 text-[10px] uppercase leading-5 tracking-[.1em] text-black/55 sm:text-xs"
                >
                  <span className="mt-0.5 text-[8px] text-black/30">0{index + 1}</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-black/10 pt-8 sm:mt-20 sm:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[.25em] text-black/40">Perfect for</p>
              <p className="mt-3 max-w-2xl text-xl font-medium leading-tight tracking-[-.03em] sm:text-3xl">
                Fluid section edges when a standard rectangle feels too rigid.
              </p>
            </div>
            <p className="max-w-xs text-[9px] uppercase leading-5 tracking-[.16em] text-black/35 sm:text-right">
              Responsive curve based on component width / image focal point / overlay / padding
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 border-t border-black/10 sm:grid-cols-4">
            {useCases.map((item) => (
              <div
                key={item}
                className="border-b border-r border-black/10 py-4 text-[10px] uppercase tracking-[.12em] text-black/50 last:border-r-0 sm:text-xs"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
