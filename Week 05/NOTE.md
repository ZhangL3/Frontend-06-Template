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
