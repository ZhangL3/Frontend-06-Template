let currentToken = null;
let currentAttribute = null;

let tack = [{type: 'document', children: []}];

function emit(token) {
    console.log('token: ', JSON.stringify(token, null, 5));

    if (token.type === 'text')
        return;
    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: [],
        };

        element.tagName = token.tagName;

        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p],
                });
            }

            top.children.push(element);
            element.parent = top;

            if(!token.isSelfClosing)
                stack.push(element);
            
            currentTextNode = null;
        }
    } else if(token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error("Tag start end dosen't match");
        } else {
            
        }
    }
}

const EOF = Symbol('EOF'); // EOF: End Of File

/**
 * 状态机的初始化方法，因为 HTML 标准里第 8.2.4 Tokenization 里用 data 来命名，这里也用 data 来命名
 * @param {string} c character
 */
function data(c) {
    // 标签开始，但还不知道是哪种标签
    if (c === '<') {
        return tagOpen;
    } else if ( c === EOF ) {
        emit({
            type: 'EOF',
        });
        return ;
    } else {
        emit({
            type: 'text',
            content: c,
        });
        // console.log('return data in data: ', data);
        return data;
    }
}

/**
 * 解析 < 后的字符
 * @param {string} c character
 */
function tagOpen(c) {
    if (c === '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        // 不是 / 说明是一个开始标签或者是自封闭标签的开始，初始化标签
        currentToken = {
            type: 'startTag',
            tagName: '',
        };
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
        currentToken = {
            type: 'endTag',
            tagName: '',
        };
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
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;//.toLowerCase();
        return tagName;
    } else if (c === '>') {
        emit(currentToken);
        // 本标签解析完，开始解析下一个标签
        return data;
    } else {
        return tagName;
    }
}

/**
 * <html 
 * @param {*} c 
 */
function beforeAttributeName(c) {
    // 先都不做处理
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {

    } else {
        currentAttribute = {
            name: '',
            value: "",
        };
        // console.log('currentAttribute: ', currentAttribute);
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '\u0000') {

    } else if (c === '\"' || c === "'" || c === '<') {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c) {
    if (c.match(/^\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    }  else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: '',
        };
        return attributeName(c);
    }
} 

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeName;
    } else if (c === '\"') {
        return doubleQuotedAttributeValue;
    } else if (c === "\'") {
        return singleQuotedAttributeValue;
    } else if (c === '>') {
        // return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === '\"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data; 
    } else if (c === '\u0000') {

    } else if (c === '\"' || c === "'" || c === '<' || c === '=' || c === '`') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c === 'EOF') {

    } else {

    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    
    // 文本结束时可能没有结束符，所以在这里给定一个结束符。
    // 这里的结束符不能有任何意义，所以用来 Symbol
    state = state(EOF);
}