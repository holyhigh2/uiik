/**
 * uiik · DOM 示例
 * 按 API 分类组织，覆盖全部导出函数与主要选项。 */

import uii, {
  alignRects,
  calcVertex,
  distributeRects,
  DRAGGING_RULE,
  EDGE_THRESHOLD,
  findSnap,
  fitRectInViewport,
  // dom utils
  getBox,
  getCenterXy,
  getCenterXySVG,
  getMatrixInfo,
  getPointInContainer,
  getPointOffset,
  getRectBottom,
  getRectCenter,
  getRectInContainer,
  getRectRight,
  getStyleSize,
  getStyleXy,
  getTranslate,
  getVertex,
  isSVGEl,
  isVisible,
  lockPage,
  moveBy,
  moveTo,
  newCollisionDetector,
  // interactions
  newDraggable,
  newDroppable,
  newResizable,
  newRotatable,
  newSelectable,
  newSortable,
  newSplittable,
  normalizeVector,
  // constants
  ONE_ANG,
  ONE_RAD,
  panBy,
  parseOxy,
  rectContains,
  rectInset,
  rectsOverlap,
  resizeRect,
  restoreCursor,
  rotateTo,
  saveCursor,
  setCursor,
  snapGuides,
  snapToGrid,
  THRESHOLD,
  transformMoveTo,
  UII_KEY,
  unionRect,
  unlockPage,
  // transform
  wrapper,
  zoomAt
} from "./uiik.js";

import {
  buttons,
  domHandles,
  el,
  fmt,
  gridSliders,
  mount,
  readout,
  section,
  select,
  slider,
} from "./demo.js";

/* ========================================================================== *
 * 1. Draggable
 * ========================================================================== */

