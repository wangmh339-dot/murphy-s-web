/* 全站交互：自定义光标、磁吸、页面淡入淡出、基础动画、Work 筛选与项目详情渲染 */

function qs(sel, root = document) {
  return root.querySelector(sel);
}
function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initYear() {
  const y = qs("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function initCursor() {
  const cursor = qs("#cursor");
  if (!cursor) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;
  let raf = null;

  const tick = () => {
    // 轻微拖动感：比跟手慢一点，但不“黏”
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    raf = requestAnimationFrame(tick);
  };

  const onMove = (e) => {
    tx = e.clientX;
    ty = e.clientY;
  };

  // 进入页面就启动（避免看起来“不跟随”）
  cursor.style.opacity = "1";
  raf = requestAnimationFrame(tick);

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", () => (cursor.style.opacity = "0"), { passive: true });

  const hoverables = () => qsa("[data-cursor='hover']");
  const onEnter = () => cursor.classList.add("isHover");
  const onLeave = () => cursor.classList.remove("isHover");

  // 在内容变动后也能绑定
  const bindHover = () => {
    hoverables().forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
  };

  bindHover();
  // 暴露给 work 刷新列表后调用
  window.__bindCursorHover = bindHover;
}

function initNameCapsuleMotion() {
  const page = document.body.dataset.page;
  if (page !== "home") return;
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (prefersReducedMotion()) return;

  const capsule = qs("#nameCapsule");
  if (!capsule) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let raf = null;
  let tx = 0;
  let ty = 0;
  let ts = 0;

  const tick = () => {
    document.documentElement.style.setProperty("--nameX", String(tx));
    document.documentElement.style.setProperty("--nameY", String(ty));
    document.documentElement.style.setProperty("--nameS", String(ts));
    raf = null;
  };

  const onMove = (e) => {
    const r = capsule.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    tx = clamp(dx * 0.03, -18, 18);
    ty = clamp(dy * 0.03, -14, 14);
    ts = clamp(Math.abs(dx) + Math.abs(dy), 0, 90);
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener("mousemove", onMove, { passive: true });
}

function initNameMarqueeStart() {
  // 进入页面后缓慢开始触发循环滚动
  const page = document.body.dataset.page;
  if (page !== "home") return;
  if (prefersReducedMotion()) return;
  window.setTimeout(() => {
    document.body.classList.add("isMarqueeOn");
  }, 650);
}

function initAboutPhotoBalance() {
  const page = document.body.dataset.page;
  if (page !== "home") return;

  const wrap = qs(".avatarWrap");
  const textCard = qs(".aboutText.card");
  if (!wrap || !textCard) return;
  const imgs = qsa("img.avatarImg", wrap);
  if (imgs.length < 2) return;

  const apply = () => {
    // 让左侧图片区块总高度 = 右侧文字卡片高度
    const h = Math.round(textCard.getBoundingClientRect().height);
    if (!h || h < 200) return;
    wrap.style.height = `${h}px`;

    // 两张图平分高度（保留分割线 1px）
    const divider = 1;
    const each = Math.max(120, Math.floor((h - divider) / 2));
    imgs.forEach((img) => {
      img.style.height = `${each}px`;
    });
  };

  // 初次与字体加载后各算一次，避免字体载入导致高度变化
  requestAnimationFrame(apply);
  window.setTimeout(apply, 350);
  window.setTimeout(apply, 900);

  let t = null;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(t);
      t = window.setTimeout(apply, 120);
    },
    { passive: true }
  );
}

function initAvatarTilt() {
  const page = document.body.dataset.page;
  if (page !== "home") return;
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (prefersReducedMotion()) return;

  const wrap = qs(".avatarWrap");
  const tilt = qs(".avatarTilt", wrap || document);
  if (!wrap || !tilt) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let raf = null;
  let rx = 0;
  let ry = 0;
  let trx = 0;
  let tryy = 0;

  const tick = () => {
    rx += (trx - rx) * 0.18;
    ry += (tryy - ry) * 0.18;
    tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    raf = requestAnimationFrame(tick);
  };

  const onMove = (e) => {
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);

    // 再加大约 15%
    tryy = clamp(dx * 8.6, -10, 10); // rotateY
    trx = clamp(-dy * 6.9, -8, 8);   // rotateX
  };

  const onEnter = () => {
    wrap.classList.add("isTilting");
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const onLeave = () => {
    wrap.classList.remove("isTilting");
    trx = 0;
    tryy = 0;
    window.setTimeout(() => {
      if (Math.abs(rx) < 0.05 && Math.abs(ry) < 0.05) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, 280);
  };

  wrap.addEventListener("mouseenter", onEnter);
  wrap.addEventListener("mouseleave", onLeave);
  wrap.addEventListener("mousemove", onMove);
}

function initHomeScrollBridge() {
  const page = document.body.dataset.page;
  if (page !== "home") return;
  if (prefersReducedMotion()) return;

  const projects = qs("#projects");
  if (!projects) return;
  document.body.classList.add("hasBridge");

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let raf = null;

  const update = () => {
    raf = null;
    const vh = window.innerHeight || 1;
    const top = projects.getBoundingClientRect().top;
    // Projects 从屏幕底部进入到 1/4 高度的过程：0 -> 1
    const p = 1 - clamp((top - vh * 0.25) / (vh * 0.75), 0, 1);
    document.body.style.setProperty("--bridge", p.toFixed(3));
  };

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

function initMagnetism() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (prefersReducedMotion()) return;

  qsa(".magnetic").forEach((el) => {
    const strength = 18;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(mx / r.width) * strength}px, ${(my / r.height) * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });
}

function initPageFade() {
  const fade = qs("#pageFade");
  if (!fade) return;

  // 初次进入：确保为透明
  fade.classList.remove("isOn");

  // 同站导航：淡出后再跳转
  qsa("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#")) return;
    if (href.startsWith("mailto:") || href.startsWith("http") || href === "#") return;
    a.addEventListener("click", (e) => {
      // 允许新标签打开
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      fade.classList.add("isOn");
      window.setTimeout(() => (window.location.href = href), 260);
    });
  });
}

