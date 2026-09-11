'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { kicker: '01 / ENTER', title: 'Bienvenue\ndans la nuit.', body: 'Une traversée immersive de mon univers digital — là où design, code et mouvement deviennent une seule expérience.' },
  { kicker: '02 / CRAFT', title: 'Design qui\nprend vie.', body: 'Des interfaces pensées avec précision, puis animées pour donner une vraie sensation de matière et de profondeur.' },
  { kicker: '03 / EXPERIMENT', title: 'Code. 3D.\nInteraction.', body: 'WebGL, profondeur, lumière et mouvement se rencontrent pour créer une expérience que l’on ressent autant qu’on la regarde.' },
  { kicker: '04 / WORK', title: 'Entre dans\nmes projets.', body: 'Le voyage continue avec mes réalisations, mes expérimentations et les systèmes que je construis.' },
];

type V3 = [number, number, number];

function perspective(out: Float32Array, fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
  out.fill(0);
  out[0] = f / aspect; out[5] = f; out[10] = (far + near) * nf; out[11] = -1; out[14] = 2 * far * near * nf;
}

function viewMatrix(out: Float32Array, x: number, y: number, z: number, yaw: number, pitch: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  out[0] = cy; out[1] = -sy * sp; out[2] = sy * cp; out[3] = 0;
  out[4] = 0; out[5] = cp; out[6] = sp; out[7] = 0;
  out[8] = -sy; out[9] = -cy * sp; out[10] = -cy * cp; out[11] = 0;
  out[12] = -(out[0] * x + out[4] * y + out[8] * z);
  out[13] = -(out[1] * x + out[5] * y + out[9] * z);
  out[14] = -(out[2] * x + out[6] * y + out[10] * z);
  out[15] = 1;
}

function addBox(v: number[], c: number[], center: V3, size: V3, color: V3) {
  const [cx, cy, cz] = center, [sx, sy, sz] = size;
  const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2;
  const faces = [
    [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]], [[x1,y0,z1],[x0,y0,z1],[x0,y1,z1],[x1,y1,z1]],
    [[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]], [[x0,y0,z1],[x1,y0,z1],[x1,y0,z0],[x0,y0,z0]],
    [[x0,y0,z1],[x0,y0,z0],[x0,y1,z0],[x0,y1,z1]], [[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],
  ] as V3[][];
  for (const f of faces) {
    const inds = [0,1,2,0,2,3];
    for (const i of inds) { v.push(...f[i]); c.push(...color); }
  }
}

function addTori(v: number[], c: number[], z: number, width: number, height: number, color: V3) {
  const postW = Math.max(0.7, width * 0.055);
  addBox(v, c, [-width / 2, height / 2, z], [postW, height, postW], color);
  addBox(v, c, [width / 2, height / 2, z], [postW, height, postW], color);
  addBox(v, c, [0, height * 0.96, z], [width * 1.16, postW * 1.45, postW * 1.5], color);
  addBox(v, c, [0, height * 0.78, z], [width * 1.02, postW * 0.75, postW], [color[0] * 0.72, color[1] * 0.72, color[2] * 0.72]);
}

function addTree(v: number[], c: number[], x: number, z: number, scale: number, color: V3) {
  addBox(v, c, [x, scale * 0.6, z], [scale * 0.16, scale * 1.2, scale * 0.16], [0.08,0.07,0.06]);
  for (let i = 0; i < 3; i++) {
    const s = scale * (1 - i * 0.18);
    addBox(v, c, [x, scale * (1.25 + i * 0.58), z], [s, s * 0.65, s], [color[0] * (1 - i * .08), color[1] * (1 - i * .08), color[2] * (1 - i * .08)]);
  }
}

