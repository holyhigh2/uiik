import { assign, each, isArrayLike, isElement, isEmpty, isString, map, toArray } from "@holyhigh/func.js"

/**
 * A Base class for all Uii classes
 */
export abstract class Uii{
  /**
   * 处理过的dom元素数组
   */
  protected ele:Array<HTMLElement>
  /**
   * 当前uii对象的选项
   */
  protected opts:Record<string, any>
  protected enabled:boolean = true
  #listeners:Array<[HTMLElement,string,Function,boolean]> = []

  constructor(ele:string | HTMLElement | NodeList | HTMLCollection | Array<string|HTMLElement>,opts?:Record<string, any>){
    this.opts = opts || {}

    if (isArrayLike(ele) && !isString(ele)) {
      this.ele = map<HTMLElement>(ele, (el) => {
        let e = isString(el) ? document.querySelector(el) : el
        if (!isElement(e)) {
          console.error('Invalid element "' + el + '"');
          return false
        }
        return e
      })
    } else {
      const el = isString(ele) ? document.querySelectorAll(ele) : ele
      if (!isElement(el) && !isArrayLike(el)) {
        console.error('Invalid element "' + ele + '"');
        return
      }
      this.ele = isArrayLike(el)?toArray<HTMLElement>(el):[el]
    }
  }

  /**
   * 销毁uii对象，包括卸载事件、清空元素等
   */
  destroy():void{
    each(this.#listeners,ev=>{
      ev[0].removeEventListener(ev[1],ev[2] as any,ev[3])
    })
    this.#listeners = []
  }

  /**
   * 注册事件，以便在{@link destroy}方法中卸载
   * @param el dom元素
   * @param event 事件名
   * @param hook 回调函数
   * @param useCapture 默认false
   */
  protected registerEvent(el:HTMLElement,event:string,hook:Function,useCapture:boolean=false){
    const wrapper = ((ev:MouseEvent)=>{
      if(!this.enabled)return

      hook(ev)
    }).bind(this)
    el.addEventListener(event,wrapper,useCapture)
    this.#listeners.push([el,event,wrapper,useCapture])
  }
  /**
   * 禁用uii实例，禁用后的dom不会响应事件
   */
  disable():void{
    this.enabled = false
  }
  /**
   * 启用uii实例
   */
  enable():void{
    this.enabled = true
  }
  /**
   * 获取uii实例选项对象
   */
  getOption():Record<string, any>
  /**
   * 获取指定名称的选项值
   * @param name 
   * @returns 
   */
  getOption(name?:string):any{
    return name?this.opts[name]:this.opts
  }
  /**
   * 一次设置多个选项值。触发`onOptionChanged`
   * @param options 
   */
  setOptions(options?:Record<string, any>):void{
    assign(this.opts,options)
    this.onOptionChanged(this.opts)
  }
  /**
   * 设置指定name的选项值。触发`onOptionChanged`
   * @param name 
   * @param value 
   */
  setOption(name:string,value:any):void{
    this.opts[name] = value
    this.onOptionChanged(this.opts)
  }
  
  /**
   * @internal
   */
  protected onOptionChanged(opts?:Record<string, any>):void{
  }
}

export type ResizableOptions = {
  /**
   * handle的宽高，默认8
   */
  handleSize?: number
  /**
   * 拖动元素的最小size，如果是数组，表示 [width,height]
   */
  minSize?: number|Array<number>
  /**
   * 拖动元素的最大size，如果是数组，表示 [width,height]
   */
  maxSize?: number|Array<number>
  /**
   * resizable方向，默认[n,s,e,w,ne,nw,se,sw]
   */
  dir?: string[]
  /**
   * handle所在元素的位置偏移，负数向内，正数向外。默认0
   */
  offset?:number
  /**
   * 宽高比，小数
   */
  aspectRatio?:number
  /**
   * 开启ghost模式后，拖动元素时会自动创建元素副本并拖动副本，当拖动结束后，副本销毁并且元素移动到最后位置。默认false
   */
  ghost?: boolean | Function
  ghostClass?: string
  onStart?: (w: number, h: number) => void
  onResize?: (w: number, h: number) => void
  onEnd?: (w: number, h: number) => void
  onClone?: (cloneDom: HTMLElement, ev: MouseEvent) => void
}

