let $ = Symbol('$');

class Trie {
    constructor() {
        this.root = Object.create(null);
    }

    /**
     * 插入字符串到 Trie 里
     * @param {string} word 要插入到 Trie 里的字符串
     */
    insert(word) {
        let node = this.root;
        /**
         * 语法点1:
         * let i in 'str': 0, 1, 2
         * let c of 'str': 's', 't', 'r'
         */
        for(let c of word) {
            if(!node[c]) {
                node[c] = Object.create(null);
            }
            node = node[c];
        }
        /**
         * 语法点2：
         * obj = { a: 1, b: 2};
         * 'a' in obj: true
         */
        // for循环结束后，node就是最底层的节点，
        // 如果它还没有$属性，说明是新出现的，给它加上$属性，值为0
        if(!($ in node)) {
            node[$] = 0;
        }
        // 计数
        node[$]++
    }

    most() {
        let max = 0;
        let maxWord = null;

        // 递归查找节点
        let visit = (node, word) => {
            /**
             * 语法点3：
             * symbo 必须用 []
             */
            // $ 代表一个词的结束
            if (node[$] && node[$] > max) {
                max = node[$];
                maxWord = word;
            }
            for (let p in node) {
                visit(node[p], word + p);
            }
        }

        // 开始查找
        visit(this.root, '');

        console.log('max: ', max);
        console.log('maxWord: ', maxWord);
    }
}

function randomWord(length) {
    var s = '';
    for (let i = 0; i < length; i += 1) {
        s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0));
    }
    return s;
}

const trie = new Trie();

for(let i = 0; i < 100000; i += 1) {
    trie.insert(randomWord(4));
}

trie.most();