# 学习笔记 Week 3

## 编程思想

### 编译器 (这节课在干嘛)

源代码 --> Compiler - 静态计算 -> 目标程序 --> 计算机 - 动态计算 -> 计算结果

编译器的目的是把一个语言在语义相同的前提下，传换成另一种语言的表达，被转换的语言再被计算机执行。

编译器 = 翻译员：只管原封不动的转换成另一种语言，怎么理解是阅读翻译的事儿

Input --> Compiler --> Output

I --> 前端： 词法分析，语法分析 -抽象语法树(AST)-> 后端: 指令生成，优化 --> O

源程序 --> 词法分析器(tokenizer) - 记号(token) -> 语法分析器 - AST -> 语义分析器 --> 中间层

词法分析器就是把源程序当 string 分析，拆分 string，给每一个 string 添加一些属性，把这些附带属性的 string 当作一个节点。添加这些属性的目的是帮助语法分析器理清节点间的关系，LL 案例中添加的是 type 和 value 属性。

语法分析器就是给这些节点根据一定的规则，比如 LL，排列起来，找到节点之间的关系，以便用于理解语义。

### 词法分析 & 语法分析 (怎么干的)

#### 词法分析：正则表达式

```js
// ()为分组捕获，匹配到其中一个()内结果时，结束此次搜索
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

while(true) {
        // 更新上一次找到的 index
        lastIndex = regexp.lastIndex;
        /**
         * Note 1: exec()
         * exec 可多次对同一字符串进行查找，下一次的查找会从正则自己的 lastIndex 属性开始
         * 返回值为一个 类array 的 object
         * result 中的属性：
         * [0]: The full string of characters matched
         * [1], ...[n]: The parenthesized substring matches, if any. 括号中的分组捕获
         * index: The 0-based index of the match in the string.
         * input: The original string that was matched against.
         * 注意：即使 exec 换了另一个 string， lastIndex 也不会改变
         * 
         * result 的第一个值:
         * {
         *  0: '1024'
         *  1: '1024'
         *  2: undefined
         *  3: undefined
         *  4: undefined
         *  5: undefined
         *  6: undefined
         *  7: undefined
         *  groups: undefined
         *  index: 0
         *  input: '1024 + 10 * 25'
         *  length: 8
         * }
         */
        result = regexp.exec(source);

        // 如果没有找到结果，跳出 while(true)
        if(!result) break;
        // 如果新找到的位置长于上次找到的位置，说明中间右不被识别的字符，跳出
        if(regexp.lastIndex - lastIndex > result[0].length) break;
```

#### 语法分析：LL(1)

从左(L)向右读入程序，最左(L)推导，采用一个(1)前看符号:

L：从左到右一个一个读入记号
L：在推导的过程当中，每次总是选择当前的串中，最左的非终结符做替换
1：用 1 个位处理符号作为辅助，决定怎样做这个推导。它是一个做辅助判断用的符号

特点: 分析高效（线性时间，从左到右扫描一遍就能完成），错误定位儿火诊断信息准确
算法基本思想：栈（递归） -> 表驱动的分析算法(Table-Driven Algorithm)

##### 四则运算(栈的实现)

语法定义(产生式) <<终结符>>
  
    <Expression>::=
        <AddictiveExpression><<EOF>>

    <AdditiveExpression>::=
        <MultiplicativeExpression>
        |<AdditiveExpression><<+>><MultiplicativeExpression>
        |<AdditiveExpression><<->><MultiplicativeExpression>

    <MultiplicativeExpression>::=
        <<Number>>
        |<MultiplicativeExpression><<*>><<Number>>
        |<MultiplicativeExpression><</>><<Number>>

例1. MultiplicativeExpression: 10 * 25 / 2

```js

    [
        // 栈顶
        {
            type: 'Number',
            value: '10',
        },
        {
            type: '*',
            value: '*',
        },
        {
            type: 'Number',
            value: '25',
        },
        {
            type: '/',
            value: '/',
        },
        {
            type: 'Number',
            value: '2',
        },
        {
            type: 'EOF',
        },
        // 栈底
    ]

```

每次递归都先检查栈顶，
如果栈顶是 Number，把它包成 MultiplicativeExpression
对应产生式
    \<MultiplicativeExpression>::=
        \<Number>

```js
[
    // 栈顶
    { type: 'MultiplicativeExpression', children: [{ type: 'Number', value: '10'}]},
    {
        type: '*',
        value: '*',
    },
    {
        type: 'Number',
        value: '25',
    },
    {
        type: '/',
        value: '/',
    },
    {
        type: 'Number',
        value: '2',
    },
    {
        type: 'EOF',
    },
    // 栈底
]
```

如果栈顶是 MultiplicativeExpression，看下一位是否是 \* 或者 / 号， 如果是，前三项则是一个完整的 MultiplicativeExpression，包在一起
对应产生式
    \<MultiplicativeExpression>::=
        |\<MultiplicativeExpression><*>\<Number>
        |\<MultiplicativeExpression></>\<Number>

