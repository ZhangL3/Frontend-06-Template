# 学习笔记 Week 9

## HTML 解析

### 第一步 拆分文件

* 为了方便文件管理，我们把 parser 单独拆到文件中
* parser 接收 HTML 文本作为参数，返回一颗 DOM 树

```js
// client.js
let dom = parser.parseHTML(response.body);
```

### 第二步 用 FMS 实现 HTML 分析

* 用 FMS 实现 HTML 分析
* 在 HTML 标准中，已经规定了 HTML 的状态
* Toy-Browser 只挑选其中一部分状态，完成一个最简版本

### 第三步 解析标签

* 主要的标签有：开始标签, 结束标签, 自封闭标签
* 在这一步暂时忽略了所有的属性

### 第四步 创建元素

* 在状态机中，除了状态迁移，我们还要加入业务逻辑 (创建 token，把字符添加倒 token 上，emit token)
* 在标签的结束状态提交标签 token

### 第五步 处理属性

* 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理 (见 htmlParser.drawio)
* 处理属性的方式跟标签类似
* 属性结束时，我们把属性添加到 Token 上

```js
token:  {
     "type": "startTag",
     "tagName": "html",
     "maaa": "a"
},
token:  {
     "type": "text",
     "content": "\n"
},
token:  {
     "type": "text",
     "content": "b"
}
token:  {
     "type": "startTag",
     "tagName": "img",
     "id": "myid",
     "isSelfClosing": true
},
token:  {
     "type": "endTag",
     "tagName": "html"
},
token:  {
     "type": "EOF"
}
```

### 第六步 用 token构建 DOM 树 （tree construction 第一步）

* 从标签构造 DOM 树的基本技巧就是使用栈
* 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
* 自封闭节点可视为入栈后立刻出栈
* 任何元素的父元素时它入栈前的栈顶

```js
// 栈
// 遇到 startTag 先构建 element 和 对偶关系, 等遇到对应 endTag 再出栈，最后只有整理好的 document 元素
[
    {
        type: 'document',
        children: [{ type: element, tagName: 'html'}]
    },
    {
        type: element,
        tagName: 'html',
        attributes:
            [
                { name: 'maaa', value: 'a' },
            ],
        children: [],
        parent: { type: document, ...},
    },
    ...
]
```

### 第七步 将文本节点加到 DOM 树

* 文本节点与自封闭标签的处理类似，不需要入栈出栈。遇到的新的就创建文本节点，并直接加入到栈顶的 children 中
* 连续的多个文本节点需要合并到文本节点的 content 中

## CSS 计算

### 第一步 收集 CSS 规则

* 遇到 style 标签时，把 CSS 规则保存起来
* 调用 CSS Parser 来分析 CSS 规则
* 必须自己研究词库分析 CSS 规则的格式

```js
// AST
{
    "type": "stylesheet",
    "stylesheet": {
        "rules": [
            {
                "type": "rule",
                "selectors": [
                    "body div #myid"
                ],
                "declarations": [
                    {
                        "type": "declaration",
                        "property": "width",
                        "value": "100px",
                        "position": {
                            "start": {
                                "line": 3,
                                "column": 3
                            },
                            "end": {
                                "line": 3,
                                "column": 14
                            }
                        }
                    },
                    {
                        "type": "declaration",
                        "property": "background-color",
                        "value": "#ff5000",
                        "position": {
                            "start": {
                                "line": 4,
                                "column": 3
                            },
                            "end": {
                                "line": 4,
                                "column": 28
                            }
                        }
                    }
                ],
                "position": {
                    "start": {
                        "line": 2,
                        "column": 1
                    },
                    "end": {
                        "line": 5,
                        "column": 2
                    }
                }
            },
            {
                "type": "rule",
                "selectors": [
                    "body div img"
                ],
                "declarations": [
                    {
                        "type": "declaration",
                        "property": "width",
                        "value": "30px",
                        "position": {
                            "start": {
                                "line": 7,
                                "column": 3
                            },
                            "end": {
                                "line": 7,
                                "column": 13
                            }
                        }
                    },
                    {
                        "type": "declaration",
                        "property": "background-color",
                        "value": "#ff1111",
                        "position": {
                            "start": {
                                "line": 8,
                                "column": 3
                            },
                            "end": {
                                "line": 8,
                                "column": 28
                            }
                        }
                    }
                ],
                "position": {
                    "start": {
                        "line": 6,
                        "column": 1
                    },
                    "end": {
                        "line": 9,
                        "column": 2
                    }
                }
            }
        ],
        "parsingErrors": []
    }
}
```

### 第二步 添加调用

* 当我们创建一个元素后，立即计算 CSS
* 理论上，当我们分析一个元素时，罗友 CSS 规则已经收集完毕
* 在真实浏览器中，可能遇到写在 body 的 style 标签，需要重新计算 CSS 的情况，这里我们忽略

### 第三步 获取父元素序列

* 在 computeCSS 函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
* 从上一个不走的 stack中，可一个获取本元素所有的父元素
* 因为我们首先获取的是 “当前元素”， 所以我们获得和计算父元素匹配的顺序是从内向外

```js
// div div #myid
elements = stack.slice().reverse();
```

### 第四步 选择器与元素的匹配

* 选择器也要从当前元素向外排列
* 复杂选择器拆成针对挡额元素的选择器，用循环匹配父元素队列

### 第五步 计算选择器与元素匹配

* 根绝选择器的类型和元素属性，计算是否与当前元素匹配
* 这里仅仅实现了三种基本选择器，实际的浏览器中要处理符合选择器

```js
/**
 * 刚入栈的元素，它要与 #myid 和 img 分别进行匹配
 * 如果匹配成功，element 和 selecotr 都向外层延申并尝试匹配
 * 如果匹配到最外城仍然成功，证明 element 和 selector 完全匹配
 */
```
