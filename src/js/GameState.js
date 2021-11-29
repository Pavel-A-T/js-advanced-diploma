export default class GameState {
  constructor(level, start = true, cellActive = -1, positions = [],
    timeCounter = 0, score = 0) {
    this._level = level;
    this._start = start;
    this._cellActive = cellActive;
    this._positions = positions;
    this._timeCounter = timeCounter;
    const expression = (sessionStorage.getItem('this.score') && sessionStorage.getItem('this.score').length > 0);
    this._score = expression ? Number(sessionStorage.getItem('this.score')) : score;
  }

  set level(value) {
    this._level = value;
  }

  get level() {
    return this._level;
  }

  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value;
  }

  get start() {
    return this._start;
  }

  set start(value) {
    this._start = value;
  }

  get cellActive() {
    return this._cellActive;
  }

  set cellActive(cell) {
    this._cellActive = cell;
  }

  get positions() {
    return this._positions;
  }

  set positions(positions) {
    this._positions = positions;
  }

  get timeCounter() {
    return this._timeCounter;
  }

  set timeCounter(value) {
    this._timeCounter = value;
  }

  static from(object = this) {
    return JSON.stringify(object);
  }

  isOpponent(character) {
    const type = character ? character.type : null;
    if (type === 'zombie' || type === 'undead' || type === 'daemon' || type === 'vampire') {
      return true;
    }
    return false;
  }

  isCharacter(character) {
    const type = character ? character.type : null;
    if (type === 'bowman' || type === 'magician' || type === 'swordsman') {
      return true;
    }
    return false;
  }

  checkIndex(currentPosition, step, index) {
    const boardSize = 8;
    let line;
    let next = currentPosition - boardSize * step;
    const len = step * 2 + 1;

    for (let i = 0; i < len; i += 1) {
      line = this.getLine(next);
      if (line > -1) {
        let min = next - step;
        let max = next + step;
        min = (min < line * boardSize) ? line * boardSize : min;
        max = (max > (line * boardSize) + 7) ? (line * boardSize + 7) : max;
        if ((min <= index) && (index <= max)) {
          return true;
        }
      }
      next += boardSize;
    }
    return false;
  }

  async showDamage(gamePlay, target, index, damage) {
    const showDamageTarget = target;
    const game = gamePlay;
    await game.showDamage(index, damage);
    showDamageTarget.health -= damage;
    if (showDamageTarget.health <= 0) {
      game.cells[index].title = '';
      const element = this.positions.findIndex((item) => item === this.getPositionedCharacterByIndex(index));
      if (element > -1) this.positions.splice(element, 1);
      game.deselectCell(index);
    }
    game.redrawPositions(this.positions);
  }

  getLine(ind) {
    if (ind >= 0 && ind <= 7) return 0;
    if (ind >= 8 && ind <= 15) return 1;
    if (ind >= 16 && ind <= 23) return 2;
    if (ind >= 24 && ind <= 31) return 3;
    if (ind >= 32 && ind <= 39) return 4;
    if (ind >= 40 && ind <= 47) return 5;
    if (ind >= 48 && ind <= 55) return 6;
    if (ind >= 56 && ind <= 63) return 7;
    return -1;
  }

  getPositionedCharacterByIndex(index) {
    return this.positions.find((item) => item.position === index);
  }
}