export default function KageExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' });
    if (!canvas || !gl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vertex = `attribute vec3 aPosition; attribute vec3 aColor; uniform mat4 uProjection; uniform mat4 uView; varying vec3 vColor; varying float vDepth; void main(){ vec4 p=uView*vec4(aPosition,1.0); vDepth=max(0.0,-p.z); vColor=aColor; gl_Position=uProjection*p; }`;
    const fragment = `precision mediump float; varying vec3 vColor; varying float vDepth; uniform float uTime; uniform vec3 uFog; void main(){ float fog=1.0-exp(-vDepth*vDepth*0.0017); vec3 col=mix(vColor,uFog,clamp(fog,0.0,0.92)); gl_FragColor=vec4(col,1.0); }`;
    const particleVertex = `attribute vec3 aPosition; attribute float aSize; uniform mat4 uProjection; uniform mat4 uView; varying float vDepth; void main(){ vec4 p=uView*vec4(aPosition,1.0); vDepth=max(0.0,-p.z); gl_Position=uProjection*p; gl_PointSize=aSize*(160.0/max(1.0,vDepth)); }`;
    const particleFragment = `precision mediump float; varying float vDepth; void main(){ vec2 q=gl_PointCoord-.5; float d=dot(q,q); if(d>.25) discard; float a=(1.0-smoothstep(.05,.25,d))*0.7; gl_FragColor=vec4(.85,.76,.61,a); }`;

    const compile = (type: number, src: string) => { const s=gl.createShader(type)!; gl.shaderSource(s,src); gl.compileShader(s); return s; };
    const makeProgram = (vs: string, fs: string) => { const p=gl.createProgram()!; gl.attachShader(p,compile(gl.VERTEX_SHADER,vs)); gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p); return p; };
    const program = makeProgram(vertex, fragment);
    const particleProgram = makeProgram(particleVertex, particleFragment);

    const world: number[] = [], colors: number[] = [];
    const gateColor: V3 = [0.34,0.18,0.09];
    const gateGlow: V3 = [0.52,0.29,0.13];
    for (let i=0;i<15;i++) addTori(world, colors, 10+i*13, 5.2+i*.08, 4.2+i*.04, i%3===0 ? gateGlow : gateColor);
    for (let i=0;i<22;i++) {
      const z=4+i*8.2, side=i%2===0?-1:1, x=side*(5.4+(i%4)*1.2);
      addTree(world,colors,x,z,1.8+(i%3)*.55,[0.035,0.09,0.075]);
      if(i%3===0) addTree(world,colors,-x*0.72,z+3,1.35,[0.025,0.065,0.055]);
    }
    addBox(world,colors,[0,-0.22,100],[9,0.35,205],[0.055,0.047,0.041]);
    for(let i=0;i<42;i++){
      const z=3+i*4.9; const width=.8+(z/205)*4.4;
      addBox(world,colors,[-width/2,.01,z],[.05,.025,.12],[.22,.17,.12]);
      addBox(world,colors,[width/2,.01,z],[.05,.025,.12],[.22,.17,.12]);
    }

    const vbo=gl.createBuffer()!, cbo=gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(world),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,cbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);
    const vertexCount=world.length/3;

    const particleData:number[]=[]; const particleSizes:number[]=[];
    const particleCount=reduced?70:180;
    for(let i=0;i<particleCount;i++){ particleData.push((Math.random()-.5)*15, .5+Math.random()*6, 3+Math.random()*195); particleSizes.push(.45+Math.random()*1.6); }
    const pbo=gl.createBuffer()!, sbo=gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER,pbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(particleData),gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,sbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(particleSizes),gl.STATIC_DRAW);

    const projection=new Float32Array(16), view=new Float32Array(16);
    let raf=0, last=0, smoothProgress=0, pointerX=.5, pointerY=.5, smoothX=.5, smoothY=.5;
    let cameraZ=0, targetZ=0, previousCameraZ=0;
    const resize=()=>{ const dpr=Math.min(devicePixelRatio||1,1.65); canvas.width=Math.floor(canvas.clientWidth*dpr); canvas.height=Math.floor(canvas.clientHeight*dpr); gl.viewport(0,0,canvas.width,canvas.height); };
    const move=(e:PointerEvent)=>{pointerX=e.clientX/Math.max(innerWidth,1); pointerY=e.clientY/Math.max(innerHeight,1);};
    resize(); addEventListener('resize',resize); addEventListener('pointermove',move,{passive:true});
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.clearColor(.008,.012,.016,1);

    const draw=(time:number)=>{
      const dt=Math.min((time-last)/16.67||1,2); last=time;
      smoothProgress += (scrollRef.current-smoothProgress)*(reduced?.12:.055);
      targetZ=smoothProgress*150; cameraZ += (targetZ-cameraZ)*(reduced?.14:.075);
      smoothX += (pointerX-.5-smoothX+.5)*(reduced?.025:.06); smoothY += (pointerY-.5-smoothY+.5)*(reduced?.025:.06);
      const w=canvas.clientWidth,h=canvas.clientHeight;
      perspective(projection,Math.PI/3.05,w/Math.max(h,1),.1,260);
      const camX=(smoothX-.5)*1.25, camY=1.55+(reduced?0:Math.sin(time*.0008)*.035), yaw=(smoothX-.5)*-.045, pitch=(smoothY-.5)*-.025;
      viewMatrix(view,camX,camY,cameraZ,yaw,pitch);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program); gl.uniformMatrix4fv(gl.getUniformLocation(program,'uProjection'),false,projection); gl.uniformMatrix4fv(gl.getUniformLocation(program,'uView'),false,view); gl.uniform1f(gl.getUniformLocation(program,'uTime'),time*.001); gl.uniform3f(gl.getUniformLocation(program,'uFog'),.012,.016,.021);
      gl.bindBuffer(gl.ARRAY_BUFFER,vbo); const pa=gl.getAttribLocation(program,'aPosition'); gl.enableVertexAttribArray(pa); gl.vertexAttribPointer(pa,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,cbo); const ca=gl.getAttribLocation(program,'aColor'); gl.enableVertexAttribArray(ca); gl.vertexAttribPointer(ca,3,gl.FLOAT,false,0,0);
      gl.drawArrays(gl.TRIANGLES,0,vertexCount);

      const lanternWorld:number[]=[]; const lanternColors:number[]=[];
      for(let i=0;i<18;i++){ const z=8+i*9.2; for(const side of [-1,1] as const){ const x=side*(2.8+z*.012); addBox(lanternWorld,lanternColors,[x,1.65,z],[.24,.55,.24],[.9,.48,.16]); addBox(lanternWorld,lanternColors,[x,2.05,z],[.32,.06,.32],[.34,.16,.07]); } }
      gl.bindBuffer(gl.ARRAY_BUFFER,vbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lanternWorld),gl.DYNAMIC_DRAW); gl.bindBuffer(gl.ARRAY_BUFFER,cbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lanternColors),gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES,0,lanternWorld.length/3);
      gl.bindBuffer(gl.ARRAY_BUFFER,vbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(world),gl.STATIC_DRAW); gl.bindBuffer(gl.ARRAY_BUFFER,cbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);

      const cameraDelta=cameraZ-previousCameraZ; for(let i=0;i<particleCount;i++){ particleData[i*3+2]-=cameraDelta*.92; if(particleData[i*3+2]<cameraZ+2) particleData[i*3+2]+=198; particleData[i*3]+=Math.sin(time*.0004+i)*.001*dt; } previousCameraZ=cameraZ;
      gl.useProgram(particleProgram); gl.uniformMatrix4fv(gl.getUniformLocation(particleProgram,'uProjection'),false,projection); gl.uniformMatrix4fv(gl.getUniformLocation(particleProgram,'uView'),false,view);
      gl.bindBuffer(gl.ARRAY_BUFFER,pbo); gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(particleData)); const p=gl.getAttribLocation(particleProgram,'aPosition'); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,sbo); const ps=gl.getAttribLocation(particleProgram,'aSize'); gl.enableVertexAttribArray(ps); gl.vertexAttribPointer(ps,1,gl.FLOAT,false,0,0); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE); gl.drawArrays(gl.POINTS,0,particleCount); gl.disable(gl.BLEND);
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);removeEventListener('pointermove',move);[vbo,cbo,pbo,sbo].forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);gl.deleteProgram(particleProgram);};
  },[]);

  useEffect(()=>{
    const onScroll=()=>{const el=document.getElementById('kage-experience');if(!el)return;const total=Math.max(el.offsetHeight-innerHeight,1);const p=Math.min(1,Math.max(0,-el.getBoundingClientRect().top/total));scrollRef.current=p;setProgress(p);setChapter(Math.min(chapters.length-1,Math.floor(p*chapters.length)));};
    onScroll(); addEventListener('scroll',onScroll,{passive:true}); addEventListener('resize',onScroll); return()=>{removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll);};
  },[]);

  const active=chapters[chapter];
  return <section id="kage-experience" className="relative h-[500vh] overflow-clip bg-[#020306] text-white">
    <div className="sticky top-0 h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Environnement 3D immersif" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,transparent_43%,rgba(0,0,0,.58)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-8 lg:p-12">
        <div className="max-w-[260px] text-[10px] font-mono uppercase tracking-[.32em] text-white/45">Immersive 3D / WebGL<br/><span className="text-white/25">camera journey</span></div>
        <div className="text-right text-[10px] font-mono uppercase tracking-[.28em] text-white/45">{String(Math.round(progress*100)).padStart(2,'0')}%</div>
      </div>
      <div className="absolute left-6 right-6 bottom-12 sm:left-10 sm:right-10 sm:bottom-16 lg:left-16 lg:bottom-20 lg:max-w-2xl">
        <div className="mb-5 flex items-center gap-4 text-[10px] font-mono uppercase tracking-[.34em] text-[#c99a61]"><span className="h-px w-16 bg-[#c99a61]/60" />{active.kicker}</div>
        <h2 className="whitespace-pre-line text-[clamp(3.4rem,9vw,8rem)] font-light leading-[.82] tracking-[-.055em] text-white">{active.title}</h2>
        <p className="mt-7 max-w-xl text-sm leading-7 text-white/62 sm:text-base">{active.body}</p>
      </div>
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"><span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6a467] shadow-[0_0_20px_rgba(214,164,103,.9)]" /></div>
      <div className="absolute bottom-7 right-7 hidden h-28 w-px bg-white/15 sm:block"><div className="absolute left-0 top-0 w-px bg-[#d6a467] transition-[height] duration-300" style={{height:`${progress*100}%`}} /></div>
    </div>
  </section>;
}
