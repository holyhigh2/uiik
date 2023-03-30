/* eslint-disable max-len */
/**
 * splitter
 * @author holyhigh
 */
import { assign, call, each, includes, isArray, isEmpty, map, reject, some, split, test } from '@holyhigh/func.js'
import { SplittableOptions, Uii } from './types'
import { lockPage, restoreCursor, saveCursor, setCursor, unlockPage } from './utils';

const THRESHOLD = 1;
const CLASS_SPLITTABLE = "uii-splittable";
const CLASS_SPLITTABLE_HANDLE = "uii-splittable-handle";
const CLASS_SPLITTABLE_HANDLE_GHOST = "uii-splittable-handle-ghost";
const CLASS_SPLITTABLE_HANDLE_ACTIVE = "uii-splittable-handle-active";
const CLASS_SPLITTABLE_V = "uii-splittable-v";
const CLASS_SPLITTABLE_H = "uii-splittable-h";

function getRootEl(el:HTMLElement,root:HTMLElement) {
  let rs = el.parentNode
  while (rs && rs.parentNode !== root) {
    rs = rs.parentNode
  }
  return rs
}

/**
 * 用于表示一个或多个分割器的定义
 * > 可用CSS接口
 * - .uii-splittable
 * - .uii-splittable-handle
 * - .uii-splittable-handle-ghost
 * - .uii-splittable-handle-active
 * - .uii-splittable-v
 * - .uii-splittable-h
 * @public
 */
export class Splittable extends Uii{

  constructor(
    container: string | HTMLElement,
    opts?: SplittableOptions
  ) {
    super(
      container,
      assign(
        {
          handleSize: 10,
          minSize: 0,
          sticky: false,
          inside:false,
          ghost:false
        },
        opts
      )
    );

    const con = this.ele[0]
    //detect container position
    const pos = window.getComputedStyle(con).position;
    if (pos === "static") {
      con.style.position = "relative";
    }
    con.classList.toggle(CLASS_SPLITTABLE,true)
    const handleDoms = con.querySelectorAll(this.opts.handle)
    const children = reject(con.children,c=>{
      if (includes(handleDoms,c))return true
      return false
    })
    const dir = this.#checkDirection(con)
    
    con.classList.toggle(dir === 'v' ? CLASS_SPLITTABLE_V : CLASS_SPLITTABLE_H, true)

    const minSizeAry: Array<number> = map<number,number>(children,(c,i)=>{
      if (isArray(this.opts.minSize)) {
        return this.opts.minSize[i] || 0
      } else {
        return this.opts.minSize
      }
    })

    const stickyAry: Array<boolean> = map<boolean, number>(children, (c, i) => {
      if (isArray(this.opts.sticky)) {
        return this.opts.sticky[i] || false
      } else {
        return this.opts.sticky
      }
    })
    

    if (isEmpty(handleDoms)){
      const len = children.length - 1
      for (let i = 0; i < len; i ++) {
        this.#bindHandle(minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, children[i] as HTMLElement, children[i + 1] as HTMLElement)
      }
    }else{
      each(handleDoms,(h,i:number)=>{
        const isRoot = h.parentNode.classList.contains(CLASS_SPLITTABLE)
        let dom1:HTMLElement,dom2:HTMLElement
        if(isRoot){
          dom1 = h.previousElementSibling
          dom2 = h.nextElementSibling
        }else{
          dom2 = getRootEl(h, con) as HTMLElement
          dom1 = dom2.previousElementSibling as HTMLElement
        }
        this.#bindHandle(minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, dom1, dom2,h)
      })
    }
    
  }

