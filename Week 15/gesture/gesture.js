let element = document.documentElement;

// 如果多个鼠标键被同时按，可能出现对同一个监听多次重复，并且多次取消。
// 但已经被取消的监听不能再被取消，所以这里加一个状态，表示鼠标是否已经被监听了
let isListeningMouse = false;

element.addEventListener("mousedown", event => {

  let context = Object.create(null);
  // 因为 mousemove 的 event.buttons 用的是二进制掩码(1,2,4,8,16)，所以这里用移位来作为 key
  contexts.set("mouse" + (1 << event.button), context);
  console.log("!!!!!!start: ", 1 << event.button);
  start(event, context);

  let mousemove = event => {
    // mousemove 的 event 里并没有 button 属性，区分按键
    // 但 mousemove 里有 buttons，表示哪些按键被按下来了。 buttons 是用二进制掩码表示: 0b11111(全按下)
    let button = 1;
    while(button <= event.buttons) {
      // 掩码存在并且对应
      if (button & event.buttons) {
        // 在 mousemove 中 buttons 二进制掩码对应的键于 mousedown 的有所不同，右键和中键被对调了
        // 先把不同的调换过来
        let key;
        if (button === 2) {
          key = 4;
        } else if (button === 4) {
          key = 2;
        } else {
          key = button;
        }

        let context = contexts.get("mouse" + key);

        console.log("!!!!!!move: ", key);

        move(event, context);
      }
      button = button << 1;
    }
  };
  
  let mouseup = event => {
    console.log("!!!!!!!!!end: ", event.button);
    let context = contexts.get("mouse" + (1 << event.button));
    end(event, context);
    // delete 一定要出现在 end() 后面，不然 context 就变成了一个野生的 context
    contexts.delete("mouse" + (1 << event.button));

    if(event.buttons === 0) {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
      isListeningMouse = false;
    }
  };

  if (!isListeningMouse) {
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);

    isListeningMouse = true;
  }
  
});

let contexts = new Map();

// 不会越过 touchstart 触发 touchmove，所以不用把 touchmove 和 touchend 放入 touchstart 里
element.addEventListener("touchstart", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchstart: ', touch.clientX, touch.clientY);
    let context = Object.create(null);
    contexts.set(touch.identifier, context);
    start(touch, context);
  }
})

element.addEventListener("touchmove", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchmove: ', touch.clientX, touch.clientY);
    let context = contexts.get(event.identifier);
    move(touch, context);
  }
})

element.addEventListener("touchend", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchend: ', touch.clientX, touch.clientY);
    let context = contexts.get(touch.identifier);
    end(touch, context);
    contexts.delete(touch.identifier);
  }
})

// 以异常的方式结束，如：被 alert() 打断
element.addEventListener("touchcancel", event => {
  for(let touch of event.changedTouches) {
    // console.log('touchcancel: ', touch.clientX, touch.clientY);
    cancel(touch);
    contexts.delete(touch.identifier);
  }
})

let start = (point, context) => {
  // console.log('start: ', point.clientX, point.clientY);
  context.startX = point.clientX;
  context.startY = point.clientY;

  context.isTap = true;
  context.isPan = false;
  context.isPress = false;

  handler = setTimeout(() => {
    context.isTap = false;
    context.isPan = false;
    context.isPress = true;
    context.handler = null;
    console.log('press');
  }, 500)
}

let move = (point, context) => {
  // console.log('move: ', point.clientX, point.clientY);
  let dx = point.clientX - context.startX;
  let dy = point.clientY - context.startY;

  // 算是否移动 10px 的距离公式是开根号，但是开根号计算比较慢，所有直接就用 100
  if(!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;

    console.log('panstart');
  }

  if(context.isPan) {
    console.log('pan: ', dx, dy);
    clearTimeout(handler);
  }

}

let end = (point, context) => {
  if(context.isTap) {
    console.log('Tap');
    dispatch("tap", {});
    clearTimeout(context.handler);
  }

  if(context.isPan) {
    console.log('panend');
  }

  if(context.isPress) {
    console.log('pressend');
  }
  console.log('end: ', point.clientX, point.clientY);
}

let cancel = (point, context) => {
  console.log('cancel: ', point.clientX, point.clientY);
  clearTimeout(context.handler);
}

function dispatch(type, properties) {
  let event = new Event("tap");
  for(let name in properties) {
    event[name] = properties[name];
  }
  element.dispatchEvent(event);
}