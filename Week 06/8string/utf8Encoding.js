/**
 * Encode string with utf-8
 * @param {string} str string to encode with utf-8
 */
function UTF8_Encoding(str) {
  return parseInt(Buffer.from(str, 'utf-8').toString('hex'), 16).toString(2);
}

/**
 *  WIP
 * @param {number} binary
 */
function UTF8_Decoding(binary) {
  function bin2Hex(bin) {
    return parseInt(bin, 2).toString(16);
  }

  console.log('bin2Hex(binary): ', bin2Hex(binary));

  // b = [];

  // bi = new Array(32).fill(0);

  // const binStr = binary + '';

  // for (let i = 31; i > binStr.length; i -= 1) {
  //   bi[i] = binStr[i - (32 - binStr.length) - 1]
  //   /* if (binStr[i] == 0 || binStr[i] == 1) {
  //     b.unshift(+binStr[i]);
  //   } else {
  //     b.unshift(0);
  //   } */
  // }

  // console.log('bi: ', bi);

  // const hex = [];


  // return Buffer.from(`${binary}`, 'binary').toString(16);
}

console.log(UTF8_Encoding('一'));
console.log(UTF8_Decoding(111001001011101010001100));

const buf = Buffer.from('一', 'utf-8');
console.log('buf: ', buf);
const hex = buf.toString('hex');
console.log('hex: ', hex);

const bin = parseInt(hex, 16).toString(2);
console.log('bin: ', bin);

// const buf1 = Buffer.from('111001001011100010000000', 'binary');
// console.log('buf1.toString(): ', buf1.toString());