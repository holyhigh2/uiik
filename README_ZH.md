![npm](https://img.shields.io/npm/v/uiik?style=plastic)
![NPM](https://img.shields.io/npm/l/uiik)

# Uiik
一个UI交互工具库，提供了可拖动、可分隔、可旋转、可选择等交互控制
> 中文 | [English](./README.md)

- [📑 文档](https://holyhigh2.github.io/uiik/)
- [⚡ 在线体验](https://stackblitz.com/edit/uiik)

## 特性
- Draggable/Droppable/Splittable/rotatable/selectable/Resizable
- 可定制的CSS接口，如'uii-draggable-handle', 'uii-splittable-handle'...
- 丰富的配置选项

## 快速上手
1. 安装
```sh
npm i uiik
```
2. 导入
```ts
import uiik from 'uiik'
//or
import {newSplittable} from 'uiik'
//or
import {Splittable} from 'uiik'
//or
import uiik from 'https://cdn.skypack.dev/uiik'
```
3. 导入模块
```ts
import {newSplittable} from 'uiik/splittable'
//or
import {newSortable} from 'uiik/sortable'
```

## 开发
1. 使用 `test` 执行jest测试 
2. 使用 `build` 进行打包
3. 使用 `doc` 生成tsdoc