function revealHeroLines() {
  const lines = qsa(".heroTitle .line");
  if (!lines.length) return;
  const play = () => {
    if (lines.some((l) => l.dataset.played === "1")) return;
    if (prefersReducedMotion()) {
      lines.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "none";
        l.dataset.played = "1";
      });
      return;
    }
    lines.forEach((l, i) => {
      window.setTimeout(() => {
        l.style.transition = "opacity .55s ease, transform .55s ease";
        l.style.opacity = "1";
        l.style.transform = "translateY(0)";
        l.dataset.played = "1";
      }, 90 + i * 110);
    });
  };
  return play;
}

function initScrollReveals() {
  // 首页：名字动效滚动触发 + feed 区块淡入
  const page = document.body.dataset.page;
  if (prefersReducedMotion()) {
    qsa("[data-animate]").forEach((el) => el.classList.add("isIn"));
    const play = revealHeroLines();
    if (typeof play === "function") play();
    return;
  }

  const els = qsa("[data-animate]");
  if (!els.length) {
    const play = revealHeroLines();
    if (typeof play === "function") play();
    return;
  }

  const playHero = revealHeroLines();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("isIn");
        
        // 触发文字逐字动画
        initCharAnimation(el);
        
        if (page === "home" && el.dataset.animate === "hero") {
          if (typeof playHero === "function") playHero();
        }
        io.unobserve(el);
      });
    },
    { threshold: 0.22 }
  );

  els.forEach((el) => io.observe(el));
}

// 文字逐字动画
function initCharAnimation(section) {
  const title = qs(".sectionTitle span:first-child", section);
  if (!title || title.dataset.animated) return;
  
  const text = title.textContent;
  title.dataset.animated = "1";
  title.innerHTML = text.split("").map((char, i) => 
    `<span class="char" style="animation-delay: ${i * 0.05}s">${char === " " ? "&nbsp;" : char}</span>`
  ).join("");
}

// 滚动进度条
function initScrollProgress() {
  const progress = document.createElement("div");
  progress.className = "scrollProgress";
  progress.id = "scrollProgress";
  document.body.appendChild(progress);
  
  let raf = null;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);
    document.documentElement.style.setProperty("--scroll-progress", progress);
    const bar = qs("#scrollProgress");
    if (bar) bar.style.transform = `scaleX(${progress})`;
    raf = null;
  };
  
  window.addEventListener("scroll", () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
  
  update();
}

// 视差滚动效果 - Projects 到 About 之间
function initParallaxScroll() {
  const page = document.body.dataset.page;
  if (page !== "home") return;
  if (prefersReducedMotion()) return;
  
  const projects = qs("#projects");
  const about = qs("#about");
  if (!projects || !about) return;
  
  let raf = null;
  let lastScrollY = 0;
  
  const update = () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    
    // Projects 视差 - 移动速度较慢
    const projectsRect = projects.getBoundingClientRect();
    if (projectsRect.top < vh && projectsRect.bottom > 0) {
      const projectsOffset = (scrollY * 0.05);
      projects.style.transform = `translateY(${projectsOffset}px)`;
    }
    
    // About 视差 - 移动速度更慢，创造层次感
    const aboutRect = about.getBoundingClientRect();
    if (aboutRect.top < vh && aboutRect.bottom > 0) {
      const aboutOffset = (scrollY * 0.03);
      about.style.transform = `translateY(${aboutOffset}px)`;
    }
    
    lastScrollY = scrollY;
    raf = null;
  };
  
  window.addEventListener("scroll", () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
  
  update();
}

