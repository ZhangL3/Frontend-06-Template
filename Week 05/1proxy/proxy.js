let callbacks = new Map();

// 储存被调用了哪个变量 [{obj}, prop][]
let usedReactivities = [];

let object = {
    a: 1,
    b: 2,
};

let po = reactive(object);

/**
 * 对 obj 的 prop 注册函数, 如果 prop 被更改，就会调用注册了的函数
 */
effect(() => {
    // 这里的 po 调用可以触发 get 里的语句，把通过 Proxy 传递的 obj 和 prop 储存起来
    // 既在 usedReactivities 里存 [{a: 1, b: 2}, 'a']
    console.log('po.a: ', po.a);
})

/**
 * callbacks = [
 *    {
 *       obj => { prop => [callback]}
 *    }
 * ]
 * 
 * @param {Function} callback 被注册的函数
 */
function effect(callback) {
    usedReactivities = [];
    // 执行 callback 的同时，触发 reactive (即proxy) 的 get 方法，把 [obj, prop] 放入 usedReactivities
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
    
    /* const callbacks = [
        {
            { a: 1, b: 2} => { 'a' => [()=>{console.log('po.a: ', po.a);}]}
        }
    ] */
}

/**
 * get 时提供 [obj, prop]
 * set 时依次调用 { obj => prop => callbacks } 里的 callbacks
 * @param {object} object obj to pass to proxy
 */
function reactive(object) {
    return new Proxy(object, {
            // 更改 object 的属性的值的时候，如果 callbacks 中有存了关于这个 object 的这个属性的回调函数，
            // 这些回调函数会被执行
            set(obj, prop, val) {
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
            get(obj, prop) {
                // 通过 Proxy 得到调用时传递的 obj 和 prop，储存起来
                usedReactivities.push([obj, prop]);

                return obj[prop];
            }
        }
    )
}