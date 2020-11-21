/**
 * * 和 ？ 分开处理
 * @param {string} source 原string
 * @param {string} pattern 被寻找的 substring
 */
function find(source, pattern) {
    // 因为前面的 * 是尽量少匹配，最后一个 * 是尽量多匹配。前边的 * 的匹配段落是 *subStr
    // 要知道哪个是最后一个，得先直到总共有多少个
    let starCount = 0;
    for (let i = 0; i < pattern.length; i += 1) {
        if (pattern[i] === '*') {
            starCount += 1;
        }
    }

    // 如果没有 *，就是逐个匹配
    if (starCount === 0) {
        for (let i = 0; i < pattern.length; i += 1) {
            // 如果既不匹配，也不是 ?, 就返回 false
            if (pattern[i] !== source[i] && [attern[i] !== '?']) {
                return false;
            }
        }
        return;
    }

    
    // 处理第一个 * 之前的段落
    // pattern 的指针
    let i = 0;
    // resource 的指针
    let lastIndex = 0;

    for (i = 0; pattern[i] !== '*'; i++) {
        if(pattern[i] !== source[i] && pattern[i] !== '?') {
            return false;
        }
    }

    lastIndex = i;

    // 处理从 0 到 starCount - 1 段落里的 *subStr 片段
    for (let p = 0; p < starCount - 1; p++) {
        i++;
        // *subStr 中的紧跟*的部分
        let subPattern = '';
        while (pattern[i] !== '*') {
            subPattern += pattern[i];
            i++;
        }

        console.log('subPattern: ', subPattern);

        // 把 ? 替换成 RegExp 处理
        let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
        // 第一个 * 之前的已经处理过了
        reg.lastIndex = lastIndex;

        const regResult = reg.exec(source);

        // console.log('regResult: ', regResult);

        if (!regResult) {
            return false;
        }

        // 把 reg 的指针同步给 source 的 lastIndex 指针
        lastIndex = reg.lastIndex;
    }

    // 尾部匹配
    // 因为尾部的 * 是要找尽量多， 所有从后往前匹配
    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !=='*'; j += 1) {
        if (pattern[pattern.length -j] !== source[source.length - j]
            && pattern[pattern.length - j] !== '?') {
                return false;
            }
    }

    return true;
}

console.log('result: ', find('abcabcabxaac', 'a*b*bx*c'));