// 3D 倾斜跟随鼠标效果
function init3DTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (prefersReducedMotion()) return;
  
  const tiles = qsa(".tile");
  tiles.forEach((tile) => {
    const onMove = (e) => {
      const r = tile.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      
      tile.style.transform = `
        translateY(-8px) 
        rotateX(${-y * 15}deg) 
        rotateY(${x * 15}deg) 
        scale(1.02)
      `;
    };
    
    const onLeave = () => {
      tile.style.transform = "";
    };
    
    tile.addEventListener("mousemove", onMove);
    tile.addEventListener("mouseleave", onLeave);
  });
}

// 增强的磁性吸附效果
function initEnhancedMagnetism() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (prefersReducedMotion()) return;
  
  qsa(".magnetic").forEach((el) => {
    const strength = 28; // 增强吸附力度
    const rotateStrength = 8; // 旋转强度
    
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const mx = e.clientX - cx;
      const my = e.clientY - cy;
      
      const distance = Math.sqrt(mx * mx + my * my);
      const maxDistance = Math.max(r.width, r.height);
      
      if (distance < maxDistance * 1.5) {
        const factor = 1 - (distance / (maxDistance * 1.5));
        const tx = (mx / r.width) * strength * factor;
        const ty = (my / r.height) * strength * factor;
        const rx = (-my / r.height) * rotateStrength * factor;
        const ry = (mx / r.width) * rotateStrength * factor;
        
        el.style.transform = `
          translate(${tx}px, ${ty}px) 
          rotateX(${rx}deg) 
          rotateY(${ry}deg)
        `;
      }
    };
    
    const onLeave = () => {
      el.style.transform = "";
    };
    
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });
}

function buildCategories(projects) {
  const map = new Map();
  projects.forEach((p) => {
    const key = p.category || "other";
    map.set(key, (map.get(key) || 0) + 1);
  });
  const order = ["product", "design", "visual", "notes", "lab", "other"];
  const result = [];
  order
    .forEach((k) => {
      if (map.has(k)) result.push({ key: k, label: k, count: map.get(k) });
    });
  // 追加未在 order 的分类
  Array.from(map.keys())
    .filter((k) => !order.includes(k))
    .forEach((k) => result.push({ key: k, label: k, count: map.get(k) }));
  return result;
}

function stackedLetters(text) {
  const safe = String(text || "").toLowerCase();
  return safe
    .split("")
    .map((ch) => `<span>${ch === " " ? "&nbsp;" : ch}</span>`)
    .join("");
}

function categoryLabel(key) {
  const map = {
    product: "Product",
    design: "Design",
    visual: "Visual",
    notes: "Notes",
    lab: "Lab"
  };
  return map[key] || key;
}

function initHomeWorkCats() {
  const page = document.body.dataset.page;
  if (page !== "home") return;
  // deprecated: 首页已直接嵌入 Projects（见 initHomeProjectsEmbed）
}

function initHomeProjectsEmbed() {
  const page = document.body.dataset.page;
  if (page !== "home") return;
  const filterWrap = qs("#homeFilters");
  const listWrap = qs("#homeWorkList");
  if (!filterWrap || !listWrap) return;
  const split = listWrap.closest(".projectsSplit");

  const projects = (window.PROJECTS || []).slice();
  const categories = buildCategories(projects);
  let active = categories[0]?.key || "";
  let lockedKey = null;
  let activeRow = 1;

  const setListVisible = (on) => {
    if (!split) return;
    if (window.matchMedia("(max-width: 980px)").matches) {
      split.classList.add("isListOn");
      return;
    }
    split.classList.toggle("isListOn", !!on);
  };

  const setListRow = (key) => {
    // 桌面端：让右侧项目列表与当前类别所在行对齐
    if (window.matchMedia("(max-width: 980px)").matches) return;
    const idx = categories.findIndex((c) => String(c.key) === String(key));
    const rowStart = Math.max(1, idx + 1);
    activeRow = rowStart;
    listWrap.style.gridRowStart = String(activeRow);
  };

  const updateButtons = () => {
    qsa(".catBtn", filterWrap).forEach((b) => {
      const k = b.dataset.key || "all";
      b.setAttribute("aria-pressed", k === active ? "true" : "false");
    });
  };

  const renderFilters = () => {
    filterWrap.innerHTML = categories
      .map((c) => {
        const word = c.key === "all" ? "ALL" : String(categoryLabel(c.key)).toUpperCase();
        return `
          <button class="catBtn magnetic" type="button" data-key="${c.key}" aria-pressed="${c.key === active}">
            <span class="catWord">${escapeHtml(word)}</span>
            <span class="catCount">(${c.count})</span>
          </button>
        `;
      })
      .join("");

    qsa(".catBtn", filterWrap).forEach((btn) => {
      const key = btn.dataset.key || "all";

      // hover 即切换分类（不需要点击）
      btn.addEventListener("mouseenter", () => {
        if (lockedKey) return;
        active = key;
        updateButtons();
        setListRow(active);
        setListVisible(true);
        renderList();
      });

      // 键盘可用
      btn.addEventListener("focus", () => {
        if (lockedKey) return;
        active = key;
        updateButtons();
        setListRow(active);
        setListVisible(true);
        renderList();
      });

      // 点击：锁定/解除锁定（可选操作）
      btn.addEventListener("click", () => {
        if (lockedKey === key) {
          lockedKey = null;
          active = "all";
        } else {
          lockedKey = key;
          active = key;
        }
        updateButtons();
        setListRow(active);
        setListVisible(true);
        renderList();
      });
    });

    // 鼠标离开分类区：未锁定则回到 ALL
    filterWrap.addEventListener("mouseleave", () => {
      if (lockedKey) return;
      active = categories[0]?.key || active;
      updateButtons();
      setListRow(active);
      // 你的需求：不 hover 的时候右侧列表隐藏
      setListVisible(false);
      renderList();
    });
  };

  const renderList = () => {
    const filtered =
      active === "all" ? projects : projects.filter((p) => String(p.category || "") === String(active));

    // 你的需求：不在 feed 里显示卡片图；而是在鼠标旁边出现图片预览
    if (!prefersReducedMotion()) listWrap.classList.add("isSwitching");
    window.setTimeout(
      () => {
    listWrap.innerHTML = filtered
      .map((p) => {
        const sub = [p.year, p.category].filter(Boolean).join(" · ");
        const preview = p.preview ? String(p.preview) : "";
        return `
          <div class="workItem">
            <a
              class="workLink magnetic"
              data-cursor="hover"
              data-preview="${escapeAttr(preview)}"
              data-cap="${escapeAttr(p.title)}"
              href="./project.html?id=${encodeURIComponent(p.id)}"
            >
              <div class="workTitle">${escapeHtml(p.title)}</div>
            </a>
            <div class="workRight">
              <div class="workMeta">${escapeHtml(sub)}</div>
              <div class="workArrow" aria-hidden="true">↗</div>
            </div>
          </div>
        `;
      })
      .join("");

        if (!prefersReducedMotion()) listWrap.classList.remove("isSwitching");
        initMagnetism();
        if (window.__bindCursorHover) window.__bindCursorHover();
        initHoverPreviewForLinks(listWrap);
      },
      prefersReducedMotion() ? 0 : 120
    );
  };

  renderFilters();
  updateButtons();
  setListRow(active);
  setListVisible(false);
  renderList();
}