/* ------------------------------ 1.1 basics ------------------------------- */
{
  const s = section({
    id: "draggable-basics",
    group: "Draggable",
    nav: "基础拖动",
    api: "newDraggable(els, opts)",
    code: `import { newDraggable } from "uiik";

newDraggable("#db-free", {
  self: true,
  containment: true,
  cursor: { default: "grab", active: "grabbing" },
})

newDraggable("#db-handle", {
  handle: ".tile__bar",
  filter: ".tile__actions",
  containment: true,
  classes: "tile--dragging",
})

newDraggable("#db-threshold", {
  threshold: 24,
  containment: true,
  onStart() {
    thDragged = true;
    thEl.style.borderRadius = "50%";
  },
  onEnd() {
    thEl.style.borderRadius = "12px";
  },
})`,
    title: "基础拖动 · self / handle / filter / threshold",
    desc:
      "左：整块元素拖动（<code>self: true</code>，忽略子元素冒泡）。" +
      "中：仅标题栏响应（<code>handle</code>），并用 <code>filter</code> 排除右侧按钮。" +
      "右：位移超过 <code>threshold</code> 才开始判定为拖动。",
    options: [
      "self=true",
      "handle=.tile__bar",
      "filter=.tile__actions",
      "threshold=24",
      "useTransform=true",
      "onPointerDown",
      "onStart",
      "onDrag",
      "onEnd",
      "enable/disable/setOptions/getOptions/destroy",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="tile" id="db-free" style="left:24px;top:24px">self 拖动</div>
        <div class="tile tile--violet" id="db-handle" style="left:190px;top:24px;width:170px">
          <div class="tile__bar"></div>
          <div class="tile__actions">✕</div>
          <span style="margin-top:12px">handle 拖动</span>
        </div>
        <div class="tile tile--emerald" id="db-threshold" style="left:430px;top:24px">
          threshold 24
        </div>
        <div class="stage__hint stage__hint--tl">拖动我</div>
      </div>`,
  });

  const freeInst = newDraggable("#db-free", {
    self: true,
    containment: true,
    cursor: { default: "grab", active: "grabbing" },
  });

  newDraggable("#db-handle", {
    handle: ".tile__bar",
    filter: ".tile__actions",
    containment: true,
    classes: "tile--dragging",
  });

  const thEl = document.getElementById("db-threshold");
  let thDragged = false;
  newDraggable("#db-threshold", {
    threshold: 24,
    containment: true,
    onStart() {
      thDragged = true;
      thEl.style.borderRadius = "50%";
    },
    onEnd() {
      thEl.style.borderRadius = "12px";
    },
  });

  let enabled = true;
  const render = readout(s.controls, "实例方法 · #db-free");
  const state = () =>
    render([
      ["enabled", String(enabled)],
      ["ele", fmt(freeInst.ele)],
      ["threshold", String(freeInst.getOptions().threshold ?? "-")],
      ["classes", freeInst.getOptions().classes ?? "-"],
    ]);
  state();
  buttons(s.controls, [
    [
      "disable()",
      () => {
        freeInst.disable();
        enabled = false;
        state();
      },
    ],
    [
      "enable()",
      () => {
        freeInst.enable();
        enabled = true;
        state();
      },
    ],
    [
      "setOptions({threshold:60})",
      () => {
        freeInst.setOptions({ threshold: 60 });
        state();
      },
    ],
    [
      "destroy()",
      () => {
        freeInst.destroy();
        enabled = false;
        state();
      },
      "btn--ghost",
    ],
  ]);
}

/* ---------------------------- 1.2 containment ---------------------------- */
{
  const s = section({
    id: "draggable-containment",
    group: "Draggable",
    nav: "活动范围",
    api: "newDraggable(els, {containment, watch})",
    code: `import { newDraggable } from "uiik";

newDraggable("#ct-1, #ct-2", { containment: true })

newDraggable("#ct-3", { containment: "#ct-stage-2" })

newDraggable(".ct-item", { watch: ".ct-list", containment: true })`,
    title: "containment 活动范围 & watch 动态监听",
    desc:
      "<code>containment</code> 支持 <code>true</code>（取父元素）、选择器字符串或元素本身。" +
      "<code>watch</code> 让选择器新增的子元素自动获得拖动能力 —— 点击按钮追加方块后可直接拖动。",
    options: [
      "containment=true",
      "containment='#ct-stage-2'",
      "watch='.ct-list'",
    ],
    html: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
        <div>
          <div class="aside__title" style="margin-bottom:6px">containment: true</div>
          <div class="stage stage--short" id="ct-stage-1">
            <div class="tile" id="ct-1" style="left:16px;top:16px;width:78px;height:56px">1</div>
            <div class="tile tile--violet" id="ct-2" style="left:130px;top:16px;width:78px;height:56px">2</div>
          </div>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">containment: 选择器</div>
          <div class="stage stage--short" id="ct-stage-2">
            <div class="tile tile--emerald" id="ct-3" style="left:16px;top:16px;width:78px;height:56px">3</div>
          </div>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">watch: 动态子元素</div>
          <div class="stage stage--short ct-list" id="ct-stage-3">
            <div class="tile tile--amber ct-item" style="left:16px;top:16px;width:78px;height:52px">a</div>
          </div>
        </div>
      </div>`,
  });

  newDraggable("#ct-1, #ct-2", { containment: true });
  newDraggable("#ct-3", { containment: "#ct-stage-2" });

  const list = document.getElementById("ct-stage-3");
  newDraggable(".ct-item", { watch: ".ct-list", containment: true });

  let n = 1;
  buttons(s.controls, [
    [
      "追加子元素",
      () => {
        n++;
        const item = el("div", {
          class: "tile tile--amber ct-item",
          style: `left:${16 + (n % 3) * 92}px;top:${16 + Math.floor(n / 3) * 62}px;width:78px;height:52px`,
          text: String.fromCharCode(96 + n),
        });
        list.append(item);
      },
      "btn--primary",
    ],
  ]);
}

/* ------------------------- 1.3 axis / grid / transform ------------------- */
{
  const s = section({
    id: "draggable-axis-grid",
    group: "Draggable",
    nav: "方向·网格·位移方式",
    api: "newDraggable(els, {direction, grid, useTransform})",
    code: `import { newDraggable } from "uiik";

newDraggable("#dg-h", { direction: "h", containment: true })

newDraggable("#dg-v", { direction: "v", containment: true })

newDraggable("#dg-grid", {
  grid: [16, 32],
  containment: true,
})

newDraggable("#dg-abs", {
  useTransform: false,
  containment: true,
})`,
    title: "direction 单向拖动 / grid 网格吸附 / useTransform",
    desc:
      "<code>direction: 'h' | 'v'</code> 限制单轴；<code>grid</code> 传数字或 <code>[x, y]</code> 数组实现网格吸附；" +
      "<code>useTransform: false</code> 时改写 <code>left/top</code> 而非 <code>transform</code>。",
    options: [
      "direction='h'",
      "direction='v'",
      "grid=[16,32]",
      "useTransform=false",
      "setOptions",
    ],
    html: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">
        <div>
          <div class="aside__title" style="margin-bottom:6px">direction: 'h'</div>
          <div class="stage stage--short">
            <div class="tile" id="dg-h" style="left:14px;top:22px;width:110px;height:52px">水平</div>
          </div>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">direction: 'v'</div>
          <div class="stage stage--short">
            <div class="tile tile--violet" id="dg-v" style="left:16px;top:14px;width:110px;height:52px">垂直</div>
          </div>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">grid: [16, 32]</div>
          <div class="stage stage--short stage--grid-bg">
            <div class="tile tile--emerald" id="dg-grid" style="left:16px;top:16px;width:96px;height:56px">吸附</div>
          </div>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">useTransform: false</div>
          <div class="stage stage--short">
            <div class="tile tile--amber" id="dg-abs" style="left:16px;top:22px;width:104px;height:52px">left/top</div>
          </div>
        </div>
      </div>`,
  });

  newDraggable("#dg-h", { direction: "h", containment: true });
  newDraggable("#dg-v", { direction: "v", containment: true });

  const gridEl = document.getElementById("dg-grid");
  const gridInst = newDraggable("#dg-grid", {
    grid: [16, 32],
    containment: true,
  });

  const absEl = document.getElementById("dg-abs");
  newDraggable("#dg-abs", {
    useTransform: false,
    containment: true,
  });

  const gWrap = el("div");
  s.controls.append(gWrap);
  gridSliders(gWrap, gridInst, {
    x: 16,
    y: 32,
  });
}

/* -------------------------------- 1.4 ghost ------------------------------ */
{
  const s = section({
    id: "draggable-ghost",
    group: "Draggable",
    nav: "ghost 模式",
    api: "newDraggable(els, {ghost, ghostClass, ghostTo})",
    code: `import { newDraggable } from "uiik";

newDraggable("#gh-plain", {
  ghost: true,
  containment: true,
  onClone({ clone, draggable }) {
    clone.classList.add("ghost-outline");
  },
})

newDraggable("#gh-class", {
  ghost: true,
  ghostClass: "ghost-plain",
  containment: true,
})

newDraggable("#gh-custom", {
  containment: true,
  ghost(dom) {
    const d = el("div", {
      class: "tile tile--outline",
      style:
        "position:absolute;width:120px;height:40px;border:2px dashed var(--warn)",
      text: "自定义 ghost",
    });
    d.style.left = dom.style.left;
    d.style.top = dom.style.top;
    return d;
  },
})

newDraggable("#gh-to", {
  ghost: true,
  ghostClass: "ghost-outline",
  ghostTo: "#dg-layer",
  containment: true,
})`,
    title: "ghost 拖影：内置副本 / 自定义副本 / ghostTo 挂载点",
    desc:
      "开启 <code>ghost</code> 后拖动的是副本，原元素在结束时跳到最终位置。" +
      "<code>ghost</code> 可传函数返回自定义节点，<code>ghostTo</code> 指定副本挂载容器。",
    options: ["ghost=true", "ghost=fn(el)", "ghostClass", "ghostTo='#dg-layer'", "onClone"],
    html: `
      <div class="stage stage--tall">
        <div id="dg-layer" style="position:absolute;inset:0;pointer-events:none"></div>
        <div class="tile" id="gh-plain" style="left:26px;top:26px">ghost: true</div>
        <div class="tile tile--violet" id="gh-class" style="left:190px;top:26px">ghostClass</div>
        <div class="tile tile--emerald" id="gh-custom" style="left:26px;top:140px">ghost: fn</div>
        <div class="tile tile--amber" id="gh-to" style="left:190px;top:140px">ghostTo</div>
        <div class="stage__hint" style="top:auto;bottom:10px">拖动任意方块</div>
      </div>`,
  });

  newDraggable("#gh-plain", {
    ghost: true,
    containment: true,
    onClone({ clone, draggable }) {
      clone.classList.add("ghost-outline");
    },
  });

  newDraggable("#gh-class", {
    ghost: true,
    ghostClass: "ghost-plain",
    containment: true,
  });

  newDraggable("#gh-custom", {
    containment: true,
    ghost(dom) {
      const d = el("div", {
        class: "tile tile--outline",
        style:
          "position:absolute;width:120px;height:40px;border:2px dashed var(--warn)",
        text: "自定义 ghost",
      });
      d.style.left = dom.style.left;
      d.style.top = dom.style.top;
      return d;
    },
  });

  newDraggable("#gh-to", {
    ghost: true,
    ghostClass: "ghost-outline",
    ghostTo: "#dg-layer",
    containment: true,
  });
}

/* --------------------------- 1.5 group & cursor -------------------------- */
{
  const s = section({
    id: "draggable-group",
    group: "Draggable",
    nav: "分组·层级·光标",
    api: "newDraggable(els, {group, zIndex, classes, cursor, mouseButton})",
    code: `import { newDraggable } from "uiik";

newDraggable("#dg-a1, #dg-a2, #dg-a3", {
  group: "alpha",
  zIndex: 1200,
  classes: "tile--dragging",
  cursor: { default: "grab", active: "grabbing", over: "copy" },
  mouseButton: "all",
  containment: true,
})

newDraggable("#dg-b1", {
  group: "beta",
  zIndex: 1300,
  mouseButton: "left",
  containment: true,
})

newDraggable("#dg-b2", {
  group: "beta",
  zIndex: 1300,
  mouseButton: "all",
  containment: true,
})`,
    title: "group 分组置顶 / classes 状态类 / cursor 三态 / mouseButton",
    desc:
      "同一 <code>group</code> 的元素拖动时自动互相置顶；<code>classes</code> 在拖动中追加到元素；" +
      "<code>cursor</code> 分 default / active / over 三态；<code>mouseButton</code> 可限定响应按键。",
    options: [
      "group='alpha'",
      "zIndex=1200",
      "classes='tile--dragging'",
      "cursor{default,active,over}",
      "mouseButton='all' / 'left'",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="tile" id="dg-a1" style="left:26px;top:26px;z-index:1">alpha 1</div>
        <div class="tile tile--violet" id="dg-a2" style="left:150px;top:26px;z-index:2">alpha 2</div>
        <div class="tile tile--emerald" id="dg-a3" style="left:274px;top:26px;z-index:3">alpha 3</div>
        <div class="tile tile--rose" id="dg-b1" style="left:150px;top:126px;z-index:4">
          beta · 左键
        </div>
        <div class="tile tile--amber" id="dg-b2" style="left:274px;top:126px;z-index:5">
          beta · 任意键        </div>
        <div class="stage__hint" style="top:auto;bottom:10px">
          alpha （mouseButton:'all'，左键与右键均可拖动；左键）beta · 左键 仅响应左键        </div>
      </div>`,
  });

  newDraggable("#dg-a1, #dg-a2, #dg-a3", {
    group: "alpha",
    zIndex: 1200,
    classes: "tile--dragging",
    cursor: { default: "grab", active: "grabbing", over: "copy" },
    mouseButton: "all",
    containment: true,
  });

  newDraggable("#dg-b1", {
    group: "beta",
    zIndex: 1300,
    mouseButton: "left",
    containment: true,
  });

  newDraggable("#dg-b2", {
    group: "beta",
    zIndex: 1300,
    mouseButton: "all",
    containment: true,
  });
}

/* -------------------------------- 1.6 snap ------------------------------- */
{
  const s = section({
    id: "draggable-snap",
    group: "Draggable",
    nav: "吸附 snap",
    api: "newDraggable(els, {snap, snapOptions, onSnap})",
    code: `import { newDraggable } from "uiik";

newDraggable("#sn-drag", {
  grid: 8,
  ghost: true,
  ghostClass: "ghost-outline",
  containment: true,
  snap: ".snappable",
  snapOptions: {
    tolerance: 18,
    toleranceY: 12,
    points: ["start", "center", "end"],
    strategy: "nearest",
    container: stage,
  },
  onDrag() {
    // onSnap 只在方向变化时触发，拖动过程中持续重绘才能让参考线跟随
    renderGuides();
  },
  onEnd() {
    snapRef = null;
    hideGuides(gh, gv);
  },
  onSnap(data) {
    const { dirH, dirV, dx, dy } = data;
    snapRef = data;
    renderGuides();
  },
})

newDraggable("#sn-manual", {
  containment: true,
  onDrag({ x, y }) {
    const candidate = { x, y, w: manual.offsetWidth, h: manual.offsetHeight };
    const result = findSnap(candidate, targetRects(), { tolerance: 24 });
    manualGhost.style.left = (x + result.dx) + "px";
    manualGhost.style.top = (y + result.dy) + "px";
    drawGuideList(snapGuides(candidate, targetRects(), result, 30));
    return false; // 位移完全交给外部
  },
  onEnd() {
    guideHost.replaceChildren();
    manual.style.left = manualGhost.style.left;
    manual.style.top = manualGhost.style.top;
  },
})`,
    title: "snap 元素吸附与参考线",
    desc:
      "<code>snap</code> 支持选择器 / 元素 / 数组 / 返回数组的函数；<code>snapOptions</code> 控制容差、锚点与取舍策略。" +
      "参考线用 <code>getBoundingClientRect</code> 实时绘制：<code>onSnap</code> 只在吸附方向变化时触发一次且为异步派发，" +
      "拿到的 <code>el</code> 是 ghost 副本（<code>getTranslate(el)</code> 只是位移量，不是容器内坐标），" +
      "因此示例在 <code>onDrag</code> 中持续重绘。" +
      "<br />下半部分演示位移完全由外部控制（<code>onDrag</code> 返回 <code>false</code>）：" +
      "库在命中吸附的那一帧会跳过 <code>onDrag</code> 并自行移动元素，故这里改用 geometry 的 " +
      "<code>findSnap</code> 求吸附量、<code>snapGuides</code> 生成参考线 —— 得到的 dx/dy 与 onSnap 完全一致。",
    options: [
      "snap='.snappable'",
      "snapOptions.container",
      "tolerance / toleranceY",
      "points=['start','center','end']",
      "strategy='nearest'",
      "onSnap",
      "onDrag→false",
      "grid=8",
      "ghost",
    ],
    html: `
      <div style="display:grid;gap:14px">
        <div class="stage" id="sn-stage" style="height:250px">
          <div class="snappable" style="left:20px;top:24px;width:110px;height:70px"></div>
          <div class="snappable" style="left:230px;top:150px;width:90px;height:60px"></div>
          <div class="snappable" style="left:380px;top:40px;width:120px;height:80px"></div>
          <div class="snappable" style="left:170px;top:60px;width:70px;height:50px"></div>
          <div class="guide guide--h" id="sn-gh" hidden></div>
          <div class="guide guide--v" id="sn-gv" hidden></div>
          <div class="tile tile--emerald" id="sn-drag" style="left:60px;top:100px;width:96px;height:60px">
            拖我吸附
          </div>
        </div>
        <div class="stage" id="sn-stage-2" style="height:190px">
          <div class="snappable" style="left:30px;top:30px;width:100px;height:60px"></div>
          <div class="snappable" style="left:300px;top:110px;width:100px;height:60px"></div>
          <div id="sn2-guides" style="position:absolute;inset:0;pointer-events:none"></div>
          <div class="tile tile--violet" id="sn-manual" style="left:80px;top:60px;width:96px;height:60px">
            外部控制
          </div>
          <div class="tile tile--outline" id="sn-manual-ghost"
               style="left:80px;top:60px;width:96px;height:60px;opacity:.9;pointer-events:none">
            吸附跟随
          </div>
        </div>
      </div>`,
  });

  const stage = document.getElementById("sn-stage");
  const gh = document.getElementById("sn-gh");
  const gv = document.getElementById("sn-gv");

  /**
   * 参考线绘制说明：
   * 1) onSnap 只在「吸附方向变化」时触发一次，且回调是 setTimeout(0) 异步派发，
   *    所以不能在 onSnap 里算一次就结束 —— 必须在 onDrag 中逐帧重绘。
   * 2) onSnap.el 是 ghost 副本；getTranslate(el) 返回的是 transform 位移量，
   *    不是元素在容器中的位置（ghost 还带 left/top 布局偏移）。
   * 3) 绝对定位子元素以容器 padding box 为基准（getPointInContainer 也会减去
   *    border 再返回坐标），因此所有矩形都换算到 padding box 后再绘制。
   */
  const contentOrigin = (stageEl) => {
    const cs = getComputedStyle(stageEl);
    const sr = stageEl.getBoundingClientRect();
    return {
      x: sr.left + (parseFloat(cs.borderLeftWidth) || 0),
      y: sr.top + (parseFloat(cs.borderTopWidth) || 0),
    };
  };

  const relRect = (stageEl, node) => {
    const o = contentOrigin(stageEl);
    const r = node.getBoundingClientRect();
    return {
      l: r.left - o.x,
      t: r.top - o.y,
      r: r.right - o.x,
      b: r.bottom - o.y,
    };
  };

  // dir 形如 'l2l' / 'c2c' / 'b2t'：取吸附后重合的那条边。
  // findSnap 在容差内会把元素「拉到」目标边上，因此吸附生效时 ghost 的对应边
  // 与目标边必然重合；一旦继续拖到容差之外，两者就不相等，此时隐藏该参考线。
  const ghostEdge = (r, dir, axis) =>
    dir[0] === "c"
      ? axis === "y"
        ? (r.t + r.b) / 2
        : (r.l + r.r) / 2
      : axis === "y"
      ? dir[0] === "t"
        ? r.t
        : r.b
      : dir[0] === "l"
      ? r.l
      : r.r;

  const ALIGN_EPS = 2; // 判定「仍处于吸附状态」的误差

  /** 横向参考线：跨过两个矩形的水平并集，画在重合的水平边上 */
  const drawHorizontal = (guide, stageEl, a, b, dir) => {
    if (!b) return false;
    const t = relRect(stageEl, b);
    if (Math.abs(ghostEdge(a, dir, "y") - ghostEdge(t, dir, "y")) > ALIGN_EPS) {
      guide.hidden = true;
      return false;
    }
    guide.style.top = ghostEdge(t, dir, "y") + "px";
    guide.style.left = Math.min(a.l, t.l) - 10 + "px";
    guide.style.width = Math.max(a.r, t.r) - Math.min(a.l, t.l) + 20 + "px";
    guide.hidden = false;
    return true;
  };

  /** 纵向参考线 */
  const drawVertical = (guide, stageEl, a, b, dir) => {
    if (!b) return false;
    const t = relRect(stageEl, b);
    if (Math.abs(ghostEdge(a, dir, "x") - ghostEdge(t, dir, "x")) > ALIGN_EPS) {
      guide.hidden = true;
      return false;
    }
    guide.style.left = ghostEdge(t, dir, "x") + "px";
    guide.style.top = Math.min(a.t, t.t) - 10 + "px";
    guide.style.height = Math.max(a.b, t.b) - Math.min(a.t, t.t) + 20 + "px";
    guide.hidden = false;
    return true;
  };

  const hideGuides = (...nodes) => nodes.forEach((n) => (n.hidden = true));

  /* --- 上半区：ghost 模式下由库移动副本 --- */
  let snapRef = null;
  const renderGuides = () => {
    if (!snapRef) return hideGuides(gh, gv);
    const ghost =
      stage.querySelector(".uii-draggable-ghost") ||
      document.getElementById("sn-drag");
    const a = relRect(stage, ghost);
    const drewV = snapRef.dirV
      ? drawHorizontal(gh, stage, a, snapRef.targetV, snapRef.dirV)
      : false;
    const drewH = snapRef.dirH
      ? drawVertical(gv, stage, a, snapRef.targetH, snapRef.dirH)
      : false;
    if (!drewV) gh.hidden = true;
    if (!drewH) gv.hidden = true;
  };

  const snapInst = newDraggable("#sn-drag", {
    grid: 8,
    ghost: true,
    ghostClass: "ghost-outline",
    containment: true,
    snap: ".snappable",
    snapOptions: {
      tolerance: 18,
      toleranceY: 12,
      points: ["start", "center", "end"],
      strategy: "nearest",
      container: stage,
    },
    onDrag() {
      // onSnap 只在方向变化时触发，拖动过程中持续重绘才能让参考线跟随
      renderGuides();
    },
    onEnd() {
      snapRef = null;
      hideGuides(gh, gv);
    },
    onSnap(data) {
      const { dirH, dirV, dx, dy } = data;
      snapRef = data;
      renderGuides();
    },
  });

  /* --- 下半区：onDrag 返回 false，位移完全由外部控制 --- */
  const manual = document.getElementById("sn-manual");
  const manualGhost = document.getElementById("sn-manual-ghost");
  const stage2 = document.getElementById("sn-stage-2");
  /* --- 下半区：位移完全由外部控制，吸附修正用 geometry 自己算 ---
   * 注意：库在命中吸附的那一帧会跳过 onDrag（见 draggable 源码的 emitSnap 分支），
   * 此时元素仍由库自身移动，因此「onDrag 返回 false + 内置 snap」组合并不可靠。
   * 这里改为：onDrag 只负责外部位移，再用 findSnap 求吸附量、snapGuides 生成参考线，
   * 二者返回的 dx/dy 与 onSnap 回调里的完全等价。
   */
  const guideHost = document.getElementById("sn2-guides");
  const targetRects = () => {
    const o = contentOrigin(stage2);
    return [...stage2.querySelectorAll(".snappable")].map((t) => {
      const r = t.getBoundingClientRect();
      return { x: r.left - o.x, y: r.top - o.y, w: r.width, h: r.height };
    });
  };
  const drawGuideList = (guides) => {
    guideHost.replaceChildren();
    for (const g of guides) {
      const line = el("div", { class: `guide guide--${g.dir}` });
      if (g.dir === "v") {
        line.style.left = g.coord + "px";
        line.style.top = g.from + "px";
        line.style.height = g.to - g.from + "px";
      } else {
        line.style.top = g.coord + "px";
        line.style.left = g.from + "px";
        line.style.width = g.to - g.from + "px";
      }
      guideHost.append(line);
    }
  };

  newDraggable("#sn-manual", {
    containment: true,
    onDrag({ x, y }) {
      const candidate = { x, y, w: manual.offsetWidth, h: manual.offsetHeight };
      const result = findSnap(candidate, targetRects(), { tolerance: 24 });
      manualGhost.style.left = (x + result.dx) + "px";
      manualGhost.style.top = (y + result.dy) + "px";
      drawGuideList(snapGuides(candidate, targetRects(), result, 30));
      return false; // 位移完全交给外部
    },
    onEnd() {
      guideHost.replaceChildren();
      manual.style.left = manualGhost.style.left;
      manual.style.top = manualGhost.style.top;
    },
  });

  const snapWrap = el("div");
  s.controls.append(snapWrap);
  slider(snapWrap, "toleranceY", {
    min: 0,
    max: 40,
    step: 2,
    value: 12,
    onInput(v) {
      snapInst.setOptions({
        snapOptions: { ...snapInst.getOptions().snapOptions, toleranceY: v },
      });
    },
  });
  gridSliders(snapWrap, snapInst, {
    x: 8,
    y: 8,
  });
}

/* ------------------------------- 1.7 scroll ------------------------------ */
{
  const s = section({
    id: "draggable-scroll",
    group: "Draggable",
    nav: "边缘滚动",
    api: "newDraggable(els, {scroll, scrollSpeed})",
    code: `import { newDraggable } from "uiik";

newDraggable("#sc-drag", {
  containment: "#sc-stage",
  scroll: true,
  scrollSpeed: 18,
})`,
    title: "scroll 容器边缘自动滚动",
    desc:
      "拖动时鼠标进入容器边缘 <code>EDGE_THRESHOLD</code> 像素内，容器按 <code>scrollSpeed</code> 自动滚动，用于大画布内的拖动。",
    options: ["scroll=true", "scrollSpeed=18", "containment='#sc-stage'"],
    html: `
      <div class="stage stage--tall stage--scroll" id="sc-stage" style="height:230px">
        <div style="position:relative;width:1180px;height:900px">
          <div class="tile tile--emerald" id="sc-drag" style="left:60px;top:40px">拖到边缘</div>
          <div style="position:absolute;left:520px;top:420px;font-size:12px;color:var(--muted)">
            可滚动区域 1180 x 900
          </div>
          <div style="position:absolute;right:12px;bottom:12px;font-size:12px;color:var(--muted)">
            靠近边缘自动滚动
          </div>
        </div>
      </div>`,
  });

  const stage = document.getElementById("sc-stage");
  newDraggable("#sc-drag", {
    containment: "#sc-stage",
    scroll: true,
    scrollSpeed: 18,
  });
}

/* -------------------------------- 1.8 dnd -------------------------------- */
{
  const s = section({
    id: "draggable-dnd",
    group: "Draggable",
    nav: "拖放源",
    api: "newDraggable(els, {type, droppable})",
    code: `import { newDraggable, newDroppable } from "uiik";

newDraggable("#dd-file", {
  type: "file",
  droppable: "#dnd-zones .dropzone",
  cursor: { default: "grab", active: "grabbing", over: "copy" },
  containment: true,
})

newDraggable("#dd-folder", {
  type: "folder",
  droppable: "#dnd-zones .dropzone",
  containment: true,
})

newDroppable("#dnd-zones .dropzone", {
  accepts: "file|folder",
  activeClass: "is-active",
  hoverClass: "is-hover",
  watch: true,
  onDrop({ draggable, droppable }) {
    droppable.classList.add("is-dropped");
    setTimeout(() => droppable.classList.remove("is-dropped"), 700);
    if (droppable.id === "dz-copy") {
      const clone = draggable.cloneNode(true);
      clone.style.left = parseFloat(draggable.style.left) + 18 + "px";
      clone.style.top = parseFloat(draggable.style.top) + 18 + "px";
      clone.classList.remove("uii-draggable", "uii-draggable-handle");
      droppable.append(clone);
    } else {
      droppable.append(draggable);
      draggable.style.left = "10px";
      draggable.style.top = "10px";
      draggable.style.position = "relative";
    }
  },
  onDeactive({ droppables }) {
    droppables.forEach((d) => d.classList.remove("is-hover"));
  },
})`,
    title: "拖放源：type 标识 + droppable 目标声明",
    desc:
      "<code>type</code> 会写入 <code>data-drop-type</code>，<code>Droppable.accepts</code> 以正则匹配该值。" +
      "<code>droppable</code> 让光标经过目标时切换到 <code>cursor.over</code>。",
    options: [
      "type='file'|'folder'",
      "droppable='#dnd-zones .dropzone'",
      "cursor.over='copy'",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="tile" id="dd-file" style="left:30px;top:30px">report.pdf</div>
        <div class="tile tile--violet" id="dd-folder" style="left:180px;top:30px">assets/</div>
        <div id="dnd-zones" style="position:absolute;inset:auto 20px 20px 20px;height:96px">
          <div class="dropzone" id="dz-inbox" style="left:0;top:0;width:150px;height:88px">收件箱</div>
          <div class="dropzone" id="dz-trash" style="left:170px;top:0;width:150px;height:88px">回收站</div>
          <div class="dropzone" id="dz-copy" style="left:340px;top:0;width:150px;height:88px">复制一份</div>
        </div>
      </div>`,
  });

  newDraggable("#dd-file", {
    type: "file",
    droppable: "#dnd-zones .dropzone",
    cursor: { default: "grab", active: "grabbing", over: "copy" },
    containment: true,
  });
  newDraggable("#dd-folder", {
    type: "folder",
    droppable: "#dnd-zones .dropzone",
    containment: true,
  });

  newDroppable("#dnd-zones .dropzone", {
    accepts: "file|folder",
    activeClass: "is-active",
    hoverClass: "is-hover",
    watch: true,
    onDrop({ draggable, droppable }) {
      droppable.classList.add("is-dropped");
      setTimeout(() => droppable.classList.remove("is-dropped"), 700);
      if (droppable.id === "dz-copy") {
        const clone = draggable.cloneNode(true);
        clone.style.left = parseFloat(draggable.style.left) + 18 + "px";
        clone.style.top = parseFloat(draggable.style.top) + 18 + "px";
        clone.classList.remove("uii-draggable", "uii-draggable-handle");
        droppable.append(clone);
      } else {
        droppable.append(draggable);
        draggable.style.left = "10px";
        draggable.style.top = "10px";
        draggable.style.position = "relative";
      }
    },
    onDeactive({ droppables }) {
      droppables.forEach((d) => d.classList.remove("is-hover"));
    },
  });
}

/* ========================================================================== *
 * 2. Droppable
 * ========================================================================== */
{
  const s = section({
    id: "droppable-accepts",
    group: "Droppable",
    nav: "接收规则",
    api: "newDroppable(els, {accepts, activeClass, hoverClass, watch})",
    code: `import { newDraggable, newDroppable } from "uiik";

newDraggable("#dp-task", { type: "task", containment: true })

newDraggable("#dp-note", { type: "note", containment: true })

newDroppable('[data-kind="task"]', {
  accepts(droppables, draggable) {
    return draggable.dataset.dropType === "task";
  },
  activeClass: "is-active",
  hoverClass: "is-hover",
  onDrop({ draggable, droppable }) {
    droppable.classList.add("is-dropped");
    setTimeout(() => droppable.classList.remove("is-dropped"), 700);
  },
})

newDroppable('[data-kind="all"]', {
  accepts: "file|note",
  activeClass: "is-active",
  hoverClass: "is-hover",
  watch: true,
  onDrop({ draggable, droppable }) {
    droppable.classList.add("is-dropped");
    setTimeout(() => droppable.classList.remove("is-dropped"), 700);
  },
})`,
    title: "accepts 函数判定 + activeClass / hoverClass / watch",
    desc:
      "上方色块拖入下方任意投放区即可命中；<code>accepts</code> 使用函数时按元素数组逐个判断。" +
      "<code>watch: true</code> 会在每次拖动开始时用选择器重新匹配投放区。",
    options: [
      "accepts=fn(droppables, draggable)",
      "accepts='file|note'",
      "activeClass",
      "hoverClass",
      "watch",
      "onActive/onEnter/onOver/onLeave/onDrop/onDeactive",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="tile tile--amber" id="dp-task" style="left:24px;top:24px">task 1</div>
        <div class="tile tile--rose" id="dp-note" style="left:170px;top:24px">note</div>
        <div id="dp-zones" style="position:absolute;inset:auto 20px 20px 20px;height:96px">
          <div class="dropzone" data-kind="task" style="left:0;top:0;width:160px;height:88px">仅 task</div>
          <div class="dropzone" data-kind="all" style="left:180px;top:0;width:160px;height:88px">全部类型</div>
        </div>
      </div>`,
  });

  newDraggable("#dp-task", { type: "task", containment: true });
  newDraggable("#dp-note", { type: "note", containment: true });

  newDroppable('[data-kind="task"]', {
    accepts(droppables, draggable) {
      return draggable.dataset.dropType === "task";
    },
    activeClass: "is-active",
    hoverClass: "is-hover",
    onDrop({ draggable, droppable }) {
      droppable.classList.add("is-dropped");
      setTimeout(() => droppable.classList.remove("is-dropped"), 700);
    },
  });

  newDroppable('[data-kind="all"]', {
    accepts: "file|note",
    activeClass: "is-active",
    hoverClass: "is-hover",
    watch: true,
    onDrop({ draggable, droppable }) {
      droppable.classList.add("is-dropped");
      setTimeout(() => droppable.classList.remove("is-dropped"), 700);
    },
  });

  const extra = el("div", {
    class: "dropzone",
    "data-kind": "all",
    style: "left:360px;top:0;width:150px;height:88px",
    text: "watch 新增区",
  });
  buttons(s.controls, [
    [
      "追加投放区",
      () => {
        document.getElementById("dp-zones").append(extra);
      },
      "btn--primary",
    ],
  ]);
}

/* ========================================================================== *
 * 3. Resizable
 * ========================================================================== */
{
  const s = section({
    id: "resizable-directions",
    group: "Resizable",
    nav: "八向缩放",
    api: "newResizable(els, {handle})",
    code: `import { newResizable } from "uiik";

newResizable("#rz-panel", {
  handle: (target) => target.querySelectorAll(".rz-dir"),
})`,
    title: "八方向缩放手柄",
    desc:
      "手柄方向由 <code>uii-resizable-handle-[n|s|e|w|ne|nw|se|sw]</code> 类名决定；" +
      "<code>handle</code> 支持选择器字符串、元素或返回元素集合的函数。",
    options: ["handle=fn(target)", "handle='.rz-dir'", "uii-resizable-handle-*", "onStart", "onResize", "onEnd"],
    html: `
      <div class="stage stage--tall">
        <div class="panel-box" id="rz-panel" style="left:60px;top:44px;width:240px;height:170px">
          ${domHandles("rz-dir")}
        </div>
        <div class="stage__hint" style="top:auto;bottom:12px">拖动 8 个手柄</div>
      </div>`,
  });

  newResizable("#rz-panel", {
    handle: (target) => target.querySelectorAll(".rz-dir"),
  });
}

{
  const s = section({
    id: "resizable-limits",
    group: "Resizable",
    nav: "尺寸约束",
    api: "newResizable(els, {minSize, maxSize, aspectRatio})",
    code: `import { newResizable } from "uiik";

newResizable("#rz-limit", {
  handle: ".rz-lim",
  minSize: [120, 90],
  maxSize: [320, 240],
})`,
    title: "minSize / maxSize / aspectRatio 约束",
    desc:
      "<code>minSize</code>、<code>maxSize</code> 支持数字或 <code>[w, h]</code>；" +
      "<code>aspectRatio</code> 锁定宽高比。右侧控件实时切换选项（走 <code>setOptions</code>）。",
    options: ["handle='.rz-lim'", "minSize=[120,90]", "maxSize=[320,240]", "aspectRatio=16/9", "setOptions"],
    html: `
      <div class="stage stage--tall">
        <div class="panel-box" id="rz-limit" style="left:70px;top:40px;width:220px;height:150px">
          ${domHandles("rz-lim")}
        </div>
        <div class="stage__hint" style="top:auto;bottom:12px">受限缩放</div>
      </div>`,
  });

  const inst = newResizable("#rz-limit", {
    handle: ".rz-lim",
    minSize: [120, 90],
    maxSize: [320, 240],
  });

  const wrap = el("div");
  s.controls.append(wrap);
  const aspectTxt = el("b", { text: "off" });
  const aspect = el("input", { type: "checkbox" });
  aspect.addEventListener("change", () => {
    inst.setOptions({ aspectRatio: aspect.checked ? 16 / 9 : undefined });
    aspectTxt.textContent = aspect.checked ? "16/9" : "off";
  });
  wrap.append(el("label", { class: "field" }, [aspect, "aspectRatio", aspectTxt]));
  slider(wrap, "maxW", {
    min: 160,
    max: 520,
    step: 20,
    value: 320,
    onInput(v) {
      inst.setOptions({ maxSize: [v, 240] });
    },
  });
  slider(wrap, "minH", {
    min: 40,
    max: 160,
    step: 10,
    value: 90,
    onInput(v) {
      inst.setOptions({ minSize: [120, v] });
    },
  });
}

{
  const s = section({
    id: "resizable-ghost",
    group: "Resizable",
    nav: "ghost 与组合",
    api: "newResizable + newRotatable + newDraggable",
    code: `import { newDraggable, newResizable, newRotatable } from "uiik";

newResizable("#rz-ghost", {
  handle: "#rz-ghost .rzg",
  ghost: true,
  ghostClass: "ghost-resize",
})

newDraggable("#rz-combo", {
  containment: true,
  filter: ".rot-handle, .rzc",
})

newResizable("#rz-combo", { handle: "#rz-combo .rzc" })

newRotatable("#rz-combo", {
  handle: "#rz-combo .rot-handle",
  cursor: { default: "crosshair", active: "cell" },
  onStart() {
    draggable.disable();
  },
  onEnd({ deg }) {
    draggable.enable();
  },
})`,
    title: "ghost 缩放预览 & 三种交互组合在同一个面板上",
    desc:
      "左侧面板开启 <code>ghost</code>，缩放过程中移动的是副本；右侧面板同时挂载缩放（左下手柄）、旋转（顶部手柄）与拖动，" +
      "旋转开始时调用 <code>draggable.disable()</code> 避免手势冲突。",
    options: ["ghost=true", "ghostClass", "onClone", "draggable.disable()", "rotatable.onStart"],
    html: `
      <div class="stage stage--tall">
        <div class="panel-box" id="rz-ghost" style="left:50px;top:60px;width:180px;height:130px">
          <div class="rzg uii-resizable-handle-se" style="right:-5px;bottom:-5px"></div>
          <div class="rzg uii-resizable-handle-s" style="left:50%;bottom:-5px;margin-left:-5px"></div>
          <div class="rzg uii-resizable-handle-e" style="right:-5px;top:50%;margin-top:-5px"></div>
        </div>
        <div class="rot-box" id="rz-combo" style="left:330px;top:60px;width:180px;height:130px">
          <div class="rot-handle" style="left:50%;top:-24px;margin-left:-6px"></div>
          <div class="rot-box__center" style="left:50%;top:50%"></div>
          <div class="rzc uii-resizable-handle-sw" style="left:-5px;bottom:-5px"></div>
        </div>
        <div class="stage__hint" style="top:auto;bottom:12px">
          左：ghost 缩放 ｜ 右：拖动本体 / 顶部圆点旋转 / 左下手柄缩放
        </div>
      </div>`,
  });

  newResizable("#rz-ghost", {
    handle: "#rz-ghost .rzg",
    ghost: true,
    ghostClass: "ghost-resize",
  });

  const draggable = newDraggable("#rz-combo", {
    containment: true,
    filter: ".rot-handle, .rzc",
  });
  newResizable("#rz-combo", { handle: "#rz-combo .rzc" });
  newRotatable("#rz-combo", {
    handle: "#rz-combo .rot-handle",
    cursor: { default: "crosshair", active: "cell" },
    onStart() {
      draggable.disable();
    },
    onEnd({ deg }) {
      draggable.enable();
    },
  });
}

/* ========================================================================== *
 * 4. Rotatable
 * ========================================================================== */
{
  const s = section({
    id: "rotatable-basics",
    group: "Rotatable",
    nav: "旋转",
    api: "newRotatable(els, {handle, cursor, ox, oy})",
    code: `import { newRotatable } from "uiik";

newRotatable("#ro-h", {
  handle: "#ro-h .rot-handle",
  cursor: { default: "crosshair", active: "cell" },
  onRotate({ deg, cx, cy, ox, oy }) {
    info([
      ["deg", Math.round(deg)],
      ["center", \`\${Math.round(cx)}, \${Math.round(cy)}\`],
      ["offset", \`\${Math.round(ox)}, \${Math.round(oy)}\`],
    ]);
  },
})

newRotatable("#ro-free", {
    // handle 返回面板自身 → 面板任意位置按下都可旋转（需返回类数组）
  handle: (target) => [target],
  cursor: { default: "grab", active: "grabbing" },
  onRotate({ deg }) {
    info([["deg", Math.round(deg)]]);
  },
})

newRotatable("#ro-origin", {
  handle: "#ro-origin .rot-handle",
  onRotate({ deg }) {
    info([["deg", Math.round(deg)]]);
  },
})`,
    title: "旋转：handle / 面板自身即 handle / 自定义 transform-origin",
    desc:
      "左：指定手柄旋转。中：<code>handle</code> 返回面板自身，点击面板任意位置即可旋转。" +
      "右：用 CSS <code>transform-origin</code> 改变旋转中心（HTML 元素）；<code>ox/oy</code> 仅对 SVG 元素生效，SVG 页有对应示例。",
    options: ["handle='.rot-handle'", "handle=fn(target)", "cursor{default,active}", "onStart", "onRotate", "onEnd"],
    html: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">
        <div class="stage stage--tall">
          <div class="rot-box" id="ro-h" style="left:34px;top:52px;width:120px;height:96px">
            <div class="rot-handle" style="left:50%;top:-26px;margin-left:-6px"></div>
            <div class="rot-box__center" style="left:50%;top:50%"></div>
          </div>
          <span class="stage__hint stage__hint--tl">拖顶部圆点</span>
        </div>
        <div class="stage stage--tall">
          <div class="rot-box" id="ro-free" style="left:34px;top:52px;width:120px;height:96px">
            <div class="rot-box__center" style="left:50%;top:50%"></div>
          </div>
          <span class="stage__hint stage__hint--tl">点击任意处</span>
        </div>
        <div class="stage stage--tall">
          <div class="rot-box" id="ro-origin"
               style="left:34px;top:52px;width:120px;height:96px;transform-origin:20% 80%">
            <div class="rot-handle" style="left:20%;top:80%;margin:-6px 0 0 -6px"></div>
            <div class="rot-box__center" style="left:20%;top:80%"></div>
          </div>
          <span class="stage__hint stage__hint--tl">origin 20% 80%</span>
        </div>
      </div>`,
  });

  const info = readout(s.controls, "旋转数据");

  newRotatable("#ro-h", {
    handle: "#ro-h .rot-handle",
    cursor: { default: "crosshair", active: "cell" },
    onRotate({ deg, cx, cy, ox, oy }) {
      info([
        ["deg", Math.round(deg)],
        ["center", `${Math.round(cx)}, ${Math.round(cy)}`],
        ["offset", `${Math.round(ox)}, ${Math.round(oy)}`],
      ]);
    },
  });

  newRotatable("#ro-free", {
    // handle 返回面板自身 → 面板任意位置按下都可旋转（需返回类数组）
    handle: (target) => [target],
    cursor: { default: "grab", active: "grabbing" },
    onRotate({ deg }) {
      info([["deg", Math.round(deg)]]);
    },
  });

  newRotatable("#ro-origin", {
    handle: "#ro-origin .rot-handle",
    onRotate({ deg }) {
      info([["deg", Math.round(deg)]]);
    },
  });
}

/* ========================================================================== *
 * 5. Splittable
 * ========================================================================== */
{
  const s = section({
    id: "splittable-basic",
    group: "Splittable",
    nav: "分割布局",
    api: "newSplittable(els, {handleSize, minSize})",
    code: `import { newSplittable } from "uiik";

newSplittable("#sp-h", {
  handleSize: 10,
  minSize: 60,
})

newSplittable("#sp-v", { handleSize: 10, minSize: 40 })`,
    title: "横向 / 纵向分割与 onSplit",
    desc:
      "在两个相邻面板之间自动创建分割手柄；<code>handleSize</code> 控制感应区宽度，" +
      "<code>minSize</code> 限制面板最小尺寸。",
    options: ["handleSize=10", "minSize=60", "onStart", "onSplit", "onEnd"],
    html: `
      <div style="display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:14px">
        <div class="split" id="sp-h" style="min-width:0">
          <div class="split-pane split-pane--a">A</div>
          <div class="split-pane split-pane--b">B</div>
        </div>
        <div class="split split--v" id="sp-v" style="height:190px">
          <div class="split-pane split-pane--c">A</div>
          <div class="split-pane split-pane--d">B</div>
        </div>
      </div>`,
  });

  newSplittable("#sp-h", {
    handleSize: 10,
    minSize: 60,
  });

  newSplittable("#sp-v", { handleSize: 10, minSize: 40 });
}

{
  const s = section({
    id: "splittable-multi",
    group: "Splittable",
    nav: "多区域·sticky",
    api: "newSplittable(els, {minSize: [...], sticky})",
    code: `import { newSplittable } from "uiik";

newSplittable("#sp-3", {
  handleSize: 10,
  minSize: [80, 40, 80],
  sticky: true,
})`,
    title: "多区域 minSize 数组 & sticky 粘性边界",
    desc:
      "三个面板共享一个容器时会生成两个手柄，<code>minSize</code> 数组按顺序定义每个区域的最小尺寸。" +
      "开启 <code>sticky</code> 后拖到边界会吸附，<code>onSticky</code> 返回 position。",
    options: ["minSize=[80,40,80]", "sticky=true", "onSticky"],
    html: `
      <div class="split split--3" id="sp-3" style="height:130px">
        <div class="split-pane split-pane--a">A</div>
        <div class="split-pane split-pane--b">B</div>
        <div class="split-pane split-pane--c">C</div>
      </div>`,
  });

  newSplittable("#sp-3", {
    handleSize: 10,
    minSize: [80, 40, 80],
    sticky: true,
  });
}

{
  const s = section({
    id: "splittable-ghost",
    group: "Splittable",
    nav: "ghost·handle",
    api: "newSplittable(els, {ghost, ghostClass, ghostTo, handle})",
    code: `import { newSplittable } from "uiik";

newSplittable("#sp-ghost", {
  handleSize: 10,
  minSize: 50,
  ghost: true,
  ghostClass: "ghost-split",
  ghostTo: "#sp-layer",
})

newSplittable("#sp-handle", {
  handle: ".split-handle",
  minSize: 40,
})

newSplittable("#sp-embedded", {
  handle: embedded,
  minSize: 40,
  inside: true,
})`,
    title: "ghost 分割预览 / 自定义 handle（选择器与元素两种形式）",
    desc:
      "第一行：开启 <code>ghost</code>，拖动时移动的是绿色副本，<code>ghostTo</code> 把副本挂到独立图层。" +
      "第二行：自定义 handle —— 用 <code>.split-handle</code> 选择器（该手柄参与布局流，面板需为其预留宽度）；" +
      "第三行：把 handle 直接作为元素传入（面板内嵌入式）。" +
      "自动创建的手柄是 <code>position:absolute</code>，不占布局空间，故面板宽度不需扣减。",
    options: [
      "ghost=true",
      "ghostClass='ghost-split'",
      "ghostTo='#sp-layer'",
      "handle='.split-handle'",
      "handle=Element",
      "inside",
    ],
    html: `
      <div style="display:grid;gap:12px">
        <div id="sp-layer" style="position:relative;height:108px">
          <span class="stage__hint stage__hint--tl">ghost 图层（拖动第一个分割条时，绿色副本出现在这里）</span>
        </div>
        <div class="split" id="sp-ghost">
          <div class="split-pane split-pane--a">A</div>
          <div class="split-pane split-pane--b">B</div>
        </div>
        <div class="split split--grip" id="sp-handle" style="height:92px">
          <div class="split-pane split-pane--c">A</div>
          <div class="split-handle"></div>
          <div class="split-pane split-pane--d">B</div>
        </div>
        <div class="split" id="sp-embedded" style="height:92px">
          <div class="split-pane split-pane--a">
            <div class="split-embedded" data-embedded></div>
          </div>
          <div class="split-pane split-pane--b">B</div>
        </div>
      </div>`,
  });

  newSplittable("#sp-ghost", {
    handleSize: 10,
    minSize: 50,
    ghost: true,
    ghostClass: "ghost-split",
    ghostTo: "#sp-layer",
  });

  newSplittable("#sp-handle", {
    handle: ".split-handle",
    minSize: 40,
  });

  const embedded = document.querySelector("[data-embedded]");
  newSplittable("#sp-embedded", {
    handle: embedded,
    minSize: 40,
    inside: true,
  });
}

{
  const s = section({
    id: "splittable-oneside",
    group: "Splittable",
    nav: "单边模式",
    api: "newSplittable(els, {oneSideMode})",
    code: `import { newSplittable } from "uiik";

newSplittable("#sp-start", {
  oneSideMode: "start",
  minSize: 60,
  handleSize: 10,
})

newSplittable("#sp-end", {
  oneSideMode: "end",
  minSize: 60,
  handleSize: 10,
})`,
    title: "oneSideMode：只改单侧尺寸",
    desc:
      "用于 flex 布局 —— 固定一侧，另一侧跟随容器伸缩。分别演示 <code>'start'</code>（只改左侧）与 <code>'end'</code>（只改右侧）。",
    options: ["oneSideMode='start'", "oneSideMode='end'"],
    html: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
        <div class="split" id="sp-start" style="min-width:0">
          <div class="split-pane split-pane--a" style="width:45%">sidebar</div>
          <div class="split-pane split-pane--b" style="flex:1 1 auto;width:auto">content</div>
        </div>
        <div class="split" id="sp-end" style="min-width:0">
          <div class="split-pane split-pane--a" style="flex:1 1 auto;width:auto">content</div>
          <div class="split-pane split-pane--b" style="width:45%">inspector</div>
        </div>
      </div>`,
  });

  newSplittable("#sp-start", {
    oneSideMode: "start",
    minSize: 60,
    handleSize: 10,
  });
  newSplittable("#sp-end", {
    oneSideMode: "end",
    minSize: 60,
    handleSize: 10,
  });
}

/* ========================================================================== *
 * 6. Selectable
 * ========================================================================== */
{
  const s = section({
    id: "selectable-basics",
    group: "Selectable",
    nav: "框选",
    api: "newSelectable(container, {targets, mode, class})",
    code: `import { newDraggable, newSelectable } from "uiik";

newSelectable("#sel-stage", {
  class: "uii-selector",
  selectingClass: "uii-selecting",
  selectedClass: "uii-selected",
  targets: ".sel-box",
  mode: "overlap",
  scroll: true,
  scrollSpeed: 12,
  // filter 返回 true 表示“排除该目标”
  filter: (t) => t.id === "sel-locked",
})

newDraggable("#sel-mover", {
  grid: 10,
  containment: true,
  onEnd() {
    selector.updateTargets();
  },
})`,
    title: "框选：overlap / inclusion 两种模式",
    desc:
      "<code>mode</code> 为 <code>overlap</code>（相交即选中）或 <code>inclusion</code>（需完全包含）。" +
      "<code>class</code> 控制选择框样式，<code>selectingClass</code> / <code>selectedClass</code> 控制目标状态；" +
      "<code>filter</code> 返回 <code>true</code> 表示排除该目标（图中灰色方块）。",
    options: [
      "targets='.sel-box'",
      "mode='overlap'|'inclusion'",
      "class",
      "selectingClass",
      "selectedClass",
      "filter=fn(el)",
      "scroll",
      "onStart",
      "onSelect",
      "onEnd",
      "updateTargets()",
      "setOptions",
    ],
    html: `
      <div style="display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:14px">
        <div class="sel-stage" id="sel-stage">
          <div class="sel-box" style="left:20px;top:20px">1</div>
          <div class="sel-box" style="left:150px;top:60px">2</div>
          <div class="sel-box" style="left:70px;top:150px">3</div>
          <div class="sel-box" style="left:230px;top:170px">4</div>
          <div class="sel-box" id="sel-locked" style="left:250px;top:40px">filter 排除</div>
          <div class="stage__hint">按住左键拖动进行框选</div>
        </div>
        <div>
          <div class="stage stage--short">
            <div class="tile tile--emerald" id="sel-mover" style="left:20px;top:20px;width:110px;height:60px">
              拖动            </div>
          </div>
          <p class="card__desc" style="margin-top:8px">
            拖动结束后调用 <code>selector.updateTargets()</code> 重新测量目标位置。
          </p>
        </div>
      </div>`,
  });

  const selector = newSelectable("#sel-stage", {
    class: "uii-selector",
    selectingClass: "uii-selecting",
    selectedClass: "uii-selected",
    targets: ".sel-box",
    mode: "overlap",
    scroll: true,
    scrollSpeed: 12,
    // filter 返回 true 表示“排除该目标”
    filter: (t) => t.id === "sel-locked",
  });

  const moverInst = newDraggable("#sel-mover", {
    grid: 10,
    containment: true,
    onEnd() {
      selector.updateTargets();
    },
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
      "updateTargets()",
      () => {
        selector.updateTargets();
      },
      "btn--ghost",
    ],
  ]);
  gridSliders(wrap, moverInst, {
    x: 10,
    y: 10,
  });
}

/* ========================================================================== *
 * 7. Sortable
 * ========================================================================== */
{
  const s = section({
    id: "sortable-single",
    group: "Sortable",
    nav: "单列表排序",
    api: "newSortable(els, {group, sort, filter, handle})",
    code: `import { newSortable } from "uiik";

newSortable("#so-1", {
  group: "tasks",
  ghostClass: "sort__item--ghosted",
  spill: "revert",
  filter: ".is-locked",
  handle: ".sort__grip",
})`,
    title: "单列表排序：sort / filter / handle / spill",
    desc:
      "拖动条目调整顺序；<code>filter</code> 中的条目不可拖动（图中带锁标记）；" +
      "<code>sort: false</code> 可切换为仅允许整体移动；右侧按钮可增删条目，<code>spill</code> 决定拖出容器后的处理方式。",
    options: [
      "group='tasks'",
      "sort=true|false",
      "filter='.is-locked'",
      "handle='.sort__grip'",
      "ghostClass",
      "spill='revert'|'remove'",
      "onStart",
      "onChange",
      "onUpdate",
      "onEnd",
    ],
    html: `<ul class="sort sort--col" id="so-1"></ul>`,
  });

  const list = document.getElementById("so-1");
  ["设计评审", "接口联调", "打包发布(锁定)", "文档补充"].forEach((text, i) =>
    list.append(
      el(
        "li",
        { class: "sort__item" + (i === 2 ? " is-locked" : ""), "data-i": i },
        [el("span", { class: "sort__grip", text: "⋮⋮" }), text]
      )
    )
  );

  const sortable = newSortable("#so-1", {
    group: "tasks",
    ghostClass: "sort__item--ghosted",
    spill: "revert",
    filter: ".is-locked",
    handle: ".sort__grip",
  });

  const wrap = el("div");
  s.controls.append(wrap);
  select(wrap, "spill", {
    value: "revert",
    options: ["revert", "remove"],
    onChange(v) {
      sortable.setOptions({ spill: v });
    },
  });
  buttons(wrap, [
    [
      "sort: false",
      () => {
        sortable.setOptions({ sort: false });
      },
      "btn--ghost",
    ],
    [
      "sort: true",
      () => {
        sortable.setOptions({ sort: true });
      },
      "btn--ghost",
    ],
    [
      "追加条目",
      () => {
        const n = list.children.length + 1;
        list.append(
          el("li", { class: "sort__item" }, [
            el("span", { class: "sort__grip", text: "⋮⋮" }),
            "新任务 " + n,
          ])
        );
      },
      "btn--primary",
    ],
    [
      "移除末项",
      () => {
        const last = list.lastElementChild;
        if (last) {
          last.remove();
        }
      },
      "btn--ghost",
    ],
  ]);
}

{
  const s = section({
    id: "sortable-transfer",
    group: "Sortable",
    nav: "多容器搬运",
    api: "newSortable(els, {group, move, activeClass})",
    code: `import { newSortable } from "uiik";

newSortable("#kb-1, #kb-2, #kb-3", {
  group: "kanban",
  activeClass: "is-active",
  ghostClass: "sort__item--ghosted",
  move: {
    to: (item, from) =>
      !(from.id === "kb-1" && item.textContent.trim() === "埋点"),
    from: (item, from, to) =>
      !(to.id === "kb-3" && item.textContent.trim() === "埋点"),
  },
})`,
    title: "多容器搬运：move 规则 / 全部事件回调",
    desc:
      "同一 <code>group</code> 的容器之间可互相搬运。<code>move.to</code> 控制从某容器移出是否生效，" +
      "<code>move.from</code> 控制是否允许移入；<code>activeClass</code> 标记当前活跃容器。" +
      "把「埋点」拖到「已完成」会被 <code>move.from</code> 拒绝。",
    options: [
      "group='kanban'",
      "move.to=fn(item, from)",
      "move.from=fn(item, from, to)",
      "activeClass='is-active'",
      "onActive/onDeactive",
      "onEnter/onLeave",
      "onAdd/onRemove",
      "onEnd",
    ],
    html: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px">
        <div>
          <div class="aside__title" style="margin-bottom:6px">待办</div>
          <ul class="sort sort--col" id="kb-1">
            <li class="sort__item">接口设计</li>
            <li class="sort__item">埋点</li>
          </ul>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">进行中</div>
          <ul class="sort sort--col" id="kb-2">
            <li class="sort__item">组件重构</li>
          </ul>
        </div>
        <div>
          <div class="aside__title" style="margin-bottom:6px">已完成</div>
          <ul class="sort sort--col" id="kb-3"></ul>
        </div>
      </div>`,
  });

  newSortable("#kb-1, #kb-2, #kb-3", {
    group: "kanban",
    activeClass: "is-active",
    ghostClass: "sort__item--ghosted",
    move: {
      to: (item, from) =>
        !(from.id === "kb-1" && item.textContent.trim() === "埋点"),
      from: (item, from, to) =>
        !(to.id === "kb-3" && item.textContent.trim() === "埋点"),
    },
  });
}

{
  const s = section({
    id: "sortable-row",
    group: "Sortable",
    nav: "横向排列",
    api: "newSortable(els, {scroll, scrollSpeed, ghostContainer})",
    code: `import { newSortable } from "uiik";

newSortable("#sr-1", {
  scroll: true,
  scrollSpeed: 14,
  ghostContainer: list.parentElement.parentElement,
  handle: ".sort__grip",
})`,
    title: "横向列表与 ghostContainer",
    desc:
      "横向排列同样支持排序；<code>ghostContainer</code> 指定浮层副本的挂载容器，跨滚动容器时可避免裁剪。" +
      "<code>handle</code> 指定只能从哪个子节点起拖 —— 这里只有左侧的握把可以拖动，点文字无效。",
    options: ["scroll=true", "scrollSpeed=14", "ghostContainer=Element", "handle='.sort__grip'"],
    html: `
      <div class="stage stage--scroll" style="padding:12px">
        <div style="width:920px">
          <ul class="sort sort--row" id="sr-1"></ul>
        </div>
      </div>`,
  });

  const list = document.getElementById("sr-1");
  "周一 周二 周三 周四 周五 周六 周日".split(" ").forEach((d) =>
    list.append(el("li", { class: "sort__item", style: "width:116px" }, [
      el("i", { class: "sort__grip", title: "按住这里才能拖动" }),
      d,
    ]))
  );

  newSortable("#sr-1", {
    scroll: true,
    scrollSpeed: 14,
    ghostContainer: list.parentElement.parentElement,
    handle: ".sort__grip",
  });
}

/* ========================================================================== *
 * 8. CollisionDetector
 * ========================================================================== */
{
  const s = section({
    id: "collision-detector",
    group: "CollisionDetector",
    nav: "碰撞检测",
    api: "newCollisionDetector(el, targets, {container})",
    code: `import { newDraggable, newCollisionDetector } from "uiik";

newCollisionDetector(probe, "#cd-t1, #cd-t2, #cd-t3", {
  container: stage,
})

newDraggable("#cd-probe", {
  containment: true,
  onDrag: refresh,
  onStart: clearHighlight,
  onEnd: refresh,
})`,
    title: "newCollisionDetector：getOverlaps / getInclusions / update",
    desc:
      "纯几何碰撞查询工具，不绑定任何事件。拖动蓝色探针方块，右侧实时输出相交元素与被完全包含的元素，" +
      "命中的 target 会同步高亮：<b>黄色</b>表示相交，<b>绿色</b>表示被探针完全包含。" +
      "注意：<code>update()</code> 只重算 targets 缓存，源元素矩形在构造时固定，因此实时查询请显式传入 <code>getBox</code> 的坐标。",
    options: [
      "container",
      "update()",
      "getOverlaps()",
      "getInclusions()",
      "getOverlaps(x1,y1,x2,y2)",
      "cd-target--overlap / --included",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="tile" id="cd-probe" style="left:40px;top:40px;width:120px;height:90px">探针</div>
        <div class="sel-box cd-target" id="cd-t1" style="left:220px;top:30px;width:120px;height:90px">target 1</div>
        <div class="sel-box cd-target" id="cd-t2" style="left:300px;top:150px;width:150px;height:110px">target 2</div>
        <div class="sel-box cd-target" id="cd-t3" style="left:60px;top:200px;width:90px;height:70px">target 3</div>
      </div>`,
  });

  const stage = s.stageHost;
  const probe = document.getElementById("cd-probe");
  const detector = newCollisionDetector(probe, "#cd-t1, #cd-t2, #cd-t3", {
    container: stage,
  });

  const out = readout(s.controls, "检测结果");
  const names = (list) =>
    list.map((e) => e.id || e.textContent.trim()).join(", ") || "-";

  const cdTargets = [...stage.querySelectorAll(".cd-target")];

  // 相交=黄色，被完全包含=绿色；后处理的优先级更高，故先清 overlap 再补 included
  const highlight = (overlaps, inclusions) => {
    const inc = new Set(inclusions);
    cdTargets.forEach((t) => {
      const isInc = inc.has(t);
      const isOver = overlaps.includes(t);
      t.classList.toggle("cd-target--overlap", isOver && !isInc);
      t.classList.toggle("cd-target--included", isInc);
    });
  };

  const refresh = () => {
    const b = getBox(probe, stage);
    const overlaps = detector.getOverlaps(b.x, b.y, b.x + b.w, b.y + b.h);
    const inclusions = detector.getInclusions(b.x, b.y, b.x + b.w, b.y + b.h);
    highlight(overlaps, inclusions);
    out([
      ["probe box", fmt(b)],
      ["overlaps(实时坐标)", names(overlaps)],
      ["inclusions(实时坐标)", names(inclusions)],
      ["overlaps(构造时缓存)", names(detector.getOverlaps())],
    ]);
  };

  const clearHighlight = () =>
    cdTargets.forEach((t) => {
      t.classList.remove("cd-target--overlap", "cd-target--included");
    });

  newDraggable("#cd-probe", {
    containment: true,
    onDrag: refresh,
    onStart: clearHighlight,
    onEnd: refresh,
  });
  buttons(s.controls, [
    [
      "update()",
      () => {
        detector.update();
        refresh();
      },
      "btn--primary",
    ],
    [
      "getOverlaps(全区域)",
      () => {
        const list = detector.getOverlaps(0, 0, 9999, 9999);
        highlight(list, []);
      },
    ],
    [
      "getInclusions(全区域)",
      () => {
        const list = detector.getInclusions(0, 0, 9999, 9999);
        highlight([], list);
      },
    ],
    ["清除高亮", () => (clearHighlight())],
  ]);
  refresh();
}

/* ========================================================================== *
 * 9. Geometry（纯函数）
 * ========================================================================== */
{
  const s = section({
    id: "geometry-align",
    group: "Geometry",
    nav: "对齐·分布",
    api: "alignRects / distributeRects / unionRect",
    code: `import { alignRects, distributeRects, unionRect } from "uiik";

// alignRects(rects, mode, to?)
// mode: "left" | "centerX" | "right" | "top" | "centerY" | "bottom"
// 缺省对齐到 rects 自身的并集；传入 to（如 [containerRect]）即对齐到指定容器
const aligned = alignRects(rects, "centerX");

// distributeRects 沿单轴等间距分布，首尾原位不动，少于 3 个时原样返回
// align 须为垂直于 dir 的模式，否则被忽略（避免覆盖上一步的对齐结果）
const spread = distributeRects(aligned, "h", { gap: 16, align: "centerY" });

// 并集矩形：整体包围盒，也可再次作为对齐基准
const box = unionRect(rects);`,
    title: "alignRects 对齐与 distributeRects 等间距",
    desc:
      "<b>左/右/水平居中</b>对齐的是 x 坐标，适用于纵向错落、宽度不一的元素；" +
      "<b>上/下/垂直居中</b>对齐的是 y 坐标，适用于横向并排、高度不一的元素（如让所有元素的中线对齐）。" +
      "切换对齐模式会自动换上对应的布局，并画出对齐参考线。" +
      "<code>alignRects(rects, mode, to?)</code> 缺省对齐到自身并集；" +
      "<code>distributeRects</code> 支持 <code>gap</code>，以及垂直于分布轴的 <code>align</code>（默认关闭，否则会覆盖所选的对齐模式）；少于 3 个矩形时原样返回。",
    options: [
      "alignRects(rects, mode, to)",
      "distributeRects(rects, dir, {gap, align})",
      "unionRect",
      "rectCenter",
      "getRectRight",
      "getRectBottom",
    ],
    html: `
      <div class="geo">
        <div class="geo__canvas">
          <div class="stage" id="ga-stage" style="height:260px"></div>
        </div>
        <div class="geo__panel" id="ga-panel"></div>
      </div>`,
    noAside: true,
  });

  const stage = s.stageHost.querySelector("#ga-stage");
  const panel = s.stageHost.querySelector("#ga-panel");
  s.stageHost.append(s.codeHost);

  /* 两套布局，各自适配对齐轴：
   * - column：纵向错落、宽度不一，用来演示 left / centerX / right（对应 x）
   * - row：横向并排、高度不一，用来演示 top / centerY / bottom（对应 y）
   */
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

  const draw = () => {
    const aligned = alignRects(rects, mode);
    const spread = crossAlign
      ? distributeRects(aligned, dir, { gap, align: crossAlign })
      : aligned;
    const ref = unionRect(rects);
    const pad = 10;

    // —— HTML 场景 ——
    stage.querySelectorAll(".ga-union, .guide, .ga-box").forEach((n) => n.remove());
    if (ref) {
      const u = el("div", { class: "ga-union" });
      u.style.left = ref.x - 4 + "px";
      u.style.top = ref.y - 4 + "px";
      u.style.width = ref.w + 8 + "px";
      u.style.height = ref.h + 8 + "px";
      stage.append(u);
      const isY = isYAxis(mode);
      const g = el("div", { class: `guide guide--${isY ? "h" : "v"}` });
      if (isY) {
        const y = mode === "top" ? ref.y : mode === "centerY" ? ref.y + ref.h / 2 : ref.y + ref.h;
        g.style.top = y + "px";
        g.style.left = ref.x - pad + "px";
        g.style.width = ref.w + pad * 2 + "px";
      } else {
        const x = mode === "left" ? ref.x : mode === "centerX" ? ref.x + ref.w / 2 : ref.x + ref.w;
        g.style.left = x + "px";
        g.style.top = ref.y - pad + "px";
        g.style.height = ref.h + pad * 2 + "px";
      }
      stage.append(g);
    }
    spread.forEach((r, i) => {
      const b = el("div", { class: "panel-box geo-box ga-box" });
      b.dataset.i = i;
      b.style.left = r.x + "px";
      b.style.top = r.y + "px";
      b.style.width = r.w + "px";
      b.style.height = r.h + "px";
      b.textContent = `${Math.round(r.x)},${Math.round(r.y)}`;
      stage.append(b);
    });

    out([
      ["对齐轴", isYAxis(mode) ? "y（top/centerY/bottom）" : "x（left/centerX/right）"],
      ["unionRect", fmt(unionRect(rects))],
      ["getRectRight(rects[0])", getRectRight(rects[0])],
      ["getRectBottom(rects[0])", getRectBottom(rects[0])],
      [
        "alignRects",
        fmt(aligned.map((r) => `${Math.round(r.x)},${Math.round(r.y)}`)),
      ],
      [
        "distributeRects",
        fmt(
          distributeRects(aligned, dir, { gap }).map((r) =>
            dir === "h" ? Math.round(r.x) : Math.round(r.y)
          )
        ),
      ],
    ]);
  };

  stage.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("[data-i]");
    if (!t) return;
    const i = Number(t.dataset.i);
    const rect0 = stage.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { ...rects[i] };
    stage.setPointerCapture(e.pointerId);
    const move = (ev) => {
      rects[i] = {
        ...origin,
        x: Math.max(0, Math.min(rect0.width - origin.w, origin.x + (ev.clientX - startX))),
        y: Math.max(0, Math.min(rect0.height - origin.h, origin.y + (ev.clientY - startY))),
      };
      draw();
    };
    const up = () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
  });

  select(panel, "align", {
    value: mode,
    options: ["left", "centerX", "right", "top", "centerY", "bottom"],
    onChange(v) {
      mode = v;
      // 切换对齐轴时换用匹配的布局，否则演示不出差异
      const wantY = isYAxis(v);
      const cur = LAYOUTS[wantY ? "row" : "column"]();
      const sameShape = rects.length === cur.length &&
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
    ["重置", () => (rects = LAYOUTS[isYAxis(mode) ? "row" : "column"](), draw())],
  ]);
  draw();
}

