/* eslint-disable max-len */
/**
 * dom resizer
 * @author holyhigh2
 */
import { assign, call, each, isArray, isFunction, isNumber } from '@holyhigh/func.js'
import { ResizableOptions, Uii } from './types'
import { lockPage, restoreCursor, saveCursor, setCursor, unlockPage } from './utils';

const THRESHOLD = 2;
const CLASS_RESIZABLE_HANDLE = "uii-resizable-handle";
const CLASS_RESIZABLE_HANDLE_DIR = "uii-resizable-handle-";
const CLASS_RESIZABLE_HANDLE_ACTIVE = "uii-resizable-handle-active";

/**
 * 用于表示一个或多个可改变尺寸元素的定义
 * > 可用CSS接口
 * - .uii-resizable-handle
 * - .uii-resizable-handle-[n/s/e/w/ne/nw/se/sw]
 * - .uii-resizable-handle-active
 * @public
 */
export class Resizable extends Uii{
  constructor(els: string | HTMLElement, opts?: ResizableOptions) {
    super(
      els,
      assign(
        {
          handleSize: 8,
          minSize: 50,
          dir: ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'],
          ghost: false,
          offset:0
        },
        opts
      )
    );

    each(this.ele, (el) => {
      initHandle(el,this.opts)
    });
  }
}

function bindHandle(
  handle: HTMLElement,
  dir: string,
  panel: HTMLElement,
  opts: ResizableOptions
) {
  const onStart = opts.onStart
  const onResize = opts.onResize
  const onEnd = opts.onEnd
  const onClone = opts.onClone
  handle.onmousedown = function (e) {
    // 获取panel当前信息
    const originW = panel.offsetWidth
    const originH = panel.offsetHeight
    const originX = panel.offsetLeft
    const originY = panel.offsetTop
    let changeW = false
    let changeH = false
    let changeX = false
    let changeY = false

    switch (dir) {
      case 's':
        changeH = true
        break
      case 'e':
        changeW = true
        break
      case 'n':
        changeY = true
        changeH = true
        break
      case 'w':
        changeX = true
        changeW = true
        break
      case 'se':
        changeW = true
        changeH = true
        break
      case 'sw':
        changeX = true
        changeW = true
        changeH = true
        break
      case 'ne':
        changeY = true
        changeW = true
        changeH = true
        break
      case 'nw':
        changeX = true
        changeY = true
        changeW = true
        changeH = true
        break
    }

    const originPosX = e.clientX
    const originPosY = e.clientY

    // boundary
    let minWidth: number|undefined
    let minHeight: number|undefined
    let maxWidth: number|undefined
    let maxHeight: number|undefined
    if (isArray(opts.minSize)) {
      minWidth = opts.minSize[0]
      minHeight = opts.minSize[1]
    } else if(isNumber(opts.minSize)){
      minWidth = opts.minSize
      minHeight = opts.minSize
    }
    
    if (isArray(opts.maxSize)) {
      maxWidth = opts.maxSize[0]
      maxHeight = opts.maxSize[1]
    } else if(isNumber(opts.maxSize)){
      maxWidth = opts.maxSize
      maxHeight = opts.maxSize
    }

    const minX = maxWidth?originX - maxWidth + originW:null
    const minY = maxHeight?originY - maxHeight + originH:null
    const maxX = minWidth?originX + originW - minWidth:null
    const maxY = minHeight?originY + originH - minHeight:null

    //ghost
    const ghost = opts.ghost
    const ghostClass = opts.ghostClass
    let ghostNode: HTMLElement|null = null
    
    //aspectRatio
    const aspectRatio = opts.aspectRatio

    const panelStyle = panel.style
    let style = panelStyle

    let currentW: number = originW
    let currentH: number = originH

    let dragging = false;
    saveCursor()

    const dragListener = (ev: MouseEvent) => {
      const offsetx = ev.clientX - originPosX
      const offsety = ev.clientY - originPosY

      if (!dragging) {
        if (Math.abs(offsetx) > THRESHOLD || Math.abs(offsety) > THRESHOLD) {
          dragging = true;

          handle.classList.add(CLASS_RESIZABLE_HANDLE_ACTIVE)

          if (ghost) {
            if (isFunction(ghost)) {
              ghostNode = ghost()
            } else {
              ghostNode = panel.cloneNode(true) as HTMLElement
              ghostNode.style.opacity = '0.3'
              ghostNode.style.pointerEvents = 'none'
            }
            if (ghostNode) {
              if (ghostClass) {
                ghostNode.className =
                  ghostNode.className.replace(ghostClass, '') + ' ' + ghostClass
              }
              panel.parentNode?.appendChild(ghostNode)

              call(onClone, ghostNode, e)
            }
            style = ghostNode?.style!
          }

          lockPage()
          setCursor(handle.dataset.cursor ||'')

          call(onStart, originW, originH)
        } else {
          ev.preventDefault();
          return false;
        }
      }

      let w = originW
      let h = originH
      let y = originY
      let x = originX
      if (changeW) {
        w = originW + offsetx * (changeX ? -1 : 1)
        if (minWidth && w < minWidth) w = minWidth
        if (maxWidth && w > maxWidth) w = maxWidth
      }
      if (changeH) {
        h = originH + offsety * (changeY ? -1 : 1)
        if (minHeight && h < minHeight) h = minHeight
        if (maxHeight && h > maxHeight) h = maxHeight
      }
      if (changeY) {
        y = originY + offsety
        if (minY && y < minY) y = minY
        if (maxY && y > maxY) y = maxY
      }
      if (changeX) {
        x = originX + offsetx
        if (minX && x < minX) x = minX
        if (maxX && x > maxX) x = maxX
      }

      if(aspectRatio){
        if(changeW){
          style.width = w + 'px'
          style.height = w / aspectRatio + 'px'
        }

        if(changeH && dir !== 'sw'){
          
          if(dir === 'nw'){
            y = originY - w / aspectRatio + originH
          }else{
            style.width = h * aspectRatio + 'px'
            style.height = h + 'px'
          }
          
        }
      }else{
        if(changeW){
          style.width = w + 'px'
        }
        if(changeH){
          style.height = h + 'px'
        }
      }

      if(changeY){
        style.top = y + 'px'
      }
      if(changeX){
        style.left = x + 'px'
      }

      currentW = w
      currentH = h

      call(onResize,w,h)

      ev.preventDefault()
      return false
    }
    const dragEndListener = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', dragListener, false)
      document.removeEventListener('mouseup', dragEndListener, false)
      window.removeEventListener('blur', dragEndListener, false)

      if (ghost && ghostNode) {
        panel.parentNode?.contains(ghostNode) && panel.parentNode?.removeChild(ghostNode)
        panelStyle.left = ghostNode.style.left
        panelStyle.top = ghostNode.style.top
        panelStyle.width = ghostNode.style.width
        panelStyle.height = ghostNode.style.height
      }

      if(dragging){
        handle.classList.remove(CLASS_RESIZABLE_HANDLE_ACTIVE)

        unlockPage()
        restoreCursor()

        call(onEnd,currentW, currentH)
      }
    }

    document.addEventListener('mousemove', dragListener, false)
    document.addEventListener('mouseup', dragEndListener, false)
    window.addEventListener('blur', dragEndListener, false)

    e.preventDefault()
    return false
  }
}

