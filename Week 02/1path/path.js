// TODO: Sorted 用二叉堆实现更好
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

    /**
     * 按 compare 取值
     */
    take() {
        if (!this.data.length)
            return;
        let min = this.data[0];
        let minIndex = 0;
        // 按给入 compare 取值，默认找到最小的值
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

    /**
     * 传入点
     * @param {number[]} v
     */
    give(v) {
        this.data.push(v);
    }

    /**
     * 取长度
     */
    get length() {
        return this.data.length;
    }
}

/**
 * 二叉堆
 * 父节点大于等于(小于等于)子节点的二叉树
 * 优点：原地排序，内存使用少
 *                      44
 *                  /       \
 *              42              35
 *          /       \       /       \
 *      33          31      19      27
 *  /       \       /
 * 10       26     14
 * [44, 42, 35, 33, 31, 19, 27, 10, 26, 14]
 * 
 * 方法: poll 取根节点 (这里和下面 take 的实现方法不同)
 * 取出根节点 (44)
 * 将最后的节点挪到根节点 (把 14 挪到原来 44 的位置 )
 * 比较父节点 (44) 和先对较大的子节点 (42)
 * 如果父节点的值比子节点小，交换父子节点的位置 ( 14 < 42 换)，直到不可再交换 (14 < 33 换， 14 < 26 换)
 *                      42
 *                  /       \
 *              33              35
 *          /       \       /       \
 *      26          31      19      27
 *  /       \
 * 10       14
 * [42, 33, 35, 26, 31, 19, 27, 10, 14]
 * 
 * 方法: insert 插入节点
 * 在堆的最后新建一个节点
 * 将数值赋予新节点
 * 将其节点与父节点比较
 * 如果比父节点大就交换位置，直到等于或小于父节点
 */


class BinarHeap {
    constructor(data, compare) {
        this.data = data;
        this.compare = compare;
    }

    /**
     * 取根节点
     */
    take() {
        if (!this.data.length) {
            return;
        }
        
        // 取出最小值
        let min = this.data[0];

        // 重拍后面的数
        let i = 0;
        while(i < this.data.length) {
            // 因为 3，如果当前节点又两个子节点，指针不会停留在自己身上，所以结束指针的情况只有 1 和 2
            // 1. 如果当前节点的左子节点超出范围，既没有子节点了，结束当前循环，指针仍指向自己
            if (i * 2 + 1 >= this.data.length) {
                break;
            }
            // 2. 如果当前节点的左子节点没有超出范围，而右子节点超出了，既左子节点就是最后一个值
            if(i * 2 + 2 >= this.data.length) {
                // 当前节点的值被赋值为自己的左子节点的值
                this.data[i] = this.data[i * 2 + 1];
                // 指针指向左子节点的位置，既最后一个位置
                i = i * 2 + 1;
                break;
            }

            // 3. 把较小的子节点的值赋值给父节点，指针指向较小子节点的位置
            if(this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0) {
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1;
            } else {
                this.data[i] = this.data[i * 2 + 2];
                i = i * 2 + 2;
            }
        }
        // 如果最后的指针指的不是最后一个，如情况 1，把最后的值赋给结束指针，并删除最后一个值
        if (i < this.data.length - 1) {
            this.insertAt(i, this.data.pop());
        }
        // 如果指针的位置就是最后一个值，直接删除。因为在 2 的情况下，已经把值赋给组节点了
        else {
            this.data.pop();
        }

        return min;
    }

    /**
     * 插入值到目标位置
     * @param {number} i 目标位置
     * @param {any} v 要插入的值
     */
    insertAt(i, v) {
        // 先把值赋到 i 的位置
        this.data[i] = v;
        // Math.floor( (i - 1) / 2 ) 自己的父节点
        // 和自己的父节点的值进行比较
        while( i > 0 && this.compare(v, this.data[Math.floor( (i - 1) / 2 )]) < 0 ) {
            // 如果自己小于父节点的值，和父节点互换位置，并把指针指向父节点
            // 既指针指针跟着值走，直到大于等于父节点的值
            this.data[i] = this.data[Math.floor( (i - 1) / 2)];
            this.data[Math.floor( (i - 1)/ 2)] = v;
            i = Math.floor( (i - 1) / 2);
        }
    }

    /**
     * 在末尾插入值
     * @param {any} v
     */
    insert(v) {
        console.log(v);
        this.insertAt(this.data.length, v);
    }

    get length() {
        return this.data.length;
    }
}

// 构建地图和编辑器
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
    // 可以用 e.which === 3， 但 which is no longer recommended，最好用 button
    clear = (e.button === 2);
});
document.addEventListener('mouseup', () => mousedown = false)
// 因为要使用右键，所以要阻止默认行为（弹出菜单）
document.addEventListener('contextmenu', e => e.preventDefault());

/**
 * 延时
 * @param {number} t millisecond
 */
function sleep(t) {
    return new Promise((resolve) => {
        setTimeout(resolve, t);
    })
}

/**
 * Note 1: JS数组实现 queue 和 stack
 * 添加    unshift()           push()
 *                  [0, 1, 2, 3]
 * 删除    shift()             pop()end 
 */

/**
 * 找到最优路径
 * @param {number[]} map 
 * @param {number[]} start 
 * @param {number[]} end 
 */
async function findPath(map, start, end) {
    container.children[end[1] * 100 + end[0]].style.backgroundColor = 'red';

    // 队列，先进先出，实现广度优先搜索 (如果用stack的数据结构，可以实现深度优先搜索)
    // let queue = [start];
    // 用 Sorted 类管理队列
    // let queue = new Sorted([start], (a, b) => distance(a) - distance(b));
    // 用 BinarHeap 类管理队列
    let queue = new BinarHeap([start], (a, b) => distance(a) - distance(b));
    
    // 平行做一个记录，记录当前节点的父节点 pre
    let table = Object.create(map);

    async function insert(x, y, pre) {
        // 如果超出左右下上边界，不插入
        if (x < 0 || x >= 100 || y < 0 || y >= 100)
            return;
        // 如果给的点已经标记过(有墙,或者找到过)，不插入
        // TODO: 继续优化回溯路径
        if (table[y * 100 + x])
            return;

        // 过程可视化
        await sleep(1);
        
        /**
         * Note 2: childNodes 和 children 的区别
         * childNodes 返回所有节点，包括元素节点，文本节点，注释节点等
         * children 只返回元素节点
         */
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen';

        // 标记传入的点
        // 传入的点如果符合条件，就加入到queue里
        // queue.push([x, y]);
        // queue.give([x, y]);
        queue.insert([x, y]);
        
        // 标记前驱点
        // TODO: 继续优化回溯路径
        table[y * 100 + x] = pre;
    }

    /**
     * 计算所给点到终点的距离
     * -.-------
     * | \
     * |  \
     * |___.
     * |
     * @param {number[]} point
     */
    function distance(point) {
        // 因为只是用于比较，所以不用开根号了，节省资源
        return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
    }

    // 如果queue不为空
    while(queue.length) {
        // 取出queue最前面的那个点，
        // let [x, y] = queue.shift();
        // 取出离终点最近的点
        let [x, y] = queue.take();
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