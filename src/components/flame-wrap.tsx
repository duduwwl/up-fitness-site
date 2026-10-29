/* eslint-disable quality/max-lines -- user-supplied canvas renderer retained intact */
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { VERT, FRAG } from "./flame-shaders";
const canvasDimensionLimits = new WeakMap<WebGLRenderingContext | WebGL2RenderingContext, number>();

/** Keep the existing DPR budget, then account for browser pinch zoom. */
function getCanvasPixelRatio(
  element: HTMLElement,
  context?: WebGLRenderingContext | WebGL2RenderingContext,
): number {
  const scale = window.visualViewport?.scale || 1;
  const requested = Math.min(window.devicePixelRatio || 1, 2) * scale;
  const width = Math.max(element.clientWidth, 1);
  const height = Math.max(element.clientHeight, 1);
  let maxDimension = 8192;
  if (context) {
    let limit = canvasDimensionLimits.get(context);
    if (limit === undefined) {
      limit = Math.min(
        maxDimension,
        context.getParameter(context.MAX_TEXTURE_SIZE),
        context.getParameter(context.MAX_RENDERBUFFER_SIZE),
      );
      canvasDimensionLimits.set(context, limit);
    }
    maxDimension = limit;
  }
  // Rendering the full element preserves its CSS position and native input
  // geometry while panning. Bound allocations when zooming large canvases.
  return Math.min(
    requested,
    maxDimension / Math.max(width, height),
    Math.sqrt(16_777_216 / (width * height)),
  );
}

/** Pinch zoom changes visualViewport without resizing the element's CSS box. */
function createCanvasResizeObserver(onResize: () => void) {
  const viewport = window.visualViewport;
  let frame = 0;
  let disconnected = false;
  const schedule = () => {
    if (frame || disconnected) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      onResize();
    });
  };
  const observer = new ResizeObserver(schedule);
  window.addEventListener("resize", schedule, { passive: true });
  viewport?.addEventListener("resize", schedule, { passive: true });
  return {
    observe(element: Element, options?: ResizeObserverOptions) {
      observer.observe(element, options);
    },
    unobserve(element: Element) {
      observer.unobserve(element);
    },
    disconnect() {
      disconnected = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("resize", schedule);
    },
  };
}

type HtmlInCanvasContext = CanvasRenderingContext2D & {
  drawElementImage: (element: Element, x: number, y: number) => DOMMatrix | void;
};

type HtmlInCanvasElement = HTMLCanvasElement & {
  updateElementGeometry?: (
    element: Element,
    options: { canvasTransform: DOMMatrix },
  ) => void;
};

/** Configure the capture subtree for both generations of the experimental API. */
function prepareHtmlInCanvas(source: HTMLCanvasElement, content: HTMLElement) {
  if ("content" in source) {
    source.setAttribute("content", "drawable");
    content.setAttribute("drawable", "");
  } else {
    source.setAttribute("layoutsubtree", "");
  }
}

/** Capture pixels and keep the native DOM hit-test region aligned with them. */
function drawHtmlInCanvas(
  source: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  content: HTMLElement,
) {
  const transform = (context as HtmlInCanvasContext).drawElementImage(content, 0, 0);
  const canvas = source as HtmlInCanvasElement;
  // Chrome 154 decoupled geometry from drawing before enabling automatic 2D
  // synchronization. Older versions have no update method; newer versions
  // synchronize automatically and return void. Use the returned matrix as-is:
  // drawElementImage already accounts for the canvas's pixel density.
  if (transform && typeof canvas.updateElementGeometry === "function") {
    canvas.updateElementGeometry(content, { canvasTransform: transform });
  }
}

