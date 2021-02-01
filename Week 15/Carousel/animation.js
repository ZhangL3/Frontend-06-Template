const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");

export class Timeline {
  constructor() {
    this[TICK] = () => {
      console.log('tick: ');
      requestAnimationFrame(this[TICK]);
    }
  }

  start() {
    this[TICK]();
  }

  pause() {

  }

  resume() {

  }

  reset() {

  }
}