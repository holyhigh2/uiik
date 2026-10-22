/**
 * routing 单元测试
 *
 * 运行：npm run test:unit（spec/）
 */

import * as assert from "node:assert/strict";
import { test } from "node:test";

import type { Waypoint } from "../src/routing.ts";
import { dragWaypoint, linkPathD, portOutward, portWorldPos, reattachLink, routeInitial } from "../src/routing.ts";

function near(actual: number, expected: number, eps = 1e-9) {
  assert.ok(Math.abs(actual - expected) < eps, `期望 ${expected}，实际 ${actual}`);
}

// ---------------------------------------------------------------- port

test("portWorldPos: 无旋转按比例定位", () => {
  const p = portWorldPos({ x: 0, y: 0, w: 100, h: 100 }, { x: 1, y: 0.5, dir: "right" });
  assert.deepEqual(p, { x: 100, y: 50 });
});

test("portWorldPos: 绕中心旋转", () => {
  const p = portWorldPos({ x: 0, y: 0, w: 100, h: 100, rotate: 90 }, { x: 1, y: 0.5, dir: "right" });
  near(p.x, 50);
  near(p.y, 100);
});

test("portOutward: 无旋转即朝向向量", () => {
  assert.deepEqual(portOutward("up"), { x: 0, y: -1 });
  assert.deepEqual(portOutward("right"), { x: 1, y: 0 });
});

test("portOutward: 随节点旋转", () => {
  const v = portOutward("right", 90);
  near(v.x, 0);
  near(v.y, 1);
});

// ---------------------------------------------------------------- routeInitial

/** 相邻点是否轴对齐且走向交替（正交折线） */
function isOrthogonal(pts: { x: number; y: number }[]): boolean {
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].x !== pts[i - 1].x && pts[i].y !== pts[i - 1].y) return false;
  }
  return true;
}

test("routeInitial: 两端垂直出入口，中间折点带 orient", () => {
  const a = { p: { x: 0, y: 0 }, dir: "down" as const };
  const b = { p: { x: 100, y: 200 }, dir: "up" as const };
  const ws = routeInitial(a, b, 10);
  assert.deepEqual(ws, [
    { x: 0, y: 160, orient: "v" },
    { x: 100, y: 160, orient: "h" },
    { x: 100, y: 180, orient: "v" },
  ]);
});

test("routeInitial: 结果不含两端锚点", () => {
  const a = { p: { x: 0, y: 0 }, dir: "right" as const };
  const b = { p: { x: 100, y: 0 }, dir: "left" as const };
  const ws = routeInitial(a, b, 10);
  for (const w of ws) {
    assert.ok(!(w.x === 0 && w.y === 0));
    assert.ok(!(w.x === 100 && w.y === 0));
  }
});

test("routeInitial: 全程正交", () => {
  const a = { p: { x: 5, y: 7 }, dir: "right" as const };
  const b = { p: { x: 137, y: 221 }, dir: "down" as const };
  const ws = routeInitial(a, b, 10);
  const pts = [a.p, ...ws.map((w) => ({ x: w.x, y: w.y })), b.p];
  assert.ok(isOrthogonal(pts), JSON.stringify(pts));
});

test("routeInitial: 纯函数，不修改入参", () => {
  const a = { p: { x: 0, y: 0 }, dir: "down" as const };
  const b = { p: { x: 50, y: 50 }, dir: "up" as const };
  routeInitial(a, b, 10);
  assert.deepEqual(a.p, { x: 0, y: 0 });
  assert.deepEqual(b.p, { x: 50, y: 50 });
});

// ---------------------------------------------------------------- linkPathD

test("linkPathD: 无折点画直线", () => {
  assert.equal(linkPathD({ x: 0, y: 0 }, { x: 10, y: 0 }, []), "M0 0 L10 0");
});

test("linkPathD: 折点连成折线", () => {
  const ws: Waypoint[] = [
    { x: 10, y: 0, orient: "h" },
    { x: 10, y: 10, orient: "v" },
  ];
  assert.equal(linkPathD({ x: 0, y: 0 }, { x: 20, y: 10 }, ws), "M0 0 L10 0 L10 10 L20 10");
});

