function getStyle(element) {
    if (!element.style)
        element.style = {};

    // 把 computedStyle 转换格式，存入 style 属性。
    // 因为 toy-browser 里 style 属性并没有被占用，所以这里可以用 style，但最好换个属性名
    // console.log('---style---')
    for(let prop in element.computedStyle) {
        // console.log('prop: ', prop);
        let p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        // 带 px 的值只保留数字部分
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        // string 数字转为 number
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

function layout(element) {
    if (!element.computedStyle)
        return ;
    
    let elementStyle = getStyle(element);
    // toy-browser 还只能处理 flex 布局
    if (elementStyle.display !== 'flex')
        return;
    
    // 过滤出文本节点
    let items = element.children.filter(e => e.type === 'element');

    // 支持 order 属性
    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    let style = elementStyle;

    ['width', 'height'].forEach((size) => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    if (!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row';
    if (!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch';
    if (!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start';
    if (!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap';
    if (!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch';

    // 用抽象的属性变量，代替直接的属性
    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style.flexDirection === 'row') {
        // 主轴尺寸
        mainSize = 'width';
        // 开始边缘
        mainStart = 'left';
        // 结束边缘
        mainEnd = 'right';
        // 从左往右排列，属性 +1
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        // 主轴尺寸
        mainSize = 'width';
        // 开始边缘
        mainStart = 'right';
        // 结束边缘
        mainEnd = 'left';
        // 从左往右排列，属性 -1
        mainSign = -1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        // 主轴尺寸
        mainSize = 'height';
        // 开始边缘
        mainStart = 'top';
        // 结束边缘
        mainEnd = 'bottom';
        // 从上往下排列，属性 +1
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        // 主轴尺寸
        mainSize = 'height';
        // 开始边缘
        mainStart = 'bottom';
        // 结束边缘
        mainEnd = 'start';
        // 从上往下排列，属性 -1
        mainSign = -1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    // 反向换行
    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        corssEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
}