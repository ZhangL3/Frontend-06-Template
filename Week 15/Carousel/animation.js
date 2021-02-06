const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    // 开始时的时间点
    let startTime = Date.now();

    this[PAUSE_TIME] = 0;

    /**
     * 被作为 callback 传给 requestAnimationFrame
     * 被循环执行
     */
    this[TICK] = () => {
      // 此刻的时间
      let now = Date.now();

      // 执行 ANIMATIONS 中的动画
      for( let animation of this[ANIMATIONS] ) {
        // 动画运行了的时长
        let t;
        // 如果动画进入时间线的那一刻时在时间线开始运行之前
        if (this[START_TIME].get(animation) < startTime ) {
          // 运行的时间为现在减去时间线开始运行的时刻
          // 时间线没开始运行动画反正也不动
          // 算动画运行时间的时候，要就去 pause 的时间
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        } else {
          // 如果动画加入时间时在时间线开始之后
          // 动画运行时间为现在减去动画加入的时刻
          // 算动画运行时间的时候，要就去 pause 的时间
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
        }
        if(animation.duration < t) {
          // 删除不需要继续执行的动画
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }

        // 因为有 delay，所以 t 可能使负数。t > 0 时就是 delay 结束的时刻
        if (t > 0) {
          // 把值传给给动画
          animation.receive(t);
        }
      }

      // 每一次的浏览器刷新一帧的时候，执行一次 TICK
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }

    // 执行第一次 TICK
    this[TICK]();
  }

  pause() {
    // pause 开始的时候，记录时间节点
    this[PAUSE_START] = Date.now();
    console.log('this[PAUSE_START]: ', this[PAUSE_START]);
    cancelAnimationFrame(this[TICK_HANDLER]);
  }

  resume() {
    // pause 结束的时候，计算总 pause 的时间
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    console.log('this[PAUSE_TIME]: ', this[PAUSE_TIME]);
    this[TICK]();
  }

  reset() {

  }

  add(animation, startTime) {
    // 加入动画时，把加入的那个时间节点也加入START_TIME序列
    if(arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction/**插值函数，从start到end是否平均 */, template) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
  }

  /**
   * 接收 Timeline 传入的时间
   * @param {number} time 时长
   */
  receive(time) {
    console.log('time: ', time);
    let range = ( this.endValue - this.startValue );
    // 以 0 到 100 为一个周期, 在 1000 的时长中做循环
    this.object[this.property] = this.template(this.startValue + range * time / this.duration);
  }
}