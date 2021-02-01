const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
  }

  start() {
    // 开始时的时间点
    let startTime = Date.now();

    /**
     * 被作为 callback 传给 requestAnimationFrame
     * 被循环执行
     */
    this[TICK] = () => {
      // 现在距离开始的时间
      let t = Date.now() - startTime;

      // 执行 ANIMATIONS 中的动画
      for( let animation of this[ANIMATIONS] ) {
        console.log('t: ', t);
        // 因为浏览器刷新动画的一帧的过程可能会超过设定的 duration，所以先存下 真正的时长
        // 如果超了的话，把 t0 值回溯会 duration 的时刻
        let t0 = t;

        if(animation.duration < t) {
          // 删除不需要继续执行的动画
          this[ANIMATIONS].delete(animation);
          t0 = animation.duration;
        }

        // 把值传给给动画
        animation.receive(t0);
      }

      // 每一次的浏览器刷新一帧的时候，执行一次 TICK
      requestAnimationFrame(this[TICK]);
    }

    // 执行第一次 TICK
    this[TICK]();
  }

  pause() {

  }

  resume() {

  }

  reset() {

  }

  add(animation) {
    this[ANIMATIONS].add(animation);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, timingFunction/**插值函数，从start到end是否平均 */) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }

  /**
   * 接收 Timeline 传入的时间
   * @param {number} time 时长
   */
  receive(time) {
    console.log('time: ', time);
    let range = ( this.endValue - this.startValue );
    // 以 0 到 100 为一个周期, 在 1000 的时长中做循环
    this.object[this.property] = this.startValue + range * time / this.duration;
  }
}