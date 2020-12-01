/**
 * {
 *      obj => { prop => [()=>{callback()}, ...]}
 * }
 */
let callbacks = new Map();

let reactivities = new Map();

let usedReactivities = [];

let obj = {
    a: {
        b: {
            c: 3,
        },
    },
    b: 20,
    c: 30,
};

let po = reactive(obj);

// Binding referenced property of object and function
effect(() => {
    console.log('po.a.b.c: ', po.a.b.c);
})

/**
 * Index object and callback
 * @param {function} callback
 */
function effect(callback) {

    usedReactivities.length = 0;

    callback();

    for (let reacti of usedReactivities) {
        console.log('reacti: ', reacti);
        if (!callbacks.has(reacti[0])) {
            callbacks.set(reacti[0], new Map());
            if (!callbacks.get(reacti[0]).has(reacti[1])) {
                callbacks.get(reacti[0]).set(reacti[1], []);
            }
        }
        callbacks.get(reacti[0]).get(reacti[1]).push(callback);
    }

    console.log('callbacks: ', callbacks);
}

/**
 * Subscribe the change of object
 */
function reactive(obj) {

    if (reactivities.has(obj)) {
        return reactivities.get(obj);
    }

    const proxy = new Proxy(obj, {

        set(obj, prop, val) {
            obj[prop] = val;
            if (callbacks.has(obj) && callbacks.get(obj).has(prop)) {
                callbacks.get(obj).get(prop).forEach((cb) => {
                    cb();
                })
            }

            return obj[prop];
        },

        get(obj, prop) {
            usedReactivities.push([obj, prop]);
            console.log('usedReactivities: ', usedReactivities);
            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop]);
            }
            return obj[prop];
        }
    });

    reactivities.set(obj, proxy);

    return proxy;
}