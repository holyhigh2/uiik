/**
 * uiik · SVG 示例
 * 与 DOM 示例同构，按 API 分类组织。Splittable / Sortable / CollisionDetector
 * 依赖 HTML 布局盒（offsetWidth / offsetLeft），因此在 SVG 中不适用，页尾有说明卡片。
 */

import uii, {
  newDraggable,
  newResizable,
  newRotatable,
  newSelectable,
  wrapper,
  getTranslate,
  moveTo,
  transformMoveTo,
  moveBy,
  rotateTo,
  getVertex,
  calcVertex,
  parseOxy,
  normalizeVector,
  getStyleXy,
  getStyleSize,
  getMatrixInfo,
  getRectInContainer,
  getRectCenter,
  getCenterXySVG,
  getBox,
  getPointOffset,
  getPointInContainer,
  isSVGEl,
  isVisible,
  findSnap,
  snapGuides,
  snapToGrid,
  fitRectInViewport,
  zoomAt,
  panBy,
  alignRects,
  distributeRects,
  unionRect,
  rectCenter,
  rectInset,
  resizeRect,
} from "./uiik.js";

import {
  section,
  mount,
  el,
  fmt,
  buttons,
  slider,
  select,
  readout,
  gridSliders,
  svgHandles,
  syncSvgHandles,
} from "./demo.js";

const NS = "http://www.w3.org/2000/svg";

const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
};

/* 给 svg 容器加一层 20px 网格，方便观察位移 */
function gridLayer(w, h, step = 20) {
  const g = svgEl("g", { class: "svg-grid" });
  for (let x = 0; x <= w; x += step) {
    g.append(
      svgEl("line", {
        class: "svg-grid-line",
        x1: x,
        y1: 0,
        x2: x,
        y2: h,
      })
    );
  }
  for (let y = 0; y <= h; y += step) {
    g.append(
      svgEl("line", { class: "svg-grid-line", x1: 0, y1: y, x2: w, y2: y })
    );
  }
  return g;
}

/* ========================================================================== *
 * 1. Draggable (SVG)
 * ========================================================================== */
{
  const s = section({
    id: "svg-draggable",
    group: "Draggable",
    nav: "SVG 拖动",
    api: "newDraggable(els, {useTransform, handle, filter})",
    code: `import { newDraggable } from "uiik";

newDraggable("#svg-box-t", {
  containment: "#svg-d1",
  cursor: { default: "grab", active: "grabbing" },
  onEnd({ transform }) {
    info([
      ["transform", boxT.getAttribute("transform") || "-"],
      ["x / y", \`\${boxT.getAttribute("x")}, \${boxT.getAttribute("y")}\`],
      ["ut.x / ut.y", \`\${Math.round(transform.x)}, \${Math.round(transform.y)}\`],
    ]);
  },
})

newDraggable("#svg-box-a", {
  useTransform: false,
  containment: "#svg-d1",
  onEnd() {
    info([
      ["transform", boxA.getAttribute("transform") || "-"],
      ["x / y", \`\${boxA.getAttribute("x")}, \${boxA.getAttribute("y")}\`],
    ]);
  },
})

newDraggable("#svg-d2-card", {
  handle: "#svg-d2 .d2-handle",
  filter: "#svg-d2 .no-drag",
  group: "svg-group",
  zIndex: 999,
  onEnd() {
    info([["group 卡片", getTranslate(d2) ]]);
  },
})

newDraggable("#svg-d3", {
  threshold: 18,
  grid: 10,
  containment: "#svg-d2",
})

newDraggable("#svg-d4", {
  direction: "h",
  containment: "#svg-d2",
})`,
    title: "SVG 拖动：transform 属性 vs x/y 属性",
    desc:
      "左：<code>useTransform: true</code>（默认）写入 <code>transform=\"translate()\"</code>；" +
      "右：<code>useTransform: false</code> 直接改 <code>x/y</code>。" +
      "第二行演示 <code>handle</code>、<code>filter</code>、<code>threshold</code>、<code>direction</code> 与 <code>group</code> 置顶。",
    options: [
      "useTransform=true|false",
      "handle='#svg-d2 .d2-handle'",
      "filter='.no-drag'",
      "threshold=18",
      "direction='h'",
      "group='svg-group'",
      "zIndex",
      "cursor{default,active,over}",
      "onStart/onDrag/onEnd",
    ],
    html: `
      <div style="display:grid;gap:14px">
        <div class="svg-frame">
          <svg class="svg-canvas" id="svg-d1" viewBox="0 0 620 210"></svg>
        </div>
        <div class="svg-frame">
          <svg class="svg-canvas" id="svg-d2" viewBox="0 0 620 210"></svg>
        </div>
      </div>`,
  });

  /* --- 第一行：useTransform 对比 --- */
  const svg1 = s.stageHost.querySelector("#svg-d1");
  svg1.append(gridLayer(620, 210));
  const boxT = svgEl("rect", {
    id: "svg-box-t",
    class: "svg-shape",
    x: 40,
    y: 50,
    width: 120,
    height: 80,
    rx: 6,
  });
  const labelT = svgEl("text", {
    class: "svg-label",
    x: 40,
    y: 30,
  });
  labelT.textContent = "useTransform: true";
  svg1.append(boxT, labelT);

  const boxA = svgEl("rect", {
    id: "svg-box-a",
    class: "svg-shape svg-shape--violet",
    x: 380,
    y: 50,
    width: 120,
    height: 80,
    rx: 6,
  });
  const labelA = svgEl("text", { class: "svg-label", x: 380, y: 30 });
  labelA.textContent = "useTransform: false";
  svg1.append(boxA, labelA);

  /* --- 第二行：handle / filter / threshold / direction / group --- */
  const svg2 = s.stageHost.querySelector("#svg-d2");
  svg2.append(gridLayer(620, 210));
  const d2 = svgEl("g", { id: "svg-d2-card" });
  const d2Rect = svgEl("rect", {
    class: "svg-shape svg-shape--emerald",
    x: 40,
    y: 50,
    width: 170,
    height: 110,
    rx: 6,
  });
  const d2Bar = svgEl("rect", {
    class: "d2-handle",
    x: 40,
    y: 50,
    width: 170,
    height: 26,
    rx: 6,
    fill: "rgba(255,255,255,.28)",
  });
  const d2Btn = svgEl("rect", {
    class: "no-drag",
    x: 176,
    y: 56,
    width: 26,
    height: 14,
    rx: 3,
    fill: "rgba(0,0,0,.35)",
  });
  const d2Label = svgEl("text", { class: "svg-label", x: 52, y: 112 });
  d2Label.textContent = "handle 拖动";
  d2.append(d2Rect, d2Bar, d2Btn, d2Label);
  svg2.append(d2);

  const d3 = svgEl("rect", {
    id: "svg-d3",
    class: "svg-shape svg-shape--amber",
    x: 280,
    y: 50,
    width: 130,
    height: 70,
    rx: 6,
  });
  const d3Label = svgEl("text", { class: "svg-label", x: 280, y: 30 });
  d3Label.textContent = "threshold 18";
  svg2.append(d3, d3Label);

  const d4 = svgEl("rect", {
    id: "svg-d4",
    class: "svg-shape svg-shape--rose",
    x: 280,
    y: 140,
    width: 150,
    height: 46,
    rx: 6,
  });
  const d4Label = svgEl("text", { class: "svg-label", x: 280, y: 130 });
  d4Label.textContent = "direction: 'h'";
  svg2.append(d4, d4Label);

  const info = readout(s.controls, "实时");

  newDraggable("#svg-box-t", {
    containment: "#svg-d1",
    cursor: { default: "grab", active: "grabbing" },
    onEnd({ transform }) {
      info([
        ["transform", boxT.getAttribute("transform") || "-"],
        ["x / y", `${boxT.getAttribute("x")}, ${boxT.getAttribute("y")}`],
        ["ut.x / ut.y", `${Math.round(transform.x)}, ${Math.round(transform.y)}`],
      ]);
    },
  });

  newDraggable("#svg-box-a", {
    useTransform: false,
    containment: "#svg-d1",
    onEnd() {
      info([
        ["transform", boxA.getAttribute("transform") || "-"],
        ["x / y", `${boxA.getAttribute("x")}, ${boxA.getAttribute("y")}`],
      ]);
    },
  });

  newDraggable("#svg-d2-card", {
    handle: "#svg-d2 .d2-handle",
    filter: "#svg-d2 .no-drag",
    group: "svg-group",
    zIndex: 999,
    onEnd() {
      info([["group 卡片", getTranslate(d2) ]]);
    },
  });

  const gridInst = newDraggable("#svg-d3", {
    threshold: 18,
    grid: 10,
    containment: "#svg-d2",
  });

  newDraggable("#svg-d4", {
    direction: "h",
    containment: "#svg-d2",
  });

  gridSliders(s.controls, gridInst, {
    x: 10,
    y: 10,
  });
}

