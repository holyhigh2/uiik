# Changelog
## [1.5.0] - 2026/10/3
### 新增
- Geometry 几何操作
  - alignRects/distributeRects 一组矩形的对齐与等间距分布
  - resizeRect 缩放求解（8方向、尺寸约束、等比、网格吸附）
  - fitRectInViewport/zoomAt/panBy 相机换算
  - findSnap/snapGuides 元素吸附求解与参考线
- Draggable snap 支持元素、元素数组、返回元素数组的函数
- Draggable snapOptions 新增 toleranceY/points/strategy/container
- Draggable onSnap 新增 dx/dy，便于位移由外部自行控制时跟随吸附
### 修复
- Draggable 吸附及拖动问题

## [1.3.4] - 2025/8/24
### 修复
- Sortable filter数据后spill表现异常

## [1.3.2] - 2024/4/6
### 修复
- Splittable handle嵌入模式下，无法准确识别拖动主体的问题
### 新增
- Draggable & Splittable ghostTo参数

## [1.3.1] - 2024/1/7
### 优化
- draggable/resizable/rotatable/selectable 性能提升
- 对SVG的支持
### 新增
- Draggable useTransform参数，可使用left/top方式进行拖动

## [1.3.0] - 2023/10/4 ⚠️BreakChange
### 优化
- 重构 draggable/resizable/rotatable/selectable，支持transform变形后的操作识别
- 重新设计的事件框架，优化执行流
### 新增
- handle 属性变更，支持更多类型
- onPointerDown 事件，可用于阻止后续逻辑
- Draggable watch参数，可用于dom变动自动检测
- Draggable self参数，仅自身元素响应时触发
- Droppable watch参数，可用于dom变动自动检测
- Uiik mouseButton参数，可指定鼠标响应按钮
### 修复
- Droppable 元素同时为Draggable时会自己触发Droppable事件

## [1.2.0] - 2023/9/3
### Add
- SVG support —— draggable/resizable/selectable/rotatable

## [1.1.0] - 2023/6/6 ⚠️BreakChange
### Add
- Sortable
### Optimize
- Unified events params to {data,ev}
- Modularity
### Change
- Switch the func-lib to myfx