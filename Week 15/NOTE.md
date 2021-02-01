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