/* -------------------- 2. Draggable snap (SVG) --------------------------- */
{
  const s = section({
    id: "svg-draggable-snap",
    group: "Draggable",
    nav: "SVG 吸附",
    api: "newDraggable(els, {snap, snapOptions, onSnap})",
    code: `import { newDraggable } from "uiik";

newDraggable("#svg-snap-mover", {
  containment: "#svg-snap",
  snap: ".svg-snap-target",
  snapOptions: {
    tolerance: 16,
    points: ["start", "center", "end"],
    container: svg,
  },
  onSnap({ targetH, targetV, dirH, dirV, dx, dy }) {
    snapRef = true;
    renderGuides();
    const at = (el) => {
      const r = getRectInContainer(el, svg);
      return \`\${Math.round(r.x)}, \${Math.round(r.y)}\`;
    };
    info([
      ["dirH / dirV", \`\${dirH || "-"} / \${dirV || "-"}\`],
      ["dx / dy", \`\${Math.round(dx)}, \${Math.round(dy)}\`],
      ["targetH", targetH ? at(targetH) : "-"],
      ["targetV", targetV ? at(targetV) : "-"],
    ]);
  },
  onDrag() {
    // onSnap 仅在方向变化时触发，拖动过程中需持续重绘，参考线才会跟随
    if (snapRef) renderGuides();
  },
  onEnd() {
    snapRef = null;
    guideG.replaceChildren();
  },
})`,
    title: "SVG 吸附：snap + onSnap 绘制参考线",
    desc:
      "拖动绿色矩形靠近虚线目标框。<code>snap</code> 同样支持 SVG 元素；" +
      "参考线由 <code>getRectInContainer</code> + <code>findSnap</code> + <code>snapGuides</code> 生成" +
      "（与「SVG 几何」示例同一套机制），因此严格水平/垂直。" +
      "注意 <code>onSnap</code> 只在方向变化时触发，需在 <code>onDrag</code> 里持续重绘，参考线才会跟随。",
    options: [
      "snap='.svg-snap-target'",
      "snapOptions.container",
      "tolerance",
      "points",
      "onSnap / onDrag",
      "findSnap / snapGuides",
    ],
    html: `
      <div class="svg-frame">
        <svg class="svg-canvas" id="svg-snap" viewBox="0 0 620 300"></svg>
      </div>`,
  });

  const svg = s.stageHost.querySelector("#svg-snap");
  svg.append(gridLayer(620, 300));

  const targets = [
    { x: 60, y: 50, w: 110, h: 70 },
    { x: 300, y: 40, w: 90, h: 60 },
    { x: 430, y: 170, w: 130, h: 80 },
    { x: 120, y: 200, w: 80, h: 60 },
  ];
  const tg = svgEl("g");
  targets.forEach((t, i) => {
    tg.append(
      svgEl("rect", {
        class: "svg-shape svg-snap-target",
        x: t.x,
        y: t.y,
        width: t.w,
        height: t.h,
        rx: 4,
        fill: "rgba(56,189,248,.06)",
        stroke: "var(--accent)",
        "stroke-dasharray": "5 4",
      })
    );
    const label = svgEl("text", { class: "svg-label", x: t.x + 4, y: t.y - 6 });
    label.textContent = "T" + (i + 1);
    tg.append(label);
  });
  svg.append(tg);

  const guideG = svgEl("g", { id: "svg-snap-guides" });
  /* 参考线直接复用库的几何函数（与「SVG 几何」示例同一套机制）：
   * mover 已被库写入 transform:translate，只读 x/y 属性拿到的是拖动前的位置，
   * 必须用 getRectInContainer 换算成容器用户坐标；再由 snapGuides 产出
   * 严格水平/垂直的线段（coord 固定，from/to 决定跨度）。 */
  const snapTargets = () =>
    [...svg.querySelectorAll(".svg-snap-target")].map((t) =>
      getRectInContainer(t, svg)
    );
  const moverRect = () => getRectInContainer(mover, svg);
  let snapRef = null;
  const renderGuides = () => {
    guideG.replaceChildren();
    if (!snapRef) return;
    const targets = snapTargets();
    const rect = moverRect();
    const result = findSnap(rect, targets, {
      tolerance: 16,
      points: ["start", "center", "end"],
      strategy: "nearest",
    });
    for (const g of snapGuides(rect, targets, result, 24)) {
      guideG.append(
        svgEl("line", {
          class: "geo-guide",
          x1: g.dir === "v" ? g.coord : g.from,
          y1: g.dir === "v" ? g.from : g.coord,
          x2: g.dir === "v" ? g.coord : g.to,
          y2: g.dir === "v" ? g.to : g.coord,
        })
      );
    }
  };
  const mover = svgEl("rect", {
    id: "svg-snap-mover",
    class: "svg-shape svg-shape--emerald",
    x: 200,
    y: 120,
    width: 110,
    height: 70,
    rx: 4,
  });
  svg.append(guideG, mover);

  const info = readout(s.controls, "吸附信息");

  newDraggable("#svg-snap-mover", {
    containment: "#svg-snap",
    snap: ".svg-snap-target",
    snapOptions: {
      tolerance: 16,
      points: ["start", "center", "end"],
      container: svg,
    },
    onSnap({ targetH, targetV, dirH, dirV, dx, dy }) {
      snapRef = true;
      renderGuides();
      const at = (el) => {
        const r = getRectInContainer(el, svg);
        return `${Math.round(r.x)}, ${Math.round(r.y)}`;
      };
      info([
        ["dirH / dirV", `${dirH || "-"} / ${dirV || "-"}`],
        ["dx / dy", `${Math.round(dx)}, ${Math.round(dy)}`],
        ["targetH", targetH ? at(targetH) : "-"],
        ["targetV", targetV ? at(targetV) : "-"],
      ]);
    },
    onDrag() {
      // onSnap 仅在方向变化时触发，拖动过程中需持续重绘，参考线才会跟随
      if (snapRef) renderGuides();
    },
    onEnd() {
      snapRef = null;
      guideG.replaceChildren();
    },
  });
}

