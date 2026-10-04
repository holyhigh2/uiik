/* eslint-disable max-len */
/**
 * 纯几何运算
 *
 * @author holyhigh2
 */

// ---------------------------------------------------------------- rect

/**
 * 矩形。约定以左上角为原点。
 * 与 DOMRect 的差异是尺寸字段名为 w/h 而非 width/height，
 * 以便与 uiik 既有的 getBox/getRectInContainer 返回值保持一致。
 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 距各边的距离/内缩量 */
export interface Insets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export function getRectRight(rect: Rect): number {
  return rect.x + rect.w;
}

export function getRectBottom(rect: Rect): number {
  return rect.y + rect.h;
}

export function rectCenter(rect: Rect): { x: number; y: number } {
  return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}

/**
 * 一组矩形的并集（最小包围盒）
 * @returns 空数组时返回 null
 */
export function unionRect(rects: Rect[]): Rect | null {
  if (!rects || rects.length === 0) return null;
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const rect of rects) {
    if (!rect) continue;
    x1 = Math.min(x1, rect.x);
    y1 = Math.min(y1, rect.y);
    x2 = Math.max(x2, getRectRight(rect));
    y2 = Math.max(y2, getRectBottom(rect));
  }
  if (x2 < x1 || y2 < y1) return null;
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

/** 两个矩形是否相交（含边界相接） */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x <= getRectRight(b) && getRectRight(a) >= b.x && a.y <= getRectBottom(b) && getRectBottom(a) >= b.y;
}

/** outer 是否完全包含 inner */
export function rectContains(outer: Rect, inner: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    getRectRight(inner) <= getRectRight(outer) &&
    getRectBottom(inner) <= getRectBottom(outer)
  );
}

/**
 * 按内缩量收缩矩形
 * 任一边收缩过头时该轴尺寸退化为 0；两侧内缩量不等时保留中心
 */
export function rectInset(rect: Rect, insets: Insets): Rect {
  const top = insets.top || 0;
  const right = insets.right || 0;
  const bottom = insets.bottom || 0;
  const left = insets.left || 0;
  const w = Math.max(0, rect.w - left - right);
  const h = Math.max(0, rect.h - top - bottom);
  const x = left > right ? rect.x + left : getRectRight(rect) - right - w;
  const y = top > bottom ? rect.y + top : getRectBottom(rect) - bottom - h;
  return { x, y, w, h };
}

// ---------------------------------------------------------------- align

/**
 * 对齐方式。
 * 名称描述「被移动矩形的目标位置」：
 * left/right/top/bottom 为某一边对齐，centerX/centerY 为该轴居中对齐。
 */
export type AlignMode =
  | "left"
  | "centerX"
  | "right"
  | "top"
  | "centerY"
  | "bottom";

/** 计算矩形在某对齐方式下的对齐线坐标 */
function alignCoord(rect: Rect, mode: AlignMode): number {
  switch (mode) {
    case "left":
      return rect.x;
    case "centerX":
      return rect.x + rect.w / 2;
    case "right":
      return getRectRight(rect);
    case "top":
      return rect.y;
    case "centerY":
      return rect.y + rect.h / 2;
    case "bottom":
      return getRectBottom(rect);
  }
}

/** 令矩形在该对齐方式下的对齐线落到 coord */
function applyCoord(rect: Rect, mode: AlignMode, coord: number): Rect {
  switch (mode) {
    case "left":
      return { ...rect, x: coord };
    case "centerX":
      return { ...rect, x: coord - rect.w / 2 };
    case "right":
      return { ...rect, x: coord - rect.w };
    case "top":
      return { ...rect, y: coord };
    case "centerY":
      return { ...rect, y: coord - rect.h / 2 };
    case "bottom":
      return { ...rect, y: coord - rect.h };
  }
}

