/**
 * 首页的小交互：指针接近卡片 / 按钮 / 分组块的边缘或中线时，
 * 用 uiik 自己的 findSnap 求解吸附、snapGuides 生成对齐参考线。
 *
 * 刻意只做「磁吸」而非硬吸附：完整吸附会发粘，这里只吃一部分位移，
 * 参考线仍然画在真实的对齐位置上。
 */
import { findSnap, snapGuides } from "./uiik.js";

/** 与 demo.css 里 --bg-grid 的 background-size 保持一致 */
const CELL = 48;
const HALF = CELL / 2;
/** 触发吸附的距离（px）。目标块很大，容差稍大就会「一直吸附」，手感发粘 */
const TOLERANCE = 8;
/** 磁吸强度：只吃一部分位移，0 = 完全不吸，1 = 硬吸附 */
const STRENGTH = 0.35;
/** 参与吸附的元素；刻意不含 hero 标题，避免参考线过多 */
const SELECTOR = ".tile-link, .api-group, .hero__badge, .hero__actions .btn";
/** 是否显示跟随指针的矩形。false = 只留参考线，改 true 即恢复 */
const SHOW_BOX = true;

const fine = window.matchMedia("(pointer: fine)");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

/** 参考线层：z-index 为负，落在卡片与按钮之下 */
let guidesLayer = null;
/** 矩形层：z-index 较高，仅在 SHOW_BOX 时创建 */
let boxLayer = null;
let box = null;
const pool = [];
let targets = [];
/** 指针位置（视口坐标） */
let px = 0;
let py = 0;
let seen = false;
let raf = 0;

function build() {
  guidesLayer = document.createElement("div");
  guidesLayer.className = "cursor-guides-layer";
  guidesLayer.setAttribute("aria-hidden", "true");
  document.body.append(guidesLayer);

  if (!SHOW_BOX) return;

  boxLayer = document.createElement("div");
  boxLayer.className = "cursor-layer";
  boxLayer.setAttribute("aria-hidden", "true");
  box = document.createElement("div");
  box.className = "cursor-box";
  boxLayer.append(box);
  document.body.append(boxLayer);
}

/** 目标矩形用视口坐标，与固定定位的跟随块同一坐标系 */
function measure() {
  const list = [];
  for (const node of document.querySelectorAll(SELECTOR)) {
    const r = node.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    list.push({ x: r.left, y: r.top, w: r.width, h: r.height });
  }
  targets = list;
}

function drawGuides(lines) {
  while (pool.length < lines.length) {
    const g = document.createElement("div");
    g.className = "cursor-guide";
    guidesLayer.append(g);
    pool.push(g);
  }
  for (let i = 0; i < pool.length; i++) {
    const g = pool[i];
    const d = lines[i];
    if (!d) {
      g.style.display = "none";
      continue;
    }
    g.style.display = "block";
    if (d.dir === "v") {
      // 竖线：x 固定，y 方向延伸
      g.className = "cursor-guide cursor-guide--v";
      g.style.left = d.coord + "px";
      g.style.top = d.from + "px";
      g.style.width = "1px";
      g.style.height = Math.max(0, d.to - d.from) + "px";
    } else {
      // 横线：y 固定，x 方向延伸
      g.className = "cursor-guide cursor-guide--h";
      g.style.top = d.coord + "px";
      g.style.left = d.from + "px";
      g.style.height = "1px";
      g.style.width = Math.max(0, d.to - d.from) + "px";
    }
  }
}

function tick() {
  raf = 0;
  if (!seen || !fine.matches) return;

  const cand = { x: px - HALF, y: py - HALF, w: CELL, h: CELL };
  let dx = 0;
  let dy = 0;
  let lines = [];

  if (targets.length) {
    const res = findSnap(cand, targets, {
      tolerance: TOLERANCE,
      points: ["start", "center", "end"],
      strategy: "nearest",
    });
    dx = res.dx;
    dy = res.dy;
    if (dx || dy) lines = snapGuides(cand, targets, res, 6);
  }

  const snapped = !!(dx || dy);
  if (box) {
    const k = reduce.matches ? 0 : STRENGTH;
    box.style.transform = `translate3d(${cand.x + dx * k}px, ${cand.y + dy * k}px, 0)`;
    box.classList.toggle("is-snapped", snapped);
  }
  drawGuides(lines);
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function onMove(ev) {
  if (ev.pointerType === "touch") return;
  px = ev.clientX;
  py = ev.clientY;
  if (!seen) {
    seen = true;
    if (boxLayer) boxLayer.classList.add("is-on");
  }
  schedule();
}

function onLeave() {
  seen = false;
  if (boxLayer) boxLayer.classList.remove("is-on");
  for (const g of pool) g.style.display = "none";
}

function init() {
  if (!fine.matches) return; // 触屏设备不启用
  build();

  const remeasure = () => {
    measure();
    schedule();
  };
  remeasure();

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", remeasure, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", () => requestAnimationFrame(remeasure));
  // 目标矩形里有脚本渲染的 API 覆盖区，尺寸也受 Web 字体影响。
  // 布局尺寸一变就重测，避免脚本内容或字体度量变化后吸附用到旧矩形。
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(remeasure);
  }
  if (window.ResizeObserver) {
    new ResizeObserver(remeasure).observe(document.body);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}