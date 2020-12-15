function isChar(str, targetChars, currentIndex = 0, matchedCount = 0 ) {
  // 如果成功，是当前轮次前一轮匹配成功(所以要-1)，并且是最后一个匹配(所以要===length)
  if (str[currentIndex - 1] === targetChars[matchedCount - 1] && matchedCount === targetChars.length) return true;
  if (currentIndex > str.length) return false;

  if (str[currentIndex] === targetChars[matchedCount]) {
    return isChar(str, targetChars, currentIndex + 1, matchedCount + 1);
  } else if (str[currentIndex] === targetChars[0]) {
    // 如果不匹配当前的，看看是否匹配第一个，因为下一轮currentIndex又+1了，就没法看当前是不是匹配第一个了
    return isChar(str, targetChars, currentIndex + 1, 1);
  } else {
    return isChar(str, targetChars, currentIndex + 1, 0)
  }
}

console.log(isChar('aabcdefff', 'abcdef'));

function match(str) {
  let foundA = false;
  let foundB = false;
  let foundC = false;
  let foundD = false;
  let foundE = false;

  for (let c of str) {
    if (c === 'a')
      foundA = true;
    else if (foundA && c == 'b')
      foundB = true;
    else if (foundB && c == 'c')
      foundC = true;
    else if (foundC && c == 'd')
      foundD = true;
    else if (foundD && c == 'e')
      foundE = true;
    else if (foundE && c == 'f')
      return true;
    else {
      foundA = false;
      foundB = false;
      foundC = false;
      foundD = false;
      foundE = false;
    }
  }
  return false;
}

console.log(match('aabcdefff', 'abcdef'));