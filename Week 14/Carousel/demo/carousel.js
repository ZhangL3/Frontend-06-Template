// import { pure, createElement } from './pure';

class Carousel {

  constructor() {
    this.root = null;
    this.data = null;
  }

  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');

    for (const d of this.data) {
      const element = document.createElement('img');
      element.src = d;
      element.addEventListener('dragstart', e => e.preventDefault())
      this.root.appendChild(element);
    }

    // let currentIndex = 0;

    // setInterval(() => {
    //   let nextIndex = (currentIndex + 1) % this.data.length;

    //   let current = this.root.childNodes[currentIndex];
    //   let next = this.root.childNodes[nextIndex];


    //   next.style.transition = `none`;
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   console.log('position', currentIndex, 'nextPosition', nextIndex);
    //   console.log('current', -100 - (100 * currentIndex), 'next', -100 * nextIndex);

    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(-${100 * nextIndex}%)`;

    //     currentIndex = nextIndex;
    //   }, 16)

    // }, 3000);
    let position = 0;

    // let nextPicture =  () => {

    //   const nextPosition = (position + 1) % this.data.length;
    //   // const lastPosition = (this.data.length + position - 1) % this.data.length;

    //   let current = this.root.childNodes[position];
    //   let next = this.root.childNodes[nextPosition];
  
    //   console.log('position', position, 'nextPosition', nextPosition);
    //   console.log('current', -100 - (100 * position), 'next', -100 * nextPosition);

    //   next.style.transition = `none`;
    //   next.style.transform = `translateX(${100 - (100 * nextPosition)}%)`;

    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 - (100 * position)}%)`;
    //     next.style.transform = `translateX(-${100 * nextPosition}%)`;

    //     position = nextPosition;
    //   }, 16)

    //   setTimeout(nextPicture, 3000);
    // }

    this.root.addEventListener('mousedown', (event) => {
      const {
        clientX: startX,
        clientY: startY
      } = event;

      // const nextPosition = (currentIndex + 1) % this.data.length;
      // const lastPosition = (this.data.length + currentIndex - 1) % this.data.length;

      // let current = this.root.childNodes[currentIndex];
      // let next = this.root.childNodes[nextPosition];
      // let last = this.root.childNodes[lastPosition];

      // current.style.transition = `ease 0s`;
      // next.style.transition = `ease 0s`;
      // last.style.transition = `ease 0s`;

      // current.style.transform = `translateX(${0 - 500 * position}px)`;
      // last.style.transform = `translateX(${500 - 500 * lastPosition}px)`;
      // next.style.transform = `translateX(${-500 - 100 * nextPosition}px)`;

      let move = (e) => {
        console.log('move');
        // const {
        //   clientX: x,
        //   clientY: y
        // } = e;
        
        // current.style.transform = `translateX(${x - startX - 500 * position}px)`;
        // next.style.transform = `translateX(${x - startX + 500 - 500 * nextPosition}px)`;
        // last.style.transform = `translateX(${x - startX - 500 - 500 * lastPosition}px)`;

        const x = e.clientX - startX;
        const current = position - ((x - x%500) / 500);
        for(let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + this.data.length) % this.data.length;
          this.root.childNodes[pos].style.transition = "none";
          this.root.childNodes[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500 }px)`;
        }
      };
      let up = (e) => {
        console.log('up');
        // let offset = 0;

        // if(e.clientX - startX > 250){
        //   offset = 1;
        // } else if (e.clientX - startX < -250) {
        //   offset = -1;
        // }

        // current.style.transition = '';
        // next.style.transition = '';
        // last.style.transition = '';

        // current.style.transform = `translateX(${offset * 500 - 500 * currentIndex}px)`;
        // next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;
        // last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;

        // currentIndex = (this.data.length + currentIndex + offset) % this.data.length;
        const x = e.clientX - startX;
        position = position - Math.round(x / 500);
        for(let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x) )]) {
          let pos = position + offset;
          pos = (pos + this.data.length) % this.data.length;
          this.root.childNodes[pos].style.transition = "";
          console.log(-pos * 500 + offset * 500)
          this.root.childNodes[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        }
        position = position >= 0 ? position % this.data.length :  (position % this.data.length + this.data.length);

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    // setTimeout(nextPicture, 3000);
  }
}

let carousel = new Carousel();

// data
carousel.data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];
carousel.render();



// mount 
document.getElementById('container').appendChild(carousel.root);