export type SplittableOptions = {
  /**
   * handle宽/高，默认10
   */
  handleSize?: number
  /**
   * 最小区域，如果是数组可以按顺序定义分割区域，默认0
   */
  minSize?: number | number[]
  /**
   * 单边模式，只修改单侧元素size，用于flex布局。可选值为 start/end
   */
  oneSideMode?: 'start' | 'end'
  /**
   * 粘性吸附，如果是数组可以按顺序定义分割区域。设置minSize后生效
   */
  sticky?: boolean | boolean[]
  /**
   * 自动创建的handle是否在元素内部插入，默认false
   */
  inside?: boolean
  /**
   * 开启ghost模式后，拖动元素时会自动创建元素副本并拖动副本，当拖动结束后，副本销毁且元素移动到最后位置。默认false
   */
  ghost?:boolean
  ghostClass?: string
  /**
   * 自定义handle选择器，多个使用空格分隔。handle元素可以是与分割元素平级或在分割元素内
   */
  handle?:string
  onStart?: (size1: number, size2: number) => void
  onSplit?: (size1: number, size2: number) => void
  onEnd?: (size1: number, size2: number) => void
  onSticky?: (
    size1: number,
    size2: number,
    position: 'start' | 'end' | 'none'
  ) => void
  onClone?: (cloneDom: HTMLElement, ev: MouseEvent) => void
}

export type DraggableOptions = {
  /**
   * 限制活动范围，默认false
   */
  container?: boolean
  /**
   * 拖动起始阈值，默认0
   */
  threshold?: number
  /**
   * 实际响应拖动的元素选择器，字符串
   */
  handle?: string
  /**
   * 禁止触发元素的css选择器
   */
  filter?:string
  /**
   * 拖动目标，dom/selector数组，用于拖动交互事件
   */
  droppable?:
    | (() => NodeList | HTMLCollection | HTMLElement[])
    | string
    | HTMLElement
    | HTMLElement[]
  /**
   * 开启ghost模式后，拖动元素时会自动创建元素副本并拖动副本，当拖动结束后，副本销毁并且元素移动到最后位置。默认false，支持函数返回副本元素
   */
  ghost?: ((el:HTMLElement)=>HTMLElement) | boolean
  ghostClass?: string
  /**
   * 传递v/h可实现单向拖动。默认''
   */
  direction?: 'v' | 'h'
  /**
   * 是否在鼠标到达容器边缘时自动滚动，默认true
   */
  scroll?:boolean
  /**
   * 滚动速度，默认10
   */
  scrollSpeed?:number
  /**
   * 拖动时元素的zIndex
   */
  zIndex?:number
  /**
   * 可将不同的拖动元素编为一组，拖动时会自动管理zIndex
   */
  group?:string
  /**
   * 拖动时应用的class样式，多个使用空格分开
   */
  classes?:string
  /**
   * 拖动元素可自动吸附的目标元素选择器。字符串
   */
  snap?: string
  snapOptions?: {
    /**
     * 吸附元素的移动误差，默认10
     */
    tolerance: number
  }
  /**
   * 拖动时元素左上角距离指针的距离，支持百分比及负数
   */
  cursorAt?: {left:number|string,top:number|string}
  /**
   * 可定义拖动时不同状态下的指针，默认move
   */
  cursor?:{
    default?:string
    active?:string
    over?:string
  }
  /**
   * 网格拖动模式，每次移动指定的网格大小。数字或数字数组
   */
  grid?:number | number[]
  /**
   * 拖动类型标识，用于droppable识别交互类型
   */
  type?:string
  onStart?: (dragDom: HTMLElement, ev: MouseEvent) => void
  /**
   * 拖动中调用，返回false阻止dom移动
   * @param dragDom 
   * @param ev 
   * @param offsetX 
   * @param offsetY 
   * @returns 
   */
  onDrag?: (
    dragDom: HTMLElement,
    ev: MouseEvent,
    offsetX: number,
    offsetY: number,
    x:number,
    y:number
  ) => (boolean|void)
  /**
   * 拖动结束后调用，返回false阻止ghost模式下的dom移动
   * @param dragDom 
   * @param ev 
   * @returns 
   */
  onEnd?: (dragDom: HTMLElement, ev: MouseEvent) => (boolean|void)
  onClone?: (cloneDom: HTMLElement, ev: MouseEvent) => void
  onSnap?: (
    el: HTMLElement,
    targetH: HTMLElement,
    targetV: HTMLElement,
    hDir: string,
    vDir: string
  ) => void
}

