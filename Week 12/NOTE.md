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

### BFC (Block Fromating Context) 合并

#### Block

* Block Container: 里面有 BFC 的
  * 能容纳正常流的盒，里面就有 BFC，想想有哪些？
* Block-level Box: 外面有 BFC 的
* Bolck Box = Block Container + Block-level Box: 里面都有 BFC 的

#### Block Container

里面不是display模式的，里面一般是正常流

* block
* inline-block
* table-cell
* flex item
* grid cell
* table-caption

#### Block-level Box

| Block level | Inline level |
|-|-|
| display: block | display: inline-block |
| display: flex | display: inline-flex |
| display: table | display: inline-table |
| display: grid | display: inline-grid |
| ... | ... |
display: run-in: 跟着自己上一个元素来，一般不用

#### 设立 BFC

什么样的盒里面会创建 BFC

* floats
* absolutely positioned elements
* block container (such as inline-blocks, table-cell and table-containers) that are not block boxes,
  * flex items
  * grid cell
  * ...
* and block boxes with 'overflow' other than 'visible'

#### BFC 合并

默认能容纳正常流的盒,都认为可以创建 BFC

有一种例外，里外都是 BFC，并且 overflow 是 visible
* block box && overflow: visible 合并的影响:
  * BFC 合并与 float
  * BFC 合并与边距折叠

### Flex 排版

* 收集盒进行
  * 根据主轴尺寸，把元素分进行
  * 若设置了no-wrap,则强行分进第一行
* 计算盒在主轴方向的排布
  * 找出所有Flex元素
  * 把主轴方向的剩余尺寸分配给这些元素
  * 若剩余空间为负数，所有flex元素设置为0，等比压缩剩余元素
* 计算盒在交叉轴方向的排布
  * 计算交叉轴方向
  * 根据行高(最大元素的高度)flex-align(每个元素的属性)和item-align(外面容器的属性)，确定元素的位置

## CSS 动画与绘制

### 动画

#### Animation

* @keyframe 定义
* animation：使用

```css
@keyframes mykf
{
  from {background: red;}
  to {background:yellow}
}

div
{
  animation:mykf 5s infinite;
}
```

* animation-name 时间曲线
* animation-duration 动画的时长
* animation-timing-function 动画的时间取钱
* animation-delay 动画开始前的延迟
* animation-iteration-count 动画的播放次数
* animation-direction 动画的方向

#### Transition

```css
/* 用transaction可以让timing-functon不一样 */
@keyframes mykf {
  0%{top:0;transition:top ease}
  50%{top:30px;transition:top ease-in}
  75%{top:10px;transition:top ease-out}
  100%{top:0;transition:top linear}
}
```

* transition-property 要变换的属性
* transition-duration 变换的时长
* transition-timing-function 时间取钱
* transition-delay 延迟

#### cubic-bezier

### 颜色

#### CMYK 与 RGB

* RGB 三原色
  * red
  * green
  * blue
* CMYK 三原色的补色 加上 黑色
  * Cyan
  * magenta
  * yellow
  * black

#### HSL 与 HSV

* HSL (被W3C选用，有点：只改变Hue值，能保留颜色样式的情况下改变颜色)
  * Hue 色相
  * Saturation 纯度
  * Lightness 亮度 0%为黑色 100%为白色
* HSV
  * Hue
  * saturation
  * Value 0%为黑色 100%为纯色

### 绘制

* 几何图形
  * border
  * box-shadow
  * border-radius
* 文字
  * font
  * text-decoration
* 位图
  * background-image

#### 应用技巧

* data uri + svg