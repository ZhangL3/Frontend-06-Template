# 学习笔记 Week 11

## CSS 总论

### CSS 语法的研究

#### CSS 总体结构

规则结构：

* @charset (normally same as html like utf-8)
* @import
* rules
  * @media (responsive)
  * @page (print)
  * rule

CSS 知识结构:

* CSS
  * at-rules
    * @charset
    * @import
    * @media
    * @page
  * rule
    * Selector
      * selector_group
      * selector
        * >
        * \<sp>
        * \+
        * ~
      * simple_selector
        * type
        * \*
        * .
        * \#
        * [] 属性
        * : 伪类
        * :: 伪元素
        * :not()
    * Declaration
      * Key
        * variables
        * properties
      * Value
        * calc
        * number
        * length
        * ...

### CSS @规则的研究

* @chartset
* @import
* @media
* @page 打印分页
* @counter-style 列表前的小黑点
* @keyframes 动画
* @fontface 字体，iconfont
* @supports 检查 CSS 某些功能是否存在，不建议用来检查兼容性
* @namespace 命名空间，完备性考量

### CSS 规则的结构

* 选择器
* 声明
  * Key
    * Properties
    * Variables
  * Value

```css
div {
  background-color: blue;
}
```

### 收集标准

```js
// 从 https://www.w3.org/TR/?tag=css 抓取 CSS 标准
JSON.stringify(Array.prototype.slice.call(
  document.querySelector("#container").children
)
.filter(e => e.getAttribute("data-tag")
.match(/css/)).map(e => ({name:e.children[1].innerText, url:e.children[1].children[0].href})))
```

### 总结

* CSS 语法
* at-rule
* selector
* variables
* value
* 实验 (收集标准)

## CSS 选择器

### 选择器语法

* 简单选择器
  * \* 通用选择器，选中任何的元素
  * div svg|a (type selector) 选的是 tagName 属性
    * CSS 的命名空间
      * HTML
      * SVG
      * MathML
    * | 命名空间分隔符 (HTML 中的为 :)
  * .cls class 选择器 (可以用空格作分隔符,选中一个就匹配)
  * #id id 选择器 (严格匹配)
  * [attr=value] 属性选择器
  * :hover 伪类选择器 (元素特殊的状态)
  * ::before 伪元素选择器 (选中原本不存在的元素)
* 复合选择器 combined selector
  * <简单选择器><简单选择器><简单选择器> (与的关系)
  * \* 或者 div 必须写在最前面
* 复杂选择器
  * <复合选择器>\<sp><符合选择器> 子孙选择器 (左边必须得是右边的父级或祖先)
  * <复合选择器>">"<符合选择器> 父子选择器 选择所有右边的元素，其父元素为左边的元素
  * <复合选择器>"~"<符合选择器> 选择每一个右边元素，其前一个是左边的元素
  * <复合选择器>"+"<符合选择器> 选择第一个右边元素，其前一个元素是左边的元素
  * <复合选择器>"||"<符合选择器> 选择表格中右边的元素，其属于左边的元素

### 选择器的优先级

* 简单选择器计数 (specificity 特殊性)
  * id 选择器: [0, 1, 0, 0]
  * 类选择器，属性选择器和伪类: [0, 0, 1, 0]
  * 元素和伪元素: [0, 0, 0, 1]
  * 通配选择器: [0, 0, 0, 0]
  * inline sytle [1, 0, 0, 0]
  * !important: [1, 0, 0, 0, 0]

```css
#id div.a#id {
  /* ... */
}

/*
优先级是 [0, 2, 1, 1]
S = 0 * N ^ 3 + 2 * N ^ 2 + 1 * N ^ 1 + 1 * N ^ 1
取 N = 1000000
S = 2000001000001
*/

div#a.b .c[id=x] {
  /* [0, 1, 3, 1] */
}

#a:not(#b) {
  /* [0, 2, 1, 0] X => [0, 2, 0, 0] */
  /* :not() 是特殊的伪类，不改变特殊性*/
}

*.a {
  /* [0, 0, 1, 0] */
}

div.a {
  /* [0, 0, 1, 1] */
}
```