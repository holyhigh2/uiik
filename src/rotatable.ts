/* eslint-disable max-len */
/**
 * dom rotator
 * @author holyhigh2
 */
import { isDefined } from 'myfx/is'
import { each } from 'myfx/collection'
import { RotatableOptions, Uii } from './types'
import { lockPage, restoreCursor, saveCursor, setCursor, unlockPage } from './utils';

const ONE_DEG = 180 / Math.PI
const THRESHOLD = 2
const CLASS_ROTATABLE = "uii-rotatable"
const CLASS_ROTATABLE_HANDLE = "uii-rotatable-handle"
const CLASS_ROTATABLE_ACTIVE = "uii-rotatable-active"

/**
 * 用于表示一个或多个可旋转元素的定义
 * > 可用CSS接口
 * - .uii-rotatable
 * - .uii-rotatable-handle
 * - .uii-rotatable-active
 * @public
 */
export class Rotatable extends Uii{
  constructor(els: string | HTMLElement, opts?: RotatableOptions) {
    super(
      els,
      opts
    );
    
    each(this.ele, (el) => {
      initHandle(el,this.opts)
    });
  }
}

function initHandle(el:HTMLElement,opts:RotatableOptions){
    const handle = document.createElement('div')
    handle.className = CLASS_ROTATABLE_HANDLE
    handle.style.cssText = `
    position:absolute;
    width:12px;
    height:12px;
    border-radius:50%;
    left: calc(50% - 6px);
    top: -24px;
    `

    handle.style.cursor = opts.cursor?.default || 'crosshair'
    
    bindHandle(handle, el, opts)
    el.classList.toggle(CLASS_ROTATABLE,true)
    el.appendChild(handle)
}

function bindHandle(
  handle: HTMLElement,
  el: HTMLElement,
  opts: RotatableOptions
) {
  const onStart = opts.onStart
  const onRotate = opts.onRotate
  const onEnd = opts.onEnd
  handle.onmousedown = function (e) {
    // calc center
    const center = window.getComputedStyle(el).transformOrigin || ''
    const centerPair = center.split(' ')

    const shadowDom = el.cloneNode() as HTMLElement
    shadowDom.style.cssText = 'transform:rotate(0);z-index:-999;position:absolute;'
    el.parentElement?.appendChild(shadowDom)
    const offsetXY = shadowDom.getBoundingClientRect()
    el.parentElement?.removeChild(shadowDom)
    
    let centerX = parseFloat(centerPair[0]) + offsetXY.x
    let centerY = parseFloat(centerPair[1]) + offsetXY.y

    let a = 0,b = 0
    const matrix = window.getComputedStyle(el).transform
    if (matrix.indexOf('matrix')>-1){
      const abcd = matrix.replace(/^matrix\(|\)$/mg, '').split(',')
      a = parseFloat(abcd[0])
      b = parseFloat(abcd[1])
    }

    let deg = Math.atan2(b, a) * ONE_DEG
    if (deg < 0) deg = 360 - deg
    if (deg > 360) deg = 360 - deg%360

    const style = el.style

    let startDeg = Math.atan2(e.clientY - centerY, e.clientX - centerX) * ONE_DEG + 90
    if (startDeg < 0) startDeg = 360 + startDeg

    const offsetDeg = startDeg - deg

    let dragging = false;
    saveCursor()
    
    const dragListener = (ev: MouseEvent) => {
      const offsetx = ev.clientX - centerX
      const offsety = ev.clientY - centerY

      if (!dragging) {
        if (Math.abs(offsetx) > THRESHOLD || Math.abs(offsety) > THRESHOLD) {
          dragging = true;

          //apply classes
          el.classList.toggle(CLASS_ROTATABLE_ACTIVE,true)

          onStart && onStart({deg},ev)

          lockPage()
          if (isDefined(opts.cursor)){
            setCursor(opts.cursor?.active || 'crosshair')
          }
          
        } else {
          ev.preventDefault();
          return false;
        }
      }

      deg = Math.atan2(offsety, offsetx) * ONE_DEG + 90 - offsetDeg
      if(deg < 0)deg = 360 + deg

      onRotate && onRotate({deg},ev)

      style.transform = style.transform.replace(/rotateZ\(.*?\)/,'') + ' rotateZ('+deg+'deg)'

      ev.preventDefault()
      return false
    }
    const dragEndListener = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', dragListener, false)
      document.removeEventListener('mouseup', dragEndListener, false)
      window.removeEventListener('blur', dragEndListener, false)

      if (dragging) {
        unlockPage()
        restoreCursor()

        el.classList.toggle(CLASS_ROTATABLE_ACTIVE,false)

        onEnd && onEnd({deg},ev)
      }
      
    }

    document.addEventListener('mousemove', dragListener, false)
    document.addEventListener('mouseup', dragEndListener, false)
    window.addEventListener('blur', dragEndListener, false)

    e.preventDefault()
    return false
  }
}

/**
 * Make els rotatable
 * @param els selector string / html element
 * @param opts 
 * @returns 
 */
export function newRotatable(
  els: string | HTMLElement,
  opts?: RotatableOptions
): Rotatable {
  return new Rotatable(els, opts)
}
