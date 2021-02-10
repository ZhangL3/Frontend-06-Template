import { Component, createElement } from "./framework";
import { enableGesture } from "./gesture";
import { Timeline, Animation } from "./animation";
import { ease } from './ease';

/**
 * 自定义 Carousel 类
 */
export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");

    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();

    // 储存自动播放的动作，用于取消 setInterval
    let handler = null;

    let children = this.root.children;

    let position = 0;

    // 手势加入的时间点
    let t = 0;
    // 动画造成的位移
    let ax = 0;

    this.root.addEventListener("start", event => {
      // 暂停时间线
      timeline.pause();
      // 暂停主备下一张图片
      clearInterval(handler);
      // 计算动画播放的进度
      let progress = (Date.now() - t) / 1500;
      ax = ease(progress) * 500 - 500;
      
    })
    
    this.root.addEventListener("pan", event => {
      // 计算拖住偏移时，要减去动画造成的偏移
      let x = event.clientX - event.startX - ax;
      let current = position - (( x - x % 500 ) / 500);
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // pos 可能是负数，先取余，肯定小于 length，在加 length, 再取余，先当与取正余数
        pos = ( pos % children.length + children.length ) % children.length;
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${- pos * 500/**当前图位置 */ + offset * 500/**偏移量 */ + x % 500/**鼠标当前挪动相对图画位置 */}px)`;
      }
    })

    this.root.addEventListener("panend", event => {
      let x = event.clientX - event.startX;
      // 挪动超过 500 的一半就 +/- 1
      position = position - Math.round(x / 500);

      // 把当前元素和当前元素的的前一或者后一都挪到正确的位置(根据鼠标拖动的方向)
      for (let offset of [0, -Math.sign( Math.round(x / 500) - x + 250 * Math.sign(x) )]) {
        let pos = position + offset;
        // pos 可能是负数，这里取绝对值
        pos = ( pos + children.length ) % children.length;
        // 更新 position 为 pos，避免 position 不断的加减，超出 children 的范围
        if (offset === 0) {
          position = pos;
        }

        children[pos].style.transition = '';
        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
      }

    })

    // this.root.addEventListener("mousedown", event => {
    //   let children = this.root.children;
    //   let startX = event.clientX;

    //   event.preventDefault();

    //   let move = event => {
    //     // event.clientX, event.clientY 浏览器可视区域的绝对位置
    //     // 拖拽了的距离
    //     let x = event.clientX - startX;

    //     // 当前的中心元素 ( 取 x 除以 500 整数部分的运算 )
    //     let current = position - (( x - x % 500 ) / 500);

    //     // 把当前元素的前一后一都挪到正确的位置。为了避免奇特的 bug，可以算的范围大一些，比如：[-2, -1, 0, 1, 2]
    //     for (let offset of [-1, 0, 1]) {
    //       let pos = current + offset;
    //       // pos 可能是负数，这里取绝对值
    //       pos = ( pos + children.length ) % children.length;
    //       children[pos].style.transition = 'none';
    //       children[pos].style.transform = `translateX(${- pos * 500/**当前图位置 */ + offset * 500/**偏移量 */ + x % 500/**鼠标当前挪动相对图画位置 */}px)`;
    //     }
    //   }

    //   let up = event => {
    //     let x = event.clientX - startX;
    //     // 挪动超过 500 的一半就 +/- 1
    //     position = position - Math.round(x / 500);

    //     // 把当前元素和当前元素的的前一或者后一都挪到正确的位置(根据鼠标拖动的方向)
    //     for (let offset of [0, -Math.sign( Math.round(x / 500) - x + 250 * Math.sign(x) )]) {
    //       let pos = position + offset;
    //       // pos 可能是负数，这里取绝对值
    //       pos = ( pos + children.length ) % children.length;
    //       // 更新 position 为 pos，避免 position 不断的加减，超出 children 的范围
    //       if (offset === 0) {
    //         position = pos;
    //       }

    //       children[pos].style.transition = '';
    //       children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
    //     }

        
    //     // 监听 mousemove 和 mouseup 在 document 上
    //     document.removeEventListener("mousemove", move);
    //     document.removeEventListener("mouseup", up);
    //   }

    //   document.addEventListener("mousemove", move);

    //   document.addEventListener("mouseup", up);
    // });

    
    // 自动播放
    let nextPicture = () => {
      let children = this.root.children;
      // 用求余的方法实现循环
      let nextIndex = (position + 1) % children.length;

      let current = children[position];
      let next = children[nextIndex];

      // 保存动画开始的时间
      t = Date.now();

      // next 移动到 current 后的动作不需要 animation
      // next.style.transition = "none";
      // 把 next 移动到显示区域右侧
      // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;

      timeline.add(new Animation(current.style, "transform",
        - position * 500, - 500 - position * 500, 1500, 0, ease, v => `translateX(${v}px)`));
      timeline.add(new Animation(next.style, "transform",
        500 - nextIndex * 500, - nextIndex * 500, 1500, 0, ease, v => `translateX(${v}px)`));

      position = nextIndex;
    };

    handler = setInterval(nextPicture, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}