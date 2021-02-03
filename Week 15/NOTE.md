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