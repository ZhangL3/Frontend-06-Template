const EOF = Symbol('EOF'); // EOF: End Of File

/**
 * 状态机的初始化方法，因为 HTML 标准里第 12.2.5 Tokenization 里用 data 来命名，这里也用 data 来命名
 * @param {string} c character
 */
function data(c) {
    // 标签开始，但还不知道是哪种标签
    if (c === '<') {
        return tagOpen;
    } else if ( c === EOF ) {
        return ;
    } else {
        // 除了 < ，都被认为是文本节点，这里先忽略
        return data;
    }
}

/**
 * 解析 < 后的字符
 * @param {string} c character
 */
function tagOpen(c) {
    if (c === '/') {
        state = endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else {
        return ;
    }
}

/**
 * </
 * @param {string} c character
 */
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else if (c === '>') {
        // throw error
    } else if (c === EOF) {
        // throw error
    } else {

    }
}

/**
 * 解析标签名
 * @param {*} c 
 */
function tagName(c) {
    // 如果 tag 有属性，tagName 以空白符为结束 (<div prop)
    // 空白符有四种: tab符(\t), 换行符(\n), 禁止符(\f), 空格( )
    if (c.match(/^[\t\n\f ]$/)) {
        return beforAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        return tagName;
    } else if (c === '>') {
        // 本标签解析完，开始解析下一个标签
        return data;
    } else {
        return tagName;
    }
}

function beforAttributeName(c) {
    // 先都不做处理
    if (c.match(/^[\t\n\f ]$/)) {
        return beforAttributeName;
    } else if (c === '>') {
        // 没有属性的标签结束
        return data;
    } else if (c === '=') {
        return beforAttributeName;
    } else {
        return beforAttributeName
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        return data;
    } else if (c === 'EOF') {

    } else {

    }
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