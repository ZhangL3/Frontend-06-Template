/**
 * str will be converted in form of notation
 * @param {string} str string of number, begin with 0b | 0o | 0d | 0x
 * @param {number} targetNotation 2 | 8 | 10 | 16
 * @return {number}
 */
function StringToNumber(str, targetNotation = 10) {
    if (str[0] !== '0') return NaN;

    const sourceNotation = 
        str[1] === 'b' ? 2 :
        str[1] === 'o' ? 8 :
        str[1] === 'd' ? 10 :
        str[1] === 'x' ? 16 : null;

    if (!sourceNotation) return NaN;

    const sourceDec = parseInt(str.substr(2), sourceNotation);

    if (isNaN(sourceDec)) return NaN;

    // numObj.toString([radix]) 一定是数字对象(numObj)才可以利用 toString() 转进制
    return +sourceDec.toString(targetNotation);
}

/**
 * 
 * @param {number} num number to convert to string
 * @param {number} sourceNotation 2 | 8 | 10 | 16
 * @param {number} targetNotation 2 | 8 | 10 | 16
 * @return {number}
 */
function NumberToString(num, sourceNotation = 10, targetNotation = 10) {

    if (
        sourceNotation !== 2
        && sourceNotation !== 8
        && sourceNotation !== 10
        && sourceNotation !== 16
    ) return NaN;

    const pre = targetNotation === 2 ? '0b' :
        targetNotation === 8 ? '0o' :
        targetNotation === 10 ? '0d' :
        targetNotation === 16 ? '0x' : null;

        console.log('pre: ', pre);

    if (!pre) return NaN;

    return `${pre}${parseInt(num, sourceNotation).toString(targetNotation)}`;
}

console.log('string2Number(1010, 10): ', StringToNumber('0x1010', 10));
console.log('number2String(1010, 8, 16): ', NumberToString(1010, 10, 16));