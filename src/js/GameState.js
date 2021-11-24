export default class GameState {
  static start = true;
  static positions = [];

  static from(object) {
    // TODO: create object
    return JSON.stringify(object);
  }
  static isStart() {
    this.start = !this.start;
    return !this.start;
  }

  static isOpponent(character) {
    const type = character?.type;
    if (type === 'zombie' || type === 'undead' || type ==='daemon' || type === 'vampire') {
      return true;
    }
    return false;
  }

  static isCharacter(character) {
    const type = character?.type;
    if (type === 'bowman' || type === 'magician' || type ==='swordsman') {
      return true;
    }
    return false;
  }

  static checkIndex(currentPosition, step, index) {
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

  static showDamage(gamePlay, target, index, damage) {
  gamePlay.showDamage(index, damage).then(() => {
      target.health -= damage;
      if (target.health <= 0) {
        //this.onCellLeave(index);
        gamePlay.cells[index].title = "";
        const element = GameState.positions.findIndex(item => item === this.getPositionedCharacterByIndex(index));
        GameState.positions.splice(element, 1);
      }
      gamePlay.redrawPositions(GameState.positions);
    });
  }

 static getLine(ind) {
    if (0 <= ind && ind <= 7) return 0;
    if (8 <= ind && ind <= 15) return 1;
    if (16 <= ind && ind <= 23) return 2;
    if (24 <= ind && ind <= 31) return 3;
    if (32 <= ind && ind <= 39) return 4;
    if (40 <= ind && ind <= 47) return 5;
    if (48 <= ind && ind <= 55) return 6;
    if (56 <= ind && ind <= 63) return 7;
    return -1;
  }

  static getPositionedCharacterByIndex(index) {
    return GameState.positions.find(item => item.position === index);
  }
}
