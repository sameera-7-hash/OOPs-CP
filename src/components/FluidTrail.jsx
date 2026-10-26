import { useEffect, useRef } from "react";

// The House of Dreamers fluid trail: a small WebGL Navier-Stokes sim (after
// Pavel Dobryakov's WebGL-Fluid-Simulation) that the pointer stirs with
// coloured dye, using their settings. The dye cycles through PALETTE and is
// drawn as translucent ink, not additive light, so it reads on a light
// background. Given an `image` (a ref to an <img> behind the canvas), it
// also redraws that image bent by the flow, so the picture itself ripples
// like water; when the flow settles the canvas clears and the <img> shows
// through unchanged. Mouse and pen only, skipped for reduced motion or
// without WebGL half-float support, and the loop stops a few seconds after
// the pointer goes still.
const CONFIG = {
  downsample: 3, // sim grid = viewport >> 3
  densityDissipation: 0.98,
  velocityDissipation: 0.99,
  pressureDissipation: 0.158,
  pressureIterations: 4,
  curl: 15,
  splatRadius: 0.00175,
  velocityForce: 10,
  dyeStrength: 0.38,
  // Image displacement per unit of flow velocity (in screen UV), and its cap.
  imageDistort: 0.0001,
  imageDistortMax: 0.04,
  idleMs: 4000,
};

// Sampled from the landing lighthouse painting: lavender sky, rose and peach
// clouds, the lamp's warm glow, and the teal sea.
const PALETTE = ["#a99ad6", "#eea6b8", "#ffc8a2", "#ffe2a8", "#3fa7a3"];
const PALETTE_RGB = PALETTE.map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255));
const PALETTE_CYCLE_MS = 9000;

// The palette colour at time `now`, blending smoothly from one stop to the next.
function paletteColor(now) {
  const t = ((now % PALETTE_CYCLE_MS) / PALETTE_CYCLE_MS) * PALETTE_RGB.length;
  const from = PALETTE_RGB[Math.floor(t)];
  const to = PALETTE_RGB[(Math.floor(t) + 1) % PALETTE_RGB.length];
  const mix = t - Math.floor(t);
  return from.map((c, i) => c + (to[i] - c) * mix);
}

