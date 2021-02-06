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

let handler;
let startX, startY;

let isTap = true;
let isPan = false;
let isPress = false;

let start = (point) => {
  // console.log('start: ', point.clientX, point.clientY);
  startX = point.clientX;
  startY = point.clientY;

  isTap = true;
  isPan = false;
  isPress = false;

  handler = setTimeout(() => {
    isTap = false;
    isPan = false;
    isPress = true;
    handler = null;
    console.log('press');
  }, 500)
}

let move = (point) => {
  // console.log('move: ', point.clientX, point.clientY);
  let dx = point.clientX - startX;
  let dy = point.clientY - startY;

  // 算是否移动 10px 的距离公式是开根号，但是开根号计算比较慢，所有直接就用 100
  if(!isPan && dx ** 2 + dy ** 2 > 100) {
      isTap = false;
      isPan = true;
      isPress = false;

    console.log('panstart');
  }

  if(isPan) {
    console.log('pan: ', dx, dy);
    clearTimeout(handler);
  }

}

let end = (point) => {
  if(isTap) {
    console.log('Tap');
    clearTimeout(handler);
  }

  if(isPan) {
    console.log('panend');
  }

  if(isPress) {
    console.log('pressend');
  }
  console.log('end: ', point.clientX, point.clientY);
}

let cancel = (point) => {
  console.log('cancel: ', point.clientX, point.clientY);
  clearTimeout(handler);
}