```js
[
    // 栈顶
    {
        type: 'MultiplicativeExpression',
        operator: '*',
        children: [
            { type: 'MultiplicativeExpression', children: [{ type: 'Number', value: '10'}]},
            { type: '*', value: '*'},
            { type: 'Number', value: '25'},
        ]，
    }
    {
        type: '/',
        value: '/',
    },
    {
        type: 'Number',
        value: '2',
    },
    {
        type: 'EOF',
    },
    // 栈底
]
```

继续递归 MultiplicativeExpression -->

```js
[
    // 栈顶
    {
        type: 'MultiplicativeExpression',
        operator: '/',
        children: [
            {
                type: 'MultiplicativeExpression',
                operator: '*',
                children: [
                    { type: 'MultiplicativeExpression', children: [{ type: 'Number', value: '10'}]},
                    { type: '*', value: '*'},
                    { type: 'Number', value: '25'},
                ]，
            },
            {
                type: '/',
                value: '/',
            },
            {
                type: 'Number',
                value: '2',
            },
        ],
    },
    {
        type: 'EOF',
    },
    // 栈底
]
```

如果栈顶是 MultiplicativeExpression，下一位是 EOF，也就是到了栈底，那这个 MultiplicativeExpression 就是最终结果。

过程的树状图：

---
    Multi(N)  *   25  /   2   EOF
        |
        10
---
        Multi(*)    /   2   EOF
      /      | \
    Multi(N) *  25
        |
        10
---
                    Expression
                    /       \
                Multi(/)       EOF
            /     |     \
        Multi(*)  /       2
      /      | \
    Multi(N) *  25
        |
        10
---
例2. AdditiveExpression 1 + 2 * 5

```js
[
    {
        type: 'Number',
        value: '1',
    },
    {
        type: '+',
        value: '+',
    },
    {
        type: 'Number',
        value: '2',
    },
    {
        type: '*',
        value: '*',
    },
    {
        type: 'Number',
        value: '5',
    },
    {
        type: 'EOF',
    }
]
```

如果第一项既不是 Multi 也不是 Add，就应该是一个 Number，所以要先执行一次 MultiExpression()，把第一项包裹为 Multi

```js
[
    {
        type: 'MultiplicativeExpression',
        children: { type: 'Number', value: '1'},
    },
    {
        type: '+',
        value: '+',
    },
    {
        type: 'Number',
        value: '2',
    },
    {
        type: '*',
        value: '*',
    },
    {
        type: 'Number',
        value: '5',
    },
    {
        type: 'EOF',
    }
]
```

如果第一项是 Multi，则被包裹为 Add
对应产生式
\<AdditiveExpression>::= \<MultiplicativeExpression>

```js
[
    {
        type: 'AdditiveExpression',
        children: [
            type: 'Multi'
            children: [{ type: 'Number', value: '1'},]
        ],
    },
    {
        type: '+',
        value: '+',
    },
    {
        type: 'Number',
        value: '2',
    },
    {
        type: '*',
        value: '*',
    },
    {
        type: 'Number',
        value: '5',
    },
    {
        type: 'EOF',
    }
]
```

如果第一项是 Add，第二项是 +/-，说明第三项不是 Multi 就是 Number。因为 Number 也是 Multi 的一种，所以处理完前两项后(把第一项和第二项加入 Add Node 的 Children 里)，要执行 MultiplicativeExpression()，处理第三项和它相关的 Multi, 在加入 Add Node 的children 里
对应产生式
\<AdditiveExpression>::=
    \<AdditiveExpression><<+>>\<MultiplicativeExpression>
    |\<AdditiveExpression><<->>\<MultiplicativeExpression>
递归完第三项的 Multi 后，第一项为 Add，第二项为 EOF，递归结束，包裹为 Expression

```js
[
    {
        type: 'AdditiveExpression',
        operator: '+',
        children: [
            {
                type: 'Multi'
                children: [{ type: 'Number', value: '1'},]
            },
            {
                type: '+',
                value: '+',
            },
            {
                type: 'MultiplicativeExpression',
                operator: '*'
                children: [
                    {
                        type: 'MultiplicativeExpression',
                        children: [ { type: 'Number', value: '2'}]
                    },
                    {
                        type: '*',
                        value: '*',
                    },
                    {
                        type: 'Number',
                        value: '5',
                    }
                ],
            },
        ],
    },
    {
        type: 'EOF'
    }
]
```

过程的树状图：

---
      Multi(N)   +   2   *   5
        |
        1
---
      Add(M)    +   2   *   5
        |
      Multi(N)
        |
        1
---

                Add(+)
            /    |      \
          Add(M) +
         |
      Multi(N)      Multi(N)   *   5   EOF
        |               |
        1               2
---


                   Expression
                    /       \
                Add(+)       EOF
            /    |      \
          Add(M) +       Multi(*)
         |              /    |   \
      Multi(N)      Multi(N) *    5
        |               |
        1               2

#### 表驱动的分析算法

没弄明白，待续
