/**
 * str will be converted in form of notation
 * @param {string} str string of number
 * @param {number} targetNotation 2 | 8 | 10 | 16
 * @return {number}
 */
function string2Number(str, targetNotation) {
    if (str[0] !== '0') return NaN;

    const sourceNotation = 
        str[1] === 'b' ? 2 :
        str[1] === 'o' ? 8 :
        str[1] === 'x' ? 16 : 10;

    console.log('sourceNotation: ', sourceNotation);

    const sourceDec = parseInt(str, sourceNotation);

    if (isNaN(sourceDec)) return NaN;

    console.log('sourceDec: ', sourceDec);

}

/**
 * 
 * @param {number} num number to convert to string
 * @param {number} notation 2 | 8 | 10 | 16
 * @return {number}
 */
function number2String(num, notation) {

}

console.log('string2Number(1010, 10): ', string2Number('0x1010', 10));

// TODO: dec to bin, hex, oct