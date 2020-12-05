class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name){
    super(name);
  }

  bite() {
    return 'bite';
  }
}

class Human extends Animal {
  damage;

  constructor(name) {
    super(name);
    this.damage = '';
  }

  hurt(damage) {
    this.damage = damage;
  }
}

const dogi = new Dog('dogi');
console.log('dogi: ', dogi);
const man = new Human('man');

man.hurt(dogi.bite());
console.log('man: ', man);

