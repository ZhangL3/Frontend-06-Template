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
    // 没有 coputedStyle 的元素就跳过去
    if (!element.computedStyle)
        return ;

    // 对 style 进行预处理
    
    let elementStyle = getStyle(element);
    // toy-browser 还只能处理 flex 布局
    if (elementStyle.display !== 'flex')
        return;
    
    // 过滤出文本节点
    let items = element.children.filter(e => e.type === 'element');

    // 支持 order 属性
    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    // 取出 style
    let style = elementStyle;

    // 对主轴和交叉轴进行处理
    // 没有规定的 width 和 height 都先定义为 null, 方便代码同一判断
    ['width', 'height'].forEach((size) => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    // 设置 flex 必要属性的默认值
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
        mainBase = style.width;

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
        mainEnd = 'top';
        // 从上往下排列，属性 -1
        mainSign = -1;
        mainBase = style.height;

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

    // 如果父元素没有设置主轴属性，则由子元素把父元素撑开，就没有 wrap 了
    let isAutoMainSize = false;
    if (!style[mainSize]) { // auto sizing
        elementStyle[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            // TODO: 确认这里是不是对的
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        // 所有元素都能排进同一行里
        isAutoMainSize = true;
        // style.flexWrap = 'nowrap';
    }

    // 把元素收进行
    // flexLine 是 flex 的一行
    let flexLine = [];
    // 至少要有一行
    let flexLines = [flexLine];

    // 剩余空间等于父元素的主轴尺寸 mainSize
    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;

    // 插入元素进 flexLines
    for (let i = 0; i < items.length; i += 1) {
        let item = items[i];
        let itemStyle = getStyle(item);

        // 没设主轴尺寸，默认值为 0
        if (itemStyle[mainSize] === null) {
            itemsStyle[mainSize] = 0;
        }

        // 如果有 flex 属性，说明这个元素是可伸缩的
        if (itemStyle.flex) {
            // 一定可以加入到 flexLine 里面
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // 如果不转行
            // 剩余空间被减去元素尺寸
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSpace] !== (void 0)) {
                // 如果元素有行高，就取最高的那个值作为行高
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace]);
            }
            flexLine.push(item);
        } else { // 换行的逻辑
            // 如果元素主轴尺寸大过父元素主轴尺寸，就把它压缩的和主轴尺寸一样大
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            // 如果主轴的空间不足以容纳每一个元素了，换行
            if (mainSpace < itemStyle[mainSize]) {
                // 把实际主轴剩余尺寸和交叉剩余尺寸的信息存到当前行上
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                // 创建新的行,把当前元素放进去
                flexLine = [item];
                // 把新行插入行集
                flexLines.push(flexLine);
                // 重置 mainSpace 和 crossSpace
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else { // 如果能放下，把当前元素加到当前行里
                flexLine.push(item);
            }

            // 计算主轴和交叉轴的尺寸
            if (itemsStyle[crossSize] !== null && itemsStyle[crossSpace] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace]);
            }
            // 从剩余空间中剪掉当前元素的大小
            mainSpace -= itemsStyle[mainSize];
        }
    }

    // 最后一行的情况，没有元素了
    flexLine.mainSpace = mainSpace;

    console.log('items: ', items);

}

module.exports = layout;