{
  const s = section({
    id: "geometry-resize",
    group: "Geometry",
    nav: "缩放求解",
    api: "resizeRect / snapToGrid / rectInset",
    code: `import { resizeRect, snapToGrid, rectInset } from "uiik";

// 八向缩放求解：dir 表示「拖动哪一侧的手柄」，对侧保持不动
// "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"
const next = resizeRect(start, "se", dx, dy, {
  minW: 60,
  minH: 40,
  maxW: 320,
  maxH: 240,
  keepAspect: false, // 仅四角方向有意义，以位移较大的一轴为主轴
  grid: 8, // > 0 时把 w / h 吸附到其整数倍
});

// 四舍五入吸附，负坐标同样正确：-7 → -10，而不是被截断成 0
snapToGrid(133, 10); // 130
snapToGrid(-7, 10); // -10

// 按边距内缩
rectInset({ x: 0, y: 0, w: 200, h: 140 }, { left: 20, top: 20 });`,
    title: "resizeRect 八向缩放求解",
    desc:
      "在画布上按下并拖动即可求解新矩形；<code>minW/maxW/keepAspect/grid</code> 由右侧控件实时驱动。" +
      "<code>snapToGrid</code> 使用四舍五入取整，负坐标同样正确（<code>-7 → -10</code>）。",
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
          <div class="stage" id="gr-stage" style="height:240px">
            <div class="panel-box geo-box" id="gr-box"
                 style="left:120px;top:60px;width:180px;height:110px"></div>
            <span class="stage__hint stage__hint--tl">在画布上按下并拖动</span>
          </div>
        </div>
        <div class="geo__panel" id="gr-panel"></div>
      </div>`,
    noAside: true,
  });

  const stage = s.stageHost.querySelector("#gr-stage");
  const panel = s.stageHost.querySelector("#gr-panel");
  const box = s.stageHost.querySelector("#gr-box");
  s.stageHost.append(s.codeHost);

  const start = { x: 120, y: 60, w: 180, h: 110 };
  const state = { dir: "se", minW: 60, maxW: 360, grid: 0, keepAspect: false };
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
    box.style.left = rect.x + "px";
    box.style.top = rect.y + "px";
    box.style.width = rect.w + "px";
    box.style.height = rect.h + "px";
    box.textContent = `${Math.round(rect.w)} x ${Math.round(rect.h)}`;
  };

  stage.addEventListener("pointerdown", (ev) => {
    const sx = ev.clientX;
    const sy = ev.clientY;
    stage.setPointerCapture(ev.pointerId);
    const solve = (e) =>
      resizeRect(start, state.dir, e.clientX - sx, e.clientY - sy, opts());
    const move = (e) => render(solve(e));
    const up = () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
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
        render(
          rectInset({ x: start.x, y: start.y, w: 200, h: 140 }, { left: 20, top: 20 })
        ),
      "btn--ghost",
    ],
    [
      "snapToGrid 对齐",
      () =>
        render({ x: snapToGrid(133, 10), y: snapToGrid(-7, 10), w: 200, h: 140 }),
      "btn--ghost",
    ],
    ["重置", () => render(start), "btn--ghost"],
  ]);
  out([
    ["snapToGrid(-7,10)", snapToGrid(-7, 10)],
    ["snapToGrid(-12,10)", snapToGrid(-12, 10)],
    [
      "rectInset",
      fmt(rectInset({ x: 10, y: 20, w: 200, h: 120 }, { left: 30, top: 10 })),
    ],
  ]);
  render(start);
}

{
  const s = section({
    id: "geometry-viewport",
    group: "Geometry",
    nav: "视口·缩放·平移",
    api: "fitRectInViewport / zoomAt / panBy",
    code: `import {
  fitRectInViewport,
  zoomAt,
  panBy,
  unionRect,
  getRectInContainer,
} from "uiik";

// 1) 从真实 DOM 元素量出内容包围盒——几何函数只吃 Rect，SVG 元素同理
const content = unionRect(
  [boxA, boxB].map((el) => getRectInContainer(el, world))
); // { x, y, w, h } | null

// 2) 一键把内容适配进视口，返回 View（{ x, y, scale }）
let view = fitRectInViewport(content, { w: stage.clientWidth, h: stage.clientHeight }, {
  padding: 24,
  minScale: 0.4,
  maxScale: 1,
});

// 3) 滚轮缩放：锚点取指针在视口内的坐标，缩放后锚点下的内容保持不动
stage.addEventListener(
  "wheel",
  (ev) => {
    ev.preventDefault();
    const r = stage.getBoundingClientRect();
    view = zoomAt(view, { x: ev.clientX - r.left, y: ev.clientY - r.top },
      ev.deltaY < 0 ? 1.12 : 1 / 1.12, { min: 0.4, max: 4 });
    world.style.transform =
      \`translate(\${view.x}px, \${view.y}px) scale(\${view.scale})\`;
  },
  { passive: false }
);

// 4) 拖动平移：把指针位移直接交给 panBy
let last = toLocal(ev);
const move = (e) => {
  const p = toLocal(e);
  view = panBy(view, p.x - last.x, p.y - last.y);
  last = p;
};`,
    title: "视口适配、缩放锚点与平移",
    desc:
      "滚轮缩放（以指针为锚点）、按住拖动平移；<code>fitRectInViewport</code> 一键把内容适配进视口，" +
      "<code>padding / minScale / maxScale</code> 可调，<code>zoomAt</code> 的 <code>min/max</code> 控制缩放范围。",
    options: [
      "fitRectInViewport(rect, viewport, {padding,minScale,maxScale})",
      "zoomAt(view, pivot, factor, {min,max})",
      "panBy(view, dx, dy)",
    ],
    html: `
      <div class="geo">
        <div class="geo__canvas">
          <div class="stage stage--grid-bg" id="gv-stage" style="height:280px">
            <div class="geo-world" id="gv-world">
              <div class="panel-box geo-box" id="gv-boxA"
                   style="left:70px;top:60px;width:150px;height:90px">content A</div>
              <div class="panel-box geo-box geo-box--target" id="gv-boxB"
                   style="left:270px;top:130px;width:150px;height:80px">content B</div>
            </div>
            <div class="geo-viewport"></div>
            <span class="stage__hint stage__hint--tl">滚轮缩放 · 拖动平移</span>
          </div>
        </div>
        <div class="geo__panel" id="gv-panel"></div>
      </div>`,
    noAside: true,
  });

  const stage = s.stageHost.querySelector("#gv-stage");
  const panel = s.stageHost.querySelector("#gv-panel");
  const world = s.stageHost.querySelector("#gv-world");
  const boxes = [
    s.stageHost.querySelector("#gv-boxA"),
    s.stageHost.querySelector("#gv-boxB"),
  ];
  s.stageHost.append(s.codeHost);

  let padding = 24;
  let minScale = 0.4;
  let maxScale = 1;

  const out = readout(panel, "View");
  // 内容包围盒直接量自 DOM 元素，不写死坐标
  const contentRect = () => unionRect(boxes.map((el) => getRectInContainer(el, world)));
  const viewportSize = () => ({ w: stage.clientWidth, h: stage.clientHeight });
  const fit = () =>
    (view = fitRectInViewport(contentRect(), viewportSize(), {
      padding,
      minScale,
      maxScale,
    }));

  let view;
  const apply = () => {
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    out([
      ["view.x", Math.round(view.x)],
      ["view.y", Math.round(view.y)],
      ["view.scale", view.scale.toFixed(3)],
      ["content", contentRect() ? "measured" : "-"],
    ]);
  };

  const toLocal = (ev) => {
    const r = stage.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };

  stage.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      view = zoomAt(view, toLocal(ev), ev.deltaY < 0 ? 1.12 : 1 / 1.12, {
        min: minScale,
        max: 4,
      });
      apply();
    },
    { passive: false }
  );

  stage.addEventListener("pointerdown", (ev) => {
    let last = toLocal(ev);
    stage.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const p = toLocal(e);
      view = panBy(view, p.x - last.x, p.y - last.y);
      last = p;
      apply();
    };
    const up = () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
  });

  slider(panel, "padding", {
    min: 0,
    max: 80,
    step: 4,
    value: 24,
    onInput(v) {
      padding = v;
      fit();
      apply();
    },
  });
  slider(panel, "minScale", {
    min: 0.1,
    max: 1,
    step: 0.05,
    value: 0.4,
    onInput(v) {
      minScale = v;
    },
  });
  slider(panel, "maxScale", {
    min: 1,
    max: 3,
    step: 0.1,
    value: 1,
    onInput(v) {
      maxScale = v;
      fit();
      apply();
    },
  });
  buttons(panel, [
    ["fitRectInViewport()", () => (fit(), apply()), "btn--primary"],
    [
      "zoomAt(center, 1.25)",
      () => {
        const vp = viewportSize();
        view = zoomAt(view, { x: vp.w / 2, y: vp.h / 2 }, 1.25, {
          min: minScale,
          max: 4,
        });
        apply();
      },
    ],
    ["panBy(-40,-20)", () => ((view = panBy(view, -40, -20)), apply())],
  ]);
  fit();
  apply();
}

