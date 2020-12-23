# 学习笔记 Week 9

## 第一步 拆分文件

* 为了方便文件管理，我们把 parser 单独拆到文件中
* parser 接收 HTML 文本作为参数，返回一颗 DOM 树

```js
// client.js
let dom = parser.parseHTML(response.body);
```

## 第二步 用 FMS 实现 HTML 分析

* 用 FMS 实现 HTML 分析
* 在 HTML 标准中，已经规定了 HTML 的状态
* Toy-Browser 只挑选其中一部分状态，完成一个最简版本

## 第三步 解析标签

* 主要的标签有：开始标签, 结束标签, 自封闭标签
* 在这一步暂时忽略了所有的属性

## 第四步 创建元素

* 在状态机中，除了状态迁移，我们还要加入业务逻辑 (创建 token，把字符添加倒 token 上，emit token)
* 在标签的结束状态提交标签 token

## 第五步 处理属性

* 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
* 处理属性的方式跟标签类似
* 属性结束时，我们把属性添加倒 Token 上
