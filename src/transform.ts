/* eslint-disable max-len */
/**
 * Transform APIs
 * 用于屏蔽svg/html元素的transform差异，如rotate函数兼容问题
 * @author holyhigh2
 */

import { isDefined } from "myfx/is";
import { getStyleXy } from "./utils";

const EXP_MATRIX = /matrix\((?<a>[\d-.]+)\s*,\s*(?<b>[\d-.]+)\s*,\s*(?<c>[\d-.]+)\s*,\s*(?<d>[\d-.]+)\s*,\s*(?<x>[\d-.]+)\s*,\s*(?<y>[\d-.]+)\)/gim;

export class UiiTransformer{
  x:number
  y:number
  angle:number = 0
  el: HTMLElement | SVGGraphicsElement
  constructor(el: HTMLElement | SVGGraphicsElement){
    this.el = el

    //1. 转换样式坐标到transform
    const styleXy:any = getStyleXy(el)
    el.style.left = el.style.top = ''
    el.removeAttribute('x')
    el.removeAttribute('y')
    el.removeAttribute('cx')
    el.removeAttribute('cy')
    this. x= styleXy.x
    this. y= styleXy.y 
    //2. 叠加transform
    EXP_MATRIX.lastIndex = 0
    const rs = EXP_MATRIX.exec(window.getComputedStyle(el).transform)
    if(rs && rs.groups){
      this.x += parseFloat(rs.groups.x) || 0
      this.y += parseFloat(rs.groups.y) || 0
    }

    moveTo(el, this.x, this.y)
  }

  moveTo(x: number,y: number){
    this.x = x
    this.y = y
    moveTo(this.el, this.x, this.y)
  }
  moveToX(x: number) {
    this.x = x
    moveTo(this.el, this.x, this.y)
  }
  moveToY(y: number) {
    this.y = y
    moveTo(this.el, this.x, this.y)
  }
}

/**
 * 返回一个包装后的变形对象，可执行变形操作
 * @param el 
 */
export function wrapper(el: HTMLElement | SVGGraphicsElement): UiiTransformer {
  return new UiiTransformer(el)
}

function transformMove(
  transofrmStr: string,
  x: number,
  y: number,
  unit = false
) {
  return (
    `translate(${x}${unit ? "px" : ""},${y}${unit ? "px" : ""})` +
    transofrmStr.replace(/translate\([^)]+?\)/, "")
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
  const xy = EXP_GET_TRANSLATE.exec(transformStr)
  if (xy && xy.groups) {
    xVal = parseFloat(xy.groups.x);
    yVal = parseFloat(xy.groups.y);
  }else{
    EXP_GET_TRANSLATE_XY.lastIndex = 0;
    const xy = EXP_GET_TRANSLATE_XY.exec(transformStr)
    if(xy && xy.groups){
      if(xy.groups.dir == 'X'){
        xVal = parseFloat(xy.groups.v);
      }else{
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
      el.getAttribute("transform") || "",
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
      style.transform.replace(/rotateZ\([^)]+?\)/, "") +
      " rotateZ(" +
      deg +
      "deg)";
  }
}
