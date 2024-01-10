/* eslint-disable max-len */
/**
 * Transform APIs
 * 用于屏蔽svg/html元素的transform差异，如rotate函数兼容问题
 * @author holyhigh2
 */

import { isDefined, isNaN, isNumber } from "myfx/is";
import { get } from "myfx/object";

const UtMap = new WeakMap();

export class UiiTransform {
  x: number;
  y: number;
  offx: number;
  offy: number;
  angle: number = 0;
  el: HTMLElement | SVGGraphicsElement;
  useTransform: boolean;
  constructor(
    el: HTMLElement | SVGGraphicsElement,
    useTransform: boolean = true
  ) {
    this.el = el;

    this.useTransform = useTransform;

    this.normalize(el);

    UtMap.set(el, this);
  }

  normalize(el?: HTMLElement | SVGGraphicsElement) {
    let { offx, offy } = normalize(el || this.el, this.useTransform);
    // this.x = offx
    // this.y = offy
    this.offx = offx * -1;
    this.offy = offy * -1;
    return this;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;

    (this.useTransform ? transformMoveTo : moveTo)(
      this.el,
      this.x + this.offx,
      this.y + this.offy
    );
  }
  moveToX(x: number) {
    this.x = x;
    (this.useTransform ? transformMoveTo : moveTo)(
      this.el,
      this.x + this.offx,
      NaN
    );
  }
  moveToY(y: number) {
    this.y = y;
    (this.useTransform ? transformMoveTo : moveTo)(
      this.el,
      NaN,
      this.y + this.offy
    );
  }
  rotateTo(deg: number, cx?: number, cy?: number) {
    this.angle = deg;
    rotateTo(this.el, deg, cx, cy);
  }
}

/**
 * 统一化处理，记录offset
 * @param el
 */
function normalize(
  el: HTMLElement | SVGGraphicsElement,
  useTransform: boolean
) {
  const style: any = window.getComputedStyle(el);

  let offx = 0,
    offy = 0;
  let x = 0,
    y = 0;
  let mx = 0,
    my = 0;

  //1. get left/top (include margins)
  if (el instanceof HTMLElement) {
    x = parseFloat(style.left) || 0;
    y = parseFloat(style.top) || 0;
    mx = parseFloat(style.marginLeft) || 0;
    my = parseFloat(style.marginTop) || 0;
  } else {
    x =
      parseFloat(get(el, "x.baseVal.value") || get(el, "cx.baseVal.value")) ||
      0;
    y =
      parseFloat(get(el, "y.baseVal.value") || get(el, "cy.baseVal.value")) ||
      0;
  }

  //2. get translate
  if (useTransform) {
    (offx = x), (offy = y);
  } else {
    (offx = 0), (offy = 0);
  }

  // moveTo(el, x, y);
  return { offx: offx + mx, offy: offy + my };
}

/**
 * 返回一个包装后的变形对象，可执行变形操作
 * @param el
 */
export function wrapper(
  el: HTMLElement | SVGGraphicsElement,
  useTransform: boolean = true
): UiiTransform {
  let ut = UtMap.get(el);
  if (ut) return ut.normalize(el);
  return new UiiTransform(el, useTransform);
}

function transformMove(
  transofrmStr: string,
  x: number,
  y: number,
  unit = false
) {
  if (!isNumber(x) || isNaN(x)) {
    return (
      `translateY(${y}${unit ? "px" : ""}) ` +
      transofrmStr.replace(/translateY\([^)]+?\)/, "").trim()
    );
  }
  if (!isNumber(y) || isNaN(x)) {
    return (
      `translateX(${x}${unit ? "px" : ""}) ` +
      transofrmStr.replace(/translateX\([^)]+?\)/, "").trim()
    );
  }
  return (
    `translate(${x}${unit ? "px" : ""},${y}${unit ? "px" : ""}) ` +
    transofrmStr.replace(/translate\([^)]+?\)/, "").trim()
  );
}

/**
 * 获取元素当前transform中的位移数据
 * @param el HTMLElement|SVGGraphicsElement
 * @returns {x,y}
 */
