/**
 * 四则运算
 *  词法定义
 *      TokenNumber:
 *          1 2 3 4 5 6 7 8 9 0 的组合
 *      Operator: +, -, * / 之一
 *      Whitespace: <SP>
 *      LineTerminator: <LF><CR>
 *  语法定义(产生式) <<终结符>>
 * 
 *      <Expression>::=
 *          <AddictiveExpression><<EOF>>
 * 
 *      <AdditiveExpression>::=
 *          <MultiplicativeExpression>
 *          |<AdditiveExpression><<+>><MultiplicativeExpression>
 *          |<AdditiveExpression><<->><MultiplicativeExpression>
 * 
 *      <MultiplicativeExpression>::=
 *          <<Number>>
 *          |<MultiplicativeExpression><<*>><<Number>>
 *          |<MultiplicativeExpression><</>><<Number>>
 * 
 *                                  Expression
 *                                /            \
 *                              Add             EOF(End Of File)
 *                       /       |       \
 *                  Multi    Add + Multi  Add - Multi
 *             /    |   \
 *          Num  Multi * Num Multi / Num
 * 
 * 
 */
// ()为分组捕获，匹配到其中一个()内结果时，结束此次搜索
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

let dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(source) {
    let result = null;
    let lastIndex = 0;
    
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

        // 如果没有找到结果，跳出
        if(!result) break;
        // 如果新找到的位置长于上次找到的位置，说明中间右不被识别的字符，跳出
        if(regexp.lastIndex - lastIndex > result[0].length) break;

        let token = {
            type: null,
            value: null,
        };

        for(let i = 0; i <= dictionary.length; i += 1) {
            if(result[i]) {
                // 因为 result 的第一位是找到的值，从第二位开始时分组捕获的值，所以要 i - 1
                token.type = dictionary[i - 1];
            }
        }
        token.value = result[0];
        // 找到了一个 token，就 return 这个 token 并停下，等待下次请求
        yield token;
    }

    // 不再有值了，输出 End Of File
    yield {
        type: 'EOF',
    }
}

let source = [];

// tokenize 是一个 generator 函数，所以 return 的是一个 iterator，可用 let of 调用
for (let token of tokenize('10 * 25 / 2')) {
// for (let token of tokenize('1 + 2 + 3')) {
    if(token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
        console.log('token: ', token);
        source.push(token);
    }
}

// LL 语法分析，每一个产生式对应一个函数
function Expression(tokens) {
    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
        let node = {
            type: 'Expression',
            children: [ source.shift(), source.shift()],
        };
        source.unshift(node);
        return node;
    }
    AdditiveExpression(source);
    return Expression(source);
}

function AdditiveExpression(source) {
    if(source[0].type === 'MultiplicativeExpression') {
        let node = {
            type: 'AdditiveExpression',
            children: [source[0]],
        };
        source[0] = node;
        return AdditiveExpression(source);
    }

    if(source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
        let node = {
            type: 'AdditiveExpression',
            operator: '+',
            children: [],
        };
        node.children.push(source.shift());
        node.children.push(source.shift());
        // 第三项是非终结符，所以要调用 Multi
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }

    if(source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
        let node = {
            type: 'AdditiveExpression',
            operator: '-',
            children: [],
        };
        node.children.push(source.shift());
        node.children.push(source.shift());
        // 第三项是非终结符，所以要调用 Multi
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }

    if(source[0].type === 'AdditiveExpression') {
        return source[0];
    }

    // 如果第一个是 number， 或者 Multi 没有完整执行的话，先调用 Multi，因为 number 就是 Multi 的一种
    MultiplicativeExpression(source);
    return AdditiveExpression(source);
}

function MultiplicativeExpression(source) {
    if(source[0].type === 'Number') {
        let node = {
            type: 'MultiplicativeExpression',
            children: [source[0]],
        }
        source[0] = node;
        return MultiplicativeExpression(source);
    }

    if(source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '*') {
        let node = {
            type: 'MultiplicativeExpression',
            operator: '*',
            children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }

    if(source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '/') {
        let node = {
            type: 'MultiplicativeExpression',
            operator: '/',
            children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    // 递归结束的条件
    if(source[0].type === 'MultiplicativeExpression') {
        return source[0];
    }

    return MultiplicativeExpression(source);
}

// console.log('MultiplicativeExpression(source): ', MultiplicativeExpression(source));
// console.log('AdditiveExpression(source): ', AdditiveExpression(source));
console.log('Expression(): ', Expression());
