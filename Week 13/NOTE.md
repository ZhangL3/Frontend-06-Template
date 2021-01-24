# 学习笔记 Week13

## 重学 HTML

### HTML 的定义：XML 与 SGML

#### DTD (Document Type Definition) 与 XML namespace

##### DTD

| Charactor(s) | Alphanumeric value(s) | Unicode valueI(s) | 备注 |
| - | - | - | - |
| non-breaking space | \&nbsp; | \&#160; | 不要用 |
| &#lambda; | \&lambda; | \&#955 | |
| &quot; | \&quot; | \&#34; | important |
| &amp; | \&amp; | \&#38; | important |
| &lt; | \&lt; | \&#60 | important |
| &gt; | \&gt; | \&#62 | important |

##### XML namespace

除了 XHTML 的 namespace 还有 MathML 和 SVG 两个 namespace

## HTML 标签语义

## HTML 语法

### 合法元素

* Element: \<tagname>...\</tagname>
* Text: text
* Comment: \<!-- comments -->
* DocumentType: \<!DocType html>
* ProcessingInstruction: \<?a 1?>
* CDATA: \<![CDATA[ ]]>

### 字符引用语法

* &#161; : \&#161;
* &amp; : \&amp;
* &lt; : \&lt;
* &quot; : \&quot;

## 浏览器 API

### DOM API

* traversal API (不推荐使用)
* 节点部分 API
* 事件部分 API
* Range API (能更精确的操作 DOM 树，性能更好)

##### 节点 API

* Node
  * Element: 元素节点，跟标签对应
    * HTMLElement
      * HTMLAnchorElement
      * HTMLBodyElement
      * ...
    * SVGElement
      * SVGAElement
      * SVGAltGlyphElement
  * Document: 文本跟节点
  * CharacterData: 字符数据
    * Text: 文本节点
      * CDATASection: CDATA 节点
    * Comment: 注释
    * ProcessingInstruction: 处理信息
  * DocumentFragment: 文档片段
  * DocumentType: 文档类型

##### 导航类操作

* 节点导航
  * parentNode
  * childNodes
  * firstChild
  * lastChild
  * nextSibling
  * previousSibling
* 元素导航
  * parentElement
  * children
  * firstElementChild
  * lastElementChild
  * nextElementChild
  * prevousElementSibling

##### 修改操作

* appendChild
* insertBefore
* removeChild
* replaceChild

##### 高级操作

* compareDocumentPosition 是一个用于比较两个节点中关系的函数
* contains 检查一个节点是否包含另一个节点的函数
* isEqualNode 检查两个节点是否完全相同
* isSameNode 检查两个节点是否是同一个节点，实际上在 JS 中可以用 “===”
* cloneNode 复制一个节点，如果传入参数 true， 则会联通子元素做深拷贝

#### 事件 API

* addEventListner(type, listener [, options]);
  * options:
    * capture: 捕获模式 | 冒泡模式 （默认）
    * once: 执行一次
    * passive: if true never call preventDefault(), 移动端浏览器默认为 fasle

##### 冒泡于不捕获

监听与否都有冒泡与捕获

捕获：计算事件到底发生在哪个元素上
冒泡：层层向外取触发，然后让元素响应事件的过程

#### Range API

操作半个节点或者批量处理节点

##### 一个问题

* 把一个元素所有的子元素逆序

  1, 2, 3, 4, 5 -> 5, 4, 3, 2, 1

  * DOM 的 collection 时 living collection
  * 元素的子元素在 insert 的时候时不需要把元素从原来的元素挪掉的,因为DOM操作会先remove掉原来位置的元素
  * 完美答案：使用 Range API 进行高效操作
  
##### 例子

* var range = new Range()
* range.setStart(element, 9)
* range.setEnd(element, 4)
* var range = document.getSelection().getRangeAt(0); // 支持鼠标选中选择

不受 element 层级影响，可以选半个 element

##### Range API

* range.setStartBefore
* range.setEndBefore
* range.setStartAfter
* range.setEndAfter
* range.selectNode // 选中一个元素
* range.selectNodeContents // 选中一个元素的所有的内容
* var fragment = range.extractContents() // 把选取的内容从 DOM 树上摘下来,提取下来的是 fragment 对象（Node 的子类）。它被 append 的时候，自己不会被 append 到 DOM 树上，只是它所有的子节点会被 append 到 DOM 树上
* range.insertNode(document.createTextNode("aaaa")) // 在 range 的位置插入一个节点

range 上可以执行 Element 的方法

### CSSOM

#### document.styleSheets

* document.styleSheets
* 案例

#### Rules

* document.styleSheet[0].cssRules
* document.styleSheet[0].insertRule("p {color:pink;}", 0) // 0 为位置,插入的是个字符串，不是对象
* document.styleSheet[0].removeRule(0)

#### Rule

* CSSStyleRule
  * selectorText String
  * style K-V 结构
* CSSCharsetRule
* CSSImportRule
* CSSMediaRule
* CSSFontFaceRule
* CSSPageRule
* CSSNamespaceRule
* CSSKeyframesRule
* CSSKeyframeRule
* CSSSupportsRule
* ...

#### getComputedStyle

* window.getComputedStyle(elt, psuedoElt);
  * elt 想要获取的元素
  * pseudoElt 可选，伪元素
