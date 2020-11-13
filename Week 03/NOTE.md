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

如果栈顶是 MultiplicativeExpression，看下一位是否是 * 或者 / 号， 如果是，前三项则是一个完整的 MultiplicativeExpression，包在一起

```js
-->
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
-->
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
