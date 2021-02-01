import { Component, createElement } from "./framework";

/**
 * 自定义 Carousel 类
 */
class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    // console.log('this.attributes.src: ', this.attributes.src);
    this.root = document.createElement("div");
    this.root.classList.add("carousel");

    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      // const child = document.createElement('img');
      // child.src = record;
      this.root.appendChild(child);
    }

    // 鼠标拖拽
    // 记录当前是第几张图
    let position = 0;
    this.root.addEventListener("mousedown", event => {
      let children = this.root.children;
      let startX = event.clientX;

      event.preventDefault();

      let move = event => {
        // event.clientX, event.clientY 浏览器可视区域的绝对位置
        // 拖拽了的距离
        let x = event.clientX - startX;

        // 当前的中心元素 ( 取 x 除以 500 整数部分的运算 )
        let current = position - (( x - x % 500 ) / 500);

        // 把当前元素的前一后一都挪到正确的位置。为了避免奇特的 bug，可以算的范围大一些，比如：[-2, -1, 0, 1, 2]
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          // pos 可能是负数，这里取绝对值
          pos = ( pos + children.length ) % children.length;
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${- pos * 500/**当前图位置 */ + offset * 500/**偏移量 */ + x % 500/**鼠标当前挪动相对图画位置 */}px)`;
        }
      }

      let up = event => {
        let x = event.clientX - startX;
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

        
        // 监听 mousemove 和 mouseup 在 document 上
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      }

      document.addEventListener("mousemove", move);

      document.addEventListener("mouseup", up);
    });

    
    // 自动播放
    /* let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      // 用求余的方法实现循环
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      // next 移动到 current 后的动作不需要 animation
      next.style.transition = "none";
      // 把 next 移动到显示区域右侧
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        // transition 这里置为空， CSS 里就会生效
        next.style.transition = "";
        // 把 current 向左挪出显示区域
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
        // 把 next 向左挪入显示区域
        next.style.transform = `translateX(${-nextIndex * 100}%)`

        currentIndex = nextIndex;
      }, 16);
    }, 3000); */

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let d = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];


// document.body.append(a);
let a = <Carousel src={d}/>;
a.mountTo(document.body);

/* var a = createElement("div", {
    id: "a"
  },
  createElement("span", null),
  createElement("span", null),
  createElement("span", null),
); */
