/**
 * CircularGallery - 3D Infinite Scroll Gallery
 * Native JS implementation with WebGL
 */

(function(global) {
  'use strict';

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function lerp(p1, p2, t) {
    return p1 + (p2 - p1) * t;
  }

  // Vertex Shader
  const vertexShader = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    uniform float uSpeed;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;

  // Fragment Shader
  const fragmentShader = `
    precision highp float;
    uniform vec2 uImageSizes;
    uniform vec2 uPlaneSizes;
    uniform sampler2D tMap;
    uniform float uBorderRadius;
    varying vec2 vUv;
    
    float roundedBoxSDF(vec2 p, vec2 b, float r) {
      vec2 d = abs(p) - b;
      return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
    }
    
    void main() {
      vec2 ratio = vec2(
        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
      );
      vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );
      vec4 color = texture2D(tMap, uv);
      
      float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
      float edgeSmooth = 0.002;
      float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
      
      gl_FragColor = vec4(color.rgb, alpha);
    }
  `;

  // Media class for gallery items
  class Media {
    constructor({ gl, image, index, length, screen, text, viewport, bend = 3, textColor = '#e851ec', borderRadius = 0.05 }) {
      this.extra = 0;
      this.gl = gl;
      this.image = image;
      this.index = index;
      this.length = length;
      this.screen = screen;
      this.text = text;
      this.viewport = viewport;
      this.bend = bend;
      this.textColor = textColor;
      this.borderRadius = borderRadius;
      this.speed = 0;
      this.imageSizes = [1, 1];
      
      this.createGeometry();
      this.createShader();
      this.createMesh();
      this.onResize();
    }

    createGeometry() {
      const widthSegments = 100;
      const heightSegments = 50;
      
      const positions = [];
      const uvs = [];
      const indices = [];
      
      for (let y = 0; y <= heightSegments; y++) {
        for (let x = 0; x <= widthSegments; x++) {
          const u = x / widthSegments;
          const v = y / heightSegments;
          positions.push((u - 0.5) * 2, (v - 0.5) * 2, 0);
          uvs.push(u, v);
        }
      }
      
      for (let y = 0; y < heightSegments; y++) {
        for (let x = 0; x < widthSegments; x++) {
          const a = y * (widthSegments + 1) + x;
          const b = a + 1;
          const c = a + widthSegments + 1;
          const d = c + 1;
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
      
      this.geometry = {
        position: { data: new Float32Array(positions), size: 3 },
        uv: { data: new Float32Array(uvs), size: 2 },
        index: { data: new Uint16Array(indices) }
      };
    }

    createShader() {
      this.texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      
      this.imageObj = new Image();
      this.imageObj.crossOrigin = 'anonymous';
      this.imageObj.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.imageObj);
        this.imageSizes = [this.imageObj.naturalWidth, this.imageObj.naturalHeight];
      };
      this.imageObj.src = this.image;
      
      const vs = this.compileShader(vertexShader, this.gl.VERTEX_SHADER);
      const fs = this.compileShader(fragmentShader, this.gl.FRAGMENT_SHADER);
      
      this.program = this.gl.createProgram();
      this.gl.attachShader(this.program, vs);
      this.gl.attachShader(this.program, fs);
      this.gl.linkProgram(this.program);
      
      this.uniforms = {
        tMap: this.gl.getUniformLocation(this.program, 'tMap'),
        uPlaneSizes: this.gl.getUniformLocation(this.program, 'uPlaneSizes'),
        uImageSizes: this.gl.getUniformLocation(this.program, 'uImageSizes'),
        uSpeed: this.gl.getUniformLocation(this.program, 'uSpeed'),
        uTime: this.gl.getUniformLocation(this.program, 'uTime'),
        uBorderRadius: this.gl.getUniformLocation(this.program, 'uBorderRadius'),
        modelViewMatrix: this.gl.getUniformLocation(this.program, 'modelViewMatrix'),
        projectionMatrix: this.gl.getUniformLocation(this.program, 'projectionMatrix')
      };
      
      this.attributes = {
        position: this.gl.getAttribLocation(this.program, 'position'),
        uv: this.gl.getAttribLocation(this.program, 'uv')
      };
      
      this.positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.geometry.position.data, this.gl.STATIC_DRAW);
      
      this.uvBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.geometry.uv.data, this.gl.STATIC_DRAW);
      
      this.indexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.geometry.index.data, this.gl.STATIC_DRAW);
      
      this.indexCount = this.geometry.index.data.length;
    }

    compileShader(source, type) {
      const shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      return shader;
    }

    createMesh() {
      this.scale = [1, 1, 1];
      this.position = [0, 0, 0];
      this.rotation = [0, 0, 0];
    }

    update(scroll, direction) {
      const x = this.x - scroll.current - this.extra;
      this.position[0] = x;
      
      const H = this.viewport.width / 2;
      
      if (this.bend === 0) {
        this.position[1] = 0;
        this.rotation[2] = 0;
      } else {
        const B_abs = Math.abs(this.bend);
        const R = (H * H + B_abs * B_abs) / (2 * B_abs);
        const effectiveX = Math.min(Math.abs(x), H);
        const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
        
        if (this.bend > 0) {
          this.position[1] = -arc;
          this.rotation[2] = -Math.sign(x) * Math.asin(effectiveX / R);
        } else {
          this.position[1] = arc;
          this.rotation[2] = Math.sign(x) * Math.asin(effectiveX / R);
        }
      }
      
      this.speed = scroll.current - scroll.last;
      
      const planeOffset = this.scale[0] / 2;
      const viewportOffset = this.viewport.width / 2;
      
      this.isBefore = this.position[0] + planeOffset < -viewportOffset;
      this.isAfter = this.position[0] - planeOffset > viewportOffset;
      
      if (direction === 'right' && this.isBefore) {
        this.extra -= this.widthTotal;
      }
      if (direction === 'left' && this.isAfter) {
        this.extra += this.widthTotal;
      }
    }

    render(camera, time) {
      this.gl.useProgram(this.program);
      
      this.gl.uniform1i(this.uniforms.tMap, 0);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      
      this.gl.uniform2f(this.uniforms.uPlaneSizes, this.scale[0], this.scale[1]);
      this.gl.uniform2f(this.uniforms.uImageSizes, this.imageSizes[0], this.imageSizes[1]);
      this.gl.uniform1f(this.uniforms.uSpeed, Math.abs(this.speed) * 0.1);
      this.gl.uniform1f(this.uniforms.uTime, time * 0.001);
      this.gl.uniform1f(this.uniforms.uBorderRadius, this.borderRadius);
      
      const modelViewMatrix = this.calculateModelViewMatrix(camera);
      this.gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, modelViewMatrix);
      this.gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, camera.projectionMatrix);
      
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.enableVertexAttribArray(this.attributes.position);
      this.gl.vertexAttribPointer(this.attributes.position, 3, this.gl.FLOAT, false, 0, 0);
      
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
      this.gl.enableVertexAttribArray(this.attributes.uv);
      this.gl.vertexAttribPointer(this.attributes.uv, 2, this.gl.FLOAT, false, 0, 0);
      
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
    }

    calculateModelViewMatrix(camera) {
      const m = new Float32Array(16);
      const c = camera.viewMatrix;
      
      const tx = this.position[0];
      const ty = this.position[1];
      const tz = this.position[2];
      
      const rz = this.rotation[2];
      const cos = Math.cos(rz);
      const sin = Math.sin(rz);
      
      const sx = this.scale[0] * 0.5;
      const sy = this.scale[1] * 0.5;
      const sz = this.scale[2];
      
      m[0] = cos * sx; m[4] = -sin * sy; m[8] = 0; m[12] = tx;
      m[1] = sin * sx; m[5] = cos * sy; m[9] = 0; m[13] = ty;
      m[2] = 0; m[6] = 0; m[10] = sz; m[14] = tz;
      m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
      
      const result = new Float32Array(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          result[i * 4 + j] = 
            c[i * 4 + 0] * m[0 * 4 + j] +
            c[i * 4 + 1] * m[1 * 4 + j] +
            c[i * 4 + 2] * m[2 * 4 + j] +
            c[i * 4 + 3] * m[3 * 4 + j];
        }
      }
      
      return result;
    }

    onResize({ screen, viewport } = {}) {
      if (screen) this.screen = screen;
      if (viewport) this.viewport = viewport;
      
      const scale = this.screen.height / 1500;
      this.scale[1] = (this.viewport.height * (900 * scale)) / this.screen.height;
      this.scale[0] = (this.viewport.width * (700 * scale)) / this.screen.width;
      
      this.padding = 2;
      this.width = this.scale[0] + this.padding;
      this.widthTotal = this.width * this.length;
      this.x = this.width * this.index;
    }
  }

  // Main CircularGallery class
  class CircularGallery {
    constructor(container, options = {}) {
      this.container = container;
      this.items = options.items || this.getDefaultItems();
      this.bend = options.bend || 3;
      this.textColor = options.textColor || '#e851ec';
      this.borderRadius = options.borderRadius || 0.05;
      this.scrollSpeed = options.scrollSpeed || 2;
      this.scrollEase = options.scrollEase || 0.05;
      
      this.scroll = {
        ease: this.scrollEase,
        current: 0,
        target: 0,
        last: 0
      };
      
      this.time = 0;
      this.isDown = false;
      
      this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
      
      this.init();
    }

    getDefaultItems() {
      return [
        { image: './assets/gallery/0482b6ff-e22e-40e4-bd7d-a1749ff670eb_f416ecde-b6c4-4244-80e2-a227c5929913_0be0948fa288ece317e42f4bf2f42f1c.jpeg', text: 'Selected' },
        { image: './assets/gallery/0a52e2f1-a07b-4f2a-aede-136f959eb23b_103a5f67-b27d-4bc0-8f54-941f140009e7_IMG_4237.jpeg', text: 'Selected' },
        { image: './assets/gallery/1b4bbe26-f10b-4e6c-8975-27a1c7fe71ad_da78c0c3-03cd-4bec-b793-36e64b0a4312_29b54d0e10fb0dbc390573a0c45f79dc.jpeg', text: 'Selected' },
        { image: './assets/gallery/1ba913f6-c0d8-48f5-be67-b7eabda36313_0c147003-dec3-427f-95df-91491c23e087_IMG_3138.jpeg', text: 'Selected' },
        { image: './assets/gallery/21e397d7-b7aa-45c0-a26e-47b6654b134a_2e48ebc3-72c9-4e14-adcd-a5c733c8f1f4_IMG_1668.jpeg', text: 'Selected' },
        { image: './assets/gallery/2a3d882f-8d3e-4f2c-a473-8091c7e1559c_154244b1-a044-4c9f-89af-eb119559e0fa_FullSizeRender.jpeg', text: 'Selected' },
        { image: './assets/gallery/2bfec6f3-2346-4daa-9954-2f512ee2131d_98f929c8-60fd-40b6-b321-ac5b6a5d8840_IMG_3237.jpeg', text: 'Selected' },
        { image: './assets/gallery/333811d9-764f-4167-a989-2ac86e64eee4_9510add2-e2ae-4337-84f0-d3e39e8d8044_IMG_0738.jpeg', text: 'Selected' },
        { image: './assets/gallery/3465b848-820b-47e0-96ab-375c78c8f40b_72d9e178-8756-439b-8420-5b616fc64ee1_2d0dceeaee5ead06df23fc90285cd802.jpeg', text: 'Selected' },
        { image: './assets/gallery/35cf32e9-2605-48d8-8980-98e77988c9f3_bcae3fac-167c-47ff-9ab8-a2ef1f1c699b_IMG_8825.jpeg', text: 'Selected' },
        { image: './assets/gallery/62e39d90-b589-432a-9248-95b110fd6ec5_c39d2320-c4d7-4ccd-aa3f-afc321f1c433_IMG_8820.jpeg', text: 'Selected' },
        { image: './assets/gallery/74ff3a82-10c5-4f94-9d12-361a852acd9b_6de6e975-569b-496c-92a2-7b8249305c60_ad8f118dfe36b75fe9d43d1ff44e7625.jpeg', text: 'Selected' },
        { image: './assets/gallery/842f9f2f-6692-4ec4-c8cb-9cc4af702d68_ea2c2fcd-7b70-46be-8de6-a2774f04732b_IMG_5047.jpeg', text: 'Selected' },
        { image: './assets/gallery/8dc7357d-27ea-47f5-9e76-81d10ca67c64_a6bf5ca5-e90f-4a4f-bd77-f53ac8943709_IMG_4097.jpeg', text: 'Selected' },
        { image: './assets/gallery/9559ab17-ca5e-4bb5-819d-212d7336a601_b3815d8b-36f6-4af3-92c6-1b58f5c66c5a_IMG_6190.jpeg', text: 'Selected' },
        { image: './assets/gallery/bf638ac8-0156-4049-90ab-adc86dec8576_fde4c524-f7a4-4a57-a570-c926ef9add2b_IMG_4427.jpeg', text: 'Selected' },
        { image: './assets/gallery/c8899b7c-b5bd-4ef9-86cb-f893804d758a_e0ae66e8-bd98-4f8b-bf5f-ae4827cf2e1f_389d154ffea68bffd929a0b54acebe96.jpeg', text: 'Selected' },
        { image: './assets/gallery/e1381ab8-cd7e-4bff-98dc-76fde7dc9a86_457273c8-525c-4cd7-9500-fec3592d3fc8_IMG_0487.jpeg', text: 'Selected' },
        { image: './assets/gallery/e6f20bf7-eede-4ac0-bd20-c98d8e2a0ee2_54c3e61d-d9b2-4814-bfa7-abdc1e7953ef_fbbb0ecf38ebf376dadbec7c87ea6b13.jpeg', text: 'Selected' },
        { image: './assets/gallery/fb6e15bb-dcf9-4e43-86a8-aa54bdb069c4_909f868b-e2bd-4e48-97ff-063d1a97ede0_e6fd5f68d77e839a069d506593168421.jpeg', text: 'Selected' }
      ];
    }

    init() {
      this.createCanvas();
      this.createContext();
      this.screen = {
        width: this.container.clientWidth || window.innerWidth,
        height: this.container.clientHeight || 500
      };
      this.viewport = { width: 20, height: 15 };
      this.createCamera();
      this.onResize();
      this.createMedias();
      this.addEventListeners();
      this.update();
    }

    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
      `;
      this.container.appendChild(this.canvas);
    }

    createContext() {
      this.gl = this.canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: false
      });
      
      if (!this.gl) {
        console.error('WebGL not supported');
        return;
      }
      
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.clearColor(0, 0, 0, 0);
    }

    createCamera() {
      this.camera = {
        fov: 45,
        position: [0, 0, 20],
        viewMatrix: new Float32Array([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, -20, 1
        ]),
        projectionMatrix: new Float32Array(16)
      };
      this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
      const fov = this.camera.fov * Math.PI / 180;
      const aspect = this.screen.width / this.screen.height;
      const near = 0.1;
      const far = 1000;
      
      const f = 1.0 / Math.tan(fov / 2);
      const nf = 1 / (near - far);
      
      const m = this.camera.projectionMatrix;
      m[0] = f / aspect; m[1] = 0; m[2] = 0; m[3] = 0;
      m[4] = 0; m[5] = f; m[6] = 0; m[7] = 0;
      m[8] = 0; m[9] = 0; m[10] = (far + near) * nf; m[11] = -1;
      m[12] = 0; m[13] = 0; m[14] = 2 * far * near * nf; m[15] = 0;
    }

    createMedias() {
      const galleryItems = this.items.concat(this.items);
      
      this.medias = galleryItems.map((data, index) => {
        return new Media({
          gl: this.gl,
          image: data.image,
          index,
          length: galleryItems.length,
          screen: this.screen,
          text: data.text,
          viewport: this.viewport,
          bend: this.bend,
          textColor: this.textColor,
          borderRadius: this.borderRadius
        });
      });
    }

    onResize() {
      this.screen = {
        width: this.container.clientWidth,
        height: this.container.clientHeight
      };
      
      this.canvas.width = this.screen.width * Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.height = this.screen.height * Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.style.width = this.screen.width + 'px';
      this.canvas.style.height = this.screen.height + 'px';
      
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      
      const fov = this.camera.fov * Math.PI / 180;
      const height = 2 * Math.tan(fov / 2) * this.camera.position[2];
      const width = height * (this.screen.width / this.screen.height);
      
      this.viewport = { width, height };
      
      this.updateProjectionMatrix();
      
      if (this.medias) {
        this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
      }
    }

    onTouchDown(e) {
      this.isDown = true;
      this.scroll.position = this.scroll.current;
      this.start = e.touches ? e.touches[0].clientX : e.clientX;
    }

    onTouchMove(e) {
      if (!this.isDown) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const distance = (this.start - x) * (this.scrollSpeed * 0.025);
      this.scroll.target = this.scroll.position + distance;
    }

    onTouchUp() {
      this.isDown = false;
      this.onCheck();
    }

    onWheel(e) {
      e.preventDefault();
      const delta = e.deltaY || e.wheelDelta || e.detail;
      this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.5;
      this.onCheckDebounce();
    }

    onCheck() {
      if (!this.medias || !this.medias[0]) return;
      const width = this.medias[0].width;
      const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
      const item = width * itemIndex;
      this.scroll.target = this.scroll.target < 0 ? -item : item;
    }

    update() {
      this.time += 16;
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
      
      const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
      
      if (this.medias) {
        this.medias.forEach(media => media.update(this.scroll, direction));
      }
      
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      
      if (this.medias) {
        this.medias.forEach(media => media.render(this.camera, this.time));
      }
      
      this.scroll.last = this.scroll.current;
      this.raf = requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
      this.boundOnResize = this.onResize.bind(this);
      this.boundOnWheel = this.onWheel.bind(this);
      this.boundOnTouchDown = this.onTouchDown.bind(this);
      this.boundOnTouchMove = this.onTouchMove.bind(this);
      this.boundOnTouchUp = this.onTouchUp.bind(this);
      
      window.addEventListener('resize', this.boundOnResize);
      this.container.addEventListener('wheel', this.boundOnWheel, { passive: false });
      this.container.addEventListener('mousedown', this.boundOnTouchDown);
      window.addEventListener('mousemove', this.boundOnTouchMove);
      window.addEventListener('mouseup', this.boundOnTouchUp);
      this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
      this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
      window.addEventListener('touchend', this.boundOnTouchUp);
    }

    destroy() {
      cancelAnimationFrame(this.raf);
      window.removeEventListener('resize', this.boundOnResize);
      this.container.removeEventListener('wheel', this.boundOnWheel);
      this.container.removeEventListener('mousedown', this.boundOnTouchDown);
      window.removeEventListener('mousemove', this.boundOnTouchMove);
      window.removeEventListener('mouseup', this.boundOnTouchUp);
      this.container.removeEventListener('touchstart', this.boundOnTouchDown);
      this.container.removeEventListener('touchmove', this.boundOnTouchMove);
      window.removeEventListener('touchend', this.boundOnTouchUp);
      
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  global.CircularGallery = CircularGallery;

})(window);
