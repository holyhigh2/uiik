/**
 * geometry 单元测试
 *
 * 运行：npm run test:unit（spec/）
 * 零依赖：使用 node 内置的 node:test 与 node:assert，
 * 配合 Node 原生类型剥离直接运行 TS 源码，无需预编译。
 */

import * as assert from "node:assert/strict";
import { test } from "node:test";

import type { Rect, SnapResult } from "../src/geometry.ts";
import {
  alignRects,
  distributeRects,
  findSnap,
  fitRectInViewport,
  getRectBottom,
  getRectRight,
  panBy,
  rectCenter,
  rectContains,
  rectInset,
  rectsOverlap,
  resizeRect,
  snapGuides,
  unionRect,
  zoomAt
} from "../src/geometry.ts";

/** 浮点比较 */
function near(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) < eps,
    `期望 ${expected}，实际 ${actual}`
  );
}

function nearRect(actual: Rect, expected: Rect, eps = 1e-9) {
  near(actual.x, expected.x, eps);
  near(actual.y, expected.y, eps);
  near(actual.w, expected.w, eps);
  near(actual.h, expected.h, eps);
}

/** 深拷贝，用于验证纯函数未修改入参 */
function clone(rects: Rect[]): Rect[] {
  return rects.map((r) => ({ ...r }));
}

// ---------------------------------------------------------------- rect

test("getRectRight/getRectBottom/getRectCenter", () => {
  const r: Rect = { x: 10, y: 20, w: 30, h: 40 };
  assert.equal(getRectRight(r), 40);
  assert.equal(getRectBottom(r), 60);
  assert.deepEqual(rectCenter(r), { x: 25, y: 40 });
});

test("unionRect: 空数组返回 null", () => {
  assert.equal(unionRect([]), null);
});

test("unionRect: 单个矩形", () => {
  nearRect(unionRect([{ x: 5, y: 6, w: 7, h: 8 }]) as Rect, {
    x: 5,
    y: 6,
    w: 7,
    h: 8,
  });
});

test("unionRect: 多个矩形取最小包围盒", () => {
  const u = unionRect([
    { x: 10, y: 10, w: 20, h: 20 },
    { x: 100, y: 5, w: 10, h: 10 },
    { x: 40, y: 60, w: 5, h: 5 },
  ]) as Rect;
  nearRect(u, { x: 10, y: 5, w: 100, h: 60 });
});

test("unionRect: 忽略非法项", () => {
  const u = unionRect([
    { x: 0, y: 0, w: 10, h: 10 },
    null as unknown as Rect,
  ]) as Rect;
  nearRect(u, { x: 0, y: 0, w: 10, h: 10 });
});

test("rectsOverlap: 相交/相接/分离", () => {
  const a: Rect = { x: 0, y: 0, w: 10, h: 10 };
  assert.equal(rectsOverlap(a, { x: 5, y: 5, w: 10, h: 10 }), true);
  // 边界相接视为相交，与主流设计器一致
  assert.equal(rectsOverlap(a, { x: 10, y: 0, w: 10, h: 10 }), true);
  assert.equal(rectsOverlap(a, { x: 10.5, y: 0, w: 10, h: 10 }), false);
  assert.equal(rectsOverlap(a, { x: 0, y: 20, w: 10, h: 10 }), false);
});

test("rectContains: 完全包含", () => {
  const outer: Rect = { x: 0, y: 0, w: 100, h: 100 };
  assert.equal(rectContains(outer, { x: 10, y: 10, w: 10, h: 10 }), true);
  assert.equal(rectContains(outer, { x: 10, y: 10, w: 100, h: 10 }), false);
  assert.equal(rectContains(outer, { x: -1, y: 0, w: 10, h: 10 }), false);
});

test("rectInset: 四边等量收缩", () => {
  nearRect(rectInset({ x: 0, y: 0, w: 100, h: 50 }, { top: 5, right: 5, bottom: 5, left: 5 }), {
    x: 5,
    y: 5,
    w: 90,
    h: 40,
  });
});

test("rectInset: 两侧不等时保留中心", () => {
  nearRect(rectInset({ x: 0, y: 0, w: 100, h: 50 }, { left: 10, right: 30 }), {
    x: 10,
    y: 0,
    w: 60,
    h: 50,
  });
});

