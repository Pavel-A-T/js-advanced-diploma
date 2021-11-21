import Character from './Character';

export default class Undead extends Character {
  constructor(level, type = 'undead') {
    super(level, type);
    this.attack = 10;
    this.defence = 40;
  }
}
