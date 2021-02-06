let element = document.documentElement;

element.addEventListener("mousedown", event => {
  start(event);

  let mousemove = event => {
    // console.log('event: ', event.clientX, event.clientY);
    move(event);
  };
  
  let mouseup = event => {
    end(event);
    element.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseup", mouseup);
  };

  element.addEventListener("mousemove", mousemove);
  element.addEventListener("mouseup", mouseup);
});

// 不会越过 touchstart 触发 touchmove，所以不用把 touchmove 和 touchend 放入 touchstart 里
element.addEventListener("touchstart", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchstart: ', touch.clientX, touch.clientY);
    start(touch);
  }
})

element.addEventListener("touchmove", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchmove: ', touch.clientX, touch.clientY);
    move(touch);
  }
})

element.addEventListener("touchend", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchend: ', touch.clientX, touch.clientY);
    end(touch);
  }
})

// 以异常的方式结束，如：被 alert() 打断
element.addEventListener("touchcancel", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchcancel: ', touch.clientX, touch.clientY);
    cancel(touch);
  }
})


let start = (point) => {
  console.log('start: ', point.clientX, point.clientY);
}

let move = (point) => {
  console.log('move: ', point.clientX, point.clientY);

}

let end = (point) => {
  console.log('end: ', point.clientX, point.clientY);
  
}

let cancel = (point) => {
  console.log('cancel: ', point.clientX, point.clientY);

}