export function createElement(type, attributes, ...children) {
  let element;
  // 区分是 html 自有的 tag, 还是自定义的类
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }

  // 添加 attributes
  for(let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  // 添加 children
  for(let child of children) {
    if (typeof child === "string") {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }
  return element;
}

// 类似于 protected
export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");


export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }
  triggerEvent(type, args) {
    // 正则 replace 可以传函数
    this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }));
  }
}

class ElementWrapper extends Component{
  constructor(type) {
    this.root = document.createElement(type);
  }
}

class TextWrapper extends Component{
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}