{
  const s = section({
    id: "geometry-snap",
    group: "Geometry",
    nav: "吸附求解",
    api: "findSnap / snapGuides",
    code: `import { findSnap, snapGuides } from "uiik";

const conf = {
  tolerance: 24, // x 轴容差
  toleranceY: 18, // 缺省同 tolerance
  points: ["start", "center", "end"], // 三线全开 = 3×3 共 9 种对齐组合
  strategy: "nearest", // nearest 取位移最小者；first 取首个命中
  exclude: [], // 排除的 target 下标
  onHit(hit) {
    return false; // 返回 false 放弃该候选，用于按锚点施加优先级
  },
};

// 求解吸附位移
const result = findSnap(base, targets(), conf);
if (result) {
  base.x += result.dx;
  base.y += result.dy;
}

// 生成参考线：横线配 x、竖线配 y
const guides = snapGuides(base, targets, result, 30);`,
    title: "findSnap 吸附求解与 snapGuides 参考线",
    desc:
      "拖动橙色矩形接近蓝色目标框，<code>findSnap</code> 给出吸附位移，<code>snapGuides</code> 生成参考线。" +
      "右侧可切换 <code>points</code> 锚点集合与 <code>strategy</code> 取舍策略。",
    options: [
      "findSnap(candidate, targets, {tolerance,toleranceY,points,strategy})",
      "snapGuides(candidate, targets, result, padding)",
    ],
    html: `
      <div class="geo">
        <div class="geo__canvas">
          <div class="stage" id="gs-stage" style="height:280px">
            <div class="geo-world" id="gs-world">
              <div class="panel-box geo-box geo-box--target gs-target"
                   style="left:60px;top:40px;width:110px;height:70px">T1</div>
              <div class="panel-box geo-box geo-box--target gs-target"
                   style="left:250px;top:30px;width:90px;height:60px">T2</div>
              <div class="panel-box geo-box geo-box--target gs-target"
                   style="left:340px;top:150px;width:130px;height:80px">T3</div>
              <div class="panel-box geo-box geo-box--target gs-target"
                   style="left:90px;top:170px;width:80px;height:60px">T4</div>
              <div class="panel-box geo-box geo-box--active" id="gs-cand"
                   style="left:200px;top:100px;width:110px;height:70px">拖我</div>
            </div>
            <div class="geo-guides" id="gs-guides"></div>
            <span class="stage__hint stage__hint--tl">拖动橙色矩形靠近目标框</span>
          </div>
        </div>
        <div class="geo__panel" id="gs-panel"></div>
      </div>`,
    noAside: true,
  });

  const stage = s.stageHost.querySelector("#gs-stage");
  const panel = s.stageHost.querySelector("#gs-panel");
  const world = s.stageHost.querySelector("#gs-world");
  const cand = s.stageHost.querySelector("#gs-cand");
  const guideHost = s.stageHost.querySelector("#gs-guides");
  const targetEls = [...s.stageHost.querySelectorAll(".gs-target")];
  s.stageHost.append(s.codeHost);

  // 目标矩形直接量自 DOM 元素，不写死坐标
  const targets = () => targetEls.map((el) => getRectInContainer(el, world));
  const out = readout(panel, "SnapResult");

  const conf = {
    tolerance: 14,
    points: ["start", "center", "end"],
    strategy: "nearest",
  };
  let base = { x: 200, y: 100, w: 110, h: 70 };
  let result = findSnap(base, targets(), conf);

  const render = () => {
    cand.style.left = base.x + result.dx + "px";
    cand.style.top = base.y + result.dy + "px";
    const lines = snapGuides(base, targets(), result, 30);
    guideHost.replaceChildren(
      ...lines.map((g) => {
        const line = el("div", { class: `guide guide--${g.dir}` });
        if (g.dir === "v") {
          line.style.left = g.coord + "px";
          line.style.top = g.from + "px";
          line.style.height = g.to - g.from + "px";
        } else {
          line.style.top = g.coord + "px";
          line.style.left = g.from + "px";
          line.style.width = g.to - g.from + "px";
        }
        return line;
      })
    );
    out([
      ["result.dx", Math.round(result.dx)],
      ["result.dy", Math.round(result.dy)],
      ["hitX", result.hitX ? `${result.hitX.point}→${result.hitX.targetPoint}` : "-"],
      ["hitY", result.hitY ? `${result.hitY.point}→${result.hitY.targetPoint}` : "-"],
      ["guides", lines.length],
    ]);
  };

  const solve = () => (result = findSnap(base, targets(), conf));

  stage.addEventListener("pointerdown", (ev) => {
    const sx = ev.clientX;
    const sy = ev.clientY;
    const origin = { ...base };
    stage.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const maxX = world.clientWidth - origin.w;
      const maxY = world.clientHeight - origin.h;
      base = {
        ...origin,
        x: Math.max(0, Math.min(maxX, origin.x + (e.clientX - sx))),
        y: Math.max(0, Math.min(maxY, origin.y + (e.clientY - sy))),
      };
      solve();
      render();
    };
    const up = () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
  });

  slider(panel, "tolerance", {
    min: 0,
    max: 40,
    step: 2,
    value: 14,
    onInput(v) {
      conf.tolerance = v;
      result = findSnap(base, targets(), conf);
      render();
    },
  });
  select(panel, "strategy", {
    value: "nearest",
    options: ["nearest", "first"],
    onChange(v) {
      conf.strategy = v;
      result = findSnap(base, targets(), conf);
      render();
    },
  });
  const ptsRow = el("div", { class: "btn-row" });
  for (const p of ["start", "center", "end"]) {
    const b = el("button", { class: "btn btn--sm btn--primary", text: p });
    b.addEventListener("click", () => {
      const on = conf.points.includes(p);
      conf.points = on ? conf.points.filter((x) => x !== p) : [...conf.points, p];
      if (!conf.points.length) conf.points = ["start"];
      b.classList.toggle("btn--primary", !on);
      b.classList.toggle("btn--ghost", on);
      result = findSnap(base, targets(), conf);
      render();
    });
    ptsRow.append(b);
  }
  panel.append(el("div", { class: "aside__title", text: "points" }), ptsRow);
  render();
}

