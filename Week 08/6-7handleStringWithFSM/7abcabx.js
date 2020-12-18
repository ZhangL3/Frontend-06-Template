// function match(str) {
//   let state = start;
//   let stepLong = 2;
//   for (let i = 0; i < str.length; i += stepLong) {
//     if (state === start) {
//       state = state(str[i] + str[i + 1]);
//       stepLong = 1;
//     } else {
//       state = state(str[i]);
//     }
//   }
//   return stete === end;
// }

// function start(c) {
//   if (c === 'ab') {
//     return foundAb;
//   }
//   return start;
// }

// function end() {
//   return end;
// }

// function foundAb(c) {
//   if (c === 'b')
//     return foundB;
//   else
//     return start(c);
// }

function match(str) {
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  }
  return start;
}

function end() {
  return end;
}

function foundA(c) {
  if (c === 'b')
    return foundB;
  else
    return start(c);
}

function foundB(c) {
  if (c === 'c')
    return start;
  else if (c === 'x')
    return end;
  else
    return start(c)
}

console.log(match('aabcab'));