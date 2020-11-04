/**
 * 自定义一个数据结构，每次 take 都是 data 里的最小值, 如果用默认 compare 函数的话
 */
class Sorted {
    /**
     * 
     * @param {*} data 
     * @param {*} compare 
     */
    constructor(data, compare) {
        // slice() 浅拷贝
        this.data = data.slice();
        // 和 sort() 一样，可以传 compare 函数
        this.compare = compare || ((a, b) => a - b);
    }

    take() {
        if (!this.data.length)
            return;
        let min = this.data[0];
        let minIndex = 0;
        // 默认找到最小的值
        // 这里其实可以用 Math.min() 函数
        // 但是因为后面删除的时候要用的 index， 所以直接用 for 循环更省资源
        for (let i = 1; i < this.data.length; i ++) {
            if (this.compare(this.data[i], min) < 0) {
                min = this.data[i];
                minIndex = i;
            }
        }
        // 删除找出的值，但不用 splice() ,因为 splice() 是 O(n) 的复杂度，可以用更简单的 O(1)
        // 找到的 min 值已经被存好了，所以 minIndex 可以用来存最后一位的值，然后删掉最后一位就可以了
        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop();
        return min;
    }

    give(v) {
        this.data.push(v);
    }
}

let map = localStorage['map'] ? JSON.parse(localStorage['map']) : Array(10000).fill(0);

let container = document.getElementById('container');
for(let y = 0; y < 100; y++ ) {
    for(let x = 0; x < 100; x++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');

        if (map[100*y + x] === 1)
            cell.style.backgroundColor = 'black';

        cell.addEventListener('mousemove', () => {
            if(mousedown) {
                if(clear) {
                    cell.style.backgroundColor = '';
                    map[100*y + x] = 0;
                } else {
                    cell.style.backgroundColor = 'black';
                    map[100*y + x] = 1; 
                }
            }
        });
        container.appendChild(cell);
    }
}

let mousedown = false;
let clear = false;
document.addEventListener('mousedown', e => {
    mousedown = true;
    clear = (e.which === 3);
});
document.addEventListener('mouseup', () => mousedown = false)
// 因为要使用右键，所以要阻止默认行为（弹出菜单）
document.addEventListener('contextmenu', e => e.preventDefault());

function sleep(t) {
    return new Promise((resolve) => {
        setTimeout(resolve, t);
    })
}

/* 
JS 的数组实现 queue 和 stack
添加    unshift()           push()
                [0, 1, 2, 3]
删除    shift()             pop()
*/
async function findPath(map, start, end) {
    // 队列，先进先出，实现广度优先搜索 (如果用stack的数据结构，可以实现深度优先搜索)
    let queue = [start];
    // 平行做一个记录，记录当前节点的父节点 pre
    let table = Object.create(map);

    async function insert(x, y, pre) {
        // 如果超出左右下上边界，不插入
        if (x < 0 || x >= 100 || y < 0 || y >= 100)
            return;
        // 如果给的点已经标记过(有墙,或者找到过)，不插入
        if (table[y * 100 + x])
            return;

        // 过程可视化
        // await sleep(1);
        
        /**
         * childNodes 和 children 的区别
         * childNodes 返回所有节点，包括元素节点，文本节点，注释节点等
         * children 只返回元素节点
         */
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen';

        // 标记传入的点
        // 传入的点如果符合条件，就加入到queue里
        queue.push([x, y]);

        table[y * 100 + x] = pre;
    }

    // 如果queue不为空
    while(queue.length) {
        // 取出queue最前面的那个点，
        let [x, y] = queue.shift();
        // 如果取出的点是 end，回溯 pre 记录，找到路径
        if (x === end[0] && y === end[1]) {
            let path = [];

            while(x !== start[0] || y !== start[1]) {
                path.push(map[y * 100 + x]);
                [x, y] = table[y * 100 + x];
                await sleep(15);
                container.children[y * 100 + x].style.backgroundColor = 'purple';
            }
            return path;
        }
        // 如果不是 end，把当前点四周(8个方位)的点加入队列
        // 正向
        // 取左点
        await insert(x - 1, y, [x, y]);
        // 取上点
        await insert(x, y - 1, [x, y]);
        // 取右点
        await insert(x + 1, y, [x, y]);
        // 取下点
        await insert(x, y + 1, [x, y]);

        // 斜向
        // 取左上点
        await insert(x - 1, y - 1, [x, y]);
        // 取右上点
        await insert(x + 1, y - 1, [x, y]);
        // 取左下点
        await insert(x - 1, y + 1, [x, y]);
        // 取左上点
        await insert(x + 1, y + 1, [x, y]);


    }
    // 如果队列都找完了，还取不到 end， 返回 false
    return null;
}