const baseVertex = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }`;

const shaders = {
  clear: `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,
  splat: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
      vec2 p = vUv - point;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
    }`,
  advection: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    void main () {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = dissipation * texture2D(uSource, coord);
      gl_FragColor.a = 1.0;
    }`,
  divergence: `
    precision mediump float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,
  curl: `
    precision mediump float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,
  vorticity: `
    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
    }`,
  pressure: `
    precision mediump float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float divergence = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
    }`,
  gradientSubtract: `
    precision mediump float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }`,
  // Dye as ink: the hue at full saturation, coverage from its strength.
  // With an image, the image is drawn underneath, sampled at a point pushed
  // along the flow; uImageMap maps top-left screen UV to image UV
  // (xy = scale, zw = offset), matching the <img>'s object-fit and zoom.
  display: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform sampler2D uVelocity;
    uniform sampler2D uImage;
    uniform float uImageOn;
    uniform vec4 uImageMap;
    uniform float uDistort;
    uniform float uDistortMax;
    void main () {
      vec3 dye = texture2D(uTexture, vUv).rgb;
      float strength = max(dye.r, max(dye.g, dye.b));
      float alpha = clamp(strength * 1.4, 0.0, 0.7);
      vec3 color = dye / max(strength, 0.0001);
      if (uImageOn < 0.5) {
        gl_FragColor = vec4(color * alpha, alpha);
        return;
      }
      vec2 offset = texture2D(uVelocity, vUv).xy * uDistort;
      float len = length(offset);
      if (len > uDistortMax) offset *= uDistortMax / len;
      vec2 screen = vec2(vUv.x, 1.0 - vUv.y) - vec2(offset.x, -offset.y);
      vec3 image = texture2D(uImage, screen * uImageMap.xy + uImageMap.zw).rgb;
      gl_FragColor = vec4(mix(image, color, alpha), 1.0);
    }`,
};

function createFluid(canvas) {
  const params = { alpha: true, premultipliedAlpha: true, depth: false, stencil: false, antialias: false };
  let gl = canvas.getContext("webgl2", params);
  const isWebGL2 = Boolean(gl);
  if (!gl) gl = canvas.getContext("webgl", params);
  if (!gl) return null;

  let internalFormat;
  let type;
  if (isWebGL2) {
    if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;
    internalFormat = gl.RGBA16F;
    type = gl.HALF_FLOAT;
  } else {
    const halfFloat = gl.getExtension("OES_texture_half_float");
    if (!halfFloat || !gl.getExtension("OES_texture_half_float_linear")) return null;
    internalFormat = gl.RGBA;
    type = halfFloat.HALF_FLOAT_OES;
  }

  const compile = (kind, source) => {
    const shader = gl.createShader(kind);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, baseVertex);
  const programs = {};
  for (const [name, source] of Object.entries(shaders)) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, source));
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    programs[name] = { program, uniforms };
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const createFBO = (w, h) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, gl.RGBA, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, fbo };
  };
  const createDoubleFBO = (w, h) => {
    const pair = { read: createFBO(w, h), write: createFBO(w, h) };
    pair.swap = () => {
      [pair.read, pair.write] = [pair.write, pair.read];
    };
    return pair;
  };

  let simW = 0;
  let simH = 0;
  let targets = null;
  let imageTexture = null;

  // The display is drawn at device resolution (so the image stays sharp);
  // the sim grid follows the CSS size.
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    simW = Math.max(1, window.innerWidth >> CONFIG.downsample);
    simH = Math.max(1, window.innerHeight >> CONFIG.downsample);
    if (targets) {
      for (const t of Object.values(targets)) {
        for (const fbo of t.read ? [t.read, t.write] : [t]) {
          gl.deleteTexture(fbo.texture);
          gl.deleteFramebuffer(fbo.fbo);
        }
      }
    }
    targets = {
      density: createDoubleFBO(simW, simH),
      velocity: createDoubleFBO(simW, simH),
      pressure: createDoubleFBO(simW, simH),
      divergence: createFBO(simW, simH),
      curl: createFBO(simW, simH),
    };
    gl.bindFramebuffer(gl.FRAMEBUFFER, targets.divergence.fbo);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  };

  const use = (name) => {
    const { program, uniforms } = programs[name];
    gl.useProgram(program);
    if (uniforms.texelSize) gl.uniform2f(uniforms.texelSize, 1 / simW, 1 / simH);
    return uniforms;
  };
  // Binds each FBO's texture to its own unit and points the sampler at it.
  const bindTextures = (uniforms, samplers) => {
    Object.entries(samplers).forEach(([name, fbo], unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
      gl.uniform1i(uniforms[name], unit);
    });
  };
  const blit = (target) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  const splat = (x, y, dx, dy, color) => {
    const { velocity, density } = targets;
    let u = use("splat");
    bindTextures(u, { uTarget: velocity.read });
    gl.uniform1f(u.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(u.point, x / window.innerWidth, 1 - y / window.innerHeight);
    gl.uniform3f(u.color, dx, -dy, 1);
    gl.uniform1f(u.radius, CONFIG.splatRadius);
    blit(velocity.write);
    velocity.swap();

    u = use("splat");
    bindTextures(u, { uTarget: density.read });
    gl.uniform3f(u.color, color[0], color[1], color[2]);
    blit(density.write);
    density.swap();
  };

  const step = (dt) => {
    const { density, velocity } = targets;
    gl.viewport(0, 0, simW, simH);

    const u = use("advection");
    bindTextures(u, { uVelocity: velocity.read, uSource: velocity.read });
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.dissipation, CONFIG.velocityDissipation);
    blit(velocity.write);
    velocity.swap();

    bindTextures(u, { uVelocity: velocity.read, uSource: density.read });
    gl.uniform1f(u.dissipation, CONFIG.densityDissipation);
    blit(density.write);
    density.swap();
  };

  const project = (dt) => {
    const { velocity, pressure, divergence, curl } = targets;
    gl.viewport(0, 0, simW, simH);

    let u = use("curl");
    bindTextures(u, { uVelocity: velocity.read });
    blit(curl);

    u = use("vorticity");
    bindTextures(u, { uVelocity: velocity.read, uCurl: curl });
    gl.uniform1f(u.curl, CONFIG.curl);
    gl.uniform1f(u.dt, dt);
    blit(velocity.write);
    velocity.swap();

    u = use("divergence");
    bindTextures(u, { uVelocity: velocity.read });
    blit(divergence);

    u = use("clear");
    bindTextures(u, { uTexture: pressure.read });
    gl.uniform1f(u.value, CONFIG.pressureDissipation);
    blit(pressure.write);
    pressure.swap();

    u = use("pressure");
    for (let i = 0; i < CONFIG.pressureIterations; i++) {
      bindTextures(u, { uPressure: pressure.read, uDivergence: divergence });
      blit(pressure.write);
      pressure.swap();
    }

    u = use("gradientSubtract");
    bindTextures(u, { uPressure: pressure.read, uVelocity: velocity.read });
    blit(velocity.write);
    velocity.swap();
  };

  const setImage = (img) => {
    imageTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  };

  // `imageMap` is [scaleX, scaleY, offsetX, offsetY], or null to draw dye only.
  const render = (imageMap) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    const u = use("display");
    const withImage = Boolean(imageTexture && imageMap);
    bindTextures(u, {
      uTexture: targets.density.read,
      uVelocity: targets.velocity.read,
      uImage: { texture: withImage ? imageTexture : targets.density.read.texture },
    });
    gl.uniform1f(u.uImageOn, withImage ? 1 : 0);
    if (withImage) gl.uniform4f(u.uImageMap, ...imageMap);
    gl.uniform1f(u.uDistort, CONFIG.imageDistort);
    gl.uniform1f(u.uDistortMax, CONFIG.imageDistortMax);
    blit(null);
  };

  const clear = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  return { resize, splat, step, project, render, clear, setImage };
}

// Where the <img> actually paints: object-fit: cover at its object-position
// inside its layout box (which can be taller than the viewport when the page
// scrolls), then its CSS scale animation about its transform-origin.
// Returned as the linear map from top-left screen UV to image UV that the
// display shader uses.
function coverMap(img) {
  const box = img.parentElement.getBoundingClientRect(); // the img fills it (inset: 0), untransformed
  const W = img.offsetWidth;
  const H = img.offsetHeight;
  const style = getComputedStyle(img);
  const [px, py] = style.objectPosition.split(" ").map((v) => parseFloat(v) / 100);
  const [ox, oy] = style.transformOrigin.split(" ").map((v) => parseFloat(v));
  const zoom = style.transform === "none" ? 1 : new DOMMatrixReadOnly(style.transform).a;
  const fit = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const iw = img.naturalWidth * fit;
  const ih = img.naturalHeight * fit;
  const offX = (W - iw) * px;
  const offY = (H - ih) * py;
  // viewport px -> box px: p - box; -> unzoomed: (b - o) / zoom + o; -> image UV: (q - off) / size
  return [
    window.innerWidth / (zoom * iw),
    window.innerHeight / (zoom * ih),
    ((-box.left - ox) / zoom + ox - offX) / iw,
    ((-box.top - oy) / zoom + oy - offY) / ih,
  ];
}

function FluidTrail({ className, image }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return undefined;

    const canvas = canvasRef.current;
    const fluid = createFluid(canvas);
    if (!fluid || !fluid.resize()) return undefined;

    // Upload the background once it has decoded (whichever srcset size the
    // browser picked); until then the trail draws dye only.
    const img = image?.current;
    let imageReady = false;
    const loadImage = () => {
      if (!img || imageReady || !img.naturalWidth) return;
      fluid.setImage(img);
      imageReady = true;
    };
    if (img) {
      if (img.complete) loadImage();
      else img.addEventListener("load", loadImage, { once: true });
    }

    const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, seen: false };
    let frame = 0;
    let last = 0;
    let lastMove = 0;
    let lost = false;

    const tick = (now) => {
      const dt = Math.min((now - (last || now - 16)) / 1000, 0.016);
      last = now;
      fluid.step(dt);
      if (pointer.moved) {
        pointer.moved = false;
        const [r, g, b] = paletteColor(now);
        const k = CONFIG.dyeStrength;
        fluid.splat(pointer.x, pointer.y, pointer.dx * CONFIG.velocityForce, pointer.dy * CONFIG.velocityForce, [r * k, g * k, b * k]);
        pointer.dx = 0;
        pointer.dy = 0;
      }
      fluid.project(dt);
      fluid.render(imageReady ? coverMap(img) : null);

      if (now - lastMove > CONFIG.idleMs) {
        fluid.clear();
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (event) => {
      if (event.pointerType === "touch" || lost) return;
      if (pointer.seen) {
        pointer.dx += event.clientX - pointer.x;
        pointer.dy += event.clientY - pointer.y;
        pointer.moved = true;
      }
      pointer.seen = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      lastMove = performance.now();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (!lost) fluid.resize();
    };

    const onLost = (event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("webglcontextlost", onLost);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      img?.removeEventListener("load", loadImage);
      cancelAnimationFrame(frame);
    };
  }, [image]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

export default FluidTrail;
