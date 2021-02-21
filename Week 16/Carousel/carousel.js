import { Component, STATE, ATTRIBUTE } from "./framework";
import { enableGesture } from "./gesture";
import { Timeline, Animation } from "./animation";
import { ease } from './ease';

// STATE 也可以被用户继承
export { STATE, ATTRIBUTE } from "./framework.js";

/**
 * 自定义 Carousel 类
 */
export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");

    for (let record of this[ATTRIBUTE].src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record.img})`;
      this.root.appendChild(child);
    }

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();
// 储存自动播放的动作，用于取消 setInterval
    let handler = null;

    let children = this.root.children;

    // 第几张图片
    this[STATE].position = 0;

    // 手势加入的时间点
    let t = 0;
    // 动画造成的位移
    let ax = 0;
    // picture DURATION
    let DURATION = 1500;
    // picture WIDTH
    let WIDTH = 500;
    let NEXT_INTERVAL = 3000;

    // start 和 panstart 的启动时间是有误差的，所以会存在 拖动快时 位置不准的情况
    this.root.addEventListener("start", event => {
      // 暂停时间线
      timeline.pause();
      // 暂停主备下一张图片
      clearInterval(handler);
      // 计算动画播放的进度
      if(Date.now() - t < DURATION) {
        let progress = (Date.now() - t) / DURATION;
        ax = ease(progress) * WIDTH - WIDTH;
      }else{
        // 如果图片在 DURATION 时间内已经滚出画面，但 nextPicture 还没被触发，progress 会大于 1
        // ax 也会指向后面还没播放的位置，所以这里 ax 要清零
        ax = 0
      }
    })

    this.root.addEventListener("tap", event => {
      this.triggerEvent("click", {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position,
      });

    })
    
    this.root.addEventListener("pan", event => {
      // 计算拖住偏移时，要减去动画造成的偏移
      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - (( x - x % WIDTH ) / WIDTH);

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // pos 可能是负数，先取余，肯定小于 length，在加 length, 再取余，先当与取正余数
        pos = ( pos % children.length + children.length ) % children.length;
        // console.log('pos: ', pos);
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${- pos * WIDTH/**当前图位置 */ + offset * WIDTH/**偏移量 */ + x % WIDTH/**鼠标当前挪动相对图画位置 */}px)`;
      }

    })

    // 监听 end 事件，因为按住不动再松手的话不会触发 panend
    this.root.addEventListener("end", event => {
      // 重新打开时间线
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, NEXT_INTERVAL);
      
      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - ((x - x % WIDTH) / WIDTH);

      // 结束时取整，因该为 -1 || 0 || 1
      let direction = Math.round((x % WIDTH) / WIDTH);

      if (event.isFlick) {
        if (event.clientX > event.startX) {
          // 取上界
          direction = Math.ceil((x % WIDTH) / WIDTH);
        } else {
          // 取下界
          direction = Math.floor((x % WIDTH) / WIDTH);
        }
      }
      
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // pos 可能是负数，先取余，肯定小于 length，在加 length, 再取余，相当于取正余数
        pos = ( pos % children.length + children.length ) % children.length;

        children[pos].style.transition = 'none';
        timeline.add(new Animation(children[pos].style, "transform",
          - pos * WIDTH/**当前图位置 */ + offset * WIDTH/**偏移量 */ + x % WIDTH/**鼠标当前挪动相对图画位置 */,
          - pos * WIDTH + offset * WIDTH + direction * WIDTH,
          DURATION, 0, ease, v => `translateX(${v}px)`));
      }

      // 减掉 x / 500 的整数部分
      this[STATE].position = this[STATE].position - ((x - x % WIDTH) / WIDTH) - direction;
      // 拖拽比较远，可能是负数，重新算为正数
      this[STATE].position = ( this[STATE].position % children.length + children.length ) % children.length;

      // 结束手势时，触发 onChange，返回 position
      this.triggerEvent("change", { position: this[STATE].position});

    })
    
    // 自动播放
    let nextPicture = () => {
      let children = this.root.children;
      // 用求余的方法实现循环
      let nextIndex = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];
      let next = children[nextIndex];

      // 保存动画开始的时间
      t = Date.now();

      timeline.add(new Animation(current.style, "transform",
        - this[STATE].position * WIDTH, - WIDTH - this[STATE].position * WIDTH, DURATION, 0, ease, v => `translateX(${v}px)`));
      timeline.add(new Animation(next.style, "transform",
        WIDTH - nextIndex * WIDTH, - nextIndex * WIDTH, DURATION, 0, ease, v => `translateX(${v}px)`));

      this[STATE].position = nextIndex;

      // 自动播放时，切换到下一张图片时触发 onChange
      this.triggerEvent("change", { position: this[STATE].position});
    };

    handler = setInterval(nextPicture, NEXT_INTERVAL);

    return this.root;
  }
}