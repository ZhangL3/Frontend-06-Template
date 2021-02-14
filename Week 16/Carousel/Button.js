
import { Component, STATE, ATTRIBUTE, createElement } from "./framework";
import { enableGesture } from "./gesture";

// STATE 也可以被用户继承
export { STATE, ATTRIBUTE } from "./framework.js";
export class Button extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = (<div>content</div>).root;
  }

}