# 学习笔记 Week 5

## Vue 中 reactive 的实现 (观察者模式)

### 编程思想

当 effect(callback) 被调用时，建立一个索引，当在 callbacke 中被绑定的属性的值发生变化时，触发对应属性下的 callbacks。

例：

```js
let object = {
    a: {
        b: {
            c: 3,
        },
    },
    b: 20,
    c: 30,
};

effect(() => {
    console.log('po.a.b.c: ', po.a.b.c);
})

// object 中 a, b, c 均被调用，所以三个层级都会被记录，被标记的 obj 和 prop 对儿为:
// [
//     [
//         {a: { b: { c: 3 }}, b: 20, c: 30},
//         'a',
//     ],
//     [
//         { b: { c: 3 }},
//         'b',
//     ],
//     [
//         {c: 3},
//         'c',
//     ],
// ]

// 对单层属性调用
effect(() => {
    console.log('po.c: ', po.c);
})

// [
//     [
//         { a: { b: { c: 3 }}, b: 20, c: 30 },
//         'a',
//     ],
//     [
//         { b: { c: 3 } },
//         'b',
//     ],
//     [
//         { c: 3 },
//         'c',
//     ],
//     [
//         { a: { b: { c: 3 }}, b: 20, c: 30 },
//         'c',
//     ],
// ]

let object2 = { c: 3 };
effect(() => {
    console.log('po2.c: ', po2.c);
})

// [
//     [
//         {a: { b: { c: 3 }}, b: 20, c: 30 },
//         'a',
//     ],
//     [
//         { b: { c: 3 } },
//         'b',
//     ],
//     [
//         { c: 3 },
//         'c',
//     ],
//     [
//         { a: { b: { c: 3 }}, b: 20, c: 30 },
//         'c',
//     ],
//     [
//         {c: 3 },
//         'c',
//     ],
// ]
// 因为 js 中对象的调用实际上时用的内存地址，所以这里两个 {c: 3} 不会被混淆

// 利用 Map (Map 的 key 可以是 object，并时是传参引用) 把属性和 callback 对应上
// const callbacks = [
//         {
//             { a: { b: { c: 3 }}, b: 20, c: 30} => { 'a' => [()=>{console.log('po.a.b.c: ', po.a.b.c)}]}
//         },
//         {
//             { b: { c: 3} } => { 'b' => [()=>{console.log('po.a.b.c: ', po.a.b.c);}]}
//         },
//         {
//             { c: 3} => { 'c' => [()=>{console.log('po.a.b.c: ', po.a.b.c);}]}
//         },
//         {
//             { a: { b: { c: 3 }}, b: 20, c: 30 } => { 'c' => [()=>{console.log('po.c: ', po.c)}]
//         },
//         {
//             { c: 3 } => { 'c' => [()=>{console.log('po2.c: ', po2.c);}]}
//         }
//     ]
```

### 语法点

Proxy 可 set 和 get 方法可以监听被注册对象的调用

```js
const po = new Proxy(object, {
    set(obj, prop, val) {
        // ...
        return obj[prop];
    },
    get(obj, prop) {
        // ...
        return obj[prop];
    }
})

```

### 应用

双向绑定: View <-> Model 通过 View 可以更改 Model 的值，Model 的值改变，又可以影响 Veiw

```html
<input type="range" id="r" min=0 max=255 >
<input type="range" id="g" min=0 max=255>
<input type="range" id="b" min=0 max=255>
<div id="color" style="width: 100px; height: 100px;">
```

```js
let object = {
    r: 1,
    g: 1,
    b: 1,
};

// 先在 reactive 里注册针对 object 的 proxy
let po = reactive(object);

/**
 * 对 obj 的 prop 注册函数, 如果 prop 被更改，就会调用注册了的函数
 */
effect(() => {
    document.getElementById('r').value = po.r;
})
effect(() => {
    document.getElementById('g').value = po.g;
})
effect(() => {
    document.getElementById('b').value = po.b;
})

document.getElementById('r').addEventListener('input', event => po.r = event.target.value);
document.getElementById('g').addEventListener('input', event => po.g = event.target.value);
document.getElementById('b').addEventListener('input', event => po.b = event.target.value);

effect(() => {
    document.getElementById('color').style.backgroundColor = `rgb(${po.r}, ${po.g}, ${po.b})`;
})
```

## drag

### 编程思想

在 text 中插入 range 节点，根据鼠标的位置，插入 drageble 的 div 到对应的 range

### 语法点

Node.textContent: 表示一个节点及其后代的文本内容。
1. VS HTMLElement.innerText 
1.1 textContent 会获取所有元素的内容，包括\<script> 和 \<style> 元素(所以textContent.length 并不是可见区域的长度); innerText 只展示给人看的元素。
1.2 textContent 会返回节点中的每一个元素; innerText 受 CSS 样式的影响，并且不会返回隐藏元素的文本
2. VS Element.innerHTML
2.1  Element.innerHTML 返回 HTML。通常，为了在元素中检索或写入文本，人们使用 innerHTML。但是，textContent 通常具有更好的性能，因为文本不会被解析为HTML。
2.2 使用 textContent 可以防止 XSS 攻击。

Range: 表示一个包含节点与文本节点的一部分的文档片段。就是 Node 的集合
1. 方法
1.1 Document.createRange
1.2 Range.setStart 标记 Range 开始的节点
1.3 Range.setEnd 标记 Range 结束的节点
