function match(str) {
  let state = start;
  for (c of str) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    console.log('matched: ', c);
    return foundA;
  }
  else
    return start;
}

function end(c) {
  return end;
}

function foundA() {
  if (c === 'b')
    return foundB;
  else
    // reconsum 不是b可以是a，不然下一轮这个a就错过了，后面的同理
    return start(c);
}

function foundB() {
  if (c === 'c')
    return foundC;
  else
    return start(c);
}

function foundC() {
  if (c === 'd')
    return foundD;
  else
    return start(c);
}

function foundD() {
  if (c === 'e')
    return foundE;
  else
    return star(c);
}

function foundE() {
  if (c === 'f')
    return end;
  else
    return start(c);
}

console.log(match('ababcdefasdf'));
