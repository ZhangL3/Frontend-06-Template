function UTF8_Encoding(string) {
  return parseInt(Buffer.from(string, 'utf-8').toString('hex'), 16).toString(2);
}

/**
 *  WIP
 * @param {number} binary
 */
function UTF8_Decoding(binary) {
  return Buffer.from(`${binary}`, 'binary').toString();
}

console.log(UTF8_Encoding('一二'));
console.log(UTF8_Decoding(111001001011101010001100));

const buf = Buffer.from('一', 'utf-8');
console.log('buf: ', buf);
const hex = buf.toString('hex');
console.log('hex: ', hex);

const bin = parseInt(hex, 16).toString(2);
console.log('bin: ', bin);

// const buf1 = Buffer.from('111001001011100010000000', 'binary');
// console.log('buf1.toString(): ', buf1.toString());