import { createElement } from "./framework";
import { Carousel } from './carousel';
import { Timeline, Animation } from './animation';



let d = [
  './cat1.jpg',
  './cat2.jpg',
  './cat3.jpg',
  './cat4.jpg',
];

let a = <Carousel src={d}/>;
a.mountTo(document.body);