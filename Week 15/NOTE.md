# 学习笔记 Week 15
## 手势与动画

### 初步创建动画和时间线

#### JS 处理帧的三种方法

```js
// 1. 不太可控，如果tick写的不好，可能挤压
setInterval(() => {}, 16);

// 2. 不太可控，如果tick写的不好，可能挤压
let tick = () => {
  // 执行动画
  setTimeout(() => {}, 16)
};

// 3. 推荐方法
let tick = () => {
  // 和浏览器帧数相关
  let handler  = requestAnimationFrame(tick);
  cancelAnimationFrame(handler);
}
```
#### Timeline 的结构

```js
export class Timeline {
  constructor() {

  }

  start() {

  }

  // 播放速率
  set rate() {

  }
  get rate() {

  }

  pause() {

  }

  resume() {

  }

  reset() {

  }
}
```

#### 属性动画 VS 帧动画

* 属性动画： 改变属性
* 帧动画： 一张一张的图片

#### 使 Timeline 能动态添加 animation

1. 记录动画加入时间线的时间点: start-time
2. 计算动画时间
    1. 如果动画加入时间早于时间线开始时间，动画时长 = Date.now() - 时间线开始(startTime)
    2. 如果动画加入时间线晚于事件向开始时间：动画时长 = Date.now() - 动画加入时间(start-time)

#### 加入 pause 和 resume 功能

1. pause 的时候记下暂停这一刻的时间点: pause-start
2. resume 的时候累加下暂停的时间： pause-time += Date.now() - pause-start
3. 计算动画时长的时候减去 pause-time：动画时长 = Date.now() - pause-time

#### 完善动画的其他功能

* delay
* timing function

#### 对时间线进行状态管理

* 给 Timeline 添加 state

#### 手势的基本知识

* start
  * -end-> tap
  * -移动10px-> pan start
    * -move-> pan <循环>
      * -end-> pan end
      * -end且速度>?-> flick(swipe)
  * -0.5s-> press start
    * -移动10px-> pan start
    * -end-> press end

#### 实现鼠标操作

* 添加 mousedown, mousemove, mouseup 事件

#### 实现手势的逻辑

* 添加 touchstart, touchmove, touchend, touchcancel 事件
* 实现 tap, pan, press 的事件
* 统一鼠标和触屏 start, move, end, cancel 功能

#### 处理鼠标事件

因为鼠标事件和触屏事件都不是单一维度的，鼠标分左右键，触屏有多指操作，所有触发事件的状态不能在全局保存，要作为 context 传给 start, move, end, cancel 功能

#### 派发事件

自定义事件