/**
 * 对齐一组矩形
 *
 * @param rects 待对齐的矩形
 * @param mode 对齐方式
 * @param to 对齐参照框，缺省为 rects 自身的并集（对齐到选区）。
 *            传入单元素的数组即对齐到某个容器/画布
 * @returns 新的矩形数组，不修改入参
 */
export function alignRects(rects: Rect[], mode: AlignMode, to?: Rect[]): Rect[] {
  if (!rects || rects.length === 0) return [];
  const ref = unionRect(to && to.length ? to : rects);
  if (!ref) return rects.map((r) => ({ ...r }));
  const coord = alignCoord(ref, mode);
  return rects.map((rect) => applyCoord(rect, mode, coord));
}

// ---------------------------------------------------------------- distribute

export type DistributeDir = "h" | "v";

export interface DistributeOptions {
  /**
   * 相邻矩形之间的固定间距。缺省为等间距分布（首尾之间的空隙平均分配）。
   * 注意 0 与「未传」同义，故无法表达「间距为 0」
   */
  gap?: number;
  /**
   * 分布的同时在该轴上对齐，使结果保持整齐。
   * 须为垂直于 dir 的那组模式（dir='h' 时传 top/centerY/bottom），否则忽略
   */
  align?: AlignMode;
}

/**
 * 沿单轴等间距分布一组矩形。
 * 首尾矩形的原位不动，中间的矩形在首尾之间重新排布。
 *
 * 少于 3 个矩形时无可分配的空隙，原样返回
 *
 * @returns 与输入一一对应的新矩形数组，不修改入参
 */
export function distributeRects(
  rects: Rect[],
  dir: DistributeDir,
  opts?: DistributeOptions
): Rect[] {
  const result = (rects || []).map((r) => ({ ...r }));
  if (result.length < 3) return result;

  const posKey = dir === "h" ? "x" : "y";
  const sizeKey = dir === "h" ? "w" : "h";

  // 排序下标而非排序对象，保证结果与输入顺序一一对应
  const order = result.map((_, i) => i);
  order.sort((a, b) => result[a][posKey] - result[b][posKey]);

  const first = result[order[0]];
  const last = result[order[order.length - 1]];
  const span = last[posKey] + last[sizeKey] - first[posKey];
  const sumSizes = result.reduce((acc, r) => acc + r[sizeKey], 0);
  const gap =
    opts?.gap != null ? opts.gap : (span - sumSizes) / (result.length - 1);

  const crossMode = opts?.align;
  const validCross =
    crossMode != null &&
    (dir === "h"
      ? crossMode === "top" || crossMode === "centerY" || crossMode === "bottom"
      : crossMode === "left" || crossMode === "centerX" || crossMode === "right");
  const crossCoord = validCross ? alignCoord(unionRect(result) as Rect, crossMode) : undefined;

  let cursor = first[posKey];
  for (const i of order) {
    if (crossCoord != null && crossMode) {
      Object.assign(result[i], applyCoord(result[i], crossMode, crossCoord));
    }
    result[i][posKey] = cursor;
    cursor += result[i][sizeKey] + gap;
  }
  return result;
}

// ---------------------------------------------------------------- resize

/**
 * 缩放方向。与 CSS resize 的 8 个取值一致，
 * 表示「拖动该侧的手柄」，对侧保持不动
 */
export type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface ResizeOptions {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  /** 保持宽高比。仅对四角方向有意义，以位移较大的一轴为主轴 */
  keepAspect?: boolean;
  /** 尺寸吸附步长，>0 时把 w/h 吸附到其整数倍 */
  grid?: number;
}

/**
 * 吸附到网格步长。
 * 负坐标同样正确——不能用位运算 `>> 0`，它向零截断，
 * 会把 x=-7/grid=10 吸附到 0 而非 -10
 */
export function snapToGrid(v: number, grid: number): number {
  return grid > 0 ? Math.round(v / grid) * grid : v;
}

