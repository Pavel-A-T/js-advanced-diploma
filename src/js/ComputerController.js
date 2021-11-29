export default class ComputerController {
  constructor(gamePlay, gameState) {
    this.gamePlay = gamePlay;
    this.gameState = gameState;
    this.board = [];
    this.init();
  }

  init() {
    for (let i = 0; i < 64; i += 1) {
      this.board.push(i);
    }
  }

  async attackComputer() {
    const computerTeam = this.getTeam();
    const gamerTeam = this.getGamerTeam();
    const availableCharacters = [];
    for (const element of computerTeam) {
      const step = Math.floor(element.character.attack / 10);
      for (const character of gamerTeam) {
        if (this.gameState.checkIndex(element.position, step, character.position)) {
          availableCharacters.push({ element, character });
        }
      }
    }
    if (availableCharacters.length > 0) {
      const index = Math.floor(Math.random() * availableCharacters.length);
      // attack
      const attacker = availableCharacters[index].element.character;
      const target = availableCharacters[index].character.character;
      const targetIndex = availableCharacters[index].character.position;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      await this.gameState.showDamage(this.gamePlay, target, targetIndex, damage);
      this.gameState.start = true;
    } else {
      // сделать ход
      const index = Math.floor(Math.random() * computerTeam.length);
      const choice = computerTeam[index];
      const move = Math.floor(choice.character.defence / 10);
      const availableBoard = this.board.filter((item) => this.gameState.checkIndex(choice.position, move, item));
      const positions = this.gameState.positions.map((item) => item.position);
      const availableCells = availableBoard.filter((item) => !positions.includes(item));
      const choiceMoveIndex = Math.floor(Math.random() * availableCells.length);
      choice.position = availableCells[choiceMoveIndex];
      this.gamePlay.redrawPositions(this.gameState.positions);
      this.gameState.start = true;
    }
  }

  getTeam() {
    return this.gameState.positions.filter((item) => this.gameState.isOpponent(item.character));
  }

  getGamerTeam() {
    return this.gameState.positions.filter((item) => this.gameState.isCharacter(item.character));
  }
}
