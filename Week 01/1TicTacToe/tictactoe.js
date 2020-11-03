/**
 * Note 1: 数据结构
 * 2D -> 1D map: x 轴是 列数 的倍数的余数， y 轴是 行数 的倍数
 * [x][y] = [x * 3 + y]
 * 优点：节省内存空间，简化复制操作
 */
let pattern = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

/**
 * Note 2: 数据结构
 * 交替的值符合交换律的话，可以用单一值储存，用数学方法赋值
 * 交换： color = 3 = color
 */
const O_VALUE = 1;
const X_VALUE = 2;
let color = O_VALUE;

/**
 * Render map
 */
function show() {
    const board = document.getElementById('board');

    board.innerHTML = '';

    for(let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.innerText = 
                pattern[i * 3 + j] === X_VALUE ? 'X' :
                pattern[i * 3 + j] === O_VALUE ? 'O' : '';
            cell.addEventListener('click', () => userMove(i, j));
            board.append(cell);
        }
        board.appendChild(document.createElement('br'));
    }
}

/**
 * Render user move, switch active player
 * @param {number} x 
 * @param {number} y 
 */
function userMove(x, y) {
    pattern[x * 3 + y] = color;
    if (check(pattern, color)) {
        alert(color === X_VALUE ? `X will win at ${willWin(pattern, color)} !` : `O will win at ${willWin(pattern, color)} !`);
    }
    color = 3 - color;
    show();
    computerMove();
}

/**
 * Render computer move, switch active player
 */
function computerMove() {
    let choice = bestChoice(pattern, color);
    console.log('bestChoice of computer: ', choice);
    if(choice.point)
        pattern[choice.point[1] * 3 + choice.point[0]] = color;
    if(check(pattern, color)) {
        alert(color === X_VALUE ? `X will win at ${willWin(pattern, color)} !` : `O will win at ${willWin(pattern, color)} !`);
    }
    color = 3 - color;
    show();
}

/**
 * Check whether any player already wins
 * @param {number[]} pattern currently map
 * @param {number} color value of active player
 */
function check(pattern, color) {
    // 检查行
    for(let i = 0; i < 3; i += 1) {
        let win = true;
        for (let j = 0; j < 3; j += 1) {
            if (pattern[i * 3 + j] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    // 检查列
    for(let i = 0; i < 3; i += 1) {
        let win = true;
        for (let j = 0; j < 3; j += 1) {
            if (pattern[j * 3 + i] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    // 右上到左下:
    // 在2D地图上，纵轴(值为x)每+1，横轴(值为y)从最后一位向前挪一位,最多可以挪 宽度-1 次 => y = (宽度-1) - x
    // 转成 3*3 1D 地图上: x + 1 => j * 3, y => 2 - j
    {
        let win = true;
        for(let j = 0; j < 3; j += 1) {
            if(pattern[j * 3 + 2 - j] !== color) {
                win = false;
            }
        }
        if(win) {
            return true;
        }
    }
    // 左上右下斜 x = y
    {
        let win = true;
        for(let j = 0; j < 3; j += 1) {
            if(pattern[j * 3 + j] !== color) {
                win = false;
            }
        }
        if(win) {
            return true;
        }
    }
}

/**
 * 复制地图
 * @param {number[]} pattern
 */
function clone(pattern) {
    return Object.create(pattern);
}

/**
 * 遍历所有没有落子的点位，检查在当前情况下,下一步是否会赢
 * @param {number[]} pattern 
 * @param {number} color 
 */
function willWin(pattern, color) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i * 3 + j])
                continue;
            let tmp = clone(pattern);
            tmp[i * 3 + j] = color;
            if(check(tmp, color)) {
                /**
                 * Note 3: 数据结构
                 * 2D坐标系循环，内层是 x，外层是 y
                 * i 表示 x 轴上的坐标，横向的，所以在坐标系中是 y
                 * j 同理
                 * 
                 *     0______________x(j)
                 *     |(00) (01) (02)
                 *     |(10) (11) (12)
                 *     |(20) (21) (22)
                 * y(i) 
                 */
                return [j, i];
            }
        }
    }
    return null;
}

/**
 * 计算下一步最有利的位置
 * result: 1 胜， 0 和， -1 负
 * @param {number[]} pattern 
 * @param {number} color 
 */
function bestChoice(pattern, color) {
    let p;
    // N给 p 赋值并判断
    if (p = willWin(pattern, color)) {
        return {
            point: p,
            result: 1,
        }
    }
    let result = -2;
    let point = null;
    // 把空白的所有格子遍历一遍
    outer: for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(pattern[i * 3 + j])
                continue;
            let tmp = clone(pattern);
            tmp[i * 3 + j] = color;
            // 当我走这步的时候，对手的最好的选择是什么
            let r = bestChoice(tmp, 3 - color).result;
            // 对手最好，意味着我最坏。我最坏的结果比之前的选择要好，那就暂定当前这个最坏的结果
            if(-r > result) {
                result = -r;
                point = [j, i];
            }
            // 如果已经找到对对手最坏，对自己最好的结果，可以直接输出（胜负剪枝）
            if(result === 1) {
                break outer;
            }
        }
    }
    return {
        point,
        result: point ? result : 0
    }
}

show();
console.log('bestChoice: ', bestChoice(pattern, color));

/* function coordinate(row, col) {
    let r = '';
    for (let i = 0; i < col; i++) {
        for( let j = 0; j < row; j++) {
            r += ` ${i},${j} `
        }
        console.log(`${r}\n`);
        r = '';
    }
}
coordinate(2, 3) */