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

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  float aspect = u_resolution.x / u_resolution.y;
  p.x *= aspect;

  float t = u_time * 0.34;
  vec2 mouse = u_mouse - 0.5;
  mouse.x *= aspect;

  // Slow autonomous motion keeps the composition alive without input.
  float drift = sin(t * 0.72) * 0.075 + sin(t * 0.31 + 1.7) * 0.035;
  float bend = sin(p.x * 2.25 + t * 0.55) * 0.035;
  bend += sin(p.x * 5.0 - t * 0.32) * 0.012;
  bend += drift;

  // Subtle response to pointer / touch, while remaining fully automatic.
  bend += mouse.x * 0.09;

  float curve = 0.12 + 0.22 * p.x * p.x + bend;
  float d = abs(p.y - curve);

  float core = exp(-pow(d / 0.014, 2.0));
  float bloom = exp(-pow(d / 0.065, 2.0));
  float outerGlow = exp(-pow(d / 0.16, 2.0));

  // Gentle travelling pulse across the ribbon.
  float pulse = 0.82 + 0.18 * sin(p.x * 4.0 - t * 2.2);
  core *= pulse;

  vec3 blue = vec3(0.22, 0.58, 1.0);
  vec3 cyan = vec3(0.62, 0.88, 1.0);
  vec3 warm = vec3(1.0, 0.58, 0.22);
  vec3 white = vec3(1.0);

  float warmMix = smoothstep(-0.1, 0.95, uv.x + sin(t * 0.2) * 0.12);
  vec3 light = mix(blue, warm, warmMix);
  light = mix(light, cyan, 0.25 + 0.15 * sin(t * 0.5));
  light = mix(light, white, pow(core, 1.5));

  vec3 background = vec3(0.004, 0.006, 0.008);
  background += vec3(0.012, 0.016, 0.022) * (1.0 - uv.y);

  float vignette = 1.0 - smoothstep(0.28, 0.9, length(p * vec2(0.7, 0.8)));
  vec3 color = background;
  color += light * outerGlow * 0.18;
  color += light * bloom * 0.95;
  color += white * core * 2.0;
  color *= 0.78 + vignette * 0.22;

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
    if (!buffer) return;

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

    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let animationFrame = 0;
    const startTime = performance.now();

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

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_18%,rgba(0,0,0,.2)_58%,rgba(0,0,0,.72)_100%)]" />

      <div className="relative z-10 flex min-h-[760px] flex-col justify-between px-6 py-10 sm:min-h-[850px] sm:px-12 sm:py-14 lg:min-h-screen lg:px-20 lg:py-16">
        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/45">
            Selected work / 05
          </p>
          <h2 className="max-w-[900px] text-[clamp(3.4rem,9vw,8.5rem)] font-semibold leading-[0.82] tracking-[-0.07em]">
            Motion that<br />
            feels alive.
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_.7fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-white/45">
              Shader Flow — WebGL Experience
            </p>
            <p className="max-w-[720px] text-[clamp(1.15rem,2.4vw,1.8rem)] leading-[1.08] tracking-[-0.04em] text-white/82">
              A real-time WebGL visual system designed to bring cinematic motion, depth and atmosphere to modern digital experiences.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-[470px] text-sm leading-6 text-white/48">
              Built with WebGL and GLSL, the experience continuously evolves on its own while responding naturally to cursor and touch input. Designed for hero sections, creative portfolios and immersive interfaces.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['WebGL', 'GLSL', 'Motion', 'Interactive'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.24em] text-white/35">
          <span>Autonomous motion / interactive input</span>
          <span>WebGL · 60fps</span>
        </div>
      </div>
    </section>
  );
}
