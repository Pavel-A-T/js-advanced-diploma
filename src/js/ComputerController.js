import GameState from "./GameState";

export default class ComputerController {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.board = [];
    this.init();
  }


  init() {
    for (let i = 0; i < 64; i += 1) {
        this.board.push(i);
    }
  }

  attackComputer() {
    const computerTeam = this.getTeam();
    const gamerTeam = this.getGamerTeam();
    const availableCharacters = [];
    for (let element of computerTeam) {
      const step = Math.floor(element.character.attack / 10);
      for (let character of gamerTeam) {
        if (GameState.checkIndex(element.position, step, character.position)) availableCharacters.push({element, character});
      }
    }
    if (availableCharacters.length > 0) {
      const index = Math.floor(Math.random() * availableCharacters.length);
      //attack
      const attacker = availableCharacters[index].element.character;
      const target = availableCharacters[index].character.character;
      const targetIndex = availableCharacters[index].character.position;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      GameState.showDamage(this.gamePlay, target, targetIndex, damage);
      GameState.isStart();
    }
    else {
      //сделать ход
      const index = Math.floor(Math.random() * computerTeam.length);
      const choice = computerTeam[index];
      const move = Math.floor(choice.character.defence / 10);
      const availableBoard = this.board.filter(item => GameState.checkIndex(choice.position, move, item));
      let choiceMoveIndex = Math.floor(Math.random() * availableBoard.length);
      const positions = GameState.positions.map(item => item.position);
      while (positions.findIndex((item) => availableBoard[choiceMoveIndex] === item) > 0) {
        choiceMoveIndex = Math.floor(Math.random() * availableBoard.length);
      }
      choice.position = availableBoard[choiceMoveIndex];
      this.gamePlay.redrawPositions(GameState.positions);
      GameState.isStart();
    }
  }


  getTeam() {
    return GameState.positions.filter(item => GameState.isOpponent(item?.character));
  }

  getGamerTeam() {
    return GameState.positions.filter(item => GameState.isCharacter(item?.character));
  }

}
