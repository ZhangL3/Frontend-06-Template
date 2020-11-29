let callbacks = new Map();

// 存储已经添加的 reactivities，作为跳出递归的条件
let reactivities = new Map();

// 储存被调用了哪个变量 [{obj}, prop][]
let usedReactivities = [];

let object = {
    a: {
        b: {
            c: 3,
        },
    },
    b: 20,
    c: 30,
};

// 先在 reactive 里注册针对 object 的 proxy
let po = reactive(object);

/* let object2 = { c: 3 };

let po2 = reactive(object2); */

/**
 * 对 obj 的 prop 注册函数, 如果 prop 被更改，就会调用注册了的函数
 */
effect(() => {
    // 这里的 po 调用可以触发 get 里的语句，把通过 Proxy 传递的 obj 和 prop 储存起来
    // 既在 usedReactivities 里存
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
    console.log('po.a.b.c: ', po.a.b.c);
})
/* effect(() => {
    // prop 虽然都为 c，但是 po.c 的 key 是 {a: { b: { c: 3 }}, b: 20, c: 30}
    // [
    //     [
    //         {a: { b: { c: 3 }}, b: 20, c: 30},
    //         'c',
    //     ]
    // ]
    console.log('po.c: ', po.c);
}) */
/* effect(() => {
    // 因为 proxy 的 key 是内存块，所以即使值相同，但不指向一个内存块，仍然可被分辨
    [
        [
            { c: 3 },
            'c',
        ]
    ]
    console.log('po2.c: ', po2.c);
})
 */
/**
 * 注册函数
 * callbacks = [
 *    {
 *       obj => { prop => [callback]}
 *    }
 * ]
 * 
 * @param {Function} callback 被注册的函数
 */
function effect(callback) {
    // 把原来的 usedReactivities 清空，这样就不会把新的 callback 加到原来的 reactivity 里了
    usedReactivities = [];
    // 因为在调用 reactive 创建 po 的时候，已经注册了针对 object 的 proxy，
    // 所以在执行 callback 的同时，会触发 proxy 的 get 方法，
    // 把 [obj, prop] 存入 usedReactivities
    callback();

    // 利用 usedReactivities 整理出 callbacks，相当于用 obj 和 prop 对 callback 做一个索引
    for (let reactivity of usedReactivities) {
        // 防止空的情况
        // 第一层，添加 [{obj}, prop] 中的 {obj}
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map());
        }
        // 第二层，添加 [{obj}, prop] 中的 prop
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
            callbacks.get(reactivity[0]).set(reactivity[1], []);
        }

        // 把 callback 插入对应的两层 key 的 callback[] 里
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);

    }

    console.log('callbacks: ', callbacks);
    
    /* const callbacks = [
        {
            { a: { b: { c: 3 }}, b: 20, c: 30} => { 'a' => [()=>{console.log('po.a.b.c: ', po.a.b.c)}]}
        },
        {
            { b: { c: 3} } => { 'b' => [()=>{console.log('po.a.b.c: ', po.a.b.c);}]}
        },
        {
            { c: 3} => { 'c' => [()=>{console.log('po.a.b.c: ', po.a.b.c);}]}
        }
    ] */
}

/**
 * get 时提供 [obj, prop]
 * set 时依次调用 { obj => prop => callbacks } 里的 callbacks
 * 优化后的 set: { obj => {obj => prop}} 
 * @param {object} object obj to pass to proxy
 */
function reactive(object) {
    // 迭代的终止条件
    if (reactivities.has(object)) {
        return reactivities.get(object);
    }

    let proxy = new Proxy(object, {
            // 更改 object 的属性的值的时候，如果 callbacks 中有存了关于这个 object 的这个属性的回调函数，
            // 这些回调函数会被执行
            set(obj, prop, val) {
                console.log('setter object: ', object);
                console.log('obj: ', obj);
                console.log('prop: ', prop);
                console.log('val: ', val);
                obj[prop] = val;
                // 调用对应 callbacks
                if(callbacks.get(obj)) {
                    if(callbacks.get(obj).get(prop)) {
                        for( let callback of callbacks.get(obj).get(prop)) {
                            callback();
                        }
                    }
                }

                return obj[prop];
            },

            // get obj 的 prop 时，obj 和 prop 会作为 array 对儿被存入 usedReactivities
            // set 的时候，也要先一层层 get，到 set 目标层是，set val， 然后再 get 一遍
            get(obj, prop) {
                console.log('getter object: ', object);
                // 通过 Proxy 得到调用时传递的 obj 和 prop，储存起来
                usedReactivities.push([obj, prop]);
                console.log('usedReactivities: ', usedReactivities);
                // 如果 prop 是 Object，继续迭代到下一层,把下一层的 obj 注册位 proxy
                if (typeof obj[prop] === 'object') {
                    return reactive(obj[prop]);
                }

                return obj[prop];
            }
        }
    )

    console.log('proxy: ', proxy);


    // 在全局 reactivities 里标记已经存在的 proxy
    reactivities.set(object, proxy);

    return proxy;
}