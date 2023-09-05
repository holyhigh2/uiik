/* eslint-disable max-len */
/**
 * 工具包
 * @author holyhigh2
 */

import { find } from "myfx/collection"
import { Uii } from "./types"
import { get } from "myfx/object"
import { isEmpty } from "myfx/is"
import { closest } from "myfx/tree"

/**
 * 获取child相对于parent的位置信息。含border宽度
 * 
 * todo
 * @returns {x,y,w,h}
 */
export function getBox(child: Element, parent?: Element): { x: number, y: number, w: number, h: number } {
  const rect = child.getBoundingClientRect()
  const rs = {x:0,y:0,w:rect.width,h:rect.height}
  parent = parent || (child as HTMLElement).offsetParent || (child as SVGElement).ownerSVGElement || child.parentElement || document.body
  const parentRect = parent.getBoundingClientRect()//bcr包含padding，不包含borderWidth
  const parentStyle = window.getComputedStyle(parent)
  const parentBorderLeft = parseFloat(parentStyle.borderLeftWidth)
  const parentBorderTop = parseFloat(parentStyle.borderTopWidth)

  rs.x = rect.x - parentRect.x + parent.scrollLeft
  rs.y = rect.y - parentRect.y + parent.scrollTop

  if(child instanceof SVGElement){
  }else{
    rs.x -= parentBorderLeft
    rs.y -= parentBorderTop
  }

  return rs;
}

/**
 * 获取事件目标与点击点之间的偏移
 * @param e 
 * @returns [offx,offy]
 */
export function getPointOffset(e:MouseEvent,pos:{x:number,y:number}){
  let ox = e.offsetX || 0,
    oy = e.offsetY || 0;
  if (e.target instanceof SVGElement){
    ox -= pos.x
    oy -= pos.y
  }
  return [ox,oy ]
}

export function isSVGEl(el:Element):el is SVGElement{
  return el instanceof SVGElement
}

/**
 * 边缘检测最小内部边距
 */
export const EDGE_THRESHOLD = 5

export const DRAGGING_RULE = "body * { pointer-events: none; }"

let lockSheet: CSSStyleSheet | undefined
export function lockPage() {
  lockSheet = getFirstSS()
  lockSheet?.insertRule(DRAGGING_RULE, 0)
}
export function unlockPage() {
  lockSheet?.deleteRule(0)
}

function getFirstSS(){
  if(document.styleSheets.length<1){
    document.head.appendChild(document.createElement('style'))
  }
  const sheet = find(document.styleSheets,ss=>!ss.href)
  if(!sheet){
    document.head.appendChild(document.createElement('style'))
  }

  return sheet || find(document.styleSheets,ss=>!ss.href)
}

let cursor = {html:'',body:''}
export function saveCursor(){
  cursor.body = document.body.style.cursor
  cursor.html = document.documentElement.style.cursor
}

export function setCursor(cursor:string){
  document.body.style.cursor = document.documentElement.style.cursor = cursor
}

export function restoreCursor(){
  document.body.style.cursor = cursor.body
  document.documentElement.style.cursor = cursor.html
}

/**
 * 获取元素样式/属性中的x/y
 * @param el 
 */
export function getStyleXy(el: HTMLElement | SVGGraphicsElement) {
  const style:any = window.getComputedStyle(el)
  let x = 0,y = 0
  if (el instanceof SVGGraphicsElement) {
    x = parseFloat(style.x || style.cx) || 0
    y = parseFloat(style.y || style.cy) || 0
  } else {
    x = parseFloat(style.left)||0
    y = parseFloat(style.top) || 0
  }
  return {x,y}
}