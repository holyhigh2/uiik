/* eslint-disable max-len */
/**
 * dom rotator
 * @author holyhigh2
 */
import { each } from 'myfx/collection'
import { RotatableOptions, Uii } from './types'
import { rotateTo } from './transform'

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
export class Rotatable extends Uii {
  constructor(els: string | Element, opts?: RotatableOptions) {
    super(
      els,
      opts
    );

    each(this.ele, (el) => {
      initHandle(this, el, this.opts)
    });
  }
}

function initHandle(uiik: Uii, el: HTMLElement | SVGElement, opts: RotatableOptions) {
  let handleStr = opts.handle
  let handles: any
  if (handleStr) {
    handles = document.querySelectorAll(handleStr)
  }

  each(handles,(h:SVGStyleElement|HTMLStyleElement)=>{
    h.style.cursor = opts.cursor?.default || 'crosshair'
    
    bindHandle(uiik, h,el as HTMLElement, opts)
  })

  el.classList.toggle(CLASS_ROTATABLE, true)
}

function bindHandle(
  uiik: Uii,
  handle: Element,
  el: HTMLElement,
  opts: RotatableOptions
) {
  const onStart = opts.onStart
  const onRotate = opts.onRotate
  const onEnd = opts.onEnd

  let deg = 0
  let offsetDeg = 0
  let centerX = 0, centerY = 0
  let style = el.style

  uiik.addPointerDown(handle, ({ pointX, pointY, onPointerStart, onPointerMove, onPointerEnd }) => {

    // calc center
    const center = style.transformOrigin || '50% 50%'
    const centerPair = center.split(' ')
    
    const shadowDom = el.cloneNode() as Element

    rotateTo(shadowDom as any,0)

    el.parentElement?.appendChild(shadowDom)
    const offsetXY = shadowDom.getBoundingClientRect()
    let startX = offsetXY.x, startY = offsetXY.y

    el.parentElement?.removeChild(shadowDom)

    let offWidth = offsetXY.width * (parseFloat(centerPair[0])/100 || 0)
    let offHeight = offsetXY.height * (parseFloat(centerPair[1])/100 || 0)

    centerX = startX + offWidth
    centerY = startY + offHeight
    let a = 1, b = 0
    const matrix = window.getComputedStyle(el).transform
    if (matrix.indexOf('matrix') > -1) {
      const abcd = matrix.replace(/^matrix\(|\)$/mg, '').split(',')
      a = parseFloat(abcd[0])
      b = parseFloat(abcd[1])
    }

    deg = Math.atan2(b, a) * ONE_DEG
    if (deg < 0) deg = 360 - deg
    if (deg > 360) deg = 360 - deg % 360

    let startDeg = Math.atan2(pointY - centerY, pointX - centerX) * ONE_DEG + 90
    if (startDeg < 0) startDeg = 360 + startDeg

    offsetDeg = startDeg - deg

    //bind events
    onPointerStart(function (args: Record<string, any>) {
      const { ev } = args
      //apply classes
      el.classList.toggle(CLASS_ROTATABLE_ACTIVE, true)
      onStart && onStart({ deg,cx:centerX,cy:centerY }, ev)
    })
    onPointerMove((args: Record<string, any>) => {
      const { ev, pointX, pointY } = args
      deg = Math.atan2(pointY - centerY, pointX - centerX) * ONE_DEG + 90 - offsetDeg
      if (deg < 0) deg = 360 + deg
      
      console.log(deg,offsetDeg,pointX, pointY,centerX,centerY)

      onRotate && onRotate({ deg,cx:centerX,cy:centerY }, ev)
      
      rotateTo(el,deg,offWidth,offHeight)
    })
    onPointerEnd((args: Record<string, any>) => {
      const { ev } = args
      el.classList.toggle(CLASS_ROTATABLE_ACTIVE, false)

      onEnd && onEnd({ deg }, ev)
    })
  }, {
    threshold: THRESHOLD,
    lockPage: true
  })
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
