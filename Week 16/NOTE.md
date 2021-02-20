# 学习笔记 Week 16

## 手势动画应用

* 给 Carousel 添加 Gesture 和 Animation (Timeline)
* 处理 Gesture 和 Animation 的结合
  * 捡起播放中的图片
    * 手势介入时停掉动画，停掉准备下一张图片
    * 计算手势位移时减掉手势介入时动画已经造成的位置
  * 利用 pan 事件进行拖拽
  * 利用 end 事件处理手势结束后的事情
    * 手势结束后，要恢复 Timleline 和 nextPicture
    * 判断 isFlick，根据 velocity 处理滚动方向

## 为组件添加更多属性（一）

* 判断哪些变量可以被用户触及（优化变量的作用域）
* 判断哪些通用属性可以挪到 component 组件里
* 添加状态控制
  * 改造 position 到 STATE 上
* 给 carousel 添加 event 属性
  * onChange 返回 position （第几张图片）
  * onClick 导航到极客时间主页

## 为组件添加更多属性（二）

* 为组件添加 children 机制
  * children 的类型
    * 内容型 children: 放几个就有几个,以 button 为代表
    * 模板型 children, jsx 里通过在 children 里放一个函数来实现, 以 list 为代表

## Carousel 总结理解

见 './Carousel/uml.drawio'