/* ========================================================================== *
 * 3. Resizable (SVG)
 * ========================================================================== */
{
  const s = section({
    id: "svg-resizable",
    group: "Resizable",
    nav: "SVG 缩放",
    api: "newResizable(els, {handle, ox, oy})",
    code: `import { newResizable } from "uiik";

newResizable("#svg-rz-target", {
  handle: (target) => target.parentNode.querySelectorAll(".rh"),
  ox: "50%",
  oy: "50%",
  onResize({ w, h, cx, cy, sx, sy, deg, transform }) {
    //SVG 手柄是独立图元，不像 DOM 那样靠 CSS 自动跟随；
    //onResize 早于尺寸写入，故用回调给出的新位置/尺寸同步
    syncSvgHandles(rzHandles, cx, cy, w, h, 6);
    info([
      ["w / h", \`\${Math.round(w)} x \${Math.round(h)}\`],
      ["sx / sy", \`\${Math.round(sx)}, \${Math.round(sy)}\`],
      ["cx / cy", \`\${Math.round(cx)}, \${Math.round(cy)}\`],
      ["deg", deg],
      ["transform.x/y", \`\${Math.round(transform.x)}, \${Math.round(transform.y)}\`],
      ["getVertex(50/50)", fmt(getVertex(document.getElementById("svg-rz-target"), "50%", "50%"))],
    ]);
  },
})

newResizable("#svg-rz-ghost", {
  handle: (target) => target.parentNode.querySelectorAll(".rh-g"),
  ox: 0,
  oy: 0,
  minSize: [80, 60],
  maxSize: [280, 220],
  onResize(args) {
    syncGhost(args);
  },
})`,
    title: "SVG 缩放：八向手柄 + ox/oy 中心偏移",
    desc:
      "手柄是普通 SVG 矩形，方向同样由 <code>uii-resizable-handle-xx</code> 类名决定；SVG 中手柄需绘制在目标图形之后才能接收事件。" +
      "<code>ox/oy</code> 指定相对图形左上角的圆心偏移（支持数字与百分比），缩放 <code>n/nw/w/sw</code> 侧时按此圆心修正位移。" +
      "右侧面板可用 <code>aspectRatio</code> 锁定宽高比。",
    options: [
      "handle=fn(target)",
      "ox='50%'",
      "oy='50%'",
      "minSize",
      "maxSize",
      "aspectRatio",
      "setOptions",
      "onResize → cx/cy/sx/sy",
    ],
    html: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px">
        <div class="svg-frame">
          <svg class="svg-canvas" id="svg-rz1" viewBox="0 0 360 260"></svg>
        </div>
        <div class="svg-frame">
          <svg class="svg-canvas" id="svg-rz2" viewBox="0 0 360 260"></svg>
        </div>
      </div>`,
  });

  /* --- 8 向缩放 --- */
  const svg1 = s.stageHost.querySelector("#svg-rz1");
  svg1.append(gridLayer(360, 260));
  svg1.insertAdjacentHTML(
    "beforeend",
    `<rect id="svg-rz-target" class="svg-shape" x="110" y="80" width="140" height="100" rx="4"></rect>`
  );
  svg1.insertAdjacentHTML("beforeend", svgHandles(110, 80, 140, 100, 6).replace(/class="uii-resizable-handle-/g, 'class="rh uii-resizable-handle-'));
  svg1.insertAdjacentHTML(
    "beforeend",
    `<text class="svg-label" x="110" y="70">ox:50% oy:50%</text>`
  );

  const info = readout(s.controls, "缩放数据");

  const rzHandles = svg1.querySelectorAll(".rh");

  newResizable("#svg-rz-target", {
    handle: (target) => target.parentNode.querySelectorAll(".rh"),
    ox: "50%",
    oy: "50%",
    onResize({ w, h, cx, cy, sx, sy, deg, transform }) {
      //SVG 手柄是独立图元，不像 DOM 那样靠 CSS 自动跟随；
      //onResize 早于尺寸写入，故用回调给出的新位置/尺寸同步
      syncSvgHandles(rzHandles, cx, cy, w, h, 6);
      info([
        ["w / h", `${Math.round(w)} x ${Math.round(h)}`],
        ["sx / sy", `${Math.round(sx)}, ${Math.round(sy)}`],
        ["cx / cy", `${Math.round(cx)}, ${Math.round(cy)}`],
        ["deg", deg],
        ["transform.x/y", `${Math.round(transform.x)}, ${Math.round(transform.y)}`],
        ["getVertex(50/50)", fmt(getVertex(document.getElementById("svg-rz-target"), "50%", "50%"))],
      ]);
    },
  });

  /* --- 尺寸约束 + setOptions --- */
  const svg2 = s.stageHost.querySelector("#svg-rz2");
  svg2.append(gridLayer(360, 260));
  svg2.insertAdjacentHTML(
    "beforeend",
    `<rect id="svg-rz-ghost" class="svg-shape svg-shape--violet" x="80" y="70" width="160" height="120" rx="4"></rect>
     <text class="svg-label" x="80" y="60">minSize / maxSize / aspectRatio</text>
     <rect class="rh-g uii-resizable-handle-se" x="228" y="178" width="12" height="12" rx="2" fill="rgba(251,191,36,.8)"></rect>
     <rect class="rh-g uii-resizable-handle-s" x="174" y="178" width="12" height="12" rx="2" fill="rgba(251,191,36,.8)"></rect>
     <rect class="rh-g uii-resizable-handle-e" x="228" y="124" width="12" height="12" rx="2" fill="rgba(251,191,36,.8)"></rect>`
  );

  const ghostHandles = svg2.querySelectorAll(".rh-g");
  const syncGhost = ({ cx, cy, w, h }) => syncSvgHandles(ghostHandles, cx, cy, w, h, 6);

  const ghostTarget = document.getElementById("svg-rz-ghost");
  const ghostInst = newResizable("#svg-rz-ghost", {
    handle: (target) => target.parentNode.querySelectorAll(".rh-g"),
    ox: 0,
    oy: 0,
    minSize: [80, 60],
    maxSize: [280, 220],
    onResize(args) {
      syncGhost(args);
    },
  });
  syncGhost({
    cx: +ghostTarget.getAttribute("x"),
    cy: +ghostTarget.getAttribute("y"),
    w: +ghostTarget.getAttribute("width"),
    h: +ghostTarget.getAttribute("height"),
  });

  const wrap = el("div");
  s.controls.append(wrap);
  const ka = el("input", { type: "checkbox" });
  ka.addEventListener("change", () => {
    ghostInst.setOptions({ aspectRatio: ka.checked ? 1 : undefined });
  });
  wrap.append(el("label", { class: "field" }, [ka, "aspectRatio"]));
}

/* ========================================================================== *
 * 4. Rotatable (SVG)
 * ========================================================================== */
{
  const s = section({
    id: "svg-rotatable",
    group: "Rotatable",
    nav: "SVG 旋转",
    api: "newRotatable(els, {handle, ox, oy, cursor})",
    code: `import { newDraggable, newRotatable } from "uiik";

newRotatable("#" + id, {
  handle: \`#\${id} .svg-rot-handle\`,
  ox,
  oy,
  cursor: { default: "crosshair", active: "cell" },
  onStart({ deg }) {
    hooks.onStart?.({ deg });
  },
  onRotate({ deg, cx, cy }) {
    info([
      ["element", id],
      ["deg", Math.round(deg)],
      ["center", \`\${Math.round(cx)}, \${Math.round(cy)}\`],
      ["transform", document.getElementById(id).getAttribute("transform") || "-"],
    ]);
  },
  onEnd({ deg }) {
    hooks.onEnd?.({ deg });
  },
})

newDraggable("#svg-card-1", {
  containment: "#svg-rot",
  filter: "#svg-card-1 .svg-rot-handle",
})

newDraggable("#svg-card-2", {
  containment: "#svg-rot",
  filter: "#svg-card-2 .svg-rot-handle",
})`,
    title: "SVG 旋转：<g> 组合 + 圆心偏移",
    desc:
      "旋转作用于 <code>&lt;g&gt;</code> 时会把 transform 追加为 <code>rotate(deg, cx, cy)</code>。" +
      "<code>ox/oy</code> 支持百分比，圆点标记即实际旋转中心。左侧演示拖动 + 旋转共存（旋转开始时禁用拖动）。",
    options: [
      "handle='.svg-rot-handle'",
      "ox='50%'",
      "oy='60%'",
      "cursor{default,active}",
      "onStart/onRotate/onEnd",
      "draggable.disable()",
    ],
    html: `
      <div class="svg-frame">
        <svg class="svg-canvas" id="svg-rot" viewBox="0 0 620 345"></svg>
      </div>`,
  });

  const svg = s.stageHost.querySelector("#svg-rot");
  svg.append(gridLayer(620, 345));

  const mkCard = (id, x, y, color, label, oxPct, oyPct) => {
    const g = svgEl("g", { id });
    const w = 130;
    const h = 100;
    const ox = (w * oxPct) / 100;
    const oy = (h * oyPct) / 100;
    const text = svgEl("text", { class: "svg-label", x: x + 10, y: y + 24 });
    text.textContent = label;
    g.append(
      svgEl("rect", {
        class: "svg-shape " + color,
        x,
        y,
        width: w,
        height: h,
        rx: 8,
      }),
      text,
      svgEl("circle", { class: "svg-origin", cx: x + ox, cy: y + oy, r: 4 }),
      // 手柄必须落在 <g> 的 bbox 内：ox/oy 是相对 getBBox() 原点的偏移，
      // 若手柄超出矩形，bbox 会被撑大，圆心标记就会与真实旋转中心错位
      svgEl("circle", {
        class: "svg-rot-handle",
        cx: x + ox,
        cy: y + 7,
        r: 7,
      })
    );
    svg.append(g);
    return g;
  };

  const card1 = mkCard("svg-card-1", 60, 90, "svg-shape--emerald", "卡片 A · 50%/50%", 50, 50);
  const card2 = mkCard("svg-card-2", 320, 90, "svg-shape--amber", "卡片 B · 30%/80%", 30, 80);
  const card3 = mkCard("svg-card-3", 60, 215, "svg-shape--violet", "卡片 C", 50, 50);
  const card4 = mkCard("svg-card-4", 320, 215, "", "卡片 D", 50, 50);

  const info = readout(s.controls, "旋转数据");

  const mkRot = (id, ox, oy, hooks = {}) =>
    newRotatable("#" + id, {
      handle: `#${id} .svg-rot-handle`,
      ox,
      oy,
      cursor: { default: "crosshair", active: "cell" },
      onStart({ deg }) {
        hooks.onStart?.({ deg });
      },
      onRotate({ deg, cx, cy }) {
        info([
          ["element", id],
          ["deg", Math.round(deg)],
          ["center", `${Math.round(cx)}, ${Math.round(cy)}`],
          ["transform", document.getElementById(id).getAttribute("transform") || "-"],
        ]);
      },
      onEnd({ deg }) {
        hooks.onEnd?.({ deg });
      },
    });

  /* 卡片 A：拖动 + 旋转共存，旋转时禁用拖动 */
  const dragA = newDraggable("#svg-card-1", {
    containment: "#svg-rot",
    filter: "#svg-card-1 .svg-rot-handle",
  });
  mkRot("svg-card-1", "50%", "50%", {
    onStart() {
      dragA.disable();
    },
    onEnd() {
      dragA.enable();
    },
  });

  /* 卡片 B：拖动 + 旋转（另一个组合，圆心 30%/80%） */
  const dragB = newDraggable("#svg-card-2", {
    containment: "#svg-rot",
    filter: "#svg-card-2 .svg-rot-handle",
  });
  mkRot("svg-card-2", "30%", "80%", {
    onStart() {
      dragB.disable();
    },
    onEnd() {
      dragB.enable();
    },
  });

  /* 卡片 C/D：仅旋转 */
  mkRot("svg-card-3", "50%", "50%");
  mkRot("svg-card-4", "50%", "50%");

  buttons(s.controls, [
    ["rotateTo(#svg-card-3, 20)", () => (rotateTo(card3, 20))],
    [
      "moveBy(#svg-card-4, 20, 0)",
      () => (moveBy(card4, 20, 0)),
    ],
    [
      "transformMoveTo(#svg-card-4, 320, 240)",
      () => (transformMoveTo(card4, 320, 240)),
    ],
    [
      "moveTo(#svg-card-4, 300, 250)",
      () => (moveTo(card4, 300, 250)),
    ],
  ]);
}

/* ========================================================================== *
 * 5. Selectable (SVG)
 * ========================================================================== */
{
  const s = section({
    id: "svg-selectable",
    group: "Selectable",
    nav: "SVG 框选",
    api: "newSelectable(container, {targets, filter})",
    code: `import { newDraggable, newSelectable } from "uiik";

newSelectable("#svg-sel", {
  class: "uii-selector",
  selectingClass: "uii-selecting",
  selectedClass: "uii-selected",
  targets: ".sel-shape",
  mode: "overlap",
  // filter 返回 true 表示「排除」：不要从说明文字上起手框选。
  // 注意别写成 t => !t.ownerSVGElement——那会把 <svg> 根（画布空白处）也排除，
  // 结果只有按在图元上才能起手，空白处拖不出选择框。
  filter: (t) => t.classList.contains("svg-label"),
})

newDraggable("#svg-sel-mover", {
  grid: 10,
  containment: "#svg-sel",
  onEnd() {
    selector.updateTargets();
  },
})`,
    title: "SVG 框选：选择框为 SVG 元素",
    desc:
      "选择框本身是注入容器的一个 SVG 矩形，<code>targets</code> 用选择器指定可被选中的图形。" +
      "<code>filter</code> 判断是否排除（返回 true 即排除），可阻止从说明文字等装饰元素上起手。" +
      "<code>mode</code> 可切换 overlap / inclusion。",
    options: [
      "targets='.sel-shape'",
      "mode='overlap'|'inclusion'",
      "class/selectingClass/selectedClass",
      "filter=fn(el)",
      "onStart/onSelect/onEnd",
      "setOptions",
    ],
    html: `
      <div class="svg-frame">
        <svg class="svg-canvas" id="svg-sel" viewBox="0 0 620 340"></svg>
      </div>`,
  });

  const svg = s.stageHost.querySelector("#svg-sel");
  svg.append(gridLayer(620, 340));

  const shapes = [
    { x: 40, y: 40, w: 120, h: 80, c: "" },
    { x: 220, y: 90, w: 100, h: 70, c: "svg-shape--violet" },
    { x: 400, y: 40, w: 150, h: 100, c: "svg-shape--emerald" },
    { x: 120, y: 210, w: 110, h: 90, c: "svg-shape--amber" },
    { x: 300, y: 230, w: 140, h: 80, c: "svg-shape--rose" },
  ];
  shapes.forEach((sp, i) => {
    svg.append(
      svgEl("rect", {
        class: "svg-shape sel-shape " + sp.c,
        x: sp.x,
        y: sp.y,
        width: sp.w,
        height: sp.h,
        rx: 5,
        "data-name": "shape-" + (i + 1),
      })
    );
  });

  const hint = svgEl("text", { class: "svg-label", x: 40, y: 330 });
  hint.textContent = "按住左键拖动框选";
  svg.append(hint);

  const names = (list) => list.map((e) => e.dataset.name).join(", ") || "-";

  const selector = newSelectable("#svg-sel", {
    class: "uii-selector",
    selectingClass: "uii-selecting",
    selectedClass: "uii-selected",
    targets: ".sel-shape",
    mode: "overlap",
    // filter 返回 true 表示「排除」：不要从说明文字上起手框选。
    // 不能写成 t => !t.ownerSVGElement：那会把 <svg> 根（画布空白处）一并排除，
    // 于是只有按在图元上才能起手，空白处拖不出选择框。
    filter: (t) => t.classList.contains("svg-label"),
  });

  const wrap = el("div");
  s.controls.append(wrap);
  select(wrap, "mode", {
    value: "overlap",
    options: ["overlap", "inclusion"],
    onChange(v) {
      selector.setOptions({ mode: v });
    },
  });
  buttons(wrap, [
    [
      "clear selection",
      () => {
        svg.querySelectorAll(".uii-selected").forEach((n) => n.classList.remove("uii-selected"));
      },
      "btn--ghost",
    ],
  ]);

  /* 拖动一个图形，演示 updateTargets 之后重新框选 */
  const mover = svgEl("rect", {
    id: "svg-sel-mover",
    class: "svg-shape svg-shape--violet sel-shape",
    x: 470,
    y: 210,
    width: 110,
    height: 80,
    rx: 5,
    "data-name": "mover",
  });
  svg.append(mover);
  const selMoverInst = newDraggable("#svg-sel-mover", {
    grid: 10,
    containment: "#svg-sel",
    onEnd() {
      selector.updateTargets();
    },
  });
  gridSliders(wrap, selMoverInst, {
    x: 10,
    y: 10,
  });
}

/* ========================================================================== *
 * 6. Transform / 测量工具 (SVG)
 * ========================================================================== */
{
  const s = section({
    id: "svg-transform",
    group: "Transform",
    nav: "SVG 变换工具",
    api: "wrapper / getVertex / getStyleSize / getCenterXySVG",
    code: `import {
  wrapper,
  getBox,
  getStyleSize,
  getMatrixInfo,
  getCenterXySVG,
  getVertex,
} from "uiik";

// wrapper 对 SVG 有效：写入的是 transform 属性，而不是 style
const ut = wrapper(g);
ut.moveTo(160, 120);
ut.rotateTo(25);

// 测量：getStyleSize 优先取 getBBox，getCenterXySVG 能正确处理旋转与嵌套
const box = getBox(g, svg);
const [w, h] = getStyleSize(g);
const { scale, angle } = getMatrixInfo(g, true);
const [cx, cy] = getCenterXySVG(g, 0.5, 0.5);
const [vx, vy] = getVertex(inner, "0%", "0%");`,
    title: "SVG 变换与测量工具",
    desc:
      "<code>wrapper(&lt;g&gt;)</code> 对 SVG 同样有效（写入 transform 属性）。" +
      "右侧面板显示 SVG 专用测量函数结果：<code>getStyleSize</code> 走 <code>getBBox</code>，" +
      "<code>getCenterXySVG</code> 处理旋转与嵌套。",
    options: [
      "wrapper(g)",
      "ut.moveTo / moveToX / moveToY / rotateTo",
      "getVertex / calcVertex / parseOxy",
      "getStyleSize / getStyleXy / getMatrixInfo",
      "getRectInContainer / getRectCenter / getCenterXySVG",
      "isSVGEl / isVisible / getBox",
      "getPointInContainer / getPointOffset",
      "normalizeVector",
    ],
    html: `
      <div class="svg-frame">
        <svg class="svg-canvas" id="svg-tools" viewBox="0 0 620 300"></svg>
      </div>`,
  });

  const svg = s.stageHost.querySelector("#svg-tools");
  svg.append(gridLayer(620, 300));

  const g = svgEl("g", { id: "svg-tools-g" });
  const inner = svgEl("rect", {
    id: "svg-tools-rect",
    class: "svg-shape",
    x: 0,
    y: 0,
    width: 150,
    height: 110,
    rx: 6,
  });
  const innerLabel = svgEl("text", { class: "svg-label", x: 10, y: 24 });
  innerLabel.textContent = "150 x 110";
  g.append(inner, innerLabel);
  svg.append(g);
  g.setAttribute("transform", "translate(120 90)");

  const ut = wrapper(g);

  buttons(s.controls, [
    ["ut.moveTo(160,120)", () => ut.moveTo(160, 120)],
    ["ut.moveToX(300)", () => ut.moveToX(300)],
    ["ut.moveToY(140)", () => ut.moveToY(140)],
    ["ut.rotateTo(25)", () => ut.rotateTo(25)],
    ["rotateTo(g,0)", () => rotateTo(g, 0)],
    ["重置", () => {
      g.setAttribute("transform", "translate(120 90)");
      ut.normalize();
    }],
  ]);
}

/* ========================================================================== *
 * 7. Geometry in SVG space（纯函数）
 * ========================================================================== */
{
  const s = section({
    id: "svg-geometry",
    group: "Geometry",
    nav: "SVG 几何",
    api: "findSnap / snapGuides / fitRectInViewport / zoomAt",
    code: `import {
  findSnap,
  snapGuides,
  fitRectInViewport,
  zoomAt,
  panBy,
  snapToGrid,
} from "uiik";

// 几何函数与 DOM 无关，可直接用于 SVG 图元的布局求解

// 吸附求解 + 参考线
const result = findSnap(base, targets, { tolerance: 14, strategy: "nearest" });
const guides = snapGuides(base, targets, result, 30);

// 视口：一键把内容适配进 viewBox
const view = fitRectInViewport(
  { x: 40, y: 40, w: 440, h: 210 },
  { w: 520, h: 280 },
  { padding: 12, maxScale: 1 }
);

// 滚轮缩放（以指针为锚点）
zoomAt(view, toSvg(ev), ev.deltaY < 0 ? 1.12 : 1 / 1.12, {
  min: 0.4,
  max: 4,
});

// 拖动平移
panBy(view, q.x - last.x, q.y - last.y);

// 网格吸附
snapToGrid(133, 10);`,
    title: "在 SVG 坐标系里使用纯几何函数",
    desc:
      "几何函数与 DOM 无关，可直接用于 SVG 图元的布局求解。下例用 <code>findSnap</code> + <code>snapGuides</code> " +
      "驱动 SVG 中的对齐参考线，并用 <code>zoomAt</code> / <code>panBy</code> / <code>fitRectInViewport</code> " +
      "实现视口缩放（滚轮缩放、拖动平移）。",
    options: [
      "findSnap / snapGuides",
      "fitRectInViewport",
      "zoomAt / panBy",
      "snapToGrid",
    ],
    html: `
      <div class="geo">
        <div class="geo__canvas">
          <svg class="geo-svg" id="svg-geo" viewBox="0 0 520 280"></svg>
        </div>
        <div class="geo__panel" id="svg-geo-panel"></div>
      </div>`,
    noAside: true,
  });

  const svg = s.stageHost.querySelector("#svg-geo");
  const panel = s.stageHost.querySelector("#svg-geo-panel");
  s.stageHost.append(s.codeHost);
  svg.innerHTML = `
    <g id="sg-world">
      <rect x="40" y="40" width="200" height="120" rx="8" fill="rgba(56,189,248,.08)" stroke="var(--line)"></rect>
      <rect class="geo-rect geo-rect--target" data-t="0" x="70" y="70" width="120" height="70" rx="4"></rect>
      <rect class="geo-rect geo-rect--target" data-t="1" x="300" y="60" width="110" height="70" rx="4"></rect>
      <rect class="geo-rect geo-rect--target" data-t="2" x="300" y="180" width="140" height="70" rx="4"></rect>
      <g id="sg-guides"></g>
      <rect class="geo-rect geo-rect--active" id="sg-cand" x="180" y="170" width="110" height="70" rx="4"></rect>
    </g>
    <rect id="sg-viewport" x="0" y="0" width="520" height="280" fill="none" stroke="var(--warn)" stroke-width="1" stroke-dasharray="6 4"></rect>`;

  const world = svg.querySelector("#sg-world");
  const viewportRect = svg.querySelector("#sg-viewport");
  const cand = svg.querySelector("#sg-cand");
  const guides = svg.querySelector("#sg-guides");

  const targets = [
    { x: 70, y: 70, w: 120, h: 70 },
    { x: 300, y: 60, w: 110, h: 70 },
    { x: 300, y: 180, w: 140, h: 70 },
  ];
  let base = { x: 180, y: 170, w: 110, h: 70 };
  let result = findSnap(base, targets, { tolerance: 14, strategy: "nearest" });
  let view = { x: 0, y: 0, scale: 1 };
  let zoomable = false;

  const out = readout(panel, "结果");

  const renderSnap = () => {
    cand.setAttribute("x", base.x + result.dx);
    cand.setAttribute("y", base.y + result.dy);
    guides.innerHTML = snapGuides(base, targets, result, 30)
      .map((g) =>
        g.dir === "v"
          ? `<line class="geo-guide" x1="${g.coord}" y1="${g.from}" x2="${g.coord}" y2="${g.to}"></line>`
          : `<line class="geo-guide" x1="${g.from}" y1="${g.coord}" x2="${g.to}" y2="${g.coord}"></line>`
      )
      .join("");
    out([
      ["mode", zoomable ? "viewport" : "snap"],
      ["dx / dy", `${Math.round(result.dx)}, ${Math.round(result.dy)}`],
      ["view.scale", view.scale.toFixed(3)],
      ["view.x / y", `${Math.round(view.x)}, ${Math.round(view.y)}`],
    ]);
  };

  const applyView = () => {
    world.setAttribute("transform", `translate(${view.x} ${view.y}) scale(${view.scale})`);
    viewportRect.setAttribute("x", view.x);
    viewportRect.setAttribute("y", view.y);
    viewportRect.setAttribute("width", 520 * view.scale);
    viewportRect.setAttribute("height", 280 * view.scale);
    renderSnap();
  };

  const toSvg = (ev) => {
    const r = svg.getBoundingClientRect();
    const k = 520 / r.width;
    return { x: (ev.clientX - r.left) * k, y: (ev.clientY - r.top) * k };
  };

  svg.addEventListener("pointerdown", (ev) => {
    const p = toSvg(ev);
    if (zoomable) {
      let last = p;
      svg.setPointerCapture(ev.pointerId);
      const move = (e) => {
        const q = toSvg(e);
        view = panBy(view, q.x - last.x, q.y - last.y);
        last = q;
        applyView();
      };
      const up = () => {
        svg.removeEventListener("pointermove", move);
        svg.removeEventListener("pointerup", up);
      };
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerup", up);
      return;
    }

    const sx = ev.clientX;
    const sy = ev.clientY;
    const origin = { ...base };
    svg.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const box = svg.getBoundingClientRect();
      const k = 520 / box.width;
      base = {
        ...origin,
        x: Math.max(0, Math.min(520 - origin.w, origin.x + (e.clientX - sx) * k)),
        y: Math.max(0, Math.min(280 - origin.h, origin.y + (e.clientY - sy) * k)),
      };
      result = findSnap(base, targets, { tolerance: 14, strategy: "nearest" });
      renderSnap();
    };
    const up = () => {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up);
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up);
  });

  svg.addEventListener(
    "wheel",
    (ev) => {
      if (!zoomable) return;
      ev.preventDefault();
      view = zoomAt(view, toSvg(ev), ev.deltaY < 0 ? 1.12 : 1 / 1.12, {
        min: 0.4,
        max: 4,
      });
      applyView();
    },
    { passive: false }
  );

  select(panel, "mode", {
    value: "snap",
    options: ["snap", "viewport"],
    onChange(v) {
      zoomable = v === "viewport";
      if (zoomable) {
        view = fitRectInViewport(
          { x: 40, y: 40, w: 440, h: 210 },
          { w: 520, h: 280 },
          { padding: 12, maxScale: 1 }
        );
      } else {
        view = { x: 0, y: 0, scale: 1 };
      }
      applyView();
    },
  });
  buttons(panel, [
    [
      "snapToGrid(133,10)",
      () => {
        cand.setAttribute("x", snapToGrid(133, 10));
        cand.setAttribute("y", snapToGrid(-7, 10));
        renderSnap();
      },
    ],
    [
      "fitRectInViewport",
      () => {
        view = fitRectInViewport(
          { x: 40, y: 40, w: 440, h: 210 },
          { w: 520, h: 280 },
          { padding: 12, maxScale: 1 }
        );
        applyView();
      },
    ],
  ]);
  renderSnap();
}

