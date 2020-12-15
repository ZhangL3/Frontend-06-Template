function findIndexOfA(str) {
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === 'a' || str[i] === 'A') {
      return i;
    }
  }
  return -1;
}

console.log(findIndexOfA('sfdsdfgsdfgsasafasf'));