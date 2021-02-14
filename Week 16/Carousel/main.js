import { createElement } from "./framework";
import { Carousel } from './Carousel';
import { Timeline, Animation } from './animation';

let d = [
  {
    img: './cat1.jpg',
    url: 'https://time.geekbang.org',
    title: 'A',
  },
  {
    img: './cat2.jpg',
    url: 'https://time.geekbang.org',
    title: 'B',
  },
  {
    img: './cat3.jpg',
    url: 'https://time.geekbang.org',
    title: 'C',
  },
  {
    img: './cat4.jpg',
    url: 'https://time.geekbang.org',
    title: 'D',
  },
];

// let a = <Carousel
//   src={d}
//   onChange={ event => {/* console.log('event: ', event) */ }}
//   onClick={event =>  window.location.href = event.detail.data.url}
// />;
// a.mountTo(document.body);

// 内容型 children
import { Button } from './Button';
let b = <Button>
    Button content
</Button>
b.mountTo(document.body);

// 模板型 children
import { List } from './List';
let c = <List data={d}>
  {(record) =>
    <div>
      <img src={record.img} />
      <a href={record.url}>{record.title}</a>
    </div>
  }
</List>
c.mountTo(document.body);