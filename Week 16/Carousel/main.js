import { createElement } from "./framework";
import { Carousel } from './carousel';
import { Timeline, Animation } from './animation';



let d = [
  {
    img: './cat1.jpg',
    url: 'https://time.geekbang.org',
  },
  {
    img: './cat2.jpg',
    url: 'https://time.geekbang.org',
  },
  {
    img: './cat3.jpg',
    url: 'https://time.geekbang.org',
  },
  {
    img: './cat4.jpg',
    url: 'https://time.geekbang.org',
  },
];

let a = <Carousel
src={d}
onChange={event => console.log('event: ', event)}
onClick={event => {console.log('event: ', event.detail); window.location.href = event.detail.data.url }}
/>;
a.mountTo(document.body);