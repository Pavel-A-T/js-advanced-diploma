import Character from './Character';

export default class Magician extends Character {
  constructor(level, type = 'magician') {
    super(level, type);
    this.attack = 40;
    this.defence = 10;
  }
}