export function getTranslate(el: HTMLElement | SVGGraphicsElement) {
  let xVal = NaN,
    yVal = NaN;

  let transformStr = "";
  //svg
  if (el instanceof SVGGraphicsElement) {
    transformStr = el.getAttribute("transform") || "";
    if (!transformStr) {
      xVal =
        parseFloat(get(el, "x.baseVal.value") || get(el, "cx.baseVal.value")) ||
        0;
      yVal =
        parseFloat(get(el, "y.baseVal.value") || get(el, "cy.baseVal.value")) ||
        0;
    }
  } else {
    let style = (el as HTMLElement).style;
    transformStr = style.transform || "";
  }

  EXP_GET_TRANSLATE.lastIndex = 0;
  const xy = EXP_GET_TRANSLATE.exec(transformStr);
  if (xy && xy.groups) {
    xVal = parseFloat(xy.groups.x);
    yVal = parseFloat(xy.groups.y);
  } else {
    EXP_GET_TRANSLATE_XY.lastIndex = 0;
    const xy = EXP_GET_TRANSLATE_XY.exec(transformStr);
    if (xy && xy.groups) {
      if (xy.groups.dir == "X") {
        xVal = parseFloat(xy.groups.v);
      } else {
        yVal = parseFloat(xy.groups.v);
      }
    }
  }

  return { x: xVal, y: yVal };
}

/**
 * 自动检测HTML元素或SVG元素并设置对应移动属性
 * @param el HTMLElement|SVGGraphicsElement
 * @param x value of px
 * @param y value of px
 */
export function moveTo(
  el: HTMLElement | SVGGraphicsElement,
  x: number,
  y: number
) {
  //svg
  if (el instanceof SVGGraphicsElement) {
    if (x) el.setAttribute("x", x + "");
    if (y) el.setAttribute("y", y + "");
  } else {
    let style = (el as HTMLElement).style;
    if (x) style.left = x + "px";
    if (y) style.top = y + "px";
  }
}

export function transformMoveTo(
  el: HTMLElement | SVGGraphicsElement,
  x: number,
  y: number
) {
  //svg
  if (el instanceof SVGGraphicsElement) {
    el.setAttribute(
      "transform",
      transformMove(el.getAttribute("transform") || "", x || 0, y || 0)
    );
  } else {
    let style = (el as HTMLElement).style;
    style.transform = transformMove(
      style.transform || "",
      x || 0,
      y || 0,
      true
    );
  }
}

const EXP_GET_TRANSLATE =
  /translate\(\s*(?<x>[\d.-]+)\D*,\s*(?<y>[\d.-]+)\D*\)/gim;
const EXP_GET_TRANSLATE_XY = /translate(?<dir>X|Y)\(\s*(?<v>[\d.-]+)\D*\)/gim;

/**
 * 自动检测HTML元素或SVG元素并设置对应移动属性
 * @param el HTMLElement|SVGGraphicsElement
 * @param x value of px
 * @param y value of px
 */
export function moveBy(
  el: HTMLElement | SVGGraphicsElement,
  x: number,
  y: number
) {
  const xy = getTranslate(el);
  //svg
  if (el instanceof SVGGraphicsElement) {
    el.setAttribute(
      "transform",
      transformMove(el.getAttribute("transform") || "", xy.x + x, xy.y + y)
    );
  } else {
    let style = (el as HTMLElement).style;
    style.transform = transformMove(
      style.transform || "",
      xy.x + x,
      xy.y + y,
      true
    );
  }
}

export function rotateTo(
  el: HTMLElement | SVGGraphicsElement,
  deg: number,
  cx?: number,
  cy?: number
) {
  //svg
  if (el instanceof SVGGraphicsElement) {
    let transformStr = el.getAttribute("transform") || "";
    let originPos = isDefined(cx) && isDefined(cy);
    let origin = "";

    if (originPos) {
      //origin offset
      if ((el as any).x instanceof SVGAnimatedLength) {
        cx += (el as any).x.animVal.value;
        cy += (el as any).y.animVal.value;
      } else if ((el as any).cx instanceof SVGAnimatedLength) {
        cx += (el as any).cx.animVal.value;
        cy += (el as any).cy.animVal.value;
      }
      origin = `,${cx},${cy}`;
    }

    transformStr =
      transformStr.replace(/rotate\([^)]+?\)/, "") + ` rotate(${deg}${origin})`;
    el.setAttribute("transform", transformStr);
  } else {
    let style = (el as HTMLElement).style;
    style.transform =
      style.transform
        .replace(/rotate\([^)]+?\)/, "")
        .replace(/rotateZ\([^)]+?\)/, "") +
      " rotateZ(" +
      deg +
      "deg)";
  }
}
