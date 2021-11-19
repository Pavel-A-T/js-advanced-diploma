import Character from './Character';

export default class Zombie extends Character {
  constructor(level, type = 'zombie') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
  }
}
