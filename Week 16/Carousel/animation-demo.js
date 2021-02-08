import {Timeline, Animation} from "./animation";
import {ease, easeIn, easeOut, easeInOut} from "./ease";

let tl = new Timeline();

tl.start();
tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, 0, easeIn, v => `translate(${v}px)`));

// 用浏览器 C++ 实现的 ease 作对比
document.querySelector("#el2").style.transition = 'transform ease-in 2s';
document.querySelector("#el2").style.transform = 'translateX(500px)';

document.querySelector("#pause-btn").addEventListener("click", () => tl.pause());
document.querySelector("#resume-btn").addEventListener("click", () => tl.resume());