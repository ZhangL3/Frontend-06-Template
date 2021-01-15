# 学习笔记 Week 11

## CSS 排版

### 盒 (Box)

|源代码|语义|表现|
|-|-|-|
|标签|元素|盒|
|Tag|Element|Box|

HTML代码中可以书写开始 标签 ，结束 标签 ，和自封闭 标签 。
一对起止 标签 ，表示一个 元素 。
DOM树中储存的是 元素 和其他类型的节点（Node），比如文本节点、注释节点。
CSS选择器中选的是 元素 或者伪元素。
CSS选择器中的 元素，可以生成多个 盒。
排版盒渲染的基本单位是 盒。

### 盒模型

```js
/*
box-sizing:
content-box, border-box

--------------------------
| margin                 |
| ------------border---- |
| | padding            | |
| |                    | |
| | xxxxxxxxxxxxxxxxxx | |
| | xxxxx content xxxx | |
| | xxxxxxxxxxxxxxxxxx | |
| | content-box: width | |
| |                    | |
| ---------------------- |
| border-box:width       |
|                        |
--------------------------
*/
```

### 正常流

* 三代排版

1. 正常流
2. flex
3. grid

排版的两个内容：盒和文字

#### 正常流排版

* 收集盒和文字进行
* 计算盒和文字在行中的排布
* 计算行的排布

inline-level-box (inline-formating-context IFC): 行内的盒

line-box：行盒

block-level-box (block-formating-context BFC): 块盒

### 正常流的行级排布

#### baseline

#### text

#### CSS 行模型

* line-top
* text-top
* base-line
* text-bottom
* line-bottom

![line-model] (linemodel.png)

行内盒的基线是随着自己里面的文字变化儿变化，多以不建议使用基线对齐。建议使用 vertical-align

### 正常流的块级排布

#### float 与 clear (浮动元素)

* float （浮动）
  * 先把元素排到一个该有的位置，然后把它向 float 的方向挤，受到影响(受元素高度)的其他内容排到它的后面，后一个 folat 收到前面的 float 影响
  * 不认 \</br>
  * 换行用 clear 属性
  * float:left 会出现重拍的问题，下一行的 div 影响了上一行的文字的位置
  * 不建议继续使用 float
* clear （找到一块干净的空间，执行 float 操作）

### 边距堆叠 (margin collapse)

* 只发生在 bfc 中
* 两个相连的 margin 会互相折叠，距离取值大的那个 margin
* margin 是说周围至少要有什么多的空白，不是说一定要留这么多位置，所以周围的边距够了，就不用执行自己了

