'use client';

import { useEffect, useRef, useState } from 'react';

type HoverMaskProps = {
  title?: string;
  description?: string;
};

export default function HoverMask({
  title = 'Reveal another perspective.',
  description = 'An interactive visual study where movement, contrast and depth transform a static composition into an immersive experience.',
}: HoverMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    const animate = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      setPosition({ x: currentX, y: currentY });
      frame = requestAnimationFrame(animate);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      targetX = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      targetY = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    };

    const onPointerMove = (event: PointerEvent) => {
      setIsHovering(true);
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      setIsHovering(false);
      targetX = 50;
      targetY = 50;
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  const maskSize = isHovering ? 24 : 18;
  const mask = `radial-gradient(circle ${maskSize}% at ${position.x}% ${position.y}%, transparent 0%, transparent 42%, rgba(0,0,0,.08) 58%, rgba(0,0,0,.92) 100%)`;

  return (
    <section id="hover-mask" className="relative overflow-hidden bg-[#e9e7e3] px-4 py-20 text-[#101010] sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-16">
          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-black/45">Selected experiment / 06</p>
            <h2 className="max-w-3xl text-[clamp(3rem,8vw,8rem)] font-semibold leading-[.82] tracking-[-.075em]">Hover<br />Mask.</h2>
          </div>
          <span className="hidden pb-2 text-[10px] uppercase tracking-[.22em] text-black/40 sm:block">Move to reveal</span>
        </div>

        <div ref={containerRef} className="group relative min-h-[540px] overflow-hidden rounded-[1.5rem] bg-[#171717] text-white sm:min-h-[680px] lg:min-h-[760px]" style={{ touchAction: 'none' }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,#526bff_0%,transparent_28%),radial-gradient(circle_at_80%_75%,#ff633d_0%,transparent_30%),linear-gradient(135deg,#171717,#080808_65%,#252525)]" />
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:64px_64px]" />

          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-[.25em] text-white/45">Interactive visual system</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[9px] uppercase tracking-[.2em] text-white/45">Web / Motion</span>
            </div>
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[.2em] text-white/45">Background layer</p>
              <h3 className="text-[clamp(2.5rem,7vw,7rem)] font-semibold leading-[.85] tracking-[-.07em]">Static visuals<br />need movement.</h3>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-between bg-[#d7ff45] p-6 text-[#111] sm:p-10 lg:p-14" style={{ clipPath: `circle(0% at ${position.x}% ${position.y}%)`, WebkitClipPath: `circle(0% at ${position.x}% ${position.y}%)` }} />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 text-[#111] sm:p-10 lg:p-14" style={{ maskImage: mask, WebkitMaskImage: mask }}>
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-[.25em] text-black/50">Foreground layer / revealed</span>
              <span className="rounded-full border border-black/15 px-3 py-1 text-[9px] uppercase tracking-[.2em] text-black/50">Hover effect</span>
            </div>
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[.2em] text-black/50">Creative interaction</p>
              <h3 className="text-[clamp(2.5rem,7vw,7rem)] font-semibold leading-[.85] tracking-[-.07em]">Reveal what<br />is underneath.</h3>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/25 bg-black/20 px-5 py-2 text-[10px] uppercase tracking-[.2em] text-white/70 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-0">Move cursor</div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between border-t border-white/10 p-6 text-[10px] uppercase tracking-[.2em] text-white/45 sm:p-10 lg:p-14">
            <span>Mask / 24%</span>
            <span>Soft edge / 120px</span>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[.2em] text-black/45">Hover Mask Effect</p>
            <h3 className="mt-4 text-3xl font-semibold leading-none tracking-[-.05em] sm:text-5xl">{title}</h3>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-[1.15] tracking-[-.025em] text-black/65 sm:text-2xl">{description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Cursor tracking', 'Soft mask', 'Touch ready', 'Responsive'].map((tag) => <span key={tag} className="rounded-full border border-black/15 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-black/50">{tag}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
