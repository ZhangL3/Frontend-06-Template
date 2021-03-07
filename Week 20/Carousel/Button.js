
import { Component, STATE, ATTRIBUTE, createElement } from "./framework";
import { enableGesture } from "./gesture";

// STATE 也可以被用户继承
export { STATE, ATTRIBUTE } from "./framework.js";
export class Button extends Component {
  constructor() {
    super();
  }

  render() {
    // JSX 里所有的标签都可以自封闭
    this.childContainer = <span />;
    this.root = (<div>{this.childContainer}</div>).render();
    return this.root;
  }

  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }

}