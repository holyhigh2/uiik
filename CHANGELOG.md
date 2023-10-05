# Changelog

## [1.3.0] - 2023/10/4 ⚠️BreakChange
### 优化
- 重构 draggable/resizable/rotatable/selectable，支持transform变形后的操作识别
- 重新设计的事件框架，优化执行流
### 新增
- handle 属性变更，支持更多类型
- onPointerDown 事件，可用于阻止后续逻辑
- draggable watch参数，可用于dom变动自动检测 

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