test("rectInset: 收缩过头时该轴退化为 0 而非负数", () => {
  const r = rectInset({ x: 0, y: 0, w: 10, h: 10 }, { left: 8, right: 8 });
  assert.equal(r.w, 0);
  assert.ok(r.h === 10);
});

// ---------------------------------------------------------------- align

test("alignRects: 左对齐到选区包围盒", () => {
  const rects = [
    { x: 30, y: 0, w: 10, h: 10 },
    { x: 5, y: 20, w: 30, h: 10 },
  ];
  const out = alignRects(rects, "left");
  assert.equal(out[0].x, 5);
  assert.equal(out[1].x, 5);
  // 未对齐的轴保持不变
  assert.equal(out[0].y, 0);
});

test("alignRects: 右对齐保持右边线一致", () => {
  const out = alignRects(
    [
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 40, y: 0, w: 30, h: 10 },
    ],
    "right"
  );
  assert.equal(getRectRight(out[0]), getRectRight(out[1]));
  assert.equal(getRectRight(out[0]), 70);
});

test("alignRects: 水平居中对齐中线一致", () => {
  const out = alignRects(
    [
      { x: 0, y: 0, w: 20, h: 10 },
      { x: 50, y: 0, w: 10, h: 10 },
    ],
    "centerX"
  );
  near(rectCenter(out[0]).x, rectCenter(out[1]).x);
  // 选区并集为 [0,60]，中线 30
  near(rectCenter(out[0]).x, 30);
});

test("alignRects: 垂直方向 top/bottom/centerY", () => {
  const rects = [
    { x: 0, y: 10, w: 10, h: 20 },
    { x: 0, y: 50, w: 10, h: 5 },
  ];
  assert.deepEqual(
    alignRects(rects, "top").map((r) => r.y),
    [10, 10]
  );
  assert.deepEqual(
    alignRects(rects, "bottom").map((r) => getRectBottom(r)),
    [55, 55]
  );
  const cy = alignRects(rects, "centerY");
  near(rectCenter(cy[0]).y, rectCenter(cy[1]).y);
});

test("alignRects: 参照框可指定（对齐到画布）", () => {
  const out = alignRects([{ x: 7, y: 7, w: 10, h: 10 }], "centerX", [
    { x: 0, y: 0, w: 200, h: 100 },
  ]);
  assert.equal(out[0].x, 95);
});

test("alignRects: 纯函数，不修改入参", () => {
  const rects = [
    { x: 30, y: 0, w: 10, h: 10 },
    { x: 5, y: 20, w: 30, h: 10 },
  ];
  const before = clone(rects);
  const out = alignRects(rects, "left");
  assert.deepEqual(rects, before);
  assert.notEqual(out[0], rects[0]);
});

test("alignRects: 空数组返回空数组", () => {
  assert.deepEqual(alignRects([], "left"), []);
});

// ---------------------------------------------------------------- distribute

test("distributeRects: 水平等间距，首尾不动", () => {
  const rects = [
    { x: 0, y: 0, w: 10, h: 10 },
    { x: 15, y: 0, w: 20, h: 10 },
    { x: 100, y: 0, w: 10, h: 10 },
  ];
  const out = distributeRects(rects, "h");
  // 跨度 110，总尺寸 40，两个间隙各 35
  assert.equal(out[0].x, 0);
  assert.equal(out[1].x, 45);
  assert.equal(out[2].x, 100);
  const gap1 = out[1].x - getRectRight(out[0]);
  const gap2 = out[2].x - getRectRight(out[1]);
  near(gap1, gap2);
});

test("distributeRects: 固定 gap", () => {
  const out = distributeRects(
    [
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 12, y: 0, w: 10, h: 10 },
      { x: 200, y: 0, w: 10, h: 10 },
    ],
    "h",
    { gap: 50 }
  );
  assert.deepEqual(
    out.map((r) => r.x),
    [0, 60, 120]
  );
});

test("distributeRects: 垂直方向", () => {
  const out = distributeRects(
    [
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 0, y: 12, w: 10, h: 10 },
      { x: 0, y: 103, w: 10, h: 10 },
    ],
    "v",
    { gap: 20 }
  );
  assert.deepEqual(
    out.map((r) => r.y),
    [0, 30, 60]
  );
});