function initWorkPage() {
  const page = document.body.dataset.page;
  if (page !== "work") return;
  const projects = (window.PROJECTS || []).slice();
  const filterWrap = qs("#filters");
  const listWrap = qs("#workList");
  if (!filterWrap || !listWrap) return;
  const split = listWrap.closest(".projectsSplit");

  const categories = buildCategories(projects);
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("category");
  let active = preselect && categories.some((c) => c.key === preselect) ? preselect : categories[0]?.key || "";
  let lockedKey = preselect && categories.some((c) => c.key === preselect) ? preselect : null;
  let activeRow = 1;

  const setListVisible = (on) => {
    if (!split) return;
    if (window.matchMedia("(max-width: 980px)").matches) {
      split.classList.add("isListOn");
      return;
    }
    split.classList.toggle("isListOn", !!on);
  };

  const setListRow = (key) => {
    if (window.matchMedia("(max-width: 980px)").matches) return;
    const idx = categories.findIndex((c) => String(c.key) === String(key));
    const rowStart = Math.max(1, idx + 1);
    activeRow = rowStart;
    listWrap.style.gridRowStart = String(activeRow);
  };

  const updateButtons = () => {
    qsa(".catBtn", filterWrap).forEach((b) => {
      const k = b.dataset.key || "all";
      b.setAttribute("aria-pressed", k === active ? "true" : "false");
    });
  };

  const renderFilters = () => {
    filterWrap.innerHTML = categories
      .map(
        (c) => {
          const word = c.key === "all" ? "ALL" : String(categoryLabel(c.key)).toUpperCase();
          return `
            <button class="catBtn magnetic" type="button" data-key="${c.key}" aria-pressed="${c.key === active}">
              <span class="catWord">${escapeHtml(word)}</span>
              <span class="catCount">(${c.count})</span>
            </button>
          `;
        }
      )
      .join("");

    qsa(".catBtn", filterWrap).forEach((btn) => {
      const key = btn.dataset.key || "all";

      btn.addEventListener("mouseenter", () => {
        if (lockedKey) return;
        active = key;
        updateButtons();
        setListRow(active);
        setListVisible(true);
        renderList();
      });

      btn.addEventListener("focus", () => {
        if (lockedKey) return;
        active = key;
        updateButtons();
        setListRow(active);
        setListVisible(true);
        renderList();
      });

      btn.addEventListener("click", () => {
        if (lockedKey === key) {
          lockedKey = null;
          active = "all";
        } else {
          lockedKey = key;
          active = key;
        }
        updateButtons();
        setListRow(active);
        setListVisible(true);
        renderList();
        // 让磁吸在新按钮上生效
        initMagnetism();
        if (window.__bindCursorHover) window.__bindCursorHover();
      });
    });

    filterWrap.addEventListener("mouseleave", () => {
      if (lockedKey) return;
      active = categories[0]?.key || active;
      updateButtons();
      setListRow(active);
      setListVisible(false);
      renderList();
    });
  };

  const renderList = () => {
    const filtered =
      active === "all" ? projects : projects.filter((p) => String(p.category || "") === String(active));

    // 小动画：先淡出再替换
    if (!prefersReducedMotion()) {
      listWrap.style.transition = "opacity .18s ease";
      listWrap.style.opacity = "0";
    }

    window.setTimeout(() => {
      listWrap.innerHTML = filtered
        .map((p) => {
          const sub = [p.year, p.category].filter(Boolean).join(" · ");
          const preview = p.preview ? String(p.preview) : "";
          return `
            <div class="workItem">
              <a
                class="workLink magnetic"
                data-cursor="hover"
                data-preview="${escapeAttr(preview)}"
                data-cap="${escapeAttr(p.title)}"
                href="./project.html?id=${encodeURIComponent(p.id)}"
              >
                <div class="workTitle">${escapeHtml(p.title)}</div>
              </a>
              <div class="workRight">
                <div class="workMeta">${escapeHtml(sub)}</div>
                <div class="workArrow" aria-hidden="true">↗</div>
              </div>
            </div>
          `;
        })
        .join("");

      if (!prefersReducedMotion()) {
        listWrap.style.opacity = "1";
      }

      initMagnetism();
      if (window.__bindCursorHover) window.__bindCursorHover();
      initHoverPreviewForLinks(listWrap);
    }, prefersReducedMotion() ? 0 : 120);
  };

  renderFilters();
  updateButtons();
  setListRow(active);
  setListVisible(!!lockedKey); // 有预选分类则默认显示，否则等 hover 再显示
  renderList();
}

