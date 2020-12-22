const EOF = Symbol('EOF'); // EOF: End Of File

// 状态机的初始化方法，因为 HTML 标准里第 12.2.5 Tokenization 里用 data 来命名，这里也用 data 来命名
function data(c) {

}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);
    let state = data;
    for (c of html) {
        state = state(c);
    }
    
    // 文本结束时可能没有结束符，所以在这里给定一个结束符。
    // 这里的结束符不能有任何意义，所以用来 Symbol
    state = state(EOF);
}