test("distributeRects: 结果与输入顺序一一对应", () => {
  const rects = [
    { x: 100, y: 0, w: 10, h: 10 },
    { x: 0, y: 0, w: 10, h: 10 },
    { x: 50, y: 0, w: 10, h: 10 },
  ];
  const out = distributeRects(rects, "h", { gap: 10 });
  // rects[0] 原本最靠右，分布后仍是最靠右的那个，中间的两个依次排在其左侧
  assert.deepEqual(
    out.map((r) => r.x),
    [40, 0, 20]
  );
});

test("distributeRects: 可同时在垂直方向对齐", () => {
  const out = distributeRects(
    [
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 20, y: 30, w: 10, h: 10 },
      { x: 90, y: 60, w: 10, h: 10 },
    ],
    "h",
    { align: "centerY" }
  );
  const centers = out.map((r) => rectCenter(r).y);
  near(centers[0], centers[1]);
  near(centers[1], centers[2]);
  // 分布轴仍然生效
  assert.equal(out[2].x, 90);
});

test("distributeRects: 传入与 dir 冲突的 align 时忽略", () => {
  const out = distributeRects(
    [
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 20, y: 30, w: 10, h: 10 },
      { x: 90, y: 60, w: 10, h: 10 },
    ],
    "h",
    { align: "left", gap: 10 }
  );
  assert.deepEqual(
    out.map((r) => r.y),
    [0, 30, 60]
  );
});

test("distributeRects: 少于 3 个时原样返回副本", () => {
  const rects = [
    { x: 0, y: 0, w: 10, h: 10 },
    { x: 99, y: 0, w: 10, h: 10 },
  ];
  const out = distributeRects(rects, "h");
  assert.deepEqual(out, rects);
  assert.notEqual(out[0], rects[0]);
});

test("distributeRects: 纯函数，不修改入参", () => {
  const rects = [
    { x: 0, y: 0, w: 10, h: 10 },
    { x: 15, y: 0, w: 20, h: 10 },
    { x: 100, y: 0, w: 10, h: 10 },
  ];
  const before = clone(rects);
  distributeRects(rects, "h");
  assert.deepEqual(rects, before);
});

// ---------------------------------------------------------------- resize

test("resizeRect: 东侧手柄只改宽度", () => {
  const out = resizeRect({ x: 10, y: 10, w: 100, h: 50 }, "e", 30, 999);
  assert.deepEqual(out, { x: 10, y: 10, w: 130, h: 50 });
});

test("resizeRect: 西侧手柄保持东边不动", () => {
  const start = { x: 10, y: 10, w: 100, h: 50 };
  const out = resizeRect(start, "w", 30, 0);
  assert.equal(out.x, 40);
  assert.equal(out.w, 70);
  near(getRectRight(out), getRectRight(start));
});

test("resizeRect: 北侧手柄保持南边不动", () => {
  const start = { x: 0, y: 20, w: 100, h: 40 };
  // dy 为负表示向上拖，故高度增大
  const out = resizeRect(start, "n", 0, -10);
  assert.equal(out.y, 10);
  assert.equal(out.h, 50);
  near(getRectBottom(out), getRectBottom(start));
});

test("resizeRect: 西北手柄保持东南角不动", () => {
  const start = { x: 0, y: 0, w: 100, h: 100 };
  const out = resizeRect(start, "nw", 10, 20);
  near(getRectRight(out), getRectRight(start));
  near(getRectBottom(out), getRectBottom(start));
  assert.equal(out.x, 10);
  assert.equal(out.y, 20);
  assert.equal(out.w, 90);
  assert.equal(out.h, 80);
});

test("resizeRect: 最小尺寸约束", () => {
  const out = resizeRect({ x: 0, y: 0, w: 100, h: 100 }, "se", -500, -500, {
    minW: 20,
    minH: 30,
  });
  assert.deepEqual(out, { x: 0, y: 0, w: 20, h: 30 });
});

test("resizeRect: 单轴方向不约束另一轴", () => {
  const out = resizeRect({ x: 0, y: 0, w: 100, h: 100 }, "e", -500, 0, {
    minW: 20,
    minH: 30,
  });
  assert.deepEqual(out, { x: 0, y: 0, w: 20, h: 100 });
});

