# 学习笔记 Week 8

## 浏览器显示 HTML 过程

URL =HTML=> HTML =parse=> DOM =css computin=> DOM with CSS =layout=> DOM with position =render=> Bitmap

## 有限状态机(finite-state machine)

* 每一个状态都是一个机器
  * 在每一个机器里，我们可以做计算，储存，输出。。。
  * 所有的这些机器接收的输入是一致的。要是 Number 就都是 Number
  * 状态机的每个机器本身没有状态，如果我们用函数来表示的话，他应该是纯函数（无副作用）
* 每一个机器知道下一个状态
  * 每个机器都有确定的下一个状态（Moore）
  * 每个状态机格局输入决定下一个状态（Mealy）