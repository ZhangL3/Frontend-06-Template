// ()为分组捕获，匹配到其中一个()内结果时，结束此次搜索
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

let dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function tokenize(source) {
    let result = null;
    while(true) {
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
         */
        result = regexp.exec(source);

        if (!result) break;

        for(let i = 0; i <= dictionary.length; i += 1) {
            if(result[i]) {
                console.log('dictionary[i - 1]: ', dictionary[i - 1]);
            }
        }
        
        console.log('result: ', result);
        /**
         * result:
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
    }
}

tokenize('1024 + 10 * 25');