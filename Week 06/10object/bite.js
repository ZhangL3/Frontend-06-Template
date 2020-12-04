class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name){
    super(name);
  }

  bite(sth) {
    console.log('sth: ', sth);
    sth.health = false;
  }
}

class Human extends Animal {
  health;

  constructor(name) {
    super(name);
    this.health = true;
  }
}

const dogi = new Dog('dogi');
console.log('dogi: ', dogi);
const man = new Human('man');
console.log('man: ', man);

dogi.bite(man);