function initHoverPreviewForLinks(root) {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const page = document.body.dataset.page;
  if (page !== "work" && page !== "home") return;
  const preview = qs("#hoverPreview");
  if (!preview) return;

  if (!preview.dataset.ready) {
    // 浮层只负责图片预览；标题改为在当前 work 单项下方显示
    preview.innerHTML = `<div class="img"></div>`;
    preview.dataset.ready = "1";
  }
  const img = qs(".img", preview);
  
  // 使用 WeakMap 存储每个元素的状态，避免内存泄漏
  const elementState = new WeakMap();

  let tx = 0;
  let ty = 0;
  let raf = null;

  const move = () => {
    preview.style.left = `${tx}px`;
    preview.style.top = `${ty}px`;
    raf = null;
  };

  const onMove = (e) => {
    tx = e.clientX + 22;
    ty = e.clientY + 22;
    if (!raf) raf = requestAnimationFrame(move);
  };

  const show = (el) => {
    const url = el.getAttribute("data-preview") || "";
    if (img) {
      img.style.backgroundImage = url ? `url("${url}")` : "";
    }
    preview.classList.add("isOn");
    window.addEventListener("mousemove", onMove, { passive: true });
    const item = el.closest(".workItem");
    
    // 清理之前的 hover 状态
    qsa(".workItem.isHoveringItem", root || document).forEach((item) => {
      item.classList.remove("isHoveringItem");
    });
    
    if (item) item.classList.add("isHoveringItem");
    elementState.set(el, { item });
  };
  
  const hide = (el) => {
    preview.classList.remove("isOn");
    window.removeEventListener("mousemove", onMove);
    const state = elementState.get(el);
    if (state && state.item) {
      state.item.classList.remove("isHoveringItem");
    }
    elementState.delete(el);
  };

  // 先移除旧的事件监听器（通过克隆替换）
  qsa(".workLink", root || document).forEach((a) => {
    const newA = a.cloneNode(true);
    a.parentNode.replaceChild(newA, a);
  });
  
  // 重新绑定事件
  qsa(".workLink", root || document).forEach((a) => {
    a.addEventListener("mouseenter", () => show(a));
    a.addEventListener("mouseleave", () => hide(a));
  });
}

