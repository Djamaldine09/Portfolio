'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Play, RotateCcw, Upload } from 'lucide-react';

type Direction = 'inward' | 'outward';
type Animation = 'none' | 'fast' | 'natural' | 'premium' | 'custom';

const features = ['Image or video support','Top and bottom curve controls','Inward and outward bend direction','Optional scroll-based animation','Fast, Natural, Premium, and Custom animation styles','Responsive curve based on component width','Corner radius control','Image focal point controls','Overlay color and opacity','Padding controls','Works as a hero/media section layer in Framer'];
const useCases = ['Hero sections','Transitions','Editorial layouts','Product pages','Cycling sites','Sport brands','Portfolios','Landing pages'];
const animations: Animation[] = ['none','fast','natural','premium','custom'];

export default function ScrollBend() {
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = `scroll-bend-${useId().replace(/:/g, '')}`;
  const [top,setTop]=useState(12), [bottom,setBottom]=useState(12), [direction,setDirection]=useState<Direction>('inward');
  const [animation,setAnimation]=useState<Animation>('premium'), [radius,setRadius]=useState(28), [padding,setPadding]=useState(0);
  const [focalX,setFocalX]=useState(50), [focalY,setFocalY]=useState(50), [overlay,setOverlay]=useState('#111827'), [opacity,setOpacity]=useState(18);
  const [src,setSrc]=useState(''), [name,setName]=useState('Built-in visual'), [video,setVideo]=useState(false);
  const {scrollYProgress}=useScroll({target:sectionRef,offset:['start end','end start']});
  const amount=animation==='fast'?32:animation==='natural'?48:animation==='premium'?68:animation==='custom'?54:0;
  const y=useTransform(scrollYProgress,[0,.5,1],[amount,0,-amount]);
  const scale=useTransform(scrollYProgress,[0,.5,1],[animation==='none'?1:1.055,1,animation==='none'?1:1.055]);
  const rotate=useTransform(scrollYProgress,[0,.5,1],[animation==='premium'?-0.8:0,0,animation==='premium'?0.8:0]);
  const sign=direction==='inward'?1:-1;
  const bendTop=top/100, bendBottom=bottom/100;
  const path=`M 0 0 Q .5 ${sign*bendTop} 1 0 L 1 1 Q .5 ${1-sign*bendBottom} 0 1 Z`;

  useEffect(()=>()=>{if(src.startsWith('blob:'))URL.revokeObjectURL(src)},[src]);
  const reset=()=>{setTop(12);setBottom(12);setDirection('inward');setAnimation('premium');setRadius(28);setPadding(0);setFocalX(50);setFocalY(50);setOverlay('#111827');setOpacity(18);if(src.startsWith('blob:'))URL.revokeObjectURL(src);setSrc('');setName('Built-in visual');setVideo(false)};
  const choose=(e:React.ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(!file)return;if(src.startsWith('blob:'))URL.revokeObjectURL(src);setSrc(URL.createObjectURL(file));setName(file.name);setVideo(file.type.startsWith('video/'))};

  return <section ref={sectionRef} id="scroll-bend" className="relative overflow-hidden bg-[#e8e5e2] px-5 py-20 text-[#111] sm:px-10 sm:py-28 lg:px-16 lg:py-36">
    <svg aria-hidden="true" className="absolute h-0 w-0"><defs><clipPath id={id} clipPathUnits="objectBoundingBox"><path d={path}/></clipPath></defs></svg>
    <div className="mx-auto max-w-7xl">
      <header className="mb-10 flex items-end justify-between gap-8 sm:mb-14"><div><p className="text-[10px] uppercase tracking-[.28em] text-black/40 sm:text-xs">Portfolio / Scroll Bend Section</p><h2 className="mt-5 text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[.8] tracking-[-.08em]">SCROLL<br/>BEND</h2></div><p className="hidden max-w-xs pb-2 text-right text-[10px] uppercase leading-5 tracking-[.18em] text-black/35 sm:block">Fluid media section<br/>with responsive curves</p></header>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="min-w-0"><div className="mb-4 flex justify-between text-[9px] uppercase tracking-[.18em] text-black/40"><span>Live preview</span><span>{direction} / {animation}</span></div>
          <div className="relative overflow-hidden rounded-[24px] bg-black/5 sm:rounded-[32px]">
            <div className="p-2 sm:p-3" style={{padding:`${padding}px`}}>
              <motion.div style={{y,scale,rotateZ:rotate,clipPath:`url(#${id})`,borderRadius:`${radius}px`}} className="relative h-[55vh] min-h-[390px] max-h-[720px] overflow-hidden bg-black">
                {src ? (video ? <video className="absolute inset-0 h-full w-full object-cover" src={src} autoPlay muted loop playsInline/> : <img className="absolute inset-0 h-full w-full object-cover" src={src} alt="Scroll Bend media" style={{objectPosition:`${focalX}% ${focalY}%`}}/>) : <div className="absolute inset-0" style={{background:`radial-gradient(circle at ${focalX}% ${focalY}%,rgba(132,145,255,.72),transparent 24%),radial-gradient(circle at 16% 88%,rgba(255,255,255,.18),transparent 27%),linear-gradient(135deg,#05070c,#141b2d 52%,#080a0e)`}}/>}
                <div className="absolute inset-0" style={{backgroundColor:overlay,opacity:opacity/100}}/>
                <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white sm:p-10 lg:p-14"><div className="flex justify-between text-[8px] uppercase tracking-[.25em] text-white/50 sm:text-[10px]"><span>Fluid media / 01</span><span>{video?'video':'image'} support</span></div><div><p className="mb-4 text-[9px] uppercase tracking-[.25em] text-white/55 sm:text-xs">Premium curved section</p><h3 className="max-w-5xl text-[clamp(2.7rem,7vw,7.5rem)] font-semibold leading-[.82] tracking-[-.07em]">SMOOTH<br/>CURVED MEDIA</h3><p className="mt-6 max-w-2xl text-xs leading-5 text-white/60 sm:text-base sm:leading-7">Create smooth curved media sections directly in Framer. Shape the top and bottom edges, control the bend direction, and animate the media naturally as it enters the viewport.</p></div><div className="flex justify-between text-[8px] uppercase tracking-[.2em] text-white/40 sm:text-[9px]"><span>Scroll to animate</span><span>Responsive curve</span></div></div>
              </motion.div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-between gap-3 text-[9px] uppercase tracking-[.15em] text-black/40"><span>Media: {name}</span><span>Top {top}% / Bottom {bottom}% / Radius {radius}px / Padding {padding}px</span></div>
        </div>

        <aside className="rounded-[24px] border border-black/10 bg-white/55 p-5 backdrop-blur sm:p-6 lg:sticky lg:top-8"><div className="flex items-center justify-between border-b border-black/10 pb-4"><div><p className="text-[9px] uppercase tracking-[.22em] text-black/40">Scroll Bend</p><p className="mt-1 text-lg font-semibold">Controls</p></div><button type="button" onClick={reset} aria-label="Reset controls" className="rounded-full border border-black/10 p-2 text-black/45 hover:bg-black hover:text-white"><RotateCcw size={14}/></button></div>
          <div className="space-y-5 pt-5"><Slider label="Top bend" value={top} min={0} max={30} unit="%" onChange={setTop}/><Slider label="Bottom bend" value={bottom} min={0} max={30} unit="%" onChange={setBottom}/>
            <Choice label="Bend direction" values={['inward','outward']} active={direction} onChange={v=>setDirection(v as Direction)}/>
            <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/45">Media</label><button type="button" onClick={()=>inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-3 py-2.5 text-[9px] uppercase tracking-[.12em] text-white"><Upload size={13}/>Image / video</button><input ref={inputRef} type="file" accept="image/*,video/*" onChange={choose} className="hidden"/></div>
            <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/45">Scroll animation</label><div className="grid grid-cols-2 gap-1.5">{animations.map(a=><button key={a} type="button" onClick={()=>setAnimation(a)} className={`rounded-xl border px-2.5 py-2 text-left text-[9px] uppercase tracking-[.1em] ${animation===a?'border-black bg-black text-white':'border-black/10 bg-white/40 text-black/50'}`}>{a==='none'?'Off':a}</button>)}</div></div>
            <Slider label="Corner radius" value={radius} min={0} max={60} unit="px" onChange={setRadius}/><Slider label="Focal point X" value={focalX} min={0} max={100} unit="%" onChange={setFocalX}/><Slider label="Focal point Y" value={focalY} min={0} max={100} unit="%" onChange={setFocalY}/><Slider label="Padding" value={padding} min={0} max={8} unit="px" onChange={setPadding}/>
            <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/45">Overlay color</label><div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/45 p-2"><input aria-label="Overlay color" type="color" value={overlay} onChange={e=>setOverlay(e.target.value)} className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"/><span className="font-mono text-[9px] uppercase text-black/45">{overlay}</span></div></div><Slider label="Overlay opacity" value={opacity} min={0} max={80} unit="%" onChange={setOpacity}/>
          </div></aside>
      </div>

      <div className="mt-16 grid gap-12 border-t border-black/10 pt-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20"><div><p className="text-[10px] uppercase tracking-[.25em] text-black/40">About Scroll Bend Section</p><p className="mt-5 text-sm leading-6 text-black/60 sm:text-base sm:leading-7">Scroll Bend Section lets you create smooth curved media sections directly in Framer. Add an image or video, adjust the top and bottom bend, choose inward or outward curves, set corner radius, crop position, overlay, padding, and optional scroll animation.</p><p className="mt-5 text-sm leading-6 text-black/60 sm:text-base sm:leading-7">Perfect for hero sections, transitions, editorial layouts, product pages, cycling sites, sport brands, portfolios, and landing pages that need a more fluid section edge than a standard rectangle.</p><button type="button" onClick={()=>sectionRef.current?.scrollIntoView({behavior:'smooth',block:'center'})} className="mt-7 inline-flex items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-[10px] uppercase tracking-[.18em] hover:-translate-y-0.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white"><Play size={8} fill="currentColor"/></span>Watch video how to use it</button></div><div><p className="text-[10px] uppercase tracking-[.25em] text-black/40">Features</p><div className="mt-5 grid border-t border-black/10 sm:grid-cols-2">{features.map((f,i)=><motion.div key={f} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.35,delay:i*.025}} className="flex min-h-16 items-start gap-3 border-b border-black/10 py-4 pr-5 text-[10px] uppercase leading-5 tracking-[.1em] text-black/55 sm:text-xs"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black/5"><Check size={9}/></span><span>{f}</span></motion.div>)}</div></div></div>

      <div className="mt-16 border-t border-black/10 pt-8 sm:mt-20 sm:pt-10"><p className="text-[10px] uppercase tracking-[.25em] text-black/40">Perfect for</p><p className="mt-3 max-w-2xl text-xl font-medium tracking-[-.03em] sm:text-3xl">Fluid section edges when a standard rectangle feels too rigid.</p><div className="mt-8 grid grid-cols-2 border-t border-black/10 sm:grid-cols-4">{useCases.map(item=><div key={item} className="border-b border-r border-black/10 py-4 text-[10px] uppercase tracking-[.12em] text-black/50 sm:text-xs">{item}</div>)}</div></div>
    </div>
  </section>;
}

function Slider({label,value,min,max,unit,onChange}:{label:string;value:number;min:number;max:number;unit:string;onChange:(v:number)=>void}){return <div><div className="mb-2 flex justify-between"><label className="text-[9px] uppercase tracking-[.16em] text-black/45">{label}</label><span className="font-mono text-[9px] text-black/45">{value}{unit}</span></div><input aria-label={label} type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-black"/></div>}
function Choice({label,values,active,onChange}:{label:string;values:string[];active:string;onChange:(v:string)=>void}){return <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/45">{label}</label><div className="grid grid-cols-2 gap-1 rounded-xl bg-black/5 p-1">{values.map(v=><button key={v} type="button" onClick={()=>onChange(v)} className={`rounded-lg px-2 py-2 text-[9px] uppercase tracking-[.14em] ${active===v?'bg-black text-white':'text-black/45'}`}>{v}</button>)}</div></div>}
