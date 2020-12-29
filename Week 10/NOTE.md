# 学习笔记 Week 10

## 排版

### 第一步 根据浏览器属性进行排版

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

### 第二步 收集元素进行

* 分行
  * 根据主轴尺寸(元素尺寸超过主轴)，把元素分进行
  * 若设置了 no-wrap，则强行分配进第一行

```js
/**
            Main Axsis
        |- - - - - - - - - - >
        |^^^^^$$$$$$$$$^^^^$$$$$$$
Cross   |
Axis    |
        |
        v

=>

            Main Axsis
        |- - - - - - - - - - >
        |^^^^^$$$$$$$$$^^^^
Cross   |$$$$$$$
Axis    |
        |
        v

 * /
```
