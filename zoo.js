//Exercise 1
class Zoo {
  constructor(name) {
      this.name = name
      this.animals = []
  }

  addAnimal(animal) {
    this.animals.push(animal);
  }
 
  speakAll(){
      this.animals.forEach(animal => {
          animal.speak()
      })
  }
}

class Animal {
  constructor(name, sound) {
      this.name = name
      this.sound = sound
  }

  speak(){
      console.log(`I am a ${this.name}, ${this.sound}`);
  }
}

class Tiger extends Animal {
  constructor(name, sound){
      super(name, sound)
  }
}

class Lion extends Animal {
  constructor(name, sound){
      super(name, sound)
  }
}

function main(){
  const zoo = createZoo();
  zoo.speakAll();
}

function createZoo(){
  const zoo = new Zoo("Zoo Challenge")
  console.log(`Welcome to ${zoo.name} `)

  const tiger = new Animal("Tiger", "Tiger roars");
  const lion = new Animal("Lion", "Lion grr grr")
 
  zoo.addAnimal(tiger);
  zoo.addAnimal(lion);

  return zoo;
}

main()