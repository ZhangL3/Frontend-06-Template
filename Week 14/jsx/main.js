function createElement(type, attributes, ...children) {
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

/* let a = <div id="a">
  <span></span>
  <span></span>
  <span></span>
</div> */

/* let a = <div id="a">
  <span>a</span>
  <span>b</span>
  <span>c</span>
</div> */

/**
 * 自定义 Element 包装，加入 mountTo 方法
 */
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

/**
 * 自定义 Text 包装，加入 mountTo 方法
 */
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

/**
 * 自定义 Div 类
 */
class Div {
  constructor() {
    this.root = document.createElement("div");
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

let a = <Div id="a">
  <span>a</span>
  <span>b</span>
  <span>c</span>
</Div>
// 上边的代码被翻译成下面这段，因为 Div 不是 html 的 element，所有并没有被翻译成 createElement("div", ...)
// 而是被翻译为 Div 类，所有要单独给 Div 类做定义
/* var a = createElement(Div, {
    id: "a"
  },
  createElement("span", null, "a"),
  createElement("span", null, "b"),
  createElement("span", null, "c")
); */




// document.body.append(a);

a.mountTo(document.body);

/* var a = createElement("div", {
    id: "a"
  },
  createElement("span", null),
  createElement("span", null),
  createElement("span", null),
); */
