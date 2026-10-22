/* eslint-disable max-len */
/**
 * 正交连线路由与端口几何（纯函数）
 *
 * 用于组态/HMI/流程图类设计器：节点带端口，端口之间有正交（Manhattan）折线连线。
 * 本模块只做几何计算，不依赖任何具体数据模型；调用方把节点/端口映射为
 * {@link NodeBox} / {@link PortLike} 即可。
 *
 * @author holyhigh2
 */

import type { Rect } from "./geometry";

/** 平面点 */
export interface Point {
  x: number;
  y: number;
}

/** 端口朝向 */
export type PortDir = "up" | "down" | "left" | "right";

/**
 * 节点包围盒（世界坐标）。与 {@link Rect} 一致，另带旋转角。
 *
 * @see Rect
 */
export interface NodeBox extends Rect {
  /** 绕包围盒中心顺时针旋转角度（度），缺省 0 */
  rotate?: number;
}

/**
 * 端口定义。x/y 为相对节点宽高的 0~1 比例坐标，dir 为朝向。
 */
export interface PortLike {
  x: number;
  y: number;
  dir?: PortDir;
}

/** 折点走向：'h' 表示与上一点的 y 相同（水平段），'v' 表示 x 相同（垂直段） */
export type Orient = "h" | "v";

/**
 * 连线折点。orient 记录「上一个点（锚点或前一折点）连到本折点」这段的走向。
 */
export interface Waypoint {
  x: number;
  y: number;
  orient: Orient;
}

/** 路由端点：世界坐标点 + 可选出/入方向 */
export interface RouteEnd {
  p: Point;
  dir?: PortDir;
}

const DIR_VEC: Record<PortDir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * 端口在画布世界坐标中的位置（考虑节点旋转）。
 *
 * @param node 节点包围盒
 * @param port 端口（0~1 比例坐标）
 * @returns 端口圆心的世界坐标
 */
export function portWorldPos(node: NodeBox, port: PortLike): Point {
  const px = node.x + port.x * node.w;
  const py = node.y + port.y * node.h;
  const rotate = node.rotate || 0;
  if (!rotate) return { x: px, y: py };
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  const rad = (rotate * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

/**
 * 端口朝外的单位法线（世界坐标）。节点旋转时法线同步旋转。
 *
 * 端口圆点可沿此外移，使其与贴边中点的缩放手柄错开，二者都能单独点中。
 *
 * @param dir 端口朝向
 * @param rotate 节点旋转角（度），缺省 0
 * @returns 单位法线向量
 */
export function portOutward(dir: PortDir, rotate = 0): Point {
  const d = DIR_VEC[dir];
  if (rotate === 0) return d;
  const rad = (rotate * Math.PI) / 180;
  return { x: d.x * Math.cos(rad) - d.y * Math.sin(rad), y: d.x * Math.sin(rad) + d.y * Math.cos(rad) };
}

function orientOf(a: Point, b: Point): Orient {
  return a.y === b.y ? "h" : "v";
}

/**
 * 创建连线时生成初始正交折点链（Manhattan 路由）。
 *
 * 结果不含两端锚点，只含中间折点（带 orient）。
 *
 * @param a 起点（世界坐标 + 出线方向）
 * @param b 终点（世界坐标 + 入线方向）
 * @param gridSize 网格步长，出线桩长取 2 倍；<=0 时不做吸附
 * @returns 新折点数组，不修改入参
 */
export function routeInitial(a: RouteEnd, b: RouteEnd, gridSize = 10): Waypoint[] {
  const snap = (v: number) => (gridSize > 0 ? Math.round(v / gridSize) * gridSize : v);
  const stub = gridSize * 2;
  let start = { ...a.p };
  if (a.dir) start = { x: start.x + DIR_VEC[a.dir].x * stub, y: start.y + DIR_VEC[a.dir].y * stub };
  let end = { ...b.p };
  if (b.dir) end = { x: end.x + DIR_VEC[b.dir].x * stub, y: end.y + DIR_VEC[b.dir].y * stub };
  start = { x: a.dir === "left" || a.dir === "right" ? snap(start.x) : start.x, y: a.dir === "up" || a.dir === "down" ? snap(start.y) : start.y };
  end = { x: b.dir === "left" || b.dir === "right" ? snap(end.x) : end.x, y: b.dir === "up" || b.dir === "down" ? snap(end.y) : end.y };

  // 生成正交链：从 start 出发，按起终方向优先
  const pts: Point[] = [start];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const aOrient = a.dir === "up" || a.dir === "down" ? "v" : "h";
  const bOrient = b.dir === "up" || b.dir === "down" ? "v" : "h";

  if (aOrient === "v" && bOrient === "v") {
    // 两端都是垂直出入口：中点拐水平
    if (dx !== 0 || dy !== 0) {
      pts.push({ x: start.x, y: end.y + (dy > 0 ? -stub : stub) });
      pts.push({ x: end.x, y: end.y + (dy > 0 ? -stub : stub) });
    }
  } else if (aOrient === "h" && bOrient === "h") {
    if (dx !== 0 || dy !== 0) {
      pts.push({ x: end.x + (dx > 0 ? -stub : stub), y: start.y });
      pts.push({ x: end.x + (dx > 0 ? -stub : stub), y: end.y });
    }
  } else if (aOrient === "v" && bOrient === "h") {
    if (dx !== 0 || dy !== 0) pts.push({ x: start.x, y: end.y });
  } else {
    if (dx !== 0 || dy !== 0) pts.push({ x: end.x, y: start.y });
  }
  pts.push(end);

  // 去掉与锚点重合的中间点以及相邻重复点
  const chain = pts.filter((p, i) => {
    if (i === 0 && p.x === a.p.x && p.y === a.p.y) return false;
    if (i === pts.length - 1 && p.x === b.p.x && p.y === b.p.y) return false;
    return !(p.x === pts[i - 1]?.x && p.y === pts[i - 1]?.y);
  });

  // 转成 waypoint：orient 为「上一点连到本点」的走向
  const waypoints: Waypoint[] = [];
  let prev: Point = a.p;
  for (const p of chain) {
    waypoints.push({ x: p.x, y: p.y, orient: orientOf(prev, p) });
    prev = p;
  }
  // 去重相邻共线点
  return waypoints.filter((w, i) => {
    const next = waypoints[i + 1];
    if (!next) return true;
    return !(w.orient === "h" && w.y === next.y) && !(w.orient === "v" && w.x === next.x);
  });
}

/**
 * 由锚点 + 折点链生成 SVG path 的 `d`。
 *
 * `corner > 0` 时把每个折点替换为圆角（工艺管路常用）。圆角半径不超过相邻两段
 * 各自长度的一半，避免短段被圆角吃掉导致路径自交。
 *
 * @param a 起点锚点
 * @param b 终点锚点
 * @param waypoints 中间折点
 * @param corner 折点圆角半径，<=0 为直角
 * @returns path 的 d 字符串
 */
export function linkPathD(a: Point, b: Point, waypoints: Waypoint[], corner = 0): string {
  const pts = [a, ...waypoints.map((w) => ({ x: w.x, y: w.y })), b];
  if (!(corner > 0) || pts.length < 3) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  }

  const out: string[] = [`M${a.x} ${a.y}`];
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const d1 = Math.hypot(p0.x - p1.x, p0.y - p1.y);
    const d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const r = Math.min(corner, d1 / 2, d2 / 2);
    if (!(r > 0)) {
      out.push(`L${p1.x} ${p1.y}`);
      continue;
    }
    // 切点：沿 p1->p0 与 p1->p2 各退 r
    const t1x = p1.x + ((p0.x - p1.x) / d1) * r;
    const t1y = p1.y + ((p0.y - p1.y) / d1) * r;
    const t2x = p1.x + ((p2.x - p1.x) / d2) * r;
    const t2y = p1.y + ((p2.y - p1.y) / d2) * r;
    out.push(`L${t1x} ${t1y}`);
    out.push(`Q${p1.x} ${p1.y} ${t2x} ${t2y}`);
  }
  const last = pts[pts.length - 1];
  out.push(`L${last.x} ${last.y}`);
  return out.join(" ");
}

