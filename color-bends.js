/**
 * ColorBends WebGL Fluid Effect - Vanilla JS Version
 * Adapted from React component for pure HTML/CSS/JS projects
 * Theme color: #e851ec (matches --accent)
 */

(function() {
  'use strict';

  const MAX_COLORS = 8;

  const fragShader = `
    #define MAX_COLORS ${MAX_COLORS}
    uniform vec2 uCanvas;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec2 uRot;
    uniform int uColorCount;
    uniform vec3 uColors[MAX_COLORS];
    uniform int uTransparent;
    uniform float uScale;
    uniform float uFrequency;
    uniform float uWarpStrength;
    uniform vec2 uPointer;
    uniform float uMouseInfluence;
    uniform float uParallax;
    uniform float uNoise;
    uniform int uIterations;
    uniform float uIntensity;
    uniform float uBandWidth;
    varying vec2 vUv;

    void main() {
      float t = uTime * uSpeed;
      vec2 p = vUv * 2.0 - 1.0;
      p += uPointer * uParallax * 0.1;
      vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
      vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
      q /= max(uScale, 0.0001);
      q /= 0.5 + 0.2 * dot(q, q);
      q += 0.2 * cos(t) - 7.56;
      vec2 toward = (uPointer - rp);
      q += toward * uMouseInfluence * 0.2;

      for (int j = 0; j < 5; j++) {
        if (j >= uIterations - 1) break;
        vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
        q += (rr - q) * 0.15;
      }

      vec3 col = vec3(0.0);
      float a = 1.0;

      if (uColorCount > 0) {
        vec2 s = q;
        vec3 sumCol = vec3(0.0);
        float cover = 0.0;
        for (int i = 0; i < MAX_COLORS; ++i) {
          if (i >= uColorCount) break;
          s -= 0.01;
          vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
          float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float kBelow = clamp(uWarpStrength, 0.0, 1.0);
          float kMix = pow(kBelow, 0.3);
          float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
          vec2 disp = (r - s) * kBelow;
          vec2 warped = s + disp * gain;
          float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float m = mix(m0, m1, kMix);
          float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
          sumCol += uColors[i] * w;
          cover = max(cover, w);
        }
        col = clamp(sumCol, 0.0, 1.0);
        a = uTransparent > 0 ? cover : 1.0;
      } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
          s -= 0.01;
          vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
          float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
          float kBelow = clamp(uWarpStrength, 0.0, 1.0);
          float kMix = pow(kBelow, 0.3);
          float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
          vec2 disp = (r - s) * kBelow;
          vec2 warped = s + disp * gain;
          float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
          float m = mix(m0, m1, kMix);
          col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
      }

      col *= uIntensity;

      if (uNoise > 0.0001) {
        float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);
      }

      vec3 rgb = (uTransparent > 0) ? col * a : col;
      gl_FragColor = vec4(rgb, a);
    }
  `;

  const vertShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  class ColorBends {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.error('ColorBends: Container not found');
        return;
      }

      this.options = {
        rotation: options.rotation ?? 90,
        speed: options.speed ?? 0.2,
        colors: options.colors ?? ['#e851ec', '#ff6b9d', '#c084fc', '#f472b6'],
        transparent: options.transparent ?? true,
        autoRotate: options.autoRotate ?? 0,
        scale: options.scale ?? 1,
        frequency: options.frequency ?? 1,
        warpStrength: options.warpStrength ?? 1,
        mouseInfluence: options.mouseInfluence ?? 1,
        parallax: options.parallax ?? 0.5,
        noise: options.noise ?? 0.15,
        iterations: options.iterations ?? 1,
        intensity: options.intensity ?? 1.5,
        bandWidth: options.bandWidth ?? 6,
        ...options
      };

      this.rafId = null;
      this.resizeObserver = null;
      this.rotationRef = this.options.rotation;
      this.autoRotateRef = this.options.autoRotate;
      this.pointerTarget = new THREE.Vector2(0, 0);
      this.pointerCurrent = new THREE.Vector2(0, 0);
      this.pointerSmooth = 8;

      this.init();
    }

    init() {
      if (typeof THREE === 'undefined') {
        console.error('ColorBends: Three.js is required');
        return;
      }

      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      this.geometry = new THREE.PlaneGeometry(2, 2);
      
      const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
      
      this.material = new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        uniforms: {
          uCanvas: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uSpeed: { value: this.options.speed },
          uRot: { value: new THREE.Vector2(1, 0) },
          uColorCount: { value: 0 },
          uColors: { value: uColorsArray },
          uTransparent: { value: this.options.transparent ? 1 : 0 },
          uScale: { value: this.options.scale },
          uFrequency: { value: this.options.frequency },
          uWarpStrength: { value: this.options.warpStrength },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: this.options.mouseInfluence },
          uParallax: { value: this.options.parallax },
          uNoise: { value: this.options.noise },
          uIterations: { value: this.options.iterations },
          uIntensity: { value: this.options.intensity },
          uBandWidth: { value: this.options.bandWidth }
        },
        premultipliedAlpha: true,
        transparent: true
      });

      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);

      try {
        this.renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true
        });
      } catch(e) {
        console.error('ColorBends: WebGLRenderer creation failed', e);
        return;
      }
      
      // Compatible with both old (r128) and new Three.js versions
      if (this.renderer.outputColorSpace !== undefined) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      } else if (this.renderer.outputEncoding !== undefined) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setClearColor(0x000000, this.options.transparent ? 0 : 1);
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.display = 'block';
      
      this.container.appendChild(this.renderer.domElement);

      this.clock = new THREE.Clock();

      this.updateColors(this.options.colors);
      this.handleResize();
      this.setupEventListeners();
      this.animate();
    }

    updateColors(colors) {
      const toVec3 = (hex) => {
        const h = hex.replace('#', '').trim();
        const v = h.length === 3
          ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
          : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
        return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
      };

      const arr = (colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
      for (let i = 0; i < MAX_COLORS; i++) {
        const vec = this.material.uniforms.uColors.value[i];
        if (i < arr.length) vec.copy(arr[i]);
        else vec.set(0, 0, 0);
      }
      this.material.uniforms.uColorCount.value = arr.length;
    }

    handleResize() {
      const w = this.container.clientWidth || 1;
      const h = this.container.clientHeight || 1;
      this.renderer.setSize(w, h, false);
      this.material.uniforms.uCanvas.value.set(w, h);
    }

    setupEventListeners() {
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.container);
      } else {
        window.addEventListener('resize', () => this.handleResize());
      }

      this.handlePointerMove = (e) => {
        const rect = this.container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
        const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
        this.pointerTarget.set(x, y);
      };

      this.container.addEventListener('pointermove', this.handlePointerMove);
    }

    animate() {
      const dt = this.clock.getDelta();
      const elapsed = this.clock.elapsedTime;
      
      this.material.uniforms.uTime.value = elapsed;

      const deg = (this.rotationRef % 360) + this.autoRotateRef * elapsed;
      const rad = (deg * Math.PI) / 180;
      this.material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));

      const amt = Math.min(1, dt * this.pointerSmooth);
      this.pointerCurrent.lerp(this.pointerTarget, amt);
      this.material.uniforms.uPointer.value.copy(this.pointerCurrent);

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(() => this.animate());
    }

    updateOptions(newOptions) {
      Object.assign(this.options, newOptions);
      
      if (newOptions.rotation !== undefined) this.rotationRef = newOptions.rotation;
      if (newOptions.autoRotate !== undefined) this.autoRotateRef = newOptions.autoRotate;
      if (newOptions.speed !== undefined) this.material.uniforms.uSpeed.value = newOptions.speed;
      if (newOptions.scale !== undefined) this.material.uniforms.uScale.value = newOptions.scale;
      if (newOptions.frequency !== undefined) this.material.uniforms.uFrequency.value = newOptions.frequency;
      if (newOptions.warpStrength !== undefined) this.material.uniforms.uWarpStrength.value = newOptions.warpStrength;
      if (newOptions.mouseInfluence !== undefined) this.material.uniforms.uMouseInfluence.value = newOptions.mouseInfluence;
      if (newOptions.parallax !== undefined) this.material.uniforms.uParallax.value = newOptions.parallax;
      if (newOptions.noise !== undefined) this.material.uniforms.uNoise.value = newOptions.noise;
      if (newOptions.iterations !== undefined) this.material.uniforms.uIterations.value = newOptions.iterations;
      if (newOptions.intensity !== undefined) this.material.uniforms.uIntensity.value = newOptions.intensity;
      if (newOptions.bandWidth !== undefined) this.material.uniforms.uBandWidth.value = newOptions.bandWidth;
      if (newOptions.colors !== undefined) this.updateColors(newOptions.colors);
      if (newOptions.transparent !== undefined) {
        this.material.uniforms.uTransparent.value = newOptions.transparent ? 1 : 0;
        this.renderer.setClearColor(0x000000, newOptions.transparent ? 0 : 1);
      }
    }

    destroy() {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      if (this.resizeObserver) this.resizeObserver.disconnect();
      this.container.removeEventListener('pointermove', this.handlePointerMove);
      
      this.geometry.dispose();
      this.material.dispose();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      
      if (this.renderer.domElement && this.renderer.domElement.parentElement === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }

  window.ColorBends = ColorBends;
})();