export interface FlameWrapOptions {
  /** Flame color as [r, g, b] in 0-1 range. */
  color?: [number, number, number];
  /** Overall brightness of the fire (0 to 3). */
  intensity?: number;
  /** Reach of the flames above the top edge in CSS pixels. */
  height?: number;
  /** Reach of the glow on the sides and bottom in CSS pixels. */
  spread?: number;
  /** Corner radius of the burning outline in CSS pixels. Match your content. */
  radius?: number;
  /** Animation speed multiplier for the whole effect. */
  speed?: number;
  /** Flame detail from 0 (broad licks) to 1 (fine licks). */
  scale?: number;
  /** Amplitude of the turbulence waves shaping the flames (0 to 1). */
  turbulence?: number;
  /** Frequency multiplier of the turbulence waves (0.2 to 3). */
  turbulenceScale?: number;
  /** How far from the edges the heat warps the content, in CSS pixels. */
  turbulenceReach?: number;
  /** Brightness of the spark highlights (0 to 3). 0 disables them. */
  sparks?: number;
  /** Size multiplier for individual sparks (0.2 to 3). */
  sparkSize?: number;
  /** How many sparks fly at once (0.3 to 2.5). */
  sparkDensity?: number;
  /** How fast sparks rise and flicker (0.1 to 3). */
  sparkSpeed?: number;
  /** Strength of the molten glow hugging the edges (0 to 3). */
  rim?: number;
  /** How far the flames eat into the content silhouette in CSS pixels. */
  melt?: number;
  /** Heat shimmer displacement of the content near the edges in CSS pixels. */
  distortion?: number;
  /** Amount of smoke drifting off the flames (0 to 2). */
  smoke?: number;
  /** Brightness of the glowing ember line on the burnt edges (0 to 2). */
  ember?: number;
  /** Darkness of the charred band on the content edges (0 to 2). */
  scorch?: number;
}

export interface FlameWrapElements {
  /** Canvas with layoutsubtree that hosts the HTML content. */
  source: HTMLCanvasElement;
  /** The element inside the source canvas that gets captured. */
  content: HTMLElement;
  /** Canvas the WebGL effect renders to. */
  output: HTMLCanvasElement;
}

export interface FlameWrapInstance {
  /** Update effect options live. */
  setOptions: (options: FlameWrapOptions) => void;
  /** Re-read canvas size. Call when the element is resized. */
  resize: () => void;
  /** Stop the loop and release all GPU resources. */
  destroy: () => void;
}

const DEFAULTS: Required<FlameWrapOptions> = {
  color: [0.31, 0.54, 1],
  intensity: 0.5,
  height: 170,
  spread: 8,
  radius: 40,
  speed: 0.25,
  scale: 0.75,
  turbulence: 0.5,
  turbulenceScale: 0.5,
  turbulenceReach: 25,
  sparks: 1.5,
  sparkSize: 0.35,
  sparkDensity: 1,
  sparkSpeed: 1,
  rim: 2.5,
  melt: 4.5,
  distortion: 10,
  smoke: 1.5,
  ember: 2,
  scorch: 0,
};

type PaintableCanvas = HTMLCanvasElement & {
  onpaint?: (() => void) | null;
  requestPaint?: () => void;
};

type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void;
};

export function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  return Boolean(
    ctx &&
    typeof ctx.drawElementImage === "function" &&
    typeof probe.requestPaint === "function",
  );
}

