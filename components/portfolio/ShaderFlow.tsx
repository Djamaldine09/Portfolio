'use client';

import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_intensity;
uniform float u_direction;
uniform float u_speed;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * u_speed;
  float mouseInfluence = (u_mouse.x - 0.5) * 0.18;

  // Large, soft curved light ribbon.
  float curveX = p.x * 0.78 + mouseInfluence;
  float curve = 0.18 + 0.22 * curveX * curveX;
  curve += sin(curveX * 3.2 + t * 0.35 + u_direction) * 0.018;
  curve += (noise(vec2(curveX * 2.2, t * 0.08)) - 0.5) * 0.012;

  float distanceToRibbon = abs(p.y - curve);
  float ribbon = exp(-pow(distanceToRibbon / (0.018 + u_intensity * 0.008), 2.0));
  float glow = exp(-pow(distanceToRibbon / (0.085 + u_intensity * 0.025), 2.0));

  // Subtle interactive ripple around the pointer.
  vec2 mouse = (u_mouse - 0.5);
  mouse.x *= u_resolution.x / u_resolution.y;
  float mouseDistance = length(p - mouse);
  float ripple = sin(mouseDistance * 38.0 - t * 3.0) * exp(-mouseDistance * 5.5);
  ripple *= 0.025 * u_intensity;

  float wave = ribbon + glow * 0.48 + ripple;

  // Cinematic blue / warm light edges.
  float edge = smoothstep(0.0, 0.8, abs(p.x));
  vec3 cool = vec3(0.35, 0.72, 1.0);
  vec3 warm = vec3(1.0, 0.62, 0.28);
  vec3 white = vec3(1.0);
  vec3 lightColor = mix(cool, warm, smoothstep(0.25, 0.95, uv.x));
  lightColor = mix(lightColor, white, pow(ribbon, 1.8));

  vec3 background = vec3(0.006, 0.008, 0.01);
  background += vec3(0.012, 0.016, 0.022) * (1.0 - uv.y);

  vec3 color = background + lightColor * wave * 1.55;
  color += white * pow(ribbon, 5.0) * 1.8;
  color *= 1.0 + edge * 0.06;

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Shader program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function ShaderFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, 'a_position');
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const mouse = gl.getUniformLocation(program, 'u_mouse');
    const time = gl.getUniformLocation(program, 'u_time');
    const intensity = gl.getUniformLocation(program, 'u_intensity');
    const direction = gl.getUniformLocation(program, 'u_direction');
    const speed = gl.getUniformLocation(program, 'u_speed');

    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let animationFrame = 0;
    let startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = section.getBoundingClientRect();
      targetX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      targetY = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      targetX = 0.5;
      targetY = 0.5;
    };

    const render = (now: number) => {
      resize();

      pointerX += (targetX - pointerX) * 0.045;
      pointerY += (targetY - pointerY) * 0.045;

      gl.useProgram(program);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(mouse, pointerX, pointerY);
      gl.uniform1f(time, (now - startTime) / 1000);
      gl.uniform1f(intensity, 1.0);
      gl.uniform1f(direction, pointerX * 2.5);
      gl.uniform1f(speed, 0.55);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };

    section.addEventListener('pointermove', onPointerMove, { passive: true });
    section.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', resize);

    resize();
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="shader-flow"
      className="relative min-h-[760px] overflow-hidden bg-[#020304] text-white sm:min-h-[850px] lg:min-h-screen"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,.28)_70%,rgba(0,0,0,.65)_100%)]" />

      <div className="relative z-10 flex min-h-[760px] flex-col justify-between px-6 py-10 sm:min-h-[850px] sm:px-12 sm:py-14 lg:min-h-screen lg:px-20 lg:py-16">
        <div className="max-w-[760px]">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-white/45">
            Interactive WebGL / 05
          </p>
          <h2 className="text-[clamp(3.2rem,9vw,8rem)] font-semibold leading-[0.86] tracking-[-0.065em]">
            Shader Flow
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <p className="max-w-[680px] text-[clamp(1.15rem,2.3vw,1.75rem)] leading-[1.12] tracking-[-0.035em] text-white/78">
            Shader Flow brings WebGL-powered visuals to Framer, making it easy to design motion-rich backgrounds and interactive effects without code. Customize shader intensity, direction, and animation speed to craft stunning light distortions, ripples, or smooth transitions.
          </p>

          <p className="max-w-[560px] text-sm leading-6 text-white/48 lg:justify-self-end">
            Built for hero sections, creative showcases, and immersive layouts, Shader Flow helps designers add visual depth and movement that respond naturally to user interaction. Perfect for elevating any Framer project with modern, cinematic energy.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.24em] text-white/35">
          <span>Move your cursor / touch the screen</span>
          <span>WebGL</span>
        </div>
      </div>
    </section>
  );
}