test("resizeRect: 西北手柄收缩到最小尺寸时不会跑位", () => {
  // uiik todo.md 记录的历史问题：左上角 x/y 无法控制最小范围
  const out = resizeRect({ x: 100, y: 100, w: 100, h: 100 }, "nw", 500, 500, {
    minW: 20,
    minH: 20,
  });
  assert.equal(out.w, 20);
  assert.equal(out.h, 20);
  assert.equal(out.x, 180);
  assert.equal(out.y, 180);
});

test("resizeRect: 最大尺寸约束", () => {
  const out = resizeRect({ x: 0, y: 0, w: 100, h: 100 }, "se", 900, 900, {
    maxW: 150,
    maxH: 120,
  });
  assert.deepEqual(out, { x: 0, y: 0, w: 150, h: 120 });
});

test("resizeRect: 网格吸附，负尺寸同样正确", () => {
  assert.equal(resizeRect({ x: 0, y: 0, w: 100, h: 100 }, "e", 7, 0, { grid: 10 }).w, 110);
  // 负坐标取整不得像 ((v/grid)|0) 那样向零截断
  assert.equal(resizeRect({ x: 0, y: 0, w: 100, h: 100 }, "e", -13, 0, { grid: 10 }).w, 90);
});

test("resizeRect: 等比缩放以 x 为主轴", () => {
  const out = resizeRect({ x: 0, y: 0, w: 100, h: 50 }, "se", 100, 10, {
    keepAspect: true,
  });
  assert.equal(out.w, 200);
  assert.equal(out.h, 100);
});

test("resizeRect: 等比缩放以 y 为主轴", () => {
  const out = resizeRect({ x: 0, y: 0, w: 100, h: 50 }, "se", 10, 100, {
    keepAspect: true,
  });
  assert.equal(out.h, 150);
  assert.equal(out.w, 300);
});

test("resizeRect: 等比缩放时西北角保持东南不动", () => {
  const start = { x: 0, y: 0, w: 100, h: 100 };
  const out = resizeRect(start, "nw", 50, 0, { keepAspect: true });
  near(getRectRight(out), getRectRight(start));
  near(getRectBottom(out), getRectBottom(start));
  assert.equal(out.w, 50);
  assert.equal(out.h, 50);
});

test("resizeRect: 单轴方向忽略 keepAspect", () => {
  const out = resizeRect({ x: 0, y: 0, w: 100, h: 50 }, "e", 50, 50, {
    keepAspect: true,
  });
  assert.deepEqual(out, { x: 0, y: 0, w: 150, h: 50 });
});

test("resizeRect: 纯函数，不修改入参", () => {
  const start = { x: 1, y: 2, w: 3, h: 4 };
  resizeRect(start, "nw", 10, 10, { minW: 1, minH: 1 });
  assert.deepEqual(start, { x: 1, y: 2, w: 3, h: 4 });
});

// ---------------------------------------------------------------- camera

test("fitRectInViewport: 内容缩放并居中", () => {
  const view = fitRectInViewport({ x: 0, y: 0, w: 200, h: 100 }, { w: 400, h: 400 });
  // 视口 400×400，内容 200×100 → 可放大到 2 倍，但 maxScale 缺省为 1
  assert.equal(view.scale, 1);
  // scale=1 时内容宽度 200 居中于 400
  assert.equal(view.x, 100);
});

test("fitRectInViewport: 放不下时缩小到刚好放下", () => {
  const view = fitRectInViewport({ x: 0, y: 0, w: 1000, h: 500 }, { w: 400, h: 400 });
  near(view.scale, 0.4);
  near(view.x, (400 - 400) / 2);
});

test("fitRectInViewport: padding 生效", () => {
  const view = fitRectInViewport(
    { x: 0, y: 0, w: 1000, h: 1000 },
    { w: 400, h: 400 },
    { padding: 40 }
  );
  near(view.scale, 0.32);
});

test("fitRectInViewport: 世界坐标偏移被正确补偿", () => {
  const view = fitRectInViewport({ x: 1000, y: 2000, w: 200, h: 100 }, { w: 400, h: 400 });
  // 内容左边界在屏幕上的位置
  const screenX = view.x + 1000 * view.scale;
  near(screenX, 100);
  const screenY = view.y + 2000 * view.scale;
  near(screenY, 150);
});

