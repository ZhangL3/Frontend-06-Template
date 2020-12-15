function findIndexOfAb(str) {
  let indexAb = -1;
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === 'a') {
      indexAb = i;
    } else {
      if (indexAb > 0 && str[i] === 'b') {
        return indexAb;
      }
      indexAb = -1;
    }
  }
  return indexAb;
}

console.log(findIndexOfAb('asdfdasdfasabsdfasdfas'));