  /**
   * @internal
   */
  #checkDirection(container:HTMLElement){
    let dir = 'h'
    const child = container.children[0] as HTMLElement
    let lastY = child.offsetTop
    each<HTMLElement>(container.children,c=>{
      if(c.offsetTop != lastY){
        dir = 'v'
        return false
      }
    })
    return dir
  }

  /**
   * @internal
   */
  #bindHandle(minSizeAry:number[],stickyAry:boolean[],opts:SplittableOptions,dir:string,dom1:HTMLElement,dom2:HTMLElement,handle?:HTMLElement){
    const handleSize = opts.handleSize!
    if (!handle){
      handle = document.createElement('div')
      let initPos = 0
      if (!opts.inside) {
        initPos = (dir === 'v' ? dom2.offsetTop : dom2.offsetLeft)
      }
      const sensorHCss = `width:${handleSize}px;height:100%;top:0;left:${initPos - handleSize / 2
        }px;z-index:9;`
      const sensorVCss = `height:${handleSize}px;width:100%;left:0;top:${initPos - handleSize / 2
        }px;z-index:9;`
      handle.style.cssText =
        'position: absolute;' + (dir === 'v' ? sensorVCss : sensorHCss)

      if (opts.inside) {
        dom2.appendChild(handle)
      }
      dom2.parentNode?.insertBefore(handle, dom2)
    }
    handle.style.cursor = dir === 'v' ? 's-resize' : 'e-resize'
    handle.dataset.cursor = handle.style.cursor
    handle.classList.add(CLASS_SPLITTABLE_HANDLE)

    const minSize1 = minSizeAry[0]
    const minSize2 = minSizeAry[1]
    let sticky1: boolean = stickyAry[0]
    let sticky2: boolean = stickyAry[1]

    const onStart = opts.onStart
    const onSplit = opts.onSplit
    const onEnd = opts.onEnd
    const onSticky = opts.onSticky
    const onClone = opts.onClone

    const oneSideMode = opts.oneSideMode
    const updateStart = !oneSideMode || oneSideMode === 'start'
    const updateEnd = !oneSideMode || oneSideMode === 'end'

    handle.onmousedown = function (e: MouseEvent) {

      // 1. 获取原始高度/宽度;设置宽度/高度
      let originSize = 0
      let originSize1 = 0
      const originPosX = e.clientX
      const originPosY = e.clientY

      let splitterSize = 1
      let blockSize = 0 // 分割区size
      switch (dir) {
        case 'v':
          originSize = dom1.offsetHeight
          originSize1 = dom2.offsetHeight
          splitterSize = handle!.offsetHeight
          break
        case 'h':
          originSize = dom1.offsetWidth
          originSize1 = dom2.offsetWidth
          splitterSize = handle!.offsetWidth
          break
      }
      blockSize = splitterSize + originSize + originSize1

      const dom1Style = dom1.style
      const dom2Style = dom2.style

      //ghost
      const ghost = opts.ghost
      const ghostClass = opts.ghostClass
      let ghostNode: HTMLElement | null = null

      // 初始化sticked位置
      let sticked:'start' | 'end' | 'none' = 'none'
      if (originSize < minSize1 / 2) {
        sticked = 'start'
      } else if (blockSize - originSize - splitterSize < minSize2 / 2) {
        sticked = 'end'
      }
      let dragging = false;
      saveCursor()
      let startPos = dir === 'v' ? dom1.offsetTop : dom1.offsetLeft
      let ds1:number, anotherSize:number

      const dragListener = (ev: MouseEvent) => {
        const offsetx = ev.clientX - originPosX
        const offsety = ev.clientY - originPosY

        if (!dragging) {
          if (Math.abs(offsetx) > THRESHOLD || Math.abs(offsety) > THRESHOLD) {
            dragging = true;

            handle?.classList.add(CLASS_SPLITTABLE_HANDLE_ACTIVE)

            if (ghost) {
              ghostNode = handle!.cloneNode(true) as HTMLElement
              ghostNode.style.opacity = '0.3'
              ghostNode.style.pointerEvents = 'none'
              ghostNode.classList.add(CLASS_SPLITTABLE_HANDLE_GHOST)

              if (ghostNode) {
                if (ghostClass) {
                  ghostNode.className =
                    ghostNode.className.replace(ghostClass, '') + ' ' + ghostClass
                }
                handle?.parentNode?.appendChild(ghostNode)

                call(onClone, ghostNode, e)
              }
            }

            lockPage()
            setCursor(handle?.dataset.cursor || '')

            call(onStart, originSize, originSize1)
          } else {
            ev.preventDefault();
            return false;
          }
        }

        let doSticky = false
        ds1 = dir === 'v' ? originSize + offsety : originSize + offsetx

        if (ds1 < minSize1 / 2 && sticky1 && minSize1 > 0) {
          if (sticked == 'none') {
            doSticky = true
            sticked = 'start'
          }
          ds1 = 0
        } else if (ds1 < minSize1) {
          ds1 = minSize1
          if (sticked == 'start' && sticky1) {
            // 重置状态
            doSticky = true
            sticked = 'none'
          }
        } else if (
          blockSize - ds1 - splitterSize < minSize2 / 2 &&
          sticky2
        ) {
          if (sticked == 'none') {
            doSticky = true
            sticked = 'end'
          }
          ds1 = blockSize - splitterSize
        } else if (blockSize - ds1 - splitterSize < minSize2) {
          ds1 = blockSize - minSize2 - splitterSize
          if (sticked == 'end' && sticky2) {
            // 重置状态
            doSticky = true
            sticked = 'none'
          }
        }

        anotherSize = blockSize - ds1 - splitterSize

        if (ghostNode){
          if (dir === 'v') {
            ghostNode.style.top = startPos + ds1 - handleSize / 2 + 'px'
          } else {
            ghostNode.style.left = startPos + ds1 - handleSize / 2 + 'px'
          }
        }else{
          const updateProp = dir === 'v' ? 'height' : 'width'
          if (updateStart) {
            dom1Style.setProperty(updateProp, ds1 + 'px', 'important')
          }
          if (updateEnd) {
            dom2Style.setProperty(
              updateProp,
              anotherSize + 'px',
              'important'
            )
          }

          if (doSticky) {
            call(onSticky, ds1, anotherSize, sticked)
          }

          //update handle
          if (dir === 'v') {
            handle!.style.top = dom2.offsetTop - handleSize / 2 + 'px'
          } else {
            handle!.style.left = dom2.offsetLeft - handleSize / 2 + 'px'
          }
        }

        call(onSplit, ds1, anotherSize)

        ev.preventDefault()
        return false
      }
      const dragEndListener = (ev: MouseEvent) => {
        document.removeEventListener('mousemove', dragListener, false)
        document.removeEventListener('mouseup', dragEndListener, false)
        window.removeEventListener('blur', dragEndListener, false)

        if (dragging) {
          switch (dir) {
            case 'v':
              originSize = dom1?.offsetHeight || -1
              originSize1 = dom2?.offsetHeight || -1
              break
            case 'h':
              originSize = dom1?.offsetWidth || -1
              originSize1 = dom2?.offsetWidth || -1
              break
          }

          handle?.classList.remove(CLASS_SPLITTABLE_HANDLE_ACTIVE)

          if (ghostNode){
            const updateProp = dir === 'v' ? 'height' : 'width'
            if (updateStart) {
              dom1Style.setProperty(updateProp, ds1 + 'px', 'important')
            }
            if (updateEnd) {
              dom2Style.setProperty(
                updateProp,
                anotherSize + 'px',
                'important'
              )
            }
            //update handle
            if (dir === 'v') {
              handle!.style.top = startPos + ds1 - handleSize / 2 + 'px'
            } else {
              handle!.style.left = startPos + ds1 - handleSize / 2 + 'px'
            }

            ghostNode.parentNode?.contains(ghostNode) && ghostNode.parentNode?.removeChild(ghostNode)
          }

          unlockPage()
          restoreCursor()

          call(onEnd,originSize, originSize1)
        }
      }
      document.addEventListener('mousemove', dragListener, false)
      document.addEventListener('mouseup', dragEndListener, false)
      window.addEventListener('blur', dragEndListener, false)

      e.preventDefault()
      return false
    }
  }
}

/**
 * Add one or more splittors into the container
 * @param container css selector or html element
 * @param opts SplittableOptions
 * @returns 
 */
export function newSplittable(
  container: string | HTMLElement,
  opts?: SplittableOptions
): Splittable {
  return new Splittable(container, opts)
}
