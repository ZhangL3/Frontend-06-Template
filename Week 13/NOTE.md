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

#### 节点 API

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