test("linkPathD: corner>0 时折点变圆角", () => {
  const ws: Waypoint[] = [
    { x: 10, y: 0, orient: "h" },
    { x: 10, y: 10, orient: "v" },
  ];
  const d = linkPathD({ x: 0, y: 0 }, { x: 20, y: 10 }, ws, 5);
  assert.ok(d.startsWith("M0 0"));
  assert.ok(d.includes("Q10 0"), d);
  assert.ok(d.endsWith("L20 10"), d);
});

test("linkPathD: 圆角半径不超过半段长", () => {
  // 折点距端点仅 2，corner=5 应被限制到 1
  const ws: Waypoint[] = [{ x: 2, y: 0, orient: "h" }];
  const d = linkPathD({ x: 0, y: 0 }, { x: 2, y: 2 }, ws, 5);
  assert.ok(d.includes("Q2 0"), d);
});

// ---------------------------------------------------------------- reattachLink

test("reattachLink: 锚点对齐时肘弯保持", () => {
  const ws: Waypoint[] = [
    { x: 0, y: 50, orient: "v" },
    { x: 50, y: 50, orient: "h" },
  ];
  const out = reattachLink(ws, { x: 0, y: 0 }, { x: 50, y: 100 });
  assert.deepEqual(out, [
    { x: 0, y: 50, orient: "v" },
    { x: 50, y: 50, orient: "h" },
  ]);
});

test("reattachLink: 端点横移后首折点仍正交", () => {
  const ws: Waypoint[] = [
    { x: 0, y: 50, orient: "v" },
    { x: 50, y: 50, orient: "h" },
  ];
  const out = reattachLink(ws, { x: 10, y: 0 }, { x: 50, y: 100 });
  // 起点与首折点不再同列 → 改为横向进入，首折点对齐次折点的 x
  assert.deepEqual(out[0], { x: 50, y: 0, orient: "v" });
});

test("reattachLink: 单折点按 orient 决定肘弯", () => {
  const out = reattachLink([{ x: 0, y: 0, orient: "v" }], { x: 5, y: 7 }, { x: 9, y: 11 });
  assert.deepEqual(out, [{ x: 5, y: 11, orient: "v" }]);
});

test("reattachLink: 纯函数，返回新数组且不修改入参", () => {
  const ws: Waypoint[] = [
    { x: 0, y: 50, orient: "v" },
    { x: 50, y: 50, orient: "h" },
  ];
  const out = reattachLink(ws, { x: 10, y: 0 }, { x: 50, y: 100 });
  assert.deepEqual(ws, [
    { x: 0, y: 50, orient: "v" },
    { x: 50, y: 50, orient: "h" },
  ]);
  assert.notEqual(out[0], ws[0]);
});

// ---------------------------------------------------------------- dragWaypoint

test("dragWaypoint: 按 orient 约束并向后级联", () => {
  const ws: Waypoint[] = [
    { x: 0, y: 50, orient: "v" },
    { x: 50, y: 50, orient: "h" },
    { x: 50, y: 100, orient: "v" },
  ];
  const out = dragWaypoint(ws, 1, 80, 999, { x: 0, y: 0 }, 10);
  assert.deepEqual(out, [
    { x: 0, y: 50, orient: "v" },
    { x: 80, y: 50, orient: "h" },
    { x: 80, y: 100, orient: "v" },
  ]);
});

test("dragWaypoint: 垂直折点只改 y 并对齐前点 x", () => {
  const ws: Waypoint[] = [
    { x: 0, y: 50, orient: "v" },
    { x: 0, y: 50, orient: "v" },
  ];
  const out = dragWaypoint(ws, 0, 999, 73, { x: 0, y: 0 }, 10);
  assert.deepEqual(out[0], { x: 0, y: 70, orient: "v" });
});

test("dragWaypoint: 纯函数，不修改入参", () => {
  const ws: Waypoint[] = [{ x: 0, y: 50, orient: "h" }];
  dragWaypoint(ws, 0, 80, 999, { x: 0, y: 0 }, 10);
  assert.deepEqual(ws, [{ x: 0, y: 50, orient: "h" }]);
});