export function createFlameWrap(
  elements: FlameWrapElements,
  options: FlameWrapOptions = {},
): FlameWrapInstance | null {
  const config = { ...DEFAULTS, ...options };
  const { source, content, output } = elements;

  const gl = output.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl || gl.isContextLost()) return null;

  const sourceCtx = source.getContext("2d") as ElementImageContext | null;
  const paintable = source as PaintableCanvas;
  const htmlInCanvas = Boolean(
    sourceCtx &&
    typeof sourceCtx.drawElementImage === "function" &&
    typeof paintable.requestPaint === "function",
  );

  if (htmlInCanvas) prepareHtmlInCanvas(source, content);

  let contentDirty = false;
  let wake = () => {};

  if (htmlInCanvas) {
    paintable.onpaint = () => {
      try {
        sourceCtx!.reset();
        drawHtmlInCanvas(source, sourceCtx!, content);
        contentDirty = true;
        wake();
      } catch {}
    };
  }

  function compile(type: number, text: string): WebGLShader {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, text);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error("FlameWrap shader error:", gl!.getShaderInfoLog(shader));
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERT);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const uniforms: Record<string, WebGLUniformLocation> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)!;
    uniforms[info.name] = gl.getUniformLocation(program, info.name)!;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const contentTexture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, contentTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  );

  const rect = { cx: 0, cy: 0, hx: 1, hy: 1 };
  let dpr = 1;

  function syncCanvasSize() {
    dpr = getCanvasPixelRatio(output, gl!);
    const width = Math.max(1, Math.round(output.clientWidth * dpr));
    const height = Math.max(1, Math.round(output.clientHeight * dpr));
    if (output.width !== width || output.height !== height) {
      output.width = width;
      output.height = height;
    }
    const box = htmlInCanvas ? source : content;
    const outRect = output.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    if (outRect.width > 0 && boxRect.width > 0) {
      rect.cx = (boxRect.left + boxRect.right) / 2 - outRect.left;
      rect.cy = outRect.bottom - (boxRect.top + boxRect.bottom) / 2;
      rect.hx = boxRect.width / 2;
      rect.hy = boxRect.height / 2;
    }
    if (htmlInCanvas) {
      const sourceWidth = Math.max(1, Math.round(source.clientWidth * dpr));
      const sourceHeight = Math.max(1, Math.round(source.clientHeight * dpr));
      if (
        source.width !== sourceWidth ||
        source.height !== sourceHeight
      ) {
        source.width = sourceWidth;
        source.height = sourceHeight;
      }
      paintable.requestPaint!();
    }
  }

  syncCanvasSize();

  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return;
    contentDirty = false;
    gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      source,
    );
    sourceCtx!.clearRect(0, 0, source.width, source.height);
  }

  let time = 0;

  function render() {
    uploadContent();
    gl!.useProgram(program);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
    gl!.uniform1i(uniforms.uContent, 0);
    gl!.uniform2f(uniforms.uResolution, output.width, output.height);
    gl!.uniform1f(uniforms.uTime, time);
    gl!.uniform2f(uniforms.uRectCenter, rect.cx * dpr, rect.cy * dpr);
    gl!.uniform2f(
      uniforms.uRectHalf,
      Math.max(rect.hx * dpr, 1),
      Math.max(rect.hy * dpr, 1),
    );
    gl!.uniform1f(uniforms.uCorner, Math.max(config.radius, 0) * dpr);
    gl!.uniform3f(
      uniforms.uColor,
      config.color[0],
      config.color[1],
      config.color[2],
    );
    gl!.uniform1f(uniforms.uIntensity, Math.max(config.intensity, 0));
    gl!.uniform1f(uniforms.uHeight, Math.max(config.height, 24) * dpr);
    gl!.uniform1f(uniforms.uSpread, Math.max(config.spread, 8) * dpr);
    gl!.uniform1f(uniforms.uScale, Math.max(config.scale, 0.05));
    gl!.uniform1f(uniforms.uTurbulence, Math.max(config.turbulence, 0));
    gl!.uniform1f(uniforms.uTurbScale, Math.max(config.turbulenceScale, 0.2));
    gl!.uniform1f(
      uniforms.uTurbReach,
      Math.max(config.turbulenceReach, 4) * dpr,
    );
    gl!.uniform1f(uniforms.uSparks, Math.max(config.sparks, 0));
    gl!.uniform1f(uniforms.uSparkSize, Math.max(config.sparkSize, 0.2));
    gl!.uniform1f(uniforms.uSparkDensity, Math.max(config.sparkDensity, 0.3));
    gl!.uniform1f(uniforms.uSparkSpeed, Math.max(config.sparkSpeed, 0.05));
    gl!.uniform1f(uniforms.uRim, Math.max(config.rim, 0));
    gl!.uniform1f(uniforms.uMelt, Math.max(config.melt, 0) * dpr);
    gl!.uniform1f(uniforms.uDistortion, Math.max(config.distortion, 0) * dpr);
    gl!.uniform1f(uniforms.uSmoke, Math.max(config.smoke, 0));
    gl!.uniform1f(uniforms.uEmber, Math.max(config.ember, 0));
    gl!.uniform1f(uniforms.uScorch, Math.max(config.scorch, 0));
    gl!.uniform1f(uniforms.uHasContent, htmlInCanvas ? 1 : 0);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, output.width, output.height);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }

  let raf = 0;
  let lastTime = performance.now();
  let destroyed = false;
  let running = false;
  let visible = true;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;

  function frame(now: number) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    const delta = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    if (!reducedMotion) time += delta * config.speed;
    render();
    if (reducedMotion && !contentDirty) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (destroyed || running || !visible) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  wake = start;
  start();

  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    start();
  }
  motionQuery.addEventListener("change", onMotionChange);

  const observer = createCanvasResizeObserver(() => {
    syncCanvasSize();
    start();
  });
  observer.observe(output);
  observer.observe(content);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1]?.isIntersecting ?? true;
    if (visible) start();
  });
  intersection.observe(output);

  return {
    setOptions(next) {
      let changed = false;
      for (const [key, value] of Object.entries(next)) {
        const prev = config[key as keyof typeof config];
        if (Array.isArray(value) && Array.isArray(prev)) {
          if (
            value.length !== prev.length ||
            value.some((item, i) => item !== prev[i])
          ) {
            changed = true;
            break;
          }
        } else if (prev !== value) {
          changed = true;
          break;
        }
      }
      Object.assign(config, next);
      if (!changed) return;
      syncCanvasSize();
      start();
    },
    resize() {
      syncCanvasSize();
      start();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      gl!.deleteTexture(contentTexture);
      gl!.deleteProgram(program);
      gl!.deleteShader(vertexShader);
      gl!.deleteShader(fragmentShader);
      gl!.deleteBuffer(quad);
      if (htmlInCanvas) paintable.onpaint = null;
    },
  };
}

