export function createElement(type, attributes, ...children) {
  console.log('type: ', type);
  console.log('attributes: ', attributes);
  console.log('children: ', children);
  let element;
  // 区分是 html 自有的 tag, 还是自定义的类
  // HTML 自有的 tag 就是用的 tagName， string
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
  // 自定义的 tag 的 type 是自定义类
    element = new type;
  }

  // 添加 attributes
  for(let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  // 添加 children
  let processChildren = (children) => {
    for(let child of children) {
      if ((typeof child === "object") && (child instanceof Array)) {
        processChildren(child);
        // child 有时是数组，continue 跳过
        continue;
      }
      if (typeof child === "string") {
        child = new TextWrapper(child);
      }
      console.log('child: ', child);
      element.appendChild(child);
    }
  }
  processChildren(children);
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

  render() {
    return this.root;
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
    super();
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}

class TextWrapper extends Component{
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
}