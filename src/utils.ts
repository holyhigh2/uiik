/* eslint-disable max-len */
/**
 * 工具包
 * @author holyhigh2
 */

import { find, map } from "myfx/collection";
import { isNumber, isString } from "myfx/is";
import { rotateTo } from "./transform";

/**
 * 一角度对应的弧度
 */
export const ONE_ANG = Math.PI / 180;
/**
 * 一弧度对应的角度
 */
export const ONE_RAD = 180 / Math.PI;

export const THRESHOLD = 3;

/**
 * 获取child相对于parent的位置信息。含border宽度
 *
 * @returns {x,y,w,h}
 */
export function getBox(
  child: Element,
  parent?: Element
): { x: number; y: number; w: number; h: number } {
  const rect = child.getBoundingClientRect();
  const rs = { x: 0, y: 0, w: rect.width, h: rect.height };
  parent =
    parent ||
    (child as HTMLElement).offsetParent ||
    (child as SVGElement).ownerSVGElement ||
    child.parentElement ||
    document.body;
  const parentRect = parent.getBoundingClientRect(); //bcr包含padding，不包含borderWidth
  const parentStyle = window.getComputedStyle(parent);
  const parentBorderLeft = parseFloat(parentStyle.borderLeftWidth);
  const parentBorderTop = parseFloat(parentStyle.borderTopWidth);

  rs.x = rect.x - parentRect.x + parent.scrollLeft;
  rs.y = rect.y - parentRect.y + parent.scrollTop;

  if (child instanceof SVGElement) {
  } else {
    rs.x -= parentBorderLeft;
    rs.y -= parentBorderTop;
  }

  return rs;
}

/**
 * 获取事件目标与点击点之间的偏移
 * @param e
 * @returns [offx,offy]
 */
export function getPointOffset(e: MouseEvent, pos: { x: number; y: number }) {
  let ox = e.offsetX || 0,
    oy = e.offsetY || 0;
  if (e.target instanceof SVGElement) {
    ox -= pos.x;
    oy -= pos.y;
  }
  return [ox, oy];
}

export function isSVGEl(el: Element): el is SVGElement {
  return el instanceof SVGElement;
}

/**
 * 边缘检测最小内部边距
 */
export const EDGE_THRESHOLD = 5;

export const DRAGGING_RULE = "body * { pointer-events: none; }";

let lockSheet: CSSStyleSheet | undefined;
export function lockPage() {
  lockSheet = getFirstSS();
  lockSheet?.insertRule(DRAGGING_RULE, 0);
}
export function unlockPage() {
  lockSheet?.deleteRule(0);
}

function getFirstSS() {
  if (document.styleSheets.length < 1) {
    document.head.appendChild(document.createElement("style"));
  }
  const sheet = find(document.styleSheets, (ss) => !ss.href);
  if (!sheet) {
    document.head.appendChild(document.createElement("style"));
  }

  return sheet || find(document.styleSheets, (ss) => !ss.href);
}

let cursor = { html: "", body: "" };
export function saveCursor() {
  cursor.body = document.body.style.cursor;
  cursor.html = document.documentElement.style.cursor;
}

export function setCursor(cursor: string) {
  document.body.style.cursor = document.documentElement.style.cursor = cursor;
}

export function restoreCursor() {
  document.body.style.cursor = cursor.body;
  document.documentElement.style.cursor = cursor.html;
}

/**
 * 获取元素样式/属性中的x/y
 * @param el
 */
export function getStyleXy(el: HTMLElement | SVGGraphicsElement): {
  x: number;
  y: number;
} {
  const style: any = window.getComputedStyle(el);
  let x = 0,
    y = 0;
  if (el instanceof SVGGraphicsElement) {
    x = parseFloat(style.x || style.cx) || 0;
    y = parseFloat(style.y || style.cy) || 0;
  } else {
    x = parseFloat(style.left) || 0;
    y = parseFloat(style.top) || 0;
  }
  return { x, y };
}

/**
 * 获取元素样式/属性中的w/h
 * @param el
 */
export function getStyleSize(
  el: HTMLElement | SVGGraphicsElement,
  cStyle?: CSSStyleDeclaration
): { w: number; h: number } {
  if ("getBBox" in el) {
    //SVG
    let { width, height } = el.getBBox();
    return { w: width, h: height };
  }

  if (!cStyle) cStyle = window.getComputedStyle(el);
  const w = parseFloat(cStyle.width);
  const h = parseFloat(cStyle.height);

  return { w, h };
}

const EXP_MATRIX =
  /matrix\((?<a>[\d.-]+)\s*,\s*(?<b>[\d.-]+)\s*,\s*(?<c>[\d.-]+)\s*,\s*(?<d>[\d.-]+)\s*,\s*(?<e>[\d.-]+)\s*,\s*(?<f>[\d.-]+)\s*\)/;

