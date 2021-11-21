import Character from './Character';

export default class Daemon extends Character {
  constructor(level, type = 'daemon') {
    super(level, type);
    this.attack = 40;
    this.defence = 10;
  }
}
