# 学习笔记 Week 1

## 编程思想

### 用数学的方法简化数据结

#### color

交替的值符合交换律的话，可以用单一值储存，用数学方法赋值
交换： color = 3 = color

#### map

2D -> 1D map: x 轴是 列数 的倍数的余数， y 轴是 行数 的倍数
[x][y] = [x * 3 + y]
优点：节省内存空间，简化复制操作

2D坐标系循环，内层是 x，外层是 y
i 表示 x 轴上的坐标，横向的，所以在坐标系中是 y
j 同理
    |
    |
x(j)|__________
   y(i)

### 换位的思想

#### bestChoice

对方最差，就是我的最好 + 递归

## 语法点

### 三元运算简化if

(```)
    cell.innerText =
        pattern[i * 3 + j] === X_VALUE ? 'X' :
        pattern[i * 3 + j] === O_VALUE ? 'O' : '';
(```)

### 赋值并判断

(```)
    let p;
        // N给 p 赋值并判断
        if (p = willWin(pattern, color)) {
            return {
                point: p,
                result: 1,
            }
        }
(```)

### 给for循环命名

(```)
    outer: for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(result === 1) {
                break outer;
            }
        }
    }
(```)

### 异步的三个fangfa

callback, promise, async/await
promise 的关键在于，帮助异步函数用同步的方法写出。这样有利于功能上的替换，如 delay 和 happen 函数的替换
