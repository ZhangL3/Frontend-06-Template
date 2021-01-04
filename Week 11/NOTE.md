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
        * <sp>
        * +
        * ~
      * simple_selector
        * type
        * *
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