function initProjectPage() {
  const page = document.body.dataset.page;
  if (page !== "project") return;
  const projects = window.PROJECTS || [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const p = projects.find((x) => x.id === id) || projects[0];

  const title = qs("#projectName");
  const titleEn = qs("#projectNameEn");
  const deck = qs("#projectDeck");
  const cover = qs("#projectCover");

  if (title) title.textContent = p?.title || "Project";
  if (titleEn) titleEn.textContent = p?.titleEn || "";
  if (deck) deck.textContent = p?.deck || "";
  if (cover) {
    const bg = p?.cover || p?.preview || "";
    if (bg) {
      cover.style.backgroundImage = `url("${bg}")`;
      cover.style.backgroundSize = "contain";
      cover.style.backgroundPosition = "center";
      cover.style.backgroundRepeat = "no-repeat";
    }
  }

  // 内联 META（标题下方）
  const metaInline = qs("#projectMetaInline");
  if (metaInline) {
    const parts = [];
    if (p?.year) parts.push(`<div class="metaInlineItem">${escapeHtml(p.year)}</div>`);
    if (p?.category) parts.push(`<div class="metaInlineItem">${escapeHtml(p.category)}</div>`);
    if (Array.isArray(p?.tags) && p.tags.length) {
      parts.push(`<div class="metaInlineTags"><span>${escapeHtml(p.tags.join(" · "))}</span></div>`);
    }
    metaInline.innerHTML = parts.join("");
  }

  // 根据模板类型选择渲染方式
  const template = p?.template || "default";
  const defaultTemplate = qs("#defaultTemplate");
  const experimentTemplate = qs("#experimentTemplate");

  if (template === "experiment") {
    // 显示实验模板，隐藏默认模板
    if (defaultTemplate) defaultTemplate.style.display = "none";
    if (experimentTemplate) experimentTemplate.style.display = "block";
    renderExperimentTemplate(p);
  } else {
    // 显示默认模板，隐藏实验模板
    if (defaultTemplate) defaultTemplate.style.display = "block";
    if (experimentTemplate) experimentTemplate.style.display = "none";
    renderDefaultTemplate(p);
  }

  // 滚动触发动画
  initProjectScrollAnimations();

  // 初始化交互
  initMagnetism();
  if (window.__bindCursorHover) window.__bindCursorHover();
}

// 默认模板渲染（内容运营类项目）
function renderDefaultTemplate(p) {
  // 01 核心数据
  const statsRow = qs("#statsRow");
  if (statsRow && Array.isArray(p?.stats) && p.stats.length) {
    statsRow.innerHTML = p.stats.map((s, i) => `
      <div class="statCard${i === 0 ? ' statCard--primary' : ''}">
        <div class="statValue">${escapeHtml(s.value)}</div>
        <div class="statDesc">${escapeHtml(s.label)}</div>
      </div>
    `).join("");
  }

  // 02 内容策略
  const strategyRow = qs("#strategyRow");
  if (strategyRow && Array.isArray(p?.strategies) && p.strategies.length) {
    strategyRow.innerHTML = p.strategies.map(s => `
      <div class="strategyCard">
        <img class="strategyImg" src="${escapeAttr(s.image)}" alt="${escapeAttr(s.name)}" loading="lazy" />
        <div class="strategyBody">
          <h3 class="strategyName">${escapeHtml(s.name)}</h3>
          <p class="strategyDesc">${escapeHtml(s.desc)}</p>
          <div class="strategyTags">
            ${(s.tags || []).map((t, ti) => `
              <span class="strategyTag${ti === 0 ? ' strategyTag--accent' : ''}">${escapeHtml(t)}</span>
            `).join("")}
          </div>
        </div>
      </div>
    `).join("");
  }

  // 03 爆款案例
  const casesList = qs("#casesList");
  if (casesList && Array.isArray(p?.cases) && p.cases.length) {
    casesList.innerHTML = p.cases.map(c => {
      const m = c.metrics || {};
      const metricParts = [];
      if (m.likes) metricParts.push(`<span class="caseMetric"><strong>${escapeHtml(m.likes)}</strong> 赞</span>`);
      if (m.saves) metricParts.push(`<span class="caseMetric"><strong>${escapeHtml(m.saves)}</strong> 收藏</span>`);
      if (m.comments) metricParts.push(`<span class="caseMetric"><strong>${escapeHtml(m.comments)}</strong> 评论</span>`);
      if (m.views) metricParts.push(`<span class="caseMetric"><strong>${escapeHtml(m.views)}</strong> 浏览</span>`);
      if (m.shares) metricParts.push(`<span class="caseMetric"><strong>${escapeHtml(m.shares)}</strong> 转发</span>`);

      return `
        <div class="caseItem">
          <img class="caseImg" src="${escapeAttr(c.image)}" alt="${escapeAttr(c.title)}" loading="lazy" />
          <div class="caseBody">
            <div class="caseHead">
              <span class="caseType">${escapeHtml(c.type)}</span>
              <h3 class="caseTitle">${escapeHtml(c.title)}</h3>
            </div>
            <div class="caseMetrics">${metricParts.join("")}</div>
            <p class="caseLogic"><strong>爆款逻辑：</strong>${escapeHtml(c.logic)}</p>
            <p class="caseHighlight">${escapeHtml(c.highlight)}</p>
          </div>
        </div>
      `;
    }).join("");
  }

  // 04 运营方法论
  const insightsGrid = qs("#insightsGrid");
  if (insightsGrid && Array.isArray(p?.insights) && p.insights.length) {
    insightsGrid.innerHTML = p.insights.map(ins => `
      <div class="insightCard">
        <div class="insightNum">${escapeHtml(ins.num)}</div>
        <h4 class="insightTitle">${escapeHtml(ins.title)}</h4>
        <p class="insightText">${escapeHtml(ins.text)}</p>
      </div>
    `).join("");
  }

  // 05 项目反思
  const reflectRow = qs("#reflectRow");
  if (reflectRow && p?.reflection) {
    const r = p.reflection;
    const renderList = (items) => `<ul class="reflectList">${items.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

    reflectRow.innerHTML = `
      <div class="reflectCol reflectCol--good">
        <h4 class="reflectColTitle reflectColTitle--good">做得好的</h4>
        ${renderList(r.good || [])}
      </div>
      <div class="reflectCol reflectCol--improve">
        <h4 class="reflectColTitle reflectColTitle--improve">可以改进的</h4>
        ${renderList(r.improve || [])}
      </div>
      <div class="reflectCol reflectCol--next">
        <h4 class="reflectColTitle reflectColTitle--next">下一步</h4>
        ${renderList(r.next || [])}
      </div>
    `;
  }

  // 06 商业转化
  const conversionWrap = qs("#conversionWrap");
  if (conversionWrap && p?.conversion) {
    const cv = p.conversion;
    const steps = cv.steps || [];
    const images = cv.images || [];

    conversionWrap.innerHTML = `
      ${steps.length ? `
        <div class="conversionFlow">
          ${steps.map((s, i) => `
            <div class="conversionStep">
              <div class="conversionStepIcon">${escapeHtml(s.icon || (i + 1))}</div>
              <div class="conversionStepNum">STEP ${String(i + 1).padStart(2, '0')}</div>
              <h4 class="conversionStepTitle">${escapeHtml(s.title)}</h4>
              <p class="conversionStepDesc">${escapeHtml(s.desc)}</p>
            </div>
          `).join("")}
        </div>
      ` : ""}
      ${images.length ? `
        <div class="conversionGallery">
          ${images.map(img => `<img src="${escapeAttr(img)}" alt="商业转化" loading="lazy" />`).join("")}
        </div>
      ` : ""}
      ${cv.note ? `<div class="conversionNote">${cv.note}</div>` : ""}
    `;
  }
}

// 实验模板渲染（AI/产品探索类项目）- 参考 lab-vibecoding.html 风格
function renderExperimentTemplate(p) {
  // 01 实验背景
  const expIntro = qs("#expIntro");
  if (expIntro && p?.experiment) {
    expIntro.innerHTML = `
      <p>${p.experiment.background}</p>
      <p>${p.experiment.motivation}</p>
    `;
  }

  // 02 核心问题
  const expProbGrid = qs("#expProbGrid");
  if (expProbGrid && Array.isArray(p?.problems) && p.problems.length) {
    expProbGrid.innerHTML = p.problems.map(prob => `
      <div class="expProbCard">
        <div class="expProbIcon">${escapeHtml(prob.num)}</div>
        <p class="expProbTitle">${escapeHtml(prob.title)}</p>
        <p class="expProbText">${escapeHtml(prob.desc)}</p>
      </div>
    `).join("");
  }

  // 03 项目目标
  const expGoalWrap = qs("#expGoalWrap");
  if (expGoalWrap && p?.goal) {
    const goal = p.goal;
    expGoalWrap.innerHTML = `
      <div class="expG2">
        <div class="expProse">
          <p>${goal.desc}</p>
        </div>
        <div class="expGoalCard">
          <div class="expGoalHeader">
            <span>三个核心目标</span>
          </div>
          ${(goal.items || []).map((item, i) => `
            <div class="expGoalItem">
              <span class="expGoalNum">0${i + 1}</span>
              <div>
                <p class="expGoalItemTitle">${escapeHtml(item.title)}</p>
                <p class="expGoalItemDesc">${escapeHtml(item.desc)}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // 04 产品结构
  const expStructWrap = qs("#expStructWrap");
  if (expStructWrap && p?.structure) {
    const struct = p.structure;
    expStructWrap.innerHTML = `
      <div class="expG2" style="gap: 40px;">
        <div>
          <table class="expStructTable">
            <thead>
              <tr>
                <th>Module</th>
                <th>内容方向</th>
              </tr>
            </thead>
            <tbody>
              ${(struct.columns || []).map(col => `
                <tr>
                  <td>${escapeHtml(col.name)}</td>
                  <td>${escapeHtml(col.desc)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="expProse">
          <p>${struct.desc}</p>
        </div>
      </div>
    `;
  }

  // 05 Vibe Coding 工作流
  const expFlowSteps = qs("#expFlowSteps");
  if (expFlowSteps && Array.isArray(p?.workflow) && p.workflow.length) {
    expFlowSteps.innerHTML = p.workflow.map((step, i) => `
      <div class="expFlowItem">
        <span class="expFlowNum">${['i', 'ii', 'iii'][i]}</span>
        <div>
          <p class="expFlowName">${escapeHtml(step.title)}</p>
          <p class="expFlowDesc">${escapeHtml(step.desc)}</p>
          <div class="expFlowTags">
            ${(step.tags || []).map(tag => `<span class="expFlowTag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("");
  }

  // 06 产品意识变化
  const expInsightPair = qs("#expInsightPair");
  if (expInsightPair && p?.mindset) {
    const mindset = p.mindset;
    expInsightPair.innerHTML = `
      <div class="expInsightSide">
        <p class="expInsightSideLabel">以前更关注</p>
        <ul class="expInsightList">
          ${(mindset.before || []).map(item => `<li><span>—</span>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      <div class="expInsightSide">
        <p class="expInsightSideLabel">现在会开始思考</p>
        <ul class="expInsightList">
          ${(mindset.after || []).map(item => `<li><span>→</span>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  const expMindsetProse = qs("#expMindsetProse");
  if (expMindsetProse && p?.mindset?.conclusion) {
    expMindsetProse.innerHTML = `
      <div class="expProse" style="margin-top: 32px;">
        <p>${p.mindset.conclusion}</p>
      </div>
    `;
  }

  // 07 成果
  const expOutcomeGrid = qs("#expOutcomeGrid");
  if (expOutcomeGrid && Array.isArray(p?.outcomes) && p.outcomes.length) {
    expOutcomeGrid.innerHTML = p.outcomes.map(out => `
      <div class="expOutcomeItem">
        <div class="expOutcomeValue">${escapeHtml(out.value)}</div>
        <div class="expOutcomeLabel">${escapeHtml(out.label)}</div>
      </div>
    `).join("");
  }

  const expOutcomeDetails = qs("#expOutcomeDetails");
  if (expOutcomeDetails && p?.outcomeDetails) {
    const details = p.outcomeDetails;
    expOutcomeDetails.innerHTML = `
      <div class="expOutcomeDetails" style="margin-top: 40px;">
        ${(details.cards || []).map(card => `
          <div class="expOutcomeCard">
            <p class="expOutcomeCardTitle">${escapeHtml(card.title)}</p>
            <ul class="expProbList">
              ${(card.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 08 反思
  const expReflection = qs("#expReflection");
  if (expReflection && p?.reflection) {
    expReflection.innerHTML = `
      <div class="expReflection">
        <p class="expReflectionQuote">${escapeHtml(p.reflection.quote)}</p>
        <div class="expReflectionBody">
          ${p.reflection.body}
        </div>
      </div>
    `;
  }

  // 09 后续迭代
  const expFutureGrid = qs("#expFutureGrid");
  if (expFutureGrid && Array.isArray(p?.nextSteps) && p.nextSteps.length) {
    expFutureGrid.innerHTML = p.nextSteps.map((step, i) => `
      <div class="expFutureItem">
        <div class="expFutureDot"></div>
        <p class="expFutureTitle">${escapeHtml(step.title || `方向 ${i + 1}`)}</p>
        <p class="expFutureDesc">${escapeHtml(step.desc || step)}</p>
      </div>
    `).join("");
  }
}

function initProjectScrollAnimations() {
  if (prefersReducedMotion()) {
    // 如果用户偏好减少动画，直接显示所有元素
    document.querySelectorAll('.projSection, .statCard, .strategyCard, .caseItem, .insightCard, .reflectCol, .conversionStep, .conversionGallery img, .conversionNote, .expSec, .expProbCard, .expFlowItem, .expInsightSide, .expOutcomeItem, .expOutcomeCard, .expFutureItem').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // 观察所有需要动画的元素
  const selectors = [
    '.projSection',
    '.statCard',
    '.strategyCard',
    '.caseItem',
    '.insightCard',
    '.reflectCol',
    '.conversionStep',
    '.conversionGallery img',
    '.conversionNote',
    // 实验模板元素
    '.expSec',
    '.expProbCard',
    '.expFlowItem',
    '.expInsightSide',
    '.expOutcomeItem',
    '.expOutcomeCard',
    '.expFutureItem'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  });
}

function initBackgroundVariant() {
  // 方便你快速对比背景“白度”：在 URL 后加 ?bg=1 / ?bg=2 / ?bg=3
  // 例如：/index.html?bg=3 或 /work.html?bg=2
  const params = new URLSearchParams(window.location.search);
  const v = params.get("bg");
  const map = {
    "1": "#ffffff", // 纯白
    "2": "#ffffff", // 纯白（保留参数兼容）
    "3": "#ffffff" // 纯白（保留参数兼容）
  };
  if (v && map[v]) {
    document.documentElement.style.setProperty("--bg", map[v]);
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

function boot() {
  initBackgroundVariant();
  initYear();
  initCursor();
  initNameCapsuleMotion();
  initNameMarqueeStart();
  initAboutPhotoBalance();
  initAvatarTilt();
  initHomeScrollBridge();
  initMagnetism();
  initPageFade();
  initHomeProjectsEmbed();
  initScrollReveals();
  initWorkPage();
  initProjectPage();
  // 新的交互效果
  initScrollProgress();
  initParallaxScroll();
  init3DTilt();
  initEnhancedMagnetism();
}

document.addEventListener("DOMContentLoaded", boot);