export interface FlameWrapProps extends FlameWrapOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const emptySubscribe = () => () => {};

export function FlameWrap({
  children,
  className,
  style,
  ...options
}: FlameWrapProps) {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<FlameWrapInstance | null>(null);
  const [initialOptions] = useState(options);
  const [failed, setFailed] = useState(false);

  const supported = useSyncExternalStore(
    emptySubscribe,
    supportsHtmlInCanvas,
    () => false,
  );
  const native = supported && !failed;

  const reach = Math.round(Math.max(options.height ?? 170, 24) * 1.5) + 40;
  const glow = Math.round(Math.max(options.spread ?? 8, 8) * 3) + 16;

  useEffect(() => {
    const source = sourceRef.current;
    const content = contentRef.current;
    const output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createFlameWrap(
      { source, content, output },
      initialOptions,
    );
    if (native && !instanceRef.current) setFailed(true);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [initialOptions, native]);

  useEffect(() => {
    instanceRef.current?.setOptions(options);
  });

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={sourceRef}
        // Experimental html-in-canvas attribute.
        {...{ layoutsubtree: "true" }}
        suppressHydrationWarning
        style={
          native
            ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
            : { display: "none" }
        }
      >
        {native ? (
          <div
            ref={contentRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          >
            {children}
          </div>
        ) : null}
      </canvas>
      {!native ? (
        <div
          ref={contentRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      ) : null}
      <canvas
        ref={outputRef}
        aria-hidden
        style={{
          position: "absolute",
          top: -reach,
          right: -glow,
          bottom: -glow,
          left: -glow,
          width: `calc(100% + ${glow * 2}px)`,
          height: `calc(100% + ${reach + glow}px)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}


export default FlameWrap;


