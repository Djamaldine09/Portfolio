'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ChevronDown, ImagePlus, Play, RotateCcw, Upload } from 'lucide-react';

type BendDirection = 'inward' | 'outward';
type AnimationStyle = 'none' | 'fast' | 'natural' | 'premium' | 'custom';
type MediaType = 'image' | 'video';

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

const animationOptions: { value: AnimationStyle; label: string; hint: string }[] = [
  { value: 'none', label: 'Off', hint: 'Static' },
  { value: 'fast', label: 'Fast', hint: 'Snappy' },
  { value: 'natural', label: 'Natural', hint: 'Balanced' },
  { value: 'premium', label: 'Premium', hint: 'Cinematic' },
  { value: 'custom', label: 'Custom', hint: 'Your values' },
];

export default function ScrollBendSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const clipId = `scroll-bend-${useId().replace(/:/g, '')}`;

  const [topBend, setTopBend] = useState(12);
  const [bottomBend, setBottomBend] = useState(12);
  const [direction, setDirection] = useState<BendDirection>('inward');
  const [animation, setAnimation] = useState<AnimationStyle>('premium');
  const [radius, setRadius] = useState(28);
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(50);
  const [overlay, setOverlay] = useState('#111827');
  const [overlayOpacity, setOverlayOpacity] = useState(18);
  const [padding, setPadding] = useState(0);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('Built-in visual');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const animationAmount = animation === 'fast' ? 34 : animation === 'natural' ? 48 : animation === 'premium' ? 68 : animation === 'custom' ? 54 : 0;
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [animationAmount, 0, -animationAmount]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [animation === 'none' ? 1 : 1.055, 1, animation === 'none' ? 1 : 1.055]);
  const mediaRotate = useTransform(scrollYProgress, [0, 0.5, 1], [animation === 'premium' ? -0.8 : 0, 0, animation === 'premium' ? 0.8 : 0]);

  useEffect(() => {
    return () => {
      if (mediaUrl.startsWith('blob:')) URL.revokeObjectURL(mediaUrl);
    };
  }, [mediaUrl]);

  const resetControls = () => {
    setTopBend(12);
    setBottomBend(12);
    setDirection('inward');
    setAnimation('premium');
    setRadius(28);
    setFocalX(50);
    setFocalY(50);
    setOverlay('#111827');
    setOverlayOpacity(18);
    setPadding(0);
    setMediaType('image');
    setMediaUrl('');
    setMediaName('Built-in visual');
  };

  const onMediaSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (mediaUrl.startsWith('blob:')) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(URL.createObjectURL(file));
    setMediaName(file.name);
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
  };

  const topCurve = direction === 'inward' ? topBend : -topBend;
  const bottomCurve = direction === 'inward' ? bottomBend : -bottomBend;
  const path = `M 0 0 Q 50 ${topCurve} 100 0 L 100 100 Q 50 ${100 - bottomCurve} 0 100 Z`;

  return (
    <section
      ref={sectionRef}
      id="scroll-bend"
      className="relative overflow-hidden bg-[#e8e5e2] px-5 py-20 text-[#111] sm:px-10 sm:py-28 lg:px-16 lg:py-36"
    >
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={path} vectorEffect="non-scaling-stroke" />
          </clipPath>
        </defs>
      </svg>

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

        <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between text-[9px] uppercase tracking-[.18em] text-black/40">
              <span>Live preview</span>
              <span>{direction} / {animation}</span>
            </div>

            <div className="relative overflow-hidden rounded-[24px] bg-black/5 p-2 sm:rounded-[32px] sm:p-3">
              <motion.div
                style={{ y: imageY, scale: imageScale, rotateZ: mediaRotate, clipPath: `url(#${clipId})` }}
                className="relative h-[55vh] min-h-[390px] max-h-[720px] overflow-hidden rounded-[inherit]"
              >
                {mediaUrl ? (
                  mediaType === 'video' ? (
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={mediaUrl}
                      alt="Uploaded Scroll Bend media"
                      style={{ objectPosition: `${focalX}% ${focalY}%` }}
                    />
                  )
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at ${focalX}% ${focalY}%, rgba(132, 145, 255, .72), transparent 24%), radial-gradient(circle at 16% 88%, rgba(255,255,255,.18), transparent 27%), linear-gradient(135deg, #05070c 0%, #141b2d 52%, #080a0e 100%)`,
                    }}
                  />
                )}

                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: overlay, opacity: overlayOpacity / 100 }}
                />

                <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white sm:p-10 lg:p-14">
                  <div className="flex items-center justify-between text-[8px] uppercase tracking-[.25em] text-white/50 sm:text-[10px]">
                    <span>Fluid media / 01</span>
                    <span>{mediaType} support</span>
                  </div>

                  <div>
                    <p className="mb-4 text-[9px] uppercase tracking-[.25em] text-white/55 sm:text-xs">
                      Premium curved section
                    </p>
                    <h3 className="max-w-5xl text-[clamp(2.7rem,7vw,7.5rem)] font-semibold leading-[.82] tracking-[-.07em]">
                      SMOOTH
                      <br />
                      CURVED MEDIA
                    </h3>
                    <p className="mt-6 max-w-2xl text-xs leading-5 text-white/60 sm:text-base sm:leading-7">
                      Create smooth curved media sections directly in Framer. Shape the top and bottom
                      edges, control the bend direction, and animate the media naturally as it enters
                      the viewport.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[8px] uppercase tracking-[.2em] text-white/40 sm:text-[9px]">
                    <span>Scroll to animate</span>
                    <span>Responsive curve</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[.15em] text-black/40">
              <span>Media: {mediaName}</span>
              <span>Top {topBend}% / Bottom {bottomBend}% / Radius {radius}px</span>
            </div>
          </div>

          <aside className="rounded-[24px] border border-black/10 bg-white/55 p-5 backdrop-blur sm:p-6 lg:sticky lg:top-8">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <p className="text-[9px] uppercase tracking-[.22em] text-black/40">Scroll Bend</p>
                <p className="mt-1 text-lg font-semibold tracking-[-.04em]">Controls</p>
              </div>
              <button
                type="button"
                onClick={resetControls}
                aria-label="Reset controls"
                className="rounded-full border border-black/10 p-2 text-black/45 transition hover:bg-black hover:text-white"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="space-y-6 pt-5">
              <ControlSlider label="Top bend" value={topBend} min={0} max={30} unit="%" onChange={setTopBend} />
              <ControlSlider label="Bottom bend" value={bottomBend} min={0} max={30} unit="%" onChange={setBottomBend} />

              <ControlLabel label="Bend direction">
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/5 p-1">
                  {(['inward', 'outward'] as BendDirection[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDirection(value)}
                      className={`rounded-lg px-2 py-2 text-[9px] font-medium uppercase tracking-[.14em] transition ${direction === value ? 'bg-black text-white' : 'text-black/45 hover:text-black'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </ControlLabel>

              <ControlLabel label="Media">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-3 py-2.5 text-[9px] font-medium uppercase tracking-[.12em] text-white transition hover:-translate-y-0.5"
                  >
                    <Upload size={13} />
                    Image / video
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="rounded-xl border border-black/10 px-3 text-[9px] uppercase tracking-[.12em] text-black/45 hover:text-black"
                  >
                    Clear
                  </button>
                </div>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={onMediaSelected}
                  className="hidden"
                />
              </ControlLabel>

              <ControlLabel label="Scroll animation">
                <div className="grid grid-cols-2 gap-1.5">
                  {animationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAnimation(option.value)}
                      className={`rounded-xl border px-2.5 py-2 text-left transition ${animation === option.value ? 'border-black bg-black text-white' : 'border-black/10 bg-white/40 text-black/50 hover:border-black/25'}`}
                    >
                      <span className="block text-[9px] font-semibold uppercase tracking-[.1em]">{option.label}</span>
                      <span className="mt-0.5 block text-[8px] opacity-55">{option.hint}</span>
                    </button>
                  ))}
                </div>
              </ControlLabel>

              <ControlSlider label="Corner radius" value={radius} min={0} max={60} unit="px" onChange={setRadius} />
              <ControlSlider label="Focal point X" value={focalX} min={0} max={100} unit="%" onChange={setFocalX} />
              <ControlSlider label="Focal point Y" value={focalY} min={0} max={100} unit="%" onChange={setFocalY} />
              <ControlSlider label="Padding" value={padding} min={0} max={8} unit="px" onChange={setPadding} />

              <ControlLabel label="Overlay color">
                <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/45 p-2">
                  <input
                    aria-label="Overlay color"
                    type="color"
                    value={overlay}
                    onChange={(event) => setOverlay(event.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <span className="font-mono text-[9px] uppercase text-black/45">{overlay}</span>
                </div>
              </ControlLabel>

              <ControlSlider label="Overlay opacity" value={overlayOpacity} min={0} max={80} unit="%" onChange={setOverlayOpacity} />
            </div>
          </aside>
        </div>

        <div className="mt-16 grid gap-12 border-t border-black/10 pt-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
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
              onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="mt-7 inline-flex items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-[10px] font-medium uppercase tracking-[.18em] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                <Play size={8} fill="currentColor" />
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
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.025 }}
                  className="flex min-h-16 items-start gap-3 border-b border-black/10 py-4 pr-5 text-[10px] uppercase leading-5 tracking-[.1em] text-black/55 sm:text-xs"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black/5 text-[8px] text-black/35">
                    <Check size={9} />
                  </span>
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
              <div key={item} className="flex items-center gap-2 border-b border-r border-black/10 py-4 text-[10px] uppercase tracking-[.12em] text-black/50 sm:text-xs">
                <ImagePlus size={12} className="opacity-30" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[9px] font-medium uppercase tracking-[.16em] text-black/45">{label}</label>
      </div>
      {children}
    </div>
  );
}

function ControlSlider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <ControlLabel label={label}>
      <div className="flex items-center gap-3">
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer accent-black"
        />
        <span className="w-10 shrink-0 text-right font-mono text-[9px] text-black/45">{value}{unit}</span>
      </div>
    </ControlLabel>
  );
}
