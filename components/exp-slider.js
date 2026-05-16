/**
 * Experience Slider - 水平滑动卡片
 * Clean, no flicker, touch/mouse friendly
 */
(function(global) {
  'use strict';

  class ExpSlider {
    constructor(container, options = {}) {
      this.container = container;
      this.opts = Object.assign({
        gap: 24,
        peek: 60,        // 两侧露出多少 px
        scale: 0.88,     // 两侧卡片缩放
        opacity: 0.5     // 两侧卡片透明度
      }, options);

      this.track = container.querySelector('.exp-slider-track');
      this.cards = [];
      this.current = 0;
      this.isDragging = false;
      this.startX = 0;
      this.scrollLeft = 0;

      this.init();
    }

    init() {
      this.cards = Array.from(this.track.children);
      this.bindEvents();
      this.updateLayout();
      this.goTo(0, false);
    }

    bindEvents() {
      // Mouse
      this.track.addEventListener('mousedown', this.onStart.bind(this));
      window.addEventListener('mousemove', this.onMove.bind(this));
      window.addEventListener('mouseup', this.onEnd.bind(this));

      // Touch
      this.track.addEventListener('touchstart', this.onStart.bind(this), { passive: true });
      window.addEventListener('touchmove', this.onMove.bind(this), { passive: true });
      window.addEventListener('touchend', this.onEnd.bind(this));

      // Wheel -> horizontal scroll
      this.container.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

      // Resize
      window.addEventListener('resize', () => { this.updateLayout(); this.goTo(this.current, false); });

      // Dots
      const dots = this.container.querySelectorAll('.exp-dot');
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => this.goTo(i));
      });
    }

    updateLayout() {
      const containerW = this.container.clientWidth;
      const cardW = containerW - this.opts.peek * 2;
      this.cards.forEach(c => {
        c.style.width = cardW + 'px';
        c.style.flexShrink = '0';
      });
      this.track.style.gap = this.opts.gap + 'px';
    }

    onStart(e) {
      this.isDragging = true;
      this.startX = (e.touches ? e.touches[0].clientX : e.clientX);
      this.scrollLeft = this.current; // store index
      this.track.style.cursor = 'grabbing';
    }

    onMove(e) {
      if (!this.isDragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      const diff = this.startX - x;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && this.current < this.cards.length - 1) {
          this.goTo(this.current + 1);
          this.isDragging = false;
        } else if (diff < 0 && this.current > 0) {
          this.goTo(this.current - 1);
          this.isDragging = false;
        }
      }
    }

    onEnd() {
      this.isDragging = false;
      this.track.style.cursor = 'grab';
    }

    onWheel(e) {
      e.preventDefault();
      if (e.deltaY > 0 && this.current < this.cards.length - 1) {
        this.goTo(this.current + 1);
      } else if (e.deltaY < 0 && this.current > 0) {
        this.goTo(this.current - 1);
      }
    }

    goTo(index, animate = true) {
      if (index < 0 || index >= this.cards.length) return;
      this.current = index;

      const cardW = this.cards[0].offsetWidth + this.opts.gap;
      const offset = index * cardW;

      this.track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
      this.track.style.transform = 'translateX(-' + offset + 'px)';

      // Visual states
      this.cards.forEach((c, i) => {
        const dist = Math.abs(i - index);
        const isActive = i === index;

        c.style.transform = isActive ? 'scale(1)' : 'scale(' + this.opts.scale + ')';
        c.style.opacity = isActive ? '1' : String(this.opts.opacity);
        c.style.zIndex = isActive ? '10' : String(10 - dist);
        c.classList.toggle('is-active', isActive);
      });

      // Update dots
      const dots = this.container.querySelectorAll('.exp-dot');
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));

      // Update counter
      const counter = this.container.querySelector('.exp-counter');
      if (counter) counter.textContent = (index + 1) + ' / ' + this.cards.length;
    }
  }

  global.ExpSlider = ExpSlider;
})(window);
