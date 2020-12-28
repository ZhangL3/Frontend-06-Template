# 学习笔记 Week 10

## 排版

### 根据浏览器属性进行排版

* 预处理
* 处理掉了 flexDirection 和 wrap 相关的属性
* 把具体的 width，height，left，right，top，bottom 等属性抽象成 main，cross 相关的属性


#### flex

CSS 三代排版技术：

* 正常流
  * position
  * display
  * float
  * ...
* Flex
* Grid
* Houdini

```js
/**
            Main Axsis
        |- - - - - - - - - - >
        |
Cross   |
Axis    |
        |
        v
            flex-direction: row
            Main: width x left right
            Cross: height y top
            bottom


            Cross Axsis
        |- - - - - - - - - - >
        |
Main    |
Axis    |
        |
        v
            flex-direction: column
            Main: height y top
            bottom
            Cross: width x left right
 * /

```