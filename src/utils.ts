/* eslint-disable max-len */
/**
 * 工具包
 * @author holyhigh2
 */

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

export function lockPage() {
  document.styleSheets[0].insertRule(DRAGGING_RULE, 0)
}
export function unlockPage() {
  document.styleSheets[0].deleteRule(0)
}