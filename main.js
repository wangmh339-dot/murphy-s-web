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
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    raf = requestAnimationFrame(tick);
  };

  const onMove = (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.opacity = "1";
    if (!raf) raf = requestAnimationFrame(tick);
  };

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

function buildCategories(projects) {
  const map = new Map();
  projects.forEach((p) => {
    const key = p.category || "other";
    map.set(key, (map.get(key) || 0) + 1);
  });
  const order = ["all", "design", "photography", "content", "reflection", "product", "painting", "other"];
  const result = [];
  result.push({ key: "all", label: "all", count: projects.length });
  order
    .filter((k) => k !== "all")
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
    design: "design",
    photography: "photo",
    content: "content",
    reflection: "notes",
    product: "product",
    painting: "paint"
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

  const projects = (window.PROJECTS || []).slice();
  const categories = buildCategories(projects);
  let active = "all";
  let lockedKey = null;

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
        renderList();
      });

      // 键盘可用
      btn.addEventListener("focus", () => {
        if (lockedKey) return;
        active = key;
        updateButtons();
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
        renderList();
      });
    });

    // 鼠标离开分类区：未锁定则回到 ALL
    filterWrap.addEventListener("mouseleave", () => {
      if (lockedKey) return;
      active = "all";
      updateButtons();
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
  renderList();
}

function initWorkPage() {
  const page = document.body.dataset.page;
  if (page !== "work") return;
  const projects = (window.PROJECTS || []).slice();
  const filterWrap = qs("#filters");
  const listWrap = qs("#workList");
  if (!filterWrap || !listWrap) return;

  const categories = buildCategories(projects);
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("category");
  let active = preselect && categories.some((c) => c.key === preselect) ? preselect : "all";
  let lockedKey = preselect && categories.some((c) => c.key === preselect) ? preselect : null;

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
        renderList();
      });

      btn.addEventListener("focus", () => {
        if (lockedKey) return;
        active = key;
        updateButtons();
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
        renderList();
        // 让磁吸在新按钮上生效
        initMagnetism();
        if (window.__bindCursorHover) window.__bindCursorHover();
      });
    });

    filterWrap.addEventListener("mouseleave", () => {
      if (lockedKey) return;
      active = "all";
      updateButtons();
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
  let lastLink = null;
  let lastItem = null;

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
    if (lastItem && lastItem !== item) lastItem.classList.remove("isHoveringItem");
    if (item) item.classList.add("isHoveringItem");
    lastItem = item;
    lastLink = el;
  };
  const hide = () => {
    preview.classList.remove("isOn");
    window.removeEventListener("mousemove", onMove);
    if (lastItem) lastItem.classList.remove("isHoveringItem");
    lastItem = null;
    lastLink = null;
  };

  qsa(".workLink", root || document).forEach((a) => {
    a.addEventListener("mouseenter", () => show(a));
    a.addEventListener("mouseleave", hide);
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
  const deck = qs("#projectDeck");
  const meta = qs("#projectMeta");
  const details = qs("#projectDetails");
  const link = qs("#projectLink");
  const cover = qs("#projectCover");

  if (title) title.textContent = p?.title || "Project";
  if (deck) deck.textContent = p?.deck || "";
  if (cover) {
    const bg = p?.cover || p?.preview || "";
    if (bg) {
      cover.style.backgroundImage = `url("${bg}")`;
      cover.style.backgroundSize = "cover";
      cover.style.backgroundPosition = "center";
    }
  }
  if (meta) {
    const pills = [
      p?.year ? { k: "Year", v: p.year } : null,
      p?.category ? { k: "Category", v: p.category } : null,
      Array.isArray(p?.tags) && p.tags.length ? { k: "Tags", v: p.tags.join(" / ") } : null
    ].filter(Boolean);
    meta.innerHTML = pills
      .map(
        (i) => `
          <div class="card">
            <div class="cardTitle">${escapeHtml(i.k)}</div>
            <p>${escapeHtml(i.v)}</p>
          </div>
        `
      )
      .join("");
  }
  if (details) details.textContent = p?.details || "";
  if (link) {
    if (p?.link) {
      link.innerHTML = `<a class="magnetic" data-cursor="hover" href="${escapeAttr(p.link)}" target="_blank" rel="noreferrer">外链 / 项目地址 ↗</a>`;
    } else {
      link.innerHTML = `<span style="color: var(--dim)">（可选）在 projects.js 里填入 link 字段以显示外链</span>`;
    }
  }
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
  initMagnetism();
  initPageFade();
  initHomeProjectsEmbed();
  initScrollReveals();
  initWorkPage();
  initProjectPage();
}

document.addEventListener("DOMContentLoaded", boot);
