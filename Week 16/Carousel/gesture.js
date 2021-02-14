/**
 * 封装思想
 * listen=>recognize=>dispatcher
 * new Listener(element, new Recognizer(element, new Dispatcher(element)))
 */

export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  
  /**
   * Create event and patch it to the element
   * @param {string} type name of the event
   * @param {object} properties properties of the event
   */
  dispatch(type, properties) {
    let event = new Event(type);
    for(let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

export class Listener {
  constructor(element, recognizer) {
    /**
     * 如果多个鼠标键被同时按，可能出现对同一个监听多次重复，并且多次取消。
     * 但已经被取消的监听不能再被取消，所以这里加一个状态，表示鼠标是否已经被监听了
     */
    let isListeningMouse = false;

    /**
     * 由于在 Listener 里要监听不同事件，并触发 Recognizer 里的不同 functions
     * 所以把一些不在默认事件里，但又被 Recognizer 需要的心里储存在 context 中
     */
    let contexts = new Map();

    /**
     * 处理鼠标事件
     */
    element.addEventListener("mousedown", event => {
      // 自己的 context
      let context = Object.create(null);
      /**
       * 因为 mousemove 的 event.buttons 用的是二进制掩码(1,2,4,8,16)
       * 所以这里用移位后的值来作为 key
       */
      contexts.set("mouse" + (1 << event.button), context);
      // console.log("!!!!!!start: ", 1 << event.button);
      // 由 mouse event 触发 start()
      recognizer.start(event, context);

      let mousemove = event => {
        /**
         * mousemove 的 event 里并没有 button 属性，区分按键
         * 但 mousemove 里有 buttons，表示哪些按键被按下来了
         * buttons 是用二进制掩码表示: 0b11111(全按下)
         */
        let button = 1;
        while(button <= event.buttons) {
          // 掩码存在并且对应
          if (button & event.buttons) {
            /**
             * 在 mousemove 中 buttons 二进制掩码对应的键于 mousedown 的有所不同，右键和中键被对调了
             * 先把不同的调换过来
             */
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }

            let context = contexts.get("mouse" + key);
            // console.log("!!!!!!move: ", key);
            // 由 mouse 触发 recognizer 里 move function
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };
      
      let mouseup = event => {
        // console.log("!!!!!!!!!end: ", 1 << event.button);
        let context = contexts.get("mouse" + (1 << event.button));
        recognizer.end(event, context);
        /**
         * delete 一定要出现在 end() 后面，不然 context 就变成了一个野生的 context
         */
        contexts.delete("mouse" + (1 << event.button));

        // 如果所有按键都没有被按住，解除监听
        if (event.buttons === 0) {
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

    // 监听 touch
    /**
     * 不会越过 touchstart 触发 touchmove
     * 所以不用把 touchmove 和 touchend 放入 touchstart 里
     */
    element.addEventListener("touchstart", event => {
      /**
       * 因为 touch 可以多指操作
       * 所有 event 里每个手指的 event 被存在 changedTouches 里
       */
      for(let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    })

    element.addEventListener("touchmove", event => {
      for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    })

    element.addEventListener("touchend", event => {
      for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    })

    // 以异常的方式结束，如：被 alert() 打断
    element.addEventListener("touchcancel", event => {
      for(let touch of event.changedTouches) {
        recognizer.cancel(touch);
        contexts.delete(touch.identifier);
      }
    })
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  /**
   * 汇总和整理原生 event 和 context 的信息, dispatch 给 element
   * @param {object} point listen 到的 event
   * @param {object} context listener 传来的信息
   */
  start(point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;

    /**
     * 触发 start 事件，传入开始位置
     * 鼠标点击或者手触碰就会触发 start
     */
    this.dispatcher.dispatch("start", {
      clientX: point.clientX,
      clientY: point.clientY,
    })
    
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }];

    // 储存动作类型
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    // 点击 0.5 秒后被认为是 press
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
      this.dispatcher.dispatch("press", {});
      // console.log('press');
    }, 500)
  }


  move(point, context) {
    // console.log('move: ', point.clientX, point.clientY);
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;

    /**
     * 如果手机移动距离没有超过 10px，则不被认为是拖拽了
     * 算是否移动 10px 的距离公式是开根号
     * 但是开根号计算比较慢，所有直接就用 100
     */
    if(!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);

      this.dispatcher.dispatch("panstart", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
      clearTimeout(context.handler);
    }

    if(context.isPan) {
      this.dispatcher.dispatch("pan", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
      // console.log('pan: ', dx, dy);
      clearTimeout(context.handler);
    }

    /**
     * 只半秒内的点，作为判断是否为 flick 因素
     */
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });
  }

  end(point, context) {
    if(context.isTap) {
      // console.log('Tap');
      this.dispatcher.dispatch("tap", {});
      clearTimeout(context.handler);
    }

    if(context.isPress) {
      this.dispatcher.dispatch("pressend", {})
      // console.log('pressend');
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let d, v;
    // 因为最后一个记录点可能不在半秒之内，所有 points 可能为空
    if (!context.points.length) {
      v = 0;
    } else {
      // 计算移动的距离
      d = Math.sqrt(( point.clientX - context.points[0].x ) ** 2 +
        ( point.clientY - context.points[0].y ) ** 2);
      // 计算速度
      v = d / (Date.now() - context.points[0].t);
    }
    // console.log('v: ', v);
    // 单位:像素每毫秒
    if (v > 1.5) {
      this.dispatcher.dispatch("flick", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v
      });
      // console.log('flick: ');
      context.isFlick = true;
    } else {
      context.isFlick = false;
    }
    // console.log('end: ', point.clientX, point.clientY);

    if(context.isPan) {
      this.dispatcher.dispatch("panend", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      });
      // console.log('panend');
    }
  }

  cancel(point, context) {
      this.dispatcher.dispatch("cancel", {});
    // console.log('cancel: ', point.clientX, point.clientY);
    clearTimeout(context.handler);
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)))
}