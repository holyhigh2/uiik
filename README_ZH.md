![npm](https://img.shields.io/npm/v/uiik?style=plastic)
![NPM](https://img.shields.io/npm/l/uiik)
![types](https://img.shields.io/npm/types/uiik)
![license](https://img.shields.io/npm/l/uiik)

# uiik

一个 UI 交互工具库 —— 可拖动、可投放、可缩放、可旋转、可分隔、可框选、可排序，以及它们底层依赖的几何与测量工具。HTML 与 SVG 共用同一套选项和同一套 CSS 接口。

- [📑 文档](https://uiik.pages.dev/)

## 特性

- **交互** —— `newDraggable` `newDroppable` `newResizable` `newRotatable` `newSplittable` `newSelectable` `newSortable` `newCollisionDetector`
- **丰富的配置项** —— 仅 `Draggable` 就有 30 个选项：containment、ghost、group、snap、grid、axis、scroll、各类回调……
- **几何工具** —— `alignRects` `distributeRects` `snapGuides` `findSnap` `fitRectInViewport` `zoomAt` `panBy`……
- **测量工具** —— `getRectInContainer` `getVertex` `getMatrixInfo` `getScrollParent`…… 23 个函数，HTML 与 SVG 通用
- **变换** —— `wrapper()` 返回 `UiiTransform`，屏蔽 HTML 与 SVG 在 `transform` 上的差异
- **可定制的 CSS 接口** —— `uii-draggable-handle`、`uii-splittable-handle`、`uii-selector`……
- **SVG 支持** —— 同一套 API 既能驱动 `<div>` 也能驱动 `<g>`

## 快速上手

```sh
npm i uiik
```

```ts
import { newDraggable } from 'uiik'

newDraggable('.card', {
  containment: '#stage',
  ghost: true,
  grid: 8,
  onEnd({ target }) {
    console.log(target.dataset.id)
  },
})
```

`els` 接受选择器、元素，或二者的数组；`opts` 在所有交互里都是可选的。

### 配置项

每个交互都接受一个带合理默认值的配置对象，且每个配置项都可省略：

```ts
newDraggable('.card', {
  threshold: 3,        // 触发拖动所需的位移（px）
  containment: '#stage',// 限制在这个元素内活动
  ghost: true,         // 拖动副本，松手后归位
  handle: '.grip',     // 只能从这里拖
  filter: '.no-drag',  // 从这里开始的拖动忽略
  grid: 8,             // 约束到 8px 网格
  snap: '.card',       // 吸附到这些目标
  snapOptions: { tolerance: 10 },
  group: 'cards',      // 同组容器之间可互相拖动
  scroll: true,        // 靠近边缘时自动滚动
  onStart: ({ target }) => {}, // 还有 onDrag / onEnd / onClone / onSnap
})
```

### 按模块导入

每个源模块都会单独发布，可以只引入需要的那部分。子路径是隔离的 —— `uiik/sortable` 不会暴露几何工具：

```ts
import { newSortable } from 'uiik/sortable'
import { newDraggable } from 'uiik/draggable'
import { findSnap } from 'uiik/geometry'
```

| 子路径 | 导出 |
| --- | --- |
| `uiik/sortable` | `Sortable` `newSortable` |
| `uiik/draggable` | `Draggable` `newDraggable` |
| `uiik/droppable` | `Droppable` `newDroppable` |
| `uiik/resizable` | `Resizable` `newResizable` |
| `uiik/rotatable` | `Rotatable` `newRotatable` |
| `uiik/selectable` | `Selectable` `newSelectable` |
| `uiik/splittable` | `Splittable` `newSplittable` |
| `uiik/detector` | `CollisionDetector` `newCollisionDetector` |
| `uiik/geometry` | `alignRects` `distributeRects` `findSnap` `snapGuides` `snapToGrid` `zoomAt` `panBy`…… |
| `uiik/utils` | `getBox` `getRectInContainer` `getVertex` `getScrollParent`…… |
| `uiik/transform` | `wrapper` `moveTo` `rotateTo` `getTranslate`…… |
| `uiik/types` | `Uii` `UII_KEY` |

根入口再导出全部内容，另外还有 `default` 导出与 `VERSION`。

### HTML 与 SVG

`wrapper()` 让 transform 的调用方式与元素类型无关：

```ts
import { wrapper } from 'uiik'

const t = wrapper(svgGroup)   // 也可以是 HTMLElement，调用方式完全相同
t.moveTo(100, 50)
t.rotateTo(15)
```

## API 全貌

共 70 个导出，分六组：

| 分组 | 数量 | 代表 |
| --- | --- | --- |
| 交互 | 8 | 各个 `newXxx` 工厂函数 |
| 类 | 10 | 基类 `Uii` + 每个交互一个 + `UiiTransform` |
| 几何 | 16 | `alignRects` `distributeRects` `snapGuides` `zoomAt` `panBy` |
| 变换 | 6 | `wrapper` `moveTo` `moveBy` `rotateTo` `getTranslate` |
| 测量 | 23 | `getRectInContainer` `getVertex` `getScrollParent` `isVisible` |
| 常量 | 7 | `THRESHOLD` `EDGE_THRESHOLD` `ONE_ANG` `VERSION` |

完整签名见[文档](https://holyhigh2.github.io/uiik/)。

### CSS 接口

直接给这些自动生成的元素写样式即可：

`uii-draggable` `uii-draggable-active` `uii-draggable-handle` `uii-draggable-ghost`
`uii-droppable` `uii-resizable-handle` `uii-resizable-handle-active` `uii-resizable-ghost`
`uii-rotatable` `uii-rotatable-handle` `uii-rotatable-active`
`uii-splittable` `uii-splittable-h` `uii-splittable-v` `uii-splittable-handle` `uii-splittable-handle-ghost`
`uii-sortable-container` `uii-sortable-active` `uii-sortable-ghost`
`uii-selecting` `uii-selected` `uii-selector`

缩放手柄按方向带后缀：`uii-resizable-handle-n`、`-e`、`-s`、`-w` 等。

## 注意事项

1. **在定位父元素内拖动。** 光标位置基于 `offsetParent` 计算。若可拖动元素的 `offsetParent` 不是它的 `parentNode`，且中间元素引入了边距，光标会与元素发生偏移。
2. **`scroll` 需要显式开启。** `draggable`、`selectable`、`sortable` 的 `scroll` 默认为 `false`，这样拖动不会带动页面滚动，除非你主动开启。

## 开发

| 脚本 | 作用 |
| --- | --- |
| `npm run build` | 一次产出完整的可发布包到 `dist/`：`index.js` 与 `uiik.min.js`（UMD）、按模块的 ESM、类型声明 |
| `npm run test:unit` | 运行单元测试（`node --test`） |
| `npm run doc` | 根据 TSDoc 生成 markdown 文档 |

## License

MIT