/**
 * 求解缩放后的矩形
 *
 * @param start 缩放前的矩形
 * @param dir 手柄方向
 * @param dx 指针在 x 轴上的位移
 * @param dy 指针在 y 轴上的位移
 * @param opts 尺寸约束
 * @returns 新的矩形，不修改入参。对侧边保持不动
 */
export function resizeRect(
  start: Rect,
  dir: ResizeDir,
  dx: number,
  dy: number,
  opts?: ResizeOptions
): Rect {
  const minW = opts?.minW != null ? opts.minW : 0;
  const minH = opts?.minH != null ? opts.minH : 0;
  const maxW = opts?.maxW != null ? opts.maxW : Infinity;
  const maxH = opts?.maxH != null ? opts.maxH : Infinity;
  const grid = opts?.grid != null ? opts.grid : 0;

  let x = start.x;
  let y = start.y;
  let w = start.w;
  let h = start.h;

  const movesX = dir.indexOf("e") >= 0 || dir.indexOf("w") >= 0;
  const movesY = dir.indexOf("n") >= 0 || dir.indexOf("s") >= 0;

  if (movesX) {
    const raw = dir.indexOf("w") >= 0 ? start.w - dx : start.w + dx;
    w = Math.min(maxW, Math.max(minW, snapToGrid(raw, grid)));
    // 西侧手柄：东边不动，故 x 反向补偿
    if (dir.indexOf("w") >= 0) x = start.x + (start.w - w);
  }
  if (movesY) {
    const raw = dir.indexOf("n") >= 0 ? start.h - dy : start.h + dy;
    h = Math.min(maxH, Math.max(minH, snapToGrid(raw, grid)));
    if (dir.indexOf("n") >= 0) y = start.y + (start.h - h);
  }

  if (opts?.keepAspect && movesX && movesY && start.w > 0 && start.h > 0) {
    const ratio = start.h / start.w;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const nh = Math.min(maxH, Math.max(minH, snapToGrid(w * ratio, grid)));
      if (dir.indexOf("n") >= 0) y = start.y + (start.h - nh);
      h = nh;
    } else {
      const nw = Math.min(maxW, Math.max(minW, snapToGrid(h / ratio, grid)));
      if (dir.indexOf("w") >= 0) x = start.x + (start.w - nw);
      w = nw;
    }
  }

  return { x, y, w, h };
}

// ---------------------------------------------------------------- camera

/**
 * 视图状态，等价于根元素上的 transform: translate(x, y) scale(scale)
 */
export interface View {
  x: number;
  y: number;
  scale: number;
}

/** 视口尺寸 */
export interface Viewport {
  w: number;
  h: number;
}

export interface FitOptions {
  /** 内容四周留白（视口像素） */
  padding?: number;
  minScale?: number;
  /** 缺省为 1，即放得下时不再放大 */
  maxScale?: number;
}

/**
 * 缩放并平移视口，使 rect 恰好居中落在视口内
 *
 * @param rect 世界坐标下的目标区域
 * @param viewport 视口尺寸
 * @returns 新的 View
 */
export function fitRectInViewport(rect: Rect, viewport: Viewport, opts?: FitOptions): View {
  const padding = opts?.padding != null ? opts.padding : 0;
  const minScale = opts?.minScale != null ? opts.minScale : 0;
  const maxScale = opts?.maxScale != null ? opts.maxScale : 1;

  const availW = Math.max(1, viewport.w - padding * 2);
  const availH = Math.max(1, viewport.h - padding * 2);
  const raw = rect.w > 0 && rect.h > 0 ? Math.min(availW / rect.w, availH / rect.h) : maxScale;
  const scale = Math.min(maxScale, Math.max(minScale, raw));

  return {
    x: (viewport.w - rect.w * scale) / 2 - rect.x * scale,
    y: (viewport.h - rect.h * scale) / 2 - rect.y * scale,
    scale,
  };
}

export interface ZoomOptions {
  min?: number;
  max?: number;
}

