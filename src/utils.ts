/* eslint-disable max-len */
/**
 * 工具包
 * @author holyhigh2
 */

import { find } from "myfx/collection"

/**
 * 获取child相对于parent的offset信息。含border宽度
 * @returns
 */
export function getOffset(child:HTMLElement,parent?:HTMLElement):{x:number,y:number}{
  const rs = {x:0,y:0}

  let op = child.offsetParent as HTMLElement

  while(op && parent && op !== parent){
    const style = window.getComputedStyle(op)
    rs.x += op.offsetLeft + parseFloat(style.borderLeftWidth)
    rs.y += op.offsetTop + parseFloat(style.borderTopWidth)
    op = op.offsetParent as HTMLElement
  }
  rs.x += child.offsetLeft
  rs.y += child.offsetTop

  return rs;
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