/* ========================================================================== *
 * 8. SVG 几何：对齐 / 分布
 * ========================================================================== */
{
  const s = section({
    id: "svg-geometry-align",
    group: "Geometry",
    nav: "对齐·分布",
    api: "alignRects / distributeRects / unionRect",
    code: `import { alignRects, distributeRects, unionRect } from "uiik";

// 几何函数只吃 Rect，SVG 图元用 getRectInContainer 量出即可
const rects = [
  { x: 30, y: 20, w: 150, h: 44 },
  { x: 210, y: 84, w: 84, h: 56 },
  { x: 96, y: 160, w: 200, h: 38 },
];

// 对齐：mode 缺省为 rects 自身的并集
const aligned = alignRects(rects, "centerX");

// 沿单轴等间距分布；align 须为垂直于 dir 的模式，否则忽略
const spread = distributeRects(aligned, "v", { gap: 12, align: "centerX" });

// 并集矩形：整体包围盒，可再次作为对齐基准
const box = unionRect(rects);`,
    title: "alignRects / distributeRects 在 SVG 中",
    desc:
      "同一组纯几何函数，作用于 SVG 图元量出的 Rect。" +
      "切换对齐模式会自动换上匹配的布局，并画出对齐参考线；" +
      "<code>distributeRects</code> 的 <code>align</code> 用于在分布的同时保持另一轴整齐。",
    options: [
      "alignRects(rects, mode, to)",
      "distributeRects(rects, dir, {gap, align})",
      "unionRect(rects)",
    ],
    html: `
      <div class="geo">
        <div class="geo__canvas">
          <svg class="geo-svg" id="sga-svg" viewBox="0 0 520 260"></svg>
        </div>
        <div class="geo__panel" id="sga-panel"></div>
      </div>`,
    noAside: true,
  });

  const svg = s.stageHost.querySelector("#sga-svg");
  const panel = s.stageHost.querySelector("#sga-panel");
  s.stageHost.append(s.codeHost);
  svg.innerHTML = `<g id="sga-shapes"></g>`;
  const shapes = svg.querySelector("#sga-shapes");

  // 两套布局各自适配对齐轴：column 演示 x 轴对齐，row 演示 y 轴对齐
  const LAYOUTS = {
    column: () => [
      { x: 30, y: 20, w: 150, h: 44 },
      { x: 210, y: 84, w: 84, h: 56 },
      { x: 96, y: 160, w: 200, h: 38 },
      { x: 330, y: 116, w: 96, h: 66 },
    ],
    row: () => [
      { x: 20, y: 30, w: 96, h: 92 },
      { x: 148, y: 130, w: 128, h: 52 },
      { x: 310, y: 66, w: 78, h: 122 },
      { x: 412, y: 168, w: 88, h: 60 },
    ],
  };
  const isYAxis = (m) => m === "top" || m === "centerY" || m === "bottom";

  let mode = "left";
  let rects = LAYOUTS.column();
  let dir = "v";
  let gap = 0;
  let crossAlign = "";

  const out = readout(panel, "结果");

  const guideLine = (ref) => {
    if (!ref) return "";
    const pad = 10;
    if (isYAxis(mode)) {
      const y = mode === "top" ? ref.y : mode === "centerY" ? ref.y + ref.h / 2 : ref.y + ref.h;
      return `<line x1="${ref.x - pad}" y1="${y}" x2="${ref.x + ref.w + pad}" y2="${y}"
        stroke="var(--accent)" stroke-width="1" stroke-dasharray="5 3" opacity=".8"></line>`;
    }
    const x = mode === "left" ? ref.x : mode === "centerX" ? ref.x + ref.w / 2 : ref.x + ref.w;
    return `<line x1="${x}" y1="${ref.y - pad}" x2="${x}" y2="${ref.y + ref.h + pad}"
      stroke="var(--accent)" stroke-width="1" stroke-dasharray="5 3" opacity=".8"></line>`;
  };

  const draw = () => {
    const aligned = alignRects(rects, mode);
    const spread = crossAlign
      ? distributeRects(aligned, dir, { gap, align: crossAlign })
      : aligned;
    const ref = unionRect(rects);
    shapes.innerHTML =
      (ref
        ? `<rect x="${ref.x - 4}" y="${ref.y - 4}" width="${ref.w + 8}" height="${
            ref.h + 8
          }" fill="none" stroke="var(--line)" stroke-dasharray="3 3"></rect>`
        : "") +
      guideLine(ref) +
      spread
        .map((r, i) => {
          const c = rectCenter(r);
          return (
            `<g><rect class="geo-rect" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="4" data-i="${i}"></rect>` +
            `<text class="geo-label" x="${c.x}" y="${c.y + 3}" text-anchor="middle">${Math.round(r.x)},${Math.round(r.y)}</text></g>`
          );
        })
        .join("");

    out([
      ["对齐轴", isYAxis(mode) ? "y（top/centerY/bottom）" : "x（left/centerX/right）"],
      ["unionRect", fmt(unionRect(rects))],
      [
        "alignRects",
        fmt(aligned.map((r) => `${Math.round(r.x)},${Math.round(r.y)}`)),
      ],
    ]);
  };

  svg.addEventListener("pointerdown", (ev) => {
    const g = ev.target.closest("[data-i]");
    if (!g) return;
    const i = Number(g.dataset.i);
    const box = svg.getBoundingClientRect();
    const k = 520 / box.width;
    const startX = ev.clientX;
    const startY = ev.clientY;
    const origin = { ...rects[i] };
    svg.setPointerCapture(ev.pointerId);
    const move = (e) => {
      rects[i] = {
        ...origin,
        x: Math.max(0, Math.min(520 - origin.w, origin.x + (e.clientX - startX) * k)),
        y: Math.max(0, Math.min(260 - origin.h, origin.y + (e.clientY - startY) * k)),
      };
      draw();
    };
    const up = () => {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up);
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up);
  });

  select(panel, "align", {
    value: mode,
    options: ["left", "centerX", "right", "top", "centerY", "bottom"],
    onChange(v) {
      mode = v;
      const cur = LAYOUTS[isYAxis(v) ? "row" : "column"]();
      const sameShape =
        rects.length === cur.length &&
        rects.every((r, i) => r.w === cur[i].w && r.h === cur[i].h);
      if (!sameShape) rects = cur;
      draw();
    },
  });
  select(panel, "distribute", {
    value: dir,
    options: ["v", "h", "off"],
    onChange(v) {
      dir = v === "off" ? "" : v;
      crossAlign = "";
      draw();
    },
  });
  select(panel, "crossAlign", {
    value: crossAlign,
    options: ["", "left", "centerX", "right", "top", "centerY", "bottom"],
    onChange(v) {
      crossAlign = v;
      draw();
    },
  });
  slider(panel, "gap", {
    min: 0,
    max: 40,
    step: 2,
    value: 0,
    onInput(v) {
      gap = v;
      draw();
    },
  });
  buttons(panel, [
    ["重置", () => ((rects = LAYOUTS[isYAxis(mode) ? "row" : "column"]()), draw())],
  ]);
  draw();
}