/* ========================================================================== *
 * 10. Transform
 * ========================================================================== */
{
  const s = section({
    id: "transform-wrapper",
    group: "Transform",
    nav: "位移与旋转",
    api: "wrapper / moveTo / moveBy / rotateTo / getTranslate",
    code: `import { wrapper, moveTo, moveBy, rotateTo, getTranslate } from "uiik";

// wrapper 自动屏蔽 HTML 与 SVG 的 transform 差异，并记录自身施加的偏移
const ut = wrapper(box);
ut.moveTo(140, 120);
ut.moveToX(160);
ut.moveToY(80);
ut.rotateTo(15);
ut.normalize(); // 归一化，消除浮点误差累积

// 同一元素重复 wrapper 会复用同一实例
wrapper(box) === ut; // true

// SVG 元素同样适用（写入 transform 属性）
const svgUt = wrapper(svgRect);
svgUt.moveTo(60, 80);
svgUt.rotateTo(30);

// 函数式 API：直接传元素，无需先建实例
moveTo(box2, 140, 120);
moveBy(box2, 20, 10);
rotateTo(box2, 15);

// 只读当前位移
const { x, y } = getTranslate(box);`,
    title: "统一 HTML / SVG 的位移旋转 API",
    desc:
      "<code>wrapper(el)</code> 返回 <code>UiiTransform</code> 实例，自动屏蔽 HTML 与 SVG 的 transform 差异并记录偏移。" +
      "下方按钮分别调用实例方法与函数式 API，右侧同步显示 <code>getTranslate</code> 结果。",
    options: [
      "wrapper(el)",
      "wrapper(el, false)",
      "ut.moveTo(x,y)",
      "ut.moveToX/Y",
      "ut.rotateTo(deg)",
      "ut.normalize()",
      "moveTo",
      "transformMoveTo",
      "moveBy",
      "rotateTo",
      "getTranslate",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="rot-box" id="tf-box" style="left:60px;top:50px;width:150px;height:110px">
          transform
        </div>
        <div class="rot-box" id="tf-box2" style="left:300px;top:50px;width:150px;height:110px">
          函数式 API
        </div>
        <svg width="220" height="130" style="position:absolute;left:60px;top:190px;overflow:visible">
          <rect id="tf-svg" x="20" y="20" width="90" height="60" rx="4"
                fill="rgba(129,140,248,.3)" stroke="var(--accent-2)"></rect>
          <text class="svg-label" x="22" y="104">SVG 同 API</text>
        </svg>
      </div>`,
  });

  const box = document.getElementById("tf-box");
  const box2 = document.getElementById("tf-box2");
  const svgBox = document.getElementById("tf-svg");
  const ut = wrapper(box);
  wrapper(box2, false); // useTransform = false → 走 left/top

  const out = readout(s.controls, "UiiTransform");
  const sync = () =>
    out([
      ["ut.el", fmt(ut.el)],
      ["ut.x / ut.y", `${Math.round(ut.x)}, ${Math.round(ut.y)}`],
      ["ut.offx / offy", `${Math.round(ut.offx)}, ${Math.round(ut.offy)}`],
      ["ut.angle", Math.round(ut.angle)],
      ["getTranslate(box)", fmt(getTranslate(box))],
      ["getTranslate(svg)", fmt(getTranslate(svgBox))],
    ]);

  buttons(s.controls, [
    ["ut.moveTo(140,120)", () => (ut.moveTo(140, 120), sync())],
    ["ut.moveToX(260)", () => (ut.moveToX(260), sync())],
    ["ut.moveToY(160)", () => (ut.moveToY(160), sync())],
    ["ut.rotateTo(15)", () => (ut.rotateTo(15), sync())],
    ["ut.normalize()", () => (ut.normalize(), sync())],
    ["moveTo(box2,120,40)", () => (moveTo(box2, 120, 40))],
    ["transformMoveTo(box2,200,90)", () => (transformMoveTo(box2, 200, 90))],
    ["moveBy(box2,20,10)", () => (moveBy(box2, 20, 10))],
    ["rotateTo(box2,45)", () => (rotateTo(box2, 45))],
    [
      "moveTo(svgRect,60,40)",
      () => {
        moveTo(svgBox, 60, 40);
      },
    ],
    [
      "rotateTo(svgRect,30,45,30)",
      () => {
        rotateTo(svgBox, 30, 45, 30);
      },
    ],
  ]);
  sync();
}

/* ========================================================================== *
 * 11. DOM utils
 * ========================================================================== */
{
  const s = section({
    id: "dom-utils",
    group: "DOM utils",
    nav: "测量工具",
    api: "getBox / getVertex / getCenterXy / getMatrixInfo ...",
    code: `import {
  getBox,
  getPointInContainer,
  getPointOffset,
  getRectInContainer,
  getStyleXy,
  getStyleSize,
  getMatrixInfo,
  getRectCenter,
  getCenterXy,
  getCenterXySVG,
  getVertex,
  isSVGEl,
  isVisible,
} from "uiik";

// 以下均为只读测量，不修改页面

// 元素在容器坐标系中的矩形（已换算缩放与祖先位移）
const box = getBox(el, container);
const rect = getRectInContainer(el, container);

// 尺寸：getStyleSize 返回解析后的样式数值，而不是字符串
const [w, h] = getStyleSize(el);

// 变换：recur = true 递归乘上祖先的 transform；
// SVG 的 viewBox 缩放不在 CSS transform 内，getMatrixInfo 会自动乘上 getScreenCTM
const { scale, angle, x, y } = getMatrixInfo(el, true);

// 锚点：ox / oy 可为百分比字符串或 0~1 数字
const [cx, cy] = getCenterXy(el, 0.5, 0.5);
const [vx, vy] = getVertex(el, "50%", "50%");

// 指针换算
const p = getPointInContainer(ev, container);`,
    title: "DOM 测量工具集",
    desc:
      "鼠标移到两个探针元素上即可实时读取测量结果；右侧按钮覆盖其余工具函数与页面级操作。" +
      "所有测量函数均为只读，不修改页面。",
    options: [
      "getBox",
      "getPointOffset",
      "getPointInContainer",
      "getRectInContainer",
      "isSVGEl",
      "isVisible",
      "getStyleXy",
      "getStyleSize",
      "getMatrixInfo",
      "getRectCenter",
      "getCenterXy",
      "getCenterXySVG",
      "getVertex",
      "calcVertex",
      "parseOxy",
      "normalizeVector",
      "rectsOverlap/rectContains",
      "lockPage/unlockPage",
      "saveCursor/setCursor/restoreCursor",
      "ONE_ANG/ONE_RAD/THRESHOLD/EDGE_THRESHOLD/DRAGGING_RULE/UII_KEY",
    ],
    html: `
      <div class="stage stage--tall">
        <div class="panel-box" id="du-probe"
             style="left:60px;top:46px;width:200px;height:140px;cursor:crosshair">
          鼠标移到 DOM 探针
        </div>
        <svg width="200" height="130" style="position:absolute;left:320px;top:40px">
          <rect id="du-svg" x="20" y="20" width="130" height="70" rx="4"
                fill="rgba(52,211,153,.22)" stroke="var(--ok)"></rect>
          <text class="svg-label" x="22" y="110">鼠标移到 SVG 探针</text>
        </svg>
      </div>`,
  });

  buttons(s.controls, [
    ["lockPage()", () => (lockPage()), "btn--ghost"],
    ["unlockPage()", () => (unlockPage()), "btn--ghost"],
    [
      "setCursor('progress')",
      () => {
        saveCursor();
        setCursor("progress");
        setTimeout(() => {
          restoreCursor();
        }, 3000);
      },
      "btn--ghost",
    ],
  ]);

  s.controls.append(
    el("div", { class: "aside__block" }, [
      el("h4", { text: "常量" }),
      el("pre", {
        class: "readout",
        html: [
          ["ONE_ANG", ONE_ANG.toFixed(6)],
          ["ONE_RAD", ONE_RAD.toFixed(6)],
          ["THRESHOLD", THRESHOLD],
          ["EDGE_THRESHOLD", EDGE_THRESHOLD],
          ["DRAGGING_RULE", DRAGGING_RULE],
          ["UII_KEY", UII_KEY],
          ["VERSION", uii.VERSION],
        ]
          .map((r) => `<b>${r[0]}</b>  ${r[1]}`)
          .join("\n"),
      }),
    ])
  );
}

/* --------------------------------- mount --------------------------------- */

mount({ nav: "#sidenav", main: "#main" }, { navTitle: "API 分类" });