/**
 * 获取matrix中的scale/angle
 * @param elCStyle
 * @param recur 递归计算matrix
 * @returns
 */
export function getMatrixInfo(
  el: HTMLElement | SVGGraphicsElement,
  recur: boolean = false
) {
  const rs = { scale: 1, angle: 0, x: 0, y: 0 };
  let a = 1,
    b = 0,
    c = 0,
    d = 1,
    x = 0,
    y = 0;

  let elCStyle: CSSStyleDeclaration = window.getComputedStyle(el);
  let matrix = new DOMMatrix(elCStyle.transform);

  if (recur) {
    let p = el.parentElement;
    while (p && p.tagName !== "BODY" && p.tagName.toLowerCase() !== "svg") {
      let pCStyle: CSSStyleDeclaration = window.getComputedStyle(p);
      const pMatrix = new DOMMatrix(pCStyle.transform);
      matrix = matrix.multiply(pMatrix);
      p = p.parentElement;
    }
  }

  if (matrix) {
    a = matrix.a;
    b = matrix.b;
    c = matrix.c;
    d = matrix.d;
    rs.x = matrix.e;
    rs.y = matrix.f;
  }

  rs.scale = Math.sqrt(a * a + b * b);
  rs.angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

  return rs;
}

/**
 * 获取当前鼠标相对于指定元素el的坐标
 * @param event 点击事件
 * @param el 元素
 * @param elRect 元素的DOMRect
 * @param elCStyle 元素的计算样式
 * @returns
 */
export function getPointInContainer(
  event: MouseEvent | PointerEvent,
  el: HTMLElement | SVGGraphicsElement,
  elRect?: DOMRect,
  elCStyle?: CSSStyleDeclaration,
  matrixInfo?: { scale: number; angle: number }
) {
  if (!elRect) {
    elRect = el.getBoundingClientRect();
  }
  let rx = elRect.x,
    ry = elRect.y;

  if (!elCStyle) {
    elCStyle = window.getComputedStyle(el);
  }
  if (!matrixInfo) {
    matrixInfo = getMatrixInfo(el, true);
  }

  const scale = matrixInfo.scale;

  let x =
    event.clientX -
    rx -
    (parseFloat(elCStyle.borderLeftWidth) || 0) * scale +
    el.scrollLeft * scale;
  let y =
    event.clientY -
    ry -
    (parseFloat(elCStyle.borderTopWidth) || 0) * scale +
    el.scrollTop * scale;

  return { x: x / scale, y: y / scale, scale };
}

/**
 * 获取元素el在容器container中的相对boundingBox
 * @param el
 * @param container
 */
export function getRectInContainer(
  el: HTMLElement | SVGGraphicsElement,
  container: HTMLElement | SVGGraphicsElement,
  matrixInfo?: { scale: number; angle: number }
): { x: number; y: number; w: number; h: number } {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const elCStyle = window.getComputedStyle(container);
  matrixInfo = matrixInfo || getMatrixInfo(container, true);
  const scale = matrixInfo.scale;

  let x =
    elRect.x -
    containerRect.x -
    (parseFloat(elCStyle.borderLeftWidth) || 0) * scale +
    container.scrollLeft * scale;
  let y =
    elRect.y -
    containerRect.y -
    (parseFloat(elCStyle.borderTopWidth) || 0) * scale +
    container.scrollTop * scale;

  return {
    x: x / scale,
    y: y / scale,
    w: elRect.width / scale,
    h: elRect.height / scale,
  };
}

/**
 * 获取指定元素（DOM/SVG）相对于父元素的中心点
 * @param el 
 * @returns 
 */
export function getRectCenter(el: HTMLElement | SVGGraphicsElement, matrixInfo?: { scale: number; angle: number }): { x: number, y: number } {
  const panelRect = getRectInContainer(
    el,
    el.parentElement!,
    matrixInfo
  );
  let x = Math.round(panelRect.x + panelRect.w / 2);
  let y = Math.round(panelRect.y + panelRect.h / 2);

  return { x, y }
}

/**
 * 获取指定元素的圆心坐标
 * @param el
 * @param left
 * @param top
 * @returns
 */