/**
 * 以视口内某点为锚点缩放，锚点下的世界坐标保持不动
 *
 * @param pivot 视口（屏幕）坐标下的锚点
 */
export function zoomAt(view: View, pivot: { x: number; y: number }, factor: number, opts?: ZoomOptions): View {
  const min = opts?.min != null ? opts.min : 0.2;
  const max = opts?.max != null ? opts.max : 4;
  const scale = Math.min(max, Math.max(min, view.scale * factor));
  const k = scale / view.scale;
  return {
    x: pivot.x - (pivot.x - view.x) * k,
    y: pivot.y - (pivot.y - view.y) * k,
    scale,
  };
}

/** 视图平移 */
export function panBy(view: View, dx: number, dy: number): View {
  return { x: view.x + dx, y: view.y + dy, scale: view.scale };
}

// ---------------------------------------------------------------- snap

/**
 * 参与吸附的锚点。
 * start/end 为矩形在该轴的起点/终点边，center 为中线。
 * 三者全开即设计器常见的 3×3 共 9 种对齐组合
 */
export type SnapPoint = "start" | "center" | "end";

const DEFAULT_SNAP_POINTS: SnapPoint[] = ["start", "center", "end"];

export interface SnapOptions {
  /** x 轴容差，默认 6 */
  tolerance?: number;
  /** y 轴容差，缺省同 tolerance */
  toleranceY?: number;
  /** 参与吸附的锚点，缺省三线全开。同时作用于 x/y 两轴 */
  points?: SnapPoint[];
  /**
   * 多候选取舍，缺省 nearest（取位移最小者）。
   * first 为按遍历顺序取首个命中：先按 targets 顺序，
   * 同一 target 内再按候选矩形的 points 顺序（默认即先左后右）
   */
  strategy?: "nearest" | "first";
  /** 排除的 target 下标 */
  exclude?: number[];
  /**
   * 命中回调，返回 false 放弃该候选。
   * 用于按锚点施加优先级（先左后右），实现 jQuery UI draggable 的 snapMode
   */
  onHit?: (hit: SnapHit) => boolean | void;
}

export interface SnapHit {
  axis: "x" | "y";
  /** 候选矩形命中的锚点 */
  point: SnapPoint;
  /** 目标矩形命中的锚点 */
  targetPoint: SnapPoint;
  /** 命中目标在 targets 中的下标 */
  targetIndex: number;
  /** 目标锚点坐标 */
  coord: number;
  /** 需施加的位移 */
  delta: number;
}

export interface SnapResult {
  dx: number;
  dy: number;
  hitX?: SnapHit;
  hitY?: SnapHit;
}

/** 锚点坐标 */
function pointCoord(rect: Rect, axis: "x" | "y", point: SnapPoint): number {
  if (axis === "x") {
    return point === "start" ? rect.x : point === "center" ? rect.x + rect.w / 2 : getRectRight(rect);
  }
  return point === "start" ? rect.y : point === "center" ? rect.y + rect.h / 2 : getRectBottom(rect);
}

/** 矩形在某轴上的全部锚点 */
function pointsOn(rect: Rect, axis: "x" | "y", points: SnapPoint[]) {
  return points.map((point) => ({ point, coord: pointCoord(rect, axis, point) }));
}

/**
 * 元素吸附求解：把候选矩形吸附到一组目标矩形的对齐线上
 *
 * 候选与目标的锚点两两配对（三线全开即 3×3 共 9 种组合），
 * 因此「右边缘贴左边缘」这类交叉对齐同样会被识别。
 *
 * @param candidate 待吸附的矩形，通常是被拖动元素当前所在位置
 * @param targets 吸附目标矩形集合
 * @param opts 容差/锚点/取舍策略等
 * @returns 命中时给出需施加的位移 dx/dy；未命中则 dx=dy=0
 */