export type DroppableOptions = {
  /**
   * 当accepts的draggable对象开始拖动时，自动设置该样式。多个样式使用空格分隔
   */
  activeClass?:string
  /**
   * 当accepts的draggable对象拖动到droppable元素上时，自动设置该样式。多个样式使用空格分隔
   */
  hoverClass?:string
  /**
   * 定义哪些draggable元素进行交互。如果是字符串，支持不同Draggable对象进行编组
   */
  accepts?: ((ele:Array<HTMLElement>,draggable:HTMLElement)=>boolean) | string
  /**
   * 当accepts的draggable对象开始拖动时触发
   * @param draggable 
   * @param ele 
   * @returns 
   */
  onActive?: (draggable:HTMLElement,ele:Array<HTMLElement>) => void
  onEnter?: (el:HTMLElement, ev: MouseEvent) => void
  onOver?: (el:HTMLElement, ev: MouseEvent) => void
  onLeave?: (el:HTMLElement, ev: MouseEvent) => void
  onDrop?: (el:HTMLElement, ev: MouseEvent) => void
  /**
   * 当accepts的draggable对象结束拖动时触发
   * @param draggable 
   * @param ele 
   * @returns 
   */
  onDeactive?:(draggable:HTMLElement,ele:Array<HTMLElement>) => void
}

export type RotatableOptions = {
  /**
   * 可定义拖动时不同状态下的指针，默认crosshair
   */
  cursor?:{
    default?:string
    active?:string
  }
  onStart?: (deg: number) => {}
  onRotate?: (deg: number) => {}
  onEnd?: (deg: number) => {}
}

export type SelectableOptions = {
  /**
   * 选择器样式字符串，多个使用空格分隔
   */
  class?: string
  /**
   * 选择器拖动进行中，被选中元素应用的样式字符串，多个使用空格分隔
   */
  selectingClass?: string
  /**
   * 选择器拖动结束后，被选中元素应用的样式字符串，多个使用空格分隔
   */
  selectedClass?: string
  /**
   * 容器中可选择的元素。可以是选择器字符串或返回元素数组的函数
   */
  targets?: (() => NodeList | HTMLCollection | HTMLElement[]) | string
  onStart?: (target: HTMLElement) => void
  //选中元素变动时触发
  onSelect?: (selection: HTMLElement[]) => void
  onEnd?: (selection: HTMLElement[]) => void
  /**
   * 选择模式，默认overlap
   */
  mode?:'overlap'|'inclusion'
  /**
   * 是否在鼠标到达容器边缘时自动滚动，默认true
   */
  scroll?:boolean
  /**
   * 滚动速度，默认10
   */
  scrollSpeed?:number
  /**
   * 禁止触发元素的css选择器或校验函数，函数返回true表示需要过滤
   */
  filter?:((el:HTMLElement)=>boolean) | string
}

export type CollisionDetectorOptions = {
  container?: Element
}

export type CollisionData = {
  //top left
  x1: number
  y1: number
  //bottom right
  x2: number
  y2: number
  el?: HTMLElement
}
