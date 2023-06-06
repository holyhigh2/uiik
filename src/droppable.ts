/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * 拖动器
 * @author holyhigh2
 */
import {
  each
} from "myfx/collection"
import {assign} from 'myfx/object'
import {split,test} from 'myfx/string'
import {
  isString,
  isFunction
} from "myfx/is";
import { DroppableOptions, Uii } from "./types";
import { setCursor } from "./utils";

const Droppables:Array<Droppable> = []
const CLASS_DROPPABLE = "uii-droppable";

/**
 * 用于表示一个或多个可响应拖动元素的定义
 * > 可用CSS接口
 * - .uii-droppable
 * @public
 */
export class Droppable extends Uii {
  #active:HTMLElement|null
  
  constructor(
    el: string | HTMLElement | Array<string | HTMLElement>,
    opts?: DroppableOptions
  ) {
    super(
      el,
      assign(
        {
        },
        opts
      )
    );
    
    Droppables.push(this)
  }

  /**
   * @internal
   */
  bindEvent(
    droppable: HTMLElement,
    opts: DroppableOptions
  ) {
    //dragenter
    this.registerEvent(droppable, "mouseenter", (e: MouseEvent) => {
      if(!this.#active)return

      if(opts.hoverClass){
        each(split(opts.hoverClass,' '),cls=>{
          droppable.classList.toggle(cls,true)
        })
      }

      if(this.#active.dataset.cursorOver){
        setCursor(this.#active.dataset.cursorOver)
      }

      opts.onEnter && opts.onEnter({draggable:this.#active,droppable},e)
    })
    //dragleave
    this.registerEvent(droppable, "mouseleave", (e: MouseEvent) => {
      if(!this.#active)return

      if(opts.hoverClass){
        each(split(opts.hoverClass,' '),cls=>{
          droppable.classList.toggle(cls,false)
        })
      }

      if(this.#active.dataset.cursorOver){
        setCursor(this.#active.dataset.cursorActive || '')
      }

      opts.onLeave && opts.onLeave({draggable:this.#active,droppable},e)
    })
    //dragover
    this.registerEvent(droppable, "mousemove", (e: MouseEvent) => {
      if(!this.#active)return
      opts.onOver && opts.onOver({draggable:this.#active,droppable},e)
    })
    //drop
    this.registerEvent(droppable, "mouseup", (e: MouseEvent) => {
      if(!this.#active)return

      if(opts.hoverClass){
        each(split(opts.hoverClass,' '),cls=>{
          droppable.classList.toggle(cls,false)
        })
      }
      
      opts.onDrop && opts.onDrop({draggable:this.#active,droppable},e)
    })
  }

  /**
   * @internal
   */
  active(target:HTMLElement){
    let valid = true
    const opts:DroppableOptions = this.opts
    //check accepts
    if(isString(opts.accepts)){
      valid = !!target.dataset.dropType && test(opts.accepts,target.dataset.dropType)
    }else if(isFunction(opts.accepts)){
      valid =  opts.accepts(this.ele,target)
    }
    if(!valid)return

    this.#active = target

    if(opts.activeClass){
      each(this.ele,el=>{
        each(split(opts.activeClass||'',' '),cls=>{
          el.classList.toggle(cls,true)
        })
      })
    }


    opts.onActive && opts.onActive({draggable:target,droppables:this.ele})

    //bind events
    each(this.ele, (el) => {
      el.classList.toggle(CLASS_DROPPABLE,true)
      el.style.pointerEvents = 'initial';
      this.bindEvent(el, opts);
    });
  }
  /**
   * @internal
   */
  deactive(target:HTMLElement){
    if(!this.#active)return

    this.#active = null
    const opts:DroppableOptions = this.opts

    if(opts.activeClass){
      each(this.ele,el=>{
        each(split(opts.activeClass||'',' '),cls=>{
          el.classList.toggle(cls,false)
        })
      })
    }

    opts.onDeactive && opts.onDeactive({draggable:target,droppables:this.ele})

    //unbind events
    this.destroy()
  }
}

//uii-drag active
document.addEventListener("uii-dragactive", (e: MouseEvent) => {
  each(Droppables,dpb=>{
    dpb.active(e.target as HTMLElement)
  })
})
document.addEventListener("uii-dragdeactive", (e: MouseEvent) => {
  each(Droppables,dpb=>{
    dpb.deactive(e.target as HTMLElement)
  })
})

/**
 * Enable els to response to draggable objects
 * @param els selector string / html element
 * @param opts 
 * @returns 
 */
export function newDroppable(
  els: string | HTMLElement | Array<string | HTMLElement>,
  opts?: DroppableOptions
): Droppable {
  return new Droppable(els, opts);
}
