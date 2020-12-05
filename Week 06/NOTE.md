# 学习笔记 Week 6

## Number

### 运行时

JS 中的 Number 是 double float (IEEE 754)
64 bit = 1 sign + 11 exponent + 52 fraction

十进制表示小数 0.789 = 789 * 10 ^ -3

二进制表示小数 0.101 = 101 * 2 ^ -3

minifloat (8 bit) 为例作为理解

因为在 exponent 上要表示正数(小数点向右移动)和负数(小数点向左移动)，所以要有一个固定的值作为基准，小于这个值则为负数，大于这个值为正数，这个值一般为 e 的第一位为 1，后面为 0, 再减 1，8 bit 中就是 1000 - 1 (8 - 1), 即为7。所以真正的 exoponent 值为 e 的值减去 7

在 e 和 f 之间，还有一个隐藏位，这个位上的值永远为 1，因为纯小数的 f 部分必须以 1 开始，这样不会浪费空间

例 1；

|s|e|e|e|e|f|f|f|
|-|-|-|-|-|-|-|-|
|0|*1*|*0*|*1*|*1*|**0**|**1**|**1**|

=> \+ **1011** * 2 ^ (*1011* - 7)

=> **1011** * 2 ^ ( 11 - 7)

=> **1011** * 2 ^ 4

=> **10110000**

=> 176

例 2:

|s|e|e|e|e|f|f|f|
|-|-|-|-|-|-|-|-|
|1|*0*|*0*|*1*|*1*|**0**|**1**|**1**|

=> \- **1011** * 2 ^ (*0011* - 7)

=> \- **1011** * 2 ^ (3 - 7)

=> \- **1011** * 2 ^ -4

=> \- **0.1011**

=> \- 0.6875

### 语法

因为 0.2 === .2
0.toString() 会报错，以为 .toString() 会被当作小数部分处理，正确写法为 0. toString()

## String

### 运行时

1. Character

    抽象的概念，结合字体才能显示

2. Code Point

    数字表示 Character

3. Encoding

    ASCII (0 - 127) -> Unicode (000 - FFF)

    #### UTF-8 & UTF-16

    中文 "一" 的 UTF-16 编码为 11100100 10111000 10000000

    |**i**|**i**|**i**|**i**|c|c|c|c||**i**|**i**|c|c|c|c|c|c||**i**|**i**|c|c|c|c|c|c|
    |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
    |**1**|**1**|**1**|**0**|0|1|0|0||**1**|**0**|1|1|1|0|0|0||**1**|**0**|0|0|0|0|0|0|

    **i** 为标识符，第一个 byte 里的 **1** **1** **1** **0** 表示这个字符占了 3 个 byte，算上自己，还包括后面两个
    
    **c** 为 code 的值

    ### 语法

    #### ' & "

    bfnrtv 转义的特殊符号 2028 2029 /x /u 转义规则

    ### `

    实际上被分为三组字面量
    * `ab${

    * }abc${
        
    * }abc`

## Object

### Definition

    Object
    /   |   \
    identifier state    behavior

### Description

#### Class

归类：多继承
分类：单继承

#### Prototype

### 设计原则

在设计对象的状态和行为时，我们总是遵循“行为改变状态”的原则

### 原型链

JS 对象里有属性和 prototype。

行为（函数）可以作为属性被定义，所以被归类在属性里。

如果在自己的属性里找不到某个属性，就会向上层 [[prototype]] 里查找，直到 nihilo (null)

### 属性

key value 对。

key 可以是 String 或者 Symbol。可以通过 Symbol 控制属性的访问权限

value 有两种， Data Property 和 Accessor Property

Data Property 的 attributes: [[value]], writable, enumerable, configuarable.

Accessor Property 的 attributes: get, set, enumerable, configuarable.

property 的 attributes 可通过 defineProperty 更改

### API / Grammer

1. 基本的对象机制：创建对象，访问属性，定义新属性, 改变属性特征值(attributes)
    
    {} / . / [] / Object.defineProperty

2. 基于 Prototy 描述对象的方法

    Object.create / Object.setPrototypeOf /Object.getPrototypeOf

3. 基于分类的方式去描述对象 (区别于归类) ，运行时会被转换为基于 prototype 的对象

    new / class / extends

4. 历史包袱，建议不用

    new / function / proptotype

### Function Object (Object [[call]])

type of function // funktion

带 call 方法的 object, [[]] 标注的为对象内置行为，通过任何 JS 代码都无法访问

### Special Object

* Array [[length]
* Object.prototype [[setPrototypeOf]]
* ...

### Host Object (window, global)

规范中没有规定的对象，但在环境中(browser, node)定义了的

Object [[call]] [[construct]]



    