export function getCenterXy(el: HTMLElement, ox?: number, oy?: number) {
  const cStyle = window.getComputedStyle(el);

  //origin
  const center = cStyle.transformOrigin;
  const centerPair = center.split(" ");
  ox = ox || parseFloat(centerPair[0]);
  oy = oy || parseFloat(centerPair[1]);

  //left & top
  const shadowDom = el.cloneNode() as HTMLElement;
  rotateTo(shadowDom as any, 0);

  const parentEl = el.parentElement;
  let startX = 0,
    startY = 0;
  if (parentEl) {
    parentEl.appendChild(shadowDom);
    const offsetXY = getRectInContainer(shadowDom, parentEl);
    (startX = offsetXY.x), (startY = offsetXY.y);
    parentEl.removeChild(shadowDom);
  }

  return { sx: startX, sy: startY, x: startX + ox, y: startY + oy, ox, oy };
}
export function getCenterXySVG(el: SVGGraphicsElement, ox: number, oy: number) {
  let elRect = el.getBoundingClientRect();
  let svgRect = el.ownerSVGElement!.getBoundingClientRect();
  let x = elRect.x - svgRect.x;
  let y = elRect.y - svgRect.y;

  //left & top
  const shadowDom = el.cloneNode() as SVGGraphicsElement;
  rotateTo(shadowDom as any, 0);

  const parentEl = el.parentElement;
  let startX = 0,
    startY = 0;
  if (parentEl) {
    //这里的偏移需要处理
    parentEl.appendChild(shadowDom);
    const offsetXY = getRectInContainer(shadowDom, parentEl);
    (startX = offsetXY.x), (startY = offsetXY.y);
    parentEl.removeChild(shadowDom);
  }

  return { sx: x, sy: y, x: x + ox, y: y + oy, ox, oy };
}

/**
 * 获取元素当前顶点
 * @param el
 * @param ox 相对于图形左上角的圆心偏移，支持数字/百分比，仅对SVG元素有效，对于非SVG元素使用transform-origin属性
 * @param oy
 */
export function getVertex(
  el: HTMLElement | SVGGraphicsElement,
  ox: number | string,
  oy: number | string
): Array<{ x: number; y: number }> {
  const cStyle = window.getComputedStyle(el);
  const w = parseFloat(cStyle.width);
  const h = parseFloat(cStyle.height);

  const { originX, originY } = parseOxy(ox, oy, w, h);

  const { x, y, sx, sy } =
    el instanceof SVGGraphicsElement
      ? getCenterXySVG(el, originX, originY)
      : getCenterXy(el);
  const { angle } = getMatrixInfo(el);

  return calcVertex(w, h, x, y, sx, sy, angle * ONE_ANG);
}
/**
 * 计算指定矩形旋转后的顶点坐标
 * @param w 宽
 * @param h 高
 * @param cx 圆心
 * @param cy
 * @param sx
 * @param sy
 * @param radian 旋转角 弧度值
 * @returns
 */
export function calcVertex(
  w: number,
  h: number,
  cx: number,
  cy: number,
  sx: number,
  sy: number,
  radian: number
): Array<{ x: number; y: number }> {
  let originVertex = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: 0, y: h },
    { x: w, y: h },
  ];

  return map(originVertex, ({ x, y }) => {
    const nx =
      (x - cx + sx) * Math.cos(radian) - (y - cy + sy) * Math.sin(radian);
    const ny =
      (x - cx + sx) * Math.sin(radian) + (y - cy + sy) * Math.cos(radian);
    return { x: cx + nx, y: cy + ny };
  });
}

/**
 * 解析ox/y
 * @param ox 如果不是number或string，originX为0
 * @param oy 如果不是number或string，originY为0
 * @param w
 * @param h
 * @param el 
 * @returns {originX,originY}
 */
export function parseOxy(
  ox: any,
  oy: any,
  w: number,
  h: number,
  el?: HTMLElement | SVGGraphicsElement
): { originX: number; originY: number } {
  let originX = 0,
    originY = 0;
  let transformOrigin

  if (isString(ox)) {
    //percent
    originX = (parseFloat(ox) / 100) * w;
  } else if (isNumber(ox)) {
    originX = ox;
  } else if (el) {
    //origin
    if (!transformOrigin) transformOrigin = window.getComputedStyle(el).transformOrigin
    const centerPair = transformOrigin.split(" ");
    originX = parseFloat(centerPair[0])
  }
  if (isString(oy)) {
    //percent
    originY = (parseFloat(oy) / 100) * h;
  } else if (isNumber(oy)) {
    originY = oy;
  } else if (el) {
    //origin
    if (!transformOrigin) transformOrigin = window.getComputedStyle(el).transformOrigin
    const centerPair = transformOrigin.split(" ");
    originY = parseFloat(centerPair[1])
  }
  return { originX, originY };
}

export function normalizeVector(x: number, y: number) {
  let len = Math.sqrt(x * x + y * y)
  return { x: x / len, y: y / len }
}

export function isVisible(el: Element) {
  let rect = el.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }
  return true;
}