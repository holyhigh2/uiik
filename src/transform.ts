/* eslint-disable max-len */
/**
 * Transform APIs
 * 用于屏蔽svg/html元素的transform差异，如rotate函数兼容问题
 * @author holyhigh2
 */

import { isDefined } from "myfx/is";
import { get } from "myfx/object";

const UtMap = new WeakMap();

export class UiiTransformer {
  x: number;
  y: number;
  angle: number = 0;
  el: HTMLElement | SVGGraphicsElement;
  constructor(el: HTMLElement | SVGGraphicsElement) {
    this.el = el;

    this.normalize(el);

    UtMap.set(el, this);
  }

  normalize(el?: HTMLElement | SVGGraphicsElement) {
    let { x, y } = normalize(el||this.el);
    this.x = x;
    this.y = y;
    return this;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    moveTo(this.el, this.x, this.y);
  }
  moveToX(x: number) {
    this.x = x;
    moveTo(this.el, this.x, this.y);
  }
  moveToY(y: number) {
    this.y = y;
    moveTo(this.el, this.x, this.y);
  }
  rotateTo(deg: number, cx?: number, cy?: number) {
    this.angle = deg;
    rotateTo(this.el, deg, cx, cy);
  }
}

/**
 * 统一化处理，所有外边距都处理为translate
 * @param el
 */
function normalize(el: HTMLElement | SVGGraphicsElement) {
  const style: any = window.getComputedStyle(el);
  let x = 0,
    y = 0;
  //1. convert left/top (include margins)
  if (el instanceof HTMLElement) {
    x = (parseFloat(style.left) || 0) + (parseFloat(style.marginLeft) || 0);
    y = (parseFloat(style.top) || 0) + (parseFloat(style.marginTop) || 0);
    el.style.setProperty("left", "0", "important");
    el.style.setProperty("top", "0", "important");
    el.style.setProperty("margin", "0", "important");
  } else {
    x =
      parseFloat(get(el, "x.baseVal.value") || get(el, "cx.baseVal.value")) ||
      0;
    y =
      parseFloat(get(el, "y.baseVal.value") || get(el, "cy.baseVal.value")) ||
      0;
    el.removeAttribute("x");
    el.removeAttribute("y");
    el.removeAttribute("cx");
    el.removeAttribute("cy");
  }

  //2. merge transform
  const { x: tx, y: ty } = getTranslate(el);
  x += tx || 0;
  y += ty || 0;

  moveTo(el, x, y);
  return { x, y };
}

/**
 * 返回一个包装后的变形对象，可执行变形操作
 * @param el
 */
export function wrapper(el: HTMLElement | SVGGraphicsElement): UiiTransformer {
  let ut = UtMap.get(el);
  if (ut) return ut.normalize(el);
  return new UiiTransformer(el);
}

function transformMove(
  transofrmStr: string,
  x: number,
  y: number,
  unit = false
) {
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
    el.setAttribute(
      "transform",
      transformMove(el.getAttribute("transform") || "", x, y)
    );
  } else {
    let style = (el as HTMLElement).style;
    style.transform = transformMove(style.transform || "", x, y, true);
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
