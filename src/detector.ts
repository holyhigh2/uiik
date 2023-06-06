/* eslint-disable max-len */
/**
 * CollisionDetector
 * @author holyhigh2
 */
import { isElement, isFunction, isString } from "myfx/is"
import { flatMap} from "myfx/collection"
import { assign} from "myfx/object"
import { CollisionData, CollisionDetectorOptions } from "./types"
import { getOffset } from "./utils"

export class CollisionDetector {
  #_targets: (() => Array<HTMLElement>) | string | HTMLElement | Array<HTMLElement> | NodeList | HTMLCollection
  targetsData: Array<CollisionData>
  el: Element
  elData:CollisionData
  opts: Record<string, any>

  constructor(el: string | HTMLElement, targets: (() => Array<HTMLElement>) | string | HTMLElement | Array<HTMLElement> | NodeList | HTMLCollection, opts?: CollisionDetectorOptions) {
    this.#_targets = targets
    this.opts = {
      container: document.body
    }
    this.opts = assign(this.opts, opts)
    const domEl = isString(el) ? document.querySelector(el) : el
    if (!domEl) {
      console.error('Invalid selector "' + el + '"')
      return
    }
    const ele = domEl as HTMLElement
    this.el = domEl

    //el data
    const offset = getOffset(ele,this.opts.container)
    const rect = { x: offset.x, y: offset.y, width: ele.offsetWidth, height: ele.offsetHeight }

    this.elData = {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
    }

    //targets data
    this.update()
  }

  /**
   * update targets data if them changed
   */
  update() {
    let targets
    if (isFunction(this.#_targets)) {
      targets = this.#_targets()
    } else if (isString(this.#_targets)) {
      targets = this.opts.container.querySelectorAll(this.#_targets)
    } else if (isElement(this.#_targets)) {
      targets = [this.#_targets]
    } else {
      targets = this.#_targets
    }

    this.targetsData = flatMap<HTMLElement, any, CollisionData>(targets, t => {
      if (!t) return []
      if (!isElement(t)) return []

      const offset = getOffset(t,this.opts.container)
      const rect = {x:offset.x,y:offset.y,width:t.offsetWidth,height:t.offsetHeight}

      return {
        x1: rect.x,
        y1: rect.y,
        x2: rect.x + rect.width,
        y2: rect.y + rect.height,
        el:t
      }
    })
  }

  /**
   * detect targets and return overlaps
   * @returns 
   */
  getOverlaps(): Array<HTMLElement>
  getOverlaps(x1:number,y1:number,x2:number,y2:number): Array<HTMLElement>
  getOverlaps(x1?:number,y1?:number,x2?:number,y2?:number): Array<HTMLElement> {
    let elData = this.elData
    if(x1 && x2 && y1 && y2){
      elData = {
        x1,
        y1,
        x2,
        y2,
      }
    }    
    
    let overlaps = flatMap<CollisionData,number,HTMLElement>(this.targetsData,(td,i)=>{
      if(elData.x2 < td.x1 || elData.x1 > td.x2 || elData.y2 < td.y1 || elData.y1 > td.y2)return []

      return td.el
    })
    
    return overlaps
  }

  /**
   * detect targets and return inclusions
   * @returns 
   */
  getInclusions(): Array<HTMLElement>
  getInclusions(x1:number,y1:number,x2:number,y2:number): Array<HTMLElement>
  getInclusions(x1?:number,y1?:number,x2?:number,y2?:number): Array<HTMLElement> {
    let elData = this.elData
    if(x1 && x2 && y1 && y2){
      elData = {
        x1,
        y1,
        x2,
        y2,
      }
    }    
    
    let contains = flatMap<CollisionData,number,HTMLElement>(this.targetsData,(td,i)=>{
      if(elData.x2 >= td.x2 && elData.x1 <= td.x1 && elData.y2 >= td.y2 && elData.y1 <= td.y1)return td.el

      return []
    })
    
    return contains
  }
}

/**
 * create a detector for the el and return
 * @param el element to be detected
 * @param targets 
 * @param opts CollisionDetectorOptions
 * @param opts.container a root element of targets
 * @returns 
 */
export function newCollisionDetector(
  el: string | HTMLElement,
  targets: (() => Array<HTMLElement>) | string | HTMLElement | Array<HTMLElement> | NodeList | HTMLCollection,
  opts?: CollisionDetectorOptions
): CollisionDetector {
  return new CollisionDetector(el, targets, opts)
}
