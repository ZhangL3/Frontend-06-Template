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
      this.root.appendChild(child);
    }

    this.root.addEventListener("mousedown", event => {
      console.log('mousedown: ', event);

      let move = event => {
        console.log('mousemove: ', event);
      }

      let up = event => {
        console.log('mouseup: ', event);
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
        current.style.transform = `translateX(${-100 - nextIndex * 100}%)`
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