/* ========================================================================== *
 * 9. SVG 几何：八向缩放求解
 * ========================================================================== */
{
  const s = section({
    id: "svg-geometry-resize",
    group: "Geometry",
    nav: "八向缩放",
    api: "resizeRect / snapToGrid / rectInset",
    code: `import { resizeRect, snapToGrid, rectInset } from "uiik";

// 八向缩放：dir 指「拖动哪一侧的手柄」，对侧保持不动
const next = resizeRect(start, "se", dx, dy, {
  minW: 60,
  maxW: 320,
  keepAspect: false,
  grid: 8,
});

// 四舍五入吸附，负坐标同样正确：-7 → -10
snapToGrid(-7, 10); // -10

// 按边距内缩
rectInset({ x: 0, y: 0, w: 200, h: 140 }, { left: 20, top: 20 });`,
    title: "resizeRect 在 SVG 图元上的八向缩放",
    desc:
      "按下并拖动即可求解新矩形；<code>minW/maxW/keepAspect/grid</code> 由右侧控件实时驱动。" +
      "注意 SVG 用 <code>getBBox()</code> 量自身尺寸，所以 min/max 直接是用户单位。",
    options: [
      "resizeRect(start, dir, dx, dy, opts)",
      "snapToGrid(v, grid)",
      "rectInset(rect, insets)",
      "keepAspect",
      "grid",
    ],
    html: `
      <div class="geo">
        <div class="geo__canvas">
          <svg class="geo-svg" id="sgr-svg" viewBox="0 0 520 240"></svg>
        </div>
        <div class="geo__panel" id="sgr-panel"></div>
      </div>`,
    noAside: true,
  });

  const svg = s.stageHost.querySelector("#sgr-svg");
  const panel = s.stageHost.querySelector("#sgr-panel");
  s.stageHost.append(s.codeHost);
  svg.innerHTML = `
    <rect class="geo-rect" id="sgr-box" x="120" y="60" width="180" height="110" rx="4"></rect>
    <text class="geo-label" id="sgr-label" x="210" y="118" text-anchor="middle"></text>`;

  const start = { x: 120, y: 60, w: 180, h: 110 };
  const state = { dir: "se", minW: 60, maxW: 360, grid: 0, keepAspect: false };
  const box = svg.querySelector("#sgr-box");
  const label = svg.querySelector("#sgr-label");
  const out = readout(panel, "结果");

  const opts = () => ({
    minW: state.minW,
    maxW: state.maxW,
    minH: 40,
    maxH: 220,
    keepAspect: state.keepAspect,
    grid: state.grid,
  });

  const render = (rect) => {
    box.setAttribute("x", rect.x);
    box.setAttribute("y", rect.y);
    box.setAttribute("width", rect.w);
    box.setAttribute("height", rect.h);
    label.textContent = `${Math.round(rect.w)} x ${Math.round(rect.h)}`;
    label.setAttribute("x", rect.x + rect.w / 2);
    label.setAttribute("y", rect.y + rect.h / 2 + 4);
  };

  svg.addEventListener("pointerdown", (ev) => {
    const r = svg.getBoundingClientRect();
    const k = 520 / r.width;
    const sx = ev.clientX;
    const sy = ev.clientY;
    svg.setPointerCapture(ev.pointerId);
    const solve = (e) =>
      resizeRect(start, state.dir, (e.clientX - sx) * k, (e.clientY - sy) * k, opts());
    const move = (e) => render(solve(e));
    const up = () => {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up);
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up);
  });

  select(panel, "dir", {
    value: state.dir,
    options: ["n", "s", "e", "w", "ne", "nw", "se", "sw"],
    onChange(v) {
      state.dir = v;
    },
  });
  slider(panel, "minW", {
    min: 0,
    max: 160,
    step: 10,
    value: 60,
    onInput(v) {
      state.minW = v;
      render(resizeRect(start, state.dir, 0, 0, opts()));
    },
  });
  slider(panel, "grid", {
    min: 0,
    max: 40,
    step: 2,
    value: 0,
    onInput(v) {
      state.grid = v;
    },
  });
  const ka = el("input", { type: "checkbox" });
  ka.addEventListener("change", () => {
    state.keepAspect = ka.checked;
  });
  panel.append(el("label", { class: "field" }, [ka, "keepAspect"]));
  buttons(panel, [
    [
      "rectInset 内缩",
      () =>
        render(rectInset({ x: start.x, y: start.y, w: 200, h: 140 }, { left: 20, top: 20 })),
      "btn--ghost",
    ],
    [
      "snapToGrid 对齐",
      () => render({ x: snapToGrid(133, 10), y: snapToGrid(-7, 10), w: 200, h: 140 }),
      "btn--ghost",
    ],
    ["重置", () => render(start), "btn--ghost"],
  ]);
  out([
    ["snapToGrid(-7,10)", snapToGrid(-7, 10)],
    ["snapToGrid(-12,10)", snapToGrid(-12, 10)],
  ]);
  render(start);
}

