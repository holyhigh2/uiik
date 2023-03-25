![npm](https://img.shields.io/npm/v/uii?style=plastic)
![NPM](https://img.shields.io/npm/l/uii)

# Uii
一个UI交互库，提供了可拖动、可分隔、可旋转、可选择等交互控制
> 中文 | [English](./README.md)

- [📑 文档](https://holyhigh2.github.io/uii/)
- [⚡ 在线体验](https://stackblitz.com/edit/func-js?file=index.ts)

## 特性
- Draggable/Droppable/Splittable/rotatable/selectable/Resizable
- 可定制的CSS接口，如'uii-draggable-handle', 'uii-splittable-handle'...
- 丰富的配置选项

## 快速上手
1. 安装
```sh
npm i uii
```
2. 导入
```ts
import uii from 'uii'
//or
import {newSplittable} from 'uii'
//or
import {Splittable} from 'uii'
//or
import uii from 'https://cdn.skypack.dev/uii'
```

## 开发
1. 使用 `test` 执行jest测试 
2. 使用 `build` 进行打包
3. 使用 `doc` 生成tsdoc