/* eslint-disable max-len */
/**
 * dom resizer
 * @author holyhigh2
 */
import { each, map } from "myfx/collection";
import { assign } from "myfx/object";
import { isArray, isArrayLike, isFunction, isNumber, isString } from "myfx/is";
import { ResizableOptions, Uii } from "./types";
import {
  ONE_ANG,
  ONE_RAD,
  getCenterXy,
  getMatrixInfo,
  getPointInContainer,
  getRectInContainer,
} from "./utils";
import { UiiTransformer, moveTo, wrapper } from "./transform";

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
        if (onPointerDown && onPointerDown(ev) === false) return;

        // 获取panel当前信息

        let matrixInfo = getMatrixInfo(panel);
        const offset = getRectInContainer(panel, panel.parentElement!);
        const offsetParentRect = panel.parentElement!.getBoundingClientRect();
        const offsetParentCStyle = window.getComputedStyle(
          panel.parentElement!
        );
        const panelCStyle = window.getComputedStyle(panel);

        const originW = parseFloat(panelCStyle.width);
        const originH = parseFloat(panelCStyle.height);
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

        let transformer: UiiTransformer;

        let lastX = 0,
          lastY = 0;
        let originalTransformOrigin = "";
        let originVertex: Array<any>;
        let vertexBeforeTransform: Array<any>;
        let currentVertex: Array<any>;

        let refPoint: { x: number; y: number };
        //slope 
        let k1: number, k2: number;

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
              transformer = wrapper(ghostNode);

              onClone && onClone({ clone: ghostNode }, ev);
            }
            style = ghostNode?.style!;
          } else {
            transformer = wrapper(panel);
          }

          const { x, y, sx, sy } = getCenterXy(panel);
          let centerX = x,
            centerY = y;

          const deg = matrixInfo.angle * ONE_ANG;
          originVertex = [
            { x: 0, y: 0 },
            { x: originW, y: 0 },
            { x: 0, y: originH },
            { x: originW, y: originH },
          ];

          currentVertex = vertexBeforeTransform = map(
            originVertex,
            ({ x, y }) => {
              const nx =
                (x - centerX + sx) * Math.cos(deg) -
                (y - centerY + sy) * Math.sin(deg);
              const ny =
                (x - centerX + sx) * Math.sin(deg) +
                (y - centerY + sy) * Math.cos(deg);
              return { x: centerX + nx, y: centerY + ny };
            }
          );

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

          if (toTransformOrigin) {
            style.transformOrigin = toTransformOrigin;
          } else {
            style.transformOrigin = `${centerX - transformer.x}px ${
              centerY - transformer.y
            }px`;
          }

          onStart && onStart.call(uiik, { w: originW, h: originH }, ev);
        });
        onPointerMove((args: Record<string, any>) => {
          const { ev } = args;

          //获取当前位置坐标
          const currentXy = getPointInContainer(
            ev,
            panel.parentElement as any,
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
              style.width = w + "px";
            }
            if (changeH) {
              style.height = h + "px";
            }
          }

          if (changeY) {
            transformer.moveToY(y);
          }
          if (changeX) {
            transformer.moveToX(x);
          }

          lastX = x;
          lastY = y;

          currentW = w;
          currentH = h;

          onResize &&
            onResize.call(uiik, { w, h, ow: w - originW, oh: h - originH }, ev);
        });
        onPointerEnd((args: Record<string, any>) => {
          const { ev } = args;
          if (ghost && ghostNode) {
            panel.parentNode?.contains(ghostNode) &&
              panel.parentNode?.removeChild(ghostNode);
            panelStyle.left = ghostNode.style.left;
            panelStyle.top = ghostNode.style.top;
            moveTo(panel, lastX / matrixInfo.scale, lastY / matrixInfo.scale);
            panelStyle.width = ghostNode.style.width;
            panelStyle.height = ghostNode.style.height;
          }

          panel.style.transformOrigin = originalTransformOrigin;

          const { x, y, sx, sy } = getCenterXy(panel);
          let centerX = x,
            centerY = y;
          const deg = matrixInfo.angle * ONE_ANG;
          const currentVertex = map(originVertex, ({ x, y }) => {
            const nx =
              (x - centerX + sx) * Math.cos(deg) -
              (y - centerY + sy) * Math.sin(deg);
            const ny =
              (x - centerX + sx) * Math.sin(deg) +
              (y - centerY + sy) * Math.cos(deg);
            return { x: centerX + nx, y: centerY + ny };
          });

          //修正偏移
          if (changeX || changeY) {
            transformer.moveTo(
              transformer.x - (currentVertex[0].x - lastX),
              transformer.y - (currentVertex[0].y - lastY)
            );
          } else {
            transformer.moveTo(
              transformer.x - (currentVertex[0].x - vertexBeforeTransform[0].x),
              transformer.y - (currentVertex[0].y - vertexBeforeTransform[0].y)
            );
          }

          handle.classList.remove(CLASS_RESIZABLE_HANDLE_ACTIVE);
          onEnd && onEnd.call(uiik, { w: currentW, h: currentH }, ev);
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