test("zoomAt: 锚点下的世界坐标保持不动", () => {
  const view = { x: 20, y: -10, scale: 1.5 };
  const pivot = { x: 300, y: 200 };
  const worldBefore = {
    x: (pivot.x - view.x) / view.scale,
    y: (pivot.y - view.y) / view.scale,
  };
  const next = zoomAt(view, pivot, 2);
  assert.equal(next.scale, 3);
  near((pivot.x - next.x) / next.scale, worldBefore.x);
  near((pivot.y - next.y) / next.scale, worldBefore.y);
});

test("zoomAt: 缩放上下限", () => {
  let view = { x: 0, y: 0, scale: 1 };
  view = zoomAt(view, { x: 0, y: 0 }, 100, { max: 4 });
  assert.equal(view.scale, 4);
  view = zoomAt(view, { x: 0, y: 0 }, 0.001, { min: 0.5 });
  assert.equal(view.scale, 0.5);
});

test("panBy", () => {
  assert.deepEqual(panBy({ x: 1, y: 2, scale: 3 }, 10, -5), {
    x: 11,
    y: -3,
    scale: 3,
  });
});

// ---------------------------------------------------------------- snap

test("findSnap: 无目标时无位移", () => {
  const r = findSnap({ x: 0, y: 0, w: 10, h: 10 }, []);
  assert.equal(r.dx, 0);
  assert.equal(r.dy, 0);
});

test("findSnap: 超出容差不吸附", () => {
  const r = findSnap({ x: 0, y: 0, w: 10, h: 10 }, [{ x: 100, y: 100, w: 10, h: 10 }], {
    tolerance: 5,
  });
  assert.equal(r.dx, 0);
  assert.equal(r.hitX, undefined);
});

test("findSnap: 左边对左边", () => {
  const r = findSnap({ x: 96, y: 300, w: 20, h: 20 }, [{ x: 100, y: 0, w: 50, h: 50 }], {
    tolerance: 6,
  });
  assert.equal(r.dx, 4);
  assert.equal(r.hitX?.point, "start");
  assert.equal(r.hitX?.targetIndex, 0);
  // y 方向相距甚远，不应命中
  assert.equal(r.dy, 0);
});

test("findSnap: 中心对中心", () => {
  const r = findSnap({ x: 244, y: 244, w: 20, h: 20 }, [{ x: 200, y: 200, w: 100, h: 100 }], {
    tolerance: 5,
  });
  // 候选中心 254，目标中心 250
  assert.equal(r.hitX?.point, "center");
  assert.equal(r.hitX?.targetPoint, "center");
  assert.equal(r.dx, -4);
  assert.equal(r.hitY?.point, "center");
  assert.equal(r.dy, -4);
});

test("findSnap: 右边对左边（交叉配对）", () => {
  const r = findSnap({ x: 0, y: 500, w: 100, h: 10 }, [{ x: 100, y: 0, w: 50, h: 50 }], {
    tolerance: 2,
  });
  assert.equal(r.hitX?.point, "end");
  assert.equal(r.hitX?.targetPoint, "start");
  assert.equal(r.dx, 0);
});

test("findSnap: 限制锚点集合后只按中线吸附", () => {
  // 候选左边与目标左边相差 1，但只允许 center 锚点，故不命中
  const r = findSnap({ x: 99, y: 900, w: 20, h: 20 }, [{ x: 100, y: 0, w: 100, h: 100 }], {
    tolerance: 6,
    points: ["center"],
  });
  assert.equal(r.hitX, undefined);
  assert.equal(r.dx, 0);
});

test("findSnap: nearest 取位移最小者", () => {
  const r = findSnap(
    { x: 100, y: 500, w: 10, h: 10 },
    [
      { x: 103, y: 0, w: 10, h: 10 },
      { x: 98, y: 0, w: 10, h: 10 },
    ],
    { tolerance: 6, points: ["start"] }
  );
  assert.equal(r.dx, -2);
  assert.equal(r.hitX?.targetIndex, 1);
});

