import Character from './Character';

export default class Swordsman extends Character {
  constructor(name, type = 'swordsman') {
    super(name, type);
    this.attack = 10;
    this.defence = 40;
  }
}
