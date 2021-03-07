
import { Component, STATE, ATTRIBUTE, createElement } from "./framework";
import { enableGesture } from "./gesture";

// STATE 也可以被用户继承
export { STATE, ATTRIBUTE } from "./framework.js";
export class List extends Component {
  constructor() {
    super();
  }

  render() {
    // JSX 里所有的标签都可以自封闭
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }

  appendChild(child) {
    this.template = (child);
    this.render();
  }

}