function initHandle(panel:HTMLElement,opts:ResizableOptions){
    // create handles
    const handleSize = opts.handleSize
    const offset = opts.offset||0
    each<string>(opts.dir||['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'], (dir) => {
      const handle = document.createElement('div')
      handle.classList.add(CLASS_RESIZABLE_HANDLE, CLASS_RESIZABLE_HANDLE_DIR+dir)
      handle.setAttribute('name', 'handle')
      let css = ''
      switch (dir) {
        case 'n':
          css = `left:0px;top:${-offset}px;width:100%;height:${handleSize}px;`
          break
        case 's':
          css = `left:0px;bottom:${-offset}px;width:100%;height:${handleSize}px;`
          break
        case 'w':
          css = `top:0px;left:${-offset}px;width:${handleSize}px;height:100%;`
          break
        case 'e':
          css = `top:0px;right:${-offset}px;width:${handleSize}px;height:100%;`
          break
        default:
          css = `width:${handleSize}px;height:${handleSize}px;z-index:9;`
          switch (dir) {
            case 'ne':
              css += `top:${-offset}px;right:${-offset}px;`
              break
            case 'nw':
              css += `top:${-offset}px;left:${-offset}px;`
              break
            case 'se':
              css += `bottom:${-offset}px;right:${-offset}px;`
              break
            case 'sw':
              css += `bottom:${-offset}px;left:${-offset}px;`
          }
      }
      bindHandle(handle, dir, panel, opts)

      handle.style.cssText = `position: absolute;cursor: ${dir}-resize;` + css
      handle.dataset.cursor = `${ dir }-resize`
      panel.appendChild(handle)
    })
}

/**
 * Make els resizable
 * @param els selector string / html element
 * @param opts 
 * @returns 
 */
export function newResizable(
  els: string | HTMLElement,
  opts?: ResizableOptions
): Resizable {
  return new Resizable(els, opts)
}