test("findSnap: first 取 targets 顺序首个命中", () => {
  const r = findSnap(
    { x: 100, y: 500, w: 10, h: 10 },
    [
      { x: 103, y: 0, w: 10, h: 10 },
      { x: 98, y: 0, w: 10, h: 10 },
    ],
    { tolerance: 6, points: ["start"], strategy: "first" }
  );
  assert.equal(r.dx, 3);
  assert.equal(r.hitX?.targetIndex, 0);
});

test("findSnap: exclude 排除自身", () => {
  const candidate: Rect = { x: 0, y: 0, w: 10, h: 10 };
  const r = findSnap(candidate, [candidate, { x: 3, y: 0, w: 10, h: 10 }], {
    tolerance: 6,
    points: ["start"],
    exclude: [0],
  });
  assert.equal(r.dx, 3);
  assert.equal(r.hitX?.targetIndex, 1);
});

test("findSnap: 分轴容差", () => {
  const r = findSnap({ x: 98, y: 98, w: 10, h: 10 }, [{ x: 100, y: 100, w: 10, h: 10 }], {
    tolerance: 6,
    toleranceY: 1,
  });
  assert.equal(r.dx, 2);
  assert.equal(r.dy, 0);
});

test("findSnap: onHit 返回 false 放弃该候选", () => {
  const r = findSnap({ x: 96, y: 500, w: 10, h: 10 }, [{ x: 100, y: 0, w: 10, h: 10 }], {
    tolerance: 6,
    points: ["start"],
    onHit: () => false,
  });
  assert.equal(r.dx, 0);
});

test("findSnap: 纯函数，不修改入参", () => {
  const candidate: Rect = { x: 96, y: 0, w: 10, h: 10 };
  const targets: Rect[] = [{ x: 100, y: 50, w: 10, h: 10 }];
  findSnap(candidate, targets, { tolerance: 6 });
  assert.deepEqual(candidate, { x: 96, y: 0, w: 10, h: 10 });
  assert.deepEqual(targets, [{ x: 100, y: 50, w: 10, h: 10 }]);
});

test("snapGuides: 未命中时无参考线", () => {
  assert.deepEqual(
    snapGuides({ x: 0, y: 0, w: 10, h: 10 }, [], { dx: 0, dy: 0 }),
    []
  );
});

test("snapGuides: 单轴命中生成一条线", () => {
  const candidate: Rect = { x: 96, y: 200, w: 20, h: 20 };
  const targets: Rect[] = [{ x: 100, y: 0, w: 50, h: 50 }];
  const result = findSnap(candidate, targets, { tolerance: 6 });
  const guides = snapGuides(candidate, targets, result, 40);
  assert.equal(guides.length, 1);
  assert.equal(guides[0].dir, "v");
  assert.equal(guides[0].coord, 100);
  // 跨度含命中目标：y 0~220，两端外扩 40
  near(guides[0].from, -40);
  near(guides[0].to, 260);
});

test("snapGuides: 双轴命中生成两条线", () => {
  const candidate: Rect = { x: 96, y: 96, w: 20, h: 20 };
  const targets: Rect[] = [{ x: 100, y: 100, w: 50, h: 50 }];
  const result = findSnap(candidate, targets, { tolerance: 6 });
  const guides = snapGuides(candidate, targets, result, 0);
  assert.equal(guides.length, 2);
  assert.deepEqual(
    guides.map((g) => g.dir).sort(),
    ["h", "v"]
  );
  // 跨度含命中目标：96~150
  for (const g of guides) {
    assert.equal(g.from, 96);
    assert.equal(g.to, 150);
  }
});

test("snapGuides: 未命中目标时跨度仅取拖动前后位置", () => {
  const candidate: Rect = { x: 96, y: 96, w: 20, h: 20 };
  const result: SnapResult = {
    dx: 4,
    dy: 4,
    hitX: { axis: "x", point: "start", targetPoint: "start", targetIndex: 0, coord: 100, delta: 4 },
    hitY: { axis: "y", point: "start", targetPoint: "start", targetIndex: 0, coord: 100, delta: 4 },
  };
  const guides = snapGuides(candidate, [], result, 0);
  for (const g of guides) {
    assert.equal(g.from, 96);
    assert.equal(g.to, 120);
  }
});