/**
 * 端点（节点移动/缩放、端点被拖动）变化后重挂首尾折点。
 *
 * 只移动紧邻端点的那一个折点，并让它形成肘弯：与端点相连的那条边保持原有走向
 * （故该坐标不动），另一坐标对齐再下一个点，于是「端点→折点→下一点」仍然正交。
 * 中间的折点一律不动，用户手工布线得以保留。
 *
 * @param waypoints 折点链
 * @param a 新的起点锚点
 * @param b 新的终点锚点
 * @returns 新的折点数组，不修改入参
 */
export function reattachLink(waypoints: Waypoint[], a: Point, b: Point): Waypoint[] {
  const ws = waypoints.map((w) => ({ ...w }));
  if (ws.length === 0) return ws;

  if (ws.length === 1) {
    // 只有一个折点：没有「下一点」可对齐，按原有走向决定肘弯朝向
    const w = ws[0];
    if (w.orient === "v") {
      w.x = a.x;
      w.y = b.y;
    } else {
      w.y = a.y;
      w.x = b.x;
    }
    return ws;
  }

  const first = ws[0];
  const second = ws[1];
  if (a.x === first.x) {
    first.x = a.x;
    first.y = second.y;
  } else {
    first.y = a.y;
    first.x = second.x;
  } // 竖进→横出 / 横进→竖出

  const last = ws[ws.length - 1];
  const prev = ws[ws.length - 2];
  if (prev.x === last.x) {
    last.x = prev.x;
    last.y = b.y;
  } else {
    last.y = prev.y;
    last.x = b.x;
  }
  return ws;
}

/**
 * 把折点拖到 (x,y)：按 orient 约束一维自由度，并向后级联保持整条线正交。
 *
 * @param waypoints 折点链
 * @param index 被拖动的折点下标
 * @param x 指针世界坐标 x
 * @param y 指针世界坐标 y
 * @param a 起点锚点
 * @param grid 吸附步长，<=0 不吸附
 * @returns 新的折点数组，不修改入参
 */
export function dragWaypoint(waypoints: Waypoint[], index: number, x: number, y: number, a: Point, grid = 10): Waypoint[] {
  const ws = waypoints.map((w) => ({ ...w }));
  const w = ws[index];
  if (!w) return ws;
  const snap = (v: number) => (grid > 0 ? Math.round(v / grid) * grid : v);
  const prev = index === 0 ? a : ws[index - 1];
  if (w.orient === "v") {
    w.x = prev.x;
    w.y = snap(y);
  } else {
    w.x = snap(x);
    w.y = prev.y;
  }
  // 级联：后续折点依次对齐前一点，保持水平/垂直
  for (let j = index + 1; j < ws.length; j++) {
    const p = ws[j - 1];
    if (ws[j].orient === "v") ws[j].x = p.x;
    else ws[j].y = p.y;
  }
  return ws;
}
