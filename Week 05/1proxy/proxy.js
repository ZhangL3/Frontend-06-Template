let object = {
    a: 1,
    b: 2,
};

let po = new Proxy(object, {
    set(obj, prop, val) {
        console.log('obj: ', obj);
        console.log('prop: ', prop);
        console.log('val: ', val);
    }
})

function reactive(object) {
    return new Proxy(object, {
            set(obj, prop, val) {
                console.log('obj: ', obj);
                console.log('prop: ', prop);
                console.log('val: ', val);
            },

            get(obj, prop) {
                console.log('obj: ', obj);
                console.log('prop: ', prop);
            }
        }
    )
}