/* ========================================================================== *
 * 8. HTML-only 说明
 * ========================================================================== */
{
  const s = section({
    id: "svg-unsupported",
    group: "Notes",
    nav: "适用范围",
    api: "HTML only: newSplittable / newSortable / newCollisionDetector",
    code: `import {
  newDraggable,
  newResizable,
  newRotatable,
  newSelectable,
} from "uiik";

// SVG 中可用的交互
newDraggable("#svg-shape", { useTransform: true });
newResizable("#svg-shape", { handle: "#svg-shape .rz" });
newRotatable("#svg-shape", { handle: "#svg-shape .rot-handle" });
newSelectable("#svg-root", { targets: "#svg-root .pick" });

// 以下仅适用于 HTML，SVG 中不可用：
// newSplittable         依赖 offsetWidth / offsetTop 计算分割区域
// newSortable           依赖 offsetLeft / offsetTop / style.transform 做列表位移
// newCollisionDetector  源元素尺寸取自 offsetWidth / offsetHeight
// newDroppable          依赖 mouseenter / mousemove 的 HTML 元素数组
// ghost 模式            拖影尺寸取自 ghostNode.style.width / height`,
    title: "哪些 API 不适用于 SVG",
    desc: "以下能力依赖 HTML 布局盒，在 SVG 中不可用（详见源码）。",
    options: [],
    tags: ["note"],
    html: `
      <div class="stage stage--short" style="padding:18px">
        <ul style="margin:0;padding-left:20px;font-size:13px;line-height:2;color:var(--text-dim)">
          <li><b>newSplittable</b> — 依赖 <code>offsetWidth / offsetTop</code> 计算分割区域，仅 HTML。</li>
          <li><b>newSortable</b> — 依赖 <code>offsetLeft / offsetTop / style.transform</code> 做列表位移，仅 HTML。</li>
          <li><b>newCollisionDetector</b> — 源元素尺寸取自 <code>offsetWidth/offsetHeight</code>，仅 HTML（SVG 可自行用 <code>getBBox</code> 计算）。</li>
          <li><b>newDroppable</b> — 依赖 <code>mouseenter/mousemove</code> 与 HTML 元素数组，建议只在 HTML 侧使用。</li>
          <li><code>ghost</code> 模式在 SVG 上暂不可用：拖影尺寸取自 <code>ghostNode.style.width/height</code>，SVG 图元没有该属性。</li>
          <li>可用的：<b>newDraggable</b>、<b>newResizable</b>、<b>newRotatable</b>、<b>newSelectable</b>、全部 geometry / transform / utils 函数。</li>
        </ul>
      </div>`,
    noAside: true,
  });

  s.stageHost.append(s.codeHost);
}

/* --------------------------------- mount --------------------------------- */

mount({ nav: "#sidenav", main: "#main" }, { navTitle: "API 分类" });