export function findSnap(candidate: Rect, targets: Rect[], opts?: SnapOptions): SnapResult {
  const result: SnapResult = { dx: 0, dy: 0 };
  if (!candidate || !targets || targets.length === 0) return result;

  const tx = opts?.tolerance != null ? opts.tolerance : 6;
  const ty = opts?.toleranceY != null ? opts.toleranceY : tx;
  const strategy = opts?.strategy || "nearest";
  const exclude = opts?.exclude || [];
  const points = opts?.points && opts.points.length ? opts.points : DEFAULT_SNAP_POINTS;

  const candX = pointsOn(candidate, "x", points);
  const candY = pointsOn(candidate, "y", points);
  let bestX: SnapHit | null = null;
  let bestY: SnapHit | null = null;

  for (let i = 0; i < targets.length; i++) {
    if (exclude.indexOf(i) >= 0) continue;
    const target = targets[i];
    if (!target) continue;
    const tgtX = pointsOn(target, "x", points);
    const tgtY = pointsOn(target, "y", points);

    for (const c of candX) {
      for (const t of tgtX) {
        const delta = t.coord - c.coord;
        if (Math.abs(delta) > tx) continue;
        const hit: SnapHit = {
          axis: "x",
          point: c.point,
          targetPoint: t.point,
          targetIndex: i,
          coord: t.coord,
          delta,
        };
        if (opts?.onHit && opts.onHit(hit) === false) continue;
        if (!bestX || (strategy === "nearest" && Math.abs(delta) < Math.abs(bestX.delta))) {
          bestX = hit;
        }
      }
    }

    for (const c of candY) {
      for (const t of tgtY) {
        const delta = t.coord - c.coord;
        if (Math.abs(delta) > ty) continue;
        const hit: SnapHit = {
          axis: "y",
          point: c.point,
          targetPoint: t.point,
          targetIndex: i,
          coord: t.coord,
          delta,
        };
        if (opts?.onHit && opts.onHit(hit) === false) continue;
        if (!bestY || (strategy === "nearest" && Math.abs(delta) < Math.abs(bestY.delta))) {
          bestY = hit;
        }
      }
    }
  }

  if (bestX) {
    result.dx = bestX.delta;
    result.hitX = bestX;
  }
  if (bestY) {
    result.dy = bestY.delta;
    result.hitY = bestY;
  }
  return result;
}

/** 一条吸附参考线 */
export interface SnapGuide {
  /** v 为竖线（固定 x），h 为横线（固定 y） */
  dir: "v" | "h";
  /** 参考线所在坐标 */
  coord: number;
  /** 参考线的起止坐标 */
  from: number;
  to: number;
}

/**
 * 由吸附结果生成参考线
 *
 * @param candidate 拖动前（或吸附前）的矩形
 * @param targets findSnap 的目标集合
 * @param result findSnap 的返回值
 * @param padding 两端外扩量
 */
export function snapGuides(
  candidate: Rect,
  targets: Rect[],
  result: SnapResult,
  padding = 40
): SnapGuide[] {
  if (!candidate || !result || (!result.hitX && !result.hitY)) return [];
  const moved: Rect = {
    x: candidate.x + result.dx,
    y: candidate.y + result.dy,
    w: candidate.w,
    h: candidate.h,
  };
  const parts: Rect[] = [candidate, moved];
  if (result.hitX && targets) {
    const t = targets[result.hitX.targetIndex];
    if (t) parts.push(t);
  }
  if (result.hitY && targets) {
    const t = targets[result.hitY.targetIndex];
    if (t) parts.push(t);
  }
  const span = unionRect(parts);
  if (!span) return [];

  const guides: SnapGuide[] = [];
  if (result.hitX) {
    guides.push({ dir: "v", coord: result.hitX.coord, from: span.y - padding, to: getRectBottom(span) + padding });
  }
  if (result.hitY) {
    guides.push({ dir: "h", coord: result.hitY.coord, from: span.x - padding, to: getRectRight(span) + padding });
  }
  return guides;
}