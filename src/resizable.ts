/* eslint-disable max-len */
/**
 * dom resizer
 * @author holyhigh2
 */
import { each, map } from "myfx/collection";
import { assign } from "myfx/object";
import {
  isArray,
  isArrayLike,
  isDefined,
  isFunction,
  isNumber,
  isString,
  isUndefined,
} from "myfx/is";
import { ResizableOptions, Uii } from "./types";
import {
  ONE_ANG,
  ONE_RAD,
  calcVertex,
  getCenterXy,
  getCenterXySVG,
  getMatrixInfo,
  getPointInContainer,
  getRectInContainer,
  getStyleSize,
  parseOxy,
} from "./utils";
import { UiiTransform, moveTo, rotateTo, wrapper } from "./transform";

const THRESHOLD = 2;
const CLASS_RESIZABLE_HANDLE = "uii-resizable-handle";
const CLASS_RESIZABLE_HANDLE_DIR = "uii-resizable-handle-";
const CLASS_RESIZABLE_HANDLE_ACTIVE = "uii-resizable-handle-active";
["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const EXP_DIR = new RegExp(CLASS_RESIZABLE_HANDLE_DIR + "(?<dir>[nesw]+)");

/**
 * 用于表示一个或多个可改变尺寸元素的定义
 * > 可用CSS接口
 * - .uii-resizable-handle
 * - .uii-resizable-handle-[n/s/e/w/ne/nw/se/sw]
 * - .uii-resizable-handle-active
 * @public
 */
export class Resizable extends Uii {
  constructor(els: string | HTMLElement, opts?: ResizableOptions) {
    super(
      els,
      assign(
        {
          handleSize: 8,
          minSize: 50,
          dir: ["n", "s", "e", "w", "ne", "nw", "se", "sw"],
          ghost: false,
          offset: 0,
        },
        opts
      )
    );

    each(this.ele, (el) => {
      let tmp = el as any
      if(tmp._uiik_resizable){
        tmp._uiik_resizable.destroy()
        return false  
      }      
    })

    each(this.ele, (el) => {
      (el as any)._uiik_resizable = this

      this.initHandle(el);
    });
  }

  bindHandle(
    handle: HTMLElement | SVGElement,
    dir: string,
    panel: HTMLElement,
    opts: ResizableOptions
  ) {
    const onStart = opts.onStart;
    const onResize = opts.onResize;
    const onEnd = opts.onEnd;
    const onClone = opts.onClone;

    const uiik = this;

    this.addPointerDown(
      handle,
      ({ ev, onPointerStart, onPointerMove, onPointerEnd }) => {
        //检测
        const onPointerDown = opts.onPointerDown;
        if (onPointerDown && onPointerDown(ev) === false) return true;

        let container: HTMLElement | SVGGraphicsElement =
          panel instanceof SVGGraphicsElement
            ? panel.ownerSVGElement
            : (panel.parentElement as any);

        let setOrigin = !(panel instanceof SVGGraphicsElement);

        // 获取panel当前信息
        let matrixInfo = getMatrixInfo(panel);
        const offset = getRectInContainer(panel, container);
        const offsetParentRect = container.getBoundingClientRect();
        const offsetParentCStyle = window.getComputedStyle(container);

        const { w, h } = getStyleSize(panel);
        const originW = w;
        const originH = h;

        const originX = offset.x;
        const originY = offset.y;
        let changeW = false;
        let changeH = false;
        let changeX = false;
        let changeY = false;

        let toTransformOrigin = "";

        switch (dir) {
          case "s":
            changeH = true;
            break;
          case "e":
            changeW = true;
            break;
          case "se":
            changeW = true;
            changeH = true;
            break;
          case "n":
            changeX = true;
            changeY = true;
            changeH = true;
            toTransformOrigin = "0 0";
            break;
          case "w":
            changeX = true;
            changeY = true;
            changeW = true;
            toTransformOrigin = "0 0";
            break;
          case "sw":
          case "ne":
          case "nw":
            changeX = true;
            changeY = true;
            changeW = true;
            changeH = true;
            toTransformOrigin = "0 0";
            break;
        }

        // boundary
        let minWidth: number | undefined;
        let minHeight: number | undefined;
        let maxWidth: number | undefined;
        let maxHeight: number | undefined;
        if (isArray(opts.minSize)) {
          minWidth = opts.minSize[0];
          minHeight = opts.minSize[1];
        } else if (isNumber(opts.minSize)) {
          minWidth = opts.minSize;
          minHeight = opts.minSize;
        }

        if (isArray(opts.maxSize)) {
          maxWidth = opts.maxSize[0];
          maxHeight = opts.maxSize[1];
        } else if (isNumber(opts.maxSize)) {
          maxWidth = opts.maxSize;
          maxHeight = opts.maxSize;
        }

        //ghost
        const ghost = opts.ghost;
        const ghostClass = opts.ghostClass;
        let ghostNode: HTMLElement | null = null;

        //aspectRatio
        const aspectRatio = opts.aspectRatio;

        const panelStyle = panel.style;
        let style = panelStyle;

        let currentW: number = originW;
        let currentH: number = originH;

        let transform: UiiTransform;

        let lastX = 0,
          lastY = 0;
        let originalTransformOrigin = "";
        let vertexBeforeTransform: Array<any>;
        let currentVertex: Array<any>;

        let refPoint: { x: number; y: number };
        //slope
        let k1: number, k2: number;

        let startOx = 0;
        let startOy = 0;

        let sX = 0,
          sY = 0;

        //bind events
        onPointerStart(function (args: Record<string, any>) {
          const { ev } = args;
          handle.classList.add(CLASS_RESIZABLE_HANDLE_ACTIVE);

          if (ghost) {
            if (isFunction(ghost)) {
              ghostNode = ghost(panel);
            } else {
              ghostNode = panel.cloneNode(true) as HTMLElement;
              ghostNode.style.opacity = "0.3";
              ghostNode.style.pointerEvents = "none";
            }
            if (ghostNode) {
              if (ghostClass) {
                ghostNode.className =
                  ghostNode.className.replace(ghostClass, "") +
                  " " +
                  ghostClass;
              }
              panel.parentNode?.appendChild(ghostNode);
              transform = wrapper(ghostNode);

              onClone && onClone({ clone: ghostNode }, ev);
            }
            style = ghostNode?.style!;
          } else {
            transform = wrapper(panel);
          }

          const cStyle = window.getComputedStyle(panel);
          const w = parseFloat(cStyle.width);
          const h = parseFloat(cStyle.height);

          const oxy = parseOxy(opts.ox, opts.oy, w, h);
          startOx = oxy.originX;
          startOy = oxy.originY;

          const { x, y, sx, sy } =
            panel instanceof SVGGraphicsElement
              ? getCenterXySVG(panel, startOx, startOy)
              : getCenterXy(panel);
          let centerX = x,
            centerY = y;

          const deg = matrixInfo.angle * ONE_ANG;

            currentVertex =
            vertexBeforeTransform =
              calcVertex(originW, originH, centerX, centerY, sx, sy, deg);

          //计算参考点及斜率
          switch (dir) {
            case "s":
            case "e":
            case "se":
              refPoint = currentVertex[0];
              break;
            case "n":
            case "w":
            case "nw":
              refPoint = currentVertex[3];
              break;
            case "sw":
              refPoint = currentVertex[1];
              break;
            case "ne":
              refPoint = currentVertex[2];
              break;
          }

          //水平斜率
          k1 =
            (currentVertex[1].y - refPoint.y) /
            (currentVertex[1].x - refPoint.x); //w

          //change trans origin
          style.transition = "none";
          originalTransformOrigin = style.transformOrigin;

          if (setOrigin) {
            if (toTransformOrigin) {
              style.transformOrigin = toTransformOrigin;
            } else {
              style.transformOrigin = `${centerX - transform.x}px ${
                centerY - transform.y
              }px`;
            }
          }

          if (panel instanceof SVGGraphicsElement) {
            sX = matrixInfo.x - currentVertex[0].x;
            sY = matrixInfo.y - currentVertex[0].y;
          }

          onStart && onStart.call(uiik, { w: originW, h: originH ,transform }, ev);
        });
        onPointerMove((args: Record<string, any>) => {
          const { ev } = args;

          //获取当前位置坐标
          const currentXy = getPointInContainer(
            ev,
            container,
            offsetParentRect,
            offsetParentCStyle
          );
          let newX = currentXy.x;
          let newY = currentXy.y;

          ////////////////////////////////////////// 计算边长
          //1. calc angle
          let angle =
            Math.atan2(newY - refPoint.y, newX - refPoint.x) * ONE_RAD -
            matrixInfo.angle;

          //2. hypotenuse length
          let hyLen = Math.sqrt(
            (newX - refPoint.x) * (newX - refPoint.x) +
              (newY - refPoint.y) * (newY - refPoint.y)
          );

          //3. h&v projection length
          let pl1 = Math.abs(
            k1 === Infinity
              ? newY - refPoint.y
              : hyLen * Math.cos(angle * ONE_ANG)
          );
          let pl2 = Math.sqrt(hyLen * hyLen - pl1 * pl1);

          let w = originW;
          let h = originH;
          let y = originY;
          let x = originX;

          let angl = 0;
          switch (dir) {
            case "s":
              h = pl2;
              break;
            case "e":
              w = pl1;
              break;
            case "se":
              w = pl1;
              h = pl2;
              break;
            case "n":
              h = pl2;

              angl =
                Math.atan2(
                  currentVertex[0].y - currentVertex[2].y,
                  currentVertex[0].x - currentVertex[2].x
                ) * ONE_RAD;
              let plh;

              //1&2 quad
              if (angl === 90) {
                h = newY - currentVertex[2].y;
                x = currentVertex[2].x;
                y = newY;
              } else if (currentVertex[2].y > currentVertex[0].y) {
                plh = h * Math.cos(angl * ONE_ANG);
                x = currentVertex[2].x + plh;
                y = currentVertex[2].y - Math.sqrt(h * h - plh * plh);
              } else {
                plh = h * Math.cos((180 - angl) * ONE_ANG);
                x = currentVertex[2].x - plh;
                y = currentVertex[2].y + Math.sqrt(h * h - plh * plh);
              }

              break;
            case "w":
              w = pl1;
              angl =
                Math.atan2(
                  currentVertex[0].y - currentVertex[1].y,
                  currentVertex[0].x - currentVertex[1].x
                ) * ONE_RAD;
              let plw;

              //1&4 quad
              if (angl === 0) {
                w = newX - currentVertex[1].x;
                x = newX;
                y = currentVertex[1].y;
              } else if (currentVertex[1].y > currentVertex[0].y) {
                plw = w * Math.cos((180 - angl) * ONE_ANG);
                x = currentVertex[1].x - plw;
                y = currentVertex[1].y - Math.sqrt(w * w - plw * plw);
              } else {
                plw = w * Math.cos(angl * ONE_ANG);
                x = currentVertex[1].x + plw;
                y = currentVertex[1].y + Math.sqrt(w * w - plw * plw);
              }

              break;
            case "nw":
              w = pl1;
              h = pl2;

              //获取顺时针旋转后的直角坐标
              x = newX;
              y = newY;

              if (matrixInfo.angle === 180) {
                w = newX - currentVertex[3].x;
                h = newY - currentVertex[3].y;
              }
              break;
            case "sw":
              w = pl1;
              h = pl2;

              angl =
                Math.atan2(
                  currentVertex[0].y - currentVertex[1].y,
                  currentVertex[0].x - currentVertex[1].x
                ) * ONE_RAD;
              let plw1;

              //1&4 quad
              if (angl === 0) {
                x = newX;
                y = currentVertex[0].y;
              } else if (currentVertex[1].y > currentVertex[0].y) {
                plw1 = w * Math.cos((180 - angl) * ONE_ANG);
                x = currentVertex[1].x - plw1;
                y = currentVertex[1].y - Math.sqrt(w * w - plw1 * plw1);
              } else {
                plw1 = w * Math.cos((180 - angl) * ONE_ANG);
                x = currentVertex[1].x - plw1;
                y = currentVertex[1].y + Math.sqrt(w * w - plw1 * plw1);
              }

              break;
            case "ne":
              w = pl1;
              h = pl2;

              angl =
                Math.atan2(
                  currentVertex[0].y - currentVertex[2].y,
                  currentVertex[0].x - currentVertex[2].x
                ) * ONE_RAD;
              let plne;

              if (angl === 0) {
                x = newX;
                y = currentVertex[0].y;
              } else if (currentVertex[1].x > currentVertex[0].x) {
                //1&2 quad
                plne = h * Math.cos((180 - angl) * ONE_ANG);
                x = currentVertex[2].x - plne;
                y = currentVertex[2].y - Math.sqrt(h * h - plne * plne);
              } else {
                plne = h * Math.cos(angl * ONE_ANG);
                x = currentVertex[2].x + plne;
                y = currentVertex[2].y + Math.sqrt(h * h - plne * plne);
              }

              break;
          }

          if (changeW) {
            console.log(minWidth,'xxxxxx',w)
            if (minWidth && w < minWidth) w = minWidth;
            if (maxWidth && w > maxWidth) w = maxWidth;
          }
          if (changeH) {
            if (minHeight && h < minHeight) h = minHeight;
            if (maxHeight && h > maxHeight) h = maxHeight;
          }

          if (aspectRatio) {
            if (changeW) {
              style.width = w + "px";
              style.height = w / aspectRatio + "px";
            }

            if (changeH && dir !== "sw") {
              if (dir === "nw") {
                y = originY - w / aspectRatio + originH;
              } else {
                style.width = h * aspectRatio + "px";
                style.height = h + "px";
              }
            }
          } else {
            if (changeW) {
              resize(transform, style, w);
            }
            if (changeH) {
              resize(transform, style, undefined, h);
            }
          }
          if (changeY) {
            transform.moveToY(y + sY);
          }
          if (changeX) {
            transform.moveToX(x + sX);
          }

          lastX = x;
          lastY = y;

          currentW = w;
          currentH = h;

          if (onResize && onResize.call) {
            const { x, y, sx, sy } =
              panel instanceof SVGGraphicsElement
                ? getCenterXySVG(panel, startOx, startOy)
                : getCenterXy(panel);
            onResize.call(
              uiik,
              {
                w,
                h,
                ow: w - originW,
                oh: h - originH,
                target: panel,
                cx: x,
                cy: y,
                sx: sx,
                sy: sy,
                deg: matrixInfo.angle,
                transform
              },
              ev
            );
          }
        });
        onPointerEnd((args: Record<string, any>) => {
          const { ev } = args;
          if (ghost && ghostNode) {
            panel.parentNode?.contains(ghostNode) &&
              panel.parentNode?.removeChild(ghostNode);
            panelStyle.left = ghostNode.style.left;
            panelStyle.top = ghostNode.style.top;
            moveTo(panel, lastX / matrixInfo.scale, lastY / matrixInfo.scale);

            resize(
              transform,
              panelStyle,
              parseFloat(ghostNode.style.width),
              parseFloat(ghostNode.style.height)
            );
            // panelStyle.width = ghostNode.style.width;
            // panelStyle.height = ghostNode.style.height;
          }

          panel.style.transformOrigin = originalTransformOrigin;

          const { x, y, sx, sy, ox, oy } =
            panel instanceof SVGGraphicsElement
              ? getCenterXySVG(panel, startOx, startOy)
              : getCenterXy(panel);
          let centerX = x,
            centerY = y;
          const deg = matrixInfo.angle * ONE_ANG;

          const currentVertex = calcVertex(
            currentW,
            currentH,
            centerX,
            centerY,
            sx,
            sy,
            deg
          );

          //修正偏移
          if (panel instanceof SVGGraphicsElement) {
            //更新rotate圆心

            if (matrixInfo.angle != 0) {
              const oxy = parseOxy(
                opts.ox,
                opts.oy,
                currentW,
                currentH
              );

              rotateTo(transform.el, matrixInfo.angle, oxy.originX, originY);

              let { x, y, sx, sy } = getCenterXySVG(panel, oxy.originX, originY);

              let currentVertex2 = calcVertex(
                currentW,
                currentH,
                x,
                y,
                sx,
                sy,
                deg
              );
              //复原translate
              transform.moveTo(
                transform.x - (currentVertex2[0].x - currentVertex[0].x),
                transform.y - (currentVertex2[0].y - currentVertex[0].y)
              );
            }
          } else {
            if (changeX || changeY) {
              transform.moveTo(
                transform.x - (currentVertex[0].x - lastX),
                transform.y - (currentVertex[0].y - lastY)
              );
            } else {
              transform.moveTo(
                transform.x -
                  (currentVertex[0].x - vertexBeforeTransform[0].x),
                transform.y -
                  (currentVertex[0].y - vertexBeforeTransform[0].y)
              );
            }
          }

          handle.classList.remove(CLASS_RESIZABLE_HANDLE_ACTIVE);
          onEnd && onEnd.call(uiik, { w: currentW, h: currentH,transform }, ev);
        });
      },
      {
        threshold: THRESHOLD,
        lockPage: true,
      }
    );
  }

  initHandle(panel: HTMLElement) {
    const opts = this.opts;
    let handleStr = opts.handle;
    let handles: any;
    if (isString(handleStr)) {
      handles = document.querySelectorAll(handleStr);
    } else if (isFunction(handleStr)) {
      handles = handleStr(panel);
    }
    if (!handles) {
      console.error('Can not find handles with "' + panel.outerHTML + '"');
      return;
    }

    handles = isArrayLike(handles) ? handles : [handles];

    each(handles, (h: SVGStyleElement | HTMLStyleElement) => {
      //get dir from handle
      const className = h.getAttribute("class") || "";
      const matchRs = className.match(EXP_DIR);
      let dir = "se";
      if (matchRs) {
        dir = matchRs.groups!.dir;
      }

      h.classList.add(CLASS_RESIZABLE_HANDLE);

      this.bindHandle(h as any, dir, panel, opts);

      h.style.cursor = `${dir}-resize`;
      h.dataset.cursor = `${dir}-resize`;
      h.setAttribute("name", "handle");
    });
  }
}

function resize(
  transform: UiiTransform,
  style: CSSStyleDeclaration,
  w?: number,
  h?: number
) {
  //svg
  if (transform.el instanceof SVGGraphicsElement) {
    if (isDefined(w)) transform.el.setAttribute("width", w + "");
    if (isDefined(h)) transform.el.setAttribute("height", h + "");
  } else {
    if (isDefined(w)) style.width = w + "px";
    if (isDefined(h)) style.height = h + "px";
  }
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
  return new Resizable(els, opts);
}
